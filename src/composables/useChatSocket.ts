// composables/useChatSocket.ts
// 通用 WebSocket 聊天 Composable
// 支持多场景复用（scene: 'consult' | 未来扩展）

import { ref, computed, onUnmounted, readonly } from 'vue'
import { useWebSocket }  from '@vueuse/core'
import type { Ref } from 'vue'

// ── 类型定义 ─────────────────────────────────────────────────

export type MessageType   = 'text' | 'image'
export type SenderType    = 'member' | 'worker'
export type SocketScene   = 'consult' | string

export interface ChatMessage {
    id?:          number        // 服务端持久化后有 id
    session_id:   number
    sender_type:  SenderType
    sender_id:    string
    type:         MessageType
    content:      string
    is_read:      0 | 1
    create_time:  number        // Unix 时间戳
    pending?:     boolean       // 本地发送中，未服务端确认
    failed?:      boolean       // 发送失败
}

export interface UseChatSocketOptions {
    sessionId:   number
    scene:       SocketScene
    senderType:  SenderType
    senderId:    string
    expiresAt:   number                         // 会话到期 Unix 时间戳
    wsBaseUrl?:  string                         // 默认读 env
    onExpire?:   () => void                     // 会话到期回调
    onMessage?:  (msg: ChatMessage) => void     // 新消息回调
    onError?:    (e: Event) => void
}

// ── Composable ───────────────────────────────────────────────

export function useChatSocket(options: UseChatSocketOptions) {
    const {
        sessionId,
        scene,
        senderType,
        senderId,
        expiresAt,
        wsBaseUrl = import.meta.env.VITE_WS_URL ?? '',
        onExpire,
        onMessage,
        onError,
    } = options

    // ── 消息列表 ─────────────────────────────────────────────
    const messages   = ref<ChatMessage[]>([])
    const isExpired  = ref(false)
    const isReady    = ref(false)   // 连接就绪 + 身份验证完成

    // ── 倒计时 ───────────────────────────────────────────────
    const secondsLeft    = ref(Math.max(0, expiresAt - Math.floor(Date.now() / 1000)))
    const expiryLabel    = computed(() => {
        if (isExpired.value) return '会话已结束'
        const m = Math.floor(secondsLeft.value / 60)
        const s = secondsLeft.value % 60
        return `剩余 ${m}:${String(s).padStart(2, '0')}`
    })

    let countdownTimer: ReturnType<typeof setInterval> | null = null

    function startCountdown() {
        countdownTimer = setInterval(() => {
            secondsLeft.value = Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
            if (secondsLeft.value <= 0 && !isExpired.value) {
                isExpired.value = true
                clearInterval(countdownTimer!)
                onExpire?.()
                close()
            }
        }, 1000)
    }

    // ── WebSocket 连接 ───────────────────────────────────────
    const wsUrl = `${wsBaseUrl}/chat?session_id=${sessionId}&scene=${scene}`

    const { send: wsSend, close, status } = useWebSocket(wsUrl, {
        autoReconnect: {
            retries:   5,
            delay:     2000,
            onFailed() {
                console.error('[ChatSocket] 重连失败，已停止')
            },
        },
        heartbeat: {
            message:  JSON.stringify({ type: 'ping' }),
            interval: 25000,    // 25秒心跳
            pongTimeout: 5000,
        },
        immediate: true,        // 立即连接

        onConnected() {
            // 发送身份验证包
            wsSend(JSON.stringify({
                type:        'auth',
                sender_type: senderType,
                sender_id:   senderId,
                session_id:  sessionId,
            }))
        },

        onMessage(_, event) {
            try {
                const data = JSON.parse(event.data)

                // pong 心跳响应忽略
                if (data.type === 'pong') return

                // 身份验证通过
                if (data.type === 'auth_ok') {
                    isReady.value = true
                    startCountdown()
                    return
                }

                // 历史消息批量加载（进入时服务端推送）
                if (data.type === 'history') {
                    const history: ChatMessage[] = data.messages ?? []
                    messages.value = history
                    return
                }

                // 新消息（自己或对方发送的）
                if (data.type === 'message') {
                    const msg: ChatMessage = data.message
                    // 如果是自己发的，替换 pending 消息
                    const pendingIdx = messages.value.findIndex(
                        m => m.pending && m.content === msg.content && m.sender_id === msg.sender_id
                    )
                    if (pendingIdx !== -1) {
                        messages.value.splice(pendingIdx, 1, msg)
                    } else {
                        messages.value.push(msg)
                    }
                    onMessage?.(msg)
                    return
                }

                // 消息已读通知
                if (data.type === 'read') {
                    const readIds: number[] = data.ids ?? []
                    messages.value.forEach(m => {
                        if (m.id && readIds.includes(m.id)) m.is_read = 1
                    })
                    return
                }

                // 会话到期（服务端主动推送）
                if (data.type === 'expire') {
                    isExpired.value = true
                    clearInterval(countdownTimer!)
                    onExpire?.()
                    return
                }

            } catch (e) {
                console.warn('[ChatSocket] 消息解析失败:', e)
            }
        },

        onError(_, event) {
            console.error('[ChatSocket] 连接错误:', event)
            onError?.(event)
        },
    })

    // ── 发送消息 ─────────────────────────────────────────────

    function sendMessage(content: string, type: MessageType = 'text'): boolean {
        if (isExpired.value) return false
        if (status.value !== 'OPEN') return false
        if (!content.trim() && type === 'text') return false

        // 本地乐观插入（pending 状态）
        const optimistic: ChatMessage = {
            session_id:  sessionId,
            sender_type: senderType,
            sender_id:   senderId,
            type,
            content,
            is_read:     0,
            create_time: Math.floor(Date.now() / 1000),
            pending:     true,
        }
        messages.value.push(optimistic)

        // 通过 WebSocket 发送
        const ok = wsSend(JSON.stringify({
            type:    'message',
            content,
            msg_type: type,
        }))

        // 发送失败时标记
        if (!ok) {
            optimistic.pending = false
            optimistic.failed  = true
        }

        return ok
    }

    // ── 标记已读 ─────────────────────────────────────────────
    function markRead() {
        if (status.value !== 'OPEN') return
        wsSend(JSON.stringify({ type: 'read', session_id: sessionId }))
    }

    // ── 清理 ─────────────────────────────────────────────────
    onUnmounted(() => {
        clearInterval(countdownTimer!)
        close()
    })

    return {
        messages:    readonly(messages) as Ref<ChatMessage[]>,
        isReady,
        isExpired,
        status,
        secondsLeft,
        expiryLabel,
        sendMessage,
        markRead,
    }
}
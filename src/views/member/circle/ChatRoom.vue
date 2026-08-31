<template>
    <div class="chat-room-page">

        <!-- 顶部导航 -->
        <van-nav-bar fixed placeholder :border="false">
            <template #left>
                <van-icon name="arrow-left" size="20" @click="onBack" />
            </template>
            <template #title>
                <div class="nav-title">
                    <span class="nav-name">{{ peerName }}</span>
                    <!-- 连接状态指示 -->
                    <span class="nav-status" :class="statusClass">{{ statusLabel }}</span>
                </div>
            </template>
            <template #right>
                <!-- 倒计时 -->
                <span class="nav-timer" :class="{ 'nav-timer--warn': secondsLeft < 300 }">
                    {{ expiryLabel }}
                </span>
            </template>
        </van-nav-bar>

        <!-- 会话到期遮罩 -->
        <div v-if="isExpired" class="expire-mask">
            <div class="expire-card">
                <van-icon name="clock-o" size="48" color="#ccc" />
                <p class="expire-title">咨询已结束</p>
                <p class="expire-sub">本次咨询时间已到，感谢使用</p>
                <van-button type="primary" round block @click="router.back()">返回</van-button>
            </div>
        </div>

        <!-- 消息列表 -->
        <div ref="msgListRef" class="msg-list" @scroll="onScroll">

            <!-- 连接中占位 -->
            <div v-if="!isReady" class="connecting-tip">
                <van-loading size="18" />
                <span>连接中...</span>
            </div>

            <!-- 消息气泡 -->
            <template v-for="(msg, idx) in messages" :key="idx">
                <!-- 时间分隔线（每5分钟显示一次）-->
                <div v-if="showTimeDivider(idx)" class="time-divider">
                    {{ formatMsgTime(msg.create_time) }}
                </div>

                <!-- 气泡：对方消息 左侧，自己消息 右侧 -->
                <div
                    class="msg-row"
                    :class="isSelf(msg) ? 'msg-row--self' : 'msg-row--peer'"
                >
                    <!-- 对方头像 -->
                    <van-image
                        v-if="!isSelf(msg)"
                        round width="36" height="36"
                        :src="peerAvatar || defaultAvatar"
                        fit="cover"
                        class="msg-avatar"
                    />

                    <div class="msg-content-wrap">
                        <!-- 文字气泡 -->
                        <div
                            v-if="msg.type === 'text'"
                            class="bubble"
                            :class="{
                                'bubble--self':    isSelf(msg),
                                'bubble--peer':    !isSelf(msg),
                                'bubble--pending': msg.pending,
                                'bubble--failed':  msg.failed,
                            }"
                        >
                            <span class="bubble-text">{{ msg.content }}</span>
                            <!-- 发送状态 -->
                            <span v-if="msg.pending" class="send-status">
                                <van-loading size="10" color="#fff" />
                            </span>
                            <span v-else-if="msg.failed" class="send-status send-status--fail">!</span>
                        </div>

                        <!-- 图片气泡 -->
                        <div
                            v-else-if="msg.type === 'image'"
                            class="bubble bubble--image"
                            :class="isSelf(msg) ? 'bubble--self' : 'bubble--peer'"
                            @click="previewImage(msg.content)"
                        >
                            <van-image
                                :src="msg.content"
                                fit="cover"
                                width="160"
                                height="160"
                                radius="8"
                                lazy-load
                            />
                        </div>
                    </div>

                    <!-- 自己头像 -->
                    <van-image
                        v-if="isSelf(msg)"
                        round width="36" height="36"
                        :src="selfAvatar || defaultAvatar"
                        fit="cover"
                        class="msg-avatar"
                    />
                </div>
            </template>

            <!-- 底部占位（用于自动滚动）-->
            <div ref="msgBottomRef" style="height: 1px" />
        </div>

        <!-- 底部输入栏 -->
        <div class="input-bar" :class="{ 'input-bar--disabled': isExpired }">
            <!-- 图片发送按钮 -->
            <div class="input-bar-extra" @click="triggerImagePick">
                <van-icon name="photograph" size="24" color="#666" />
            </div>

            <!-- 文字输入框 -->
            <van-field
                v-model="inputText"
                :disabled="isExpired"
                placeholder="输入消息..."
                class="input-field"
                :border="false"
                @keyup.enter="onSendText"
                @focus="scrollToBottom"
            />

            <!-- 发送按钮 -->
            <van-button
                type="primary"
                size="small"
                round
                :disabled="!inputText.trim() || isExpired"
                class="send-btn"
                @click="onSendText"
            >
                发送
            </van-button>
        </div>

        <!-- 隐藏图片选择 input（复用 ImageUploader 逻辑）-->
        <input
            ref="imagePickRef"
            type="file"
            accept="image/*"
            style="display:none"
            @change="onImagePick"
        />

        <!-- 图片上传中 toast -->
        <van-overlay :show="imageUploading" class="upload-overlay">
            <div class="upload-overlay-inner">
                <van-loading color="#fff" size="32" />
                <span>图片发送中...</span>
            </div>
        </van-overlay>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import { useChatSocket } from '@/composables/useChatSocket'
import { useGlobalStore } from '@/store/global'
import { useCircleStore } from '@/store/circle'
import axios from '@/utils/axios'
import Compressor from 'compressorjs'
import moment from 'moment'

const route       = useRoute()
const router      = useRouter()
const globalStore = useGlobalStore()
const circleStore = useCircleStore()

const sessionId = Number(route.params.session_id)
const defaultAvatar = '@@/images/default_avatar.png'

// ── 会话信息 ──────────────────────────────────────────────────

const sessionInfo = ref<{
    expires_at:  number
    peer_name:   string
    peer_avatar: string
    self_avatar: string
    member_id:   string
    worker_id:   number
} | null>(null)

const peerName   = computed(() => sessionInfo.value?.peer_name   ?? '咨询中')
const peerAvatar = computed(() => sessionInfo.value?.peer_avatar ?? '')
const selfAvatar = computed(() => sessionInfo.value?.self_avatar ?? '')

async function fetchSessionInfo() {
    try {
        const res = await axios.get('circle/chat/session', {
            params: { session_id: sessionId },
            toast: 0,
        })
        sessionInfo.value = res.session
    } catch {
        showToast('会话加载失败')
        router.back()
    }
}

// ── 当前用户身份 ──────────────────────────────────────────────

const senderType = computed(() =>
    globalStore.userRole === 'worker' ? 'worker' : 'member'
) as unknown as 'member' | 'worker'

const senderId = computed(() =>
    globalStore.userRole === 'worker'
        ? String((globalStore as any).userInfo?.id ?? '')
        : String((globalStore as any).userInfo?.card_number ?? '')
)

// ── WebSocket ─────────────────────────────────────────────────

const chatSocket = ref<ReturnType<typeof useChatSocket> | null>(null)

function initSocket() {
    if (!sessionInfo.value) return
    chatSocket.value = useChatSocket({
        sessionId,
        scene:      'consult',
        senderType: senderType.value as any,
        senderId:   senderId.value,
        expiresAt:  sessionInfo.value.expires_at,
        onExpire() {
            showToast({ message: '咨询时间已到', duration: 3000 })
        },
        onMessage() {
            // 新消息到达，滚动到底部
            scrollToBottom()
            // 标记已读
            chatSocket.value?.markRead()
        },
    })
}

// ── 状态标识 ──────────────────────────────────────────────────

const { isReady, isExpired, status, secondsLeft, expiryLabel, messages, sendMessage, markRead } =
    computed(() => chatSocket.value ?? {
        isReady:     ref(false),
        isExpired:   ref(false),
        status:      ref('CLOSED'),
        secondsLeft: ref(0),
        expiryLabel: ref(''),
        messages:    ref([]),
        sendMessage: () => false,
        markRead:    () => {},
    }).value

const statusClass = computed(() => ({
    'status--open':       status.value === 'OPEN',
    'status--connecting': status.value === 'CONNECTING',
    'status--closed':     status.value === 'CLOSED',
}))

const statusLabel = computed(() => {
    const map: Record<string, string> = {
        OPEN:        '已连接',
        CONNECTING:  '连接中',
        CLOSED:      '已断开',
    }
    return map[status.value as string] ?? ''
})

// ── 消息判断 ─────────────────────────────────────────────────

function isSelf(msg: any): boolean {
    return msg.sender_type === senderType.value && msg.sender_id === senderId.value
}

// ── 时间分隔线（每5分钟显示一次）────────────────────────────

function showTimeDivider(idx: number): boolean {
    if (idx === 0) return true
    const curr = (messages as any).value[idx]
    const prev = (messages as any).value[idx - 1]
    return curr.create_time - prev.create_time > 300
}

function formatMsgTime(ts: number): string {
    return moment.unix(ts).format('HH:mm')
}

// ── 滚动控制 ─────────────────────────────────────────────────

const msgListRef   = ref<HTMLElement | null>(null)
const msgBottomRef = ref<HTMLElement | null>(null)
let autoScroll = true

function scrollToBottom(force = false) {
    if (!autoScroll && !force) return
    nextTick(() => {
        msgBottomRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
}

function onScroll() {
    if (!msgListRef.value) return
    const { scrollTop, scrollHeight, clientHeight } = msgListRef.value
    // 距底部 80px 以内视为"在底部"
    autoScroll = scrollHeight - scrollTop - clientHeight < 80
}

// ── 发送文字 ─────────────────────────────────────────────────

const inputText = ref('')

function onSendText() {
    const text = inputText.value.trim()
    if (!text || isExpired.value) return
    const ok = sendMessage(text, 'text')
    if (ok) {
        inputText.value = ''
        scrollToBottom(true)
    } else {
        showToast('发送失败，请检查网络')
    }
}

// ── 发送图片 ─────────────────────────────────────────────────

const imagePickRef    = ref<HTMLInputElement | null>(null)
const imageUploading  = ref(false)

function triggerImagePick() {
    if (isExpired.value) return
    imagePickRef.value?.click()
}

async function onImagePick(e: Event) {
    const input = e.target as HTMLInputElement
    const file  = input.files?.[0]
    if (!file) return
    input.value = ''

    imageUploading.value = true
    try {
        // 压缩
        const compressed = await compressImage(file)
        // 上传
        const formData = new FormData()
        formData.append('file', compressed)
        const res = await axios.post('circle/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            toast: 0,
        })
        const url = res.url as string
        if (!url) throw new Error('上传失败')
        // 发送图片消息
        const ok = sendMessage(url, 'image')
        if (ok) scrollToBottom(true)
        else showToast('图片发送失败')
    } catch {
        showToast('图片上传失败')
    } finally {
        imageUploading.value = false
    }
}

function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
        if (file.size <= 1024 * 1024) { resolve(file); return }
        new Compressor(file, {
            quality:   0.6,
            maxWidth:  1280,
            maxHeight: 1280,
            success:   result => resolve(result as File),
            error:     ()     => resolve(file),
        })
    })
}

// ── 图片预览 ─────────────────────────────────────────────────

function previewImage(url: string) {
    showImagePreview([url])
}

// ── 返回确认 ─────────────────────────────────────────────────

function onBack() {
    router.back()
}

// ── 监听消息变化，自动滚底 ───────────────────────────────────

watch(
    () => (messages as any).value?.length,
    () => scrollToBottom(),
)

// ── 初始化 ───────────────────────────────────────────────────

onMounted(async () => {
    await fetchSessionInfo()
    initSocket()
    // 键盘弹起时滚到底部（移动端适配）
    window.addEventListener('resize', () => scrollToBottom(true))
})
</script>

<style scoped lang="scss">
.chat-room-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f0f0f0;
    overflow: hidden;
}

// ── 顶部导航 ─────────────────────────────────────────────────
.nav-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .nav-name {
        font-size: 15px;
        font-weight: 700;
        color: #1a1a1a;
    }

    .nav-status {
        font-size: 11px;

        &.status--open        { color: #67c23a; }
        &.status--connecting  { color: #e6a23c; }
        &.status--closed      { color: #f56c6c; }
    }
}

.nav-timer {
    font-size: 12px;
    color: #666;
    font-weight: 500;

    &--warn { color: #f56c6c; font-weight: 700; }
}

// ── 到期遮罩 ─────────────────────────────────────────────────
.expire-mask {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;

    .expire-card {
        background: #fff;
        border-radius: 16px;
        padding: 32px 24px;
        text-align: center;
        width: 100%;

        .expire-title {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin: 16px 0 8px;
        }

        .expire-sub {
            font-size: 14px;
            color: #999;
            margin: 0 0 24px;
        }
    }
}

// ── 消息列表 ─────────────────────────────────────────────────
.msg-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px 12px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;

    // 平滑滚动
    scroll-behavior: smooth;

    // 隐藏滚动条（移动端）
    &::-webkit-scrollbar { display: none; }
}

.connecting-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 0;
    font-size: 13px;
    color: #bbb;
}

// ── 时间分隔线 ───────────────────────────────────────────────
.time-divider {
    text-align: center;
    font-size: 12px;
    color: #bbb;
    margin: 8px 0;
    background: rgba(0,0,0,0.05);
    display: inline-block;
    align-self: center;
    padding: 2px 10px;
    border-radius: 10px;
}

// ── 消息行 ───────────────────────────────────────────────────
.msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 8px;
    max-width: 100%;

    &--peer { justify-content: flex-start; }
    &--self { justify-content: flex-end; }

    .msg-avatar { flex-shrink: 0; }
    .msg-content-wrap { max-width: 68%; }
}

// ── 气泡 ─────────────────────────────────────────────────────
.bubble {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.6;
    word-break: break-all;
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 6px;

    &--peer {
        background: #fff;
        color: #222;
        border-bottom-left-radius: 4px;
    }

    &--self {
        background: #764ba2;
        color: #fff;
        border-bottom-right-radius: 4px;
    }

    &--pending { opacity: 0.7; }

    &--failed {
        background: #fef0f0;
        color: #f56c6c;
        border: 1px solid #fbc4c4;
    }

    &--image {
        padding: 4px;
        background: transparent !important;
        border-radius: 10px;
    }

    .bubble-text { flex: 1; }

    .send-status {
        flex-shrink: 0;
        font-size: 11px;
        opacity: 0.8;

        &--fail {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #f56c6c;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }
    }
}

// ── 底部输入栏 ───────────────────────────────────────────────
.input-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;

    &--disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    .input-bar-extra {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .input-field {
        flex: 1;
        background: #f5f5f5;
        border-radius: 20px;
        padding: 0 14px;
        font-size: 15px;

        :deep(.van-field__body) { min-height: 36px; }
        :deep(.van-field__control) { line-height: 36px; }
    }

    .send-btn {
        flex-shrink: 0;
        background: #764ba2;
        border-color: #764ba2;
        font-weight: 600;
        padding: 0 16px;
        height: 34px;
    }
}

// ── 上传遮罩 ─────────────────────────────────────────────────
.upload-overlay {
    display: flex;
    align-items: center;
    justify-content: center;

    .upload-overlay-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #fff;
        font-size: 14px;
    }
}
</style>
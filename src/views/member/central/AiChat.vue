<template>
    <div class="aichat-page">

        <!-- 消息列表 -->
        <ChatMessagesTemplate
            ref="chatRef"
            :messages="messages"
            :user-avatar="userAvatar"
            :ai-avatar="aiAvatar"
        />

        <!-- 图片预览区（待发送）-->
        <div v-if="pendingImages.length > 0" class="pending-images">
            <div v-for="(img, idx) in pendingImages" :key="idx" class="pending-img-wrap">
                <img :src="img" class="pending-img" />
                <div class="pending-img-del" @click="removePendingImage(idx)">
                    <van-icon name="cross" size="11" color="#fff" />
                </div>
            </div>
        </div>

        <!-- 输入栏 -->
        <div class="chat-bar">
            <!-- 图片上传按钮 -->
            <van-uploader
                :after-read="handleImageUpload"
                multiple
                :max-count="4"
                accept="image/*"
                :disabled="!finished || isSending"
            >
                <div
                    class="bar-btn"
                    :class="pendingImages.length > 0 ? 'bar-btn--active' : ''"
                >
                    <van-icon name="photograph" size="22" />
                    <span v-if="pendingImages.length > 0" class="img-count-badge">{{ pendingImages.length }}</span>
                </div>
            </van-uploader>

            <!-- 文字输入 -->
            <div class="bar-input-wrap">
                <input
                    v-model="input"
                    ref="inputRef"
                    type="text"
                    :placeholder="pendingImages.length > 0 ? '描述一下图片内容...' : '请输入你想咨询的问题...'"
                    :disabled="!finished || isSending"
                    @keydown.enter="sendMessage"
                    class="bar-input"
                />
            </div>

            <!-- 发送按钮 -->
            <div
                class="bar-send"
                :class="canSend ? 'bar-send--active' : ''"
                @click="sendMessage"
            >
                <van-icon name="guide-o" size="20" :color="canSend ? '#fff' : '#ccc'" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import axios from '@/utils/axios'
import { useGlobalStore } from '@/store/global'
import ChatMessagesTemplate from '@/components/common/ChatMessages.vue'
import user_avatar from '@@/images/avatar.png'
import ai_avatar   from '@@/images/logo1.webp'

const globalStore = useGlobalStore()

const userAvatar = globalStore.memberInfo.avatar
    ? (globalStore.uploadsPath + (globalStore.memberInfo as any).avatar)
    : user_avatar
const aiAvatar = ai_avatar

// ── 百炼配置 ─────────────────────────────────────────────────
const API_KEY  = 'sk-90ddc648bde241fabb8505396c9e9a80'
const APP_ID   = 'd71578eb6e0c4659a5fe2a5f33ce6ceb'
const BASE_URL = `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`

// ── 消息列表 ─────────────────────────────────────────────────
const messages = reactive<any[]>([
    {
        role: 'system',
        content: `
            <h1>欢迎来到"妈妈智问"</h1>
            <p>您好！我是"一凡妈妈"的AI健康顾问。我专注于为您提供产后康复、哺乳喂养、育婴以及女性健康方面的专业建议。</p>
            <p><strong>在这里，您可以获得：</strong></p>
            <ul>
                <li>- 针对产后康复、哺乳喂养和育婴及女性健康等方面的科学支持与指导。</li>
                <li>- 根据您的具体情况，提供个性化和实用的建议。</li>
                <li>- 情感上的支持，尤其是在您遇到焦虑或困惑时。</li>
            </ul>
            <p><strong>温馨提示：</strong>我的回答仅供参考，不能替代专业医疗意见。若涉及治疗、用药，请联系<strong>您的专属康复师</strong>或前往<mark>专业医疗机构</mark>咨询。</p>
        `
    }
])

// ── 状态 ─────────────────────────────────────────────────────
const input       = ref('')
const isSending   = ref(false)
const finished    = ref(true)
const sessionId   = ref('')
const chatRef     = ref<any>(null)
const inputRef    = ref<HTMLInputElement | null>(null)
const memberBackgroundInfo = ref('')

// ── 待发送图片 ───────────────────────────────────────────────
const pendingImages   = ref<string[]>([])   // 已上传到服务器的 URL
const uploadingCount  = ref(0)

const canSend = computed(() =>
    (input.value.trim().length > 0 || pendingImages.value.length > 0)
    && finished.value
    && !isSending.value
    && uploadingCount.value === 0
)

// ── 图片上传 ─────────────────────────────────────────────────
async function handleImageUpload(file: any) {
    const files = Array.isArray(file) ? file : [file]

    for (const f of files) {
        if (!f.file || !(f.file instanceof Blob)) continue
        if (pendingImages.value.length >= 4) { showToast('最多上传 4 张图片'); break }

        uploadingCount.value++
        try {
            const base64 = await fileToBase64(f.file as File)
            const res    = await axios.post(
                'common/uploads_base64',
                { base64_image: base64 },
                { params: { path: 'member/aichat' }, toast: 0 }
            )
            const url = typeof res.data === 'string'
                ? res.data
                : (res.data as any)?.url as string
            if (url) pendingImages.value.push(globalStore.uploadsPath + url)
            else showToast('上传失败')
        } catch {
            showToast('图片上传失败')
        } finally {
            uploadingCount.value--
        }
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload  = (e: any) => {
            const img = new Image()
            img.onerror = reject
            img.onload  = () => {
                const canvas = document.createElement('canvas')
                const ctx    = canvas.getContext('2d')!
                const max    = 1920
                let { width, height } = img
                if (width > height) {
                    if (width > max) { height = Math.round(height * max / width); width = max }
                } else {
                    if (height > max) { width = Math.round(width * max / height); height = max }
                }
                canvas.width = width; canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.85))
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    })
}

function removePendingImage(idx: number) {
    pendingImages.value.splice(idx, 1)
}

// ── 发送消息 ─────────────────────────────────────────────────
const sendMessage = async () => {
    if (!canSend.value) return

    isSending.value = true

    const userText   = input.value.trim()
    const userImages = [...pendingImages.value]

    // 添加用户消息
    messages.push({
        role:    'user',
        content: userText,
        images:  userImages,
        avatar:  userAvatar,
    })

    input.value          = ''
    pendingImages.value  = []

    // 添加 AI 占位消息
    const replyMsg = { role: 'assistant', content: '', typing: true }
    messages.push(replyMsg)
    const msgIdx = messages.length - 1

    finished.value = false
    chatRef.value?.scrollToBottom()

    try {
        // 构造 prompt
        const promptText = memberBackgroundInfo.value
            ? `[用户背景信息]：${memberBackgroundInfo.value}\n\n[用户提问]：${userText}`
            : userText || '（用户上传了图片，请描述图片内容并给出健康建议）'

        // 构造请求体，如有图片则加入 images 字段
        const requestBody: Record<string, any> = {
            input: {
                prompt: promptText,
                ...(sessionId.value ? { session_id: sessionId.value } : {}),
                ...(userImages.length > 0 ? { images: userImages } : {}),
            },
            parameters: { incremental_output: true },
            debug: {},
        }

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type':    'application/json',
                'Authorization':   `Bearer ${API_KEY}`,
                'X-DashScope-SSE': 'enable',
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

        const reader  = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer    = ''
        replyMsg.typing = false

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || trimmed.startsWith(':')) continue
                if (!trimmed.startsWith('data:')) continue

                const jsonStr = trimmed.slice(5).trim()
                if (jsonStr === '[DONE]') { finished.value = true; continue }

                try {
                    const parsed = JSON.parse(jsonStr)
                    if (parsed?.output?.session_id) sessionId.value = parsed.output.session_id
                    const chunk: string = parsed?.output?.text ?? ''
                    if (chunk) {
                        replyMsg.content += formatReply(chunk)
                        messages.splice(msgIdx, 1, { ...replyMsg })
                        chatRef.value?.scrollToBottom()
                    }
                    if (parsed?.output?.finish_reason === 'stop') finished.value = true
                } catch {}
            }
        }

        if (!finished.value) finished.value = true

    } catch (err) {
        replyMsg.typing  = false
        replyMsg.content = '<p style="color:#e05c8a;">抱歉，暂时无法处理您的请求，请稍后再试。</p>'
        messages.splice(msgIdx, 1, { ...replyMsg })
        finished.value = true
    } finally {
        isSending.value = false
        inputRef.value?.focus()
    }
}

// ── 格式化 AI 回复 ────────────────────────────────────────────
function formatReply(text: string): string {
    let t = text
    t = t.replace(/###\s*(.+)/g, '<h3>$1</h3>')
    t = t.replace(/##\s*(.+)/g,  '<h2>$1</h2>')
    t = t.replace(/#\s*(.+)/g,   '<h1>$1</h1>')
    t = t.replace(/(?:^|\n)-\s+(.*?)(?=\n|$)/g, '<li>$1</li>')
    t = t.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    t = t.replace(/__(.+?)__/g,      '<mark>$1</mark>')
    return t
}

// ── 保存聊天记录 ─────────────────────────────────────────────
watch(() => finished.value, async (nval) => {
    if (!nval || !(globalStore.memberInfo as any)?.card_number) return
    const lastUser = messages.filter(m => m.role === 'user').pop()
    const lastAI   = messages.filter(m => m.role === 'assistant').pop()
    const cardNumber = (globalStore.memberInfo as any).card_number
    if (lastUser) {
        await axios.post('/member/record_chat', { card_number: cardNumber, role: 'user', content: lastUser.content }, { toast: 0 })
    }
    if (lastAI) {
        await axios.post('/member/record_chat', { card_number: cardNumber, role: 'assistant', content: lastAI.content }, { toast: 0 })
    }
})

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    try {
        await axios.get('/index/config', { toast: 0 })
        const cardNumber = (globalStore.memberInfo as any)?.card_number
        if (cardNumber) {
            const res = await axios.get('/member/background_info', { card_number: cardNumber }, { toast: 0 })
            memberBackgroundInfo.value = res?.data ?? ''
        }
    } catch {}
})
</script>

<style scoped>
.aichat-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f7f4fc;
}

/* ── 待发送图片预览 ───────────────────────────────────────── */
.pending-images {
    display: flex;
    gap: 8px;
    padding: 8px 14px;
    background: #fff;
    border-top: 1px solid #f0e8ff;
    overflow-x: auto;
    flex-shrink: 0;
}
.pending-images::-webkit-scrollbar { display: none; }

.pending-img-wrap {
    position: relative;
    flex-shrink: 0;
}
.pending-img {
    width: 64px; height: 64px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid #e8dcf8;
}
.pending-img-del {
    position: absolute;
    top: -5px; right: -5px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    z-index: 1;
}

/* ── 输入栏 ──────────────────────────────────────────────── */
.chat-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid #f0e8ff;
    flex-shrink: 0;
}

/* 图片按钮 */
.bar-btn {
    position: relative;
    width: 40px; height: 40px;
    border-radius: 12px;
    background: #f5f0fc;
    color: #a78bcd;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    transition: background 0.15s;
}
.bar-btn--active {
    background: #e8dcf8;
    color: #7c5cbf;
}
.bar-btn :deep(.van-uploader),
.bar-btn :deep(.van-uploader__wrapper),
.bar-btn :deep(.van-uploader__input-wrapper) {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
}

.img-count-badge {
    position: absolute;
    top: -4px; right: -4px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #7c5cbf;
    color: #fff;
    font-size: 10px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
}

/* 文字输入 */
.bar-input-wrap {
    flex: 1;
    background: #f5f0fc;
    border-radius: 20px;
    padding: 0 14px;
}
.bar-input {
    width: 100%;
    height: 40px;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #2d2d3a;
    outline: none;
}
.bar-input::placeholder { color: #c4b8d8; }
.bar-input:disabled { opacity: 0.5; }

/* 发送按钮 */
.bar-send {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: #e0d0f0;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    cursor: not-allowed;
    transition: all 0.2s;
}
.bar-send--active {
    background: linear-gradient(135deg, #7c5cbf, #e05c8a);
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(124,92,191,0.35);
}
.bar-send--active:active { transform: scale(0.93); }
</style>
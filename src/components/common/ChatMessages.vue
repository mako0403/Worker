<template>
    <div class="chat-messages" ref="scrollRef">

        <div v-for="(message, index) in messages" :key="index">

            <!-- 系统欢迎消息 -->
            <div v-if="message.role === 'system'" class="system-card">
                <div class="system-card-inner">
                    <div class="system-logo-row">
                        <img :src="aiAvatar" class="system-logo" />
                        <div class="system-title-col">
                            <div class="system-name">妈妈智问</div>
                            <div class="system-sub">AI 健康顾问</div>
                        </div>
                    </div>
                    <div class="system-body" v-html="message.content" />
                </div>
            </div>

            <!-- 用户消息 -->
            <div v-else-if="message.role === 'user'" class="msg-row msg-row--user">
                <div class="msg-bubble msg-bubble--user">
                    <!-- 图片预览 -->
                    <div v-if="message.images && message.images.length > 0" class="bubble-images">
                        <img
                            v-for="(img, i) in message.images" :key="i"
                            :src="img" class="bubble-image"
                            @click="previewImage(message.images, i)"
                        />
                    </div>
                    <div v-if="message.content" v-html="message.content" />
                </div>
                <img :src="message.avatar || userAvatar" class="msg-avatar" />
            </div>

            <!-- AI 消息 -->
            <div v-else-if="message.role === 'assistant'" class="msg-row msg-row--ai">
                <img :src="aiAvatar" class="msg-avatar msg-avatar--ai" />
                <div class="msg-bubble msg-bubble--ai">
                    <div v-html="message.content" />
                    <!-- 打字中动画 -->
                    <span v-if="message.typing" class="typing-dots">
                        <span /><span /><span />
                    </span>
                </div>
            </div>

        </div>

        <!-- 底部锚点 -->
        <div ref="bottomRef" style="height:1px;" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { showImagePreview } from 'vant'

const props = defineProps<{
    messages: any[]
    userAvatar: string
    aiAvatar: string
}>()

const scrollRef = ref<HTMLElement | null>(null)
const bottomRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
    nextTick(() => bottomRef.value?.scrollIntoView({ behavior: 'smooth' }))
}

function previewImage(images: string[], idx: number) {
    showImagePreview({ images, startPosition: idx })
}

// 消息变化时自动滚到底部
watch(() => props.messages.length, scrollToBottom)
watch(() => props.messages[props.messages.length - 1]?.content, scrollToBottom)

defineExpose({ scrollToBottom })
</script>

<style scoped>
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { display: none; }

/* ── 系统欢迎卡片 ─────────────────────────────────────────── */
.system-card {
    padding: 4px 0 8px;
}
.system-card-inner {
    background: #fff;
    border-radius: 20px;
    padding: 16px;
    border: 1px solid #f0e8ff;
}
.system-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f0fc;
}
.system-logo {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 2px solid #f0e8ff;
}
.system-name {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
}
.system-sub {
    font-size: 11px;
    color: #a78bcd;
    margin-top: 1px;
}
.system-body {
    font-size: 13px;
    color: #555;
    line-height: 1.8;
}
.system-body :deep(h1) { font-size: 14px; font-weight: 700; margin: 8px 0 4px; color: #1a1a2e; }
.system-body :deep(ul) { padding-left: 4px; }
.system-body :deep(li) { margin: 3px 0; }
.system-body :deep(strong) { color: #7c5cbf; }
.system-body :deep(mark) { background: #f0e8ff; color: #7c5cbf; padding: 0 3px; border-radius: 3px; }

/* ── 消息行 ─────────────────────────────────────────────────── */
.msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}
.msg-row--user { justify-content: flex-end; }
.msg-row--ai   { justify-content: flex-start; }

/* ── 头像 ───────────────────────────────────────────────────── */
.msg-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.msg-avatar--ai {
    border-color: #f0e8ff;
}

/* ── 气泡 ───────────────────────────────────────────────────── */
.msg-bubble {
    max-width: 72%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.7;
    word-break: break-all;
}

.msg-bubble--user {
    background: linear-gradient(135deg, #7c5cbf, #9b7de0);
    color: #fff;
    border-bottom-right-radius: 4px;
}

.msg-bubble--ai {
    background: #fff;
    color: #2d2d3a;
    border-bottom-left-radius: 4px;
    border: 1px solid #f0e8ff;
    box-shadow: 0 2px 8px rgba(124,92,191,0.06);
}

/* AI 气泡内的排版 */
.msg-bubble--ai :deep(h1) { font-size: 15px; font-weight: 700; margin: 8px 0 4px; color: #1a1a2e; }
.msg-bubble--ai :deep(h2) { font-size: 14px; font-weight: 700; margin: 6px 0 3px; color: #1a1a2e; }
.msg-bubble--ai :deep(h3) { font-size: 13px; font-weight: 700; margin: 4px 0 2px; color: #1a1a2e; }
.msg-bubble--ai :deep(ul) { padding-left: 16px; margin: 4px 0; }
.msg-bubble--ai :deep(li) { margin: 2px 0; }
.msg-bubble--ai :deep(strong) { color: #7c5cbf; }
.msg-bubble--ai :deep(mark) { background: #f0e8ff; color: #7c5cbf; padding: 0 3px; border-radius: 3px; }
.msg-bubble--ai :deep(a) { color: #7c5cbf; }

/* 图片气泡 */
.bubble-images {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 6px;
}
.bubble-image {
    width: 80px; height: 80px;
    border-radius: 10px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.3);
}

/* ── 打字动画 ───────────────────────────────────────────────── */
.typing-dots {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-left: 2px;
    vertical-align: middle;
}
.typing-dots span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #c4b8d8;
    animation: typing-bounce 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%            { transform: translateY(-5px); opacity: 1; }
}
</style>
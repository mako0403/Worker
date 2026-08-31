<template>
    <div class="h-full">
        <div class="chat-container">
            <!-- 消息显示区 -->
            <ChatMessagesTemplate :messages="messages" :user-avatar="userAvatar" :ai-avatar="aiAvatar" />
            <!-- 输入区 -->
            <div>
                <div class="chat-input">
                    <input
                        v-model="input"
                        ref="inputField"
                        type="text"
                        placeholder="请输入你想咨询的问题..."
                        @keydown.enter="sendMessage"
                        :disabled="!finished || isSending"
                    />
                    <button
                        @click="sendMessage"
                        class="border-circle p-0 pt-1"
                        style="height: 38px; width: 38px;"
                        :class="{'bg-gray-300':!finished || isSending}"
                        :disabled="!finished || isSending"
                    >
                        <el-icon size="large"><Promotion /></el-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import ChatMessagesTemplate from "@/components/common/ChatMessages.vue";

import user_avatar from '@@/images/avatar.png';
import ai_avatar from '@@/images/logo1.webp';

const globalStore = useGlobalStore();

// 用户和AI头像
const userAvatar = globalStore.workerConfig.headimg
    ? globalStore.uploadsPath + globalStore.workerConfig.headimg
    : user_avatar;
const aiAvatar = ai_avatar;

// ─── 百炼应用配置 ────────────────────────────────────────────────
const API_KEY  = "sk-90ddc648bde241fabb8505396c9e9a80"; // 替换为你的 API Key
const APP_ID   = "d71578eb6e0c4659a5fe2a5f33ce6ceb";    // 替换为你的应用 ID
const BASE_URL = `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`;
// ────────────────────────────────────────────────────────────────

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        const chatMessages = document.querySelector(".chat-messages");
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
};

// 消息列表（仅用于界面渲染，上下文由百炼 session_id 管理）
const messages = reactive<Array<{ role: string; content: string }>>([
    {
        role: "system",
        content: `
            <h1>你好，${globalStore.workerConfig.job_title}${globalStore.workerConfig.place}${globalStore.workerConfig.fullname}</h1>
            <p>嗨！我是"一凡妈妈AI助手"，致力于支持康复师的日常工作需求，我会基于产后康复、哺乳喂养、育婴技巧和女性健康的专业知识帮助你提升工作及服务质量。</p>
            <p><strong>在这里，您可以获得：</strong></p>
            <ul>
                <li>- 针对顾客档案资料的分析</li>
                <li>- 提供与客户沟通技巧的建议</li>
                <li>- 专业知识查询、案例分析及服务建议优化</li>
            </ul>
        `
    }
]);

const input     = ref("");
const isSending = ref(false);
const finished  = ref(true);

/**
 * 百炼多轮对话 session_id。
 * 首次为空，之后每轮响应会返回并存储，下一轮请求时带上即可保持上下文。
 */
const sessionId = ref<string>('');

// ─── 核心发送函数 ─────────────────────────────────────────────────
const sendMessage = async () => {
    if (!input.value.trim() || isSending.value || !finished.value) return;

    isSending.value = true;

    // 1. 添加用户消息到界面
    messages.push({ role: "user", content: input.value });
    const userInput = input.value;
    input.value = "";

    // 2. 添加 AI 占位消息（loading gif）
    const replyMessage = { role: "assistant", content: `<img src="/images/03-42-11-849_512.webp" width="35px">` };
    messages.push(replyMessage);
    const msgIndex = messages.indexOf(replyMessage);

    finished.value = false;
    scrollToBottom();

    try {
        // 3. 查询会员数据（含患者关键字时）
        const memberContext = await parseInput(userInput);
        console.log("会员上下文数据:", memberContext);

        // 4. 构造发送给百炼的 prompt
        //    把查询到的会员数据、员工信息、格式要求一起注入
        const workerInfo = `你服务于${globalStore.workerConfig.sector_name}${globalStore.workerConfig.job_title}${globalStore.workerConfig.place}${globalStore.workerConfig.fullname}。`;

        let promptText = `${workerInfo}\n\n[用户提问]：${userInput}\n\n请用HTML格式回答，确保内容清晰且易读。`;

        if (memberContext) {
            promptText += `\n\n[精准匹配的会员信息，优先依据此信息回答，如无匹配则不要自行编造]：${memberContext}`;
        }

        // 5. 构造百炼请求体
        const requestBody: Record<string, unknown> = {
            input: {
                prompt: promptText,
                // 有 session_id 时传入，实现多轮对话上下文
                ...(sessionId.value ? { session_id: sessionId.value } : {}),
            },
            parameters: {
                // 增量流式：每次只返回新增片段，而非累积全文
                incremental_output: true,
            },
            debug: {},
        };

        // 6. 发起 HTTP 请求，X-DashScope-SSE: enable 开启流式
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type":    "application/json",
                "Authorization":   `Bearer ${API_KEY}`,
                "X-DashScope-SSE": "enable",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok || !response.body) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 7. 读取 SSE 流
        const reader  = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer    = "";
        replyMessage.content = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE 消息以 \n 分隔，逐行解析
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? ""; // 保留可能不完整的最后一行

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(":")) continue;

                if (trimmed.startsWith("data:")) {
                    const jsonStr = trimmed.slice(5).trim();
                    if (jsonStr === "[DONE]") {
                        finished.value = true;
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(jsonStr);

                        // 保存 session_id，用于下一轮多轮对话
                        if (parsed?.output?.session_id) {
                            sessionId.value = parsed.output.session_id;
                        }

                        // 拼接增量文本
                        const chunk: string = parsed?.output?.text ?? "";
                        if (chunk) {
                            replyMessage.content += formatReplyWithHTML(chunk);
                            if (msgIndex !== -1) {
                                messages.splice(msgIndex, 1, { ...replyMessage });
                            }
                            scrollToBottom();
                        }

                        if (parsed?.output?.finish_reason === "stop") {
                            finished.value = true;
                        }
                    } catch {
                        // 忽略 JSON 解析失败的片段
                    }
                }
            }
        }

        if (!finished.value) finished.value = true;

    } catch (error) {
        replyMessage.content = `<p>抱歉，我暂时无法处理您的请求，请稍后再试。</p>`;
        if (msgIndex !== -1) {
            messages.splice(msgIndex, 1, { ...replyMessage });
        }
        console.error("百炼 AI 调用错误:", error);
        finished.value = true;
    } finally {
        isSending.value = false;
    }
};
// ────────────────────────────────────────────────────────────────

const inputField = ref<HTMLInputElement | null>(null);

// 每轮对话结束后保存记录到服务端
watch(
    () => finished.value,
    async (nval) => {
        if (!nval) return;

        const lastUser = messages.filter(m => m.role === "user").pop();
        const lastAI   = messages.filter(m => m.role === "assistant").pop();

        if (lastUser) {
            await axios.post('/member/record_chat', {
                card_number: globalStore.workerConfig.telphone,
                role: 'user',
                content: lastUser.content,
            }, { toast: 0 });
        }
        if (lastAI) {
            await axios.post('/member/record_chat', {
                card_number: globalStore.workerConfig.telphone,
                role: 'assistant',
                content: lastAI.content,
            }, { toast: 0 });
        }
    }
);

onMounted(async () => {
    // 员工端暂无额外初始化逻辑，保留钩子供后续扩展
});

/**
 * 会员关键字解析：当用户输入中含有"患者XXX的"时，
 * 查询会员基本信息、评估表及预约记录，并拼成上下文字符串返回给百炼。
 */
const parseInput = async (input: string): Promise<string | false> => {
    let message = '';
    const matchForm = input.match(/患者(\S+)的/);
    if (!matchForm) return false;

    try {
        const { data } = await axios.get('/member/search', {
            card_number: matchForm[1],
            bid: globalStore.workerConfig.bid,
        }, { totast: 0 });

        if (!data) {
            // 无匹配时明确告知模型不要自行编造
            message += `仅返回以下回答：无任何${matchForm[1]}匹配结果`;
        } else if (data.length > 1) {
            const result = data.map((item: Record<string, unknown>) =>
                Object.entries(item).map(([k, v]) => `${k}:${v}`).join(', ')
            ).join('; ');
            message += `匹配到${data.length}条${matchForm[1]}会员信息，请提供更精准的信息（如手机号码）。` +
                       `匹配到的结果（仅返回关键信息让用户继续精准查询）：${result}`;
        } else {
            const member = data[0];
            message += `${member.fullname}基本信息：${JSON.stringify(member)}。`;

            // 拉取评估表
            try {
                const form = await axios.get('/form/get_form_by_match', {
                    rules_id: 1,
                    bid: globalStore.workerConfig.bid,
                    telphone: member.card_number,
                }, { totast: 0 });
                if (form.data) {
                    message += `忘记之前聊天记录中获取到的评估表，以最新获取到的患者评估表信息展开互动。` +
                               `${member.fullname}的评估表信息（json）：${JSON.stringify(form.data)}。` +
                               `询问用户是否有更具体的分析需求。`;
                }
            } catch { /* 评估表查询失败时忽略 */ }

            // 拉取预约治疗记录
            try {
                const usage = await axios.get('/services/get_member_usage_details', {
                    bid: globalStore.workerConfig.bid,
                    telphone: member.card_number,
                }, { totast: 0 });
                if (usage.data) {
                    message += `${member.fullname}的预约治疗记录：${JSON.stringify(usage.data)}。` +
                               `字段 type=1 为项目销售，type=2 为项目预约治疗；` +
                               `date 字段分别对应销售日期或预约日期；exhort 为康复建议；remark 为内部备注。`;
                }
            } catch { /* 预约记录查询失败时忽略 */ }
        }

        return message || false;
    } catch {
        return false;
    }
};

// HTML 格式化函数（与原逻辑保持一致）
const formatReplyWithHTML = (text: string): string => {
    let formatted = text;

    formatted = formatted.replace(/###\s*(.+)/g, "<h3>$1</h3>");
    formatted = formatted.replace(/##\s*(.+)/g,  "<h2>$1</h2>");
    formatted = formatted.replace(/#\s*(.+)/g,   "<h1>$1</h1>");

    formatted = formatted.replace(/(?:^|\n)-\s+(.*?)(?=\n|$)/g, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");

    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/__(.+?)__/g,      "<mark>$1</mark>");

    formatted = formatted.replace(/^[1][0-9]{9}$/, (match) => `<a href="tel:${match}">${match}</a>`);

    return formatted;
};
</script>

<style scoped>
.chat-container  { display: flex; flex-direction: column; height: calc(100vh - 61px); background-color: #fafafa; }
.chat-messages   { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.user-message, .ai-message { display: flex; align-items: flex-start; gap: 10px; }
.user-message    { justify-content: flex-start; }
.ai-message      { justify-content: flex-end; }
.avatar          { width: 40px; height: 40px; border-radius: 50%; }
.message-content { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.user-message .message-content { background-color: #e6f7ff; }
.ai-message .message-content   { background-color: #f3f3f3; }
:deep(h1){ font-size: 1.25rem !important; }
:deep(h2){ font-size: 1rem !important; }
.chat-input      { display: flex; align-items: center; padding: 10px; background-color: #fff; border-top: 1px solid #eee; }
.chat-input input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 30px; font-size: 14px; background-color: #fafafa; }
.chat-input button { margin-left: 10px; padding: 8px 16px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.chat-input button:hover { background-color: #0056b3; }
</style>
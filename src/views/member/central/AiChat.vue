<template>
    <div class="h-full">
        <div class="chat-container">
            <!-- 消息显示区 -->
            <ChatMessagesTemplate :messages="messages" :user-avatar="userAvatar" :ai-avatar="aiAvatar" />
            <!-- <div class="chat-messages">
                <div v-for="(message, index) in messages" :key="index"
                    :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }">
                    <div v-if="message.role === 'user'" class="flex gap-3 mt-3">
                        <img :src="userAvatar" alt="avatar" class="avatar" />
                        <div class="message-content">
                            <div v-html="message.content"></div>
                        </div>
                    </div>
                    <div v-else class="flex gap-3 flex-row-reverse">
                        <img :src="aiAvatar" alt="avatar" class="avatar bg-white" />
                        <div class="message-content">
                            <div v-html="message.content"></div>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- 输入区 -->
            <div>
                <!-- <div class="text-xs text-300 px-3 py-1">请等待AI完成回答</div> -->
                <div class="chat-input">
                    <input v-model="input" ref="inputField" type="text" placeholder="请输入你想咨询的问题..." @keydown.enter="sendMessage" :disabled="!finished || isSending"/>
                    <button @click="sendMessage" class="border-circle p-0 pt-1" style="height: 38px; width: 38px;" :disabled="!finished || isSending">
                        <el-icon size="large"><Promotion /></el-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import OpenAI from "openai";
import axios from '@/utils/axios'
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter()
import ChatMessagesTemplate from "@/components/common/ChatMessages.vue";
import { useHead } from '@vueuse/head'

import user_avatar from '@@/images/avatar.jpg';
import ai_avatar from '@@/images/logo1.webp';

// 用户和AI头像路径
const userAvatar = globalStore.memberInfo.avatar?globalStore.memberInfo.avatar:user_avatar;
const aiAvatar = ai_avatar;

useHead({
  meta: [
    { name: 'description', content: '妈妈智问，AI互动问答平台，为孕产妇提供专业、便捷的健康资讯解答。' },
    { property: 'og:image', content: 'https://worker.e-eps.com/images/logo1.png' }, // 动态OG图片
  ]
})


// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        const chatMessages = document.querySelector(".chat-messages");
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
};

// 消息列表
const messages = reactive<Array<{ role: string; content: string }>>([
    {
        role: "system",
        content: `
            <h1>欢迎来到“妈妈智问”</h1>
            <p>您好！我是“一凡妈妈”的AI健康顾问。我专注于为您提供产后康复、哺乳喂养、育婴以及女性健康方面的专业建议。</p>
            <p><strong>在这里，您可以获得：</strong></p>
            <ul>
                <li>- 针对产后康复、哺乳喂养和育婴及女性健康等方面的科学支持与指导。</li>
                <li>- 根据您的具体情况，提供个性化和实用的建议，帮助您更好地恢复和照顾宝宝。</li>
                <li>- 情感上的支持，尤其是在您遇到焦虑或困惑时。</li>
            </ul>
            <p><strong>需要特别提醒的是：</strong></p>
            <ul>
                <li>- 我的回答仅供参考，<mark>不能替代专业医疗意见</mark>。</li>
                <li>- 若问题涉及治疗、用药或其他专业医疗建议，请务必联系<strong>您的专属康复师</strong>或前往<mark>专业医疗机构</mark>咨询。</li>
            </ul>
            <p><strong>温馨提示：</strong>我的目标是为您提供贴心且科学的建议，但无法替代医生的诊断。</p>
            <p>如有任何问题，随时可以向我咨询，我会尽我所能帮助您。</p>
        `
    }
]);

// 用户输入框
const input = ref("");
const isSending = ref(false); // 控制是否正在发送消息
const finished = ref(true); // 是否完成回答
const memberBackgroundInfo = ref('');

// 阿里云通义千问 API 初始化
const API_KEY = "sk-90ddc648bde241fabb8505396c9e9a80"; // 替换为你的 API Key
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

// 消息发送函数
const sendMessage = async () => {
    if (!input.value.trim() || isSending.value || !finished.value) {
        return; // 如果正在发送或者AI尚未完成，阻止发送新问题
    }

    isSending.value = true; // 开始发送消息

    // 添加用户消息
    messages.push({ role: "user", content: input.value });
    const userInput = input.value;
    input.value = ""; // 清空输入框

    // 初始化 AI 回应
    const replyMessage = { role: "assistant", content: `<img src="/images/03-42-11-849_512.webp" width="35px">` };
    messages.push(replyMessage);
    const index = messages.indexOf(replyMessage);

    const goMessage = [];
    goMessage.push({
        role: "system",
        content: `
            系统角色： 
            嗨，我是“妈妈智问”，一款AI健康顾问机器人。我专注于产后康复、哺乳喂养、育婴及女性健康，为您提供专业、贴心的帮助。

            系统特效：
            - 专业性：内容符合行业特点；
            - 可靠性：建议科学、附带联系方式；
            - 亲和力：语言温暖，缓解用户焦虑；
            - 灵活性：支持多样化用户需求，保持上下文一致性。

            业务重点： 
            - 通过上下文识别用户问题。例如，如果用户先提“腰疼”，接着问“怎么练核心力量”，AI可将回答与腰疼问题相关联。
            - 如果用户提问与产后恢复、育婴技巧相关，请用简单、清晰的语言提供科学依据支持的建议，并结合用户场景回答。
            - 若问题涉及用药或治疗，请在回答末尾提醒用户联系专业康复师或到医疗机构就诊，同时附上用户的康复师或科室负责人的联系方式。

            行业特点： 
            1. 用户多处于身体恢复期或抚育新生儿的过程中，语言需温和有耐心。
            2. 医疗建议需谨慎，避免误导。强调AI回答仅供参考，非替代医疗意见。
            3. 服务体系包含门店、专属康复师及科室负责人，涉及这些角色时保持专业性。

            用户群体：
            用户群体来这里是进行康复治疗，并不是疾病治疗。科室提供的服务包括盆腹手法,盆底肌电刺激与生物反馈治疗,子宫复旧理疗,徒手骨盆矫正,腹直肌恢复,盆底肌磁刺激治疗,局部微波治疗,哺乳期无痛乳腺疏通,乳腺淋巴护理,乳腺理疗,外阴微波治疗,全身紧致塑形,产后经络气血疏通,肩颈背推拿理疗,孕期盆底肌放松,孕期抚触,孕期全身抚触按摩,孕期B超,孕期乳房护理,胎心监测或听胎心,产后7天上门访视,产后42天复查,产后乳腺疏通,产后保养,小儿推拿,IBCLC国际泌乳顾问喂养指导。请注意避免使用患病人群词汇，顾客群体并非患病，而是为其提供健康理疗服务。

            用户交互注意事项： 
            - 如果用户情绪低落或表现焦虑，先进行情感支持，再提供实际建议。
            - 对于不明确的问题，用提问引导用户表达清晰需求，如“您方便告诉我更多相关情况吗？”。
            - 在回答中引用最新的产后恢复指南或喂养建议。
            - 自动检测用户提问中的关键词，比如“恢复”“喂养”，提供精准资源链接。
            - 针对不同场景（如“夜间”“宝宝哭闹”），回答应加入时间和环境的具体建议。
            - 温柔但不啰嗦，科学但不生硬。例如：“根据科学研究……”比“我认为……”更具权威性。
            - 如果用户提出的问题显得很焦虑，可以在回答前加一句：“我理解您现在的担忧，我们一起来看看怎么解决。”
            
            用户信息(如果不存在用户信息则不用提供个性化解析)：
            ${memberBackgroundInfo.value}

            输出内容格式：
            - 所有回答都需要使用HTML格式进行组织，支持以下格式
            - 标题使用 <h1>, <h2>, <h3> 等标签
            - 段落使用 <p>
            - 换行使用 <br>
            - 列表使用 <ul>, <ol>, <li>
            - 重要内容加粗使用 <strong>
            - 高亮或重点信息可以使用 <mark>

            示例：
            <h1>这是标题</h1>
            <p>这是正文内容，可以包含 <strong>加粗</strong> 或 <mark>高亮</mark>。</p>
            <ul>
            <li>列表项 1</li>
            <li>列表项 2</li>
            </ul>
            请始终按照HTML格式回答。`
    });
    const adjustedInput = `请用HTML格式回答以下问题，确保内容清晰且易读：${userInput}`;

    // 将调整后的输入传递给模型
    goMessage.push({ role: "user", content: adjustedInput });

    // 重置 finished 标志，开始等待 AI 回答
    finished.value = false;

    try {
        scrollToBottom();
        const completion = await openai.chat.completions.create({
            model: globalStore.globalConfig.AI_MODEL,
            messages: [
                ...messages,
                ...goMessage,
                { role: "user", content: userInput }
            ],
            stream: true,
        });
        replyMessage.content = '';
        // 处理流式响应
        for await (const chunk of completion) {
            const reply = chunk.choices[0]?.delta?.content || "";

            // 使用改进的HTML格式化规则
            const formattedReply = formatReplyWithHTML(reply);
            replyMessage.content += formattedReply;

            // 动态更新消息内容
            if (index !== -1) {
                messages.splice(index, 1, { ...replyMessage });
            }

            // 检查AI是否完成输出
            if (chunk.choices[0].finish_reason === "stop") {
                finished.value = true; // AI 完成输出
            }
            
            scrollToBottom();
        }

        isSending.value = false; // 结束发送
    } catch (error) {
        replyMessage.content = `
            <p>抱歉，我暂时无法处理您的请求，请稍后再试。</p>
        `;
        if (index !== -1) {
            messages.splice(index, 1, { ...replyMessage });
        }
        isSending.value = false; // 结束发送
        finished.value = true; // AI 完成输出
        console.error("AI 生成错误:", error);
    }
};

const inputField = ref<HTMLInputElement | null>(null);
watch(()=>finished.value, async (nval, oval)=>{
    if (nval) {
        // AI 完成输出时获取最新的用户和AI对话
        const lastUserMessage = messages.filter(message => message.role === 'user').pop();
        const lastAIResponse = messages.filter(message => message.role === 'assistant').pop();

        if(globalStore.memberInfo.card_number){
            if(lastUserMessage){
                await axios.post('/member/record_chat', {card_number:globalStore.memberInfo.card_number, role:'user', content:lastUserMessage.content}, {toast:0})
            }
            if(lastAIResponse){
                await axios.post('/member/record_chat', {card_number:globalStore.memberInfo.card_number, role:'assistant', content:lastAIResponse.content}, {toast:0})
            }
        }


        // 在输出完成后，确保输入框获取焦点
        nextTick(() => {
            // if (inputField.value) {
            //     inputField.value.focus(); // 确保输入框获得焦点
            // }
        });
    }
})


onMounted(async()=>{
    try {

        await axios.get('/index/config', {totast:0})

        if(globalStore.memberInfo.card_number){
            const { data } = await axios.get('/member/background_info', {card_number:globalStore.memberInfo.card_number}, {totast:0})
            memberBackgroundInfo.value = data
        }
        

    } catch (error) {

    }
})

// HTML 格式化函数
const formatReplyWithHTML = (text: string): string => {
    let formatted = text;

    // 标题处理
    formatted = formatted.replace(/###\s*(.+)/g, "<h3>$1</h3>"); // 三级标题
    formatted = formatted.replace(/##\s*(.+)/g, "<h2>$1</h2>"); // 二级标题
    formatted = formatted.replace(/#\s*(.+)/g, "<h1>$1</h1>");  // 一级标题

    // 列表处理
    formatted = formatted.replace(/(?:^|\n)-\s+(.*?)(?=\n|$)/g, "<li>$1</li>"); // 列表项
    formatted = formatted.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>"); // 包裹 <li> 标签

    // 加粗与高亮
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); // 加粗
    formatted = formatted.replace(/__(.+?)__/g, "<mark>$1</mark>"); // 高亮

    // 电话号码处理：假设电话号码格式为 13, 14, 15, 18 等开头的数字
    formatted = formatted.replace(/^[1][0-9]{9}$/, (match) => {
        return `<a href="tel:${match}">${match}</a>`;
    });

    // URL 超链接处理：匹配 http:// 或 https:// 开头的 URL
    // formatted = formatted.replace(/https?:\/\/[^\s]+/g, (match) => {
    //     return `<a href="${match}" target="_blank">${match}</a>`;
    // });


    // 不再强制段落和换行，只保留对内容的简单装饰
    return formatted;
};
</script>

<style scoped>
.chat-container { display: flex; flex-direction: column; height: calc(100vh - 61px); background-color: #fafafa; }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.user-message, .ai-message { display: flex; align-items: flex-start; gap: 10px; }
.user-message { justify-content: flex-start; }
.ai-message { justify-content: flex-end; }
.avatar { width: 40px; height: 40px; border-radius: 50%; }
.message-content { max-width: 70%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.user-message .message-content { background-color: #e6f7ff; }
.ai-message .message-content { background-color: #f3f3f3; }
.chat-input { display: flex; align-items: center; padding: 10px; background-color: #fff; border-top: 1px solid #eee; }
.chat-input input { flex: 1; padding: 12px 12px; border: 1px solid #ddd; border-radius: 30px; font-size: 14px; background-color: #fafafa;}
.chat-input button { margin-left: 10px; padding: 8px 16px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.chat-input button:hover { background-color: #0056b3; }
</style>

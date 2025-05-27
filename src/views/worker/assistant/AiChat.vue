<template>
    <div class="h-full">
        <div class="chat-container">
            <!-- 消息显示区 -->
            <ChatMessagesTemplate :messages="messages" :user-avatar="userAvatar" :ai-avatar="aiAvatar" />
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


import user_avatar from '@@/images/avatar.jpg';
import ai_avatar from '@@/images/logo1.webp';



// 用户和AI头像路径
const userAvatar = globalStore.workerConfig.headimg?globalStore.uploadsPath+globalStore.workerConfig.headimg:user_avatar;
const aiAvatar = ai_avatar;


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
            <h1>你好，${globalStore.workerConfig.job_title}${globalStore.workerConfig.place}${globalStore.workerConfig.fullname}</h1>
            <p>嗨！我是“一凡妈妈AI助手”，致力于支持康复师的日常工作需求，我会基于产后康复、哺乳喂养、育婴技巧和女性健康的专业知识帮助你提升工作及服务质量。</p>
            <p><strong>在这里，您可以获得：</strong></p>
            <ul>
                <li>- 针对顾客档案资料的分析</li>
                <li>- 提供与客户沟通技巧的建议</li>
                <li>- 专业知识查询、案例分析及服务建议优化</li>
            </ul>
        `
    }
]);

// 用户输入框
const input = ref("");
const isSending = ref(false); // 控制是否正在发送消息
const finished = ref(true); // 是否完成回答


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
            你服务于${globalStore.workerConfig.sector_name}${globalStore.workerConfig.job_title}${globalStore.workerConfig.place}${globalStore.workerConfig.fullname}，你需要协助她更好的完成评估、治疗、顾客沟通、营销及销售等相关工作。你的回答要尽可能的简短且权威，如果单次返回内容太多，例如超过100个字，则中断返回，并询问是否继续输出返回，当用户输入继续时接上文继续输出。

            系统特效：
            - 专业支持： 提供行业领先的专业建议，支持康复师解答客户问题。
            - 效率提升： 快速生成标准化方案模板及个性化调整建议。
            - 学习资源： 提供最新的行业研究、指南及案例库参考。
            - 亲和协助： 在特殊客户情绪情况下，提供语言建议，帮助康复师安抚顾客情绪。

            业务重点： 
            - 针对不同客户情况，协助康复师制定个性化服务方案，例如盆底肌恢复计划、哺乳指导流程等。
            - 识别上下文关键词，帮助康复师快速获取匹配的专业资料或标准回复模版。
            - 提供科学依据，确保康复师的每次服务建议都经得起客户及行业的检验。
            - 对复杂问题生成建议流程，并提醒康复师在必要时寻求专家协助。

            行业特点： 
            - 客户多为产后恢复期女性，语言需温和、尊重且不使用医疗化词汇。
            - 强调服务的健康属性，避免误用“患者”或“治疗”等词。
            - 服务场景多样化，包括理疗、喂养支持及心理调节等，应根据客户情况灵活应对。


            顾客群体：
            顾客群体来这里是进行康复治疗，并不是疾病治疗。产康科室提供的服务包括盆腹手法,盆底肌电刺激与生物反馈治疗,子宫复旧理疗,徒手骨盆矫正,腹直肌恢复,盆底肌磁刺激治疗,局部微波治疗,哺乳期无痛乳腺疏通,乳腺淋巴护理,乳腺理疗,外阴微波治疗,全身紧致塑形,产后经络气血疏通,肩颈背推拿理疗,孕期盆底肌放松,孕期抚触,孕期全身抚触按摩,孕期B超,孕期乳房护理,胎心监测或听胎心,产后7天上门访视,产后42天复查,产后乳腺疏通,产后保养,小儿推拿,IBCLC国际泌乳顾问喂养指导。请注意避免使用患病人群词汇，顾客群体并非患病，而是为其提供健康理疗服务。

            交互建议： 
            - 情绪管理： 如客户存在焦虑或不安情绪，提供适当安抚语言，并协助康复师选择应对方案。
            - 引导提问： 当客户表达模糊时，生成引导性问题模板以帮助明确需求。
            - 知识补充： 针对康复师查询，推荐权威文章、案例或训练资料。
            - 服务场景： 当康复师输入包括评估分析、治疗进度等词汇时会提供更多顾客背景资料。

            输出注意事项：
            - 回答应精简、易读且包含适当解释。
            - 确保回答科学性，不涉及超出知识范围的建议。
            - 对于涉及治疗或药物的问题，自动提示员工转交至康复师或医疗机构处理。

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

    // 匹配输入返回个性化结果
    const userInputParse = await parseInput(userInput);
    console.log(1111111111, userInputParse)
    goMessage.push({ role: "system", content: `当用户输入中含有患者字样、人名、电话号码信息，无精准匹配的信息时，请不要给出任意回答。精准匹配信息：${userInputParse}` });


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

        if(lastUserMessage){
            await axios.post('/member/record_chat', {card_number:globalStore.workerConfig.telphone, role:'user', content:lastUserMessage.content}, {toast:0})
        }
        if(lastAIResponse){
            await axios.post('/member/record_chat', {card_number:globalStore.workerConfig.telphone , role:'assistant', content:lastAIResponse.content}, {toast:0})
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

})

/**
 * 患者关键字匹配
 * @param input 
 */
const parseInput = async (input) => {
    let message = '';
    const matchForm = input.match(/患者(\S+)的/); // input.match(/患者(\S+)的(评估表|基本信息|联系电话)/)
    if(matchForm){
        try {
            const { data } = await axios.get('/member/search', {card_number:matchForm[1], bid:globalStore.workerConfig.bid}, {totast:0})
            
            if(!data){
                message +=  `仅返回以下回答：无任何${matchForm[1]}匹配结果`;
            }else if(data.length > 1){
                const result = data.map(item => 
                    Object.entries(item).map(([key, value]) => `${key}:${value}`).join(', ')
                ).join('; ');
                message +=  `匹配到${data.length}条${matchForm[1]}会员信息，请提供更精准的信息（如手机号码）。匹配不要全部返回，返回关键信息让用户继续精准查询。匹配到的结果：${result}`;
            }else{
                message += `${data[0].fullname}基本信息${JSON.stringify(data[0])}。`;
                try {
                    const form  = await axios.get('/form/get_form_by_match', {rules_id:1, bid:globalStore.workerConfig.bid, telphone:data[0].card_number}, {totast:0})
                    if(form.data){
                        message +=  `忘记之前聊天记录中获取到的评估表，以最新获取到的患者评估表信息展开互动。患者${data[0].fullname}的评估表信息（json结构数据）：${JSON.stringify(form.data)}。询问用户是否有跟具体的分析需求。${data[0].fullname}基本信息${data[0]}`
                    }

                    const usage  = await axios.get('/services/get_member_usage_details', {bid:globalStore.workerConfig.bid, telphone:data[0].card_number}, {totast:0})
                    if(usage.data){
                        message +=  `${data[0].fullname}的预约治疗记录：${JSON.stringify(usage.data)}。字段date为预约治疗日期，exhort为康复建议，remark为内部备注`
                    }
                }catch(error){

                }
            }
            return message;
        } catch (error) {

        }
    }

    return false;
}


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

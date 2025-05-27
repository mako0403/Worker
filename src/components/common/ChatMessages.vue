<template>
    <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index"
            :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }">
            <div v-if="message.role === 'user'" class="flex gap-3 mt-3">
                <img :src="message.avatar?message.avatar:userAvatar" alt="avatar" class="avatar bg-orange-100" />
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
    </div>
    <!-- <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index"
            :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }">
            <div v-if="message.role === 'user'" class="message-wrapper">
                <img :src="userAvatar" class="avatar" />
                <div class="message-content" v-html="message.content"></div>
            </div>
            <div v-else class="message-wrapper reverse">
                <img :src="aiAvatar" class="avatar" />
                <div class="message-content" v-html="message.content"></div>
            </div>
        </div>
    </div> -->
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
    messages: { type: Array, required: true },
    userAvatar: { type: String, required: true },
    aiAvatar: { type: String, required: true },
});
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

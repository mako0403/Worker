<template>
    <div
        class="expert-card surface-0 mb-2 flex align-items-center gap-3 px-3 py-3 cursor-pointer"
        @click="emit('click', expert.id)"
    >
        <!-- 头像区 -->
        <div class="relative flex-shrink-0">
            <van-image
                round width="66" height="66"
                :src="expert.avatar || defaultAvatar"
                fit="cover"
            />
            <!-- 专家标识 -->
            <div
                class="absolute flex align-items-center justify-content-center border-round-lg"
                style="bottom:-4px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#667eea,#764ba2);padding:2px 8px;white-space:nowrap;"
            >
                <span class="text-white font-semibold" style="font-size:10px;">✦ 专家</span>
            </div>
        </div>

        <!-- 信息区 -->
        <div class="flex flex-column gap-1 flex-1 min-w-0">
            <!-- 姓名 + 评分 -->
            <div class="flex align-items-center justify-content-between">
                <span class="font-bold text-base text-900">{{ expert.nickname }}</span>
                <div class="flex align-items-center gap-1 flex-shrink-0">
                    <van-icon name="star" size="13" color="#f7ba2a" />
                    <span class="text-sm font-semibold" style="color:#f7ba2a;">{{ Number(expert.rating).toFixed(1) }}</span>
                </div>
            </div>

            <!-- 职称 -->
            <div class="text-sm font-medium" style="color:#764ba2;">{{ expert.title }}</div>

            <!-- 擅长领域 -->
            <div class="flex align-items-center gap-1 text-400 text-xs">
                <van-icon name="label-o" size="12" color="#bbb" />
                <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ expert.speciality }}</span>
            </div>

            <!-- 咨询次数 + 价格 -->
            <div class="flex align-items-center justify-content-between mt-1">
                <span class="text-xs text-400">
                    <span class="text-600 font-medium">{{ expert.consult_count }}</span> 次咨询
                </span>
                <div class="flex align-items-baseline gap-1">
                    <span class="text-xs font-semibold" style="color:#e05c8a;">¥</span>
                    <span class="font-bold" style="color:#e05c8a;font-size:18px;line-height:1;">{{ expert.consult_price }}</span>
                    <span class="text-xs text-400">/{{ expert.consult_duration }}分钟</span>
                </div>
            </div>
        </div>

        <!-- 箭头 -->
        <van-icon name="arrow" size="16" class="text-300 flex-shrink-0" />
    </div>
</template>

<script setup lang="ts">
import type { Expert } from '@/store/circle'

defineProps<{ expert: Expert }>()
const emit = defineEmits<{ click: [id: number] }>()

const defaultAvatar = '@@/images/default_avatar.png'
</script>

<style scoped>
.expert-card:active { background: #faf7ff; }
</style>
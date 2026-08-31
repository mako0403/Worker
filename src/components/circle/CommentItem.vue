<template>
    <div class="flex gap-2"
        :class="isReply ? 'py-2 pr-3 pl-6 border-top-1 border-purple-50' : 'py-3 px-3 border-top-1 border-gray-50'">
        <!-- 头像 -->
        <van-image round :width="isReply ? 28 : 36" :height="isReply ? 28 : 36"
            :src="comment.author.avatar || defaultAvatar" fit="cover" class="flex-shrink-0 mt-1" />

        <!-- 内容区 -->
        <div class="flex flex-column gap-1 flex-1 min-w-0">

            <!-- 昵称 + 徽章 + 职称 -->
            <div class="flex align-items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-900">{{ comment.author.nickname }}</span>
                <span v-if="comment.author.badge" class="text-xs px-2 border-round-xl font-semibold flex-shrink-0"
                    :class="badgeClass" style="padding-top:1px;padding-bottom:1px;">{{ badgeLabel }}</span>
                <span v-if="comment.author.place" class="text-xs flex-shrink-0"
                    :class="comment.author.badge === 'expert' ? 'text-orange-400' : 'text-green-500'">{{
                        comment.author.place }}</span>
            </div>

            <!-- 评论内容（回复时显示 @被回复人）-->
            <p class="text-sm text-800 line-height-3 m-0" style="word-break:break-all;">
                <span v-if="isReply && comment.parent_author" class="text-purple-500 font-medium">
                    @{{ comment.parent_author }}&nbsp;
                </span>
                {{ comment.content }}
            </p>

            <!-- 时间 + 操作 -->
            <div class="flex align-items-center justify-content-between mt-1">
                <span class="text-xs text-400">{{ formatTime(comment.create_time) }}</span>
                <div class="flex align-items-center gap-3">
                    <!-- 点赞 -->
                    <div class="flex align-items-center gap-1 cursor-pointer text-xs"
                        :class="comment.is_liked ? 'text-pink-400' : 'text-400'"
                        @click="emit('like', comment.id, comment.is_liked ?? false)">
                        <van-icon :name="comment.is_liked ? 'like' : 'like-o'" size="13" />
                        <span v-if="comment.like_count && comment.like_count > 0">{{ comment.like_count }}</span>
                    </div>
                    <!-- 回复 -->
                    <span v-if="!isReply" class="text-xs text-400 cursor-pointer" @click="emit('reply', comment)">回复</span>
                    <!-- 删除 -->
                    <span v-if="canDelete" class="text-xs text-pink-400 cursor-pointer"
                        @click="emit('delete', comment.id)">删除</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/store/circle'
import moment from 'moment'

const props = defineProps<{
    comment: Comment
    isReply?: boolean
    canDelete?: boolean
    currentUserId?: string
    currentUserType?: string
}>()

const emit = defineEmits<{
    reply: [comment: Comment]
    delete: [commentId: number]
    like: [commentId: number, currentLiked: boolean]
}>()

const defaultAvatar = '@@/images/default_avatar.png'

const badgeClass = computed(() => {
    if (props.comment.author.badge === 'expert') return 'text-orange-500 bg-orange-50'
    if (props.comment.author.badge === 'worker') return 'text-green-600 bg-green-50'
    return ''
})

const badgeLabel = computed(() => {
    if (props.comment.author.badge === 'expert') return '✦ 专家'
    if (props.comment.author.badge === 'worker') return '员工'
    return ''
})

function formatTime(ts: number): string {
    const now = moment(), t = moment.unix(ts)
    const diffM = now.diff(t, 'minutes'), diffH = now.diff(t, 'hours'), diffD = now.diff(t, 'days')
    if (diffM < 1) return '刚刚'
    if (diffM < 60) return `${diffM}分钟前`
    if (diffH < 24) return `${diffH}小时前`
    if (diffD < 7) return `${diffD}天前`
    return t.format('MM-DD HH:mm')
}
</script>
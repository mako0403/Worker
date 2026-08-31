<template>
    <div class="post-card surface-0 mb-2 cursor-pointer" @click="emit('clickPost', post.id)">

        <!-- 作者行 -->
        <div class="flex align-items-center gap-2 px-3 pt-3 pb-2">

            <!-- 头像 -->
            <div class="relative flex-shrink-0">
                <van-image
                    round width="44" height="44"
                    :src="post.author.avatar || defaultAvatar"
                    fit="cover"
                />
                <!-- 角色标识点 -->
                <div
                    class="absolute border-circle border-2 border-white"
                    style="width:13px;height:13px;bottom:0;right:0;"
                    :style="{ background: roleDotColor }"
                />
            </div>

            <!-- 作者信息 -->
            <div class="flex flex-column gap-1 flex-1 min-w-0">
                <div class="flex align-items-center gap-2 flex-wrap">
                    <!-- 昵称 -->
                    <span class="font-semibold text-sm text-900">
                        {{ post.author.nickname }}
                    </span>
                    <!-- 专家/员工徽章 -->
                    <span
                        v-if="post.author.badge"
                        class="text-xs px-2 border-round-xl font-semibold flex-shrink-0"
                        :class="badgeClass"
                        style="padding-top:2px;padding-bottom:2px;"
                    >
                        {{ badgeLabel }}
                    </span>
                </div>

                <!-- 职称（员工才显示）+ 时间 -->
                <div class="flex align-items-center gap-2">
                    <span
                        v-if="post.author.place"
                        class="text-xs font-medium"
                        :class="post.author.badge === 'expert' ? 'text-orange-400' : 'text-green-500'"
                    >
                        {{ post.author.place }}
                    </span>
                    <span v-if="post.author.place" class="text-300 text-xs">·</span>
                    <span class="text-xs text-400">{{ formatTime(post.create_time) }}</span>
                </div>
            </div>

        </div>

        <!-- 正文（最多5行）-->
        <div class="px-3 pb-2">
            <p
                class="text-sm text-800 line-height-3 m-0"
                style="-webkit-line-clamp:5;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;word-break:break-all;"
            >
                {{ post.content }}
            </p>
        </div>

        <!-- 图片九宫格 -->
        <div v-if="post.images && post.images.length > 0" class="px-3 pb-2">
            <div class="image-grid" :class="`grid-${Math.min(post.images.length, 9)}`">
                <div
                    v-for="(img, idx) in post.images.slice(0, 9)" :key="idx"
                    class="image-cell border-round-lg overflow-hidden"
                    @click.stop="previewImage(post.images, idx)"
                >
                    <van-image :src="img" fit="cover" width="100%" height="100%" lazy-load />
                    <div
                        v-if="idx === 8 && post.images.length > 9"
                        class="image-more flex align-items-center justify-content-center"
                    >
                        +{{ post.images.length - 9 }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 px-3 pb-2">
            <span
                v-for="tag in post.tags" :key="tag"
                class="text-xs px-2 border-round-xl"
                style="color:#7c5cbf;background:#f0e8ff;padding-top:2px;padding-bottom:2px;"
            >
                # {{ tag }}
            </span>
        </div>

        <!-- 操作栏 -->
        <div
            class="flex align-items-center gap-4 px-3 py-2 border-top-1 border-gray-100"
            @click.stop
        >
            <!-- 点赞 -->
            <div
                class="flex align-items-center gap-1 cursor-pointer transition-all transition-duration-150"
                :class="post.is_liked ? 'text-pink-400' : 'text-400'"
                @click="emit('like', post.id, post.is_liked)"
            >
                <van-icon :name="post.is_liked ? 'like' : 'like-o'" size="18" />
                <span class="text-sm">{{ post.like_count || '' }}</span>
            </div>
            <!-- 评论 -->
            <div
                class="flex align-items-center gap-1 text-400 cursor-pointer"
                @click="emit('clickPost', post.id)"
            >
                <van-icon name="chat-o" size="18" />
                <span class="text-sm">{{ post.comment_count || '' }}</span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showImagePreview } from 'vant'
import type { Post } from '@/store/circle'
import moment from 'moment'

const props = defineProps<{ post: Post }>()
const emit  = defineEmits<{
    like:      [postId: number, currentLiked: boolean]
    clickPost: [postId: number]
}>()

const defaultAvatar = '@@/images/default_avatar.png'

// ── 角色标识点颜色 ────────────────────────────────────────────
// expert → 橙色  worker → 绿色  member → 紫色
const roleDotColor = computed(() => {
    if (props.post.author.badge === 'expert') return '#f97316'
    if (props.post.author.badge === 'worker') return '#10b981'
    return '#7c5cbf'
})

// ── 徽章样式 ─────────────────────────────────────────────────
const badgeClass = computed(() => {
    if (props.post.author.badge === 'expert') return 'text-orange-500 bg-orange-50'
    if (props.post.author.badge === 'worker') return 'text-green-600 bg-green-50'
    return ''
})

// ── 徽章文字 ─────────────────────────────────────────────────
// expert 显示"专家"，worker 显示"员工"
const badgeLabel = computed(() => {
    if (props.post.author.badge === 'expert') return '✦ 专家'
    if (props.post.author.badge === 'worker') return '员工'
    return ''
})

// ── 时间格式化 ───────────────────────────────────────────────
function formatTime(ts: number): string {
    const now   = moment()
    const t     = moment.unix(ts)
    const diffM = now.diff(t, 'minutes')
    const diffH = now.diff(t, 'hours')
    const diffD = now.diff(t, 'days')
    if (diffM < 1)  return '刚刚'
    if (diffM < 60) return `${diffM}分钟前`
    if (diffH < 24) return `${diffH}小时前`
    if (diffD < 7)  return `${diffD}天前`
    return t.format('MM-DD HH:mm')
}

// ── 图片预览 ─────────────────────────────────────────────────
function previewImage(images: string[], startIndex: number) {
    showImagePreview({ images, startPosition: startIndex })
}
</script>

<style scoped>
/* 九宫格 */
.image-grid { display: grid; gap: 3px; border-radius: 8px; overflow: hidden; }

.image-grid.grid-1 { grid-template-columns: 1fr; }
.image-grid.grid-1 .image-cell { height: 200px; }

.image-grid.grid-2 { grid-template-columns: repeat(2, 1fr); }
.image-grid.grid-2 .image-cell { height: 140px; }

.image-grid.grid-3,
.image-grid.grid-4,
.image-grid.grid-5,
.image-grid.grid-6,
.image-grid.grid-7,
.image-grid.grid-8,
.image-grid.grid-9 { grid-template-columns: repeat(3, 1fr); }
.image-grid.grid-3 .image-cell,
.image-grid.grid-4 .image-cell,
.image-grid.grid-5 .image-cell,
.image-grid.grid-6 .image-cell,
.image-grid.grid-7 .image-cell,
.image-grid.grid-8 .image-cell,
.image-grid.grid-9 .image-cell { height: 100px; }

.image-cell { position: relative; background: #f0ebff; }
.image-cell :deep(.van-image) { width: 100%; height: 100%; }

.image-more {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45);
    color: #fff; font-size: 18px; font-weight: 700;
}

.post-card:active { background: #fafafa; }
</style>
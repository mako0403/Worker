<template>
    <div class="post-detail-page">

        <!-- 贴文主体 -->
        <div v-if="post" class="surface-0 mb-2">

            <!-- 作者行 -->
            <div class="flex align-items-center gap-2 px-3 pt-3 pb-2">
                <div class="relative flex-shrink-0">
                    <van-image round width="48" height="48" :src="post.author.avatar || defaultAvatar" fit="cover" />
                    <div class="absolute border-circle border-2 border-white"
                        style="width:13px;height:13px;bottom:0;right:0;"
                        :style="{ background: authorDotColor(post.author) }" />
                </div>
                <div class="flex flex-column gap-1 flex-1 min-w-0">
                    <div class="flex align-items-center gap-2 flex-wrap">
                        <span class="font-bold text-base text-900">{{ post.author.nickname }}</span>
                        <span v-if="post.author.badge" class="text-xs px-2 border-round-xl font-semibold flex-shrink-0"
                            :class="authorBadgeClass(post.author)" style="padding-top:2px;padding-bottom:2px;">{{
                            authorBadgeLabel(post.author) }}</span>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <span v-if="post.author.place" class="text-xs font-medium"
                            :class="post.author.badge === 'expert' ? 'text-orange-400' : 'text-green-500'">
                            {{ post.author.place }}
                        </span>
                        <span v-if="post.author.place" class="text-300 text-xs">·</span>
                        <span class="text-xs text-400">{{ formatTime(post.create_time) }}</span>
                    </div>
                </div>
                <!-- 删除按钮（有权限才显示）-->
                <van-icon v-if="canDeletePost" name="delete-o" size="20" class="text-400 cursor-pointer flex-shrink-0"
                    @click="onDeletePost" />
            </div>

            <!-- 正文 -->
            <div class="px-3 pb-3">
                <p class="text-base text-800 line-height-3 m-0" style="word-break:break-all;">{{ post.content }}</p>
            </div>

            <!-- 图片九宫格 -->
            <div v-if="post.images && post.images.length > 0" class="px-3 pb-3">
                <div class="image-grid" :class="`grid-${Math.min(post.images.length, 9)}`">
                    <div v-for="(img, idx) in post.images.slice(0, 9)" :key="idx"
                        class="image-cell border-round-lg overflow-hidden" @click="previewImage(post.images, idx)">
                        <van-image :src="img" fit="cover" width="100%" height="100%" lazy-load />
                        <div v-if="idx === 8 && post.images.length > 9"
                            class="image-more flex align-items-center justify-content-center">
                            +{{ post.images.length - 9 }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 标签 -->
            <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 px-3 pb-3">
                <span v-for="tag in post.tags" :key="tag" class="text-xs px-2 border-round-xl"
                    style="color:#7c5cbf;background:#f0e8ff;padding-top:2px;padding-bottom:2px;"># {{ tag }}</span>
            </div>

            <!-- 点赞评论统计行 -->
            <div class="flex align-items-center gap-4 px-3 py-2 border-top-1 border-gray-100">
                <div class="flex align-items-center gap-2 cursor-pointer transition-all transition-duration-150"
                    :class="post.is_liked ? 'text-pink-400' : 'text-400'" @click="onLikePost">
                    <van-icon :name="post.is_liked ? 'like' : 'like-o'" size="20" />
                    <span class="text-sm">{{ post.like_count > 0 ? post.like_count : '点赞' }}</span>
                </div>
                <div class="flex align-items-center gap-2 text-400">
                    <van-icon name="chat-o" size="20" />
                    <span class="text-sm">{{ post.comment_count > 0 ? post.comment_count : '评论' }}</span>
                </div>
            </div>
        </div>

        <!-- 贴文加载中 -->
        <div v-else-if="postLoading" class="flex justify-content-center py-8">
            <van-loading size="28" />
        </div>

        <!-- 评论区 -->
        <div class="surface-0 mb-2">
            <div class="flex align-items-center justify-content-between px-3 pt-3 pb-2">
                <span class="font-bold text-sm text-900">
                    全部评论
                    <span v-if="post && post.comment_count > 0" class="text-400 font-normal ml-1">{{ post.comment_count
                        }}</span>
                </span>
            </div>

            <!-- 评论骨架 -->
            <template v-if="commentFirstLoad">
                <div v-for="i in 3" :key="i" class="px-3 py-2 border-top-1 border-gray-50">
                    <van-skeleton :row="2" avatar avatar-size="32px" />
                </div>
            </template>

            <!-- 评论列表 -->
            <van-list v-else v-model:loading="commentLoading" :finished="commentFinished" finished-text="没有更多评论了"
                @load="loadComments">
                <template v-for="comment in comments" :key="comment.id">
                    <!-- 一级评论 -->
                    <CommentItem :comment="comment" :can-delete="canDeleteComment(comment)"
                        :current-user-id="currentUserId" :current-user-type="currentUserType" @reply="onReply"
                        @delete="onDeleteComment" @like="onLikeComment" />
                    <!-- 二级回复 -->
                    <div v-if="comment.replies && comment.replies.length > 0"
                        class="mx-0 mb-2 border-round-xs overflow-hidden bg-gray-100 border-top-1 border-bottom-1 border-gray-200">
                        <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" :is-reply="true"
                            :can-delete="canDeleteComment(reply)" :current-user-id="currentUserId"
                            :current-user-type="currentUserType" @reply="onReply" @delete="onDeleteComment"
                            @like="onLikeComment" />
                    </div>
                </template>

                <!-- 空评论 -->
                <div v-if="!commentLoading && comments.length === 0" class="flex justify-content-center py-5">
                    <van-empty description="暂无评论，快来说点什么吧" image-size="80" />
                </div>
            </van-list>
        </div>

        <!-- 底部评论输入栏 -->
        <div class="fixed left-0 right-0 flex align-items-center gap-2 px-3 surface-0 border-top-1 border-gray-100"
            style="bottom:0;padding-top:10px;padding-bottom:calc(10px + env(safe-area-inset-bottom));z-index:100;">
            <div class="flex-1 flex align-items-center gap-2 border-round-3xl px-3 cursor-pointer"
                style="background:#f5f0fc;padding-top:9px;padding-bottom:9px;"
                :class="replyTarget ? 'border-1 border-purple-300' : ''" @click="openCommentPopup">
                <van-icon name="edit" size="15" color="#bbb" />
                <span class="text-sm" :class="replyTarget ? 'text-purple-500' : 'text-400'">
                    {{ replyTarget ? `回复 ${replyTarget.nickname}` : '写评论...' }}
                </span>
            </div>
            <!-- 点赞快捷键 -->
            <div class="flex-shrink-0 flex align-items-center gap-1 cursor-pointer px-2"
                :class="post?.is_liked ? 'text-pink-400' : 'text-400'" @click="onLikePost">
                <van-icon :name="post?.is_liked ? 'like' : 'like-o'" size="22" />
            </div>
        </div>

        <!-- 评论输入弹层 -->
        <van-popup v-model:show="showCommentPopup" position="bottom" round
            :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }" @closed="clearReply">
            <div class="p-3">
                <!-- 回复提示 -->
                <div v-if="replyTarget"
                    class="flex align-items-center justify-content-between mb-2 pb-2 border-bottom-1 border-gray-100">
                    <span class="text-sm text-500">
                        回复 <strong class="text-900">{{ replyTarget.nickname }}</strong>
                    </span>
                    <van-icon name="cross" size="14" class="text-400 cursor-pointer" @click="clearReply" />
                </div>
                <!-- 输入框 -->
                <div class="flex align-items-end gap-2">
                    <van-field ref="commentFieldRef" v-model="commentText" type="textarea"
                        :placeholder="replyTarget ? `回复 ${replyTarget.nickname}...` : '写下你的评论...'" :rows="3"
                        maxlength="200" show-word-limit autofocus class="flex-1 border-round-lg"
                        style="background:#f7f4fc;" />
                    <van-button type="primary" size="small" round :loading="submitting" :disabled="!commentText.trim()"
                        style="background:linear-gradient(135deg,#7c5cbf,#e05c8a);border:none;flex-shrink:0;"
                        @click="submitComment">发送</van-button>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showConfirmDialog, showImagePreview } from 'vant'
import { useGlobal } from '@/utils/Global'
import { useCircleStore } from '@/store/circle'
import type { Post, Comment } from '@/store/circle'
import CommentItem from '@/components/circle/CommentItem.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'

const { axios, router, route } = useGlobal()
const circleStore = useCircleStore()

const postId = Number(route.params.id)
const defaultAvatar = '@@/images/default_avatar.png'

// ── 当前用户身份 ──────────────────────────────────────────────
const currentUserType = computed(() => circleStore.currentAuthorType)
const currentUserId = computed(() => circleStore.currentUserId)

// ── 贴文数据 ──────────────────────────────────────────────────
const post = ref<Post | null>(null)
const postLoading = ref(true)

async function fetchPost() {
    postLoading.value = true
    try {
        const res = await axios.get('circle/post_detail', { id: postId }, { toast: 0 })
        post.value = res?.data?.detail ?? null
    } catch {
        ElMessage.error('加载失败')
    } finally {
        postLoading.value = false
    }
}

// ── 删除贴文权限 ──────────────────────────────────────────────
const canDeletePost = computed(() => {
    if (!post.value || !circleStore.isLogged) return false
    // worker 可删任意；本人可删自己的
    if (circleStore.isWorker) return true
    return post.value.author.id === currentUserId.value
})

async function onDeletePost() {
    try {
        await showConfirmDialog({ title: '确认删除', message: '删除后无法恢复' })
        await axios.post('circle/delete_post', { id: postId }, { toast: 0 })
        ElMessage.success('已删除')
        router.back()
    } catch { }
}

// ── 点赞贴文 ─────────────────────────────────────────────────
async function onLikePost() {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    if (!post.value) return
    const nextLiked = !post.value.is_liked
    post.value.is_liked = nextLiked
    post.value.like_count += nextLiked ? 1 : -1
    // 同步列表页 store
    // circleStore.syncPostLike(postId, post.value.is_liked, post.value.like_count)
    try {
        await axios.post('circle/like', { target_type: 'post', target_id: postId, action: nextLiked ? 'like' : 'unlike' }, { toast: 0 })
    } catch {
        post.value.is_liked = !nextLiked
        post.value.like_count += nextLiked ? -1 : 1
        // circleStore.syncPostLike(postId, post.value.is_liked, post.value.like_count)
        ElMessage.error('操作失败')
    }
}

// ── 评论数据 ──────────────────────────────────────────────────
const comments = ref<Comment[]>([])
const commentPage = ref(1)
const commentLoading = ref(false)
const commentFinished = ref(false)
const commentFirstLoad = ref(true)
const COMMENT_PAGE_SIZE = 15

async function loadComments() {
    if (commentLoading.value || commentFinished.value) return
    commentLoading.value = true
    try {
        const res = await axios.get('circle/comments', {
            post_id: postId,
            page: commentPage.value,
            page_size: COMMENT_PAGE_SIZE,
        }, { toast: 0 })
        const list: Comment[] = res?.data?.list ?? []
        comments.value.push(...list)
        commentPage.value++
        if (list.length < COMMENT_PAGE_SIZE) commentFinished.value = true
    } catch {
        commentFinished.value = true
    } finally {
        commentLoading.value = false
        commentFirstLoad.value = false
    }
}

// ── 点赞评论 ─────────────────────────────────────────────────
async function onLikeComment(commentId: number, currentLiked: boolean) {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    const target = findComment(commentId)
    if (!target) return
    const nextLiked = !currentLiked
        ; (target as any).is_liked = nextLiked
        ; (target as any).like_count = ((target as any).like_count ?? 0) + (nextLiked ? 1 : -1)
    try {
        await axios.post('circle/like', { target_type: 'comment', target_id: commentId, action: nextLiked ? 'like' : 'unlike' }, { toast: 0 })
    } catch {
        ; (target as any).is_liked = currentLiked
            ; (target as any).like_count = ((target as any).like_count ?? 0) + (nextLiked ? -1 : 1)
        ElMessage.error('操作失败')
    }
}

function findComment(id: number): Comment | undefined {
    for (const c of comments.value) {
        if (c.id === id) return c
        const r = c.replies?.find(r => r.id === id)
        if (r) return r
    }
}

// ── 删除评论 ─────────────────────────────────────────────────
function canDeleteComment(comment: Comment): boolean {
    if (!circleStore.isLogged) return false
    if (circleStore.isWorker) return true
    return comment.author.id === currentUserId.value
}

async function onDeleteComment(commentId: number) {
    try {
        await showConfirmDialog({ title: '确认删除该评论？' })
        await axios.post('circle/delete_comment', { id: commentId }, { toast: 0 })
        // 从列表中移除
        const idx = comments.value.findIndex(c => c.id === commentId)
        if (idx !== -1) {
            comments.value.splice(idx, 1)
        } else {
            for (const c of comments.value) {
                const rIdx = c.replies?.findIndex(r => r.id === commentId) ?? -1
                if (rIdx !== -1) { c.replies!.splice(rIdx, 1); break }
            }
        }
        if (post.value) post.value.comment_count = Math.max(0, post.value.comment_count - 1)
        ElMessage.success('已删除')
    } catch { }
}

// ── 评论输入 ─────────────────────────────────────────────────
const showCommentPopup = ref(false)
const commentText = ref('')
const submitting = ref(false)
const replyTarget = ref<{ id: number; nickname: string; parentId: number } | null>(null)

function openCommentPopup() {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    showCommentPopup.value = true
}

function onReply(comment: Comment) {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    replyTarget.value = {
        id: comment.id,
        nickname: comment.author.nickname,
        parentId: comment.id,
    }
    console.log('replyTarget', comment)
    showCommentPopup.value = true
}

function clearReply() {
    replyTarget.value = null
    commentText.value = ''
}

async function submitComment() {
    const content = commentText.value.trim()
    if (!content) return
    submitting.value = true
    try {
        const res = await axios.post('circle/create_comment', {
            post_id: postId,
            content,
            parent_id: replyTarget.value?.parentId ?? 0,
        }, { toast: 0 })

        const newComment: Comment = res?.data?.comment
        if (newComment) {
            if (!replyTarget.value) {
                // 一级评论插到顶部
                comments.value.unshift(newComment)
            } else {
                // 二级回复：找到父评论并插入 replies
                const parentIdx = comments.value.findIndex(c => c.id === replyTarget.value!.parentId)
                if (parentIdx !== -1) {
                    // 用 splice 触发响应式更新
                    const parent = comments.value[parentIdx]
                    const newReplies = [...(parent.replies ?? []), newComment]
                    comments.value.splice(parentIdx, 1, { ...parent, replies: newReplies })
                }
            }
            if (post.value) post.value.comment_count++
        }
        commentText.value = ''
        showCommentPopup.value = false
        clearReply()
        ElMessage.success('评论成功')
    } catch {
        ElMessage.error('评论失败，请重试')
    } finally {
        submitting.value = false
    }
}

// ── 作者角色工具函数 ──────────────────────────────────────────
function authorDotColor(author: any): string {
    if (author.badge === 'expert') return '#f97316'
    if (author.badge === 'worker') return '#10b981'
    return '#7c5cbf'
}
function authorBadgeClass(author: any): string {
    if (author.badge === 'expert') return 'text-orange-500 bg-orange-50'
    if (author.badge === 'worker') return 'text-green-600 bg-green-50'
    return ''
}
function authorBadgeLabel(author: any): string {
    if (author.badge === 'expert') return '✦ 专家'
    if (author.badge === 'worker') return '员工'
    return ''
}

// ── 时间格式化 ───────────────────────────────────────────────
function formatTime(ts: number): string {
    const now = moment(), t = moment.unix(ts)
    const diffM = now.diff(t, 'minutes'), diffH = now.diff(t, 'hours'), diffD = now.diff(t, 'days')
    if (diffM < 1) return '刚刚'
    if (diffM < 60) return `${diffM}分钟前`
    if (diffH < 24) return `${diffH}小时前`
    if (diffD < 7) return `${diffD}天前`
    return t.format('MM-DD HH:mm')
}

function previewImage(images: string[], startIndex: number) {
    showImagePreview({ images, startPosition: startIndex })
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    await fetchPost()
    await loadComments()
})
</script>

<style scoped>
.post-detail-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 70px;
}

/* 图片九宫格 */
.image-grid {
    display: grid;
    gap: 3px;
    border-radius: 8px;
    overflow: hidden;
}

.image-grid.grid-1 {
    grid-template-columns: 1fr;
}

.image-grid.grid-1 .image-cell {
    height: 220px;
}

.image-grid.grid-2 {
    grid-template-columns: repeat(2, 1fr);
}

.image-grid.grid-2 .image-cell {
    height: 150px;
}

.image-grid.grid-3,
.image-grid.grid-4,
.image-grid.grid-5,
.image-grid.grid-6,
.image-grid.grid-7,
.image-grid.grid-8,
.image-grid.grid-9 {
    grid-template-columns: repeat(3, 1fr);
}

.image-grid.grid-3 .image-cell,
.image-grid.grid-4 .image-cell,
.image-grid.grid-5 .image-cell,
.image-grid.grid-6 .image-cell,
.image-grid.grid-7 .image-cell,
.image-grid.grid-8 .image-cell,
.image-grid.grid-9 .image-cell {
    height: 110px;
}

.image-cell {
    position: relative;
    background: #f0ebff;
}

.image-cell :deep(.van-image) {
    width: 100%;
    height: 100%;
}

.image-more {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
}
</style>
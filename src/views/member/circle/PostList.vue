<template>
    <div class="post-list-page">

        <!-- 搜索栏 -->
        <div class="surface-0 border-bottom-1 border-gray-100 px-3 py-2 sticky top-0 z-2">
            <van-search
                v-model="keyword"
                placeholder="搜索帖子内容..."
                shape="round"
                background="transparent"
                @search="onSearch"
                @clear="onSearchClear"
            />
        </div>

        <!-- 标签筛选栏 -->
        <div class="surface-0 border-bottom-1 border-gray-100 sticky z-2" style="top:54px;">
            <div class="flex align-items-center gap-2 px-3 py-2 overflow-x-auto" style="scrollbar-width:none;">
                <!-- 全部 -->
                <div
                    class="flex-shrink-0 px-3 border-round-3xl text-sm font-medium cursor-pointer transition-all transition-duration-200"
                    style="padding-top:5px;padding-bottom:5px;"
                    :class="activeTag === '' ? 'bg-purple-500 text-white' : 'surface-100 text-500'"
                    @click="setTag('')"
                >全部</div>

                <!-- 热门标签 -->
                <div
                    v-for="item in hotTags.slice(0, 8)" :key="item.tag"
                    class="flex-shrink-0 px-3 border-round-3xl text-sm font-medium cursor-pointer transition-all transition-duration-200"
                    style="padding-top:5px;padding-bottom:5px;"
                    :class="activeTag === item.tag ? 'bg-purple-500 text-white' : 'surface-100 text-500'"
                    @click="setTag(item.tag)"
                >{{ item.tag }}</div>

                <!-- 更多标签按钮 -->
                <div
                    v-if="hotTags.length > 8"
                    class="flex-shrink-0 flex align-items-center gap-1 px-3 border-round-3xl text-sm cursor-pointer surface-100 text-400"
                    style="padding-top:5px;padding-bottom:5px;"
                    @click="showTagDrawer = true"
                >
                    <van-icon name="apps-o" size="14" />
                    <span>更多</span>
                </div>
            </div>
        </div>

        <!-- 骨架屏 -->
        <template v-if="isFirstLoad">
            <div v-for="i in 4" :key="i" class="surface-0 mb-2 p-3">
                <van-skeleton :row="3" avatar avatar-size="40px" />
            </div>
        </template>

        <!-- 贴文列表 -->
        <van-list
            v-if="!isFirstLoad"
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <PostCard
                v-for="post in posts" :key="post.id"
                :post="post"
                @like="onLike"
                @click-post="goDetail"
            />
            <div v-if="!loading && posts.length === 0" class="flex flex-column align-items-center py-8">
                <van-empty image="search" :description="keyword ? `没有找到「${keyword}」相关内容` : '暂无内容，来发布第一篇吧'">
                    <van-button v-if="circleStore.isLogged && !keyword" round type="primary" size="small" @click="goCreate">
                        去发布
                    </van-button>
                </van-empty>
            </div>
        </van-list>

        <!-- 未登录提示 -->
        <div
            v-if="!circleStore.isLogged"
            class="fixed left-0 right-0 flex align-items-center justify-content-center gap-2 px-3 surface-0 border-top-1 border-gray-100"
            style="bottom:56px;padding-top:8px;padding-bottom:8px;z-index:98;"
        >
            <span class="text-sm text-500">登录后可发布贴文、点赞和评论</span>
            <van-button size="mini" type="primary" round @click="goLogin">立即登录</van-button>
        </div>

        <!-- 悬浮发布按钮 -->
        <div
            v-if="circleStore.isLogged"
            class="fixed border-circle flex align-items-center justify-content-center shadow-4 cursor-pointer"
            style="right:20px;bottom:76px;width:52px;height:52px;background:linear-gradient(135deg,#7c5cbf,#e05c8a);z-index:99;"
            @click="goCreate"
        >
            <van-icon name="plus" size="22" color="#fff" />
        </div>

        <!-- 全部标签 Drawer -->
        <van-popup
            v-model:show="showTagDrawer"
            position="bottom"
            round
            :style="{ maxHeight: '70vh' }"
        >
            <div class="p-3">
                <div class="flex align-items-center justify-content-between mb-3">
                    <span class="font-bold text-base text-900">全部标签</span>
                    <van-icon name="cross" size="18" class="text-400 cursor-pointer" @click="showTagDrawer = false" />
                </div>
                <div class="flex flex-wrap gap-2" style="max-height:50vh;overflow-y:auto;">
                    <div
                        v-for="item in hotTags" :key="item.tag"
                        class="flex align-items-center gap-1 px-3 border-round-3xl text-sm cursor-pointer transition-all transition-duration-200"
                        style="padding-top:6px;padding-bottom:6px;"
                        :class="activeTag === item.tag ? 'bg-purple-500 text-white' : 'surface-100 text-600'"
                        @click="selectTagFromDrawer(item.tag)"
                    >
                        <span># {{ item.tag }}</span>
                        <span class="text-xs opacity-60">{{ item.count }}</span>
                    </div>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobal } from '@/utils/Global'
import { useCircleStore } from '@/store/circle'
import type { Post } from '@/store/circle'
import PostCard from '@/components/circle/PostCard.vue'
import { ElMessage } from 'element-plus'

const { axios, router } = useGlobal()
const circleStore = useCircleStore()

// ── 状态 ─────────────────────────────────────────────────────
const posts       = ref<Post[]>([])
const page        = ref(1)
const loading     = ref(false)
const finished    = ref(false)
const refreshing  = ref(false)
const isFirstLoad = ref(true)
const PAGE_SIZE   = 10

// ── 搜索 & 标签 ───────────────────────────────────────────────
const keyword      = ref('')
const activeTag    = ref('')
const hotTags      = ref<{ tag: string; count: number }[]>([])
const showTagDrawer = ref(false)

// ── 热门标签加载 ──────────────────────────────────────────────
async function loadHotTags() {
    try {
        const res = await axios.get('circle/hot_tags', { limit: 30 }, { toast: 0 })
        hotTags.value = res?.data?.list ?? []
    } catch {
        // 静默失败，不影响主流程
    }
}

// ── 标签切换 ─────────────────────────────────────────────────
async function setTag(tag: string) {
    if (activeTag.value === tag) return
    activeTag.value = tag
    keyword.value   = ''
    resetList()
    await loadPosts()
    isFirstLoad.value = false
}

function selectTagFromDrawer(tag: string) {
    showTagDrawer.value = false
    setTag(tag)
}

// ── 搜索 ─────────────────────────────────────────────────────
async function onSearch() {
    activeTag.value = ''
    resetList()
    await loadPosts()
    isFirstLoad.value = false
}

async function onSearchClear() {
    keyword.value = ''
    resetList()
    await loadPosts()
    isFirstLoad.value = false
}

// ── 加载 ─────────────────────────────────────────────────────
function resetList() {
    posts.value = []; page.value = 1; finished.value = false; loading.value = false
}

async function loadPosts() {
    if (loading.value || finished.value) return
    loading.value = true
    try {
        const params: Record<string, any> = { page: page.value, page_size: PAGE_SIZE }
        if (activeTag.value)  params.tag     = activeTag.value
        if (keyword.value)    params.keyword = keyword.value

        const res  = await axios.get('circle/posts', params, { toast: 0 })
        const list: Post[] = res?.data?.list ?? []
        posts.value.push(...list)
        page.value++
        if (list.length < PAGE_SIZE) finished.value = true
    } catch {
        ElMessage.error('加载失败，请重试')
        finished.value = true
    } finally {
        loading.value = false
    }
}

async function onLoad() {
    await loadPosts()
    isFirstLoad.value = false
}

// ── 点赞 ─────────────────────────────────────────────────────
async function onLike(postId: number, currentLiked: boolean) {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    const nextLiked = !currentLiked
    post.is_liked = nextLiked; post.like_count += nextLiked ? 1 : -1
    try {
        await axios.post('circle/like', { target_type: 'post', target_id: postId, action: nextLiked ? 'like' : 'unlike' }, { toast: 0 })
    } catch {
        post.is_liked = currentLiked; post.like_count += currentLiked ? 1 : -1
        ElMessage.error('操作失败')
    }
}

// ── 跳转 ─────────────────────────────────────────────────────
function goDetail(postId: number) { router.push({ name: 'circle_post_detail', params: { id: postId } }) }
function goCreate() { router.push({ name: 'circle_post_create' }) }
function goLogin()  { router.push({ name: 'login' }) }

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    // 并行加载热门标签和首屏帖子
    await Promise.all([loadHotTags(), loadPosts()])
    isFirstLoad.value = false
})
</script>

<style scoped>
.post-list-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 80px;
}
</style>
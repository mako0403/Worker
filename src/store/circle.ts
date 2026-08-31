// store/circle.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGlobalStore } from '@/store/global'

// ── 类型定义 ─────────────────────────────────────────────────

export type AuthorType = 'member' | 'worker'

export interface PostAuthor {
    type:     AuthorType
    id:       string
    nickname: string
    avatar:   string
    place?:   string    // ← 新增：员工职称，会员为空字符串
    badge?:   'expert' | 'worker' | null
}

export interface Post {
    id: number
    author: PostAuthor
    content: string
    images: string[]
    tags: string[]
    like_count: number
    comment_count: number
    is_liked: boolean   // 当前用户是否已点赞
    status: number
    create_time: number
}

export interface Comment {
    id: number
    post_id: number
    author: PostAuthor
    parent_id: number | null
    parent_author?: string  // 回复目标昵称（展示用）
    content: string
    status: number
    create_time: number
    replies?: Comment[]     // 二级回复列表
}

export interface Expert {
    id: number
    worker_id: number
    nickname: string        // 来自 erp_worker.fullname
    avatar: string          // 来自 erp_worker.headimg
    title: string
    speciality: string
    introduction: string
    consult_price: number
    consult_duration: number
    status: number
    rating: number
    consult_count: number
}

// ── Store ────────────────────────────────────────────────────

export const useCircleStore = defineStore('circle', () => {
    const globalStore = useGlobalStore()

    // ── 当前用户身份 ──────────────────────────────────────────
    const currentAuthorType = computed<AuthorType>(() => {
        return globalStore.userRole === 'worker' ? 'worker' : 'member'
    })

    const isExpert = computed<boolean>(() => {
        if (globalStore.userRole !== 'worker') return false
        const perms = Array.isArray(globalStore.userManager)
            ? globalStore.userManager
            : [globalStore.userManager]
        return perms.includes('expert')
    })

    const isWorker = computed<boolean>(() => {
        return globalStore.userRole === 'worker'
    })

    const isLogged = computed<boolean>(() => {
        return globalStore.isLogged === 1
    })

    // ── 贴文列表状态 ──────────────────────────────────────────
    const posts = ref<Post[]>([])
    const postPage = ref(1)
    const postFinished = ref(false)     // 是否已加载全部
    const postLoading = ref(false)

    function resetPosts() {
        posts.value = []
        postPage.value = 1
        postFinished.value = false
        postLoading.value = false
    }

    function appendPosts(newPosts: Post[]) {
        posts.value.push(...newPosts)
        postPage.value++
        if (newPosts.length === 0) postFinished.value = true
    }

    // ── 点赞状态缓存（本地乐观更新）─────────────────────────
    function togglePostLike(postId: number, liked: boolean) {
        const post = posts.value.find(p => p.id === postId)
        if (!post) return
        post.is_liked = liked
        post.like_count += liked ? 1 : -1
    }

    // ── 专家列表状态 ──────────────────────────────────────────
    const experts = ref<Expert[]>([])
    const expertLoading = ref(false)
    const expertFinished = ref(false)
    const expertPage = ref(1)

    function resetExperts() {
        experts.value = []
        expertPage.value = 1
        expertFinished.value = false
        expertLoading.value = false
    }

    function appendExperts(newExperts: Expert[]) {
        experts.value.push(...newExperts)
        expertPage.value++
        if (newExperts.length === 0) expertFinished.value = true
    }

    return {
        // 身份
        currentAuthorType,
        isExpert,
        isWorker,
        isLogged,

        // 贴文
        posts,
        postPage,
        postFinished,
        postLoading,
        resetPosts,
        appendPosts,
        togglePostLike,

        // 专家
        experts,
        expertLoading,
        expertFinished,
        expertPage,
        resetExperts,
        appendExperts,
    }
})
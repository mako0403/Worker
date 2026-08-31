<template>
    <div class="expert-list-page">

        <!-- 顶部英雄区 -->
        <div class="hero-section px-4 pt-4 pb-5">
            <div class="bg-blob-1" />
            <div class="bg-blob-2" />
            <div class="relative z-1">
                <van-button type="success" class="absolute" icon="smile-comment-o" size="small" round  style="top: 0px; right: 0px;" @click="router.push({ name: 'circle_consult_orders' })">我的预约</van-button>
                <div class="text-white font-bold mb-1" style="font-size:22px;">专家咨询</div>
                <div class="text-white opacity-80 text-sm">产康专家为你解答健康疑问</div>
                <!-- 搜索框 -->
                <div class="flex align-items-center gap-2 mt-3 px-3 border-round-xl" style="background:rgba(255,255,255,0.2);padding-top:10px;padding-bottom:10px;">
                    <van-icon name="search" size="16" color="rgba(255,255,255,0.8)" />
                    <input
                        v-model="keyword"
                        placeholder="搜索专家姓名或擅长领域..."
                        class="flex-1 border-none outline-none text-sm bg-transparent text-white"
                        style="color:#fff; placeholder-color:#fff;"
                        @input="onSearchInput"
                    />
                    <van-icon v-if="keyword" name="cross" size="14" color="rgba(255,255,255,0.8)" @click="clearSearch" />
                </div>
            </div>
        </div>

        <!-- 专业筛选栏 -->
        <div class="surface-0 border-bottom-1 border-gray-100 sticky z-2" style="top:0;">
            <div class="flex align-items-center gap-2 px-3 py-2 overflow-x-auto" style="scrollbar-width:none;">
                <div
                    v-for="f in SPECIALITY_FILTERS" :key="f.value"
                    class="flex-shrink-0 px-3 border-round-3xl text-sm font-medium cursor-pointer transition-all transition-duration-200"
                    style="padding-top:5px;padding-bottom:5px;"
                    :class="activeFilter === f.value ? 'bg-purple-500 text-white' : 'surface-100 text-500'"
                    @click="setFilter(f.value)"
                >{{ f.label }}</div>
            </div>
        </div>

        <!-- 骨架屏 -->
        <template v-if="isFirstLoad">
            <div v-for="i in 3" :key="i" class="surface-0 mb-2 p-3">
                <van-skeleton :row="3" avatar avatar-size="64px" />
            </div>
        </template>

        <!-- 专家列表 -->
        <van-list
            v-else
            v-model:loading="loading"
            :finished="finished"
            finished-text="已显示全部专家"
            @load="onLoad"
        >
            <ExpertCard
                v-for="expert in experts" :key="expert.id"
                :expert="expert"
                @click="goProfile(expert.id)"
            />
            <div v-if="!loading && experts.length === 0" class="flex justify-content-center py-8">
                <van-empty description="暂无专家，敬请期待" />
            </div>
        </van-list>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobal } from '@/utils/Global'
import { useCircleStore } from '@/store/circle'
import type { Expert } from '@/store/circle'
import ExpertCard from '@/components/circle/ExpertCard.vue'
import { ElMessage } from 'element-plus'

const { axios, router } = useGlobal()
const circleStore = useCircleStore()

// ── 状态 ─────────────────────────────────────────────────────
const experts     = ref<Expert[]>([])
const page        = ref(1)
const loading     = ref(false)
const finished    = ref(false)
const isFirstLoad = ref(true)
const PAGE_SIZE   = 10

// ── 搜索 & 筛选 ───────────────────────────────────────────────
const keyword      = ref('')
const activeFilter = ref('')
let   searchTimer: ReturnType<typeof setTimeout> | null = null

const SPECIALITY_FILTERS = [
    { label: '全部',     value: '' },
    { label: '产后康复', value: '产后康复' },
    { label: '母乳喂养', value: '母乳喂养' },
    { label: '营养饮食', value: '营养饮食' },
    { label: '心理健康', value: '心理健康' },
    { label: '骨盆修复', value: '骨盆修复' },
]

async function setFilter(value: string) {
    if (activeFilter.value === value) return
    activeFilter.value = value
    keyword.value = ''
    resetList()
    await loadExperts()
    isFirstLoad.value = false
}

function onSearchInput() {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(async () => {
        activeFilter.value = ''
        resetList()
        await loadExperts()
        isFirstLoad.value = false
    }, 400)
}

function clearSearch() {
    keyword.value = ''
    resetList()
    loadExperts()
    isFirstLoad.value = false
}

// ── 加载 ─────────────────────────────────────────────────────
function resetList() {
    experts.value = []; page.value = 1; finished.value = false; loading.value = false
}

async function loadExperts() {
    if (loading.value || finished.value) return
    loading.value = true
    try {
        const params: Record<string, any> = {
            page:      page.value,
            page_size: PAGE_SIZE,
        }
        if (activeFilter.value) params.speciality = activeFilter.value
        if (keyword.value)      params.keyword    = keyword.value

        const res  = await axios.get('circle/experts', params, { toast: 0 })
        const list: Expert[] = res?.data?.list ?? []
        experts.value.push(...list)
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
    await loadExperts()
    isFirstLoad.value = false
}

// ── 跳转 ─────────────────────────────────────────────────────
function goProfile(expertId: number) {
    router.push({ name: 'circle_expert_profile', params: { id: expertId } })
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    if (experts.value.length > 0) {
        isFirstLoad.value = false
        finished.value    = true
        return
    }
    await loadExperts()
    isFirstLoad.value = false
})
</script>

<style scoped>
.expert-list-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 80px;
}

/* 英雄区 */
.hero-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-blob-1 {
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    top: -60px; right: -40px;
}

.bg-blob-2 {
    position: absolute;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    bottom: -40px; left: -20px;
}
</style>
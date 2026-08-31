<template>
    <div class="expert-profile-page">

        <!-- 英雄头部 -->
        <div v-if="expert" class="hero-section px-4 pb-5 pt-4">
            <div class="bg-blob-1" />
            <div class="bg-blob-2" />
            <div class="relative z-1 flex align-items-end gap-4">
                <!-- 头像 -->
                <div class="relative flex-shrink-0">
                    <van-image
                        round width="80" height="80"
                        :src="expert.avatar || defaultAvatar"
                        fit="cover"
                        style="border:3px solid rgba(255,255,255,0.6);"
                    />
                    <div
                        class="absolute flex align-items-center justify-content-center border-round-lg"
                        style="bottom:-6px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);padding:2px 8px;white-space:nowrap;"
                    >
                        <span class="text-white font-bold" style="font-size:10px;">✦ 专家</span>
                    </div>
                </div>
                <!-- 基本信息 -->
                <div class="flex flex-column gap-2 pb-1">
                    <div class="text-white font-bold" style="font-size:20px;">{{ expert.nickname }}</div>
                    <div class="text-white opacity-80 text-sm">{{ expert.title }}</div>
                    <div class="flex align-items-center gap-3">
                        <div class="flex align-items-center gap-1">
                            <van-icon name="star" size="13" color="#f7ba2a" />
                            <span class="text-white text-sm font-semibold">{{ Number(expert.rating).toFixed(1) }}</span>
                        </div>
                        <div class="text-white opacity-70" style="font-size:12px;">·</div>
                        <span class="text-white opacity-80 text-xs">{{ expert.consult_count }} 次咨询</span>
                        <div v-if="expert.place" class="text-white opacity-70" style="font-size:12px;">·</div>
                        <span v-if="expert.place" class="text-white opacity-80 text-xs">{{ expert.place }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 加载中 -->
        <div v-else-if="pageLoading" class="flex justify-content-center py-8">
            <van-loading size="28" color="#764ba2" />
        </div>

        <!-- 主体内容 -->
        <div v-if="expert" class="flex flex-column gap-2">

            <!-- 擅长领域 -->
            <div class="surface-0 px-3 py-3">
                <div class="section-title mb-2">擅长领域</div>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="tag in specialityList" :key="tag"
                        class="text-sm px-3 border-round-xl font-medium"
                        style="color:#764ba2;background:#f0e8ff;padding-top:5px;padding-bottom:5px;"
                    >{{ tag }}</span>
                </div>
            </div>

            <!-- 个人简介 -->
            <div v-if="expert.introduction" class="surface-0 px-3 py-3">
                <div class="section-title mb-2">个人简介</div>
                <p class="text-sm text-700 line-height-3 m-0">{{ expert.introduction }}</p>
            </div>

            <!-- 专家贴文 -->
            <div class="surface-0 px-3 py-3">
                <div class="flex align-items-center justify-content-between mb-2">
                    <div class="section-title">TA 的分享</div>
                    <span class="text-xs text-400">{{ expertPosts.length }} 篇</span>
                </div>

                <template v-if="postsLoading">
                    <van-skeleton v-for="i in 2" :key="i" :row="2" class="mb-3" />
                </template>

                <template v-else-if="expertPosts.length > 0">
                    <div
                        v-for="post in expertPosts" :key="post.id"
                        class="flex flex-column gap-1 py-2 border-bottom-1 border-gray-50 cursor-pointer"
                        @click="goPostDetail(post.id)"
                    >
                        <!-- 内容预览 -->
                        <p
                            class="text-sm text-800 line-height-3 m-0"
                            style="-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;word-break:break-all;"
                        >{{ post.content }}</p>
                        <!-- 缩略图 -->
                        <div v-if="post.images && post.images.length > 0" class="flex gap-1 mt-1">
                            <van-image
                                v-for="(img, idx) in post.images.slice(0,3)" :key="idx"
                                :src="img" fit="cover" width="60" height="60"
                                class="border-round-lg overflow-hidden"
                            />
                        </div>
                        <!-- 时间 + 点赞 -->
                        <div class="flex align-items-center justify-content-between mt-1">
                            <span class="text-xs text-400">{{ formatTime(post.create_time) }}</span>
                            <div class="flex align-items-center gap-1 text-400 text-xs">
                                <van-icon name="like-o" size="12" />
                                <span>{{ post.like_count }}</span>
                            </div>
                        </div>
                    </div>
                </template>

                <div v-else class="flex justify-content-center py-3">
                    <van-empty description="暂无分享" image-size="60" />
                </div>
            </div>

            <!-- 预约时间选择 -->
            <div class="surface-0 px-3 py-3">
                <div class="section-title mb-3">选择预约时间</div>

                <!-- 日期（未来7天）-->
                <div class="flex gap-2 overflow-x-auto pb-1 mb-3" style="scrollbar-width:none;">
                    <div
                        v-for="d in dateOptions" :key="d.value"
                        class="flex flex-column align-items-center flex-shrink-0 border-round-xl cursor-pointer transition-all transition-duration-200"
                        style="width:52px;padding:8px 0;"
                        :class="selectedDate === d.value
                            ? 'text-white'
                            : 'surface-100 text-500'"
                        :style="selectedDate === d.value ? 'background:linear-gradient(135deg,#667eea,#764ba2);' : ''"
                        @click="selectDate(d.value)"
                    >
                        <span class="text-xs mb-1">{{ d.weekday }}</span>
                        <span class="font-bold" style="font-size:18px;line-height:1.2;">{{ d.day }}</span>
                        <span class="text-xs mt-1">{{ d.month }}</span>
                    </div>
                </div>

                <!-- 时段 -->
                <div class="grid mb-3 mx-1" style="grid-template-columns:repeat(4,1fr);gap:8px;">
                    <div
                        v-for="slot in timeSlots" :key="slot.value"
                        class="flex align-items-center justify-content-center border-round-lg text-sm cursor-pointer transition-all transition-duration-200"
                        style="padding:5px 8px;"
                        :class="slot.disabled
                            ? 'surface-100 text-300'
                            : selectedTime === slot.value
                                ? 'text-white'
                                : 'surface-100 text-600'"
                        :style="selectedTime === slot.value && !slot.disabled ? 'background:linear-gradient(135deg,#667eea,#764ba2);' : ''"
                        @click="!slot.disabled && selectTime(slot.value)"
                    >
                        {{ slot.label }}
                    </div>
                </div>

                <!-- 已选汇总 -->
                <div
                    v-if="selectedDate && selectedTime"
                    class="flex align-items-center gap-2 border-round-lg px-3 py-2"
                    style="background:#f0e8ff;"
                >
                    <van-icon name="clock-o" size="15" color="#764ba2" />
                    <span class="text-sm font-medium" style="color:#764ba2;">{{ bookingSummary }}</span>
                </div>
            </div>

            <!-- 底部占位 -->
            <div style="height:90px;" />
        </div>

        <!-- 底部预约栏 -->
        <div
            v-if="expert"
            class="fixed left-0 right-0 flex align-items-center justify-content-between px-4 surface-0 border-top-1 border-gray-100"
            style="bottom:0;padding-top:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));z-index:100;"
        >
            <div class="flex flex-column gap-1">
                <span class="text-xs text-400">咨询费用</span>
                <div class="flex align-items-baseline gap-1">
                    <span class="text-sm font-semibold" style="color:#e05c8a;">¥</span>
                    <span class="font-bold" style="color:#e05c8a;font-size:24px;line-height:1;">{{ expert.consult_price }}</span>
                    <span class="text-xs text-400">/{{ expert.consult_duration }}分钟</span>
                </div>
            </div>
            <div
                class="flex align-items-center justify-content-center border-round-3xl font-bold text-white cursor-pointer transition-all transition-duration-200"
                style="width:150px;height:44px;font-size:15px;"
                :style="canBook
                    ? 'background:linear-gradient(135deg,#667eea,#764ba2);box-shadow:0 4px 16px rgba(124,92,191,0.4);'
                    : 'background:#e0d0f0;color:#bba8d8;cursor:not-allowed;'"
                @click="goConsult"
            >
                {{ canBook ? '立即预约' : '请选择时间' }}
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showImagePreview } from 'vant'
import { useGlobal } from '@/utils/Global'
import { useCircleStore } from '@/store/circle'
import type { Expert, Post } from '@/store/circle'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { ElMessage } from 'element-plus'

moment.locale('zh-cn')

const { axios, router, route } = useGlobal()
const circleStore = useCircleStore()

const expertId      = Number(route.params.id)
const defaultAvatar = '@@/images/default_avatar.png'

// ── 专家数据 ──────────────────────────────────────────────────
const expert      = ref<Expert & { place?: string } | null>(null)
const pageLoading = ref(true)

async function fetchExpert() {
    pageLoading.value = true
    try {
        const res = await axios.get('circle/expert_detail', { id: expertId }, { toast: 0 })
        expert.value = res?.data?.detail ?? null
    } catch {
        ElMessage.error('加载失败')
    } finally {
        pageLoading.value = false
    }
}

// 擅长领域拆分（逗号分隔字符串）
const specialityList = computed(() =>
    expert.value?.speciality
        ? expert.value.speciality.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []
)

// ── 专家贴文 ──────────────────────────────────────────────────
const expertPosts  = ref<Post[]>([])
const postsLoading = ref(false)

async function fetchExpertPosts() {
    postsLoading.value = true
    try {
        const res = await axios.get('circle/posts', {
            page:        1,
            page_size:   5,
            author_type: 'worker',
            author_id:   String(expert.value?.worker_id ?? expertId),
        }, { toast: 0 })
        expertPosts.value = res?.data?.list ?? []
    } catch {
        // 静默失败
    } finally {
        postsLoading.value = false
    }
}

// ── 日期选项（未来7天）────────────────────────────────────────
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const dateOptions = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
        const m = moment().add(i, 'days')
        return {
            value:   m.format('YYYY-MM-DD'),
            weekday: i === 0 ? '今天' : i === 1 ? '明天' : WEEKDAYS[m.day()],
            day:     m.format('D'),
            month:   m.format('M') + '月',
        }
    })
)

// ── 时段选项 ─────────────────────────────────────────────────
const ALL_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

const timeSlots = computed(() => {
    const nowStr = moment().format('YYYY-MM-DD HH:mm')
    return ALL_SLOTS.map(t => {
        const slotStr = `${selectedDate.value} ${t}`
        const isPast  = selectedDate.value === moment().format('YYYY-MM-DD') && slotStr <= nowStr
        return { label: t, value: t, disabled: isPast }
    })
})

// ── 选择状态 ─────────────────────────────────────────────────
const selectedDate = ref(moment().format('YYYY-MM-DD'))
const selectedTime = ref('')

function selectDate(date: string) {
    selectedDate.value = date
    selectedTime.value = ''
}

function selectTime(time: string) {
    selectedTime.value = time
}

const canBook = computed(() =>
    circleStore.isLogged && !!selectedDate.value && !!selectedTime.value
)

const bookingSummary = computed(() => {
    if (!selectedDate.value || !selectedTime.value || !expert.value) return ''
    const d = moment(selectedDate.value).format('M月D日')
    const w = dateOptions.value.find(d => d.value === selectedDate.value)?.weekday ?? ''
    return `${d} ${w} ${selectedTime.value}，共 ${expert.value.consult_duration} 分钟`
})

// ── 跳转 ─────────────────────────────────────────────────────
function goConsult() {
    if (!circleStore.isLogged) { ElMessage.warning('请先登录'); return }
    if (!selectedDate.value || !selectedTime.value) { ElMessage.warning('请选择预约时间'); return }
    router.push({
        name:   'circle_consult_book',
        params: { id: expertId },
        query:  { date: selectedDate.value, time: selectedTime.value },
    })
}

function goPostDetail(postId: number) {
    router.push({ name: 'circle_post_detail', params: { id: postId } })
}

// ── 时间格式化 ───────────────────────────────────────────────
function formatTime(ts: number): string {
    const now = moment(), t = moment.unix(ts)
    const diffD = now.diff(t, 'days')
    if (diffD < 1)  return t.format('HH:mm')
    if (diffD < 7)  return `${diffD}天前`
    return t.format('MM-DD')
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    await fetchExpert()
    fetchExpertPosts()
})
</script>

<style scoped>
.expert-profile-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 90px;
}

/* 英雄区 */
.hero-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-blob-1 {
    position: absolute;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    top: -80px; right: -50px;
}

.bg-blob-2 {
    position: absolute;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -50px; left: -30px;
}

/* 区块标题 */
.section-title {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
}
</style>
<template>
    <div class="member-home">

        <!-- 顶部英雄区 -->
        <div class="hero-section">
            <div class="hero-blob-1" /><div class="hero-blob-2" />
            <div class="hero-content">

                <!-- 用户信息行 -->
                <div class="flex align-items-center gap-3 mb-4">
                    <div class="avatar-wrap">
                        <img
                            :src="avatarUrl || defaultAvatar"
                            class="member-avatar"
                            @error="onAvatarError"
                        />
                        <div class="avatar-dot" />
                    </div>
                    <div class="flex flex-column gap-1 flex-1 min-w-0">
                        <div class="text-white font-bold" style="font-size:18px;">
                            {{ globalStore.memberInfo.nickname || globalStore.memberInfo.fullname || '康复者' }}
                        </div>
                        <div class="flex align-items-center gap-2">
                            <span class="member-tag">普通会员</span>
                        </div>
                    </div>
                    <CheckIn @check-in-success="onCheckInSuccess" />
                </div>

                <!-- 统计数据行 -->
                <div class="stats-row">
                    <div class="stat-item">
                        <div class="stat-num">{{ circleData.post_count }}</div>
                        <div class="stat-label">发帖</div>
                    </div>
                    <div class="stat-div" />
                    <div class="stat-item">
                        <div class="stat-num">{{ circleData.like_received }}</div>
                        <div class="stat-label">获赞</div>
                    </div>
                    <div class="stat-div" />
                    <div class="stat-item">
                        <div class="stat-num">{{ circleData.comment_count }}</div>
                        <div class="stat-label">评论</div>
                    </div>
                    <div class="stat-div" />
                    <div class="stat-item">
                        <div class="stat-num">{{ Math.abs((globalStore.memberInfo as any).point || 0) }}</div>
                        <div class="stat-label">积分</div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 主体 -->
        <div class="home-body">

            <!-- 快捷入口 -->
            <div class="quick-grid">
                <RouterLink to="/member/circle" class="quick-item no-underline" style="background:#f0e8ff;">
                    <van-icon name="fire-o" size="22" color="#7c5cbf" />
                    <span class="quick-label" style="color:#7c5cbf;">圈子</span>
                </RouterLink>
                <RouterLink to="/member/circle/experts" class="quick-item no-underline" style="background:#fff3e0;">
                    <van-icon name="manager-o" size="22" color="#f97316" />
                    <span class="quick-label" style="color:#f97316;">专家咨询</span>
                </RouterLink>
                <RouterLink to="/member/aichat" class="quick-item no-underline" style="background:#eff6ff;">
                    <van-icon name="chat-o" size="22" color="#3b82f6" />
                    <span class="quick-label" style="color:#3b82f6;">妈妈智问</span>
                </RouterLink>
                <RouterLink to="/member/workout/plan" class="quick-item no-underline" style="background:#e6f9f3;">
                    <van-icon name="medal-o" size="22" color="#10b981" />
                    <span class="quick-label" style="color:#10b981;">运动康复</span>
                </RouterLink>
            </div>

            <!-- 我的服务 -->
            <div class="section-card">
                <div class="section-hd">
                    <div class="section-dot" style="background:#f97316;" />
                    <span class="section-title">我的服务</span>
                    <span class="section-sub ml-2">{{ servicesLists?.length ?? 0 }} 项</span>
                </div>

                <template v-if="servicesLists && servicesLists.length > 0">
                    <van-swipe :autoplay="4000" indicator-color="#7c5cbf">
                        <van-swipe-item v-for="(item, idx) in servicesLists" :key="idx">
                            <RouterLink
                                :to="{ path: '/member/medical/appointment', query: { model_id: item.model_id, services_worker_id: item.services_worker_id }}"
                                class="service-card no-underline"
                            >
                                <img :src="item.model_cover" class="service-img" />
                                <div class="service-info">
                                    <div class="service-name">{{ item.model_name }}</div>
                                    <div v-if="item.worker_info" class="service-worker">
                                        <img :src="item.worker_info.headimg" class="worker-av" />
                                        <span>{{ item.worker_info.place }} {{ item.worker_info.fullname }}</span>
                                    </div>
                                    <div class="text-xs text-400 mt-1 line-height-3">
                                        {{ item.last_usage_time ? '最后预约 ' + item.last_usage_time : '尚未使用，可提前1日预约' }}
                                    </div>
                                    <div class="flex align-items-center gap-2 mt-2">
                                        <van-progress
                                            :percentage="Math.round((item.total_usage / item.total_purchase) * 100)"
                                            stroke-width="5" color="#7c5cbf" track-color="#f0e8ff"
                                            class="flex-1" pivot-text=""
                                        />
                                        <span class="text-xs text-400">{{ item.total_usage }}/{{ item.total_purchase }}</span>
                                    </div>
                                </div>
                                <van-icon name="arrow" size="14" color="#ccc" class="flex-shrink-0" />
                            </RouterLink>
                        </van-swipe-item>
                    </van-swipe>
                </template>
                <van-skeleton v-else :row="2" />
            </div>

            <!-- 预约记录 -->
            <div class="section-card">
                <div class="section-hd">
                    <div class="section-dot" style="background:#3b82f6;" />
                    <span class="section-title">预约记录</span>
                </div>
                <div class="apt-row">
                    <RouterLink to="/member/medical/appointment/lists" class="apt-item no-underline">
                        <div class="apt-num text-900">{{ totalAppointments }}</div>
                        <div class="apt-label">累计预约</div>
                    </RouterLink>
                    <RouterLink to="/member/medical/appointment/lists?status=0" class="apt-item no-underline">
                        <div class="apt-num text-orange-500">{{ pendingAppointments }}</div>
                        <div class="apt-label">待确认</div>
                    </RouterLink>
                    <RouterLink to="/member/medical/appointment/lists?status=7" class="apt-item no-underline">
                        <div class="apt-num text-pink-500">{{ waitEvaluate }}</div>
                        <div class="apt-label">待评价</div>
                    </RouterLink>
                </div>
                <div class="text-xs text-300 mt-2 text-center">评价后可获得积分 🎁</div>
            </div>

            <!-- 康复数据报告（方案三+方案四）-->
            <div class="section-card">
                <div class="section-hd mb-3">
                    <div class="section-dot" style="background:#7c5cbf;" />
                    <span class="section-title">康复报告 & 成就</span>
                </div>
                <BodyDataVisualizer />
            </div>

            <div style="height:24px;" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from '@/utils/axios'
import { useGlobalStore } from '@/store/global'
import CheckIn from '@/components/member/CheckIn.vue'
import BodyDataVisualizer from '@/components/member/BodyDataVisualizer.vue'
import defaultAvatarImg from '@@/images/default_avatar.webp'

const globalStore   = useGlobalStore()
const defaultAvatar = defaultAvatarImg

// ── 头像 ─────────────────────────────────────────────────────
const avatarUrl = computed(() => {
    const av = (globalStore.memberInfo as any)?.avatar
    return av ? globalStore.uploadsPath + av : ''
})
function onAvatarError(e: Event) {
    (e.target as HTMLImageElement).src = defaultAvatar
}

// ── 数据 ─────────────────────────────────────────────────────
const servicesLists    = ref<any[]>([])
const appointmentLists = ref<any[]>([])
const circleData       = ref({ post_count: 0, like_received: 0, comment_count: 0 })

const totalAppointments  = computed(() => (appointmentLists.value || []).flat().filter(i => i.status >= 0).length)
const pendingAppointments = computed(() => (appointmentLists.value || []).flat().filter(i => i.status == 0).length)
const waitEvaluate        = computed(() => (appointmentLists.value || []).flat().filter(i => i.status == 7).length)

function onCheckInSuccess(points: number) {
    console.log(`签到成功！获得 ${points} 积分`)
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    const cardNumber = (globalStore.memberInfo as any)?.card_number
    const bid        = (globalStore.memberInfo as any)?.bid

    await Promise.allSettled([

        // 服务列表
        axios.get('/services/member_services_lists', { bid, card_number: cardNumber, model: 'MedicalServices' }, { toast: 0 })
            .then(async res => {
                if (res?.data) {
                    servicesLists.value = res.data
                    const workers = await axios.get('/worker/lists', {}, { toast: 0 })
                    servicesLists.value.forEach((item: any) => {
                        item.worker_info = workers?.data?.find((w: any) => w.id === item.services_worker_id) ?? null
                    })
                }
            }).catch(() => {}),

        // 预约记录
        axios.get('/services/member_appointment_lists', { card_number: cardNumber, model: 'MedicalServices', type: 2 }, { toast: 0 })
            .then(res => { if (res?.data) appointmentLists.value = res.data }).catch(() => {}),

        // 圈子数据
        axios.get('member/circle_summary', { card_number: cardNumber }, { toast: 0 })
            .then(res => { if (res?.data) circleData.value = res.data }).catch(() => {}),

    ])
})
</script>

<style scoped>
.member-home { min-height: 100vh; background: #f7f4fc; }

/* 英雄区 */
.hero-section {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #5b3fa6 0%, #7c5cbf 60%, #9b7de0 100%);
    padding: 20px 16px 24px;
}
.hero-blob-1 {
    position: absolute; width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.07); top: -70px; right: -30px;
}
.hero-blob-2 {
    position: absolute; width: 130px; height: 130px; border-radius: 50%;
    background: rgba(255,255,255,0.05); bottom: -40px; left: 10px;
}
.hero-content { position: relative; z-index: 1; }

.avatar-wrap { position: relative; flex-shrink: 0; }
.member-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    object-fit: cover; border: 3px solid rgba(255,255,255,0.5);
}
.avatar-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 11px; height: 11px; border-radius: 50%;
    background: #10b981; border: 2px solid #fff;
}
.member-tag {
    font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 10px;
    background: rgba(255,255,255,0.2); color: #fff;
}

/* 统计行 */
.stats-row {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.12);
    border-radius: 14px; padding: 12px 0;
}
.stat-item { flex: 1; text-align: center; }
.stat-num  { font-size: 20px; font-weight: 800; color: #fff; line-height: 1; }
.stat-label { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 3px; }
.stat-div  { width: 1px; height: 26px; background: rgba(255,255,255,0.2); }

/* 主体 */
.home-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

/* 快捷入口 */
.quick-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.quick-item {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    padding: 12px 4px; border-radius: 14px; cursor: pointer;
}
.quick-label { font-size: 11px; font-weight: 600; }

/* 通用分区卡片 */
.section-card {
    background: #fff; border-radius: 16px;
    padding: 14px; border: 1px solid #f0e8ff;
}
.section-hd { display: flex; align-items: center; gap: 7px; margin-bottom: 12px; }
.section-dot { width: 4px; height: 16px; border-radius: 2px; flex-shrink: 0; }
.section-title { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.section-sub   { font-size: 12px; color: #bbb; }

/* 服务卡片 */
.service-card {
    display: flex; align-items: center; gap: 12px;
    background: #faf7ff; border-radius: 12px; padding: 12px;
}
.service-img { width: 58px; height: 58px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.service-info { flex: 1; min-width: 0; }
.service-name { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.service-worker {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #888; margin-top: 3px;
}
.worker-av { width: 16px; height: 16px; border-radius: 50%; object-fit: cover; }

/* 预约记录 */
.apt-row   { display: flex; justify-content: space-around; }
.apt-item  { flex: 1; text-align: center; padding: 4px 0; }
.apt-num   { font-size: 22px; font-weight: 800; line-height: 1; }
.apt-label { font-size: 11px; color: #aaa; margin-top: 3px; }
</style>
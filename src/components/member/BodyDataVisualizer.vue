<template>
    <div class="body-viz">

        <!-- 加载中 -->
        <div v-if="loading" class="flex justify-content-center py-5">
            <van-loading color="#7c5cbf" size="24" />
        </div>

        <!-- 无数据 -->
        <div v-else-if="!hasData" class="no-data">
            <div style="font-size:40px;">🌱</div>
            <div class="text-sm text-400 mt-2">完成第一次治疗后生成康复报告</div>
        </div>

        <template v-else>

            <!-- ══ 方案四：综合评分卡 ══════════════════════════ -->
            <div class="score-card">
                <!-- 左侧：大分数 -->
                <div class="score-left">
                    <div class="score-ring" :style="{ '--score': score, '--color': scoreLevel.color }">
                        <svg viewBox="0 0 80 80" class="score-svg">
                            <!-- 底圆 -->
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#f0e8ff" stroke-width="7" />
                            <!-- 进度圆 -->
                            <circle
                                cx="40" cy="40" r="34"
                                fill="none"
                                :stroke="scoreLevel.color"
                                stroke-width="7"
                                stroke-linecap="round"
                                :stroke-dasharray="`${score * 2.136} 213.6`"
                                stroke-dashoffset="53.4"
                                style="transition:stroke-dasharray 1s ease;"
                            />
                        </svg>
                        <div class="score-inner">
                            <div class="score-num">{{ score }}</div>
                            <div class="score-unit">分</div>
                        </div>
                    </div>
                    <div class="score-label" :style="{ color: scoreLevel.color }">
                        {{ scoreLevel.emoji }} {{ scoreLevel.label }}
                    </div>
                </div>

                <!-- 右侧：各项指标 -->
                <div class="score-right">
                    <div class="score-title">康复进度</div>
                    <div class="score-sessions">
                        累计治疗 <strong>{{ recoveryData.totalSessions || 0 }}</strong> 次
                    </div>
                    <div class="metrics-list">
                        <div v-for="m in displayMetrics" :key="m.key" class="metric-row">
                            <span class="metric-icon-sm">{{ m.icon }}</span>
                            <span class="metric-name-sm">{{ m.name }}</span>
                            <div class="metric-bar-wrap">
                                <div
                                    class="metric-bar-fill"
                                    :style="{
                                        width: m.percent + '%',
                                        background: m.color,
                                    }"
                                />
                            </div>
                            <span class="metric-tag" :style="{ color: m.color, background: m.bgColor }">
                                {{ m.tag }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ══ 方案三：成就徽章 ════════════════════════════ -->
            <div class="badges-section">
                <div class="badges-header">
                    <span class="badges-title">🏅 我的成就</span>
                    <span class="badges-count">
                        已解锁 <strong>{{ unlockedBadges.length }}</strong>/{{ BADGES.length }}
                    </span>
                </div>

                <!-- 分类 Tab -->
                <div class="category-tabs">
                    <div
                        v-for="cat in activeCategoryList" :key="cat.key"
                        class="cat-tab"
                        :class="{ 'cat-tab--active': activeCategory === cat.key }"
                        @click="activeCategory = cat.key"
                    >
                        {{ cat.icon }} {{ cat.label }}
                    </div>
                </div>

                <!-- 徽章宫格 -->
                <div class="badge-grid">
                    <div
                        v-for="badge in filteredBadges" :key="badge.id"
                        class="badge-item"
                        :class="{ 'badge-item--locked': !isUnlocked(badge.id) }"
                        @click="showBadgeDetail(badge)"
                    >
                        <!-- 徽章图标 -->
                        <div
                            class="badge-icon-wrap"
                            :style="isUnlocked(badge.id) ? {
                                background: LEVEL_CONFIG[badge.level].bg,
                                border: `2px solid ${LEVEL_CONFIG[badge.level].border}`,
                                boxShadow: `0 4px 12px ${LEVEL_CONFIG[badge.level].glow}`,
                            } : {}"
                        >
                            <span class="badge-emoji" :class="{ 'badge-emoji--locked': !isUnlocked(badge.id) }">
                                {{ badge.icon }}
                            </span>
                            <!-- 级别角标 -->
                            <div
                                v-if="isUnlocked(badge.id)"
                                class="badge-level-tag"
                                :style="{ background: LEVEL_CONFIG[badge.level].gradient }"
                            >{{ LEVEL_CONFIG[badge.level].label }}</div>
                            <!-- 锁图标 -->
                            <div v-else class="badge-lock">🔒</div>
                        </div>
                        <div class="badge-name" :class="{ 'text-500 font-normal': !isUnlocked(badge.id) }">
                            {{ badge.name }}
                        </div>
                    </div>
                </div>

                <!-- 查看全部 -->
                <div
                    v-if="filteredBadges.length < BADGES.filter(b => activeCategory === 'all' || b.category === activeCategory).length"
                    class="see-all"
                    @click="showAll = !showAll"
                >
                    {{ showAll ? '收起' : '查看全部徽章' }} {{ showAll ? '↑' : '↓' }}
                </div>
            </div>

        </template>

        <!-- 徽章详情弹层 -->
        <van-popup
            v-model:show="showDetail"
            position="bottom"
            round
            :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
        >
            <div v-if="selectedBadge" class="badge-detail">
                <!-- 图标 -->
                <div
                    class="detail-icon-wrap"
                    :style="isUnlocked(selectedBadge.id) ? {
                        background: LEVEL_CONFIG[selectedBadge.level].bg,
                        border: `3px solid ${LEVEL_CONFIG[selectedBadge.level].border}`,
                        boxShadow: `0 8px 24px ${LEVEL_CONFIG[selectedBadge.level].glow}`,
                    } : { background: '#f5f5f5', border: '3px solid #eee' }"
                >
                    <span style="font-size:48px;">{{ selectedBadge.icon }}</span>
                </div>
                <!-- 名称 + 级别 -->
                <div class="detail-name">{{ selectedBadge.name }}</div>
                <div
                    class="detail-level"
                    :style="isUnlocked(selectedBadge.id)
                        ? { background: LEVEL_CONFIG[selectedBadge.level].gradient, color: '#fff' }
                        : { background: '#eee', color: '#aaa' }"
                >
                    {{ isUnlocked(selectedBadge.id) ? LEVEL_CONFIG[selectedBadge.level].label + '级成就' : '未解锁' }}
                </div>
                <!-- 描述 -->
                <div class="detail-desc">
                    {{ isUnlocked(selectedBadge.id) ? selectedBadge.unlockedDesc : selectedBadge.desc }}
                </div>
                <!-- 解锁时间 -->
                <div v-if="isUnlocked(selectedBadge.id)" class="detail-time">
                    解锁于 {{ getUnlockTime(selectedBadge.id) }}
                </div>
                <!-- 未解锁条件 -->
                <div v-else class="detail-condition">
                    <van-icon name="lock" size="14" color="#bbb" />
                    解锁条件：{{ selectedBadge.desc }}
                </div>
                <div class="detail-close" @click="showDetail = false">关闭</div>
            </div>
        </van-popup>

        <!-- 解锁庆祝弹窗 -->
        <van-popup
            v-model:show="showCelebration"
            :close-on-click-overlay="false"
            style="background:transparent;"
        >
            <div v-if="newBadge" class="celebration">
                <div class="celebration-card">
                    <div class="celebration-fireworks">🎊</div>
                    <div class="celebration-title">成就解锁！</div>
                    <div
                        class="celebration-icon"
                        :style="{
                            background: LEVEL_CONFIG[newBadge.level].bg,
                            border: `3px solid ${LEVEL_CONFIG[newBadge.level].border}`,
                            boxShadow: `0 8px 32px ${LEVEL_CONFIG[newBadge.level].glow}`,
                        }"
                    >
                        <span style="font-size:52px;">{{ newBadge.icon }}</span>
                    </div>
                    <div
                        class="celebration-level"
                        :style="{ background: LEVEL_CONFIG[newBadge.level].gradient }"
                    >{{ LEVEL_CONFIG[newBadge.level].label }}级</div>
                    <div class="celebration-name">{{ newBadge.name }}</div>
                    <div class="celebration-desc">{{ newBadge.unlockedDesc }}</div>
                    <div class="celebration-btn" @click="closeCelebration">太棒了！</div>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/utils/axios'
import { useGlobalStore } from '@/store/global'
import {
    BADGES, LEVEL_CONFIG, CATEGORY_CONFIG,
    computeRecoveryScore, getScoreLevel, detectNewBadges,
    type Badge, type UserData,
} from '@/utils/badges'
import moment from 'moment'

const globalStore = useGlobalStore()

// ── 数据 ─────────────────────────────────────────────────────
const loading    = ref(true)
const hasData    = ref(false)
const recoveryData = ref<UserData['recovery']>({
    totalSessions: 0, waistImprove: 0, leakageImprove: 0,
    diastasisImprove: 0, muscleImprove: 0, allNormal: false,
})
const userData = ref<UserData>({
    recovery:    { totalSessions: 0, waistImprove: 0, leakageImprove: 0, diastasisImprove: 0, muscleImprove: 0, allNormal: false },
    appointment: { total: 0, evaluated: 0 },
    circle:      { postCount: 0, likeReceived: 0, commentCount: 0 },
    checkin:     { totalDays: 0, consecutiveDays: 0 },
    consult:     { total: 0 },
    ai:          { totalChats: 0 },
    workout:     { totalVideos: 0, hasAccess: false },
})

// ── 评分 ─────────────────────────────────────────────────────
const score      = computed(() => computeRecoveryScore(userData.value))
const scoreLevel = computed(() => getScoreLevel(score.value))

// ── 指标展示 ─────────────────────────────────────────────────
const displayMetrics = computed(() => {
    const r = recoveryData.value
    return [
        {
            key: 'sessions', icon: '🏥', name: '治疗次数',
            percent: Math.min(100, r.totalSessions * 5),
            tag: `${r.totalSessions}次`,
            color: '#3b82f6', bgColor: '#eff6ff',
        },
        {
            key: 'waist', icon: '📏', name: '腰围改善',
            percent: Math.min(100, r.waistImprove * 12.5),
            tag: r.waistImprove > 0 ? `-${r.waistImprove}cm` : '待改善',
            color: r.waistImprove > 0 ? '#10b981' : '#f97316',
            bgColor: r.waistImprove > 0 ? '#e6f9f3' : '#fff3e0',
        },
        {
            key: 'leakage', icon: '💧', name: '漏尿改善',
            percent: Math.min(100, r.leakageImprove * 25),
            tag: r.leakageImprove >= 4 ? '已康复' : r.leakageImprove > 0 ? `↑${r.leakageImprove}级` : '待改善',
            color: r.leakageImprove >= 4 ? '#7c5cbf' : r.leakageImprove > 0 ? '#10b981' : '#f97316',
            bgColor: r.leakageImprove >= 4 ? '#f0e8ff' : r.leakageImprove > 0 ? '#e6f9f3' : '#fff3e0',
        },
        {
            key: 'muscle', icon: '⚡', name: '肌力提升',
            percent: Math.min(100, r.muscleImprove * 25),
            tag: r.muscleImprove > 0 ? `↑${r.muscleImprove}级` : '待改善',
            color: r.muscleImprove > 0 ? '#f97316' : '#bbb',
            bgColor: r.muscleImprove > 0 ? '#fff3e0' : '#f5f5f5',
        },
    ]
})

// ── 徽章 ─────────────────────────────────────────────────────
const unlockedBadges   = ref<{ badge_id: string; unlock_time: number }[]>([])
const activeCategory   = ref<string>('all')
const showAll          = ref(false)
const showDetail       = ref(false)
const selectedBadge    = ref<Badge | null>(null)
const showCelebration  = ref(false)
const newBadge         = ref<Badge | null>(null)
const celebrationQueue = ref<Badge[]>([])

// 分类 Tab（只显示有徽章的分类）
const activeCategoryList = computed(() => {
    const all = [{ key: 'all', icon: '🏅', label: '全部' }]
    const cats = Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
        key, icon: cfg.icon, label: cfg.label,
    }))
    return [...all, ...cats]
})

// 当前分类下的徽章列表
const filteredBadges = computed(() => {
    const list = activeCategory.value === 'all'
        ? BADGES
        : BADGES.filter(b => b.category === activeCategory.value)
    // 已解锁在前，未解锁在后
    const unlocked = list.filter(b => isUnlocked(b.id))
    const locked   = list.filter(b => !isUnlocked(b.id))
    const sorted   = [...unlocked, ...locked]
    return showAll.value ? sorted : sorted.slice(0, 9)
})

function isUnlocked(badgeId: string): boolean {
    return unlockedBadges.value.some(u => u.badge_id === badgeId)
}

function getUnlockTime(badgeId: string): string {
    const found = unlockedBadges.value.find(u => u.badge_id === badgeId)
    return found ? moment.unix(found.unlock_time).format('YYYY年M月D日') : ''
}

function showBadgeDetail(badge: Badge) {
    selectedBadge.value = badge
    showDetail.value    = true
}

// ── 庆祝动画 ─────────────────────────────────────────────────
function triggerCelebration(badge: Badge) {
    newBadge.value       = badge
    showCelebration.value = true
}

function closeCelebration() {
    showCelebration.value = false
    newBadge.value        = null
    // 如果队列里还有，继续弹
    if (celebrationQueue.value.length > 0) {
        setTimeout(() => {
            triggerCelebration(celebrationQueue.value.shift()!)
        }, 400)
    }
}

// ── 检测新徽章并上报 ─────────────────────────────────────────
async function checkAndUnlockBadges() {
    const alreadyUnlocked = unlockedBadges.value.map(u => u.badge_id)
    const newOnes         = detectNewBadges(userData.value, alreadyUnlocked)
    if (newOnes.length === 0) return

    for (const badge of newOnes) {
        try {
            const res = await axios.post('member/unlock_badge', { badge_id: badge.id }, { toast: 0 })
            if (!res?.data?.already_unlocked) {
                // 真正的新解锁，加入庆祝队列
                celebrationQueue.value.push(badge)
                // 同步到本地列表
                unlockedBadges.value.push({ badge_id: badge.id, unlock_time: Math.floor(Date.now() / 1000) })
            }
        } catch {}
    }

    // 逐一弹出庆祝动画
    if (celebrationQueue.value.length > 0) {
        triggerCelebration(celebrationQueue.value.shift()!)
    }
}

// ── 数据加载 ─────────────────────────────────────────────────
async function fetchAllData() {
    loading.value = true
    const cardNumber = (globalStore.memberInfo as any)?.card_number
    if (!cardNumber) { loading.value = false; return }

    await Promise.allSettled([
        // 康复数据
        axios.get('member/recovery_data', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data?.has_data) {
                    hasData.value        = true
                    recoveryData.value   = res.data
                    userData.value.recovery = {
                        totalSessions:    res.data.totalSessions    ?? 0,
                        waistImprove:     res.data.waist_improve     ?? 0,
                        leakageImprove:   res.data.leakage_improve   ?? 0,
                        diastasisImprove: res.data.diastasis_improve ?? 0,
                        muscleImprove:    res.data.muscle_improve    ?? 0,
                        allNormal:        res.data.all_normal        ?? false,
                    }
                }
            }).catch(() => {}),



        // 签到数据
        axios.get('member/checkin_summary', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data) userData.value.checkin = {
                    totalDays:       res.data.total_days       ?? 0,
                    consecutiveDays: res.data.consecutive_days ?? 0,
                }
            }).catch(() => {console.log('checkin_summary error')}),

        // 咨询数据
        axios.get('member/consult_count', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data) userData.value.consult.total = res.data.total ?? 0
            }).catch(() => {console.log('consult_count error')}),

        // AI 对话次数
        axios.get('member/ai_chat_count', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data) userData.value.ai.totalChats = res.data.total ?? 0
            }).catch(() => {console.log('ai_chat_count error')}),

        // 运动康复
        axios.get('video/getPlanList', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data) {
                    userData.value.workout.hasAccess   = res.data.has_access  ?? false
                    userData.value.workout.totalVideos = res.data.watched_count ?? 0
                }
            }).catch(() => {console.log('workout error')}),

        // 已解锁徽章
        axios.get('member/badges', { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data?.list) unlockedBadges.value = res.data.list
            }).catch(() => {console.log('badges error')}),

        // 圈子数据
        axios.get('member/circle_summary?t=' + Date.now(), { card_number: cardNumber }, { toast: 0 })
            .then(res => {
                if (res?.data) userData.value.circle = {
                    postCount:    res.data.post_count    ?? 0,
                    likeReceived: res.data.like_received ?? 0,
                    commentCount: res.data.comment_count ?? 0,
                }
            }).catch(() => {console.log('circle_summary error')}),
    ])

    loading.value = false

    // 检测并解锁新徽章
    await checkAndUnlockBadges()
}

onMounted(fetchAllData)
</script>

<style scoped>
.body-viz { display: flex; flex-direction: column; gap: 12px; }

/* ── 无数据 ──────────────────────────────────────────────── */
.no-data {
    display: flex; flex-direction: column; align-items: center;
    padding: 28px; background: #faf7ff;
    border-radius: 14px; border: 1px dashed #e8dcf8;
}

/* ── 方案四：评分卡 ──────────────────────────────────────── */
.score-card {
    display: flex; gap: 14px;
    background: #fff; border-radius: 18px;
    padding: 16px; border: 1px solid #f0e8ff;
}

/* 左侧圆形评分 */
.score-left { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
.score-ring { position: relative; width: 90px; height: 90px; }
.score-svg  { width: 90px; height: 90px; transform: rotate(-90deg); }
.score-inner {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.score-num  { font-size: 26px; font-weight: 900; color: #1a1a2e; line-height: 1; }
.score-unit { font-size: 11px; color: #aaa; }
.score-label { font-size: 12px; font-weight: 700; }

/* 右侧指标 */
.score-right { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.score-title    { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.score-sessions { font-size: 12px; color: #aaa; margin-bottom: 2px; }
.score-sessions strong { color: #7c5cbf; font-size: 15px; }

.metrics-list { display: flex; flex-direction: column; gap: 5px; }
.metric-row {
    display: flex; align-items: center; gap: 5px;
}
.metric-icon-sm { font-size: 13px; flex-shrink: 0; }
.metric-name-sm { font-size: 11px; color: #888; width: 52px; flex-shrink: 0; }
.metric-bar-wrap {
    flex: 1; height: 5px; background: #f0e8ff;
    border-radius: 3px; overflow: hidden;
}
.metric-bar-fill {
    height: 100%; border-radius: 3px;
    transition: width 0.8s ease;
}
.metric-tag {
    font-size: 10px; font-weight: 600;
    padding: 1px 6px; border-radius: 8px;
    white-space: nowrap; flex-shrink: 0;
}

/* ── 方案三：成就徽章 ────────────────────────────────────── */
.badges-section {
    background: #fff; border-radius: 18px;
    padding: 14px; border: 1px solid #f0e8ff;
}

.badges-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
}
.badges-title  { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.badges-count  { font-size: 12px; color: #aaa; }
.badges-count strong { color: #7c5cbf; font-size: 14px; }

/* 分类 Tab */
.category-tabs {
    display: flex; gap: 6px; overflow-x: auto;
    padding-bottom: 8px; margin-bottom: 10px;
    scrollbar-width: none;
}
.category-tabs::-webkit-scrollbar { display: none; }
.cat-tab {
    flex-shrink: 0; font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 20px;
    background: #f5f0fc; color: #aaa; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
}
.cat-tab--active { background: #7c5cbf; color: #fff; }

/* 徽章宫格 */
.badge-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}

.badge-item {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer;
}
.badge-item--locked { opacity: 0.55; }

.badge-icon-wrap {
    position: relative;
    width: 62px; height: 62px;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    background: #f5f5f5; border: 2px solid #eee;
    transition: box-shadow 0.2s;
}
.badge-icon-wrap:active { transform: scale(0.94); }

.badge-emoji { font-size: 28px; }
.badge-emoji--locked { filter: grayscale(1); }

.badge-level-tag {
    position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
    font-size: 9px; font-weight: 700; color: #fff;
    padding: 1px 7px; border-radius: 8px; white-space: nowrap;
}
.badge-lock {
    position: absolute; bottom: -4px; right: -4px;
    font-size: 12px;
}

.badge-name {
    font-size: 11px; font-weight: 600; color: #555;
    text-align: center; line-height: 1.3;
}

/* 查看全部 */
.see-all {
    text-align: center; margin-top: 10px;
    font-size: 12px; color: #7c5cbf; font-weight: 600;
    cursor: pointer;
}

/* ── 徽章详情弹层 ─────────────────────────────────────────── */
.badge-detail {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 28px 24px;
}
.detail-icon-wrap {
    width: 88px; height: 88px; border-radius: 24px;
    display: flex; align-items: center; justify-content: center;
}
.detail-name  { font-size: 20px; font-weight: 800; color: #1a1a2e; }
.detail-level {
    font-size: 12px; font-weight: 700; color: #fff;
    padding: 3px 14px; border-radius: 12px;
}
.detail-desc  { font-size: 14px; color: #555; text-align: center; line-height: 1.7; }
.detail-time  { font-size: 12px; color: #bbb; }
.detail-condition {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: #aaa;
}
.detail-close {
    margin-top: 8px; width: 100%; height: 46px;
    display: flex; align-items: center; justify-content: center;
    background: #f5f0fc; color: #7c5cbf; font-weight: 700;
    border-radius: 14px; cursor: pointer;
}

/* ── 庆祝弹窗 ────────────────────────────────────────────── */
.celebration {
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
}
.celebration-card {
    background: #fff; border-radius: 28px;
    padding: 32px 28px; width: 280px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes popIn {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
}
.celebration-fireworks { font-size: 36px; animation: bounce 0.6s infinite alternate; }
@keyframes bounce {
    from { transform: translateY(0); }
    to   { transform: translateY(-8px); }
}
.celebration-title {
    font-size: 13px; font-weight: 700; color: #aaa; letter-spacing: 2px; text-transform: uppercase;
}
.celebration-icon {
    width: 100px; height: 100px; border-radius: 28px;
    display: flex; align-items: center; justify-content: center;
    margin: 4px 0;
}
.celebration-level {
    font-size: 12px; font-weight: 700; color: #fff;
    padding: 3px 16px; border-radius: 12px;
}
.celebration-name  { font-size: 22px; font-weight: 900; color: #1a1a2e; }
.celebration-desc  { font-size: 14px; color: #666; text-align: center; line-height: 1.7; }
.celebration-btn {
    margin-top: 6px; width: 100%; height: 48px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #7c5cbf, #e05c8a);
    color: #fff; font-size: 16px; font-weight: 700;
    border-radius: 16px; cursor: pointer;
}
</style>
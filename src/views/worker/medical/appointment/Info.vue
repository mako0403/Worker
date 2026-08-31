<template>
    <div>

        <!-- ── 原有员工信息区 ──────────────────────────────────── -->
        <div class="text-center">
            <el-progress type="dashboard" :width="Number(165)" :stroke-width="Number(5)"
                :percentage="statistics.usage_number || 1" status="success">
                <template #default>
                    <el-avatar shape="circle" :size="150">
                        <img :src="store.uploadsPath + store.workerConfig.headimg" />
                    </el-avatar>
                </template>
            </el-progress>
            <div class="mt-2 text-3xl font-medium">{{ store.workerConfig.fullname }}</div>
            <div class="mt-2 text-base text-400">
                <span>{{ store.workerConfig.job_title }}</span>
                <span class="ml-1">{{ store.workerConfig.place }}</span>
            </div>
            <div class="mt-2 flex justify-content-center align-items-center">
                <el-rate v-model="statistics.rating" disabled show-score text-color="#ff9900"
                    score-template="{value} points" />
            </div>
        </div>

        <div class="mt-4">
            <el-row class="text-center" :gutter="0">
                <el-col :span="8">
                    <div class="statistic-card">
                        <RouterLink to="/worker/services/sales_records">
                            <el-statistic :value="Number(statistics.current_month_sales_count)" value-style="font-weight:500;">
                                <template #title><div class="text-xs">本月客单量</div></template>
                            </el-statistic>
                        </RouterLink>
                        <div class="statistic-footer mt-2">
                            <div class="footer-item text-xs">
                                <span class="text-400">收费总额</span>
                                <span class="text-red-400 ml-1">￥{{ statistics.current_month_sales_amount }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card border-x-1 border-200">
                        <RouterLink to="/worker/services/usage_records">
                            <el-statistic :value="Number(statistics.usage_number)" value-style="font-weight:500;">
                                <template #title><div class="text-xs">本月治疗量</div></template>
                            </el-statistic>
                        </RouterLink>
                        <div class="statistic-footer mt-2">
                            <div class="footer-item text-xs">
                                <span class="text-400">治疗量绩效</span>
                                <span class="text-red-400 ml-1">￥{{ statistics.usage_amount }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card">
                        <el-statistic
                            :value="Number((Number(statistics.sales_bonus) + Number(statistics.sales_award)).toFixed(2)) || 0"
                            value-style="font-weight:500;">
                            <template #title><div class="text-xs">业绩绩效</div></template>
                        </el-statistic>
                        <div class="statistic-footer mt-2">
                            <div class="footer-item text-xs">
                                <span class="text-400">绩效汇总</span>
                                <span class="text-red-400 ml-1">
                                    ￥{{ (Number(statistics.sales_bonus) + Number(statistics.sales_award) + Number(statistics.usage_amount)).toFixed(2) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="flex gap-3 mt-4">
            <div class="flex-1">
                <div class="block bg-gray-200 border-round-lg text-center pt-1 pb-1" style="height:65.52px" />
            </div>
            <div class="flex-1 text-center">
                <RouterLink to="/worker/member/record/1" class="block bg-purple-200 border-round-lg text-center pt-1 pb-1" @click="store.updateTabbarName('member-record')">
                    <el-badge :value="countRecordRule1" :hidden="!countRecordRule1" class="item" :offset="[-10,0]">
                        <img src="@@/icon/breastfeeding.png" width="70%" />
                    </el-badge>
                    <div class="text-xs text-white mt-1">喂养记录</div>
                </RouterLink>
            </div>
            <div class="flex-1 text-center">
                <RouterLink to="/worker/member/record/2" class="block bg-green-200 border-round-lg text-center pt-1 pb-1" @click="store.updateTabbarName('member-record')">
                    <el-badge :value="countRecordRule2" :hidden="!countRecordRule2" class="item" :offset="[-10,0]">
                        <img src="@@/icon/baby-head-with-a-small-heart-outline_300481.png" width="70%" />
                    </el-badge>
                    <div class="text-xs text-white mt-1">育儿记录</div>
                </RouterLink>
            </div>
            <div class="flex-1 text-center">
                <RouterLink to="/worker/member/record/3" class="block bg-orange-200 border-round-lg text-center pt-1 pb-1" @click="store.updateTabbarName('member-record')">
                    <el-badge :value="countRecordRule3" :hidden="!countRecordRule3" class="item" :offset="[-10,0]">
                        <img src="@@/icon/outline_300482.png" width="70%" />
                    </el-badge>
                    <div class="text-xs text-white mt-1">乳房健康</div>
                </RouterLink>
            </div>
            <div class="flex-1">
                <div class="block bg-gray-200 border-round-lg text-center pt-1 pb-1" style="height:65.52px" />
            </div>
        </div>

        <!-- ── 专家咨询预约提醒（仅专家显示）────────────────────── -->
        <div v-if="isExpert" class="consult-remind mt-4" @click="openConsultPanel">
            <div class="remind-left">
                <div class="remind-icon">👩‍⚕️</div>
                <div class="remind-text">
                    <div class="remind-title">专家咨询预约</div>
                    <div class="remind-sub">
                        {{ pendingCount > 0 ? `${pendingCount} 条待处理预约` : '暂无待处理预约' }}
                    </div>
                </div>
            </div>
            <div class="remind-right">
                <el-badge v-if="pendingCount > 0" :value="pendingCount" class="mr-2" />
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>

        <!-- ── 预约列表弹出层 ──────────────────────────────────── -->
        <van-popup
            v-model:show="showPanel"
            position="bottom"
            round
            :style="{ height: '80vh' }"
        >
            <div class="panel-wrap">

                <!-- 标题栏 -->
                <div class="panel-header">
                    <span class="panel-title">咨询预约管理</span>
                    <van-icon name="cross" size="18" class="text-400 cursor-pointer" @click="showPanel = false" />
                </div>

                <!-- 状态 Tab -->
                <div class="panel-tabs">
                    <div
                        v-for="tab in STATUS_TABS" :key="tab.value"
                        class="panel-tab"
                        :class="{ 'panel-tab--active': activeStatus === tab.value }"
                        @click="switchStatus(tab.value)"
                    >
                        {{ tab.label }}
                        <span v-if="tab.value === 1 && pendingCount > 0" class="tab-badge">{{ pendingCount }}</span>
                    </div>
                </div>

                <!-- 列表 -->
                <div class="panel-list">
                    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                        <van-list
                            v-model:loading="listLoading"
                            :finished="listFinished"
                            finished-text="没有更多了"
                            @load="loadOrders"
                        >
                            <!-- 空状态 -->
                            <div v-if="!listLoading && orders.length === 0" class="flex justify-content-center py-6">
                                <van-empty description="暂无预约记录" image-size="80" />
                            </div>

                            <!-- 预约卡片 -->
                            <div v-for="order in orders" :key="order.id" class="order-card">

                                <!-- 顶部：会员信息 + 状态 -->
                                <div class="flex align-items-center gap-2 mb-3">
                                    <van-image
                                        round width="40" height="40"
                                        :src="order.member_avatar || defaultAvatar"
                                        fit="cover" class="flex-shrink-0"
                                    />
                                    <div class="flex flex-column gap-1 flex-1 min-w-0">
                                        <span class="font-bold text-sm text-900">{{ order.display_name }}</span>
                                        <span class="text-xs text-400">{{ order.telphone }}</span>
                                    </div>
                                    <div
                                        class="flex-shrink-0 text-xs font-semibold px-2 border-round-xl"
                                        :class="statusClass(order.status)"
                                        style="padding-top:3px;padding-bottom:3px;"
                                    >{{ statusLabel(order.status) }}</div>
                                </div>

                                <!-- 预约时间 -->
                                <div
                                    class="flex align-items-center gap-2 border-round-lg px-3 py-2 mb-3"
                                    style="background:#f7f4fc;"
                                >
                                    <van-icon name="clock-o" size="14" color="#7c5cbf" />
                                    <span class="text-sm font-semibold" style="color:#7c5cbf;">
                                        {{ formatSchedule(order.scheduled_at) }}
                                    </span>
                                    <span class="text-xs text-400 ml-1">（{{ order.duration }}分钟）</span>
                                </div>

                                <!-- 备注 -->
                                <div v-if="order.remark" class="text-xs text-500 mb-2 line-height-3">
                                    <van-icon name="notes-o" size="12" class="mr-1" />{{ order.remark }}
                                </div>

                                <!-- 上传图片 -->
                                <div v-if="order.images && order.images.length > 0" class="flex gap-2 mb-3">
                                    <van-image
                                        v-for="(img, idx) in order.images.slice(0, 3)" :key="idx"
                                        :src="img" fit="cover" width="56" height="56"
                                        class="border-round-lg overflow-hidden"
                                        @click="previewImg(order.images, idx)"
                                    />
                                    <div
                                        v-if="order.images.length > 3"
                                        class="flex align-items-center justify-content-center border-round-lg text-xs"
                                        style="width:56px;height:56px;background:#f0e8ff;color:#7c5cbf;"
                                    >+{{ order.images.length - 3 }}</div>
                                </div>

                                <!-- 底部：费用 + 操作 -->
                                <div class="flex align-items-center justify-content-between border-top-1 border-gray-50 pt-2">
                                    <div class="flex align-items-baseline gap-1">
                                        <span class="text-xs text-400">咨询费</span>
                                        <span class="text-sm font-bold" style="color:#e05c8a;">¥{{ order.price }}</span>
                                    </div>
                                    <!-- 已支付：可标记完成 -->
                                    <div
                                        v-if="order.status === 1 || order.status === 2"
                                        class="text-xs px-3 border-round-3xl cursor-pointer font-semibold text-white"
                                        style="padding-top:6px;padding-bottom:6px;background:linear-gradient(135deg,#7c5cbf,#e05c8a);"
                                        @click="markFinished(order)"
                                    >标记完成</div>
                                </div>

                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>

            </div>
        </van-popup>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showImagePreview, showToast, showConfirmDialog } from 'vant'
import { useGlobal } from '@/utils/Global'
import moment from 'moment'

const { axios, store, ElMessage, showLoading, hideLoading } = useGlobal()

const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

// ── 原有数据 ──────────────────────────────────────────────────
const statistics     = ref<any>({})
const countRecordRule1 = ref(0)
const countRecordRule2 = ref(0)
const countRecordRule3 = ref(0)

// ── 专家咨询提醒 ──────────────────────────────────────────────
const isExpert    = ref(false)
const pendingCount = ref(0)
const showPanel   = ref(false)

const STATUS_TABS = [
    { label: '全部',   value: -1 },
    { label: '待处理', value: 1  },  // 已支付未完成
    { label: '咨询中', value: 2  },
    { label: '已完成', value: 3  },
    { label: '已取消', value: 4  },
]
const activeStatus = ref(-1)

// ── 列表数据 ──────────────────────────────────────────────────
const orders      = ref<any[]>([])
const page        = ref(1)
const listLoading = ref(false)
const listFinished = ref(false)
const refreshing  = ref(false)

function resetList() {
    orders.value    = []
    page.value      = 1
    listFinished.value = false
    listLoading.value  = false
}

async function loadOrders() {
    if (listLoading.value || listFinished.value) return
    listLoading.value = true
    try {
        const res = await axios.get('worker/worker_consult_orders', {
            status:    activeStatus.value,
            page:      page.value,
            page_size: 10,
        }, { toast: 0 })

        const list = res?.data?.list ?? []
        orders.value.push(...list)
        page.value++
        if (list.length < 10) listFinished.value = true
    } catch {
        listFinished.value = true
    } finally {
        listLoading.value = false
    }
}

async function onRefresh() {
    resetList()
    await loadOrders()
    refreshing.value = false
}

function switchStatus(val: number) {
    if (activeStatus.value === val) return
    activeStatus.value = val
    resetList()
}

// ── 打开弹层 ─────────────────────────────────────────────────
function openConsultPanel() {
    showPanel.value = true
    if (orders.value.length === 0) loadOrders()
}

// ── 标记完成 ─────────────────────────────────────────────────
async function markFinished(order: any) {
    try {
        await showConfirmDialog({ title: '确认完成？', message: `${order.display_name} 的咨询预约` })
        const res = await axios.post('circle/finish_consult', { id: order.id }, { toast: 0 })
        if (!res || res.status != 1) { showToast(res?.info || '操作失败'); return }
        showToast('已标记完成')
        // 更新本地状态
        const idx = orders.value.findIndex(o => o.id === order.id)
        if (idx !== -1) orders.value[idx].status = 3
        // 更新待处理数
        if (pendingCount.value > 0) pendingCount.value--
    } catch {}
}

// ── 图片预览 ─────────────────────────────────────────────────
function previewImg(images: string[], idx: number) {
    showImagePreview({ images, startPosition: idx })
}

// ── 工具函数 ─────────────────────────────────────────────────
function statusLabel(status: number): string {
    const map: Record<number, string> = { 0: '待支付', 1: '已支付', 2: '咨询中', 3: '已完成', 4: '已取消', 5: '已退款' }
    return map[status] ?? '未知'
}

function statusClass(status: number): string {
    if (status === 0) return 'text-orange-500 bg-orange-50'
    if (status === 1) return 'text-blue-500 bg-blue-50'
    if (status === 2) return 'text-purple-500 bg-purple-50'
    if (status === 3) return 'text-green-500 bg-green-50'
    return 'text-400 surface-100'
}

function formatSchedule(ts: number): string {
    return moment.unix(ts).format('YYYY年M月D日 HH:mm')
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    showLoading()
    try {
        // 原有数据
        const record1 = await axios.get('member/get_record_branch_lists', { method:'count', rule_id:1, bid: store.workerConfig.bid, worker_id: store.workerConfig.id }, { toast: 0 });
        countRecordRule1.value = record1.data;
        
        const record2 = await axios.get('member/get_record_branch_lists', { method:'count', rule_id:2, bid: store.workerConfig.bid, worker_id: store.workerConfig.id }, { toast: 0 });
        countRecordRule2.value = record2.data;   

        const record3 = await axios.get('member/get_record_branch_lists', { method:'count', rule_id:3, bid: store.workerConfig.bid, worker_id: store.workerConfig.id }, { toast: 0 });
        countRecordRule3.value = record3.data; 

        // 统计数据
        const statsRes = await axios.get('/services/get_all_workers_statistics', { worker_id: store.workerConfig.id, model: 'MedicalServices' }, { toast: 0 })
        if (statsRes?.data?.[0]?.statistics) statistics.value = statsRes.data[0].statistics

        // 专家咨询提醒
        const consultRes = await axios.get('worker/worker_consult_orders', { status: -1, page: 1, page_size: 1 }, { toast: 0 })
        if (consultRes?.data) {
            isExpert.value    = consultRes.data.is_expert
            pendingCount.value = consultRes.data.pending_count
        }

    } catch (e: any) {
        ElMessage.error(e?.message || '加载失败')
    }
    await new Promise(resolve => setTimeout(resolve, 500))
    hideLoading()
})
</script>

<style scoped>
/* ── 咨询提醒区块 ────────────────────────────────────────────── */
.consult-remind {
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, #f0e8ff, #fde8f0);
    border: 1px solid #e8dcf8;
    border-radius: 16px; padding: 14px 16px;
    cursor: pointer; transition: opacity 0.15s;
}
.consult-remind:active { opacity: 0.8; }

.remind-left  { display: flex; align-items: center; gap: 12px; }
.remind-icon  { font-size: 28px; }
.remind-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
.remind-sub   { font-size: 12px; color: #a78bcd; margin-top: 2px; }
.remind-right { display: flex; align-items: center; color: #7c5cbf; }

/* ── 弹出层 ──────────────────────────────────────────────────── */
.panel-wrap {
    display: flex; flex-direction: column; height: 100%;
}

.panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 16px 12px; flex-shrink: 0;
}
.panel-title { font-size: 16px; font-weight: 700; color: #1a1a2e; }

/* 状态 Tab */
.panel-tabs {
    display: flex; overflow-x: auto; padding: 0 12px 8px;
    border-bottom: 1px solid #f0e8ff; flex-shrink: 0;
    scrollbar-width: none;
}
.panel-tabs::-webkit-scrollbar { display: none; }

.panel-tab {
    flex-shrink: 0; font-size: 13px; font-weight: 500;
    padding: 6px 14px; border-radius: 20px; cursor: pointer;
    color: #aaa; position: relative; margin-right: 6px;
    transition: all 0.15s;
}
.panel-tab--active { background: #7c5cbf; color: #fff; font-weight: 700; }

.tab-badge {
    position: absolute; top: 0; right: 0;
    background: #e05c8a; color: #fff;
    font-size: 10px; font-weight: 700;
    min-width: 16px; height: 16px;
    border-radius: 8px; padding: 0 4px;
    display: flex; align-items: center; justify-content: center;
    transform: translate(6px, -4px);
}

/* 列表区 */
.panel-list {
    flex: 1; overflow-y: auto; padding: 12px;
}
.panel-list::-webkit-scrollbar { display: none; }

/* 预约卡片 */
.order-card {
    background: #fff; border-radius: 14px;
    padding: 14px; margin-bottom: 10px;
    border: 1px solid #f0e8ff;
}
</style>
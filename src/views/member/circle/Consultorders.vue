<template>
    <div class="consult-orders-page">

        <!-- 状态筛选 -->
        <div class="surface-0 border-bottom-1 border-gray-100 sticky top-0 z-2">
            <div class="flex align-items-center overflow-x-auto" style="scrollbar-width:none;">
                <div
                    v-for="f in STATUS_FILTERS" :key="f.value"
                    class="flex-shrink-0 px-4 py-3 text-sm font-medium cursor-pointer transition-all transition-duration-200 border-bottom-2"
                    :class="activeStatus === f.value
                        ? 'text-purple-500 border-purple-500'
                        : 'text-400 border-transparent'"
                    @click="setStatus(f.value)"
                >{{ f.label }}</div>
            </div>
        </div>

        <!-- 骨架屏 -->
        <template v-if="isFirstLoad">
            <div v-for="i in 3" :key="i" class="surface-0 mb-2 p-3">
                <van-skeleton :row="3" avatar avatar-size="48px" />
            </div>
        </template>

        <!-- 列表 -->
        <van-list
            v-else
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <div
                v-for="order in orders" :key="order.id"
                class="surface-0 mb-2 px-3 py-3"
            >
                <!-- 顶部：专家信息 + 状态 -->
                <div class="flex align-items-center gap-3 mb-3">
                    <van-image
                        round width="48" height="48"
                        :src="order.expert_avatar || defaultAvatar"
                        fit="cover"
                        class="flex-shrink-0"
                    />
                    <div class="flex flex-column gap-1 flex-1 min-w-0">
                        <span class="font-bold text-sm text-900">{{ order.expert_name }}</span>
                        <span class="text-xs font-medium" style="color:#764ba2;">{{ order.expert_title }}</span>
                    </div>
                    <!-- 状态标签 -->
                    <div
                        class="flex-shrink-0 text-xs font-semibold px-2 border-round-xl"
                        :class="statusClass(order.status)"
                        style="padding-top:3px;padding-bottom:3px;"
                    >{{ statusLabel(order.status) }}</div>
                </div>

                <!-- 预约详情 -->
                <div
                    class="flex flex-column gap-2 border-round-lg px-3 py-2 mb-3"
                    style="background:#f7f4fc;"
                >
                    <div class="flex align-items-center justify-content-between">
                        <span class="text-xs text-400">预约时间</span>
                        <span class="text-xs font-medium text-700">{{ formatSchedule(order.scheduled_at) }}</span>
                    </div>
                    <div class="flex align-items-center justify-content-between">
                        <span class="text-xs text-400">咨询时长</span>
                        <span class="text-xs text-700">{{ order.consult_duration }} 分钟</span>
                    </div>
                    <div class="flex align-items-center justify-content-between">
                        <span class="text-xs text-400">联系电话</span>
                        <span class="text-xs text-700">{{ order.telphone }}</span>
                    </div>
                    <div v-if="order.remark" class="flex align-items-start justify-content-between gap-3">
                        <span class="text-xs text-400 flex-shrink-0">备注</span>
                        <span class="text-xs text-600 text-right line-height-3">{{ order.remark }}</span>
                    </div>
                </div>

                <!-- 上传图片 -->
                <div v-if="order.images && order.images.length > 0" class="flex gap-2 mb-3">
                    <van-image
                        v-for="(img, idx) in order.images.slice(0, 4)" :key="idx"
                        :src="img" fit="cover" width="60" height="60"
                        class="border-round-lg overflow-hidden"
                        @click="previewImage(order.images, idx)"
                    />
                    <div
                        v-if="order.images.length > 4"
                        class="flex align-items-center justify-content-center border-round-lg text-400 text-xs"
                        style="width:60px;height:60px;background:#f0e8ff;color:#764ba2;"
                    >+{{ order.images.length - 4 }}</div>
                </div>

                <!-- 底部：金额 + 操作 -->
                <div class="flex align-items-center justify-content-between border-top-1 border-gray-50 pt-3">
                    <div class="flex align-items-baseline gap-1">
                        <span class="text-xs text-400">实付</span>
                        <span class="text-xs" style="color:#e05c8a;">¥</span>
                        <span class="font-bold" style="color:#e05c8a;font-size:16px;line-height:1;">
                            {{ Number(order.price).toFixed(2) }}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <!-- 待支付：重新支付 -->
                        <div
                            v-if="order.status == 0"
                            class="text-xs px-3 border-round-3xl cursor-pointer font-medium text-white"
                            style="padding-top:6px;padding-bottom:6px;background:linear-gradient(135deg,#ff6b6b,#ff8e53);"
                            @click="repay(order)"
                        >去支付</div>
                        <!-- 待支付：取消 -->
                        <div
                            v-if="order.status == 0"
                            class="text-xs px-3 border-round-3xl cursor-pointer font-medium text-400 surface-100"
                            style="padding-top:6px;padding-bottom:6px;"
                            @click="cancelOrder(order.id)"
                        >取消</div>
                    </div>
                </div>

                <!-- 下单时间 -->
                <div class="text-xs text-300 mt-2">下单时间：{{ formatTime(order.create_time) }}</div>
            </div>

            <!-- 空状态 -->
            <div v-if="!loading && orders.length === 0" class="flex justify-content-center py-8">
                <van-empty description="暂无咨询记录" />
            </div>
        </van-list>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showConfirmDialog, showImagePreview } from 'vant'
import { useGlobal } from '@/utils/Global'
import { useGlobalStore } from '@/store/global'
import { toRefs } from 'vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'

const { axios, router } = useGlobal()
const globalStore = useGlobalStore()
const { memberInfo } = toRefs(globalStore)

const defaultAvatar = '@@/images/default_avatar.png'

// ── 状态筛选 ─────────────────────────────────────────────────
const STATUS_FILTERS = [
    { label: '全部',   value: -1 },
    { label: '待支付', value: 0 },
    { label: '已支付', value: 1 },
    { label: '已完成', value: 3 },
    { label: '已取消', value: 4 },
]
const activeStatus = ref(-1)

async function setStatus(value: number) {
    if (activeStatus.value === value) return
    activeStatus.value = value
    resetList()
    await loadOrders()
    isFirstLoad.value = false
}

// ── 列表数据 ─────────────────────────────────────────────────
const orders      = ref<any[]>([])
const page        = ref(1)
const loading     = ref(false)
const finished    = ref(false)
const isFirstLoad = ref(true)
const PAGE_SIZE   = 10

function resetList() {
    orders.value = []; page.value = 1; finished.value = false; loading.value = false
}

async function loadOrders() {
    if (loading.value || finished.value) return
    loading.value = true
    try {
        const params: Record<string, any> = { page: page.value, page_size: PAGE_SIZE }
        if (activeStatus.value >= 0) params.status = activeStatus.value

        const res  = await axios.get('circle/consult_orders', params, { toast: 0 })
        const list = res?.data?.list ?? []
        orders.value.push(...list)
        page.value++
        if (list.length < PAGE_SIZE) finished.value = true
    } catch {
        ElMessage.error('加载失败')
        finished.value = true
    } finally {
        loading.value = false
    }
}

async function onLoad() {
    await loadOrders()
    isFirstLoad.value = false
}

// ── 重新支付 ─────────────────────────────────────────────────
async function repay(order: any) {
    if (!order.bill_no) {
        showToast('支付单号不存在，请联系客服')
        return
    }
    router.push({
        name:   'member_wx_pay',
        params: { no: order.bill_no },
        query:  { from: 'consult' },
    })
}

// ── 取消订单 ─────────────────────────────────────────────────
async function cancelOrder(orderId: number) {
    try {
        await showConfirmDialog({ title: '确认取消该预约？' })
        const res = await axios.post('circle/cancel_consult', { id: orderId }, { toast: 0 })
        if (!res || res.status != 1) { ElMessage.error(res?.info || '取消失败'); return }
        ElMessage.success('已取消')
        // 刷新列表
        resetList()
        await loadOrders()
        isFirstLoad.value = false
    } catch {}
}

// ── 图片预览 ─────────────────────────────────────────────────
function previewImage(images: string[], idx: number) {
    showImagePreview({ images, startPosition: idx })
}

// ── 工具函数 ─────────────────────────────────────────────────
function statusLabel(status: number): string {
    const map: Record<number, string> = {
        0: '待支付', 1: '已支付', 2: '咨询中', 3: '已完成', 4: '已取消', 5: '已退款'
    }
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

function formatTime(ts: number): string {
    return moment.unix(ts).format('MM-DD HH:mm')
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(async () => {
    await loadOrders()
    isFirstLoad.value = false
})
</script>

<style scoped>
.consult-orders-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 40px;
}
</style>
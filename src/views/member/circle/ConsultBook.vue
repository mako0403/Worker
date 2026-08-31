<template>
    <div class="consult-book-page">

        <!-- 加载中 -->
        <div v-if="pageLoading" class="flex justify-content-center py-8">
            <van-loading size="28" color="#764ba2" />
        </div>

        <template v-else-if="expert">

            <!-- 专家信息摘要 -->
            <div class="surface-0 flex align-items-center gap-3 px-3 py-3 mb-2">
                <van-image
                    round width="54" height="54"
                    :src="expert.avatar || defaultAvatar"
                    fit="cover"
                />
                <div class="flex flex-column gap-1 flex-1 min-w-0">
                    <div class="flex align-items-center gap-2">
                        <span class="font-bold text-base text-900">{{ expert.nickname }}</span>
                        <span
                            class="text-xs px-2 border-round-xl font-semibold flex-shrink-0"
                            style="color:#764ba2;background:#f0e8ff;padding-top:2px;padding-bottom:2px;"
                        >✦ 专家</span>
                    </div>
                    <span class="text-sm font-medium" style="color:#764ba2;">{{ expert.title }}</span>
                </div>
            </div>

            <!-- 预约信息 -->
            <div class="surface-0 px-3 py-3 mb-2">
                <div class="font-bold text-sm text-900 mb-3">预约信息</div>
                <div class="flex flex-column">
                    <div class="flex align-items-start justify-content-between py-2 border-bottom-1 border-gray-50">
                        <span class="text-sm text-400 flex-shrink-0">预约时间</span>
                        <span class="text-sm font-semibold text-right" style="color:#764ba2;">{{ bookingDateLabel }}</span>
                    </div>
                    <div class="flex align-items-center justify-content-between py-2 border-bottom-1 border-gray-50">
                        <span class="text-sm text-400">咨询时长</span>
                        <span class="text-sm text-700">{{ expert.consult_duration }} 分钟</span>
                    </div>
                    <div class="flex align-items-center justify-content-between py-2">
                        <span class="text-sm text-400">咨询方式</span>
                        <div class="flex align-items-center gap-1">
                            <van-icon name="phone-o" size="14" color="#764ba2" />
                            <span class="text-sm font-medium" style="color:#764ba2;">电话咨询</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 联系信息 -->
            <div class="surface-0 px-3 py-3 mb-2">
                <div class="font-bold text-sm text-900 mb-3">联系信息</div>

                <!-- 姓名 -->
                <div class="flex align-items-center border-bottom-1 border-gray-50 py-2">
                    <span class="text-sm text-400 flex-shrink-0" style="width:70px;">
                        姓名
                        <span class="text-pink-500 ml-1">*</span>
                    </span>
                    <van-field
                        v-model="form.fullname"
                        placeholder="请输入真实姓名"
                        :border="false"
                        class="flex-1 p-0"
                    />
                </div>

                <!-- 电话 -->
                <div class="flex align-items-center py-2">
                    <span class="text-sm text-400 flex-shrink-0" style="width:70px;">
                        电话
                        <span class="text-pink-500 ml-1">*</span>
                    </span>
                    <van-field
                        v-model="form.telphone"
                        type="tel"
                        placeholder="专家将通过此号码联系您"
                        :border="false"
                        class="flex-1 p-0"
                    />
                </div>
            </div>

            <!-- 咨询备注 -->
            <div class="surface-0 px-3 py-3 mb-2">
                <div class="font-bold text-sm text-900 mb-2">
                    咨询备注
                    <span class="text-xs text-300 font-normal ml-1">（选填）</span>
                </div>
                <van-field
                    v-model="form.remark"
                    type="textarea"
                    placeholder="请简要描述您的问题，方便专家提前了解..."
                    :rows="3"
                    maxlength="200"
                    show-word-limit
                    class="border-round-lg"
                    style="background:#f7f4fc;"
                />
            </div>

            <!-- 图片上传 -->
            <div class="surface-0 px-3 py-3 mb-2">
                <div class="font-bold text-sm text-900 mb-1">上传照片</div>
                <div class="text-xs text-400 mb-3">可上传相关病历、检查报告等（最多6张）</div>
                <ImageUploader
                    v-model="form.images"
                    :max="6"
                    upload-path="members/consult"
                />
            </div>

            <!-- 费用明细 -->
            <div class="surface-0 px-3 py-3 mb-2">
                <div class="font-bold text-sm text-900 mb-3">费用明细</div>
                <div class="flex align-items-center justify-content-between py-2 border-bottom-1 border-gray-50">
                    <span class="text-sm text-400">咨询费用</span>
                    <span class="text-sm text-700">¥ {{ Number(expert.consult_price).toFixed(2) }}</span>
                </div>
                <div class="flex align-items-center justify-content-between pt-3">
                    <span class="text-sm font-bold text-900">实付金额</span>
                    <div class="flex align-items-baseline gap-1">
                        <span class="text-sm font-semibold" style="color:#e05c8a;">¥</span>
                        <span class="font-bold" style="color:#e05c8a;font-size:22px;line-height:1;">
                            {{ Number(expert.consult_price).toFixed(2) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 预约须知 -->
            <div
                class="flex flex-column gap-2 px-3 py-3 mb-2"
                style="background:#fffbf0;border-left:3px solid #e6a23c;"
            >
                <div class="flex align-items-center gap-2 font-bold text-sm" style="color:#e6a23c;">
                    <van-icon name="info-o" size="14" color="#e6a23c" />
                    预约须知
                </div>
                <div class="flex flex-column gap-1">
                    <div class="flex align-items-start gap-2 text-sm line-height-3" style="color:#8a6914;">
                        <span class="flex-shrink-0">·</span>
                        <span>专家将在预约时间内通过电话联系您，请保持手机畅通</span>
                    </div>
                    <div class="flex align-items-start gap-2 text-sm line-height-3" style="color:#8a6914;">
                        <span class="flex-shrink-0">·</span>
                        <span>如需取消请提前 2 小时联系客服</span>
                    </div>
                </div>
            </div>

            <div style="height:90px;" />

        </template>

        <!-- 底部支付栏 -->
        <div
            v-if="expert && !pageLoading"
            class="fixed left-0 right-0 flex align-items-center justify-content-between px-4 surface-0 border-top-1 border-gray-100"
            style="bottom:0;padding-top:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));z-index:100;"
        >
            <div class="flex flex-column gap-1">
                <span class="text-xs text-400">合计</span>
                <div class="flex align-items-baseline gap-1">
                    <span class="text-sm font-semibold" style="color:#e05c8a;">¥</span>
                    <span class="font-bold" style="color:#e05c8a;font-size:24px;line-height:1;">
                        {{ Number(expert.consult_price).toFixed(2) }}
                    </span>
                </div>
            </div>
            <div
                class="flex align-items-center justify-content-center border-round-3xl font-bold text-white cursor-pointer"
                style="width:150px;height:44px;font-size:15px;"
                :style="submitting
                    ? 'background:#ddd;cursor:not-allowed;'
                    : 'background:linear-gradient(135deg,#ff6b6b,#ff8e53);box-shadow:0 4px 16px rgba(255,107,107,0.4);'"
                @click="onSubmit"
            >
                <van-loading v-if="submitting" size="18" color="#fff" />
                <span v-else>立即支付</span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from 'vue'
import { showConfirmDialog } from 'vant'
import { useGlobal } from '@/utils/Global'
import { useGlobalStore } from '@/store/global'
import type { Expert } from '@/store/circle'
import ImageUploader from '@/components/upload/ImageUploader.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'

const { axios, router, route } = useGlobal()
const globalStore = useGlobalStore()
const { memberInfo } = toRefs(globalStore)

const expertId      = Number(route.params.id)
const queryDate     = route.query.date as string
const queryTime     = route.query.time as string
const defaultAvatar = '@@/images/default_avatar.png'

// ── 专家数据 ──────────────────────────────────────────────────
const expert      = ref<Expert | null>(null)
const pageLoading = ref(true)

async function fetchExpert() {
    pageLoading.value = true
    try {
        const res    = await axios.get('circle/expert_detail', { id: expertId }, { toast: 0 })
        expert.value = res?.data?.detail ?? null
    } catch {
        ElMessage.error('加载失败')
    } finally {
        pageLoading.value = false
    }
}

// ── 预约时间 ─────────────────────────────────────────────────
const bookingDateLabel = computed(() => {
    if (!queryDate || !queryTime) return ''
    return moment(`${queryDate} ${queryTime}`).format('YYYY年M月D日 HH:mm')
})

const scheduledAt = computed(() =>
    moment(`${queryDate} ${queryTime}`).unix()
)

// ── 表单 ─────────────────────────────────────────────────────
const form = ref({
    fullname: (memberInfo.value as any)?.fullname || (memberInfo.value as any)?.nickname || '',
    telphone: (memberInfo.value as any)?.telphone || '',
    remark:   '',
    images:   [] as string[],
})

// ── 提交 ─────────────────────────────────────────────────────
const submitting = ref(false)

async function onSubmit() {
    if (!expert.value || submitting.value) return

    // 表单校验
    if (!form.value.fullname.trim()) { ElMessage.error('请填写联系姓名'); return }
    if (!form.value.telphone.trim()) { ElMessage.error('请填写联系电话'); return }
    if (!/^1[3-9]\d{9}$/.test(form.value.telphone.trim())) {
        ElMessage.error('请填写正确的手机号码'); return
    }

    try {
        await showConfirmDialog({
            title:              '确认预约',
            message:            `${bookingDateLabel.value}\n费用 ¥${Number(expert.value.consult_price).toFixed(2)}`,
            confirmButtonText:  '去支付',
            confirmButtonColor: '#764ba2',
        })
    } catch { return }

    submitting.value = true
    try {
        // Step1：创建咨询订单，获取 barcode
        const orderRes = await axios.post('circle/create_consult', {
            expert_id:    expertId,
            scheduled_at: scheduledAt.value,
            fullname:     form.value.fullname.trim(),
            telphone:     form.value.telphone.trim(),
            remark:       form.value.remark.trim(),
            images:       JSON.stringify(form.value.images),
        }, { toast: 0 })

        if (!orderRes || orderRes.status != 1) {
            ElMessage.error(orderRes?.info || '创建订单失败')
            return
        }

        const { barcode, title } = orderRes.data

        // Step2：发起支付，获取 bill_no
        const payRes = await axios.post('payment/payConsult', {
            barcode,
            title:  title || `专家咨询预约`,
            openid: (memberInfo.value as any)?.openid || '',
        }, { toast: 0 })

        if (!payRes || payRes.status != 1) {
            ElMessage.error(payRes?.info || '发起支付失败')
            return
        }

        const billNo = payRes.data

        // Step3：跳转到微信支付页
        router.replace({ name: 'member_wx_pay', params: { no: billNo }, query: { from: 'consult' } })

    } catch {
        ElMessage.error('操作失败，请重试')
    } finally {
        submitting.value = false
    }
}

// ── 初始化 ───────────────────────────────────────────────────
onMounted(() => {
    if (!queryDate || !queryTime) {
        ElMessage.error('参数错误，请重新选择时间')
        router.back()
        return
    }
    fetchExpert()
})
</script>

<style scoped>
.consult-book-page {
    min-height: 100vh;
    background: #f7f4fc;
    padding-bottom: 90px;
}
</style>
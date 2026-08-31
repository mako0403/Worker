<template>
    <div class="min-h-screen bg-gray-100 flex flex-column">
        <!-- é¡¶éƒ¨ç»¿è‰²èƒŒæ™¯è£…é¥° -->
        <div class="bg-green-600 pt-6 pb-8 px-4" style="background: linear-gradient(180deg, #07C160 0%, #06AD56 100%); border-radius: 0 0 32px 32px;">
            <div class="flex align-items-center justify-content-center gap-2 mb-2">
                <el-icon class="text-white" size="24"><CircleCheck /></el-icon>
                <span class="text-white font-bold text-lg">æ”¶é“¶å°</span>
            </div>
            <div class="text-white-alpha-70 text-center text-xs tracking-widest uppercase">Browser Payment</div>
        </div>

        <div class="px-4 -mt-6">
            <!-- 1. æœ‰æ•ˆæ”¯ä»˜äº¤æ˜“å¡ç‰‡ -->
            <div v-if="payDeal" class="bg-white border-round-3xl shadow-2 p-5 flex flex-column align-items-center animate-fadein">
                <!-- æ”¯ä»˜å›¾æ ‡ -->
                <div class="bg-green-50 border-round-circle p-3 mb-4">
                    <el-image src="/images/wechat_pay.png" style="width: 50px; height: 50px;" fit="contain" />
                </div>

                <!-- æ ‡é¢˜ä¸Žé‡‘é¢ -->
                <div class="text-900 font-medium text-lg mb-2 text-center">{{ payDeal.title }}</div>
                <div class="text-900 font-black mb-5 flex align-items-baseline">
                    <span class="text-2xl mr-1">ï¿¥</span>
                    <span class="text-5xl tracking-tighter tabular-nums">{{ payDeal.total_fee }}</span>
                </div>

                <!-- è®¢å•è¯¦ç»†æ˜Žç»† -->
                <div class="w-full border-top-1 border-gray-100 pt-4 mb-6">
                    <div class="flex justify-content-between mb-3">
                        <span class="text-500 text-sm">è®¢å•å•å·</span>
                        <span class="text-800 text-sm font-medium tabular-nums">{{ payDeal.bill_no }}</span>
                    </div>
                    <div class="flex justify-content-between">
                        <span class="text-500 text-sm">äº¤æ˜“çŠ¶æ€</span>
                        <span class="text-green-600 text-sm font-bold">ç­‰å¾…æ”¯ä»˜</span>
                    </div>
                </div>

                <!-- æ“ä½œæŒ‰é’®ç»„ -->
                <div class="w-full">
                    <el-button 
                        type="success" 
                        class="w-full border-round-pill shadow-2 font-bold py-4 text-lg border-none"
                        style="background: #07C160;"
                        @click="pay()"
                    >
                        ç«‹å³æ”¯ä»˜
                    </el-button>
                    
                    <div 
                        class="text-500 text-center text-sm mt-5 hover:text-900 transition-colors" 
                        style="cursor: pointer;"
                        @click="router.go(-1)"
                    >
                        æš‚ä¸æ”¯ä»˜ï¼Œè¿”å›ž
                    </div>
                </div>

                <!-- å®‰å…¨æç¤º -->
                <div class="mt-8 flex align-items-center gap-1 text-400">
                    <el-icon size="14"><Lock /></el-icon>
                    <span class="text-xs">æ”¯ä»˜çŽ¯å¢ƒå·²é€šè¿‡å®‰å…¨åŠ å¯†æ£€æµ‹</span>
                </div>
            </div>

            <!-- 2. æ— æ•ˆæ”¯ä»˜äº¤æ˜“å¡ç‰‡ -->
            <div v-else class="bg-white border-round-3xl shadow-1 p-8 flex flex-column align-items-center animate-fadein">
                <el-icon class="text-orange-400 mb-4" size="64"><InfoFilled /></el-icon>
                <div class="text-900 font-bold text-xl mb-2">æ”¯ä»˜é“¾æŽ¥å¤±æ•ˆ</div>
                <p class="text-500 text-center line-height-3 mb-6">
                    è¯¥ç¬”æ”¯ä»˜äº¤æ˜“å¯èƒ½å·²ç»ä»˜æ¬¾æˆåŠŸï¼Œ<br>
                    æˆ–ç”±äºŽæ“ä½œæ—¶é—´è¿‡é•¿å·²å¤±æ•ˆã€‚
                </p>
                <el-button 
                    type="primary" 
                    plain
                    round 
                    class="w-full py-3 font-bold"
                    @click="router.go(-1)"
                >
                    è¿”å›žä¸Šä¸€é¡µ
                </el-button>
            </div>
        </div>

        <!-- åº•éƒ¨ç‰ˆæƒ/è£…é¥° -->
        <div class="mt-auto py-6 text-center">
            <div class="text-300 text-xs tracking-widest font-bold">POWERED BY ONLINE PAYMENT</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from '@/utils/axios'

import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import { useRoute, useRouter, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()

const payDeal = ref([])


onMounted(async () => {
    try {
        const params = {
            bill_no: route.params.no
        }
        const { data } = await axios.get('/payment/pending_pay', params)
        payDeal.value = data
    } catch (error) {
        payDeal.value = null;
    }
})

const pay = async () => {
    try {
        const res = await axios.post('/payment/payorder', {
            bill_no: payDeal.value.bill_no,
            openid: globalStore.memberInfo?.openid || ''
        }, { toast: 0 });

        const paymentUrl = res?.data?.pay_url || res?.data?.mweb_url || res?.data?.url;

        if (paymentUrl) {
            window.location.href = paymentUrl;
            return;
        }

        ElMessage.success(res?.info || '支付请求已提交，请根据页面提示完成支付');

        const from = route.query.from as string
        if (from === 'consult') {
            router.replace({ name: 'circle_consult_orders' })
        } else {
            router.go(-1)
        }
    } catch (err) {
        console.log(err)
        ElMessage.error('发起支付失败，请稍后重试')
    }
}

</script>

<style scoped>
.animate-fadein {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* æŒ‰é’®ç‚¹å‡»åé¦ˆ */
.el-button:active {
    transform: scale(0.98);
    opacity: 0.9;
}

/* éšè—åŽŸæœ‰ el-result çš„æ¸…é™¤æ ·å¼ï¼ˆå¦‚æžœéœ€è¦ï¼‰ */
:deep(.el-result) {
    padding: 0;
}
</style>

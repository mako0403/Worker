<template>
    <div class="h-full bg-gray-50 flex flex-column">
        <!-- 1. 沉浸式仪表盘头部 -->
        <div class="relative pb-5">
            <div class="absolute top-0 left-0 w-full h-10rem bg-blue-600 border-circle-bottom shadow-4"
                style="background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); border-radius: 0 0 40% 40% / 0 0 20% 20%;">
            </div>

            <div class="relative z-1 px-4 pt-5">
                <div class="flex justify-content-between align-items-start mb-4">
                    <div class="flex align-items-center gap-3">
                        <div class="relative">
                            <el-avatar :size="60" :src="globalStore.memberInfo.avatar"
                                class="border-2 border-white-alpha-30 shadow-2" />
                            <div
                                class="absolute bottom-0 right-0 bg-green-500 border-2 border-white border-circle w-1rem h-1rem flex align-items-center justify-content-center">
                                <el-icon size="10" class="text-white">
                                    <Check />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="text-white-alpha-80 text-xs font-medium uppercase mb-1">Recovery Dashboard</div>
                            <div class="text-xl font-bold text-white tracking-wide">
                                {{ globalStore.memberInfo.fullname || '你好, 康复者' }}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <el-button circle class="bg-white-alpha-20 border-none text-white"><el-icon>
                                <Bell />
                            </el-icon></el-button>
                    </div>
                </div>

                <!-- 悬浮状态卡片 -->
                <div class="bg-white border-round-xl p-3 shadow-3 flex justify-content-around text-center mt-2">
                    <div class="flex-1 border-right-1 border-gray-100">
                        <div class="text-xs text-500 mb-1">权限状态</div>
                        <div class="text-sm font-bold" :class="hasAccess ? 'text-green-500' : 'text-orange-500'">
                            {{ hasAccess ? '高级订阅' : '免费版' }}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="text-xs text-500 mb-1">今日目标</div>
                        <div class="text-lg font-bold text-900">100%</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. 下方内容区域 -->
        <div class="flex-1 overflow-y-auto px-4 pb-4 mt-2">
            <!-- 动态问候语部分 -->
            <div class="mb-4">
                <div class="flex align-items-baseline gap-2">
                    <span class="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 border-round-sm">
                        {{ getTimeGreeting().tag }}
                    </span>
                    <span class="text-xs text-500 font-medium">{{ getTodayDate() }}</span>
                </div>
                <div class="text-lg font-black text-900 mt-2 line-height-2">
                    {{ getTimeGreeting().title }}
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="pageLoading" class="p-4"><el-skeleton :rows="4" animated /></div>

            <!-- A. 已有权限：展示列表 -->
            <template v-else-if="hasAccess">
                <div v-if="myPlanLists.length" class="flex flex-column gap-3 mt-2">
                    <div v-for="(item, index) in myPlanLists" :key="index"
                        class="bg-white p-3 border-round-xl shadow-1 hover:shadow-2 transition-duration-200">
                        <RouterLink :to="{ name: 'member_workout_plan_details', params: { i: item.id } }"
                            class="flex align-items-start gap-3 no-underline">
                            <div class="relative">
                                <img :src="item.cover" class="border-round-lg shadow-1"
                                    style="width: 100px; height: 75px; object-fit: cover;">
                                <div
                                    class="absolute bottom-0 right-0 p-1 bg-black-alpha-50 text-white text-xs border-round-left-sm flex align-items-center">
                                    <el-icon class="mr-1">
                                        <VideoPlay />
                                    </el-icon> 播放
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div
                                    class="text-sm font-bold text-900 mb-1 line-height-2 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                    {{ item.title }}</div>
                                <div class="text-xs text-500 line-height-3">
                                    <van-text-ellipsis :content="item.description" rows="2" />
                                </div>
                            </div>
                            <el-icon class="text-400 align-self-center">
                                <ArrowRightBold />
                            </el-icon>
                        </RouterLink>
                    </div>
                </div>
                <el-empty v-else description="暂无可用锻炼计划" />
            </template>

            <!-- B. 无权限：展示购买引导 -->
            <div v-else class="animate-fadein mt-2">
                <div class="bg-white p-4 border-round-xl shadow-2">
                    <div class="relative border-round-lg overflow-hidden mb-4" style="height: 160px;">
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600"
                            class="w-full h-full object-cover">
                        <div
                            class="absolute top-0 left-0 w-full h-full bg-black-alpha-40 flex flex-column justify-content-center align-items-center text-white">
                            <el-icon size="32">
                                <Lock />
                            </el-icon>
                            <div class="text-xs mt-2">解锁 10+ 康复教学视频</div>
                        </div>
                    </div>

                    <div class="text-center mb-4">
                        <span
                            class="text-blue-600 bg-blue-50 px-3 py-1 border-round-pill text-xs font-bold">限时解锁全集</span>
                        <div class="text-xl font-bold mt-2 text-900">运动康复视频课程全集</div>
                    </div>

                    <div class="grid mb-4">
                        <div class="col-6 flex align-items-center gap-2 mb-2">
                            <el-icon class="text-green-500">
                                <CircleCheckFilled />
                            </el-icon>
                            <span class="text-xs text-700 font-medium">10+ 专业康复动作</span>
                        </div>
                        <div class="col-6 flex align-items-center gap-2 mb-2">
                            <el-icon class="text-green-500">
                                <CircleCheckFilled />
                            </el-icon>
                            <span class="text-xs text-700 font-medium">高清视频循序渐进</span>
                        </div>
                        <div class="col-6 flex align-items-center gap-2 mb-2">
                            <el-icon class="text-green-500">
                                <CircleCheckFilled />
                            </el-icon>
                            <span class="text-xs text-700 font-medium">一次购买永久观看</span>
                        </div>
                        <div class="col-6 flex align-items-center gap-2 mb-2">
                            <el-icon class="text-green-500">
                                <CircleCheckFilled />
                            </el-icon>
                            <span class="text-xs text-700 font-medium">专家团队科学指导</span>
                        </div>
                    </div>

                    <van-divider />

                    <div class="flex align-items-center justify-content-between mt-3">
                        <div class="text-2xl font-bold text-orange-500">￥99.00</div>
                        <el-button type="primary" size="large"
                            class="border-round-pill px-4 shadow-2 bg-blue-600 border-none" @click="handleBuyVideo"
                            :loading="buyLoading">
                            立即支付开通
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/store/global';
import { ElMessage } from 'element-plus'
import { TextEllipsis as vanTextEllipsis, Divider as vanDivider } from 'vant'

const router = useRouter()
const globalStore = useGlobalStore();

const myPlanLists = ref([])
const hasAccess = ref(false)
const pageLoading = ref(true)
const buyLoading = ref(false)

// 动态时间问候逻辑
const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return { tag: '晨间开启', title: '用科学的锻炼，唤醒身体活力' };
    if (hour < 12) return { tag: '上午加油', title: '保持节奏，康复就在每一步' };
    if (hour < 18) return { tag: '午后修护', title: '适度拉伸，缓解身体的疲劳' };
    return { tag: '晚间放松', title: '结束一天的忙碌，给身体一个交代' };
}
const getTodayDate = () => {
    return new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });
}

onMounted(async () => {
    fetchData();
})

const fetchData = async () => {
    pageLoading.value = true;
    try {
        // 修改为请求新的视频控制器接口
        const res = await axios.get('/video/getPlanList', {
            card_number: globalStore.memberInfo.card_number
        }, { totast: 0 });

        if (res.status && res.data) {
            myPlanLists.value = res.data.list;
            // 核心逻辑：直接使用后端返回的权限布尔值
            hasAccess.value = res.data.has_access;
        } else {
            hasAccess.value = false;
        }
    } catch (e) {
        ElMessage.error('获取视频数据失败');
    } finally {
        pageLoading.value = false;
    }
}

const handleBuyVideo = async () => {
    if (buyLoading.value) return;
    buyLoading.value = true;

    try {
        const res = await axios.post('/payment/payVideoPlan', {
            bid: globalStore.memberInfo.bid,
            card_number: globalStore.memberInfo.card_number,
            plan_id: 0,
            title: '购买运动康复视频全集',
            total_fee: 99.00,
            openid: globalStore.memberInfo.openid,
            source: '1'
        });

        if (res.status) {
            router.push({
                name: 'member_wx_pay',
                params: { no: res.data }
            });
        } else {
            ElMessage.error(res.message || '下单失败');
        }
    } catch (e) {
        ElMessage.error('网络请求异常');
    } finally {
        buyLoading.value = false;
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
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.shadow-3 {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
}

.white-space-nowrap {
    white-space: nowrap;
}
</style>
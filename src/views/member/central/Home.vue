<template>
    <div class="h-full pb-6">
        <div class="p-3">
            <div class="flex align-items-center gap-3">
                <div>
                    <img :src="globalStore.memberInfo.avatar" class="border-circle" width="90px" height="90px">
                </div>
                <div class="flex-grow-1">
                    <div class="text-2xl font-semibold">{{ globalStore.memberInfo.nickname }}</div>
                    <!-- <div class="text-xs text-gray-600 mt-2">{{ globalStore.branchConfig.name }}</div> -->
                    <div class="flex align-items-center text-sm text-gray-600 mt-2 gap-1">
                        <div class="bg-purple-600 px-3 py-1 text-xs text-white border-round-xl tags">普通会员</div>
                        <div class="bg-green-600 px-3 py-1 text-xs text-white border-round-xl tags">DA.100</div>
                    </div>
                </div>
                <div>
                    
                    <!-- <el-icon size="20" class="text-600">
                        <ArrowRight />
                    </el-icon> -->
                </div>
            </div>
        </div>
        <div class="p-3">
            <div class="flex justify-content-between text-center">
                <div class="flex-1">
                    <div class="text-xl font-semibold fadeinup animation-duration-300">{{ 0 }}</div>
                    <div class="text-xs text-gray-500 mt-1 fadein animation-duration-300">圈子</div>
                </div>
                <div class="flex-1">
                    <div class="text-xl font-semibold fadeinup animation-duration-300 animation-delay-100">{{ 0 }}</div>
                    <div class="text-xs text-gray-500 mt-1 fadein animation-duration-300 animation-delay-100">粉丝</div>
                </div>
                <!-- <div class="flex-1">
                    <div class="text-xl font-semibold fadeinup animation-duration-300 animation-delay-150">{{ 0 }}</div>
                    <div class="text-xs text-gray-500 mt-1 fadein animation-duration-300 animation-delay-150">话题</div>
                </div> -->
                <div class="flex-1">
                    <div class="text-xl font-semibold fadeinup animation-duration-300 animation-delay-200">{{ Math.abs(globalStore.memberInfo.point) }}</div>
                    <div class="text-xs text-gray-500 mt-1 fadein animation-duration-300 animation-delay-200">积分</div>
                </div>
                <div class="flex-1">
                    
                    <div class="text-xs text-gray-500 fadein animation-duration-300 animation-delay-200"><CheckIn @checkInSuccess="onCheckInSuccess" /></div>
                </div>
            </div>
        </div>
        <!-- <div class="p-3">
            <div class="block-bg border-round-lg p-1">
                <div class="p-2 flex justify-content-between align-items-center">
                    <div class="text-md text-white ">已连续打卡{{ checkin }}天</div>
                    <div class="text-xs text-purple-50 bg-orange-300 border-1 border-orange-400 px-3 border-round-xl"
                        style="padding-top:1px; padding-bottom:2px;">立即打卡</div>
                </div>
                <div
                    class="flex justify-content-between align-items-center gap-2 bg-white border-round-lg pt-3 pb-2 px-3 text-center">
                    <div v-for="(item, index) in checkinSet" :key="index"
                        class="flex-1 qd-bg border-1 border-round-sm text-white px-2 pb-2 pt-4 relative fadeinup animation-duration-500"
                        :class="{ 'bg-orange-400 border-orange-300': checkin > index, 'bg-dblue-100 border-dblue-50': checkin < (index + 1) }"
                        :style="item ? { 'animation-delay': (index * 100) + 'ms !important' } : {}">
                        <svg class="icon absolute bg-white border-circle" aria-hidden="true"
                            style="width:24px; height:24px; left:52%;  top:0px; transform:translate(-50%,-40%);"
                            :class="{ 'opacity-60': checkin < (index + 1) }">
                            <use xlink:href="#color-jifen2"></use>
                        </svg>
                        <div class="font-bold" style="transform: scale(1, 1.3);">{{ item }}</div>
                        <div class="text-xs mt-1 opacity-50">第{{ index+1 }}天</div>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="px-3 mt-3" v-if="pendingList">
            <div v-for="(item, index) in pendingList" :key="index" class="flex justify-content-between align-items-center p-3 border-round-lg bg-red-50 border-1 border-red-100 mb-3">
                <div>
                    <div class="text-sm font-bold text-red-600">{{ item.title }}<span class="ml-3">￥{{ item.total_fee }}</span></div>
                    <div class="text-xs mt-1 text-red-200">您有一笔待付款，请尽快完成支付！</div>
                </div>
                <div class="text-xs">
                    <RouterLink :to="'/member/wxpay/'+item.bill_no">
                        <el-button round plain type="danger" size="small">微信支付</el-button>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="px-3 mt-3">
            <div class="block-bg border-round-lg overflow-hidden relative">
                <div class="pt-3 pb-2 px-3 flex align-items-center">
                    <div class=" text-md text-white font-bold absolute" style="z-index: 2; top: 15px;">我的服务 {{ servicesLists?servicesLists.length:0 }} 项</div>
                </div>
                <div class="mt-3" v-if="servicesLists">
                    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#eec137"
                        style="overflow: unset !important;">
                        <van-swipe-item v-for="(item, index) in servicesLists" :key="index">
                            <div
                                class="flex justify-content-between align-items-center gap-3 bg-white border-round-lg p-3 m-1">
                                <div>
                                    <img :src="item.model_cover" width="58px" height="58px">
                                </div>
                                <div class="flex-1">
                                    <div class="text-dblue-900 font-bold ellipsis ellipsis-line-1">{{ item.model_name }}</div>
                                    <div v-if="item.worker_info" class="text-xs text-500"> 
                                        {{ item.last_usage_time ? '最后预约 '+item.last_usage_time:'尚未使用, 您可提前1日进行预约' }}
                                    </div>
                                    <div v-if="item.worker_info" class="mt-2 text-xs text-600 flex align-items-center gap-1">
                                        <img :src="item.worker_info.headimg" width="20px" height="20px" class="border-circle surface-800">
                                        <div>{{ item.worker_info.place + ' ' + item.worker_info.fullname }}</div>
                                    </div>
                                </div>
                                <RouterLink :to="{path:'/member/medical/appointment', query:{model_id:item.model_id, services_worker_id:item.services_worker_id}}" class="flex align-items-center">
                                    <div class="text-xs text-dblue-500">预约</div>
                                    <el-icon class="text-dblue-500">
                                        <ArrowRightBold />
                                    </el-icon>
                                </RouterLink>
                            </div>
                            <div class="flex align-items-center gap-2 w-4 absolute"
                                style="top: -20px; right: 15px; z-index: 1;">
                                <van-progress :percentage="(item.total_usage / item.total_purchase) * 100" stroke-width="8"
                                    color="#eec137" track-color="#763cad" class="flex-1" pivot-text="" />
                                <div class="text-xs text-white bg-purple-600">{{ item.total_usage }}/{{
                                    item.total_purchase }}</div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
                <div v-else class="bg-white m-1 mt-3 border-round-lg p-3">
                    <el-skeleton :rows="1" animated  />
                </div>
            </div>
        </div>
        <div class="px-3 mt-3">
            <div class="grid">
                <div class="col">
                    <div class="p-3 bg-red-50 border-1 border-red-100 border-round-lg h-8rem">
                        <div class="relative">
                            <svg class="icon absolute w-3rem h-3rem" aria-hidden="true" style="right: -5px; top: 0px;">
                                <use xlink:href="#icon-tousujianyi"></use>
                            </svg>
                            <div class="text-lg text-900 font-bold">预约记录</div>
                            <div class=" mt-1">
                                <RouterLink to="/member/medical/appointment/lists" class="text-sm text-700">累计预约
                                    <span class="font-bold text-red-600">{{ (appointmentLists || []).flat().filter(item => item.status >= 0).length }}</span>
                                    次</RouterLink>
                            </div>
                            <div class="">
                                <RouterLink to="/member/medical/appointment/lists?status=0" class="text-xs text-orange-300">待确认预约
                                    <span class="font-bold text-red-600 text-sm">{{ (appointmentLists || []).flat().filter(item => item.status == 0).length }}</span>
                                    次
                                </RouterLink>
                            </div>
                        </div>
                        <div class="flex justify-content-between mt-2">
                            <div class="">
                                <div class="text-xs mb-1">待评价</div>
                                <RouterLink to="/member/medical/appointment/lists?status=7" class="relative text-xs">
                                    <span class="text-lg text-red-600">{{ (appointmentLists || []).flat().filter(item => item.status == 7).length }}</span>
                                    次
                                </RouterLink>
                            </div>
                            <div class="">
                                <div class="text-xs mb-1">待分享</div>
                                <div class=" text-red-600">0</div>
                            </div>
                        </div>
                        <div class="text-xs text-500 mt-1">评价分享可获得积分哦！</div>
                    </div>
                </div>
                <div class="col">
                    <div class="px-3 pt-2 pb-1 bg-yellow-50 border-1 border-yellow-100 border-round-lg h-4rem">
                        <div class="relative">
                            <svg class="icon absolute w-3rem h-3rem" aria-hidden="true" style="right: -5px; top: 0px;">
                                <use xlink:href="#icon-01_06"></use>
                            </svg>
                            <div class="text-lg font-bold">我的圈子</div>
                            <div class="text-xs text-700">加入0个圈子</div>
                            <div class="text-xs text-yellow-300">0热门话题</div>
                        </div>
                    </div>
                    <div class="px-3 pt-2 pb-1 bg-purple-50 border-1 border-purple-100 border-round-lg h-4rem mt-2">
                        <div class="relative">
                            <svg class="icon absolute w-3rem h-3rem" aria-hidden="true" style="right: -5px; top: 0px;">
                                <use xlink:href="#icon-pinglun-08"></use>
                            </svg>
                            <div class="text-lg font-bold">我的话题</div>
                            <div class="text-xs text-700">共获得0条回复</div>
                            <div class="text-xs text-purple-300">0条未读回复</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="additionalLists" class="px-3 mt-3">
            <div class="p-1 bg-gray-50 border-1 border-gray-100 border-round-lg">
                <div class="px-2 pt-3">运动康复</div>
                <div class="p-3 mt-2 bg-white border-round-lg">
                    <div v-for="(item, index) in additionalLists" :key="index">
                        <RouterLink :to="{name:'member_workout_plan_details', params:{i:index}}" v-if="item.related_model == 'Video'" class="flex justify-content-between align-items-center gap-3 bg-white border-round-lg">
                            <div>
                                <img :src="item.cover" width="90px" height="68px" class="border-round-lg">
                            </div>
                            <div class="flex-1">
                                <div class="text-sm text-dblue-900 font-bold ellipsis ellipsis-line-1">{{ item.title }}</div>
                                <div  class="text-xs text-dblue-300 mt-1"> 
                                    <van-text-ellipsis :content="item.description" rows="2" />
                                </div>
                            </div>
                            <div class="flex align-items-center">
                                <el-icon class="text-dblue-500">
                                    <ArrowRightBold />
                                </el-icon>
                            </div>
                        </RouterLink>
                        <van-divider v-if="index!=additionalLists.length-1" />
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from '@/utils/axios'
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter()
import { getDates } from "@/utils/common"
import { TextEllipsis as vanTextEllipsis, Popup as vanPopup, Progress as vanProgress, Swipe as vanSwipe, SwipeItem as vanSwipeItem, Divider as vanDivider } from 'vant';

import CheckIn from '@/components/member/CheckIn.vue';


// const checkin = ref(0);
// const checkinSet = ref([1, 5, 10, 20, 30, 40, 50])
// watch(() => checkin.value, (nval) => {
//     const indexToReplace = (nval - 1) % 7;
//     checkinSet.value.splice(0, (checkin.value - 7));
//     let count = 0;
//     while (count < (checkin.value - 7)) {
//         checkinSet.value.push('50');
//         count++;
//     }
// }, { immediate: true })


const servicesLists = ref(null)
// const additionalLists = ref(null)
const appointmentLists = ref(null)
const pendingList = ref(null);


onMounted(async () => {
    const res = await axios.get('/services/member_services_lists', {
        bid: globalStore.memberInfo.bid,
        card_number: globalStore.memberInfo.card_number,
        model: 'MedicalServices'
    }, { totast: 1 })

    if (res.status) {
        servicesLists.value = res.data
        if (servicesLists.value) {
            const worker = await axios.get('/worker/lists', { totast: 0 })
            servicesLists.value.forEach(item1 => {
                const matchedItem = worker.data.find(item2 => item2.id === item1.services_worker_id);
                if (matchedItem) {
                    item1.worker_info = matchedItem
                }
            });
        }
    }

    // try {
    //     const additional = await axios.get('/services/member_services_additional', {card_number: globalStore.memberInfo.card_number}, {totast:0})
    //     if(additional.status){
    //         additionalLists.value = additional.data;
    //     }
    // } catch (e){

    // }
    

    try {
        const params = {
            card_number:globalStore.memberInfo.card_number, 
            model:'MedicalServices',
            type:2,
        }
        const { data } = await axios.get('/services/member_appointment_lists', params, {totast:0})
        appointmentLists.value = data
    } catch (error) {

    }

    try {
        const params = {
            card_number:globalStore.memberInfo.card_number
        }
        const { data } = await axios.get('/payment/pending_pay_list', params, {totast:0})
        pendingList.value = data
    } catch (error) {

    }
 
})

const waitEvaluate = computed (()=>{
    (appointmentLists.value || []).flat().filter(item => item.status == 7).length
})


import avatar from '@@/images/default_avatar.webp'
const defaultAvatar = (event) => {
    event.target.src = avatar;
}


const onCheckInSuccess = (points) => {
    console.log(`签到成功！获得 ${points} 积分`);
};


</script>

<style scoped>
.tags {
    background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.0));
}

.block-bg {
    background: url('@@/images/bg-low-poly-grid-haikei.png');
    background-size: cover;

}

.qd-bg {
    background: linear-gradient(rgba(247, 233, 156, 0.4), rgba(255, 242, 166, 0));
}

.is-checkin {
    background: #f00;
}

.el-progress-bar__outer {
    background: none !important;
}
</style>

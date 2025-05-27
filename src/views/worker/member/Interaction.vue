<template>
    <div class="h-full">
        <div class="pb-3" style="overflow-y: auto">
            <div v-if="!comments">
                <el-empty description="暂无任何评价" />
            </div>
            <div v-else class="">
                <div class="">
                    <!-- <div class="px-3 text-sm text-teal-600">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亲爱的<span class="">{{ workerConfig.job_title + workerConfig.place }}{{ workerConfig.fullname }}</span>您共收获{{ comments.summary.count }}次评价，综合评分{{ comments.summary.rating }}。好评率{{ comments.summary.rating * 20 }}%，请你继续努力加油哦！
                    </div> -->
                    <!-- <div class="text-md font-bold px-3 mb-2">全部评价</div> -->
                    <van-tabs v-model:active="tabsActive" sticky offset-top="59" :beforeChange="tabChange">
                        <van-tab title="患者评价">
                            <template #title>患者评价</template>
                            <div class="relative overflow-hidden">
                                <div class="px-2 py-3 bg-dblue-50 border-round-lg m-3">
                                    <div class="flex gap-3">
                                        <div style="width: 30%;" class="border-right-1 border-dblue-100">
                                            <EChartsComponent v-if="comments.summary" :option="ratingRate" width="100%" height="70px" />
                                        </div>
                                        <div class="">
                                            <div>
                                                <div class="flex justify-content-start gap-2 align-items-center">
                                                    <div class="text-xs">服务体验</div>
                                                    <div class="text-xs"><el-rate :model-value="Number(comments.summary.star1)" size="small" disabled text-color="#ff9900" show-score score-template="{value}"/></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="flex justify-content-start gap-2 align-items-center">
                                                    <div class="text-xs">专业水平</div>
                                                    <div class="text-xs"><el-rate :model-value="Number(comments.summary.star2)" size="small" disabled text-color="#ff9900" show-score score-template="{value}"/></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="flex justify-content-start gap-2 align-items-center">
                                                    <div class="text-xs">治疗效果</div>
                                                    <div class="text-xs"><el-rate :model-value="Number(comments.summary.star3)" size="small" disabled text-color="#ff9900" show-score score-template="{value}"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="px-3 text-sm text-dblue-700  mt-3">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亲爱的<span class="">{{ workerConfig.fullname }}</span>您共收获{{ comments.summary.count }}次评价，综合评分{{ comments.summary.rating }}。请继续努力加油哦！
                                    </div>
                                </div>
                                <!-- <div class="absolute" style="width:42%; bottom: 24px; right: -25px;">
                                    <img :src="uploadsPath + workerConfig.headimg" width="100%" class="-mb-2"/>
                                </div> -->
                            </div>
                            <div v-for="(item, index) in comments.details" :key="index" class="m-3">
                                <div class="p-3 bg-gray-50 shadow-1 border-round-lg">
                                    <div class="flex align-items-top gap-3">
                                        <img :src="item.avatar" alt="" class="border-circle" width="42px" height="42px" />
                                        <div class="w-full">
                                            <div class="flex justify-content-between align-items-center">
                                                <div class="text-sm text-900 font-bold">{{ item.fullname }}</div>
                                                <div><el-rate :model-value="Number(item.rating)" size="small" disabled text-color="#ff9900" /></div>
                                            </div>
                                            <div class="text-gray-500 text-xs flex gap-2 align-items-center white-space-nowrap overflow-hidden">
                                                <div class="text-sm">{{ moment.unix(item.create_time).format('YYYY-MM-DD') }}</div>
                                                <div class="shape-1 bg-dblue-300 text-dblue-50 px-1 border-round-sm white-space-nowrap" v-for="tag in item.tags" :key="tag">
                                                    <span>#</span>{{ tag }}
                                                </div>
                                            </div>
                                            <div class="mt-2 text-sm">{{ item.comment }}</div>
                                            <div v-if="item.reply" class="mt-3 bg-white p-2 border-round-md flex align-items-start gap-2">
                                                <div class="border-circle bg-yellow-100 overflow-hidden" style="width: 42px; min-width: 42px; height: 42px;">
                                                    <img :src="item.worker_headimg" alt="" class="mt-1" width="100%" />
                                                </div>
                                                <div class="w-full">
                                                    <div class="flex justify-content-between align-items-center">
                                                        <div class="text-sm text-900">{{ item.worker_name }}</div>
                                                        <div class="text-xs text-500">回复时间 {{ item.reply_date!='0000-00-00'?item.reply_date:moment().format('YYYY-MM-DD') }}</div>
                                                    </div>
                                                    <div class="mt-1 text-xs">{{ item.reply }}</div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <el-button size="small" class="mt-2 opacity-60" @click="showReplyPopup=!showReplyPopup; replyData=item">回复</el-button>
                                            </div>   
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="px-3 mt-3 mb-8">
                                <el-pagination layout="prev, pager, next" :total="Number(pageTotalData)" :hide-on-single-page="true"
                                @change="changePage" class="w-full flex justify-content-between" />
                            </div>
                        </van-tab>
                        <van-tab title="妈妈智问">
                            <div class="my-3">
                                <ChatMessagesTemplate :messages="chats.details" :user-avatar="userAvatar" :ai-avatar="aiAvatar" />
                            </div>
                            <div class="px-3 mt-3 mb-8">
                                <el-pagination layout="prev, pager, next" :total="Number(pageTotalData)" :hide-on-single-page="true"
                                @change="changePage" class="w-full flex justify-content-between" />
                            </div>
                        </van-tab>
                        <van-tab title="妈妈圈">
                            <div class="m-3">
                                <div class="text-xs text-gray-500">暂无内容</div>
                            </div>
                        </van-tab>
                        <van-tab title="运动康复">
                            <div class="p-3 bg-gray-50">
                                <div v-for="(item, index) in videoRecord" :key="index" class="mb-3">
                                    <div class="flex gap-3 align-items-start">
                                        <div class="flex align-items-center gap-2">
                                            <img :src="item.avatar" alt="" class="border-round-2xl" width="42px" height="42px" />
                                        </div>
                                        <div>
                                            <div class="text-sm text-500 font-bold mt-1">{{ item.date }}</div>
                                            <div class="mt-1 pb-3 border-bottom-1 border-gray-200">
                                                <div class="text-sm text-900">{{ item.fullname }}进行了运动康复打卡，</div>
                                                <div class="text-sm text-900">共播放了<span class="text-dblue-500 font-bold mx-1">{{ item.total_number }}</span>个视频。总耗时<span class="text-dblue-500 font-bold mx-1">{{ (item.total_time / 60).toFixed(2) }}分钟</span>。</div>
                                                <div class="text-sm text-900">完播率<span class="text-dblue-500 font-bold mx-1">{{ item.avg_play_ratio }}%</span></div>
                                            </div>
                                        </div> 
                                    </div>                       
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
        </div>
        <van-popup v-model:show="showReplyPopup" position="bottom" :style="{ padding: '15px' }">
            <div class="flex align-items-top gap-3 py-3">
                <img :src="replyData.avatar" alt="" class="border-circle" width="42px" height="42px" />
                <div class="w-full">
                    <div class="flex justify-content-between align-items-center">
                        <div class="text-sm text-900 font-bold">{{ replyData.fullname }}</div>
                        <div><el-rate :model-value="Number(replyData.rating)" size="small" disabled text-color="#ff9900" /></div>
                    </div>
                    <div class="text-gray-500 text-xs flex gap-2 align-items-center">
                        {{ replyData.comment }}
                    </div>
                </div>
            </div>
            <div class="text-xs mb-2 text-600">回复患者评价：</div>
            <el-input v-model="replyData.reply" style="width: 100%" :rows="3" type="textarea" placeholder="请输入回复内容..." />
            <el-button type="warning" class="w-full mt-3 mb-3" size="large" @click="submitReply">立 即 回 复</el-button>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { Popup as vanPopup  } from 'vant';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global'
const { globalConfig, uploadsPath, workerConfig } = toRefs(useGlobalStore());
import moment from 'moment';
import EChartsComponent from '@/components/common/ECharts.vue';
import ChatMessagesTemplate from "@/components/common/ChatMessages.vue";
import user_avatar from '@@/images/avatar.jpg';
import ai_avatar from '@@/images/logo1.webp';

// 用户和AI头像路径
const userAvatar = user_avatar;
const aiAvatar = ai_avatar;

import { Tab as vanTab, Tabs as vanTabs } from 'vant'

const tabsActive = ref('患者评价')
const tabsIndex = ref(0)

const showReplyPopup = ref(false)
const replyData = ref([])

const page = ref(1);
const pageTotalData = ref(0)
const comments = ref(null);
const getCommentsLists = async ()=>{
    try {
        const { data } = await axios.get('/comments/get_lists', {bid:workerConfig.value.bid, worker_id:workerConfig.value.id, p:page.value}, {toast:1})
        comments.value = data
        pageTotalData.value = data.total;
    } catch (error) {
        ElMessage.error(error.message)
    }
}

const chats = ref(null)
const getMemberChatLists = async ()=>{
    try {
        const { data } = await axios.get('/member/get_member_chat', {bid:workerConfig.value.bid, worker_id:workerConfig.value.id, p:page.value}, {toast:1})
        chats.value = data
        pageTotalData.value = data.total;
    } catch (error) {
        ElMessage.error(error.message)
    }
}

const videoRecord = ref(null)
const getVideoRecord = async ()=>{
    try {
        const { data } = await axios.get('/services/card_number_lists_by_worker', {worker_id:workerConfig.value.id}, {toast:0})
        const card_number = data.join(',');

        const res = await axios.get('/video/get_record_lists_group_card_number', {card_number:card_number}, {toast:1})
        console.log(11111111, res.data);
        videoRecord.value = res.data
    } catch (error) {
        ElMessage.error(error.message)
    }
}

const changePage = async (val) => {
    page.value = val
    switch(tabsIndex.value){
        case 0:
            await getCommentsLists()
        break;
        case 1:
            await getMemberChatLists();
        break;
    }
}

const tabChange = async (index)=>{
    tabsIndex.value = index;
    page.value = 1
    // 返回 false 表示阻止此次切换
    switch(index){
        case 0:
            await getCommentsLists();
        break;
        case 1:
            await getMemberChatLists();
        break;
        case 2:
            console.log(2)
        break;
        case 3:
            await getVideoRecord();
        break;
    }
    window.scrollTo(0, 0);

    // 返回 Promise 来执行异步逻辑
    return new Promise((resolve) => {
        resolve(true)
    });
}



const submitReply = async () => {
    try {
        const res = await axios.post('/comments/add_reply', {id:replyData.value.id, reply:replyData.value.reply}, {toast:1})
        if(res.status){
            ElMessage.success('回复成功')
            showReplyPopup.value = false
        }
    } catch (error) {
        ElMessage.error(error.message)
    }
}



const ratingRate = ref({});
const updateChartOptions = () => {
    if(comments.value.summary){
        const gaugeData = [
            {
                value: comments.value.summary.rating * 20,
                name: '好评率',
                title: {
                    offsetCenter: ['0%', '-20%'],
                    fontSize: 12,
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '30%']
                }
            }
        ];
        ratingRate.value = {
            series: [
                {
                    type: 'gauge',
                    radius: "96%",
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#6c629f',
                            color:'#968DB9'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 5
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 50
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 50,
                        height: 14,
                        fontSize: 12,
                        color: 'inherit',
                        borderColor: 'inherit',
                        borderRadius: 20,
                        borderWidth: 0,
                        formatter: '{value}%'
                    }
                }
            ]
        };
    }
}



onMounted(async () => {
    await getCommentsLists()
    updateChartOptions()

})


const goBack = () => {
    // router.go(-1)
    router.go(-1)
}

</script>

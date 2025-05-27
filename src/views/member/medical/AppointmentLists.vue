<template>
    <div class="h-full overflow-auto">
        <div class="border-bottom-1 border-gray-50">
            <van-tabs v-model:active="tabsActive" sticky>
                <van-tab v-for="(item, index) in tabsList">
                    <template #title>{{item.title}}</template>
                </van-tab>
            </van-tabs>
        </div>

        <div v-if="!appointmentLists">
            <el-empty description="~ 这里空空如野 ~" class="mt-8" />
        </div>
        <div v-else>
            <div class="px-4 pb-4 overflow-hidden">
                <div v-for="(item, index) in appointmentLists" :key="index" class="relative">
                    <div class="bg-dblue-50 border-1 border-dblue-100 border-round-xl mt-7 p-3 shadow-2 relative">
                        <div class="flex align-items-center">
                            <div class="shape-1 text-white text-xs border-round-sm"
                                style="padding:1px 4px 1px 4px; height:17px;"
                                :class="getStatusText(item.status).background">
                                {{getStatusText(item.status).text}}
                            </div>
                            <div class="shape-1 text-dblue-500 text-xs border-round-sm ml-1 bg-indigo-100"
                                style="padding:1px 8px 1px 8px; height:17px; line-height: 150%;">
                                {{ item.date }} {{ item.time }}
                            </div>
                        </div>
                        <div class="text-md mt-2">
                            <div class="text-xs text-dblue-300">预约{{ item.place }}</div>
                            <div class="">
                                {{ item.fullname }}
                                <span class="text-xs">{{ item.job_title + item.place }}</span>

                            </div>

                        </div>
                        <div class="mt-2 flex">
                            <div class="">
                                <div class="text-xs text-dblue-300">预约项目</div>
                                <div class="text-sm text-900">{{ item.model_name }}</div>
                            </div>
                            <!-- <div class="mt-2 text-center">
                                <img src="@@/icon/7160972787059421053-126.png" width="32px" height="32px"/>
                                <div class="text-xs text-purple-800">治疗效果</div>
                            </div> -->
                        </div>
                        <div class="absolute " style="right:-40px; bottom:0px; transform: rotateY(180deg);">
                            <img :src="item.headimg" @error.once="defaultAvatar" width="185px" />
                        </div>
                        <div class="mt-2 absolute" style="top:-42px; left:15px;">
                            <el-tag v-if="item.status==0" type="warning" size="default"
                                @click="cancelAppointment(item.id)" class="mr-2">取消预约</el-tag>
                            <el-tag v-if="item.status==7" type="success" size="default"
                                @click="showReviewPopup = true; reviewsForm.bid = item.bid; reviewsForm.worker_id = item.services_worker_id; reviewsForm.card_number = item.card_number; reviewsForm.model_id = item.id;"  class="mr-2">服务评价</el-tag>
                        </div>
                    </div>
                    <div v-if="item.exhort" class="bg-yellow-50 border-1 border-top-none border-yellow-100 mx-2 p-3 border-round-bottom-xl">
                        <div class="flex gap-2">
                            <div>
                                <img src="@@/icon/book.png" width="32px" height="32px"/>
                            </div>
                            <div class="text-sm">
                                <div class="text-xs text-yellow-500">康复建议：</div>
                                {{ item.exhort }}
                            </div>
                        </div>
                        <div v-if="item.comparison_image" class="absolute text-purple-600 border-1 bg-dblue-50 border-gray-300 border-round-md pr-1" style="right:15px; top:100px;">
                            <div class="flex align-items-center" @click="showImagePreview({images:[item.comparison_image],closeable: true})">
                                <img src="@@/icon/7160972787059421053-126.png" width="28px" height="28px"/>
                                <div class="text-xs">治疗效果图</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showReviewPopup" position="bottom" round closeable :style="{ padding: '15px', height: '380px' }">
        <div class="mb-3 text-lg">请您对本次服务进行评价</div>
        <div>
            <div class="flex justify-content-between align-items-center">
                <div class="text-sm">服务体验</div>
                <el-rate v-model="reviewsForm.star1" show-score text-color="#ff9900" score-template="{value} 分" />
            </div>
            <div class="flex justify-content-between align-items-center">
                <div class="text-sm">专业水平</div>
                <el-rate v-model="reviewsForm.star2" show-score text-color="#ff9900" score-template="{value} 分" />
            </div>
            <div class="flex justify-content-between align-items-center">
                <div class="text-sm">治疗效果</div>
                <el-rate v-model="reviewsForm.star3" show-score text-color="#ff9900" score-template="{value} 分" />
            </div>
            <div class="mt-3">
                <el-input v-model="reviewsForm.comment" style="width: 100%" :rows="5" type="textarea" placeholder="（选填）如果您有任何意见或建议请在此填写！" />
            </div>
            <el-button type="info" size="large" class="mt-3 w-full bg-dblue-500 border-dblue-100 text-dblue-50" @click="submitForm">提交评价</el-button>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from '@/utils/axios'
import moment from 'moment';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { getDates } from "@/utils/common"
import { showConfirmDialog, Popup as vanPopup, Tab as vanTab, Tabs as vanTabs, showImagePreview } from 'vant';

const showReviewPopup = ref(false)
const tabsActive = ref(null);
const tabsList = ref([
    {title:'全部', status: ''},
    {title:'待确认', status: '0'},
    {title:'已确认', status: '1'},
    {title:'待评价', status: '7'},
    {title:'已完成', status: '8'},
])

const appointmentLists = ref(null)

watch(()=>tabsActive.value, async (nval, oval)=>{
    const status = tabsList.value[tabsActive.value].status;
    const params = {
        bid:globalStore.memberInfo.bid, 
        card_number:globalStore.memberInfo.card_number, 
        model:'MedicalServices',
        status:status,
        type:2,
    }
    try {
        const res = await axios.get('/services/member_appointment_lists', params, {totast:0})
        if(res.status){
            appointmentLists.value = res.data
        }

    } catch (error) {

    }
})


const reviewsForm = ref({
    model:'Services',
    model_id:'',
    model_status:8,
    bid:'',
    worker_id:'',
    card_number:'',
    star1:5,
    star2:5,
    star3:5,
    comment:'',
})


const submitForm = async ()=>{

    if(!reviewsForm.value.worker_id || !reviewsForm.value.model_id){
        ElMessage.error('表单缺少必要参数')
        return;
    }


    const res = await axios.post('/comments/add_comment', reviewsForm.value)
    if(res.status){
        ElMessage.success(`${res.info}`)
        appointmentLists.value.filter((item)=>{
            if(item.id == reviewsForm.value.model_id){
                item.status = 8
            }
        })
        showReviewPopup.value = false;
        reviewsForm.value = {
            model:'Services',
            model_id:'',
            model_status:8,
            bid:'',
            worker_id:'',
            card_number:'',
            star1:5,
            star2:5,
            star3:5,
            comment:'',
        };
    }
}

const cancelAppointment = (id)=>{
    showConfirmDialog({
        title: '确认取消',
        message:'您确认要取消该次预约?',
    })
    .then(async () => {
        const res = await axios.post('/services/member_cancel_appointment', {id:id})
        if(res.status){
            ElMessage.success(`${res.info}`)
            appointmentLists.value = appointmentLists.value.filter((item)=> item.id != id)
        }
    })
    .catch(() => {
        // on cancel
    });
}



onMounted(async ()=>{
    switch(route.query.status){
        case '0':
            tabsActive.value = 1
        break;
        case '7':
            tabsActive.value = 3
        break;
        default:
        tabsActive.value = 0 
    }

    // await axios.get('/services/member_services_lists', {bid:globalStore.memberInfo.bid, card_number:globalStore.memberInfo.card_number, model:'MedicalServices'}, {totast:0}).then(res=>{
    //     if(res.status){
    //         servicesLists.value = res.data
    //         servicesLists.value.forEach((item)=>{
    //             servicesWorkerId.value.push(item.services_worker_id)
    //         })
    //     }
    // })

    // servicesWorkerId.value = [...new Set(servicesWorkerId.value)]

    // await axios.get('/worker/lists', {id:servicesWorkerId.value.join(',')}, {totast:0}).then(res=>{
    //     if(res.status){
    //         servicesWorkerLists.value = res.data
    //         choseServicesWorker.value = servicesWorkerLists.value[0]
    //         form.value.services_worker_id = servicesWorkerLists.value[0].id;
    //         form.value.job_title = servicesWorkerLists.value[0].job_title;
    //     }
    // })

})

// 根据状态获取相应的文本值
const getStatusText = (status: string) => {
    const statusMap: any = {
        '0': { text: '待确认', icon: 'pending-icon', color: 'text-red-500', background: 'bg-red-500' },
        '1': { text: '已确认', icon: 'confirmed-icon', color: 'text-dblue-500', background: 'bg-dblue-500' },
        '7': { text: '待评价', icon: 'completed-icon', color: 'text-teal-500', background: 'bg-teal-500' },
        '8': { text: '已完成', icon: 'completed-icon', color: 'text-green-500', background: 'bg-green-500' },
        '-1': { text: '已取消', icon: 'cancelled-icon', color: 'text-bluegray-500', background: 'bg-bluegray-500' }

    };
    return statusMap[status];
};

import avatar from '@@/images/default_avatar.webp'
const defaultAvatar = (event)=> {
    event.target.src = avatar;
}

</script>
<style scoped></style>

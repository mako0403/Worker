<template>
    <div class="h-full pb-6 overflow-auto">
        <div v-if="!servicesLists">
            <el-empty description="您尚未购买任何服务" class="mt-8" />
        </div>
        <div v-else>
            <div class="px-4 pt-3 bg-gray-50">
                <div class="">
                    <div class="flex justify-content-between align-items-center gap-3">
                        <div class="">
                            <el-avatar :size="65">
                                <img :src="choseServicesWorker.headimg" @error.once="defaultAvatar" />
                            </el-avatar>
                        </div>
                        <div class="w-full">
                            <div class="">
                                <div class="text-xl font-medium">{{ choseServicesWorker.fullname }}</div>
                                <div class="text-sm text-gray-400">{{ choseServicesWorker.job_title +
                                    choseServicesWorker.place }}</div>
                                <!-- <div>
                                <el-rate v-model="value" disabled show-score text-color="#ff9900"
                                    score-template="{value} points" size="small" />
                            </div> -->
                            </div>
                        </div>
                        <div class="" v-if="servicesWorkerId.length > 1">
                            <el-icon class="text-600" @click="showWorkerLists = true">
                                <Refresh />
                            </el-icon>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="flex justify-content-between align-items-center gap-2">
                        <div class="text-md">您期望预约日期</div>
                        <div class="text-xs text-500">{{ moment(choseDate, 'YYYY/MM/DD').format('YYYY年MM月DD日') }}</div>
                    </div>
                    <el-scrollbar class="pb-3 mt-3">
                        <div class="flex">
                            <div v-for="(day, index) in getDates(16, hasOffday).filter((item, i)=> i !== 0)"
                                :key="index" class="mr-2">
                                <div @click="!day.offday ? choseDate = day.date : ''"
                                    :class="{ 'bg-dblue-500 text-dblue-50 border-dblue-700': choseDate == day.date, 'bg-gray-50 text-gray-500': choseDate != day.date, 'text-gray-300 border-dblue-50': day.offday, 'border-dblue-100': !day.offday }"
                                    class="flex-shrink-0 align-items-center justify-content-center align-content-center text-center px-2 py-2 border-round-xl border-1">
                                    <div class="font-medium text-xl">{{ day.day }}</div>
                                    <div class="mt-1 text-xs" :class="{ 'text-bluegray-300': choseDate != day.date }">{{
                                        !day.offday ? day.weekday : '休' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="py-2">
                    <div class="flex justify-content-between align-items-center">
                        <div class="text-md">您期望预约到</div>
                        <div class="flex">
                            <div class="text-center text-sm px-3 py-1 border-round-2xl border-1 bg-gray-50 text-gray-500 ml-2"
                                :class="{ 'bg-dblue-500 text-dblue-50 border-dblue-700': form.time == i }"
                                v-for="i in globalStore?.branchConfig?.config?.TIME_BOOK.split(',')" :key="i"
                                @click="form.time = i;">{{ i }}</div>
                        </div>
                    </div>
                    <div class="text-xs text-500 mt-3 mb-2">准确到店时间由康复师确认时进行确定，届时您将收到消息通知，请您留意最终确认信息。</div>
                </div>
            </div>
            <div class="px-4 py-3">
                <div class="text-md">请选择您要预约的项目</div>
                <div v-for="(item, index) in servicesLists.filter((d)=> d.services_worker_id === choseServicesWorker.id)"
                    :key="index" @click="selectServices(item)" class="p-3 bg-blue-50 border-round-xl border-1 border-gray-100 mt-3">
                    <div class="flex justify-content-between align-items-center gap-3">
                        <div>
                            <img :src="item.model_cover" width="58px" />
                        </div>
                        <div class="w-full">
                            <div>{{ item.model_name}}</div>
                            <!-- <div class="text-xs text-500"><van-text-ellipsis rows="2" :content="item.model_description" /></div> -->
                            <div class="text-xs text-dblue-300 mt-1">{{ `共${item.total_purchase}次 已用${item.total_usage}次
                                剩余${item.limits}次` }}</div>
                        </div>
                        <div v-if="form.model_id == item.model_id"
                            class="border-1 border-green-500 border-circle pt-1 px-1">
                            <el-icon size="18" class="text-green-500">
                                <Check />
                            </el-icon>
                        </div>
                        <div v-else class="border-1 border-gray-300 border-circle pt-1 px-1">
                            <el-icon size="18" class="text-green-50">
                                <Check />
                            </el-icon>
                        </div>
                    </div>
                    <div class="mt-2 text-gray-500 text-xs">
                        <van-text-ellipsis :content="item.model_description" rows="2" expand-text="展开" collapse-text="收起"/>
                    </div>
                </div>
            </div>

            <div class="px-4 mt-3">
                <el-button type="primary" size="large" class="w-full bg-dblue-500 border-dblue-700"
                    @click="submitForm">提 交 预 约</el-button>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showWorkerLists" position="bottom" round :style="{ padding: '15px', height: '260px' }">
        <div class="mb-2">请选择服务人员</div>
        <el-scrollbar>
            <div class="flex">
                <div class="bg-green-50 border-1 border-green-100 border-round-lg mr-3 overflow-hidden"
                    v-for="(item, index) in servicesWorkerLists" :key="index" @click="selectWorker(item)">
                    <img :src="item.headimg" @error.once="defaultAvatar" width="150px" class="mt-2" />
                    <div class="text-center py-2 text-md bg-white">{{ item.fullname }}</div>
                </div>
            </div>
        </el-scrollbar>
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
import { TextEllipsis as vanTextEllipsis, Popup as vanPopup } from 'vant';


const servicesLists = ref(null)
const servicesWorkerId = ref([])
const servicesWorkerLists = ref([])
const choseServicesWorker = ref([])
const showWorkerLists = ref(false)
const form = ref({
    model:'MedicalServices',
    type: 2,
    bid:'',
    services_worker_id: '',
    model_id:'',
    card_number:'',
    limits:-1,
    date: '',
    time: '',
    job_title:'',
    job_title_bonus:'',
})
const value = 4.5


const choseDate = ref(getDates(16)[1].date) // 默认选择第二日
const hasOffday = ref([])
watch(() => choseServicesWorker.value.offday, (nval, oval) => {
    if (nval) {
        hasOffday.value = nval.split(',').map((dateString: any, i) => {
            if(choseDate.value == dateString) {
                choseDate.value = dateLists.value[i+1].date
            }
            return moment(dateString, 'YYYY/MM/DD').toDate(); // 解析日期格式
        }).filter((date: any) => {
            return moment(date).isSameOrAfter(moment().startOf('day'));
        })
    } else {
        hasOffday.value = [];
    }
}, { immediate: true })

const dateLists = ref(getDates(16, hasOffday.value));
dateLists.value.splice(0, 1);





const selectWorker = (item)=>{
    choseServicesWorker.value = item; 
    showWorkerLists.value = false;  
    form.value.services_worker_id = item.id;
    form.value.job_title = item.job_title;
    form.value.model_id = '';
}

const selectServices = (item)=>{
    form.value.model_id = item.model_id;
    if(form.value.job_title){
        form.value.job_title_bonus = item.job_title_bonus_once[form.value.job_title];
    }
    
}

const submitForm = async ()=>{
    form.value.bid = choseServicesWorker.value.bid
    form.value.card_number = globalStore.memberInfo.card_number
    form.value.date = choseDate.value
    if(!form.value.date || !form.value.time){
        ElMessage.error('请选择日期和时间')
        return;
    }

    if(!form.value.model_id){
        ElMessage.error('请选择服务项目')
        return;
    }

    await axios.post('/services/use_services', form.value).then(res=>{
        if(res.status){
            ElMessage.success(`${res.info}`)
            router.push({path: '/member/medical/appointment/lists'})
        }
    })
}



onMounted(async ()=>{
    console.log(route.query)
    const res = await axios.get('/services/member_services_lists', {
        bid:globalStore.memberInfo.bid, 
        card_number:globalStore.memberInfo.card_number, 
        model:'MedicalServices'
    }, {totast:0})
    if(res.status){
        servicesLists.value = res.data
        if(servicesLists.value){
            servicesLists.value.forEach((item)=>{
                servicesWorkerId.value.push(item.services_worker_id)
            })

            servicesWorkerId.value = [...new Set(servicesWorkerId.value)]

            await axios.get('/worker/lists', {id:servicesWorkerId.value.join(',')}, {totast:0}).then(res=>{
                if(res.status){
                    servicesWorkerLists.value = res.data
                    if(route.query.services_worker_id){
                        choseServicesWorker.value = servicesWorkerLists.value.find((item)=> item.id === route.query.services_worker_id)
                        form.value.services_worker_id = choseServicesWorker.value.id;
                        form.value.job_title = choseServicesWorker.value.job_title;
                    }else{
                        choseServicesWorker.value = servicesWorkerLists.value[0]
                        form.value.services_worker_id = servicesWorkerLists.value[0].id;
                        form.value.job_title = servicesWorkerLists.value[0].job_title;
                    }
                    
                    
                }
            })

        }

    }

    if(route.query.model_id){
        form.value.model_id = route.query.model_id;
    }
})

watch(()=>route.query, (nval, oval)=>{
    if(nval.model_id && nval.model_id!= oval.model_id){
        form.value.model_id = nval.model_id;
    }
})

import avatar from '@@/images/default_avatar.webp'
const defaultAvatar = (event)=> {
    event.target.src = avatar;
}

</script>

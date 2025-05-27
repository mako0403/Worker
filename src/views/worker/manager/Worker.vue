<template>
    <div class="h-full">
        <div class="flex justify-content-between align-items-center p-3 bg-gray-50">
            <div class="flex align-items-center gap-3">
                <el-avatar :src="uploadsPath + workerConfig.headimg" class="bg-pink-100"></el-avatar>
                <div class="">
                    <div class="text-md">Hello, {{ workerConfig.fullname }}</div>
                    <div class="text-xs text-600">
                        {{ currentDate[0]+'年 '+currentDate[1]+'月' }}
                        {{ activeTabs=='0'?'销售排行':'' }}
                        {{ activeTabs=='1'?'绩效排行':'' }}
                        {{ activeTabs=='2'?'服务排行':'' }}
                    </div>
                </div>
            </div>
            <div class="flex align-items-center">
                <el-tooltip :visible="showSortMenu" class="box-item" effect="light" placement="left-start" popper-class="p-0">
                    <svg class="icon opacity-70 rotate-90 mt-1" aria-hidden="true" style="width:26px; height:26px;" @click="showSortMenu=!showSortMenu">
                        <use xlink:href="#icon-duihuan"></use>
                    </svg>
                    <template #content>
                        <div class="text-xs py-1">
                            <div class="px-2 py-1" @click="sortData = 'xs'; showSortMenu=false; activeTabs='0';">
                                销售排行
                            </div>
                            <el-divider class="m-0 border-gray-50" />
                            <div class="px-2 py-1" @click="sortData = 'ss'; showSortMenu=false; activeTabs='1';">
                                绩效排行
                            </div>
                            <el-divider class="m-0 border-gray-50" />
                            <div class="px-2 py-1" @click="sortData = 'zl'; showSortMenu=false; activeTabs='2';">
                                服务排行
                            </div>
                        </div>
                    </template>
                </el-tooltip>
                <div class="border-circle bg-gray-100 px-2 py-1 ml-2">
                    <el-icon size="16" class="mt-1 text-800" @click="showCurrentDate = !showCurrentDate">
                        <Calendar />
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="pt-3  pb-5">
            <div class="p-3">
                <div v-for="(item, index) in workerLists" :key="index" class="mb-5">
                    <div class="bg-yellow-50 border-1 border-yellow-100 border-round-lg pb-3">
                        <div class="flex gap-3 px-3 pt-3 pb-3">
                            <div class="-mt-4">
                                <div class="bg-pink-50 border-1 border-pink-100 border-circle pl-1 pr-1 pt-1">
                                    <el-avatar :src="item.headimg" class="relative bg-pink-50" style="width: 72px; height: 72px; bottom: -4px;"></el-avatar>
                                </div>
                                
                            </div>
                            <div class="w-full -mt-1">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="font-bold">{{ item.fullname }}</span>
                                        <span class="text-xs text-800 ml-2">{{ item.job_title+item.place }}</span>
                                    </div>
                                    <div>
                                        
                                        <!-- <svg class="icon" aria-hidden="true" style="width:18px; height:18px;" @click="getWorkerPaydetails(item.id, item.bid)">
                                            <use xlink:href="#icon-dingdan"></use>
                                        </svg> -->
                                    </div>
                                </div>
                                <div class="text-xs text-500 mt-1">{{ item.branch.name }}</div>
                                <div v-if="item.performance">
                                    <el-rate :model-value="item.performance.rating" size="small" disabled show-score text-color="#ff9900" score-template="{value} points" />
                                </div>
                            </div>
                        </div>
                        <div class="px-3 mb-1">
                            <div class="flex justify-content-between align-items-center">
                                <div class="text-xs text-400 mb-1">基础治疗量任务完成度</div>
                                <div class="text-xs text-blue-600">{{ item.performance.usage_number }} %</div>
                            </div>
                            <el-progress :percentage="item.performance.usage_number" :text-inside="true" :stroke-width="5">
                                <div> </div>
                            </el-progress>
                        </div>
                        <div class="ml-3 mr-3">
                            <el-tabs v-model="activeTabs">
                                <el-tab-pane label="销售" name="0">
                                    <template #label>
                                        <span class="custom-tabs-label flex align-items-center gap-1">
                                            <el-icon><Money /></el-icon>
                                            <span>销售</span>
                                        </span>
                                    </template>
                                    <div v-if="item.monthly_sale" class="flex justify-content-between align-items-center gap-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <RouterLink :to="{path:'/worker/services/sales_records', query:{bid:item.bid, worker_id:item.id, date:currentDate.join('-')}}">
                                                <div class="text-xs text-400">销售总额</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_sale_price }}
                                                </div>
                                            </RouterLink>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-jiankong"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">实收额</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_sale_received }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                    </div>
                                    <div v-if="item.monthly_sale" class="flex justify-content-between align-items-center gap-2 mt-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">待付款</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_sale_debt }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">非实收</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_sale_non_received }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <RouterLink :to="{path:'/worker/services/sales_records', query:{bid:item.bid, worker_id:item.id, date:currentDate.join('-'), gift:1}}">
                                                <div class="text-xs text-400">赠送额</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_gift_price }}
                                                </div>
                                            </RouterLink>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-jiankong"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="绩效" name="1">
                                    <template #label>
                                        <span class="custom-tabs-label flex align-items-center gap-1">
                                            <el-icon><GoldMedal /></el-icon>
                                            <span>绩效</span>
                                        </span>
                                    </template>
                                    <div v-if="item.performance" class="flex justify-content-between align-items-center gap-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div @click="getWorkerPaydetails(item.id, item.bid)">
                                                <div class="text-xs text-400">收费总额</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.performance.current_month_sales_amount }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-jiankong"></use>
                                            </svg>
                                        </div>
                                    </div>
                                    <div v-if="item.performance" class="flex justify-content-between align-items-center gap-2 mt-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">销售提成</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.performance.sales_bonus }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">销售奖金</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.performance.sales_award }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">治疗量奖金</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.performance.usage_amount }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="服务" name="2">
                                    <template #label>
                                        <span class="custom-tabs-label flex align-items-center gap-1">
                                            <el-icon><Help /></el-icon>
                                            <span>服务</span>
                                        </span>
                                    </template>
                                    <div v-if="item.monthly_sale" class="flex justify-content-between align-items-center gap-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <RouterLink :to="{path:'/worker/services/usage_records', query:{bid:item.bid, worker_id:item.id, date:currentDate.join('-')}}">
                                                <div class="text-xs text-400">治疗量</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.performance.usage_number }}
                                                </div>
                                            </RouterLink>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-jiankong"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">预约量</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_used_limits }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                    </div>
                                    <div v-if="item.monthly_sale" class="flex justify-content-between align-items-center gap-2 mt-2">
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">服务患者</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_worker_member_count }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">本月新客</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_purchase_new_member_count }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                        <div class="w-full bg-white p-3 border-round-lg relative">
                                            <div>
                                                <div class="text-xs text-400">老客复购</div>
                                                <div class="text-lg text-red-600 mt-1">    
                                                    {{ item.monthly_sale.total_purchase_repeat_member_count }}
                                                </div>
                                            </div>
                                            <svg class="icon opacity-50 absolute" aria-hidden="true" style="width:26px; height:26px; top:8px; right:8px;">
                                                <use xlink:href="#icon-fangdichan"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showCurrentDate" position="bottom" :style="{ padding: '0' }">
        <van-date-picker v-model="currentDate" title="选择年月" :min-date="minDate" :max-date="maxDate"
            :columns-type="columnsType" @cancel="showCurrentDate = !showCurrentDate" @confirm="setCurrentDate" />
    </van-popup>
    <van-popup v-model:show="showWorkerPaydetails" position="bottom" :style="{ padding: '0', height: '70%' }">
        <vue3-datatable v-if="workerPaydetailsData" :rows="workerPaydetailsData.details" :columns="cols" :sortable="true" :columnFilter="true" :pageSize="10" :showPageSize="false" :totalRows="workerPaydetailsData.details.length">
            <template #member_name="data">
                <div class="flex align-items-center gap-3">
                    <el-avatar :src="data.value.member_avatar" style="min-width: 30px; min-height: 30px;"/>
                    <div class="">
                        <div class="font-semibold">{{ data.value.member_name}}</div>
                        <div class="text-xs text-600">{{ data.value.card_number}}</div>
                    </div>
                </div>
            </template>
            <template #paymethod="data">
                <div class="">
                    <div class="text-xs text-600">{{ data.value.is_new_pay}}</div>
                    <div class="font-semibold">{{ data.value.paymethod}}</div>
                </div>
            </template>
        </vue3-datatable>
    </van-popup>
</template>
<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch } from 'vue'
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';
import moment from "moment"
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

import { ElMessage, ElLoading } from "element-plus";
import { useGlobalStore } from '@/store/global'
const { uploadsPath, workerConfig } = toRefs(useGlobalStore());

import EChartsComponent from '@/components/common/ECharts.vue';

import { DatePicker as vanDatePicker, Popup as vanPopup, Tab as vanTab, Tabs as vanTabs } from 'vant';

import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'

const showSortMenu = ref(false);
const activeTabs =ref('0');

const showCurrentDate = ref(false);
const currentDate = ref([moment().year(), moment().month()+1]);
const columnsType = ['year', 'month'];
const minDate = new Date('2024', '05', '1');
const maxDate = moment().add(1, 'month').add(1, 'day').toDate();
const setCurrentDate = async (value) => {
    currentDate.value = value.selectedValues;
    showCurrentDate.value = false;
    await getWorkerlists();
}


const showWorkerPaydetails = ref(false);
const workerPaydetailsData = ref([]);
const getWorkerPaydetails = async (worker_id, bid) => {
    try {
        const { data } = await axios.get(`/services/get_worker_paydetails_commission`, { worker_id: worker_id, bid: bid, month: currentDate.value[1], year: currentDate.value[0] }, { toast: 1 });
        if (data) {
            workerPaydetailsData.value = data;
            showWorkerPaydetails.value = true;
        }
    } catch (error) {
        ElMessage.error(error);
    }
}
const tableLoading: any = ref(true);
const cols = ref([
        { field: 'member_name', title: '患者信息', filter:false, minWidth:'140px' },
        //{ field: 'card_number', title: '会员卡号', filter:false, minWidth:'120px' },
        { field: 'services_name', title: '支付项目', filter:false, minWidth:'120px' },
        { field: 'paymethod', title: '付款方式', filter:false, minWidth:'120px' },
        { field: 'value', title: '实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'bonus', title: '绩效奖金', filter:false, minWidth:'140px', type: 'number' },
        { field: 'date', title: '收款日期', filter:false, minWidth:'120px', type: 'date' },
]);



// 员工列表
const workerLists = ref([]);
const getWorkerlists = async () => {
    try {
        const { data } = await axios.get('/worker/lists', { is_assess: 1 }, { toast: 0 });
        if (data) {
            workerLists.value = data;
            await getWorkerPerformance();
            await getWorkerMonthlySale();

            workerLists.value.forEach((item)=>{
                item.performance = workerPerformance.value.find(item2 => item.id == item2.worker_id).statistics
                item.monthly_sale = workerMonthlySale.value.find(item3 => item.id == item3.worker_id)
                //console.log(item.fullname ,workerPerformance.value.find(item2 => item.id === item2.worker_id))
            })
            workerLists.value = workerLists.value.slice().sort((a, b) => (
                a.monthly_sale?a.monthly_sale.total_sale_price:0) - (b.monthly_sale?b.monthly_sale.total_sale_price:0)
            ).reverse();
        }
    } catch (error) {
        ElMessage.error(error);
    }
}

// 员工绩效
const workerPerformance = ref([]);
const getWorkerPerformance = async() =>{
    try {
        const { data } = await axios.get('/services/get_all_workers_statistics', {model:'MedicalServices', year: currentDate.value[0], month: currentDate.value[1]});
        if (data) {
            workerPerformance.value = data;
        }
    } catch (error) {
        ElMessage.error(error);
    }
}

const workerMonthlySale = ref([]);
const getWorkerMonthlySale = async() =>{
    try {
        const { data } = await axios.get('/services/get_monthly_analysis', {mode:'worker_sales_ranking', year: currentDate.value[0], month: currentDate.value[1]});
        if (data) {
            workerMonthlySale.value = data;
        }
    } catch (error) {
        ElMessage.error(error);
    }
}


const sortData = ref('xs');
watch(() => sortData.value, (nval, oval) => {
    const loading = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.2)',
    });
    if(nval=='xs'){
        workerLists.value = workerLists.value.slice().sort((a, b) => (
            a.monthly_sale?a.monthly_sale.total_sale_price:0) - (b.monthly_sale?b.monthly_sale.total_sale_price:0)
        ).reverse();
        loading.close()
    }
    if(nval=='ss'){
        workerLists.value = workerLists.value.slice().sort((a, b) => (
            a.performance?a.performance.current_month_sales_amount:0) - (b.performance?b.performance.current_month_sales_amount:0)
        ).reverse();
        loading.close()
    }
    if(nval=='zl'){
        workerLists.value = workerLists.value.slice().sort((a, b) => (
            a.performance?a.performance.usage_number:0) - (b.performance?b.performance.usage_number:0)
        ).reverse();
        loading.close()
    }
})

onBeforeMount(async () => {
    // if(useRoute().query.bid){
    //     choseBranchId.value = [useRoute().query.bid]
    // }else{
    //     choseBranchId.value = [localStorage.getItem('performance_first_bid')]
    // }
    //analysisData.value = JSON.parse(localStorage.getItem('performance_first_branch'));

    await getWorkerlists();
});


</script>
<style scoped>
.wtab{
    background-image: linear-gradient(to right bottom, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
}

</style>

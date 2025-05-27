<template>
    <div class="w-full h-full">
        <el-header class="p-3 border-top-1 border-gray-50">
            <el-page-header @back="router.go(-1)">
                <!-- <template #icon>
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                </template> -->
                <template #content>
                    <div class="text-large font-600 text-900 mr-3"> {{ route.query.card_number ? (recordsLists ? recordsLists[0].fullname + '收费记录' : '服务收费记录') : '服务收费记录' }} </div>
                </template>
                <!-- <template #extra>
                    <svg class="icon" aria-hidden="true" style="width:24px; height:24px;" @click="getPayDetails()">
                        <use xlink:href="#icon-shuju"></use>
                    </svg>
                </template> -->
            </el-page-header>
        </el-header>

        <div v-if="statistics" class="p-3">
            <div class="flex justify-content-between gap-3">
                <div class="flex-1 p-3 bg-red-500 text-white border-round-lg relative overflow-hidden"  @click="getPayDetails()">
                    <div class="text-sm">实收总额</div>
                    <div class="mt-2 text-md">{{statistics.current_month_sales_amount}}</div>
                    <div class="text-xs text-red-200 mt-1">点击查看明细</div>
                    <el-icon class="absolute opacity-80" size="42px" style="right: 10px; top: 10px; z-index: 1;"><ScaleToOriginal /></el-icon>
                    <div class="w-5rem h-5rem bg-white border-circle absolute opacity-20" style="right: -24px; top: -24px; z-index: 0;"></div>
                </div>
                <div class="flex-1 p-3 bg-teal-500 text-white border-round-lg relative overflow-hidden">
                    <div class="text-sm">绩效汇总</div>
                    <div class="mt-2 text-md">{{(Number(statistics.sales_bonus) + Number(statistics.sales_award) + Number(statistics.usage_amount)).toFixed(2)}}</div>
                    <div class="text-xs text-teal-200 mt-1">含绩效提成及奖金</div>
                    <el-icon class="absolute opacity-80" size="42px" style="right: 10px; top: 10px; z-index: 1;"><PieChart /></el-icon>
                    <div class="w-5rem h-5rem bg-white border-circle absolute opacity-20" style="right: -24px; top: -24px; z-index: 0;"></div>
                </div>

            </div>
            <div class="flex justify-content-between gap-3 mt-3">
                <div class="flex-1 p-3 bg-blue-500 text-white border-round-lg relative overflow-hidden">
                    <div class="text-sm">销售患者人数</div>
                    <div class="mt-2 text-md">{{  statistics.current_month_sales_count }}</div>
                    <div class="text-xs text-blue-200 mt-1">本月新增销售客单量</div>
                    <el-icon class="absolute opacity-80" size="42px" style="right: 10px; top: 10px; z-index: 1;"><Connection /></el-icon>
                    <div class="w-5rem h-5rem bg-white border-circle absolute opacity-20" style="right: -24px; top: -24px; z-index: 0;"></div>
                </div>
                <div class="flex-1 p-3 bg-yellow-500 text-white border-round-lg relative overflow-hidden">
                    <div class="text-sm">合计治疗量</div>
                    <div class="mt-2 text-md">{{statistics.usage_number}}</div>
                    <div class="text-xs text-yellow-200 mt-1">作为绩效的预约量</div>
                    <el-icon class="absolute opacity-80" size="42px" style="right: 10px; top: 10px; z-index: 1;"><GoldMedal /></el-icon>
                    <div class="w-5rem h-5rem bg-white border-circle absolute opacity-20" style="right: -24px; top: -24px; z-index: 0;"></div>
                </div>
            </div>
        </div>

        <div class="px-3 mt-3" v-if="!route.query.card_number">
            <div class="flex justify-content-between align-items-center">
                <div class="text-xl text-dblue-500 flex align-items-center gap-2">
                    {{ moment(currentDate.join('-'), "YYYY-MM").format('YYYY年MM月') }}
                </div>
                <div class="text-dblue-500">
                    <el-icon size="18px" @click="showDatePicker = true">
                        <Calendar />
                    </el-icon>
                </div>
            </div>
        </div>

        <div class="">
            <div class="mt-3">
                <vue3-datatable v-if="payDetails" :rows="payDetails.details" :columns="cols" :sortable="true" :columnFilter="true" :pageSize="20" :showPageSize="false" :totalRows="payDetails.details.length">
                    <template #fullname="data">
                        <div class="flex align-items-center gap-3">
                            <el-avatar :src="data.value.avatar" style="min-width: 30px; min-height: 30px;"/>
                            <div class="">
                                <div class="font-semibold">{{ data.value.fullname}}</div>
                                <div class="text-xs text-600">{{ data.value.card_number}}</div>
                            </div>
                        </div>
                    </template>
                </vue3-datatable>
                <div v-else>
                    <div v-if="!recordsLists" class="mt-5">
                        <el-empty description="No records found">
                            <div class="text-xs text-500">仅展示推荐员工为{{ globalStore.workerConfig.fullname }}的收费记录</div>
                        </el-empty>
                    </div>
                    <div v-else class="p-3">
                        <div v-for="(item, index) in recordsLists" :key="index"
                            class="border-1 border-gray-100 border-round-xl mb-5 overflow-hidden">
                            <div class="flex gap-3 px-3 pt-3">
                                <div class="">
                                    <el-avatar :size="50" :src="item.avatar || defaultAvatar" />
                                </div>
                                <div class="">
                                    <div class="text-md font-bold">{{ item.fullname }}</div>
                                    <div class="text-sm mt-2 text-500">{{ item.card_number }}</div>
                                </div>
                            </div>
                            <el-divider content-position="left"><span class="text-gray-300">Transaction
                                    records</span></el-divider>
                            <div class="px-3 pb-3">
                                <div v-for="(deal, dindex, i) in item.deal" :key="dindex" class="">
                                    <el-divider v-if="i > 0" border-style="dotted" />
                                    <div class="flex gap-3 align-items-start">
                                        <div class="">
                                            <img :src="deal.cover" width="42px">
                                        </div>
                                        <div class="w-full">
                                            <div class="flex justify-content-between align-items-center">
                                                <div class="text-sm"
                                                    style="width:60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                    <span class="mr-1 text-xs text-dblue-500">{{ `(${deal.limits}次)` }}</span>
                                                    {{ deal.name }}
                                                </div>
                                                <div class="text-sm">{{
                                                    deal.barcode ? `**** ${deal.barcode.substr(deal.barcode.length - 6)}` : '****' }}
                                                </div>
                                            </div>
                                            <div class="mt-1 text-sm flex justify-content-between align-items-center">
                                                <div class="text-green-700 text-xs">{{ deal.create_time }}</div>
                                                <div class="text-gray-600" v-if="deal.is_gift == 1">
                                                    <el-tag type="info" effect="light" size="small">
                                                        赠送
                                                    </el-tag>
                                                </div>
                                                <div class="text-gray-600" v-else>
                                                    <el-tag v-if="deal.payfull != 1" type="danger" effect="light" size="small">
                                                        <span class="text-xs font-thin">￥</span>{{ deal.price }} 有待付款
                                                    </el-tag>
                                                    <el-tag v-if="deal.payfull == 1" type="success" effect="light" size="small">
                                                        <span class="text-xs font-thin">￥</span>{{ deal.price }} 已付全款
                                                    </el-tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="deal.additional" class="bg-gray-50 p-3 border-round-md border-1 border-gray-100 mt-3">
                                        <div class="text-sm text-800 mb-3 flex align-items-center">
                                            <el-icon class="text-lg mr-1"><Expand /></el-icon>
                                            <div class="font-bold">购买附加服务</div>
                                        </div>
                                        <div v-for="(additional, ai) in deal.additional" :key="ai" class="">
                                            <div>
                                                <div class="flex gap-3" :class="{'mt-2 pt-2 border-top-1 border-gray-100':ai!=0}">
                                                    <div><img :src="additional.cover" width="52px" class="border-round-sm"></div>
                                                    <div class="w-full">
                                                        <div class="flex gap-1 align-items-center text-xs" >
                                                            <div class="w-full text-900 font-bold ellipsis ellipsis-line-1">
                                                                <span class="text-600">[{{ additional.related_model_name }}]</span>
                                                                {{ additional.name }}
                                                            </div>
                                                            <div class="text-red-600">￥<span class="text-sm">{{ additional.price }}</span></div>
                                                        </div>
                                                        <div class="text-xs text-600 mt-1">
                                                            <van-text-ellipsis rows="1" :content="additional.description" expand-text="展开" collapse-text="收起"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="deal.remark" class="text-xs text-700 bg-gray-50  mx-1 p-3">{{ `备注：${deal.remark}` }}</div>
                                </div>
                            </div>
                            
                            <div v-if="item.total_price || item.total_price || item.total_price"
                                class="text-center mt-3 py-3 bg-green-50">
                                <el-row :gutter="16">
                                    <el-col :span="8">
                                        <div class="statistic-card">
                                            <el-statistic :value="Number(item.total_price) || 0" :value-style="{ color: '#ff3d32' }">
                                                <template #title>
                                                    <div style="display: inline-flex; align-items: center"
                                                        class="text-dblue-800">
                                                        应付总额
                                                    </div>
                                                </template>
                                            </el-statistic>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="statistic-card border-x-1 border-200">
                                            <el-statistic :value="Number(item.total_paid) || 0" :value-style="{ color: '#eab308' }">
                                                <template #title>
                                                    <div style="display: inline-flex; align-items: center"
                                                        class="text-dblue-800">
                                                        已付总额
                                                        <el-tooltip v-if="item.total_paid != item.actual_total_paid" effect="dark" :content="`实收总额：${item.actual_total_paid}`" placement="top">
                                                            <el-icon style="margin-left: 4px" :size="12">
                                                                <InfoFilled />
                                                            </el-icon>
                                                        </el-tooltip>
                                                    </div>
                                                </template>
                                            </el-statistic>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="statistic-card">
                                            <el-statistic :value="Number(item.total_bonus) || 0" :value-style="{ color: '#22c55e' }">
                                                <template #title>
                                                    <div style="display: inline-flex; align-items: center"
                                                        class="text-dblue-800">
                                                        绩效奖金
                                                        <el-tooltip effect="dark" content="绩效奖金按实付金额计算" placement="top">
                                                            <el-icon style="margin-left: 4px" :size="12">
                                                                <Warning />
                                                            </el-icon>
                                                        </el-tooltip>
                                                    </div>
                                                </template>
                                            </el-statistic>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showDatePicker" position="bottom" :style="{ padding: '0 10px', height: '308px' }">
        <van-date-picker v-model="currentDate" title="选择日期" @cancel="showDatePicker = false" :min-date="minDate" :max-date="maxDate"
            :columns-type="columnsType" @confirm="getRecords(); showDatePicker = false; payDetails=null;" />
    </van-popup>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import moment from "moment"

import { ElMessage } from 'element-plus';
import { getCurrentDate } from '@/utils/common'
import { DatePicker as vanDatePicker, Popup as vanPopup, TextEllipsis as vanTextEllipsis } from 'vant';
import defaultAvatar from '@@/images/default_avatar.webp'

import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
const tableLoading: any = ref(true);
const cols = ref([
        { field: 'fullname', title: '患者信息', filter:false, minWidth:'140px' },
        //{ field: 'card_number', title: '会员卡号', filter:false, minWidth:'120px' },
        { field: 'paymethod', title: '付款方式', filter:false, minWidth:'120px' },
        { field: 'received', title: '实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'non_received', title: '非实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'date', title: '收款日期', filter:false, minWidth:'120px', type: 'date' },
]);


const showDatePicker = ref(false)
const currentDate = ref(route.query.date?[route.query.date.split('-')]:[moment().year(), moment().month()+1]);
const columnsType = ['year', 'month'];
const minDate = new Date('2024', '05', '1');
const maxDate = moment().add(1, 'month').add(1, 'day').toDate();
const recordsLists = ref(null)

// const dataStatic = ref(null)

onMounted(async () => {
    getRecords()
    
})

const statistics = ref([])
const getWorkerMStatistics = async() =>{
    try {
        const { data } = await axios.get('/services/get_all_workers_statistics', {worker_id:globalStore.workerConfig.id, year:currentDate.value[0], month:currentDate.value[1], model:'MedicalServices'})
        statistics.value = data[0].statistics
    } catch (error) {
        ElMessage.error(error);
    }
}


const getRecords = async () => {
    const res = await axios.get('/services/get_member_sales_details', {bid:route.query.bid?route.query.bid:globalStore.workerConfig.bid, worker_id: route.query.worker_id?route.query.worker_id:globalStore.workerConfig.id, date: route.query.date?route.query.date:currentDate.value.join('-'), gift:route.query.gift?route.query.gift:'', card_number: route.query.card_number ? route.query.card_number : '' });
    if (res.status) {
        recordsLists.value = res.data
    }
    getWorkerMStatistics()
    // if(recordsLists.value.length){
    //     // recordsLists.value.forEach((item)=>{
    //     //     item.deal.forEach((deal)=>{
    //     //         //deal.create_time = getCurrentDate(new Date(deal.create_time), 'YYYY-MM-DD HH:mm:ss')
    //     //         if(deal.bonus > 0){
    //     //             dataStatic.value.bonus = dataStatic.value.bonus
    //     //         }
    //     //     })
    //     // })
    // }

}


const payDetails = ref(null);
const getPayDetails = async () => {
    try {
        //tableLoading.value = true
        const { data } = await axios.get('/services/get_payment_details', { bid: globalStore.workerConfig.bid, year: currentDate.value[0], month: currentDate.value[1], worker_id:globalStore.workerConfig.id }, { toast: 0 });
        payDetails.value = data
    } catch (error) {
        console.error(error);
    }
    //tableLoading.value = false
}


</script>

<style lang="scss"></style>

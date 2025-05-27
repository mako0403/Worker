<template>
    <div class="h-full">
        <div class="w-full">
            
            <div class="flex justify-content-between align-items-center">
                <div class="flex align-items-center gap-3 p-3">
                    <svg v-if="userManager=='officeManager'" class="icon" aria-hidden="true" style="width:36px; height:36px;">
                        <use xlink:href="#icon-fangchanxinxi"></use>
                    </svg>
                    <el-icon v-else size="20" @click="router.go(-1)" class="text-600"><Back /></el-icon>
                    <div class="">
                        <div v-if="branchName" class="text-md">{{ branchName }}</div>
                        <el-skeleton v-else :rows="0" animated />
                        <div class="text-xs text-600"> {{ currentDate[0] + '年' + currentDate[1] + '月' }}
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 p-3">
                    <div v-if="userManager=='officeManager'" class="border-circle bg-gray-100 px-2 py-1">
                        <el-icon size="16" class="mt-1 text-800" @click="showBranchList = !showBranchList">
                            <OfficeBuilding />
                        </el-icon>
                    </div>
                    <div class="border-circle bg-gray-100 px-2 py-1">
                        <el-icon size="16" class="mt-1 text-800" @click="showCurrentDate = !showCurrentDate">
                            <Calendar />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-0 pb-5">
            <!-- <div v-if="!analysisData" class="mt-8">
                <el-empty description="暂无有效数据" />
            </div> -->
            <div>
                <div class="p-3 bg-gray-50">
                    <div v-if="formServicesRates" class="flex gap-3">
                        <div class="text-center bg-white shadow-1 p-3 border-round-lg" style="width:55%; height: 178px; overflow: hidden;">
                            <EChartsComponent v-if="formServicesRates" :option="formServicesRatesCharts" width="100%"
                                height="145px" />
                        </div>
                        <div class="" style="width: 45%;">
                            <div class="bg-white shadow-1 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-zhuce"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">评估患者</div>
                                    <div class="text-lg font-bold">{{ formServicesRates.form || 0 }}</div>
                                </div>
                            </div>
                            <div class="bg-white shadow-1 mt-2 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-women"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">转化销售患者</div>
                                    <div class="text-lg font-bold">{{ formServicesRates.deal || 0 }}</div>
                                </div>
                            </div>
                            <div class="bg-white shadow-1 mt-2 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-baoxiao"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">转化销售金额</div>
                                    <div class="text-lg font-bold">{{ formServicesRates.amount || 0 }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-skeleton v-else :rows="5" animated />
                </div>


                <div v-if="appointmentsSummary"  class="px-3 mt-3 mb-2 text-sm flex align-items-center">
                    <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                        <use xlink:href="#icon-jusetiao"></use>
                    </svg>
                    <div class="ml-0">待确认预约</div>
                </div>
                <el-skeleton v-else :rows="3" animated class="p-3"/>
                <div class="mt-0 px-3 bg-gray-50">
                    <EChartsComponent v-if="appointmentsSummary" :option="appointmentsSummaryCharts" width="100%" height="160px" />
                </div>
                
                <!-- <div class="px-3 mt-3 mb-2 flex justify-content-between align-items-center">
                    <div class="flex align-items-center text-sm">
                        <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                            <use xlink:href="#icon-jusetiao"></use>
                        </svg>
                        <div class="ml-0">每日营业收费明细</div>
                    </div>
                    <div class="flex align-items-center gap-1" > 

                    </div>
                </div> -->
                <!-- <div class="">
                    <vue3-datatable v-if="appointmentsSummary" :rows="appointmentsSummary.details" :columns="cols" :sortable="true" :columnFilter="true" :pageSize="20" :showPageSize="false" :totalRows="appointmentsSummary.details.length">
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
                </div> -->
                <div  v-if="debtMember" class="pt-3">
                    <div class="flex justify-content-between align-items-center px-3 mb-2 ">
                        <div class="text-md font-bold flex align-items-center">
                            <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                                <use xlink:href="#icon-jusetiao"></use>
                            </svg>
                            <div>欠款患者</div>
                        </div>
                        <div class="text-xs text-500">共{{ debtMemberPageTotalData }}位患者</div>
                    </div>
                    <div v-for="(item, index) in debtMember.lists" :key="index" class="px-3 bg-yellow-50">
                        <div class="px-2 py-3 border-bottom-1 border-gray-100">
                            <div class="flex align-items-top gap-2">
                                <img :src="item.avatar" alt="" class="border-circle" width="34px" height="34px" />
                                <div class="w-full">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm text-900">{{ item.fullname }}</div>
                                        <div class="text-xs flex align-items-center">
                                            <div class="text-600 flex align-items-center">最后付款时间<div class="text-lg text-red-700 mx-1">{{ item.create_time?moment().diff(moment.unix(item.create_time).format('YYYY-MM-DD'), 'days'):'' }}</div>天前</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-xs text-600">{{ item.card_number }}</div>
                                        <div class="text-xs text-900">
                                            {{ moment.unix(item.create_time).format('YYYY-MM-DD') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-between align-items-center px-3 py-2 text-right bg-white mt-3 border-round-lg">
                                <div class="mr-1 text-md text-orange-600 font-bold">
                                    <div class="text-xs text-600 mb-1 font-light">未付清账单总额</div>
                                    {{ item.sum_payable*-1 }}
                                </div>
                                <div class="mr-1 text-md text-green-600 font-bold">
                                    <div class="text-xs text-600 mb-1 font-light">账单已支付</div>
                                    {{ item.total_paid }}
                                </div>
                                <div class="mr-1 text-md text-red-600 font-bold">
                                    <div class="text-xs text-600 mb-1 font-light">待支付欠款</div>
                                    {{ (item.sum_payable*-1 - item.total_paid).toFixed(2) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-3 bg-yellow-50 py-3">
                        <el-pagination layout="prev, pager, next" :total="Number(debtMemberPageTotalData)" :hide-on-single-page="true"
                        @change="changeDebtMemberPage" class="w-full flex justify-content-between" />
                    </div>
                </div>


                <div  v-if="comments" class="mt-3">
                    <div class="text-md font-bold px-3 mb-2 flex align-items-center">
                        <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                            <use xlink:href="#icon-jusetiao"></use>
                        </svg>
                        <div>患者评价</div>
                    </div>
                    <div v-for="(item, index) in comments.details" :key="index" class="px-3">
                        <div class="px-2 py-4 border-bottom-1 border-dblue-50">
                            <div class="flex align-items-top gap-3">
                                <img :src="item.avatar" alt="" class="border-circle" width="42px" height="42px" />
                                <div class="w-full">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm text-900 font-bold">{{ item.fullname }}</div>
                                        <div class="text-xs flex align-items-center">
                                            <div class="mr-1 text-500">{{ item.worker_name }}</div>
                                            <el-rate :model-value="Number(item.rating)" size="small" disabled text-color="#ff9900" />
                                        </div>
                                    </div>
                                    <div class="text-gray-500 text-xs flex gap-2 align-items-center white-space-nowrap overflow-hidden">
                                        <div class="text-xs">{{ moment.unix(item.create_time).format('YYYY-MM-DD') }}</div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-3 mt-3">
                        <el-pagination layout="prev, pager, next" :total="Number(pageTotalData)" :hide-on-single-page="true"
                        @change="changePage" class="w-full flex justify-content-between" />
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <van-popup v-model:show="showBranchList" position="bottom" :style="{ padding: '0' }">
        <van-picker title="选择查询门店" v-model="choseBranchId" :columns="branchLists"
            :columns-field-names="{ text: 'name', value: 'id' }" @confirm="setBranch"
            @cancel="showBranchList = !showBranchList" />
    </van-popup>
    <van-popup v-model:show="showCurrentDate" position="bottom" :style="{ padding: '0' }">
        <van-date-picker v-model="currentDate" title="选择年月" :min-date="minDate" :max-date="maxDate"
            :columns-type="columnsType" @cancel="showCurrentDate = !showCurrentDate" @confirm="setCurrentDate" />
    </van-popup>
</template>
<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch } from 'vue'
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';
import moment from "moment"
import axios from '@/utils/axios'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

import { Picker as vanPicker, DatePicker as vanDatePicker, Popup as vanPopup } from 'vant';

import { ElMessage } from "element-plus";
import { useGlobalStore } from '@/store/global'
const { userManager, uploadsPath, workerConfig } = toRefs(useGlobalStore());

import EChartsComponent from '@/components/common/ECharts.vue';

import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import * as XLSX from 'xlsx';

const tableLoading: any = ref(true);
const cols = ref([
        { field: 'fullname', title: '患者信息', filter:false, minWidth:'140px' },
        //{ field: 'card_number', title: '会员卡号', filter:false, minWidth:'120px' },
        { field: 'paymethod', title: '付款方式', filter:false, minWidth:'120px' },
        { field: 'received', title: '实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'non_received', title: '非实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'date', title: '收款日期', filter:false, minWidth:'120px', type: 'date' },
]);

const showBranchList = ref(false);
const setBranch = async (value) => {
    choseBranchId.value = value.selectedValues;
    await getAnalysisData();
    await getAppointmentsSummary();
    await getFormServicesRates();
    await getCommentsLists();
    await getDebtMember();
    showBranchList.value = false;
}

const showCurrentDate = ref(false);
const currentDate = ref([moment().format('YYYY'), moment().format('MM')]);
const columnsType = ['year', 'month'];
const minDate = new Date('2024', '05', '1');
const maxDate = moment().add(1, 'month').add(1, 'day').toDate();
const setCurrentDate = async (value) => {
    currentDate.value = value.selectedValues;
    await getAnalysisData();
    await getAppointmentsSummary();
    await getFormServicesRates();
    showCurrentDate.value = false;
}

const branchName = ref('');
const analysisData = ref(null);
const choseBranchId = ref([0]);
const getAnalysisData = async () => {
    try {
        const { data } = await axios.get('/services/get_monthly_analysis', { bid: choseBranchId.value[0], year: currentDate.value[0], month: currentDate.value[1], mode: 'default' }, { toast: 1 });
        if (data) {
            analysisData.value = data;
            branchName.value = data.branch_name;
        } else {
            analysisData.value = null;
            ElMessage.error('门店暂无数据或获取数据失败');
        }
    } catch (error) {
        console.error(error);
    }
};

const branchLists = ref([])
const getBranchLists = async () => {
    try {
        const { data } = await axios.get('/company/branch_lists', { online: 1 }, { toast: 0 });
        branchLists.value = data
    } catch (error) {
        console.error(error);
    }
}

const appointmentsSummary = ref(null);
const getAppointmentsSummary = async () => {
    if(currentDate.value.join('-')==moment().format('YYYY-MM')){
        try {
            //tableLoading.value = true
            const { data } = await axios.get('/services/get_branch_appointments_summary', { bid: choseBranchId.value[0], date: currentDate.value.join('-'), status:0 }, { toast: 0 });
            appointmentsSummary.value = data
        } catch (error) {
            console.error(error);
        }
        //tableLoading.value = false
    }else{
        appointmentsSummary.value = null        
    }

}

const formServicesRates = ref(null);
const getFormServicesRates = async () => {
    try {
        const { data } = await axios.get('/services/get_form_services_rates', { bid: choseBranchId.value[0], year: currentDate.value[0], month: currentDate.value[1], form_rules_id:1 }, { toast: 0 });
        formServicesRates.value = data
    } catch (error) {
        console.error(error);
    }
}

const page = ref(0);
const pageTotalData = ref(0)
const comments = ref(null);
const getCommentsLists = async ()=>{
    try {
        const { data } = await axios.get('/comments/get_lists', {bid: choseBranchId.value[0], p:page.value}, {toast:1})
        comments.value = data
        pageTotalData.value = data.total;
    } catch (error) {
        ElMessage.error(error.message)
    }
}
const changePage = async (val) => {
    page.value = val
    await getCommentsLists()
}


const debtMemberPage = ref(0);
const debtMemberPageTotalData = ref(0)
const debtMember = ref(null);
const getDebtMember = async ()=>{
    try {
        const { data } = await axios.get('/member/lists_link_services', { bid: choseBranchId.value[0], group:4, p:debtMemberPage.value, sort:'ASC' }, { toast: 0 });
        debtMember.value = data;
        debtMemberPageTotalData.value = data.total;
    } catch (error) {
        console.error(error);
    }
}
const changeDebtMemberPage = async (val) => {
    debtMemberPage.value = val
    await getDebtMember()
}

const servicesTimeout = ref(null)
const getServicesTimeout = async ()=>{
    try {
        const { data } = await axios.get('/services/get_services_timeout', { bid: choseBranchId.value[0], days:90 }, { toast: 0 });
        servicesTimeout.value = data;
    } catch (error) {
        console.error(error);
    }
}


const appointmentsSummaryCharts = ref({});
const formServicesRatesCharts = ref({});
const updateChartOptions = () => {
    if (appointmentsSummary.value) {
        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        Object.keys(appointmentsSummary.value).forEach((item) => {
            xAxisData.push(item.slice(-2));
        })
        Object.values(appointmentsSummary.value).forEach((item) => {
            data1.push(item);
            //data2.push(item);
        })

        appointmentsSummaryCharts.value = {
            //tooltip: {},
            xAxis: {
                data: xAxisData,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
            },
            grid: {
                x: 30,
                y: 25,
                x2: 6,
                y2: 45
            },
            series: [
                {
                    name: '预约量',
                    type: 'line',
                    smooth: true,
                    stack: 'one',
                    data: data1,
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                },
                {
                    name: '治疗量',
                    type: 'bar',
                    stack: 'one',
                    data: data2,
                    emphasis: {
                        focus: 'series'
                    },
                    animationDelay: function (idx) {
                        return idx * 10 + 100;
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'slider',  // 横向滚动条类型
                    xAxisIndex: 0,  // 指定在哪个坐标轴上显示滚动条
                    start: 0,  // 初始位置，百分比形式，数值越小，滚动条越靠右
                    end: 100  // 结束位置，百分比形式，数值越小，滚动条越靠右
                }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
    }

    if (formServicesRates.value) {
        const gaugeData = [
            {
                value: (formServicesRates.value.deal / formServicesRates.value.form).toFixed(2) * 100,
                name: '转化率',
                title: {
                    offsetCenter: ['0%', '-20%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '20%']
                }
            }
        ];
        formServicesRatesCharts.value = {
            series: [
                {
                    type: 'gauge',
                    radius: "95%",
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
                            borderColor: '#464646'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 10
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
                        fontSize: 14,
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
};


onBeforeMount(async () => {
    if(useRoute().query.bid){
        choseBranchId.value = [useRoute().query.bid]
    }else{
        choseBranchId.value = [localStorage.getItem('performance_first_bid')]
    }
    //analysisData.value = JSON.parse(localStorage.getItem('performance_first_branch'));

    await getBranchLists();
    await getAppointmentsSummary();
    await getAnalysisData();

    await getFormServicesRates();
    await getCommentsLists()
    await getDebtMember();
});

// Watch analysisData and update chartOptions when data is fetched
watch(() => formServicesRates.value, (newVal) => {
    if (newVal) {
        updateChartOptions();
    }
});
watch(() => appointmentsSummary.value, (newVal) => {
    if (newVal) {
        updateChartOptions();
    }
});


</script>
<style scoped></style>

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
                        <div class="text-xs text-600"> 
                            {{ currentDate[0] + '年' + currentDate[1] + '月' }}
                            <span class="text-400" @click="showBrief=!showBrief">{{showBrief?'收起简报':'阅读简报'}}</span>
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
            <div v-if="analysisData" class="text-xs overflow-y-hidden" :style="{height:showBrief?'auto':'0'}">
                <div class="text-dblue-500 px-3 pb-3 line-height-3">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门店截止今日共实现营业收入{{ analysisData.sum_received }}元，其中本月新增销售{{ analysisData.sum_sale_price }}元（实收{{ analysisData.sum_sale_received }}元，非实收{{ analysisData.sum_sale_non_received }}元，未付欠款{{ analysisData.sum_sale_debt }}元），本月销售客单{{ analysisData.sum_all_purchase_member_count }}（新患者{{ analysisData.sum_purchase_new_member_count }}位，老患者续单{{ analysisData.sum_purchase_repeat_member_count }}位）。截止今日门店仍有未收回欠款总额{{ analysisData.sum_still_debt }}元，累计服务患者{{ analysisData.sum_branch_member_count }}人。本月总的有效预约量{{ analysisData.sum_used_limits }}次，其中计算治疗量预约{{ analysisData.sum_title_bonus_limits }}次。本月赠送服务项目总额为{{ analysisData.sum_gift_price }}元，非实收总额为{{ analysisData.sum_sale_non_received }}元，请注意抽检营业销售明细。
                </div>
            </div>
        </div>
        <div class="pt-0 pb-5">
            <div v-if="!analysisData" class="mt-8">
                <el-empty description="暂无有效数据" />
            </div>
            <div v-else>
                <div class="p-3 bg-gray-50">
                    <div class="flex gap-3">
                        <div class="text-center bg-white shadow-1 p-3 border-round-lg" style="width:55%; height: 240px; overflow: hidden;">
                            <EChartsComponent v-if="analysisData" :option="performanceCompletionRate" width="100%"
                                height="130px" />
                            <div class="flex justify-content-between gap-2 mt-2">
                                <div class="w-full mt-2 px-2 py-2 border-round-md">
                                    <div class="ml-0 text-xs">月度计划额</div>
                                    <div class="mt-2 text-md">{{ analysisData.performance_task }}</div>
                                </div>

                            </div>
                        </div>
                        <div class="" style="width: 45%;">
                            <div class="bg-white shadow-1 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-dikouquan"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">销售额</div>
                                    <div class="text-lg font-bold">{{ analysisData.sum_sale_price }}</div>
                                </div>
                            </div>
                            <div class="bg-white shadow-1 mt-2 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-cunkuan"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">销售实收金额</div>
                                    <div class="text-lg font-bold">{{ analysisData.sum_sale_received }}</div>
                                </div>
                            </div>
                            <div class="bg-white shadow-1 mt-2 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-youhuiquan1"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">销售非实收金额</div>
                                    <div class="text-lg font-bold">{{ analysisData.sum_sale_non_received }}</div>
                                </div>
                            </div>
                            <div class="bg-white shadow-1 mt-2 px-2 py-2 border-round-md flex justify-content-between align-items-center">
                                <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                    <use xlink:href="#icon-shenhe"></use>
                                </svg>
                                <div class="text-right">
                                    <div class="text-xs text-gray-600">销售未付金额</div>
                                    <div class="text-lg font-bold">{{ analysisData.sum_sale_debt }}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="px-3 mt-3">
                    <div class="w-full bg-orange-500 text-white mt-2 px-2 py-2 border-round-md">
                        <div class="flex">
                            <div class="ml-0 text-sm">营业总额</div>
                        </div>
                        <div class="mt-2 text-left text-xl font-bold">{{ analysisData.sum_received }}</div>
                        <div class="mt-1 text-xs">本月销售实收 + 欠款回收 + 营业外收入</div>
                    </div>
                    <div class="flex justify-content-between gap-3">
                        <div class="w-full bg-yellow-100 text-yellow-700 mt-2 px-2 py-2 border-round-md">
                            <div class="flex">
                                <div class="ml-0 text-xs">欠款回收</div>
                            </div>
                            <div class="mt-2 text-left text-md font-bold">{{ analysisData.receipt_owed }}</div>
                        </div>
                        <div class="w-full bg-yellow-100 text-yellow-700 mt-2 px-2 py-2 border-round-md">
                            <div class="flex">
                                <div class="ml-0 text-xs">营业外收入</div>
                            </div>
                            <div class="mt-2 text-left text-md font-bold">{{ analysisData.sum_non_operating_received }}</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <el-tag v-for="(item, index) in sumPayDetails" :key="index" type="success" class="mr-3">{{index+' '+item.toFixed(2)}}</el-tag>
                    </div>
                </div>


                <div class="px-3 mt-3 mb-2 flex align-items-center">
                    <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                        <use xlink:href="#icon-jusetiao"></use>
                    </svg>
                    <div class="w-full flex justify-content-between align-items-center">
                        <div class=" font-bold text-md">今日预约时段分布</div>
                        <div class="text-xs text-500">{{ moment().format('YYYY / MM / DD') }}</div>
                    </div>
                </div>
                <div class="mt-0 bg-dblue-500 border-1 border-dblue-600 p-3 fadeinleft  animation-duration-500">
                    <div v-if="echartAppointmentSummary.length">
                        <div v-for="(option, index) in echartAppointmentSummary" :key="index">
                            <EChartsComponent :option="option" height="50px" />
                        </div>
                    </div>
                    <div v-else class="text-md text-dblue-300 text-center">
                        今日暂无预约患者
                    </div>
                </div>


                <div class="px-3 mt-3 mb-2 flex align-items-center">
                    <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                        <use xlink:href="#icon-jusetiao"></use>
                    </svg>
                    <div class="ml-0 font-bold text-md">每日营业对比图表</div>
                </div>
                <div class="mt-0 px-3 bg-gray-50">
                    <EChartsComponent v-if="payDetails" :option="payDetailsCharts" width="100%" height="260px" />
                </div>

                <div class="px-3 mt-3 mb-2 flex align-items-center">
                    <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                        <use xlink:href="#icon-jusetiao"></use>
                    </svg>
                    <div class="ml-0 font-bold text-md">服务预约量趋势</div>
                </div>
                <div class="mt-0 px-3 bg-gray-50">
                    <EChartsComponent v-if="appointmentsSummary" :option="appointmentsSummaryCharts" width="100%" height="260px" />
                </div>

                <div v-if="analysisDataCharts.length" class="mt-3">
                    <div class="px-3 mb-2 flex align-items-center">
                        <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                            <use xlink:href="#icon-jusetiao"></use>
                        </svg>
                        <div class="ml-0 font-bold text-md">项目销售与使用对比</div>
                    </div>
                    <div class="bg-gray-50 border-round-lg p-3">
                        <div v-for="(item, index) in analysisData.services" :key="index" class="mb-3">
                            <div class="text-xs mb-1">{{ item.services_name }}</div>
                            <EChartsComponent :option="analysisDataCharts[index]" height="45px" />
                        </div>
                    </div>
                </div>


                <div class="px-3 mt-3 mb-2 flex justify-content-between align-items-center">
                    <div class="flex align-items-center">
                        <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                            <use xlink:href="#icon-jusetiao"></use>
                        </svg>
                        <div class="ml-0 font-bold text-md">每日收费明细</div>
                    </div>
                    <div class="flex align-items-center gap-1" @click="exportToExcel"> 
                        <svg class="icon" aria-hidden="true" style="width: 24px; height: 24px;">
                            <use xlink:href="#icon-xiazai"></use>
                        </svg>
                        <div class="text-xs">Download</div>
                    </div>
                </div>
                <div class="">
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

const showBrief = ref(false);


const tableLoading: any = ref(true);
const cols = ref([
        { field: 'fullname', title: '患者信息', filter:false, minWidth:'140px' },
        //{ field: 'card_number', title: '会员卡号', filter:false, minWidth:'120px' },
        { field: 'paymethod', title: '付款方式', filter:false, minWidth:'120px' },
        { field: 'received', title: '实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'non_received', title: '非实收金额', filter:false, minWidth:'140px', type: 'number' },
        { field: 'date', title: '收款日期', filter:false, minWidth:'120px', type: 'date' },
        { field: 'remark', title: '备注', filter:false, minWidth:'120px', type: 'date' },
]);

const echartAppointmentSummary = ref([]);
const getTodayAppointmentSummary = async () => {
    try {
        const { data } = await axios.get('/services/get_branch_appointments_summary', { bid: choseBranchId.value[0], date: moment().format('YYYY-MM-DD') }, { toast: 0 });
        if (data) {
            echartAppointmentSummary.value = generateEchartOptions(data);
        }
    } catch (error) {
        ElMessage.error(error);
    }
}

const showBranchList = ref(false);
const setBranch = async (value) => {
    choseBranchId.value = value.selectedValues;
    await getAnalysisData();
    await getPayDetails();
    await getAppointmentsSummary();
    await getTodayAppointmentSummary();
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
    await getPayDetails();
    await getAppointmentsSummary();
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
            analysisData.value.receipt_owed = (analysisData.value.sum_received - analysisData.value.sum_non_operating_received - analysisData.value.sum_sale_received)>0?(analysisData.value.sum_received - analysisData.value.sum_non_operating_received - analysisData.value.sum_sale_received).toFixed(2):0;
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

const payDetails = ref(null);
const sumPayDetails = ref(null);
const getPayDetails = async () => {
    try {
        //tableLoading.value = true
        const { data } = await axios.get('/services/get_payment_details', { bid: choseBranchId.value[0], year: currentDate.value[0], month: currentDate.value[1] }, { toast: 0 });
        payDetails.value = data
        if(data.details.length){
            sumPayDetails.value = data.details.reduce((acc, curr) => {
                const paymethod = curr.paymethod;
                const receivedAmount = parseFloat(curr.received || 0); // 转为数字类型
                if (!acc[paymethod]) {
                    acc[paymethod] = 0; // 初始化金额
                }
                acc[paymethod] += receivedAmount; // 累加金额
                return acc;
            }, {});
        }
    } catch (error) {
        console.error(error);
    }
    //tableLoading.value = false
}

const appointmentsSummary = ref(null);
const getAppointmentsSummary = async () => {
    try {
        //tableLoading.value = true
        const { data } = await axios.get('/services/get_branch_appointments_summary', { bid: choseBranchId.value[0], date: currentDate.value.join('-') }, { toast: 0 });
        appointmentsSummary.value = data
    } catch (error) {
        console.error(error);
    }
    //tableLoading.value = false
}



const payDetailsCharts = ref({});
const performanceCompletionRate = ref({});
const appointmentsSummaryCharts = ref({});
const analysisDataCharts = ref([]);
const updateChartOptions = () => {
    if (payDetails.value) {
        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        Object.keys(payDetails.value.summary).forEach((item) => {
            xAxisData.push(item.slice(-2));
        })
        Object.values(payDetails.value.summary).forEach((item) => {
            data1.push(item.received);
            data2.push(item.non_received);
        })
        

        payDetailsCharts.value = {
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
                x: 40,
                y: 25,
                x2: 6,
                y2: 45
            },
            series: [
                {
                    name: '实收',
                    type: 'bar',
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
                    name: '非实收',
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

    if (analysisData.value) {
        const gaugeData = [
            {
                value: analysisData.value.performance_completion_rate,
                name: '完成率',
                title: {
                    offsetCenter: ['0%', '-20%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '20%']
                }
            }
        ];
        performanceCompletionRate.value = {
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
                // {
                //     name: '治疗量',
                //     type: 'bar',
                //     stack: 'one',
                //     data: data2,
                //     emphasis: {
                //         focus: 'series'
                //     },
                //     animationDelay: function (idx) {
                //         return idx * 10 + 100;
                //     }
                // }
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

    if(analysisData.value){
        analysisData.value.services = Object.values(analysisData.value.services).slice().sort((a, b) => 
            a.sale_limits - b.sale_limits
        ).reverse();
        analysisDataCharts.value = generateAnalysisDataCharts(analysisData.value.services)
    }
};

const generateAnalysisDataCharts = (data) => {
    const options = [];
    const labelOption = {
        show: true,
        position: 'insideLeft',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 0,
        formatter: '{c}  {name|{a}}',
        fontSize: 13,
        rich: {
            name: {}
        },
    };

    Object.values(data).forEach((ser)=>{
        options.push({
            grid: {
                top: '1%',
                bottom: '1%',
                left: '0%',
                right: '0%',
            },
            color:['#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            xAxis: [
                {
                type: 'value'
                }
            ],
            yAxis: [
                {
                type: 'category',
                axisTick: { show: false },
                data: []
                }
            ],
            series: [
                {
                    name: '销售次数',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    showBackground:true,
                    data: [ser.sale_limits]
                },
                {
                    name: '使用次数',
                    type: 'bar',
                    label: labelOption,
                    showBackground:true,
                    data: [ser.used_limits]
                }
            ]
        }) 
    })

    return options;
}

const generateEchartOptions = (data) => {
    const options = [];
    const colors = ['#fcbf49', '#7cb518', '#dc2f02'];
    const labelOption = {
        show: true,
        position: 'insideLeft',
        padding: [0, 0, 0, 6],
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 0,
        formatter: '{c}患者  {name|{a}}',
        fontSize: 12,
        rich: {
            name: {},
        },
        textStyle: {
            //color: '#fff', // 主标题文字颜色
            fontWeight: 'bold',
            textShadowColor: '#fff', // 描边颜色
            textShadowBlur: 0, // 描边模糊度
            textShadowOffsetX: 0, // 描边X偏移
            textShadowOffsetY: 0  // 描边Y偏移
        }
    };
    // 随机选择颜色
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];


    for (const time in data) {
        const seriesData = [];
        const categories = Object.keys(data[time]);
        const values = Object.values(data[time]);
        

        categories.forEach((name, index) => {
            seriesData.push({
                name,
                type: 'bar',
                barGap: 0.4,
                label: labelOption,
                emphasis: {
                    focus: 'series',
                },
                itemStyle: {
                    color: getRandomColor(),
                    borderRadius: [0, 10, 10, 0],
                    opacity:1,
                    borderWidth:1,
                    borderColor: '#f8f8fd',
                },
                data: [values[index]],
            });
        });

        options.push({
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'shadow',
            //     },
            // },
            grid: {
                top: '5%',
                bottom: '5%',
                left: '12%',
                right: '0%',
            },
            legend: {
                show: false,
                data: categories,
            },
            xAxis: [
                {
                    type: 'value',
                    show: false,
                    
                    max:function (value) {
                        return value.max + 1;
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff' // X轴标线颜色
                        }
                    }
                },
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    axisLabel: {
                        color: 'white',
                        width: '10%',
                        align: 'right',
                        margin: 5,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff' // Y轴标线颜色
                        }
                    },
                    data: [time],
                },
            ],
            series: seriesData,
        });
    }

    return options;
};

onBeforeMount(async () => {
    if(useRoute().query.bid){
        choseBranchId.value = [useRoute().query.bid]
    }else{
        choseBranchId.value = [localStorage.getItem('performance_first_bid')]
    }
    //analysisData.value = JSON.parse(localStorage.getItem('performance_first_branch'));

    await getBranchLists();
    await getPayDetails();
    await getAppointmentsSummary();
    await getAnalysisData();
    await getTodayAppointmentSummary();
});

// Watch analysisData and update chartOptions when data is fetched
watch(() => analysisData.value, (newVal) => {
    if (newVal) {
        updateChartOptions();
    }
});
watch(() => payDetails.value, (newVal) => {
    if (newVal) {
        updateChartOptions();
    }
});
watch(() => appointmentsSummary.value, (newVal) => {
    if (newVal) {
        updateChartOptions();
    }
});


const exportToExcel = () => {
    const data = payDetails.value.details
    // 定义列标题
    const columns = [
        { header: '患者姓名', key: 'fullname' },
        { header: '会员卡号', key: 'card_number' },
        { header: '付款方式', key: 'paymethod' },
        { header: '实收金额', key: 'received' },
        { header: '非实收金额', key: 'non_received' },
        { header: '日期', key: 'date' }
    ];

    // 将数据转换为数组格式，第一行作为标题
    const worksheetData = [
        columns.map(col => col.header),
        ...data.map(item => columns.map(col => item[col.key]))
    ];

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const fileName = branchLists.value.filter(branch => branch.id ===
    choseBranchId.value[0])[0].name + currentDate.value[0] + '年' + currentDate.value[1] + '月 营业收款明细'
    // 导出 Excel 文件
    XLSX.writeFile(workbook, fileName+'.xlsx');
}
</script>
<style scoped></style>

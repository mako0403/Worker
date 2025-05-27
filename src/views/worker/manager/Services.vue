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

                <div v-if="analysisDataCharts.length" class="">
                    <div class="px-3 mb-2 text-sm flex align-items-center">
                        <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                            <use xlink:href="#icon-jusetiao"></use>
                        </svg>
                        <div class="ml-0">项目销售与使用对比</div>
                    </div>
                    <div class="bg-gray-50 border-round-lg p-3">
                        <div v-for="(item, index) in analysisData.services" :key="index" class="mb-3">
                            <div class="text-xs mb-1">{{ item.services_name }}</div>
                            <EChartsComponent :option="analysisDataCharts[index]" height="45px" />
                        </div>
                    </div>
                </div>
                
                <div v-if="appointmentsSummary"  class="px-3 mt-3 mb-2 text-sm flex align-items-center">
                    <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                        <use xlink:href="#icon-jusetiao"></use>
                    </svg>
                    <div class="ml-0">月度预约量趋势</div>
                </div>
                <div class="mt-0 px-3 bg-gray-50">
                    <EChartsComponent v-if="appointmentsSummary" :option="appointmentsSummaryCharts" width="100%" height="200px" />
                </div>

                <div  v-if="servicesTimeout" class="mt-3">
                    <div class="flex justify-content-between align-items-center px-3 mb-2 ">
                        <div class="text-md font-bold flex align-items-center">
                            <svg class="icon" aria-hidden="true" style="width:12px; height: 12px;">
                                <use xlink:href="#icon-jusetiao"></use>
                            </svg>
                            <div>潜在流失患者</div>
                        </div>
                        <div class="text-xs text-500">超过30天未预约服务</div>
                    </div>
                    <div v-for="(item, index) in servicesTimeout" :key="index" class="px-3">
                        <div class="px-2 py-4 border-bottom-1 border-dblue-50">
                            <div class="flex align-items-top gap-3">
                                <img :src="item.member_avatar || defaultAvatar" alt="" class="border-circle" width="38px" height="38px" />
                                <div class="w-full">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm text-900 font-bold">{{ item.member_name }}</div>
                                        <div class="text-xs flex align-items-center">
                                            <!-- <div class="text-red-600">服务员工 {{ item.worker_name }}</div> -->
                                            <div class="text-700">
                                                <span v-if="item.remind_count!=0">已提醒{{ item.remind_count }}次 </span>
                                                <span v-if="item.last_remind_date">最后提醒 {{ item.last_remind_date }}</span>
                                                <span v-else class="text-500">尚未进行提醒</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-xs flex justify-content-between align-items-center white-space-nowrap overflow-hidden">
                                        <div class="text-700">上次预约{{ item.diff }}天前 {{ item.date }}</div>
                                        <!-- <div class="text-700"></div> -->
                                        <!-- <div class="text-red-600">患者已超 {{ item.diff }} 天未预约服务</div> -->
                                    </div>
                                    <div v-if="item.last_remind_date" class="mt-2">
                                        <!-- <div class="text-xs">{{ item.last_remind_date?'最近一次向患者提醒日期为'+item.last_remind_date:'尚未向患者发送过提醒消息' }}</div> -->
                                        <div class="text-xs text-500">最后一次互动内容：</div>
                                        <div class="text-sm text-dblue-700">{{ item.remind_content }}</div>
                                    </div>
                                    <!-- <div v-if="item.reply" class="mt-3 bg-white p-2 border-round-md flex align-items-start gap-2">
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
                                    </div>  -->
                                </div>
                            </div>
                            <div class="flex mt-2">
                                <div @click="showMemberServices = item.card_number+','+item.services_worker_id"
                            class="flex text-green-500 border-0 bg-green-50 border-indigo-100 border-round-xl py-1 px-2 mr-2 vertical-align-middle">
                                    <a class="text-green-500">
                                        <el-icon size="12" class="">
                                            <MessageBox />
                                        </el-icon>
                                    </a>
                                    <span class="text-xs ml-1">服务</span>
                                </div>
                            </div>
                            <!-- 服务列表 -->
                            <div v-if="item.services" class="mt-2 fadeinup p-3 bg-green-50 border-round-lg">
                                <div class="mt-2" v-for="(s, i) in item.services" :key="i">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm">{{s.model_name}}</div>
                                        <div class="text-xs text-gray-500">剩余 {{s.limits}} 次</div>
                                    </div>
                                    <el-progress :percentage="Number(((s.total_usage/s.total_purchase)).toFixed(2)*100)"
                                        :stroke-width="4" :show-text="false" class="mt-2" color="#968DB9" />
                                </div>
                            </div>
                        </div>
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
const { userManager, manager, uploadsPath, workerConfig } = toRefs(useGlobalStore());

import EChartsComponent from '@/components/common/ECharts.vue';

import defaultAvatar from '@@/images/default_avatar.webp'


const showBranchList = ref(false);
const setBranch = async (value) => {
    choseBranchId.value = value.selectedValues;
    await getAnalysisData();
    await getAppointmentsSummary();
    await getServicesTimeout();
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
    await getServicesTimeout();
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
            const { data } = await axios.get('/services/get_branch_appointments_summary', { bid: choseBranchId.value[0], date: currentDate.value[0] }, { toast: 0 });
            appointmentsSummary.value = data
        } catch (error) {
            console.error(error);
        }
        //tableLoading.value = false
    }else{
        appointmentsSummary.value = null        
    }

}

const servicesTimeout = ref(null)
const getServicesTimeout = async ()=>{
    try {
        const { data } = await axios.get('/services/get_services_timeout', { bid: choseBranchId.value[0], days:30 }, { toast: 0 });
        servicesTimeout.value = data.lists;
    } catch (error) {
        console.error(error);
    }
}

const showMemberServices = ref(null)
watch(()=>showMemberServices.value, async (nval, oval)=>{
    if(nval){
        try {
            await axios.get('/services/member_services_lists', {
                bid: choseBranchId.value[0],
                services_worker_id: nval.split(',')[1],
                card_number: nval.split(',')[0],
                model:'MedicalServices',
                usable:0
            }).then(res => {
                Object.values(servicesTimeout.value).filter((item) =>{
                    if(item.card_number == nval.split(',')[0]){
                        item.services = res.data
                    }
                })
            })
            showMemberServices.value = null
        } catch (error) {
            console.error('Error fetching member_services_lists:', error);
        }
    }
})

const analysisDataCharts = ref([]);
const appointmentsSummaryCharts = ref({});
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
                    type: 'bar',
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


    if(analysisData.value){
        analysisData.value.services = Object.values(analysisData.value.services).slice().sort((a, b) => 
            a.sale_limits - b.sale_limits
        ).reverse();
        //console.log(2342432324234, analysisData.value.services)
        analysisDataCharts.value = generateEchartOptions(analysisData.value.services)
    }
};

const generateEchartOptions = (data) => {
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
    await getServicesTimeout();

});

// Watch analysisData and update chartOptions when data is fetched

watch(() => analysisData.value, (newVal) => {
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

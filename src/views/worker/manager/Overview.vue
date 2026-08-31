<template>
    <div class="h-full">
        <div class="flex justify-content-between align-items-center p-3">
            <div class="flex align-items-center gap-3">
                <el-avatar :src="uploadsPath + workerConfig.headimg" class="bg-pink-100"></el-avatar>
                <div class="">
                    <div class="text-md">Hello, {{ workerConfig.fullname }}</div>
                    <div class="text-xs text-600">{{ motivationalMessage }}</div>
                </div>
            </div>
            <div class="flex gap-2">
                <div class="border-circle bg-gray-100 px-2 py-1">
                    <el-icon size="16" class="mt-1 text-800" @click="showCurrentDate = !showCurrentDate">
                        <Calendar />
                    </el-icon>
                </div>
                <div class="border-circle bg-gray-100 px-2 py-1">
                    <el-icon size="16" class="mt-1 text-800" @click="menuDrawer = true">
                        <Setting />
                    </el-icon>
                </div>
            </div>
            <el-drawer v-model="menuDrawer" size="65%" :show-close="true" :with-header="false">
                <div class="text-center border-round-lg" style="background-color: #fefefe;"><img :src="logoIcon"
                        width="65%"></div>
                <div class="mt-5 mx-2">
                    <div class="mb-5">
                        <div class="flex align-items-center">
                            <el-icon size="21" class="text-dblue-300 mr-2">
                                <VideoPlay />
                            </el-icon>
                            <RouterLink to="/worker/video/lists" class="text-dblue-500 text-md"
                                @click="menuDrawer = false">视频资源库</RouterLink>
                        </div>
                    </div>
                    <div class="mb-5">
                        <div class="flex align-items-center">
                            <svg class="icon text-gray-600 mr-2" aria-hidden="true" style="width: 22px; height: 22px;">
                                <use xlink:href="#icon-buru"></use>
                            </svg>
                            <RouterLink to="/worker/member/record/1" class="text-dblue-500 text-md"
                                @click="menuDrawer = false">喂养记录</RouterLink>
                        </div>
                    </div>
                    <div class="mb-5">
                        <div class="flex align-items-center">
                            <svg class="icon text-gray-600 mr-2" aria-hidden="true" style="width: 22px; height: 22px;">
                                <use xlink:href="#icon-yuer"></use>
                            </svg>
                            <RouterLink to="/worker/member/record/2" class="text-dblue-500 text-md"
                                @click="menuDrawer = false">育儿记录</RouterLink>
                        </div>
                    </div>
                    <div class="mb-5">
                        <div class="flex align-items-center">
                            <svg class="icon text-gray-600 mr-2" aria-hidden="true" style="width: 22px; height: 22px;">
                                <use xlink:href="#icon-rufanghuli"></use>
                            </svg>
                            <RouterLink to="/worker/member/record/3" class="text-dblue-500 text-md"
                                @click="menuDrawer = false">乳房健康记录</RouterLink>
                        </div>
                    </div>
                    <el-divider class="my-3 border-gray-100" />
                    <div class="mb-5">
                        <div class="flex align-items-center" @click="loginOut">
                            <el-icon size="21" class="text-dblue-300 mr-2">
                                <SwitchButton />
                            </el-icon>
                            <div class="text-dblue-500 text-md">退出登录</div>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </div>
        <div class="pt-3  pb-5">
            <div class="mx-auto">
                <EChartsComponent v-if="analysisData" :option="performanceCompletionRate" width="100%" height="250px" />
            </div>
            <div class="px-3" v-if="analysisData" style="margin-top:-20px;">
                <div class="flex justify-content-between bg-dblue-50 text-dblue-500 border-round-lg py-3">
                    <div class="w-full text-center">
                        <svg class="icon" aria-hidden="true" style="width:36px; height:36px;">
                            <use xlink:href="#icon-MBEfenggeduosetubiao-fasong"></use>
                        </svg>
                        <div class="text-lg font-semibold">
                            {{ analysisData.total_performance_task }}
                        </div>
                        <div class="text-xs text-dblue-400">
                            计划任务
                        </div>
                    </div>
                    <div class="w-full text-center">
                        <svg class="icon" aria-hidden="true" style="width:36px; height:36px;">
                            <use xlink:href="#icon-MBEfenggeduosetubiao-qizhi"></use>
                        </svg>
                        <div class="text-lg font-semibold">{{ analysisData.total_sale_price }}</div>
                        <div class="text-xs text-dblue-400">
                            完成营业
                        </div>
                    </div>
                    <div class="w-full text-center">
                        <svg class="icon" aria-hidden="true" style="width:36px; height:36px;">
                            <use xlink:href="#icon-MBEfenggeduosetubiao-xihuan"></use>
                        </svg>
                        <div class="text-lg font-semibold">{{ analysisData.total_gift_price }}</div>
                        <div class="text-xs text-dblue-400">
                            赠送服务
                        </div>
                    </div>
                </div>
                <div class="w-full flex justify-content-between gap-3 mt-3">
                    <div class="w-full py-3 px-2 text-blue-800 bg-blue-100 border-round-lg">
                        <div class="">
                            <div class="px-1">
                                <div class="flex justify-content-between gap-3 align-items-center">
                                    <div class="text-lg">综合营业<br />组成</div>
                                    <div>
                                        <div class="bg-blue-50 border-circle p-1">
                                            <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                                <use xlink:href="#icon-yue1"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-content-between mt-1">
                                    <div class="mt-1">
                                        <div class="text-xs">本月销售总额</div>
                                        <div class="text-md mt-1">{{ analysisData.total_sale_price }}</div>
                                    </div>
                                    <div class="mt-1">
                                        <div class="text-xs">实际营收总额</div>
                                        <div class="text-md mt-1">{{ analysisData.total_received }}</div>
                                    </div>
                                </div>
                                <div class="flex justify-content-between mt-1">
                                    <div>
                                        <div class="text-xs">本月销售实收</div>
                                        <div class="text-md mt-1">{{ analysisData.total_sale_received }}</div>
                                    </div>
                                    <div class="">
                                        <div class="text-xs">本月非实收</div>
                                        <div class="text-md mt-1">{{ analysisData.total_sale_non_received }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-blue-50 px-2 py-2 border-round-lg mt-2 text-blue-800 text-xs">
                                <div class="flex justify-content-between align-items-center">
                                    <div class="">本月新增未付</div>
                                    <div class="">{{ analysisData.total_sale_debt }}</div>
                                </div>
                                <div class="flex justify-content-between align-items-center mt-1">
                                    <div class="">合计未付总额</div>
                                    <div class="">{{ analysisData.total_still_debt }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full px-2 pt-3 text-green-800 bg-green-100 border-round-lg">
                        <div class="">
                            <div class="px-1">
                                <div class="flex justify-content-between gap-3 align-items-center">
                                    <div class="text-lg">服务患者<br />组成</div>
                                    <div>
                                        <div class="bg-green-50 border-circle p-1">
                                            <svg class="icon" aria-hidden="true" style="width: 30px; height: 30px;">
                                                <use xlink:href="#icon-tuandui"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-1">
                                    <div class="text-xs">新购服务患者</div>
                                    <div class="text-lg mt-1">{{ analysisData.total_all_purchase_member_count }}<span
                                            class="text-sm ml-2">人</span></div>
                                </div>
                                <div class="flex justify-content-between mt-1">
                                    <div>
                                        <div class="text-xs">新客人数</div>
                                        <div class="text-md mt-1">{{ analysisData.total_purchase_new_member_count
                                            }}<span class="text-xs ml-1">人</span></div>
                                    </div>
                                    <div>
                                        <div class="text-xs">老客复购</div>
                                        <div class="text-md mt-1">{{ analysisData.total_purchase_repeat_member_count
                                            }}<span class="text-xs ml-1">人</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-green-50 px-2 py-2 border-round-lg mt-2 text-green-800 text-xs">
                                <div class="flex justify-content-between align-items-center">
                                    <div class="">复购率</div>
                                    <div class="">{{ ((analysisData.total_purchase_repeat_member_count /
                                        analysisData.total_all_purchase_member_count) * 100).toFixed(2) }}%</div>
                                </div>
                                <div class="flex justify-content-between align-items-center mt-1">
                                    <div class="">总服务患者</div>
                                    <div class="">{{ analysisData.total_branch_member_count }}<span
                                            class="text-xs ml-1">人</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <div class="p-3 bg-dblue-50 mt-3 border-round-lg" v-for="(item, index) in analysisData.data"
                        :key="index">
                        <div class="flex justify-content-between align-items-center">
                            <div class="text-md" style="width: 60%;">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-fangchanxinxi"></use>
                                </svg>
                                {{ item.branch_name }}
                            </div>
                            <div class="w-full flex justify-content-end gap-3 text-xs text-right">
                                <div class="flex">
                                    <svg class="icon" aria-hidden="true" style="width: 16px;">
                                        <use xlink:href="#icon-fasong"></use>
                                    </svg>
                                    <div class="ml-1">
                                        <div class="text-600 mb-1">计划任务</div>
                                        {{ item.performance_task }}
                                    </div>
                                </div>
                                <div class="flex">
                                    <svg class="icon" aria-hidden="true" style="width: 16px;">
                                        <use xlink:href="#icon-renzheng"></use>
                                    </svg>
                                    <div class="ml-1">
                                        <div class="text-600 mb-1">完成率</div>
                                        <div class="text-orange-500">{{ item.performance_completion_rate }}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-progress
                            :percentage="parseFloat(item.performance_completion_rate > 100 ? 100 : item.performance_completion_rate)"
                            :show-text="false" striped class="mt-2" />
                        <div class="flex justify-content-between gap-3 mt-3">
                            <div class="" style="width: 50%;">
                                <EChartsComponent v-if="analysisData" :option="branchSumPie[item.branch_name]"
                                    width="100%" height="180px" />
                            </div>
                            <div class="" style="width: 50%;">
                                <div class="w-full">
                                    <div class="text-xs text-600 mb-1 align-items-center flex gap-1">
                                        <svg class="icon" aria-hidden="true" style="width: 18px;">
                                            <use xlink:href="#icon-duizhang-39"></use>
                                        </svg>
                                        营收总额
                                    </div>
                                    <div class="text-md font-semibold text-red-600 ml-1">{{ item.sum_received || 0 }}
                                    </div>
                                </div>
                                <div class="w-full mt-1">
                                    <div class="text-xs text-600 mb-1 align-items-center flex gap-1">
                                        <svg class="icon" aria-hidden="true" style="width: 18px;">
                                            <use xlink:href="#icon-duizhang-96"></use>
                                        </svg>
                                        新增销售总额
                                    </div>
                                    <div class="text-md font-semibold text-blue-600 ml-1">{{ item.sum_sale_price }}
                                    </div>
                                </div>
                                <div class="w-full mt-1">
                                    <div class="text-xs text-600 mb-1 align-items-center flex gap-1">
                                        <svg class="icon" aria-hidden="true" style="width: 18px;">
                                            <use xlink:href="#icon-touzi1"></use>
                                        </svg>
                                        赠送服务总额
                                    </div>
                                    <div class="text-md font-semibold text-blue-600 ml-1">{{ item.sum_gift_price }}
                                    </div>
                                </div>
                                <div class="w-full mt-1">
                                    <div class="text-xs text-600 mb-1 align-items-center flex gap-1">
                                        <svg class="icon" aria-hidden="true" style="width: 18px;">
                                            <use xlink:href="#icon-daipaidan"></use>
                                        </svg>
                                        预约总量
                                    </div>
                                    <div class="text-md font-semibold text-blue-600 ml-1">{{ item.sum_used_limits }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-dblue-500 text-white p-3 mt-3 border-round-lg">
                            <div class="">
                                <div class="text-sm text-100">本月新增销售组成</div>
                            </div>
                            <div
                                class="flex justify-content-between gap-3 text-right mt-2 bg-dblue-50 text-dblue-700 border-round-lg px-3 py-2">
                                <div class="">
                                    <div class="text-xs mb-1">实收</div>
                                    <div class="text-md"><span class="text-sm">￥</span>{{ item.sum_sale_received }}
                                    </div>
                                </div>
                                <div class="">
                                    <div class="text-xs mb-1">未付</div>
                                    <div class="text-md"><span class="text-sm">￥</span>{{ item.sum_sale_debt }}</div>
                                </div>
                                <div class="">
                                    <div class="text-xs mb-1">非实收</div>
                                    <div class="text-md"><span class="text-sm">￥</span>{{ item.sum_sale_non_received }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-content-between mt-3">
                            <div class="pt-1 pl-2 flex">
                                <img :src="nxrtPng" height="90px" />
                                <div class="ml-3">
                                    <div class="text-xs">
                                        门店累计患者总量
                                    </div>
                                    <div class="my-2">
                                        <span class="text-blue-600 text-4xl">{{ item.sum_branch_member_count }}</span>
                                        <span class="text-blue-600 text-sm ml-2">人</span>
                                    </div>
                                    <div class="text-orange-600 text-xs">
                                        <!-- <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-tianjiahaoyou"></use>
                                        </svg> -->
                                        新购服务项目患者{{ item.sum_all_purchase_member_count }}人
                                    </div>
                                </div>
                            </div>
                            <div>
                                <EChartsComponent v-if="analysisData" :option="branchNomemberPie[item.branch_name]"
                                    width="100%" height="90px" />
                            </div>
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
</template>
<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch } from 'vue'
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';
import moment from "moment"
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
import { delay } from "@/utils/common"
import { AxiosLoading } from "@/utils/loading"
const axiosLoading = new AxiosLoading()
const router = useRouter()

import { DatePicker as vanDatePicker, Popup as vanPopup } from 'vant';

import { ElMessage } from "element-plus";
import { useGlobalStore } from '@/store/global'
const { uploadsPath, workerConfig } = toRefs(useGlobalStore());

import EChartsComponent from '@/components/common/ECharts.vue';
import nxrtPng from '@@/images/nxrt.png'

const menuDrawer = ref(false)
import logoIcon from '@@/images/logo.png';
import type { util_d$1 } from 'echarts/types/dist/shared';

const showCurrentDate = ref(false);
const currentDate = ref([moment().year(), moment().month() + 1]);
const columnsType = ['year', 'month'];
const minDate = new Date('2024', '05', '1');
const maxDate = moment().add(1, 'month').add(1, 'day').toDate();
const setCurrentDate = async (value) => {
    currentDate.value = value.selectedValues;
    showCurrentDate.value = false;
    await getAnalysisData();
}


const analysisData = ref({
    data: [],
    total_performance_task: 0,
    total_sale_price: 0,
    total_received: 0,
    total_sale_received: 0,
    total_sale_non_received: 0,
    total_sale_debt: 0,
    total_still_debt: 0,
    total_gift_price: 0,
    total_all_purchase_member_count: 0,
    total_purchase_new_member_count: 0,
    total_purchase_repeat_member_count: 0,
    total_branch_member_count: 0,
    performance_completion_rate: 0,
});
const performanceCompletionRate = ref({});
const branchSumPie = ref([]);
const branchSumMemberbar = ref([]);
const branchNomemberPie = ref([]);

const getAnalysisData = async () => {
    try {
        analysisData.value = {
            data: [],
            total_performance_task: 0,
            total_sale_price: 0,
            total_received: 0,
            total_sale_received: 0,
            total_sale_non_received: 0,
            total_sale_debt: 0,
            total_still_debt: 0,
            total_gift_price: 0,
            total_all_purchase_member_count: 0,
            total_purchase_new_member_count: 0,
            total_purchase_repeat_member_count: 0,
            total_branch_member_count: 0,
            performance_completion_rate: 0,
        };

        axiosLoading.addLoading();
        const res = await axios.get('/company/branch_lists', {type:1}, { toast: 0 })
        const branchLists = res.data;
        for (let i = 0; i < branchLists.length; i++) {

            const { data } = await axios.get('/services/get_monthly_analysis', { bid: branchLists[i].id, year: currentDate.value[0], month: currentDate.value[1], mode: 'default' }, { toast: 0 });
            if (data) {
                analysisData.value.data.push(data);
                analysisData.value.total_performance_task += Math.round(data.performance_task, 2)
                analysisData.value.total_sale_price += Math.round(data.sum_sale_price, 2)
                analysisData.value.total_received += Math.round(data.sum_received, 2)
                analysisData.value.total_sale_received += Math.round(data.sum_sale_received, 2)
                analysisData.value.total_sale_non_received += Math.round(data.sum_sale_non_received, 2)
                analysisData.value.total_sale_debt += Math.round(data.sum_sale_debt, 2)
                analysisData.value.total_still_debt += Math.round(data.sum_still_debt, 2)
                analysisData.value.total_gift_price += Math.round(data.sum_gift_price, 2)
                analysisData.value.total_all_purchase_member_count += Math.round(data.sum_all_purchase_member_count, 2)
                analysisData.value.total_purchase_new_member_count += Math.round(data.sum_purchase_new_member_count, 2)
                analysisData.value.total_purchase_repeat_member_count += Math.round(data.sum_purchase_repeat_member_count, 2)
                analysisData.value.total_branch_member_count += Math.round(data.sum_branch_member_count, 2)
                analysisData.value.performance_completion_rate = Math.round(analysisData.value.total_sale_price / (analysisData.value.total_performance_task ? analysisData.value.total_performance_task : 10000) * 100, 2)
            }
            await delay(500)
        }
        axiosLoading.closeLoading();
        localStorage.setItem('performance_first_bid', branchLists[0].id);
        updateChartOptions();
        getRandomMotivationalMessage();
        //year: currentDate.value[0], month: currentDate.value[1]
        // const { data } = await axios.get('/services/get_monthly_analysis', {year: 2024, month: 12, mode: 'default' }, { toast: 1 });
        // if(data){
        //     analysisData.value = data;
        //     console.log(2222222222, analysisData.value)
        //     localStorage.setItem('performance_first_bid', data.data[0].branch_id);
        // }

    } catch (error) {
        console.error(error);
    }
};

const updateChartOptions = () => {
    performanceCompletionRate.value = {
        series: [
            {
                type: 'gauge',
                radius: "95%",
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [
                            [0.3, '#67e0e3'],
                            [0.7, '#37a2da'],
                            [1, '#fd666d']
                        ]
                    }
                },
                pointer: {
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisTick: {
                    distance: -18,
                    length: 12,
                    lineStyle: {
                        color: '#fff',
                        width: 2
                    }
                },
                splitLine: {
                    distance: -30,
                    length: 30,
                    lineStyle: {
                        color: '#fff',
                        width: 3
                    }
                },
                axisLabel: {
                    color: 'inherit',
                    distance: 25,
                    fontSize: 12
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    color: 'inherit'
                },
                data: [
                    {
                        name: currentDate.value[0] + '年' + currentDate.value[1] + "月\n\n综合计划完成率",
                        value: analysisData.value.performance_completion_rate,
                        title: {
                            show: true,
                            offsetCenter: ["0", "-30%"],
                            color: "rgba(128, 128, 128, 1)",
                            fontSize: 12
                        },
                        detail: {
                            show: true,
                            offsetCenter: ["0", "50%"],
                            fontSize: 18
                        }
                    }
                ]
            }
        ]
    };

    if (analysisData.value) {
        Object.values(analysisData.value.data).forEach((item) => {
            branchSumPie.value[item.branch_name] = {
                // tooltip: {
                //     trigger: 'item'
                // },
                series: [
                    {
                        name: '销售额组成',
                        type: 'pie',
                        radius: ['50%', '95%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 5,
                            borderColor: '#fff',
                            borderWidth: 3
                        },
                        label: {
                            show: true,
                            position: 'inner'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 15,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: item.sum_sale_received, name: '销售实收' },
                            { value: item.sum_sale_non_received, name: '非实收' },
                            { value: item.sum_sale_debt, name: '未付总额' },
                            //{ value: item.sum_gift_price, name: '赠送总额' },
                        ]
                    }
                ]
            };

            branchNomemberPie.value[item.branch_name] = {
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '95%',
                        label: {
                            show: true,
                            position: 'inner'
                        },
                        data: [
                            { value: item.sum_purchase_new_member_count, name: '新购患者\n' + item.sum_purchase_new_member_count + '人' },
                            { value: item.sum_purchase_repeat_member_count, name: '复购患者\n' + item.sum_purchase_repeat_member_count + '人' },

                        ],
                        itemStyle: {
                            normal: {
                                color: function (colors) {
                                    var colorList = ['#f9c74f', '#6c629f'];
                                    return colorList[colors.dataIndex];
                                }
                            },
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        })
    }



};


onMounted(async () => {
    await getAnalysisData();
});

// Watch analysisData and update chartOptions when data is fetched
watch(() => analysisData.value, (newVal) => {
    // if (newVal) {
    //     updateChartOptions();
    //     getRandomMotivationalMessage();
    // }
});


const motivationalMessages = ref([
    "Great job! Keep up the excellent work!",
    "You're on fire! Keep pushing towards your goals!",
    "Amazing progress! You're closer to success!",
    "Keep going! Every effort counts!",
    "You're doing fantastic! Let's aim even higher!",
])
const motivationalMessage = ref('')
const getRandomMotivationalMessage = () => {
    // 根据完成率随机选择激励语句
    if (analysisData.value.performance_completion_rate == 0) {
        motivationalMessage.value = 'A new beginning, let us achieve transcendence';
    }
    else if (analysisData.value.performance_completion_rate >= 100) {
        motivationalMessage.value =
            "Congratulations! You've achieved your goal!";
    } else {
        const randomIndex = Math.floor(
            Math.random() * motivationalMessages.value.length
        );
        motivationalMessage.value = motivationalMessages.value[randomIndex];
    }
}


const loginOut = async () => {
    localStorage.removeItem('ERPAuth');
    Cookies.remove('ERPAuth');
    useGlobalStore().updateLoginStatus(0)
    router.replace({ path: '/login' })
}
</script>
<style scoped></style>

<template>
    <div class="absdfad mt-5 mb-3">
        <div class="mb-3">
            <div class="flex justify-content-between align-items-center">
                <div class="flex align-items-center">
                    <el-icon size="16" class="text-dblue-500">
                        <Files />
                    </el-icon>
                    <div class="font-bold text-md ml-2">我的预约日历</div>
                </div>
                <svg class="icon" aria-hidden="true" @click="showAppointmentsSummary = !showAppointmentsSummary">
                    <use xlink:href="#icon-shuju"></use>
                </svg>
            </div>
            <!-- <div class="text-gray-400 text-sm mt-1">My appointment calendar</div> -->
        </div>
        <el-scrollbar ref="scrollbarRef" class="pb-3">
            <div class="flex">
                <div v-for="(day, index) in getDates(15, hasOffday, false)" :key="index" class="mr-2 relative">
                    <div @click="!day.offday ? choseDate = day.date : ''"
                        class="flex-shrink-0 align-items-center justify-content-center align-content-center text-center px-2 py-2 border-round-xl border-1"
                        :class="{ 'bg-dblue-500 text-white border-dblue-700': choseDate == day.date, 'bg-white text-bluegray-900': choseDate != day.date, 'text-gray-300 border-dblue-50': day.offday, 'border-dblue-100': !day.offday }">
                        <div class="font-medium text-xl" style="z-index:1">{{ day.day }}</div>
                        <div class="mt-1 text-xs" :class="{ 'text-bluegray-300': choseDate != day.date }">{{
                            !day.offday ? day.weekday : '休' }}
                        </div>
                        <div v-if="appointmentLists.filter((item) => item.date == day.date).length > 0"
                            class="absolute flex justify-content-center" style="top:30px; left:0; right:0;">
                            <div class="bg-orange-500 border-circle border-1 border-white"
                                style="width:4px; height:4px;"></div>
                            <div class="bg-purple-500 border-circle border-1 border-white"
                                style="width:4px; height:4px; margin-left:1px;"
                                v-if="appointmentLists.filter((item) => item.date == day.date).length > 1"></div>
                        </div>
                        <div class="bg-red-100 absolute border-round-3xl"
                            style="height:3px; top:3px; left:10px; right:10px;"
                            v-if="appointmentLists.filter((item) => item.date == day.date && item.status == 0).length > 0">
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <div class="" v-if="dataLoaded">
        <div v-if="!appointmentLists.filter((item) => item.date == choseDate).length" class="mt-5 mb-5">
            <el-empty description="今日暂无预约" />
        </div>
        <div v-else>
            <div v-if="showAppointmentsSummary" class="mt-0 mb-5 bg-dblue-500 border-1 border-dblue-600 p-3 border-round-xl fadeinleft  animation-duration-500">
                <div class="text-white text-sm mb-1">预约时段分布</div>
                <div v-for="(option, index) in echartOptions" :key="index">
                    <EChartsComponent :option="option" height="50px" />
                </div>
            </div>
            <div class="mb-4 bg-white border-gray-100 border-1 border-round-3xl shadow-1 p-3 relative"
                :class="{ 'opacity-50': item.status == -1 }"
                v-for="(item, index) in appointmentLists.filter((item) => item.date == choseDate)" :key="index">
                <div class="flex justify-content-between gap-3">
                    <div class="">
                        <el-avatar :size="60">
                            <img :src="item.avatar || defaultAvatar" />
                        </el-avatar>
                    </div>
                    <div class="w-full">
                        <div class="mt-1 text-md text-bluegray-900 font-bold">{{ item.fullname }}</div>
                        <div class="text-sm mt-2 text-primary-600">
                            {{ item.model_name }}
                            <!-- <span class="text-xs text-bluegray-200">({{ item.time_once }}分钟)</span> -->
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center h-2rem absolute" style="top:10px; right:10px;">
                    <div class="border-1 border-gray-300 border-round-lg pt-1 px-1 vertical-align-middle">
                        <a class="text-gray-700" @click="showRemind = true; addRemindCard = item.card_number">
                            <el-icon size="14" class="">
                                <Bell />
                            </el-icon>
                        </a>
                    </div>
                    <div class="border-1 border-gray-300 border-round-lg pt-1 px-1 ml-2 vertical-align-middle">
                        <a :href="'tel:' + item.telphone" class="text-gray-700">
                            <el-icon size="14" class="">
                                <Phone />
                            </el-icon>
                        </a>
                    </div>
                    <div class="border-1 border-gray-300 border-round-lg pt-1 px-1 ml-2 vertical-align-middle">
                        <el-tooltip class="box-item" effect="light" placement="left-start" popper-class="p-0">
                            <el-icon size="14" class="text-gray-700">
                                <MoreFilled />
                            </el-icon>
                            <template #content>
                                <div class="text-sm">
                                    <div class="px-3 py-2">
                                        <RouterLink :to="`/worker/services/sales_records?card_number=${item.card_number}`"
                                            class="text-dblue-500">收费记录</RouterLink>
                                    </div>
                                    <div class="px-3 py-2">
                                        <RouterLink :to="`/worker/services/usage_records?card_number=${item.card_number}`"
                                            class="text-dblue-500">预约记录</RouterLink>
                                    </div>
                                    <el-divider class="m-0 border-gray-50" />
                                    <div v-if="!['7', '8', '-1'].includes(item.status)" class="text-gray-500 px-3 py-2"
                                        @click="cancelAppointment = item.id">
                                        取消预约</div>
                                </div>
                            </template>
                        </el-tooltip>
                    </div>
                </div>
                <div
                    class="mt-3 flex justify-content-between align-items-center align-items-center bg-bluegray-50 border-round-xl px-3 py-2 text-bluegray-600">
                    <div class="flex align-items-center">
                        <el-icon size="15">
                            <Calendar />
                        </el-icon>
                        <div class="text-xs ml-1">{{ item.date }}</div>
                    </div>
                    <div class="flex align-items-center">
                        <el-icon size="15">
                            <Clock />
                        </el-icon>
                        <div class="text-xs ml-1">{{ item.time || '待确认' }}</div>
                    </div>
                    <div class="flex align-items-center" :class="getStatusText(item.status).color">
                        <el-icon size="15">
                            <Guide />
                        </el-icon>
                        <div class="text-xs ml-1">{{ getStatusText(item.status).text }}
                        </div>
                    </div>
                </div>
                <div v-if="item.status == 0" class="mt-3 flex justify-content-between align-items-center">
                    <el-button round plain type="warning" size="default" class="w-full"
                        @click="cancelAppointment = item.id">
                        <el-icon class="mr-1">
                            <CloseBold />
                        </el-icon>
                        取消预约
                    </el-button>
                    <el-button round plain type="primary" size="default" class="w-full"
                        @click="choseAppointmentId = item.id">
                        <el-icon class="mr-1">
                            <Check />
                        </el-icon>
                        确认预约
                    </el-button>
                    <!-- <el-button round type="primary" size="default" class="w-full">
                        <el-icon class="mr-1">
                            <Document />
                        </el-icon>
                        档案
                    </el-button> -->
                </div>
                <div v-if="item.status == 1" class="mt-3 flex justify-content-between">
                    <el-button round type="default" size="default"
                        @click="router.push({ path: `/worker/appointment/archive/${item.id}` })"
                        class="bg-dblue-50 border-dblue-100 text-dblue-500">
                        <el-icon class="mr-1">
                            <Document />
                        </el-icon>
                        治疗记录
                    </el-button>

                    <el-button v-if="getCurrentDate() == getCurrentDate(new Date(item.date))" round type="default"
                        size="default" @click="completeAppointment = item.id"
                        class="bg-teal-50 border-teal-100 text-teal-500">
                        <el-icon class="mr-1">
                            <Lock />
                        </el-icon>
                        完结
                    </el-button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <!-- /加载占位 -->
        <el-skeleton animated :count="3" class="mb-5">
            <template #template>
                <div class="mb-5">
                    <div class="flex gap-5">
                        <el-skeleton-item variant="circle" style="width: 80px; height: 80px" />
                        <div class="flex flex-column flex-1 mt-1">
                            <el-skeleton-item variant="text" class="mt-2" style="width: 120px;" />
                            <el-skeleton-item variant="text" class="mt-2" style="width: 60px;" />
                            <el-skeleton-item variant="text" class="mt-2" style="width: 100%;" />
                        </div>
                    </div>
                    <div class="flex justify-content-between gap-5 mt-3">
                        <el-skeleton-item variant="caption" style="width: 100%;" />
                        <el-skeleton-item variant="caption" style="width: 100%;" />
                        <el-skeleton-item variant="caption" style="width: 100%;" />
                    </div>
                </div>
            </template>
        </el-skeleton>
    </div>

    <!-- /确认预约弹窗 -->
    <el-dialog v-model="showConfirmAppointment" width="90%" center align-center :show-close="false"
        :close-on-click-modal="false" class="border-round-2xl border-1 border-bluegray-100">
        <template #header>
            <!-- <div class="text-center">确认预约信息</div> -->
        </template>
        <div class="relative">
            <div class="flex justify-content-between gap-3">
                <div class="">
                    <el-avatar :size="60">
                        <img :src="selectAppointmentItem.avatar || defaultAvatar" />
                    </el-avatar>
                </div>
                <div class="w-full">
                    <div class="text-md text-bluegray-900 font-bold">{{ selectAppointmentItem.fullname }}</div>
                    <div class="text-xs mt-1 text-blue-600">{{ selectAppointmentItem.model_name }}<span
                            class="text-xs text-bluegray-200"></span></div>
                    <div class="text-xs text-bluegray-200">项目服务时间 {{ selectAppointmentItem.time_once }} 分钟</div>
                </div>
            </div>
            <div class="flex align-items-center h-2rem absolute" style="top:-10px; right:5px;">
                <div class="border-1 border-bluegray-100 border-round-lg pt-1 px-1 vertical-align-middle">
                    <a :href="'tel:' + selectAppointmentItem.telphone" class="text-bluegray-600">
                        <el-icon size="16" class="">
                            <Phone />
                        </el-icon>
                    </a>
                </div>
                <div class="border-1 border-bluegray-100 border-round-lg pt-1 px-1 ml-2 vertical-align-middle"
                    @click="choseAppointmentId = 0">
                    <el-icon size="16" class="">
                        <Close />
                    </el-icon>
                </div>
            </div>
            <div class="mt-3 bg-bluegray-50 border-round-xl px-2 py-3">
                <div class="text-center text-bluegray-200">患者期望预约日期及时间</div>
                <div class="mt-2 flex justify-content-between align-items-center align-items-center text-bluegray-600">
                    <div class="w-full text-center line-height-1">
                        <el-icon size="18" class="inline-block vertical-align-middle">
                            <Calendar />
                        </el-icon>
                        <div class="inline-block vertical-align-middle text-xs ml-1">{{ selectAppointmentItem.date }}
                        </div>
                    </div>
                    <div class="w-full text-center line-height-1">
                        <el-icon size="18" class="inline-block vertical-align-middle">
                            <Clock />
                        </el-icon>
                        <div class="inline-block vertical-align-middle text-xs ml-1">{{ selectAppointmentItem.time }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full mt-3">
                <div class="text-center text-bluegray-200">请确认最终安排</div>
                <el-select v-model="confirmForm.model_id" multiple collapse-tags size="large" placeholder="请确定项目"
                    class="w-full mt-2 mb-2">
                    <el-option v-for="(list, i) in memberAppointmentLists" :key="i"
                        :label="`${list.model_name}(${list.time_once}分钟)`" :value="list.model_id"
                        :disabled="selectAppointmentItem.model_id == list.model_id" />
                </el-select>
                <div class="mt-2 flex justify-content-between gap-2">
                    <div v-for="(day, index) in getDates(6, hasOffday)" :key="index"
                        @click="!day.offday ? confirmForm.date = day.date : ''"
                        :class="{ 'bg-dblue-500 text-white border-dblue-700': confirmForm.date == day.date, 'bg-white text-bluegray-900 border-dblue-100': confirmForm.date != day.date, 'text-gray-300 border-dblue-50': day.offday, 'border-dblue-100': !day.offday }"
                        class="flex-shrink-0 align-items-center justify-content-center align-content-center text-center px-2 py-2 border-round-xl border-1">
                        <div class="font-medium text-xl">{{ day.day }}</div>
                        <div class="mt-1 text-xs" :class="{ 'text-bluegray-300': confirmForm.date != day.date }">{{
                            day.offday ? '休' : day.weekday
                            }}
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <!-- <el-scrollbar class="pb-3">
                        <div class="flex gap-2">
                            <el-tag
                                v-for="(time, index) in generateTimeRange('08:00', '20:00', 15, unavailableTimes).split(',')"
                                :key="index" v-show="!unavailableTimes.includes(time)" type="info" round
                                @click="selectappointmentTime.includes(time) ? selectappointmentTime.splice(selectappointmentTime.indexOf(time), 1) : selectappointmentTime.push(time)"
                                :class="{ 'bg-dblue-500 text-white border-dblue-700': selectappointmentTime.includes(time), 'bg-white text-bluegray-900 border-dblue-100': !selectappointmentTime.includes(time) }"
                                size="large">
                                {{ time }}
                            </el-tag>
                        </div>
                    </el-scrollbar> -->
                    <div class="py-2">
                        <div class="flex justify-content-between align-items-center">
                            <div class="w-full text-center" @click="showTimePicker = true;">
                                <div class="text-xs text-500 mb-1">到店时间</div>
                                <div class=" text-md text-dblue-500 font-bold">{{
                                    selectappointmentTime[0] ? selectappointmentTime[0] : '请选择到店时间' }}</div>
                            </div>
                            <el-divider direction="vertical" style="height:20px;" />
                            <div class="w-full text-center text-md text-dblue-500" @click="showTimePicker = true;">
                                <div class="text-xs text-500 mb-1">结束时间</div>
                                <div class=" text-md text-dblue-500 font-bold">{{
                                    selectappointmentTime[1] ? selectappointmentTime[1] : '请选择到店时间' }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-bluegray-500">已选择 {{ `${confirmForm.model_id.length} 项服务需约
                        ${needAppointmentTime} 分钟` }}{{ selectappointmentTime[1] ? `，该时段已确认预约 ${includedInTime} 人次` : ''
                        }}
                    </div>
                </div>
            </div>
            <el-divider border-style="dashed" class="mb-3 border-bluegray-100" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" round @click="choseAppointmentId = 0">暂不确认</el-button>
                <el-button type="primary" size="large" round @click="submitConfirmAppointment"
                    class="bg-dblue-500 border-dblue-800">
                    确认预约
                </el-button>
            </div>
        </template>
    </el-dialog>

    <vantpopup v-model:show="showRemind" round closeable position="bottom" :style="{ height: '70%' }">
        <Addremind :card-number="addRemindCard" :worker-id="workerConfig.id"
            @remind-added="(n) => { if (n === true) { showRemind = false; addRemindCard = ''; } }" />
    </vantpopup>

    <vantpopup v-model:show="showTimePicker" round position="bottom" :style="{ height: '40%', zIndex: '999999999' }">
        <van-time-picker v-model="currentTime" title="选择到店时间" :columns-type="['hour', 'minute']" min-hour="08"
            max-hour="18" :filter="timePickerFilter" @cancel="showTimePicker = false;"
            @confirm="choseAppointmentStartTime" />
    </vantpopup>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

import axios from "@/utils/axios";
import moment from "moment"
import { getDates, getCurrentDate, generateTimeRange, afterTimeRange, continuousTimeRange, formatTimeLimit, addMinutesToTime } from "@/utils/common"
import { Calendar as vantcalendar, showToast, Dialog, showConfirmDialog, Popup as vantpopup, TimePicker as vanTimePicker } from 'vant';

//import Archive from '@/views/worker/appointment/Archive.vue'
import Addremind from '@/views/worker/member/AddRemind.vue'
import { useGlobalStore } from '@/store/global'
const { workerConfig } = toRefs(useGlobalStore());


import defaultAvatar from '@@/images/default_avatar.webp'
import { ElMessage } from "element-plus";

import EChartsComponent from '@/components/common/ECharts.vue';
const showAppointmentsSummary = ref(false)




const choseAppointmentStartTime = async (selectedValues) => {
    const start_time = selectedValues.selectedValues[0] + ':' + selectedValues.selectedValues[1];
    const end_time = addMinutesToTime(start_time, needAppointmentTime.value);
    selectappointmentTime.value = [start_time, end_time]

    try {
        const res = await axios.get('/services/time_has_appointment', {
            worker_id: selectAppointmentItem.value.services_worker_id,
            day: selectAppointmentItem.value.date,
            time: start_time + '~' + end_time
        }, { toast: 0 })
        if (res.status && res.data) {
            includedInTime.value = res.data.count
        } else {
            includedInTime.value = 0
        }
    } catch (error) {
        console.error('Error fetching time_has_appointment:', error);
    }

    showTimePicker.value = false
}

const showRemind = ref(false);
const showTimePicker = ref(false)
const currentTime = ref(['08', '00'])
const includedInTime = ref(0) // 所选时段内有几个预约项目
const addRemindCard = ref('');

const choseDate = ref(getDates(15)[0].date) // 默认选择当日
const hasOffday = ref([])
watch(() => workerConfig.value.offday, (nval, oval) => {
    if (nval) {
        let cnt = 0;
        hasOffday.value = nval.split(',').map((dateString: any, i) => {
            if (choseDate.value == dateString) {
                cnt = cnt + 1
            }
            choseDate.value = getDates(15)[cnt].date
            return moment(dateString, 'YYYY/MM/DD').toDate(); // 解析日期格式
        }).filter((date: any) => {
            return moment(date).isSameOrAfter(moment().startOf('day'));
        })
    } else {
        hasOffday.value = [];
    }
}, { immediate: true })

// 选择预约日期并获得预约列表
interface Appointmentface {
    id: number;
    card_number: string;
    fullname: string;
    avatar: string;
    services_worker_id: number;
    services_worker_name: string;
    model_id: number;
    model_name: string;
    time_once: number;
    telphone: number;
    date: string;
    time: string;
    status: number;
}
const appointmentLists = ref<Appointmentface[]>([]);
const dataLoaded = ref(false);
const getAppointmentLists = async () => {
    try {
        dataLoaded.value = false;
        const query_date = getDates(15, hasOffday.value, false).filter(({ offday }) => !offday)
            .map(({ date }) => date)
            .join(',');
        await axios.get('/services/appointment_lists', {
            'bid': workerConfig.value.bid,
            'services_worker_id': workerConfig.value.id,
            'date': query_date //choseDate.value
        }, { toast: 0 }).then(res => {
            appointmentLists.value = res.data || []
            if (appointmentLists.value) {
                dataLoaded.value = true;
            }
        })
    } catch (error) {
        dataLoaded.value = false;
        console.error('Error fetching appointment_lists:', error);
    }
}

watch(choseDate, async (newValue, oldValue) => {
    if (!appointmentLists.value.length) {
        await getAppointmentLists()
    }
    showAppointmentsSummary.value = false;
}, { immediate: true })






// 可预约时段列表
const showConfirmAppointment = ref(false)
const choseAppointmentId = ref<number | null>(0)
// const unavailableTimes = ref<string[]>([]); // 不可预约时间
const selectappointmentTime = ref<Array<string>>([])
const needAppointmentTime = ref(0)
const memberAppointmentLists = ref([])
const selectAppointmentItem = ref({});
// 确认预约表单
const confirmForm = ref({
    appointment_id: 0,
    model_id: [] as number[],
    date: '',
    time: '',
    total_time: 0,
    status: 1
})
const submitConfirmAppointment = async () => {
    // if (!continuousTimeRange(selectappointmentTime.value)) {
    //     showToast({ type: 'fail', message: '必须选择连续的时间', icon: "warning-o", zIndex: 99999 })
    //     return;
    // }

    if (confirmForm.value.total_time < needAppointmentTime.value) {
        showToast({ type: 'fail', message: '请确认到店时间', icon: "warning-o", zIndex: 99999 })
        return;
    }

    if (!confirmForm.value.appointment_id || !confirmForm.value.model_id) {
        showToast({ type: 'fail', message: '请选择预约项目', icon: "warning-o", zIndex: 99999 })
        return;
    }

    if (!confirmForm.value.date || !confirmForm.value.time) {
        showToast({ type: 'fail', message: '请选择预约时间', icon: "warning-o", zIndex: 99999 })
        return;
    }
 
    if(!confirmForm.value.total_time){
        showToast({ type: 'fail', message: '服务时长未正确生成', icon: "warning-o", zIndex: 99999 })
        return;
    }

    

    try {
        await axios.post('/services/confirm_appointment', confirmForm.value).then(res => {
            if (res.status) {
                ElMessage({ message: res.info, type: 'success' })
                getAppointmentLists()
                // appointmentLists.value.forEach((appointment, index) => {
                //     if (appointment.id === choseAppointmentId.value) {
                //         appointment.status = 1;
                //         appointment.date = confirmForm.value.date;
                //         appointment.time = confirmForm.value.time;
                //     }
                // });
                showConfirmAppointment.value = false;
                choseAppointmentId.value = 0;
            }
        })
    } catch (error) {
        console.error('Error fetching appointment:', error);
    }
}
watch(() => choseAppointmentId.value, async (nval, oval) => {
    if (nval > 0) {
        showConfirmAppointment.value = true;
        const a = appointmentLists.value.filter((item) => item.id === nval);
        const selectedAppointment = a[0] || null;

        if (selectedAppointment) {
            try {
                await axios.get('/services/member_services_lists', {
                    bid: workerConfig.value.bid,
                    card_number: selectedAppointment.card_number,
                    services_worker_id: selectedAppointment.services_worker_id,
                    model: 'MedicalServices'
                }, { toast: 0 }).then(res => {
                    memberAppointmentLists.value = res.data;
                })

            } catch (error) {
                console.error('Error fetching member_services_lists:', error);
            }

            selectAppointmentItem.value = selectedAppointment;
            confirmForm.value.date = choseDate.value
            confirmForm.value.appointment_id = selectedAppointment.id;
            confirmForm.value.model_id.push(selectedAppointment.model_id)
            needAppointmentTime.value = selectedAppointment.time_once

            // try {
            //     await axios.get('/services/time_has_appointment', {
            //         worker_id: selectedAppointment.services_worker_id,
            //         day: selectedAppointment.date
            //     }, { toast: 0 }).then(has_time => {
            //         if (has_time.data) {
            //             const times = has_time.data.split("~");

            //             unavailableTimes.value = generateTimeRange(times[0], times[1]).split(',');
            //             unavailableTimes.value.pop()
            //         }
            //     })
            // } catch (error) {
            //     console.error('Error fetching time_has_appointment:', error);
            // }

            await nextTick();
        } else {
            selectAppointmentItem.value = [];
        }
    } else {
        showConfirmAppointment.value = false;
    }
});
// 监听确认窗口，重置表单
watch(() => showConfirmAppointment.value, (nval, oval) => {
    if (!nval) {
        confirmForm.value = {
            appointment_id: 0,
            model_id: [],
            date: '',
            time: '',
            total_time: 0,
            status: 1
        }
        memberAppointmentLists.value = [];
        selectAppointmentItem.value = [];
        //unavailableTimes.value = [];
        needAppointmentTime.value = 0;
        selectappointmentTime.value = [];
    }
})
// 监听多选预约项目时合计这些项目的服务时间
watch(() => confirmForm.value.model_id, (nval, oval) => {
    selectappointmentTime.value = [];
    needAppointmentTime.value = confirmForm.value.model_id.reduce((sum, key) => {
        const id = parseInt(key, 10);
        const d = memberAppointmentLists.value.filter((item) => {
            return item.model_id == id
        })[0]
        if (d) {
            sum += parseInt(d.time_once, 10);
        }
        return sum;
    }, 0);
})
// 监听确认预约时间选择，并格式化成时间段+总时长
watch(() => selectappointmentTime.value, (nval, oval) => {
    selectappointmentTime.value.sort((a, b) => {
        const timeA: any = new Date(`2000-01-01T${a}`);
        const timeB: any = new Date(`2000-01-01T${b}`);
        return timeA - timeB;
    });
    const a = formatTimeLimit(selectappointmentTime.value);
    confirmForm.value.time = a.string;
    confirmForm.value.total_time = a.minutes;
}, { deep: true })



// 取消预约
const cancelAppointment = ref(0)
watch(() => cancelAppointment.value, (nval, oval) => {
    if (nval > 0) {
        showConfirmDialog({
            title: '确认取消',
            message: '请确认要取消该预约？取消后如患者仍需服务，需重新提交预约。',
        }).then(async () => {
            await axios.post('/services/update_appointment_status', { id: nval, status: -1 }).then((res) => {
                if (res.status) {
                    ElMessage({ message: res.info, type: 'success' })
                    getAppointmentLists()
                }
            })

            nextTick()
            cancelAppointment.value = 0;
        }).catch(() => {
            cancelAppointment.value = 0;
        });
    }
})
const completeAppointment = ref(0)
watch(() => completeAppointment.value, (nval, oval) => {
    if (nval > 0) {
        showConfirmDialog({
            title: '确认操作',
            message: '直接完结预约单将跳过部分流程，确认继续？',
        }).then(async () => {
            await axios.post('/services/update_appointment_status', { id: nval, status: 8 }).then((res) => {
                if (res.status) {
                    ElMessage({ message: res.info, type: 'success' })
                    getAppointmentLists()
                }
            })

            nextTick()
            completeAppointment.value = 0;
        }).catch(() => {
            completeAppointment.value = 0;
        });
    }
})



const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
onMounted(async () => {
    scrollbarRef.value!.setScrollLeft(285)
})


const timePickerFilter = (type, options) => {
    if (type === 'minute') {
        return options.filter((option) => Number(option.value) % 5 === 0);
    }
    return options;
};


// 根据状态获取相应的文本值
const getStatusText = (status: string) => {
    const statusMap: any = {
        '0': { text: '待确认', icon: 'pending-icon', color: 'text-red-500' },
        '1': { text: '已确认', icon: 'confirmed-icon', color: 'text-dblue-500' },
        '7': { text: '待评价', icon: 'completed-icon', color: 'text-teal-500' },
        '8': { text: '已完成', icon: 'completed-icon', color: 'text-green-500' },
        '-1': { text: '已取消', icon: 'cancelled-icon', color: 'text-bluegray-500' }

    };
    return statusMap[status];
};

const echartOptions = ref([]);
watch(() => showAppointmentsSummary.value, async (nval, oval) => {
    if (nval) {
        const res = await axios.get('/services/get_branch_appointments_summary', { bid: workerConfig.value.bid, date: choseDate.value }, { toast: 0 })
        const data = res.data; // Assume data is in the required format
        if(data){
            echartOptions.value = generateEchartOptions(data);
        }
        
    }
})

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



</script>
<style lang="scss" scoped></style>

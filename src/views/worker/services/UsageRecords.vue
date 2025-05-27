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
                    <div class="text-large font-600 text-900 mr-3"> {{ route.query.card_number?(recordsLists?recordsLists[0].fullname+'预约记录':''):'患者预约记录' }} </div>
                </template>
                <template #extra>
                    <!-- <svg class="icon" aria-hidden="true" style="width:24px; height:24px;" @click="getPayDetails()">
                        <use xlink:href="#icon-shuju"></use>
                    </svg> -->
                </template>
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
                    <div class="mt-2 text-md">{{  Number(statistics.current_month_sales_count) }}</div>
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
            <div class="flex justify-content-between align-items-end">
                <div class="text-xl">
                    {{ moment(currentDate.join('-'), "YYYY-MM").format('YYYY年MM月') }}
                </div>
                <div class="text-dblue-500">
                    <el-icon size="18px" @click="showDatePicker=true">
                        <Calendar />
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="">
            <div v-if="!recordsLists" class="mt-5">
                <el-empty description="No records found">
                    <div class="text-xs text-500">仅展示服务员工为{{ globalStore.workerConfig.fullname }}的预约记录</div>
                </el-empty>
            </div>
            <div v-else class="p-3">
                <div v-for="(item, index) in recordsLists" :key="index"
                    class="border-1 border-gray-100 border-round-xl shadow-1 mb-5 overflow-hidden">
                    <div class="flex gap-3 px-3 pt-3">
                        <div class="">
                            <el-avatar :size="50" :src="item.avatar || defaultAvatar" />
                        </div>
                        <div class="">
                            <div class="text-md font-bold">{{ item.fullname }}</div>
                            <div class="text-sm mt-2 text-500">{{ item.card_number }}</div>
                        </div>
                    </div>
                    <el-divider content-position="left"><span class="text-gray-300">Usage records</span></el-divider>
                    <div class="px-3 pb-3">
                        <div v-for="(usage, dindex, i) in item.usage" :key="dindex" class="">
                            <el-divider v-if="i>0" border-style="dotted" />
                            <div class="flex gap-3 align-items-start">
                                <div class="">
                                    <img :src="usage.cover" width="42px">
                                </div>
                                <div class="w-full">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm"
                                            style="width:50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            {{ usage.name }}
                                        </div>
                                        <div class="text-right text-xs text-400" style="width: 50%;">
                                            {{ usage.create_time }}
                                        </div>
                                    </div>
                                    <div class="mt-1 text-sm flex justify-content-between align-items-center">
                                        <div class="text-gray-800 text-xs">{{ usage.time }}</div>
                                        <div class="text-gray-600">
                                            <el-tag v-if="usage.bonus" type="success" effect="light" size="small">
                                                {{ `绩效奖金：￥${usage.bonus}` }}
                                            </el-tag>
                                            <el-tag v-else type="info" effect="light" size="small">
                                                不计绩效
                                            </el-tag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="usage.archive.exhort || usage.archive.remarks" class="mt-3 text-xs bg-dblue-50 p-3 border-round-xl">
                                <div v-if="usage.archive.exhort" class="text-gray-600">{{ `康复建议：${usage.archive.exhort}` }}</div>
                                <div v-if="usage.archive.remarks" class="text-xs text-gray-600 mt-2">{{ `备注：${usage.archive.remarks}` }}</div>
                                <div v-if="usage.archive.comparison_image" ><img :src="usage.archive.comparison_image" width="100%"></div>
                                <div class="border-top-1 border-gray-200 mt-3 pt-1">
                                    <div class="flex justify-content-between align-items-center">
                                        <div class="text-sm text-800">患者评价</div>
                                        <el-rate v-model="usage.comments.rating" disabled show-score text-color="#ff9900"/>
                                    </div>
                                    <div class="text-gray-600">{{ usage.comments.comment }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-popup v-model:show="showDatePicker" position="bottom" :style="{ padding: '0 10px', height: '308px' }">
        <van-date-picker v-model="currentDate" title="选择日期" @cancel="showDatePicker=false" :min-date="minDate" :max-date="maxDate"
            :columns-type="columnsType" @confirm="getRecords(); showDatePicker = false;" />
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
import { ElMessage } from 'element-plus';
import { getCurrentDate } from '@/utils/common'
import { DatePicker as vanDatePicker, Popup as vanPopup, TextEllipsis as vanTextEllipsis } from 'vant';
import defaultAvatar from '@@/images/default_avatar.webp'
import HeaderSimple from "@/components/layout/header/HeaderSimple.vue";

import moment from "moment"
const showDatePicker = ref(false)
const currentDate = ref(route.query.date?[route.query.date.split('-')]:[moment().year(), moment().month()+1]);
const columnsType = ['year', 'month'];
const minDate = new Date('2024', '05', '1');
const maxDate = moment().add(1, 'month').add(1, 'day').toDate();

const recordsLists = ref(null)

onMounted( async () => {
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


const getRecords = async () =>{
    await axios.get('/services/get_member_usage_details', { bid:route.query.bid?route.query.bid:globalStore.workerConfig.bid, worker_id: route.query.worker_id?route.query.worker_id:globalStore.workerConfig.id, date: route.query.date?route.query.date:currentDate.value.join('-'), card_number: route.query.card_number?route.query.card_number:''}).then(res => {
        if(res.status){
            recordsLists.value = res.data
        }
    });
    getWorkerMStatistics()
}


</script>

<style lang="scss"></style>

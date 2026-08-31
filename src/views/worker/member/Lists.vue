<template>
    <div class="h-full">
        <el-affix position="top" :offset="0">
            <div class="bg-white">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="searchForm.group" :options="groupOptions" />
                    <van-dropdown-item title="价值筛选" ref="filterControl">
                        <van-cell center title="时间范围">
                            <template #right-icon>
                                <el-tag :type="searchForm.date_range == 1 ? 'primary' : 'info'"
                                    :effect="searchForm.date_range == 1 ? 'dark' : 'plain'" round size="small"
                                    class="ml-2" @click="changeFilter('date_range', '1')">一个月</el-tag>
                                <el-tag :type="searchForm.date_range == 2 ? 'primary' : 'info'"
                                    :effect="searchForm.date_range == 2 ? 'dark' : 'plain'" round size="small"
                                    class="ml-2" @click="changeFilter('date_range', '2')">三个月</el-tag>
                                <el-tag :type="searchForm.date_range == 3 ? 'primary' : 'info'"
                                    :effect="searchForm.date_range == 3 ? 'dark' : 'plain'" round size="small"
                                    class="ml-2" @click="changeFilter('date_range', '3')">半月</el-tag>
                                <el-tag :type="searchForm.date_range == 4 ? 'primary' : 'info'"
                                    :effect="searchForm.date_range == 4 ? 'dark' : 'plain'" round size="small"
                                    class="ml-2" @click="changeFilter('date_range', '4')">一年以上</el-tag>
                            </template>
                        </van-cell>
                        <van-cell center title="消费能力" @click="changeFilter('spending', '1')">
                            <template #right-icon>
                                <i v-if="searchForm.spending == 1"
                                    class="van-icon van-icon-success text-primary-500"></i>
                            </template>
                        </van-cell>
                        <van-cell center title="互动频率" @click="changeFilter('activity', '1')">
                            <template #right-icon>
                                <i v-if="searchForm.activity == 1"
                                    class="van-icon van-icon-success text-primary-500"></i>
                            </template>
                        </van-cell>
                    </van-dropdown-item>
                </van-dropdown-menu>
                <div class="mt-2">
                    <van-search v-model="searchForm.keyword" @search="onSearch" @clear="getLists"
                        placeholder="请输入卡号/电话/姓名进行查询" />
                </div>
            </div>
        </el-affix>
        <div class="mt-2">
            <div class="p-3">
                <div v-if="!memberLists.length">
                    <el-empty description="这里没有会员哦！" />
                </div>
                <div v-else>
                    <div v-if="notPayfullByMemberSelf && searchForm.group==4" class="bg-orange-50 border-1 border-yellow-100 text-red-600 p-3 border-round-lg mb-3 relative overflow-hidden">
                        <div class="relative" style="z-index: 1;">
                            <div class="flex justify-content-between align-items-end">
                                <div class="font-bold">会员自付订单待付</div>
                                <div class="text-xs">请提醒会员尽快完成支付</div>
                            </div>
                            <div class="mt-2">
                                <div v-for="(item, index) in notPayfullByMemberSelf" :key="index" class="flex justify-content-between align-items-center text-xs py-2">
                                    <div>***{{item.barcode.substr(item.barcode.length-4)}}</div>
                                    <div class="ml-3">{{ item.fullname }}</div>
                                    <div class="font-bold flex-1 text-right">￥{{ item.payable*-1 }}</div>
                                    <div class="ml-3">{{ item.deal_create_time }}</div>
                                </div>
                            </div>
                        </div>
                        <svg class="icon absolute opacity-30" aria-hidden="true" style="width:90%; height:90%; top:-15%; right:-30%; z-index: 0; transform: rotate(-35deg);">
                            <use xlink:href="#icon-shoujizhifu"></use>
                        </svg>
                    </div>
                    <div class="mb-3" v-for="(item, index) in memberLists" :key="index">
                        
                        <div class="border-1 border-round-3xl border-gray-100 shadow-1 p-3 relative" :class="{'bg-blue-50': item.source!='1'}">
                            <div class="flex gap-3">
                                <div>
                                    <el-progress type="dashboard" :width="Number(77)" :stroke-width="Number(4)"
                                        :percentage="item.usage_rate" status="success">
                                        <template #default="{ percentage }">
                                            <el-avatar shape="circle" :size="65">
                                                <img :src="item.avatar || defaultAvatar" />
                                            </el-avatar>
                                        </template>
                                    </el-progress>
                                </div>
                                <div class="w-full">
                                    <div class="">
                                        <span class="font-bold text-md">{{ item.fullname }}</span>
                                        <span v-if="item.source!=1" class="text-xs text-center text-blue-200 font-thin ml-2">{{ item.source }}</span>
                                    </div>
                                    <!-- <div class="text-orange-500 text-sm"><span class="text-gray-500 mr-1">会员分组</span>{{ item.card_rule.name }}</div> -->
                                    <div v-if="searchForm.group!=2" class="text-gray-600 text-xs mt-1">
                                        最后预约 {{ item.last_usage_day }} 天前
                                    </div>
                                    <div class="text-gray-600 text-xs flex align-items-center mt-1">
                                        <div v-if="item.birthday" class="bg-blue-50 text-blue-400 py-1 px-2 border-round-sm mr-2">
                                            <span class="mr-1 ">生日</span>
                                            <span class="text-xs">{{ item.birthday }}</span>
                                        </div>
                                        <div v-if="item.remind_date1 && moment(item.remind_date1).isAfter(moment().startOf('day'), 'day')" class=" bg-red-50 text-red-400 py-1 px-2 border-round-sm">
                                            <span class="mr-1">预产</span>
                                            <span class="">{{ item.remind_date1 }}</span>
                                        </div>
                                        <div v-if="item.remind_date2 && moment(item.remind_date1).isBefore(moment().startOf('day'), 'day')" class=" bg-orange-50 text-orange-400 py-1 px-2 border-round-sm">
                                            <span class="mr-1">分娩</span>
                                            <span class="text-xs">{{ item.remind_date2 }}</span>
                                        </div>
                                    </div>
                                    <div v-if="searchForm.group==2" class="text-gray-400 text-sm">该患者尚未购买任何服务</div>
                                </div>
                                <div class="absolute flex" style="top:10px; right:15px;">
                                    <div
                                        class="border-1 border-bluegray-100 border-circle pt-1 px-1 ml-2 vertical-align-middle">
                                        <a :href="`tel:${item.telphone}`" class="text-bluegray-800">
                                            <el-icon size="15" class="">
                                                <Phone />
                                            </el-icon>
                                        </a>
                                    </div>
                                    <div class="ml-2" v-if="item.card_number in isHaveVideoRecord">
                                        <div class="border-1 border-bluegray-100 border-circle pt-1 px-1 vertical-align-middle">
                                            <RouterLink :to="`/worker/video/record`" params="{ card_number: item.card_number }" class="text-bluegray-800">
                                                <svg class="icon" aria-hidden="true" style="width: 16px; height: 16px;">
                                                    <use xlink:href="#icon-paobu"></use>
                                                </svg>
                                            </RouterLink>
                                        </div>
                                    </div>
                                    <div
                                        class="border-1 border-bluegray-100 border-circle pt-1 px-1 ml-2 vertical-align-middle">
                                        <el-tooltip class="box-item" effect="light" placement="left-start" popper-class="p-0">
                                            <el-icon size="14" class="text-bluegray-800">
                                                <MoreFilled />
                                            </el-icon>
                                            <template #content>
                                                <div class="text-sm">
                                                    <div class="px-3 py-2">
                                                        <RouterLink :to="`/worker/services/sales_records?card_number=${item.card_number}`" class="text-dblue-500">收费记录</RouterLink>
                                                    </div>
                                                    <div class="px-3 py-2">
                                                        <RouterLink :to="`/worker/services/usage_records?card_number=${item.card_number}`" class="text-dblue-500">预约记录</RouterLink>
                                                    </div>
                                                    <el-divider class="m-0 border-gray-50" />
                                                </div>
                                            </template>
                                        </el-tooltip>
                                        <!-- <a class="text-900">
                                            <el-icon size="15" class="">
                                                <MoreFilled />
                                            </el-icon>
                                        </a> -->
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-between align-items-center mt-2">
                                <div class="flex">
                                    <!-- <div class="flex border-0 bg-bluegray-50 border-indigo-100 border-circle py-2 pl-1 pr-2 vertical-align-middle">
                                        <span class="text-xs ml-1">30</span>
                                    </div> -->
                                    <div @click="addRemindCard = item.card_number; showRemind = true;"
                                        class="flex text-red-500 border-0 bg-red-50 border-indigo-100 border-round-xl py-1 px-2 mr-2 vertical-align-middle">
                                        <a class="text-red-500">
                                            <el-icon size="12" class="">
                                                <Bell />
                                            </el-icon>
                                        </a>
                                        <span class="text-xs ml-1">提醒</span>
                                    </div>
                                    <div v-if="item.form_id"
                                        @click="router.push({ name: 'assessment', params: { id: '1'}, query:{form_id: item.form_id}})"
                                        class="flex text-green-500 border-0 bg-green-50 border-indigo-100 border-round-xl py-1 px-2 mr-2 vertical-align-middle">
                                        <a class="text-green-500">
                                            <el-icon size="12" class="">
                                                <Files />
                                            </el-icon>
                                        </a>
                                        <span class="text-xs ml-1">评估表单</span>
                                    </div>
                                    <div v-if="[1,3].includes(searchForm.group)"
                                        @click="showMemberServices = item.card_number"
                                        class="flex text-green-500 border-0 bg-green-50 border-indigo-100 border-round-xl py-1 px-2 mr-2 vertical-align-middle">
                                        <a class="text-green-500">
                                            <el-icon size="12" class="">
                                                <MessageBox />
                                            </el-icon>
                                        </a>
                                        <span class="text-xs ml-1">服务</span>
                                    </div>
                                    <div v-if="[4].includes(searchForm.group)"
                                        @click="showNotPayfull = item.card_number"
                                        class="flex text-red-500 border-0 bg-red-50 border-indigo-100 border-round-xl py-1 px-2 mr-2 vertical-align-middle">
                                        <a class="text-red-500">
                                            <el-icon size="12" class="">
                                                <Money />
                                            </el-icon>
                                        </a>
                                        <span class="text-xs ml-1">待回款 {{ (Number(item.sum_payable) +
                                            Number(item.total_paid)).toFixed(2) }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="inline-block bg-gray-900 border-round-2xl"
                                        style="padding:2px 8px; border-bottom-right-radius: 0 !important;">
                                        <span class="text-xs text-gray-100">RFM {{item.RFM.toFixed(2)}}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.all_checkin_days" class="text-sm p-2 mt-3 bg-teal-50 border-round-xl">
                                <div v-if="item.consecutive_checkin_days?.consecutive_days" class="text-teal-500">连续签到 {{ item.consecutive_checkin_days?.consecutive_days }} 次</div>
                                <div class="text-500 text-xs"> 累计签到 {{ item.all_checkin_days }} 次，最后签到日期 {{ item.consecutive_checkin_days?.create_time }}</div>
                            </div>
                        </div>
                        <div
                            class="ml-3 mr-3 pt-1 px-3 border-round-bottom-xl border-left-1 border-right-1 border-bottom-1 border-gray-100 bg-gray-50 ">
                            <!-- 服务列表 -->
                            <div v-if="item.services" class="mt-2 mb-2 fadeinup" v-for="(s, i) in item.services" :key="i">
                                <div class="flex justify-content-between align-items-center">
                                    <div class="text-sm">{{s.model_name}}</div>
                                    <div class="text-xs text-gray-500">剩余 {{s.limits}} 次</div>
                                </div>
                                <el-progress :percentage="Number(((s.total_usage/s.total_purchase)).toFixed(2)*100)"
                                    :stroke-width="4" :show-text="false" class="mt-2" color="#968DB9" />
                            </div>
                            <!-- 待付款 -->
                            <div v-if="item.not_payfull" class="mt-2 mb-2 fadeinup border-gray-200 pb-3"
                                :class="{'border-bottom-1':i!=item.not_payfull.length-1}" v-for="(s, i) in item.not_payfull"
                                :key="i">
                                <div class="flex justify-content-between align-items-center mt-3 mb-2">
                                    <div class="text-xs">订单 ***{{s.barcode.substr(s.barcode.length-6)}}</div>
                                    <div v-if="['4','5'].includes(s.deal_paymethod)" class="text-xs text-yellow-300">待用户支付</div>
                                    <div v-else class="text-xs text-red-500">
                                        <el-tag type="primary" size="small"
                                            class="bg-dblue-50 border-dblue-200 text-dblue-500"
                                            @click="showDoPayfull = true;  doPayfull = s">支付</el-tag>
                                    </div>
                                </div>
                                <div class="text-xs text-right flex justify-content-between">
                                    <div>
                                        <div class="text-800 mb-1">消费总额</div>
                                        <div class="font-bold text-dblue-500">{{ s.payable*-1 }}</div>
                                    </div>
                                    <div>
                                        <div class="text-800 mb-1">已付金额</div>
                                        <div class="font-bold text-green-500">{{ s.paid }}</div>
                                    </div>
                                    <div>
                                        <div class="text-800 mb-1">待付金额</div>
                                        <div class="font-bold text-red-500">{{ (Number(s.payable*-1) + Number(s.paid*-1)).toFixed(2) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-3 mb-5">
                    <el-pagination layout="prev, pager, next" :total="Number(dataTotal)" :hide-on-single-page="true"
                        @change="changePage" class="w-full flex justify-content-between" />
                </div>
            </div>
        </div>
    </div>

    <vantpopup v-model:show="showRemind" round closeable position="bottom" :style="{ height: '70%' }">
        <Addremind :card-number="addRemindCard" :worker-id="workerConfig.id"
            @remind-added="(n) => { if (n === true) { showRemind = false; addRemindCard = ''; } }" />
    </vantpopup>

    <vantpopup v-model:show="showDoPayfull" round closeable position="bottom" :style="{ height: '40%' }">
        <div class="p-3 pt-4">
            <div class="pb-3">
                <div class="flex align-items-center">
                    <el-icon size="20" class="text-dblue-500">
                        <Files />
                    </el-icon>
                    <div class="font-bold text-xl ml-2">顾客支付欠款</div>
                </div>
                <div class="text-gray-400 text-sm mt-1">Customer pays outstanding balance</div>
            </div>
            <div>
                <div class="w-full flex justify-content-between mb-2">
                    <div class="">请选择支付方式及金额</div>
                    <div class="text-red-500"></div>
                </div>
                <el-input v-model="payForm.value" type="number" class="mb-3" placeholder="请输入实收金额">
                    <template #prepend>
                        <el-select v-model="payForm.paymethod" style="width: 115px">
                            <el-option v-for="(p, pi) in globalConfig.SYSTEM_PAYMETHOD" :label="pi" :value="pi" />
                        </el-select>
                    </template>
                </el-input>
                <div class="w-full flex justify-content-between align-items-center mb-3">
                    <div class="text-yellow-500 text-sm">该笔账单还需支付：￥{{ (Number(doPayfull.payable*-1) + Number(doPayfull.paid*-1)) }}
                    </div>
                    <div>

                    </div>
                </div>
                <el-input v-model="payForm.remark" type="textarea" rows="2" maxlength="60" show-word-limit placeholder="选填：请填写备注"></el-input>
            </div>
            <div>
                <el-button type="primary" size="large" class="w-full mt-3 bg-dblue-500 border-dblue-600" @click="doPay">确认付款</el-button>
            </div>
        </div>
    </vantpopup>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import axios from '@/utils/axios'
import { Search as vanSearch, DropdownMenu as vanDropdownMenu, DropdownItem as vanDropdownItem, Cell as vanCell, Popup as vantpopup} from 'vant';
import { ElMessage } from 'element-plus';
import moment from 'moment';


import { useGlobalStore } from '@/store/global'
const { workerConfig, globalConfig } = toRefs(useGlobalStore());

import Addremind from '@/views/worker/member/AddRemind.vue'
const showRemind = ref(false);
const addRemindCard = ref('');

const showDoPayfull = ref(false);
const doPayfull = ref([]);
const payForm = ref({
    value: '',
    paymethod: Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0],
    barcode:'',
    bid:workerConfig.value.bid,
    remark:''
})

import defaultAvatar from '@@/images/default_avatar.webp'
import { tr } from 'element-plus/es/locales.mjs';
const dataTotal = ref(0)
const searchForm = ref({
    keyword: '',
    group: 1,
    date_range: '', //时间范围
    spending: '', // 消费能力
    activity: '', // 互动频率
    p:0,
})
const memberLists = ref([])

const onSearch = (val: string) => {
    getLists()
}

const filterControl = ref(null);
//const filterControl = ref(null)
const groupOptions = [
    { text: '分组筛选', value: 0, disabled:true },
    { text: '我的患者', value: 1 },
    { text: '潜在成交', value: 2 },
    { text: '潜在增值', value: 3 },
    { text: '欠款患者', value: 4 },
];
const filterOptions = [
    { text: '默认排序', value: 'a' },
    { text: '时间范围', value: 'b' },
    { text: '消费能力', value: 'c' },
    { text: '互动频率', value: 'd' },
];

const notPayfullByMemberSelf = ref(null)
watch(() => searchForm.value.group, async (nval, oval) => {
    if(nval!=0){
        searchForm.value.date_range =''
        searchForm.value.spending =''
        searchForm.value.activity =''
        if(searchForm.value.group == 4){
            try{
                const {data} = await axios.get('/deal/not_payfull', {
                    status: 0,
                    worker_id:workerConfig.value.id
                })
                if(data) notPayfullByMemberSelf.value = data;
            }catch(error){

            }
        }
    }

    getLists()
})

const changePage = async (val) => {
    searchForm.value.p = val
    getLists()
}

const getLists = async () => {
    searchForm.value.services_worker_id = workerConfig.value.id
    searchForm.value.bid = workerConfig.value.bid
    await axios.get('/member/lists_link_services', searchForm.value, { toast: 0 }).then(res => {
        memberLists.value = res.data.lists
        dataTotal.value = res.data.total
    })
}

// 将当前会员列表会员卡号单独列为数组
const memberNumberLists = computed(() => {
    if (memberLists.value && memberLists.value.length > 0) {
        return memberLists.value.map(member => member.card_number);
    } else {
        return []; // 或者其他你希望的默认值
    }
});

// 获取会员是否存在视频浏览记录
const isHaveVideoRecord = ref([])
watch(memberNumberLists, async (newCardNumbers) => {
    if(newCardNumbers && newCardNumbers.length > 0){
        try{
            const {data} = await axios.get('/video/is_have_record', {card_number:newCardNumbers.join(',')}, {toast:0})
            isHaveVideoRecord.value = data || [];
        } catch (error) {
            console.error(error);
        }
    }else{
        return []
    }
}, { immediate: true });


const changeFilter = async (filter, value) => {
    if(filter!='date_range') searchForm.value.date_range = ''
    if(filter!='spending') searchForm.value.spending = ''
    if(filter!='activity') searchForm.value.activity = ''
    searchForm.value[filter] = value
    searchForm.value.group = 0
    filterControl.value.toggle();
}


const showMemberServices = ref(null)
watch(()=>showMemberServices.value, async (nval, oval)=>{
    if(nval){
        try {
            await axios.get('/services/member_services_lists', {
                bid: workerConfig.value.bid,
                services_worker_id: workerConfig.value.id,
                card_number: nval,
                model:'MedicalServices',
                usable:0
            }).then(res => {
                memberLists.value.filter((item) =>{
                    if(item.card_number == nval){
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

const showNotPayfull = ref(null)
watch(()=>showNotPayfull.value, async (nval, oval)=>{
    if(nval){
        try {
            await axios.get('/deal/not_payfull', {
                card_number: nval
            }).then(res => {
                memberLists.value.filter((item) =>{
                    if(item.card_number == nval){
                        item.not_payfull = res.data
                    }
                })
            })
            showNotPayfull.value = null
        } catch (error) {
            console.error('Error fetching not_payfull:', error);
        }
    }
})

const doPay = async () => {
    if(payForm.value.value == ''){
        ElMessage.error('请输入付款金额');
        return
    }
    payForm.value.barcode = doPayfull.value.barcode
    
    const res = await axios.post('/deal/add_paydetails', payForm.value);
    if(res.status){
        ElMessage.success(res.info);
        showDoPayfull.value = false
        doPayfull.value = []
        payForm.value = {
            value: '',
            paymethod: Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0],
            barcode:'',
            bid:workerConfig.value.bid,
            remark:''
        }
        getLists()
    }

}


onMounted(async () => {
    getLists()
})

</script>

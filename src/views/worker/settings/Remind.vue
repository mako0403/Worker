<template>
    <div class="h-full">
        <HeaderSimple :content="'消息通知'" />
        <div class="p-3">
            <el-empty v-if="!Number(dataTotal)" description="太好了，这里没有需处理的通知！"  class="mt-8"/>
            <div v-else v-for="(item, index) in remind" :key="index" class="bg-dblue-500 mb-3 border-round-xl p-3 relative overflow-hidden" style="background-image: linear-gradient(to right bottom, #6c629f, #776da5, #8177ac, #8c82b2, #968db9);">
                <div class="w-full flex justify-content-between align-items-center border-bottom-1 border-dblue-400 pb-2 z-1 relative">
                    <div class="text-md text-dblue-50 ">{{`${item.card_fullname}${item.title}`}}</div>
                    <el-tooltip class="box-item" effect="light" placement="left-start" popper-class="p-0">
                        <el-icon size="14" class="text-gray-700 bg-dblue-300 p-1 border-round-md">
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
                </div>
                <div class="pt-2 relative z-1">
                    <div class="text-xs mb-1 text-dblue-300">{{ moment.unix(item.create_time).format('YYYY-MM-DD') }}</div>
                    <div class="text-dblue-50 text-sm">{{ item.content }}</div>
                </div>
                <div class="flex justify-content-between gap-2 mt-3">
                    <a v-if="item.card_telphone" @click="addRemindCard = item.card_telphone; showRemind = true;" class="w-full z-1">
                        <el-button type="warning" class="w-full"><el-icon size="16" class="mr-1"><ChatLineSquare /></el-icon>信息提醒</el-button>
                    </a>
                    <a :href="`tel:${item.card_telphone}`" class="w-full z-1">
                        <el-button type="success" class="w-full"><el-icon size="16" class="mr-1"><Cellphone /></el-icon>拨打电话</el-button>
                    </a>
                </div>
                <svg class="absolute opacity-10 z-0" style="width: 200px; height: 150px; top:-15%; right: -15%;" xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 200 200" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs"><path fill="url(&quot;#SvgjsLinearGradient1001&quot;)" d="M165.963 134.037c-5.467 5.467-14.332 5.467-19.799 0l-24.137-24.138c-5.468-5.467-5.468-14.331 0-19.799l24.137-24.137c5.467-5.467 14.332-5.467 19.799 0L190.101 90.1c5.467 5.468 5.467 14.332 0 19.799l-24.138 24.138Zm-112.127 0c-5.467 5.467-14.332 5.467-19.8 0L9.9 109.899c-5.468-5.467-5.468-14.331 0-19.799l24.137-24.137c5.467-5.467 14.332-5.467 19.799 0L77.973 90.1c5.468 5.468 5.468 14.332 0 19.799l-24.137 24.138ZM109.9 190.1c-5.468 5.468-14.332 5.468-19.8 0l-24.137-24.137c-5.467-5.467-5.467-14.332 0-19.799l24.138-24.137c5.467-5.468 14.331-5.468 19.799 0l24.137 24.137c5.467 5.467 5.467 14.332 0 19.799L109.9 190.1Zm0-112.127c-5.468 5.468-14.332 5.468-19.8 0L65.963 53.836c-5.467-5.468-5.467-14.332 0-19.8L90.101 9.9c5.467-5.467 14.331-5.467 19.799 0l24.137 24.138c5.467 5.467 5.467 14.331 0 19.799L109.9 77.973Z"></path><defs><linearGradient gradientTransform="rotate(0 0.5 0.5)" id="SvgjsLinearGradient1001"><stop stop-opacity=" 1" stop-color="rgba(105, 234, 203)" offset="0"></stop><stop stop-opacity=" 1" stop-color="rgba(234, 204, 248)" offset="0.48"></stop><stop stop-opacity=" 1" stop-color="rgba(102, 84, 241)" offset="1"></stop></linearGradient></defs></svg>
            </div>
            <div class="mt-3 mb-5">
                <el-pagination layout="prev, pager, next" :total="Number(dataTotal)" :hide-on-single-page="true"
                    @change="changePage" class="w-full flex justify-content-between" />
            </div>
        </div>
    </div>
    <vantpopup v-model:show="showRemind" round closeable position="bottom" :style="{ height: '70%' }">
        <Addremind :card-number="addRemindCard" :worker-id="workerConfig.id"
            @remind-added="(n) => { if (n === true) { showRemind = false; addRemindCard = ''; } }" />
    </vantpopup>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue'
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';


import moment from "moment"
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

import { ElMessage } from "element-plus";
import { useGlobalStore } from '@/store/global'
const { workerConfig } = toRefs(useGlobalStore());
import { Popup as vantpopup} from 'vant';
import Addremind from '@/views/worker/member/AddRemind.vue'
const showRemind = ref(false);
const addRemindCard = ref('');

onMounted(()=>{
    getRemindLists(); 
})

const readRemindId = ref([]);
const remind = ref(null);
const dataTotal = ref(0);
const page = ref(1);
const getRemindLists = async () =>{
    try {
        const { data } = await axios.get('/worker/get_remind_lists', {worker_id:workerConfig.value.id, p:page.value}, {totast:0}); //
        dataTotal.value = data.total;
        remind.value = data.lists;
        readRemindId.value = [];
        data.lists.forEach((item)=>{
            readRemindId.value.push(item.id)
        })
        
        await axios.post('/worker/set_remind_read', {id:readRemindId.value.join(',')}, {toast:0});
    } catch (error) {
        console.error(error);
    }
}

const changePage = async (val) => {
    page.value = val
    getRemindLists()
}

</script>
<style scoped></style>

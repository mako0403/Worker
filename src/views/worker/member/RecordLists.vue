<template>
    <div class="h-full">
        <el-affix position="top" :offset="0">
            <div class="bg-white">
                <div class="py-2">
                    <van-search v-model="keyword" @search="onSearch" @clear="getLists"  placeholder="请输入卡号/电话进行查询">
                        <template #action>
                            <el-icon><Calendar /></el-icon>
                        </template>
                    </van-search>
                </div>
            </div>
        </el-affix>
        <div class="mt-2">
            <div class="p-3">
                <el-empty v-if="!recordLists || recordLists.length === 0" description="暂无未读记录">
                    <el-button size="large" @click="query.is_read = 1; getLists();">查看最近7天所有记录</el-button>
                </el-empty>
                <div v-else v-for="(item, index) in recordLists" :key="index">
                    <div class="text-sm text-center mb-2 text-700">{{ item.record_time.substring(0, 10) }} <span class="text-red-300">{{ item.record_time.substring(11, 19) }}</span></div>
                    <div  class="mb-5 p-3 border-round-lg" :class="getRandomClass()">
                        <div class="flex justify-content-between align-items-end">
                            <div class="flex gap-3 align-items-center">
                                <el-avatar :src="item.avatar" />
                                <div>
                                    <div class="text-sm flex align-items-center gap-3">{{ item.fullname }}</div>
                                    <div class="text-xs mt-1 text-500">{{ useTimeAgo(item.record_time) }}<span class="ml-2">{{ item.reply?'已回复':'未回复' }}</span></div>
                                </div>
                            </div>
                            <div class="text-right">
                                <!-- <div class="text-xs text-500 mb-1">{{ item.reply?'已回复':'未回复' }}</div> -->
                                <el-button type="default" size="small" @click="showReplyContent = true; replyId = item.id; replyContent = item.reply"><el-icon class="mr-1 text-sm"><ChatLineRound /></el-icon>回复</el-button>
                                <!-- <div class="text-xs text-500">记录时间</div>
                                <div class="text-sm mt-2 text-red-700">{{ item.record_time.substring(0, 10) }} {{ item.record_time.substring(11, 19) }}</div> -->
                            </div>
                        </div>
                        <el-divider class="mt-3 mb-0 border-gray-300"/>
                        <div v-if="item.reply!==''" class="bg-gray-100 p-3 text-green-600 text-sm border-round-bottom-lg"><span class="text-gray-600">回复内容：</span>{{ item.reply }}</div>
                        <div class="mt-3">
                            <div v-if="item.alert_messages" class="p-3 text-white bg-red-400 border-round-top-lg flex align-items-center">
                                <el-icon class="text-xl mr-1"><Warning /></el-icon>
                                {{ item.alert_messages }}
                            </div>
                            <div class="bg-white pt-4 px-3 pb-3 border-round-bottom-lg">
                                <el-row :gutter="20">
                                    <el-col :span="12" v-for="(item2, index2, keys) in item.details" :key="index2" class="flex align-items-end mb-2" :class="{ 'bg-red-500': item.details.length - 2 >= keys}">
                                        <div class="text-800 text-sm">{{ index2}}：</div>
                                        <div>{{ item2 }}</div>
                                    </el-col>
                                </el-row>
                                
                            </div>
                            
                            <div v-if="item.remark" class="my-3 flex align-items-center"><el-icon class="text-xl text-teal-600 mr-1 -rotate-0"><ChatLineSquare /></el-icon>{{ item.remark }}</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

    <van-popup v-model:show="showReplyContent" position="bottom">
        <div class="px-3 py-5">
            <van-field v-model="replyContent" rows="4" autosize type="textarea" maxlength="100" placeholder="请输入回复内容" show-word-limit class="border-1 border-gray-200 border-round-lg" />
            <div class="flex justify-content-between mt-3">
                <el-button type="default" @click="showReplyContent = false; ">取消</el-button>
                <el-button type="primary" @click="submitReply">提交</el-button>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch, computed } from 'vue';
import { useGlobal } from '@/utils/Global';
const { axios, router, route, store, ElMessage, showLoading, hideLoading, waiting } = useGlobal();
import { Search as vanSearch, DropdownMenu as vanDropdownMenu, DropdownItem as vanDropdownItem, Cell as vanCell, Popup as vanPopup, Field as vanField } from 'vant';
import {useTimeAgo} from '@/utils/common';


const keyword = ref('');
const recordLists = ref([])
const showReplyContent = ref(false);
const replyId = ref(0);
const replyContent = ref('');
const readId = ref([]);

const query = reactive({
    is_read: 0
})

const onSearch = (val: string) => {
    getLists()
}


const getLists = async () => {
    const { data } = await axios.get('/member/get_record_branch_lists', { method: 'lists', card_number: keyword.value, rule_id: route.params.rule_id, bid: store.workerConfig.bid, worker_id: store.workerConfig.id, is_read:query.is_read  }, { toast: 0 });
    if(!data) return
    recordLists.value = data
    recordLists.value.map((item) => {
        readId.value.push(item.id)
    })
    
    await axios.post('/member/record_set_read', {id:readId.value.join(',')}, {toast:0});
}

function getRandomClass(val = '50') {
    const classList = ['bg-red-'+val, 'bg-green-'+val, 'bg-blue-'+val, 'bg-pink-'+val, 'bg-gray-'+val, 'bg-yellow-'+val]
    return classList[Math.floor(Math.random() * classList.length)]
}

watch(() => showReplyContent.value, (val) => {
    if (!val) {
        replyId.value = 0;
        replyContent.value = '';
    }
})

const submitReply = async () => {
    try {
        const res = await axios.post('/member/record_reply', {id:replyId.value, reply:replyContent.value}, {toast:1})
        if(res.status){
            ElMessage.success('回复成功')
            showReplyContent.value = false;
            recordLists.value.map((item) => {
                if(item.id == replyId.value){
                    item.reply = replyContent.value
                }
            })
        }
    } catch (error) {
        ElMessage.error(error.message)
    }
}


onMounted(async () => {
    if (route.params.rule_id) {
        showLoading()
        await waiting(500);
        getLists()
        hideLoading()
    }
})

</script>

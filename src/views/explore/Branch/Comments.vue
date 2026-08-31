<template>
    <el-container class="layout h-full">
        <el-header class="mb-3">
            <div class="mt-3 mb-2 text-lg font-bold text-dblue-600 flex align-items-end">
                <el-icon class="mr-2" size="28">
                    <ChatDotRound />
                </el-icon>{{ branchInfo.id ? branchInfo.name : '' }}患者评论
            </div>
            <div class="text-sm text-600">Helpful reviews from patients about the service</div>
        </el-header>

        <el-main>
            <div class="">
                <van-list v-model:loading="loading" :finished="finished" finished-text="-- 没有更多了 --" @load="onLoad"
                    class="mt-2">
                    <div v-for="item in commentLists" :key="item.id" class="w-full flex gap-3 mb-3">
                        <div class="bg-green-50 border-circle pt-1" style="width: 13%;">
                            <img :src="item.avatar" class="w-full border-circle" />
                        </div>
                        <div class="flex-1 border-bottom-1 border-gray-200 pb-3">
                            <div class="flex justify-content-between align-items-center">
                                <div>
                                    <div class="text-sm font-bold text-dblue-900">{{ item.nickname }}</div>
                                </div>
                                <div>
                                    <el-rate v-model="item.rating" allow-half disabled text-color="#ff9900" clearable/>
                                </div>
                            </div>
                            <div class="text-xs mt-1 text-500">{{ moment.unix(item.create_time).format('YYYY-MM-DD HH:mm') }}</div>
                            <div>
                                <div class="text-sm mt-2 line-height-3 text-800" style="">{{ item.comment }}</div>
                                <div class="mt-2" v-if="item.comparison_image">
                                    <img :src="loadWebpImage(item.comparison_image)" style="width: 100%;"
                                        @click="showImage(loadWebpImage(item.comparison_image))">
                                </div>
                                <div v-if="item.tags.length" class="text-sm mt-3 text-dblue-600">
                                    <div v-for="tag in item.tags" :key="tag" class="inline-block mr-2">
                                        <el-tag type="success"
                                            style="border-top-right-radius: 15px; border-bottom-left-radius: 15px;">{{
                                            tag }}</el-tag>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>

        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useGlobal } from '@/utils/Global';
const { route, router, axios, store, ElMessage } = useGlobal();
import { List as vanList, showImagePreview } from 'vant';
import moment from 'moment';
import { useHead } from '@vueuse/head';

const bid = ref(0)
const workerId = ref(0)
const branchInfo = ref([])
const workerLists = ref([])
const commentLists = ref([])

const page = ref(0);
const loading = ref(false);
const finished = ref(false);



const loadWebpImage = (path) => {
    // 只要 imageFileName.value 改变，这里就会重新计算
    // 如果 imageFileName 为空，则返回空字符串，不显示图片
    if (path) {
        return import.meta.env.VITE_BASE_API_RUL + '/api/common/webp_image?watermark=1&name=' + path;
    } else {
        return '';
    }
};

const onLoad = async () => {
    try {
        page.value = page.value + 1;
        const { data } = await axios.get('/comments/get_lists', { bid: (bid.value || 0), p: page.value })
        data.details.forEach(item => {
            item.rating = Math.round(item.rating)
        })
        commentLists.value.push(...data.details)
        // 检查数组长度是否超过 100
        if (commentLists.value.length > 100) {
            const elementsToRemove = commentLists.value.length - 100;
            commentLists.value.splice(0, elementsToRemove); // 从索引 0 开始删除超出部分的元素
        }

        loading.value = false;

        if (commentLists.value.length >= data.total) {
            finished.value = true;
        }
    } catch (err) {
        loading.value = false;
        ElMessage.error('数据加载失败')
    }
};


onMounted(async () => {

    bid.value = route.params.bid || 0;
    // workerId.value = route.params.services_worker_id || 0;
    // console.log(222, bid.value, workerId.value);
    if (bid.value) {
        try {
            const { data } = await axios.get('/company/branch', { id: bid.value })
            branchInfo.value = data
            useHead({
                title: branchInfo.value.id ?  '患者评论 - ' + branchInfo.value.name : '患者评论',
            })
        } catch (error) {
            ElMessage.error('获取门店信息失败')
        }
    }

    // try {
    //     const { data } = await axios.get('/comments/get_lists', { bid: (bid.value || 0), worker_id: (workerId.value || 0), p: page.value })
    //     commentLists.value = data.details;
    //     console.log(11111111, data)
    // } catch (error) {
    //     ElMessage.error('获取员工列表失败')
    // }
});


watch(() => workerLists.value.length, async (newLength) => {
    // if(newLength > 0){
    //     for(const worker of workerLists.value){
    //         worker.statistics = {};
    //         try{
    //             const { data } = await axios.get('/services/get_worker_service_statistics', { worker_id: worker.id }, { toast: 0 })
    //             worker.statistics = data;
    //         }catch(e){
    //             console.log(e)
    //         }
    //         await new Promise(resolve => setTimeout(resolve, 500));
    //     }
    // }
}, { immediate: false })


const showImage = (url) => {
    showImagePreview({
        images: [url],
        showIndex: false
    })
}

</script>

<style scoped>
.layout {
    background-color: #fafafa;
}

.store-info {
    margin-bottom: 20px;
}

.employee-card,
.review-card {
    margin-bottom: 20px;
}
</style>
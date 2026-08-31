<template>
    <el-container class="layout">
        <el-header class="mb-3">
            <div class="mt-3 mb-2 text-lg font-bold text-dblue-600 flex align-items-end">
                <el-icon class="mr-2" size="28"><Avatar /></el-icon>{{ branchInfo.id?branchInfo.name:''}}康复师团队
            </div>
            <div class="text-sm text-dblue-300">Our excellent team of rehabilitation therapists</div>
        </el-header>

        <el-main>
            <div>
                <div v-if="workerLists.length" v-for="(item, index) in workerLists" :key="index" class="flex gap-3 p-3 mb-3 bg-white shadow-1">
                    <div class="text-center" style="width: 100px;" @click="goToStoreComments(item.bid)">
                        <div class="text-sm font-bold">{{ item.fullname }}</div>
                        <div class="text-xs mt-1 text-500">{{ item.job_title + ' ' + item.place }}</div>
                        <div class="mt-2 mb-2 bg-green-50 border-circle pt-1">
                            <img :src="item.headimg" class="w-full border-circle" />
                        </div>
                    </div>
                    <div class="flex-1" v-if="item.statistics">
                        <div class="text-sm font-bold text-800">累计服务患者<span class="text-blue-500 font-bold ml-1 mr-1">{{ item?.statistics?.count_member}}</span>人</div>
                        <div class="text-xs text-800 mt-2">累计获得<span class="text-blue-500 font-bold ml-1 mr-1">{{ item?.statistics?.count_comments?.total || 0 }}</span>次评价</div>
                        <div class="mt-3">
                            <div class="flex align-items-center">
                                <div class="text-xs mr-2">服务体验:</div>
                                <el-progress :percentage="Number(item?.statistics?.count_comments?.star1 || 0) * 20" :show-text="false" class="flex-1">
                                </el-progress>
                            </div>
                            <div class="flex align-items-center mt-2">
                                <div class="text-xs mr-2">专业水平:</div>
                                <el-progress :percentage="Number(item?.statistics?.count_comments?.star2 || 0) * 20" status="success" :show-text="false" class="flex-1" />
                            </div>
                            <div class="flex align-items-center mt-2">
                                <div class="text-xs mr-2">治疗效果:</div>
                                <el-progress :percentage="Number(item?.statistics?.count_comments?.star3 || 0) * 20" status="warning" :show-text="false" class="flex-1" />
                            </div>
                        </div>
                        <div class="flex justify-content-between text-xs text-800 mt-2">
                            <div><span class="text-green-500 font-bold mr-1">{{ item?.statistics?.count_services || 0 }}</span>次治疗量</div>
                            <div>综合评分<span class="text-green-500 font-bold ml-1 mr-1">{{ Math.round(item?.statistics?.count_comments?.rating) || 0 }}</span>分</div>
                        </div>
                    </div>
                    <div class="flex-1" v-else>
                        <el-skeleton :rows="4" animated />
                    </div>
                </div>
                <div v-else>
                    <div class="flex gap-3 p-3 mb-3 bg-white shadow-1" v-for="i in 3">
                        <div>
                            <el-skeleton style="--el-skeleton-circle-size: 100px">
                                <template #template>
                                <el-skeleton-item variant="circle" />
                                </template>
                            </el-skeleton>
                        </div>
                        <div class="flex-1">
                            <el-skeleton :rows="3" animated />
                        </div>
                    </div>
                </div>
            </div>

        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useGlobal } from '@/utils/Global';
import { ElMessage } from 'element-plus';
const { route, router, axios, store } = useGlobal();




const branchInfo = ref([])
const workerLists = ref([])
onMounted(async () => {
    const bid = route.params.bid;
    if (bid) {
        try {
            const { data } = await axios.get('/company/branch', { id: bid })
            branchInfo.value = data
        } catch (error) {
            ElMessage.error('获取门店信息失败')
        }
    }

    try {
        const { data } = await axios.get('/worker/lists', { online: 1, bid: (bid || 0) })
        workerLists.value = data
    } catch (error) {
        ElMessage.error('获取员工列表失败')
    }
});


watch(() => workerLists.value.length, async (newLength) => {
    if(newLength > 0){
        for(const worker of workerLists.value){
            worker.statistics = {};
            try{
                const { data } = await axios.get('/services/get_worker_service_statistics', { worker_id: worker.id }, { toast: 0 })
                worker.statistics = data;
            }catch(e){
                console.log(e)
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}, { immediate: false })

// 跳转到评论页面
const goToStoreComments = (bid: number) => {
    router.push({ name: 'branch_comments', params: { bid: bid } });
};
</script>

<style scoped>
.layout{
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
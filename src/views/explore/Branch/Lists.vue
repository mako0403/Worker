<template>
    <el-container class="layout">
        <el-header>
            <div class="mt-3 mb-2 text-lg font-bold text-dblue-600 flex align-items-end">
                <el-icon class="mr-2" size="28"><OfficeBuilding /></el-icon>科室导航
            </div>
            <div class="text-sm text-dblue-300">List display of all departments and map navigation</div>
        </el-header>

        <el-main>
            <van-list v-model:loading="loading" :finished="finished" finished-text="-- 没有更多了 --" @load="onLoad" class="mt-2">
                <el-card v-for="store in stores" :key="store.id" class="store-card border-round-md">
                    <div class="flex justify-content-between align-items-center"
                    @click="goToStoreDetail(store.id)">
                        <div>
                            <div class="text-md font-bold">{{ store.name }}{{ store.community }}</div>
                            <div class="mt-2 text-sm flex align-items-center text-green-400">
                                <el-icon><MapLocation /></el-icon>
                                <div class="ml-1">{{ store.city }}</div>
                            </div>
                        </div>
                        <div style="width: 30%;">
                            <img :src="store.headimg" class="w-full border-round-xs">
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="flex align-items-start justify-content-between">
                            <div>
                                <div class="text-xs text-500">地址导航：</div>
                                <!-- <a :href="'tel:' + store.telphone"  class="flex text-sm align-items-center font-bold mt-1 text-800">
                                    <div>{{ store.contact }}</div>
                                    <div class="ml-2 text-green-500"><el-icon><Phone /></el-icon></div>
                                </a> -->
                                <div class="text-xs text-700 mt-1 flex align-items-start">
                                    <div class="">{{ store.city }}{{ store.area }}{{ store.address }}</div>
                                </div>
                            </div>
                            <div class="text-right flex justify-content-end" style="width: 25%;">
                                <a :href="'tel:' + store.telphone" class="text-500 opacity-80">
                                    <svg class="icon" aria-hidden="true" style="width:22px; height:22px; ">
                                        <use xlink:href="#icon-canyuhuati"></use>
                                    </svg>
                                    <div class="text-xs">电话</div>
                                </a>
                                <a :href="store.navigate" target="_blank" class="text-500 opacity-80 ml-3">
                                    <svg class="icon" aria-hidden="true" style="width:22px; height:22px; ">
                                        <use xlink:href="#icon-ditu"></use>
                                    </svg>
                                    <div class="text-xs">导航</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </el-card>
            </van-list>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject, watch, readonly } from "vue";
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route, isLoadedPage } = useGlobal();

import { List as vanList } from 'vant';
import { ElMessage } from "element-plus";


const stores = ref([]);
const page = ref(0);
const loading = ref(false);
const finished = ref(false);
const onLoad = async () => {
    try {
        page.value = page.value + 1;
        const { data } = await axios.get('/company/branch_lists', { online: 1, p: page.value }, { toast: 0 })

        stores.value.push(...data.lists)
        loading.value = false;

        if (stores.value.length >= data.total) {
            finished.value = true;
        }
    } catch (err) {
        loading.value = false;
        ElMessage.error('数据加载失败')
    }
};


onMounted(async () => {

})


// 跳转到门店详情页
const goToStoreDetail = (storeId: number) => {
    router.push({ name: 'branch_details', params: { bid: storeId } });
};
</script>

<style scoped>
.layout {
    background-color: #fefefe;
}

.store-card {
    margin-bottom: 20px;
    cursor: pointer;
}
</style>
<template>
    <div class="">
        <el-row>
            <el-col :span="24">
                <div class="text-center">
                    <el-progress type="dashboard" :width="Number(165)" :stroke-width="Number(5)"
                        :percentage="statistics.usage_number || 1" status="success">
                        <template #default="{ percentage }">
                            <el-avatar shape="circle" :size="150">
                                <img :src="uploadsPath + workerConfig.headimg" />
                            </el-avatar>
                        </template>
                    </el-progress>

                    <!-- <div class="bg-dblue-50 border-circle overflow-hidden w-5 m-auto p-2">
                        <img :src="uploadsPath + workerConfig.headimg" width="100%" class="-mb-2"/>
                    </div> -->
                    <div class="mt-2 text-3xl font-medium">
                        <span class="">{{ workerConfig.fullname }}</span>
                    </div>
                    <div class="mt-2 text-base text-400">
                        <span>{{ workerConfig.job_title }}</span>
                        <span>{{ workerConfig.place }}</span>
                    </div>
                    <div class="mt-2 flex justify-content-center align-items-center">
                        <el-rate v-model="statistics.rating" disabled show-score text-color="#ff9900"
                            score-template="{value} points" />
                        <!-- <el-rate v-model="statistics.rating" size="large" disabled text-color="#ff9900" />
                        <span class="text-sm" style="color:#ff9900">{{ statistics.rating }} Ratings</span> -->
                    </div>
                </div>
                <div class="mt-4">
                    <el-row class="text-center" :gutter="0">
                        <el-col :span="8">
                            <div class="statistic-card">
                                <RouterLink to="/worker/services/sales_records">
                                    <el-statistic :value="Number(statistics.current_month_sales_count)"
                                        value-style="font-weight: 500;">
                                        <template #title>
                                            <div class="text-xs" style="display: inline-flex; align-items: center">
                                                本月客单量
                                            </div>
                                        </template>
                                        {{  Number(statistics.current_month_sales_count) }}
                                    </el-statistic>
                                </RouterLink>
                                <div class="statistic-footer mt-2">
                                    <div class="footer-item text-xs">
                                        <span class="text-400">收费总额</span>
                                        <span
                                            class="text-red-400">
                                            <span class="ml-1">￥{{statistics.current_month_sales_amount}}</span>
                                            <!-- <el-icon v-if="statistics.sales_count_rate>0">
                                                <CaretTop />
                                            </el-icon>
                                            <el-icon v-if="statistics.sales_count_rate<0">
                                                <CaretBottom />
                                            </el-icon> -->
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="statistic-card  border-x-1 border-200">
                                <RouterLink to="/worker/services/usage_records">
                                    <el-statistic :value="Number(statistics.usage_number)"
                                        value-style="font-weight: 500;">
                                        <template #title>
                                            <div style="display: inline-flex; align-items: center">
                                                本月治疗量
                                            </div>
                                        </template>
                                    </el-statistic>
                                </RouterLink>
                                <div class="statistic-footer mt-2">
                                    <div class="footer-item text-xs">
                                        <span class="text-400">治疗量绩效</span>
                                        <span class="text-red-400">
                                            <span class="ml-1">￥{{statistics.usage_amount}}</span>
                                            <!-- <el-icon v-if="statistics.usage_count_rate>0">
                                                <CaretTop />
                                            </el-icon>
                                            <el-icon v-if="statistics.usage_count_rate<0">
                                                <CaretBottom />
                                            </el-icon> -->
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="statistic-card">
                                <el-statistic :value="Number((Number(statistics.sales_bonus) + Number(statistics.sales_award)).toFixed(2)) || 0"
                                    value-style="font-weight: 500;">
                                    <template #title>
                                        <div style="display: inline-flex; align-items: center">
                                            业绩绩效
                                        </div>
                                    </template>
                                </el-statistic>
                                <div class="statistic-footer mt-2">
                                    <div class="footer-item text-xs">
                                        <span class="text-400">绩效汇总</span>
                                        <span class="text-red-400">
                                            <span class="ml-1">￥{{(Number(statistics.sales_bonus) + Number(statistics.sales_award) + Number(statistics.usage_amount)).toFixed(2)}}</span>
                                            <!-- <el-icon v-if="statistics.sales_amount_rate>0">
                                                <CaretTop />
                                            </el-icon>
                                            <el-icon v-if="statistics.sales_amount_rate<0">
                                                <CaretBottom />
                                            </el-icon> -->
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch, watchEffect } from "vue";
import axios from "@/utils/axios"
import { useTransition } from '@vueuse/core'
import { useGlobalStore } from '@/store/global'
const { uploadsPath, workerConfig } = toRefs(useGlobalStore());

const performance = ref(0)
const outputPerformance = useTransition(performance, {
    duration: 1500,
})
performance.value = 6420


//const avgRating = ref(4.5);

const statistics = ref([])
onMounted(async () => {
    await axios.get('/services/get_all_workers_statistics', {worker_id:workerConfig.value.id, model:'MedicalServices'}).then(res=>{
        statistics.value = res.data[0].statistics
    })

});


</script>
<style scoped></style>

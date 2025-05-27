<template>
    <div class="h-full">
        <vantcalendar :poppable="false" type="multiple" color="#574e7e" :show-confirm="true" confirm-text="确认设置"
            confirm-disabled-text="请选择日期" :formatter="offdayFormatter" :default-date="hasOffday" @confirm="setOffday"
            :style="{ height: '100%' }" :round="false" :show-close="false">
            <template #title>
                <div class="p-3">
                    <el-page-header @back="goBack">
                        <template #content>
                            <span class="text-large font-600 mr-3"> 设置你的休息日期 </span>
                        </template>
                    </el-page-header>
                </div>
            </template>
        </vantcalendar>
    </div>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue'
import moment from "moment"
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
const router = useRouter()

import { ElMessage } from "element-plus";
import { Calendar as vantcalendar } from 'vant';
import { useGlobalStore } from '@/store/global'
const { workerConfig } = toRefs(useGlobalStore());

const offdayDrawer = ref(true)

const goBack = () => {
    router.back()
}

// 已被预约日期
const hasAppointmentDate = ref([])

onMounted(async () => {
    // 加载已有预约的日期
    await axios.get('/services/days_has_appointment', { 'bid': workerConfig.value.bid, 'services_worker_id': workerConfig.value.id }, { toast: 0 }).then(res => {
        hasAppointmentDate.value = res.data || []
    })
})

const offdayFormatter = (day: any) => {
    hasAppointmentDate.value.forEach((item) => {
        if (moment(day.date).format('YYYY/MM/DD') == item) {
            day.type = 'disabled'
            //day.topInfo = '休息日'
            day.bottomInfo = '有预约'
            day.className = 'text-bluegray-300'
        }
    })
    return day
}



// 更新休息日 
const setOffday = (dates: any) => {
    const set_date: any = [];
    dates.forEach((item: Date) => {
        set_date.push(moment(item).format('YYYY/MM/DD'))
    })
    axios.post('/worker/set_offday', { id: workerConfig.value.id, offday: set_date.join(',') }).then((res) => {
        if (res.status) {
            useGlobalStore().setWorkerConfig({ ...workerConfig.value, offday: set_date.join(',') });
            ElMessage({ message: res.info, type: 'success' })
            goBack()
        }
    });
}

// 已设置休息日
const hasOffday = ref([])
watch(() => workerConfig.value.offday, (nval, oval) => {
    if (nval) {
        hasOffday.value = nval.split(',').map((dateString: any) => {
            return moment(dateString, 'YYYY/MM/DD').toDate(); // 解析日期格式
        }).filter((date: any) => {
            return moment(date).isSameOrAfter(moment().startOf('day'));
        })
    } else {
        hasOffday.value = [];
    }
}, { immediate: true })

</script>
<style scoped></style>

<template>
    <div class="h-full">
        <div class="p-3">
            <div class="flex justify-content-between align-items-center">
                <div>
                    <el-icon>
                        <Search />
                    </el-icon>
                </div>
                <div class="flex align-items-center gap-3">
                    <div class="text-xs text-dblue-600">你好 {{ globalStore.memberInfo.fullname }}</div>
                    <el-avatar :src="globalStore.memberInfo.avatar" class="bg-pink-50 border-1 border-pink-50" />
                </div>
            </div>
        </div>
        <div class="px-3">
            <div class="text-sm font-think text-600">开始你</div>
            <div class="text-lg text-900">今天的锻炼计划吧！</div>
        </div>
        <div v-if="myPlanLists" class="mt-3">
            <div class="p-1">
                <!-- <div class="px-2 pt-3">运动康复</div> -->
                <div class="p-3 mt-2 bg-white border-round-lg">
                    <div v-for="(item, index) in myPlanLists" :key="index" class="mb-3">
                        <RouterLink :to="{ name: 'member_workout_plan_details', params: { i: index } }"
                            v-if="item.related_model == 'Video'"
                            class="flex justify-content-between align-items-center gap-3 bg-white border-round-lg">
                            <div>
                                <img :src="item.cover" width="90px" height="68px" class="border-round-lg">
                            </div>
                            <div class="flex-1">
                                <div class="text-sm text-dblue-900 font-bold ellipsis ellipsis-line-1">{{ item.title }}
                                </div>
                                <div class="text-xs text-dblue-300 mt-1">
                                    <van-text-ellipsis :content="item.description" rows="2" />
                                </div>
                            </div>
                            <div class="flex align-items-center">
                                <el-icon class="text-dblue-500">
                                    <ArrowRightBold />
                                </el-icon>
                            </div>
                        </RouterLink>
                        <van-divider v-if="index != myPlanLists.length - 1" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <van-popup v-model:show="showVideo" position="right" @closed="closePlanPopup"
        :style="{ height: '100%', padding: '0px' }">
        内容
    </van-popup>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch, computed } from 'vue';
import axios from '@/utils/axios'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
console.log(111111, globalStore)
import { ElMessage } from 'element-plus'
import { TextEllipsis as vanTextEllipsis, Popup as vanPopup, Divider as vanDivider } from 'vant'



const myPlanLists = ref(null)
const showPlan = ref(false)
const chosePlan = ref(null)
const showVideo = ref(false)




const closePlanPopup = () => {
    //showPlan.value = false
}

onBeforeMount(async () => {

})


onMounted(async () => {
    try {
        const additional = await axios.get('/services/member_services_additional', { card_number: globalStore.memberInfo.card_number }, { totast: 0 })
        if (additional.status) {
            myPlanLists.value = additional.data;
        }
    } catch (e) {
        ElMessage.error(error);
    }
})


</script>

<template>
    <div class="h-full">
        <el-container class="h-full">
            <!-- <el-aside class="hidden-sm-and-down" width="60px">
                <Sidebar />
            </el-aside> -->
            <el-container class="h-full">
                <el-header v-show="route.meta.showHeader" class="p-0">
                    <Header />
                </el-header>
                <el-main class="h-full p-0">
                    <RouterView />
                    
                </el-main>
                <Tabbar v-show="route.meta.showTabbar && userManager != 'officeManager'" @chose-sheet="choseSheet" />
                <ManagerTabbar v-show="route.meta.showTabbar && userManager == 'officeManager'" />
            </el-container>
        </el-container>

        
        <van-floating-bubble v-if="route.fullPath!='/worker/assistant/aichat'" v-model:offset="floatingOffset" axis="xy" icon="chat" magnetic="x" @offset-change="onOffsetChange" @click="router.push('/worker/assistant/aichat')"/>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import Header from '@/components/layout/header/Header.vue'
import Tabbar from "@/components/layout/menu/Tabbar.vue";
import ManagerTabbar from "@/components/layout/menu/ManagerTabbar.vue";
// import Sidebar from '@/components/layout/sidebar/Sidebar.vue'
const router = useRouter()
const route = useRoute()


import { useGlobalStore } from '@/store/global';
const { tabbarName, userManager, workerConfig, branchConfig, setUserManager } = toRefs(useGlobalStore());

import { FloatingBubble as vanFloatingBubble } from 'vant'
const floatingOffset = ref({ y: window.innerHeight-120 });

const officeManager = ref(false)
const branchManager = ref(false)


if (workerConfig.value.is_manager == 1) {
    if (branchConfig.value.type == 0) {
        // 总公司管理员
        useGlobalStore().setUserManager('officeManager')
        //officeManager.value = true;
    } else {
        // 门店管理员
        useGlobalStore().setUserManager('branchManager')
        //branchManager.value = true;
    }
}





onBeforeMount(async () => {
    if (userManager.value == 'officeManager' && !route.fullPath.includes('/manager/')) {
        router.push({ path: '/worker/manager/overview' });
    }
})

onMounted(async () => {

})

watch(() => tabbarName.value, () => {
    console.log(tabbarName.value)
})

let choseSheet = (item: any) => {
    switch (item.name) {
        case '服务项目收费':
            router.push({ path: '/worker/medical/sales' })
            break;
        case '运动康复收费':
            router.push({ path: '/worker/video/sales' })
            break;
        case '新建患者档案':
            router.push({ path: '/worker/member/add' })
            break;
        case '产后盆底康复评估':
            router.push({ name: 'assessment', params: { id: '1' } })
            break;
        default:
            break;
    }
}

const onOffsetChange = (offset) => {
    //showToast(`x: ${offset.x.toFixed(0)}, y: ${offset.y.toFixed(0)}`);
};

</script>

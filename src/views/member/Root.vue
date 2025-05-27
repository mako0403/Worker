<template>
    <div class="h-full member-home-bg relative" style="z-index: 1;">
        <el-container class="h-full">
            <!-- <el-aside class="hidden-sm-and-down" width="60px">
                <Sidebar />
            </el-aside> -->
            <el-container class="h-full">
                <el-header v-if="route.meta.showHeader" class="p-0">
                    <Header />
                </el-header>
                <el-main class="h-full p-0">
                    <RouterView />
                </el-main>
                <MemberTabbar v-if="route.meta.showTabbar" @chose-sheet="choseSheet"/>
            </el-container>
        </el-container>
        <!-- <img src="@@/images/xh.png" class="absolute opacity-20" style="width: 100%; top:-60px; right: -90px; transform:rotate(-30deg); z-index: -0;"> -->
    </div>
    
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch, computed } from 'vue';
import axios from '@/utils/axios'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import Header from '@/components/layout/header/MemberHeader.vue'
import MemberTabbar from "@/components/layout/menu/MemberTabbar.vue";

 

import { useGlobalStore } from '@/store/global';
const { tabbarName, branchConfig } = toRefs(useGlobalStore());



onBeforeMount(async () => {

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
            router.push({ path: '/worker/member/add'})
        break;
        case '产后盆底康复评估':
            router.push({ name: 'assessment', params: { id: '1' }})
        break;
        default:
            break;
    }
}

</script>
<style scoped>
    .member-home-bg{
        background: linear-gradient(rgba(230, 230, 250, 0.2),rgba(255, 255, 255, 0));
    }
</style>
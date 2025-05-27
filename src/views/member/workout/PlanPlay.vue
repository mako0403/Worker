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
                <MemberTabbar v-show="route.meta.showTabbar" @chose-sheet="choseSheet"/>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import Header from '@/components/layout/header/Header.vue'
import MemberTabbar from "@/components/layout/menu/MemberTabbar.vue";

 

import { useGlobalStore } from '@/store/global';
const { tabbarName, branchConfig } = toRefs(useGlobalStore());


const router = useRouter()
const route = useRoute()


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

<template>
    <div class="h-full" :style="pageStyle">
        <el-container class="h-full">
            <!-- <el-aside class="hidden-sm-and-down" width="60px">
                <Sidebar />
            </el-aside> -->
            <el-container class="h-full">
                <!-- <el-header v-if="route.meta.showHeader" class="p-0">
                    <Header />
                </el-header> -->
                <el-main class="h-full p-0">
                    <RouterView />
                </el-main>
                <!-- <MemberTabbar v-if="route.meta.showTabbar" @chose-sheet="choseSheet"/> -->
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeUnmount, onMounted, watch, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import Header from '@/components/layout/header/Header.vue'
import MemberTabbar from "@/components/layout/menu/MemberTabbar.vue";



import { useGlobalStore } from '@/store/global';
const { tabbarName, branchConfig } = toRefs(useGlobalStore());


const router = useRouter()
const route = useRoute()

const isFocused = inject('isFocused');

const initialHeight = ref(window.innerHeight);
const pageStyle = ref({});


const handleResize = () => {
    const currentHeight = window.innerHeight;

    if (isFocused.value && currentHeight < initialHeight.value) {
        // 键盘弹出，页面上移
        pageStyle.value = {
            transform: 'translateY(-' + (initialHeight.value - currentHeight) + 'px)', // 这里可以根据需求调整上移的高度
        };
    } else if(!isFocused.value || currentHeight >= initialHeight.value) {
        // 键盘隐藏，恢复页面
        pageStyle.value = {
            transform: 'translateY(0)',
        };
    }
};


onMounted(async () => {
    window.addEventListener('resize', handleResize);
})

onBeforeUnmount(async () => {
    window.removeEventListener('resize', handleResize);
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

</script>

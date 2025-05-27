<template>
    <el-affix position="bottom" :offset="0" class="w-full" style="height: 56px !important;">
        <div class="w-full text-center border-round-top-2xl border-top-1 border-gray-100 bg-white shadow-1" style="height: 56px !important;">
            <div class="h-full flex justify-content-between">
                <div class="w-full">
                    <RouterLink to="/worker/manager/overview" class="mt-2 mb-2 text-500 block" :class="{ 'text-yellow-600 font-bold': tabbarName == 'manager_overview' }"
                        @click="updateTabbarName('manager_overview')">
                        <svg class="icon" aria-hidden="true" style="width:18px; height:18px;">
                            <use xlink:href="#icon-jifen"></use>
                        </svg>
                        <div class="text-xs">总览</div>
                    </RouterLink>
                </div>
                <div class="w-full">
                    <RouterLink to="/worker/manager/branch" class="mt-2 mb-2 text-500 block" :class="{ 'text-yellow-600 font-bold': tabbarName == 'manager_branch' }"
                        @click="updateTabbarName('manager_branch')">
                        <svg class="icon" aria-hidden="true" style="width:18px; height:18px;">
                            <use xlink:href="#icon-dianpu"></use>
                        </svg>
                        <div class="text-xs">门店</div>
                    </RouterLink>
                </div>
                <div class="w-full">
                    <RouterLink to="/worker/manager/worker" class="mt-2 mb-2 text-500 block" :class="{ 'text-yellow-600 font-bold': tabbarName == 'manager_worker' }"
                        @click="updateTabbarName('manager_worker')">
                        <svg class="icon" aria-hidden="true" style="width:18px; height:18px;">
                            <use xlink:href="#icon-xunzhang"></use>
                        </svg>
                        <div class="text-xs">员工</div>
                    </RouterLink>
                </div>
                <div class="w-full">
                    <RouterLink to="/worker/manager/member" class="mt-2 mb-2 text-500 block" :class="{ 'text-yellow-600 font-bold': tabbarName == 'manager_member' }"
                        @click="updateTabbarName('manager_member')">
                        <svg class="icon" aria-hidden="true" style="width:18px; height:18px;">
                            <use xlink:href="#icon-huiyuan"></use>
                        </svg>
                        <div class="text-xs">患者</div>
                    </RouterLink>
                </div>
                <div class="w-full">
                    <RouterLink to="/worker/manager/services" class="mt-2 mb-2 text-500 block" :class="{ 'text-yellow-600 font-bold': tabbarName == 'manager_services' }"
                        @click="updateTabbarName('manager_services')">
                        <svg class="icon" aria-hidden="true" style="width:18px; height:18px;">
                            <use xlink:href="#icon-dianzan"></use>
                        </svg>
                        <div class="text-xs">服务</div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </el-affix>
</template>
<script setup lang="ts">
defineProps(['choseSheet'])
import { ref, toRefs } from 'vue'
import { RouterLink } from 'vue-router';
import { useGlobalStore } from '@/store/global'
const { tabbarName, updateTabbarName } = toRefs(useGlobalStore());
import { ActionSheet } from 'vant';


import logoIcon from '@@/images/logo_icon.png';

const showSheet = ref(false);
const actions = [
    { name: '服务项目收费',icon: 'todo-list-o', className:'text-md' },
    { name: '新建患者档案', icon: 'friends-o', className:'text-md' },
    { name: '产后盆底康复评估', icon: 'completed-o', className:'text-md' },
    // { name: '运动康复收费', icon: 'flag-o', className:'text-md', subname:'暂未上线' },
];



</script>
<style scoped></style>

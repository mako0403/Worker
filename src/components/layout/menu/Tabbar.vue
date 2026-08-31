<template>
    <div class="w-full text-center border-round-top-2xl border-top-1 border-gray-100 bg-white shadow-1" style="height: 56px !important;">
        <div class="h-full flex justify-content-between align-items-center px-3">
            <div class="w-full ">
                <RouterLink to="/worker" class="h-full text-500 block" :class="{ 'text-dblue-700 font-bold': tabbarName == 'appointment' }"
                    @click="updateTabbarName('appointment')">
                    <el-icon size="16px">
                        <Files />
                    </el-icon>
                    <div class="text-xs">预约</div>
                </RouterLink>
            </div>
            <div class="w-full ">
                <RouterLink to="/worker/member/lists" class=" h-full text-500 block" :class="{ 'text-dblue-700 font-bold': tabbarName == 'member' }"
                    @click="updateTabbarName('member')">
                    <el-icon size="16px">
                        <User  />
                    </el-icon>
                    <div class="text-xs">患者</div>
                </RouterLink>
            </div>
            <div class="w-full relative">
                <div class="border-circle bg-dblue-500" style="width: 44px; min-height: 44px; margin-left: auto; margin-right: auto;" @click="showSheet=true">
                    <img :src="logoIcon" style="width:38px; height: 38px; margin-top: 3px;" />
                </div>
                <ActionSheet v-model:show="showSheet" :actions="actions" cancel-text="取消" description="请选择操作项目" close-on-click-action @select="$emit('choseSheet', $event)"/>
            </div>
            <div class="w-full ">
                <RouterLink to="/worker/member/interaction" class="text-500 block  h-full" :class="{ 'text-dblue-700 font-bold': tabbarName == 'learn' }"
                    @click="updateTabbarName('learn')">
                    <el-icon size="16px">
                        <ChatLineRound />
                    </el-icon>
                    <div class="text-xs">互动</div>
                </RouterLink>
            </div>
            <div class="w-full ">
                <RouterLink :to="userManager=='branchManager'?'/worker/manager/branch?bid='+workerConfig.bid:''" class="text-500 block h-full" :class="{ 'text-dblue-700 font-bold': tabbarName == 'manage' }"
                    @click="updateTabbarName('manage')">
                    <el-icon size="16px">
                        <SetUp  />
                    </el-icon>
                    <div class="text-xs">管理</div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps(['choseSheet'])
import { ref, toRefs } from 'vue'
import { RouterLink } from 'vue-router';
import { useGlobalStore } from '@/store/global'
const { userManager, workerConfig, tabbarName, updateTabbarName } = toRefs(useGlobalStore());
import { ActionSheet } from 'vant';


import logoIcon from '@@/images/logo_icon.png';

const showSheet = ref(false);
const actions = [
    { name: '服务项目收费',icon: 'todo-list-o', className:'text-md' },
    { name: '新建患者档案', icon: 'friends-o', className:'text-md' },
    { name: '产后盆底康复评估', icon: 'completed-o', className:'text-md' },
    // { name: '运动康复收费', icon: 'flag-o', className:'text-md', subname:'' },
];



</script>
<style scoped></style>

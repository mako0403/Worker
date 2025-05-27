<template>
    <el-affix position="bottom" :offset="0" class="w-full" style="height: 56px !important;">
        <div class="w-full text-center border-round-top-2xl border-top-1 border-gray-100 bg-white shadow-1" style="height: 56px !important;">
            <div class="h-full flex justify-content-between align-items-center px-3">
                <div class="w-full ">
                    <RouterLink to="/member" class=" h-full text-500 block" :class="{ 'text-dblue-600': tabbarName == 'member' }"
                        @click="updateTabbarName('member')">
                        <el-icon size="16px">
                            <Files />
                        </el-icon>
                        <div class="text-xs">会员中心</div>
                    </RouterLink>
                </div>
                <div class="w-full ">
                    <RouterLink to="/member/medical/appointment" class=" h-full text-500 block" :class="{ 'text-dblue-600': tabbarName == 'appointment' }"
                        @click="updateTabbarName('appointment')">
                        <el-icon size="16px">
                            <User  />
                        </el-icon>
                        <div class="text-xs">我的服务</div>
                    </RouterLink>
                </div>
                <!-- <div class="w-full relative">
                    <div class="border-circle bg-dblue-500 h-full" style="width: 56px; min-height: 56px; margin-left: auto; margin-right: auto; margin-top:-26px;" @click="showSheet=true">
                        <img :src="logoIcon" style="width:50px; height: 50px;" />
                    </div>
                    <ActionSheet v-model:show="showSheet" :actions="actions" cancel-text="取消" description="请选择操作项目" close-on-click-action @select="$emit('choseSheet', $event)"/>
                </div> -->
                <div class="w-full ">
                    <RouterLink to="/member/workout/plan" class="text-500 block  h-full" :class="{ 'text-dblue-600': tabbarName == 'workout' }"
                        @click="updateTabbarName('workout')">
                        <el-icon size="16px">
                            <ChatLineRound />
                        </el-icon>
                        <div class="text-xs">运动康复</div>
                    </RouterLink>
                </div>
                <div class="w-full ">
                    <RouterLink to="/member/aichat" class="text-500 block h-full" :class="{ 'text-dblue-600': tabbarName == 'aichat' }"
                        @click="updateTabbarName('aichat')">
                        <el-icon size="16px">
                            <SetUp  />
                        </el-icon>
                        <div class="text-xs">妈妈智问</div>
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

<template>
    <div class="h-full flex justify-content-between align-items-center px-3 border-top-1 border-gray-50">
        <div>
            <el-badge :is-dot="remind?true:false">
                <el-icon size="18" class="text-500" :class="{'bell text-800':remind}">
                    <Bell />
                </el-icon>
            </el-badge>
        </div>
        <div><img :src="logoText" height="26px"/></div>
        <div>
            <el-icon size="18" @click="menuDrawer = true">
                <Setting />
            </el-icon>
        </div>
    </div>
    <el-drawer v-model="menuDrawer" size="65%" :show-close="true" :with-header="false">
        <div class="text-center border-round-lg" style="background-color: #fefefe;"><img :src="logoIcon" width="65%"></div>
        <div class="mt-5 mx-2">
            <!-- <div>
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2"><Coffee /></el-icon>
                    <RouterLink to="/worker/settings/offday" class="text-dblue-500 text-md">设置休息日</RouterLink>
                </div>
            </div>
            <el-divider class="my-3 border-gray-100"/>
            <div class="mb-5">
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2"><Money /></el-icon>
                    <RouterLink to="/worker/services/sales_records" class="text-dblue-500 text-md">收费记录查询</RouterLink>
                </div>
            </div>
            <div class="mb-5">
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2"><Wallet /></el-icon>
                    <RouterLink to="/worker/services/usage_records" class="text-dblue-500 text-md">预约记录查询</RouterLink>
                </div>
            </div> -->
            <div class="mb-5">
                <div class="flex align-items-center" @click="loginOut">
                    <el-icon size="21" class="text-dblue-300 mr-2"><SwitchButton /></el-icon>
                    <div class="text-dblue-500 text-md">退出登录</div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue'
import axios from '@/utils/axios'
import { useGlobalStore } from '@/store/global';
const { workerConfig, isLogged, updateLoginStatus } = toRefs(useGlobalStore());
import { useRouter } from 'vue-router'
const router = useRouter()
import Cookies from "js-cookie";

import logoText from '@@/images/logo_text.png'

const menuDrawer = ref(false)
import logoIcon from '@@/images/logo.png';

onMounted(()=>{
    getRemindLists(); 
})

const remind = ref(null);
const total = ref(0);
const getRemindLists = async () =>{
    // try {
    //     const { data } = await axios.get('/worker/get_remind_lists', {worker_id:workerConfig.value.id}, {totast:0}); //
    //     total.value = data.total;
    //     remind.value = data.lists;
    // } catch (error) {
    //     console.error(error);
    // }
}

const loginOut = async () => {
    localStorage.removeItem('ERPAuth');
    Cookies.remove('ERPAuth');
    useGlobalStore().updateLoginStatus(0)
    router.replace({path:'/login'})
}


</script>
<style scoped>
.bell {
    animation: shake 1s infinite;
}

@keyframes shake {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(20deg); }
    20% { transform: rotate(0deg); }
    30% { transform: rotate(-20deg); }
    40% { transform: rotate(0deg); }
    50% { transform: rotate(20deg); }
    60% { transform: rotate(0deg); }
    70% { transform: rotate(-20deg); }
    80% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); } /* 余下的时间保持静止 */
}
</style>
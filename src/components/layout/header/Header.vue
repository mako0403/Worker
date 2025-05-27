<template>
    <div class="h-full flex justify-content-between align-items-center px-3 border-top-1 border-gray-50">
        <div>
            <el-badge :is-dot="remind ? true : false">
                <el-icon size="18" class="text-500" :class="{ 'bell text-800': remind }"
                    @click="router.push({ path: '/worker/remind' })">
                    <Bell />
                </el-icon>
            </el-badge>
        </div>
        <div><img :src="logoText" height="26px" /></div>
        <div>
            <el-icon size="18" @click="menuDrawer = true">
                <Setting />
            </el-icon>
        </div>
    </div>
    <el-drawer v-model="menuDrawer" size="65%" :show-close="true" :with-header="false">
        <div class="text-center border-round-lg" style="background-color: #fefefe;"><img :src="logoIcon" width="65%">
        </div>
        <div class="mt-5 mx-2">
            <div>
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <Coffee />
                    </el-icon>
                    <RouterLink to="/worker/settings/offday" class="text-dblue-500 text-md" @click="menuDrawer = false">
                        设置休息日</RouterLink>
                </div>
            </div>
            <el-divider class="my-3 border-gray-100" />
            <div class="mb-5">
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <Money />
                    </el-icon>
                    <RouterLink to="/worker/services/sales_records" class="text-dblue-500 text-md"
                        @click="menuDrawer = false">收费记录查询</RouterLink>
                </div>
            </div>
            <div class="mb-5">
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <Wallet />
                    </el-icon>
                    <RouterLink to="/worker/services/usage_records" class="text-dblue-500 text-md"
                        @click="menuDrawer = false">预约记录查询</RouterLink>
                </div>
            </div>
            <el-divider class="my-3 border-gray-100" />
            <div class="mb-5">
                <div class="flex align-items-center">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <VideoPlay />
                    </el-icon>
                    <RouterLink to="/worker/video/lists" class="text-dblue-500 text-md" @click="menuDrawer = false">视频资源库
                    </RouterLink>
                </div>
            </div>
            <div class="mb-5">
                <div class="flex align-items-center" @click="showChangePassword = !showChangePassword">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <WarnTriangleFilled />
                    </el-icon>
                    <div class="text-dblue-500 text-md">修改密码</div>
                </div>
            </div>
            <div class="mb-5">
                <div class="flex align-items-center" @click="loginOut">
                    <el-icon size="21" class="text-dblue-300 mr-2">
                        <SwitchButton />
                    </el-icon>
                    <div class="text-dblue-500 text-md">退出登录</div>
                </div>
            </div>
        </div>
    </el-drawer>

    <el-dialog v-model="showChangePassword" @opened="menuDrawer = false" width="90%" center align-center :show-close="false"
        :close-on-click-modal="false" class="border-round-2xl border-1 border-bluegray-100">
        <template #header>
            <div class="font-bold text-center">修改登录密码</div>
        </template>
        <div>
            <div class="flex justify-content-between align-items-center mb-3">
                <div class="mr-3 w-3">原密码</div>
                <el-input v-model="changePasswordForm.originalPassword" style="width: 240px" type="text" placeholder="请输入原登录密码" />
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
                <div class="mr-3 w-3">新密码</div>
                <el-input v-model="changePasswordForm.newPassword" style="width: 240px" type="text" placeholder="请输入新登录密码" />
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
                <div class="mr-3 w-3">确认新密码</div>
                <el-input v-model="changePasswordForm.confirmPassword" style="width: 240px" type="text" placeholder="请确认新登录密码" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" round @click="showChangePassword = false">取消</el-button>
                <el-button type="primary" size="large" round @click="submitChangePassword()" class="bg-dblue-500 border-dblue-800">
                    确认修改
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue'

import { useGlobal } from '@/components/Global';
const { axios, store, router, route, isLoadedPage, ElMessage } = useGlobal();
const { workerConfig, isLogged } = toRefs(store);
import Cookies from "js-cookie";

import logoText from '@@/images/logo_text.png'

const menuDrawer = ref(false)
import logoIcon from '@@/images/logo.png';


onMounted(() => {
    getRemindLists();
})

const remind = ref(null);
const total = ref(0);
const getRemindLists = async () => {
    try {
        const { data } = await axios.get('/worker/get_remind_lists', { worker_id: workerConfig.value.id }, { totast: 0 }); //
        total.value = data.total;
        remind.value = data.lists;
    } catch (error) {
        console.error(error);
    }
}

const loginOut = async () => {
    localStorage.removeItem('ERPAuth');
    Cookies.remove('ERPAuth');
    store.updateLoginStatus(0)
    router.replace({ path: '/login' })
}

const showChangePassword = ref(false);
const changePasswordForm = ref({
    username: workerConfig.value.username,
    originalPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const submitChangePassword = async () => {
    if(!changePasswordForm.value.originalPassword){
        ElMessage.error('请输入原密码');
    }
    if(!changePasswordForm.value.newPassword || !changePasswordForm.value.confirmPassword){
        ElMessage.error('请输入新密码及确认密码');
    }
    try {
        await axios.post('/worker/change_password', changePasswordForm.value).then(res => {
            if (res.data){
                ElMessage.success(res.info);
                showChangePassword.value = false
                changePasswordForm.value = {
                    username: workerConfig.value.username,
                    originalPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}


</script>
<style scoped>
.bell {
    animation: shake 1s infinite;
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    10% {
        transform: rotate(20deg);
    }

    20% {
        transform: rotate(0deg);
    }

    30% {
        transform: rotate(-20deg);
    }

    40% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(20deg);
    }

    60% {
        transform: rotate(0deg);
    }

    70% {
        transform: rotate(-20deg);
    }

    80% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(0deg);
    }

    /* 余下的时间保持静止 */
}
</style>
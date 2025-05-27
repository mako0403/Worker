<template>
    <div class="login-page-main bg-img h-full">
        <el-container class="pt-8">
            <el-main class="pt-3">
                <el-row :gutter="10">
                    <el-col :sm="6" :md="7" :lg="9">

                    </el-col>
                    <el-col :xs="24" :sm="12" :md="10" :lg="6">
                        <div class="text-center text-6xl">
                            <img src="@@/images/logo_white.png" alt="logo" width="65%" />
                        </div>
                        <div class="text-center mt-0 text-sm">缔造专业医疗产康服务机构</div>
                        <div class="text-white text-center mt-3 text-xs uppercase line-height-3">Professional postpartum
                            rehabilitation medical institution</div>
                        <el-form class="mt-6">
                            <div class="w-full mb-4">
                                <el-input v-model="userForm.username" placeholder="Please input username" />
                            </div>
                            <div class="w-full mb-4">
                                <el-input v-model="userForm.password" type="password"
                                    placeholder="Please input password" show-password @keydown.enter="doLogin" />
                            </div>
                            <div class="w-full mb-4">
                                <el-button type="primary" plain round size="large" @click="doLogin"
                                    class="w-full h-3rem border-round-3xl"
                                    style="background: #fbceb5 !important; border: 1px solid #fbceb5 !important; color: #000 !important;">登
                                    录</el-button>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :sm="6" :md="7" :lg="9">
                        <div class="text-center text-xs text-white font-bold">还没账户？<RouterLink to="/signup" class="text-dblue-900">去注册</RouterLink></div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <!-- <div class="absolute opacity-50 z-0" style="bottom:-5px; left:0; right:0;">
            <img alt="Vue logo" class="logo" src="@@/svg/bottom.svg" width="100%" />
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import { login } from "@/api/user";


import { ElMessage } from 'element-plus';
import Cookies from "js-cookie";

import WeChatAuth from "@/utils/wechatAuth";

const globalStore = useGlobalStore();

const router = useRouter();
const route = useRoute();

const userForm = reactive({
    username: '',
    password: '',
    openid:'',
    avatar:'',
    nickname:''
});




const doLogin = async () => {
    if (!userForm.username || !userForm.password) {
        ElMessage.warning('用户名或密码不能为空');
        return;
    } else {
        // userForm.username
        // userForm.password
        const res = await axios.post('/index/login', userForm)
        if(res.status){
            ElMessage.success(`${res.info}`);

            const { userType, memberInfo, workerConfig } = res.data
            globalStore.setUserRole(userType);

            if(globalStore.redirect && globalStore.redirect!='/'){
                router.replace({ path: globalStore.redirect})
                globalStore.setRedirect('')
                return
            }       

            if (userType === 'worker') {
                router.push('/worker');
            } else if (userType === 'member') {
                router.push('/member');
            }else {
                ElMessage.warning('Unknown user type');
            }
        } else {
            //ElMessage.warning(res.info);
        }

    }
};

const weChatAuth = new WeChatAuth(window.location.href, globalStore.replace);
const wechatUserInfo = ref<any>(null);

const getWeChatUserInfo = async (code: string) => {
    try {
        const accessTokenResponse = await weChatAuth.getAccessToken(code);
        const { access_token, openid } = accessTokenResponse;
        const userInfo = await weChatAuth.getUserInfo(access_token, openid);
        wechatUserInfo.value = userInfo;
        // 将微信用户信息合并到表单中
        userForm.openid = userInfo.openid;
        userForm.avatar = userInfo.headimgurl;
        userForm.nickname = userInfo.nickname;
    } catch (error) {
        console.error('Failed to get user info', error);
    }
};


onMounted(() => {
    if (weChatAuth.isWeChatBrowser()) {
        // 在微信浏览器中访问，检查 URL 中是否有 code 参数
        if (window.location.search.includes('code')) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                getWeChatUserInfo(code);
            }

            if (window.location.search.includes('state')) {
                useGlobalStore().setReplace(route.query.state)
            }
        } else {
            // 未找到 code 参数，进行授权
            weChatAuth.authorize();
        }
    }
});


</script>

<style lang="scss">
.login-page-main {
    color: #ffffff;
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url('@@/images/bg_3.webp') !important;

    .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0) inset;
        padding: 0 15px !important;
        width: 100%;
        height: 3.2rem;
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 40px;

        input {
            color: #ffffff !important;
        }
        input::placeholder {
            color: #eee;
        }
    }

    .el-input__wrapper.is-focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
        background: rgba(255, 255, 255, 0.05);
    }

    .el-input__inner{
        background: none !important;
    }

    .el-input .el-input__clear, .el-input .el-input__password{
        color:#eeeeee !important;
    }
}



.bg-img {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
}
</style>

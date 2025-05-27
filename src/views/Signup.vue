<template>
    <div class="h-full signup-bg-img" style="background: linear-gradient(rgba(242,227,248, 0.6), rgba(242,227,248, 0.1));">
        <el-container class="pt-6">
            <el-main class="px-5">
                <el-row :gutter="10">
                    <el-col :sm="6" :md="7" :lg="9">

                    </el-col>
                    <el-col :xs="24" :sm="12" :md="10" :lg="6">
                        <div class="text-6xl">
                            <div class="bg-teal-300 inline border-round-lg pb-1 px-1">
                                <img src="@@/images/logo_icon.png" alt="logo" width="48px" />
                            </div>
                        </div>
                        <div class="text-2xl font-bold mt-3">你好，</div>
                        <div class="text-2xl font-bold">欢迎使用「一凡妈妈」</div>
                        <div class="mt-1 text-xs">注册成为会员，即可开始使用</div>
                        <el-form class="mt-6">
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Cellphone />
                                    </el-icon>
                                    手机号码
                                </div>
                                <el-input v-model="userForm.telphone" size="large" placeholder="请输入手机号码" />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Lock />
                                    </el-icon>
                                    密码
                                </div>
                                <el-input v-model="userForm.password" type="password" placeholder="请输入登录密码" size="large"
                                    show-password />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Lock />
                                    </el-icon>
                                    确认密码
                                </div>
                                <el-input v-model="userForm.re_password" type="password" placeholder="请再次输入密码"
                                    size="large" show-password />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Message />
                                    </el-icon>
                                    验证码
                                </div>
                                <div class="sms-code-box relative">
                                    <el-input v-model="userForm.verify_sms" size="large" placeholder="请输入验证码"
                                        style="width: 100%;" />
                                    <el-button :disabled="isCounting" @click="sendSmsCode"
                                        :type="isCounting ? 'default' : 'primary'"
                                        :class="{ 'bg-dblue-500 border-dblue-700': !isCounting }" size="small"
                                        class="absolute" style="right:15px">
                                        {{ isCounting ? `${countdown}秒后重新发送` : '发送验证码' }}
                                    </el-button>
                                </div>
                            </div>
                            <div class="w-full mb-4">
                                <el-button type="primary" plain round size="large" @click="doSignup"
                                    class="w-full bg-dblue-500 text-white border-dblue-700">立即注册</el-button>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :sm="6" :md="7" :lg="9">
                        <div class="text-center text-xs text-500">已有账户？<RouterLink to="/login" class="text-dblue-900">
                                去登录</RouterLink>
                        </div>
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
import { useRoute, useRouter, RouterLink } from "vue-router";
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import { login } from "@/api/user";

import { ElMessage } from 'element-plus';

import { Field as vanField, Button as vanButton } from 'vant';

import WeChatAuth from "@/utils/wechatAuth";

const globalStore = useGlobalStore();

const router = useRouter();
const route = useRoute();


const isCounting = ref(false);
const countdown = ref(60);
let timer: NodeJS.Timeout;

const sendSmsCode = async () => {
    if (isCounting.value) return;

    // 开始倒计时
    isCounting.value = true;
    countdown.value = 60;

    timer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(timer);
            isCounting.value = false;
        }
    }, 1000);

    const res = await axios.get('/index/verify_sms', { telphone: userForm.telphone, method: 'signup' });
    if (!res.status) {
        ElMessage.error(res.info);
        clearInterval(timer);
        isCounting.value = false;
    }else{
        ElMessage.success('验证码已发送');
    }
};


const userForm = reactive({
    bid:0,
    worker_id:0,
    referrer:'', // 推荐人会员卡号
    telphone: '',
    password: '',
    re_password:'',
    verify_sms: '',
    openid: '',
    avatar: '',
    nickname: ''
});


const doSignup = async () => {
    if (!userForm.telphone || !userForm.password || !userForm.re_password || !userForm.verify_sms) {
        ElMessage.warning('手机号码、密码或验证码不能为空');
        return;
    } else if(userForm.password != userForm.re_password){
        ElMessage.warning('两次输入的密码不一致');
        return;
    } else {
        const res = await axios.post('/member/signup', userForm)
        if (res.status) {
            ElMessage.success(`${res.info}`);

            const { userType, memberInfo } = res.data
            globalStore.setUserRole(userType);

            if (globalStore.redirect && globalStore.redirect != '/') {
                router.replace({ path: globalStore.redirect })
                globalStore.setRedirect('')
                return
            }

            if (userType === 'member') {
                router.push('/member');
            } else {
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

    if(route.query.bid){
        userForm.bid = route.query.bid;
    }
    if(route.query.worker_id){
        userForm.worker_id = route.query.worker_id;
    }
    if(route.query.referrer){
        userForm.referrer = route.query.referrer;
    }
});



</script>

<style lang="scss">
.sms-code-box {
    display: flex;
    align-items: center;
}

.signup-bg-img {
    position: relative;
}

.signup-bg-img::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('@@/images/image-from-rawpixel-id-2340000-png-p82sito2h2n81lpjtuyyumzf8jmben47e46fpkuh3w.png');
    background-size: 115% auto ;
    background-repeat: no-repeat;
    background-position: left top;
    transform: scaleX(-1); /* 水平翻转 */
}
</style>

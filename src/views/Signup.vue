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
                        <div class="text-2xl font-bold mt-3">ä½ å¥½ï¼Œ</div>
                        <div class="text-2xl font-bold">æ¬¢è¿Žä½¿ç”¨ã€Œä¸€å‡¡å¦ˆå¦ˆã€</div>
                        <div class="mt-1 text-xs">æ³¨å†Œæˆä¸ºä¼šå‘˜ï¼Œå³å¯å¼€å§‹ä½¿ç”¨</div>
                        <el-form class="mt-6">
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Cellphone />
                                    </el-icon>
                                    æ‰‹æœºå·ç 
                                </div>
                                <el-input v-model="userForm.telphone" size="large" placeholder="è¯·è¾“å…¥æ‰‹æœºå·ç " />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Lock />
                                    </el-icon>
                                    å¯†ç 
                                </div>
                                <el-input v-model="userForm.password" type="password" placeholder="è¯·è¾“å…¥ç™»å½•å¯†ç " size="large"
                                    show-password />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Lock />
                                    </el-icon>
                                    ç¡®è®¤å¯†ç 
                                </div>
                                <el-input v-model="userForm.re_password" type="password" placeholder="è¯·å†æ¬¡è¾“å…¥å¯†ç "
                                    size="large" show-password />
                            </div>
                            <div class="w-full mb-4">
                                <div class="flex align-items-center text-sm mb-2">
                                    <el-icon class="mr-1">
                                        <Message />
                                    </el-icon>
                                    éªŒè¯ç 
                                </div>
                                <div class="sms-code-box relative">
                                    <el-input v-model="userForm.verify_sms" size="large" placeholder="è¯·è¾“å…¥éªŒè¯ç "
                                        style="width: 100%;" />
                                    <el-button :disabled="isCounting" @click="sendSmsCode"
                                        :type="isCounting ? 'default' : 'primary'"
                                        :class="{ 'bg-dblue-500 border-dblue-700': !isCounting }" size="small"
                                        class="absolute" style="right:15px">
                                        {{ isCounting ? `${countdown}ç§’åŽé‡æ–°å‘é€` : 'å‘é€éªŒè¯ç ' }}
                                    </el-button>
                                </div>
                            </div>
                            <div class="w-full mb-4">
                                <el-button type="primary" plain round size="large" @click="doSignup"
                                    class="w-full bg-dblue-500 text-white border-dblue-700">ç«‹å³æ³¨å†Œ</el-button>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :sm="6" :md="7" :lg="9">
                        <div class="text-center text-xs text-500">å·²æœ‰è´¦æˆ·ï¼Ÿ<RouterLink to="/login" class="text-dblue-900">
                                åŽ»ç™»å½•</RouterLink>
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

import { ElMessage } from 'element-plus';


const globalStore = useGlobalStore();

const router = useRouter();
const route = useRoute();


const isCounting = ref(false);
const countdown = ref(60);
let timer: NodeJS.Timeout;

const sendSmsCode = async () => {
    if (isCounting.value) return;

    // å¼€å§‹å€’è®¡æ—¶
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
        ElMessage.success('éªŒè¯ç å·²å‘é€');
    }
};


const userForm = reactive({
    bid:0,
    worker_id:0,
    referrer:'', // æŽ¨èäººä¼šå‘˜å¡å·
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
        ElMessage.warning('æ‰‹æœºå·ç ã€å¯†ç æˆ–éªŒè¯ç ä¸èƒ½ä¸ºç©º');
        return;
    } else if(userForm.password != userForm.re_password){
        ElMessage.warning('ä¸¤æ¬¡è¾“å…¥çš„å¯†ç ä¸ä¸€è‡´');
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

onMounted(() => {
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
    transform: scaleX(-1); /* æ°´å¹³ç¿»è½¬ */
}
</style>

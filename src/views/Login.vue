<template>
    <div class="login-page-main bg-img h-full">
        <el-container class="pt-8">
            <el-main class="pt-3">
                <el-row :gutter="10">
                    <el-col :sm="6" :md="7" :lg="9">

                    </el-col>
                    <el-col :xs="24" :sm="12" :md="10" :lg="6">
                        <div class="text-center text-6xl">
                            <img src="@@/images/logo_white_border.png" alt="logo" width="65%" />
                        </div>
                        <div class="text-center mt-2 text-sm" style="color: #6e72bd;">ç¼”é€ ä¸“ä¸šåŒ»ç–—äº§åº·æœåŠ¡æœºæž„</div>
                        <div class="text-center mt-3 text-xs uppercase line-height-3" style="color: #6e72bd;">Professional postpartum
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
                                    style="font-size: 18px; font-weight: bold; border: 0px solid #fbceb5 !important; color: #fff !important; background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);">ç™»  
                                    å½•</el-button>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :sm="6" :md="7" :lg="9">
                        <div class="text-center text-xs text-white font-bold mt-3">è¿˜æ²¡è´¦æˆ·ï¼Ÿ<RouterLink to="/signup" class="text-dblue-600 ml-2">ç«‹å³æ³¨å†Œ</RouterLink></div>
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
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';


import { ElMessage } from 'element-plus';

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
        ElMessage.warning('ç”¨æˆ·åæˆ–å¯†ç ä¸èƒ½ä¸ºç©º');
        return;
    }

    const res = await axios.post('/index/login', userForm);
    
    if (res.status) {
        ElMessage.success(`${res.info}`);

        // 1. è§£æž„åŽç«¯è¿”å›žçš„æ•°æ®
        const { userType } = res.data;
        
        // 2. æ›´æ–° Store çŠ¶æ€ (æ‹¦æˆªå™¨å·²å¤„ç†å¤§éƒ¨åˆ†ï¼Œè¿™é‡Œæ˜¾å¼è®¾ç½®è§’è‰²)
        globalStore.setUserRole(userType);

        // 3. ç¡®å®šæœ€ç»ˆè·³è½¬ç›®æ ‡
        // æ£€æŸ¥ä¼˜å…ˆçº§ï¼šStore å­˜çš„ redirect > URL å‚æ•°ä¸­çš„ redirect > è§’è‰²é»˜è®¤é¡µ
        let targetPath = globalStore.redirect || (route.query.redirect as string);

        // 4. æ‰§è¡Œè·³è½¬é€»è¾‘
        if (targetPath && targetPath !== '/' && targetPath !== '/login') {
            // å¦‚æžœæœ‰åˆæ³•çš„é‡å®šå‘åœ°å€
            router.replace(targetPath);
            // å…³é”®ï¼šè·³è½¬åŽåŠ¡å¿…æ¸…ç©ºé‡å®šå‘ä¿¡æ¯ï¼Œé˜²æ­¢ä¸‹æ¬¡ç™»å½•å¹²æ‰°
            globalStore.setRedirect('');
        } else {
            // æ²¡æœ‰é‡å®šå‘åœ°å€ï¼Œåˆ™æ‰§è¡Œè§’è‰²åˆ†æµé¦–é¡µ
            const homeMap: Record<string, string> = {
                'worker': '/worker',
                'member': '/member'
            };
            const destination = homeMap[userType] || '/';
            router.replace(destination);
        }
    }
};



</script>

<style lang="scss">
.login-page-main {
    color: #ffffff;
    background: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url('@@/images/bg_3.webp') !important;
    //background: #ff9600 !important;

    .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0) inset;
        padding: 0 15px !important;
        width: 100%;
        height: 3.2rem;
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 40px;

        input {
            color: #6e72bd !important;
        }
        input::placeholder {
            color: #bcbff4;
        }
    }

    .el-input__wrapper.is-focus {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid #bcbff4 !important;
    }

    .el-input__inner{
        background: none !important;
    }

    .el-input .el-input__clear, .el-input .el-input__password{
        color:#eeeeee !important;
    }


    input::placeholder {
        text-align: center; /* æ°´å¹³å±…ä¸­ */
        font-size: 0.8rem;
        letter-spacing: 1px;
        color: #bcbff4 !important;
    }
    /* é’ˆå¯¹ä¸åŒæµè§ˆå™¨çš„å‰ç¼€ */
    input::-webkit-input-placeholder { text-align: center; font-size: 0.8rem;}
    input::-moz-placeholder { text-align: center; font-size: 0.8rem;}
    input::-ms-input-placeholder { text-align: center; font-size: 0.8rem;}
}



.bg-img {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
}
</style>

<template>
    <div class="h-screen w-screen">
        <div v-if="!showMagazine">
            <van-swipe class="h-screen" :autoplay="0" :show-indicators="true" indicator-color="white">
                <van-swipe-item class="bg-purple-200">
                    <div class="w-full h-full boot-page-1">
                        <div class="absolute" style="left:0; right: 0; bottom: 12%;">
                            <img :src="bootPageContent1" width="100%" />
                        </div>
                        <!-- <div class="text-lg font-bold text-center mt-8 pt-5 text-purple-800">
                            å›½å®¶åŸºæœ¬å«ç”ŸæœåŠ¡å…è´¹æä¾›é¡¹ç›®
                        </div>
                        <div class="text-6xl text-center font-bold mt-3 text-purple-900">å­•äº§å¦‡å¥åº·ç®¡ç†</div>
                        <div class="mt-4 text-center">
                            <img src="@@/images/10613398_10130.webp" width="100%" />
                        </div>
                        <div class="line-height-4 text-justify text-900 text-center m-4">
                            ç¤¾åŒºå«ç”ŸæœåŠ¡ä¸­å¿ƒä½œä¸ºåŸºå±‚åŒ»ç–—çš„â€œå®ˆé—¨äººâ€ï¼Œä¸ºè¾–åŒºå†…å­•äº§å¦‡æä¾›å…è´¹çš„å¥åº·ç®¡ç†æœåŠ¡ã€‚æœåŠ¡å¯¹è±¡ä¸ºä»Žæ€€å­•å¼€å§‹åˆ°äº§åŽ2å¹´ï¼Œæä¾›åŒ…å«ã€Šå­•äº§ä¿å¥æ‰‹å†Œã€‹å»ºæ¡£ã€å­•æœŸä¿å¥æŒ‡å¯¼æœåŠ¡ã€äº§åŽè®¿è§†ã€äº§åŽå¥åº·æ£€æŸ¥ã€äº§åŽä¿å¥æŒ‡å¯¼ã€æ¯ä¹³å–‚å…»æŒ‡å¯¼åŠäº§åŽåº·å¤ç­‰ä¼—å¤šæœåŠ¡é¡¹ç›®ã€‚å„ç¤¾åŒºåŒ»é™¢è¾–åŒºå†…çš„å­•äº§å¦‡å¯å…è´¹äº«å—9å¤§å¥åº·æœåŠ¡é¡¹ç›®ã€‚
                        </div> -->
                    </div>
                </van-swipe-item>
                <van-swipe-item class="bg-white">
                    <div class="w-full h-full boot-page-2">
                        <div class="absolute" style="left:0; right: 0;top: 3%;">
                            <img :src="bootPageContent2" width="100%" />
                        </div>
                        <!-- <div class=" ">
                            <img src="@@/images/10613398_10132.webp" width="100%" />
                        </div>
                        <div class="line-height-4 text-900 text-center mx-4 mt-3">
                            è¾–åŒºå­•äº§å¦‡å¯å…è´¹äº«å—å›½å®¶åŸºæœ¬å«ç”ŸæœåŠ¡å…è´¹é¡¹ç›®ï¼ŒåŒ…æ‹¬ï¼šå¬èƒŽå¿ƒ1æ¬¡ã€æŠ½è¡€åŒ–éªŒ1æ¬¡ã€Bè¶…æ£€æŸ¥1æ¬¡ã€äº§åŽ7å¤©ä¸Šé—¨è®¿è§†1æ¬¡ã€42å¤©äº§åŽå¤æŸ¥1æ¬¡ã€å­•æœŸä¹³æˆ¿æŠ¤ç†1æ¬¡ã€å­•æœŸæŒ‰æ‘©1æ¬¡ã€ç›†åœ°åº·å¤ä½“éªŒ5æ¬¡ã€å­å®«å¤æ—§ä½“éªŒ3æ¬¡
                        </div>
                        <div class="absolute " style="bottom:0px;">
                            <img src="@@/images/10613398_10131.webp" width="100%" />
                        </div> -->
                    </div>
                </van-swipe-item>
            </van-swipe>

            <div class="fixed bottom-0 w-full flex justify-center" style="margin-bottom:8%">
                <el-button type="warning" size="large" round @click="handleClaim"
                    class="w-full mx-4 bg-yellow-400 pt-4 pb-4 border-round-3xl">ç«‹&nbsp;&nbsp;å³&nbsp;&nbsp;å…&nbsp;&nbsp;è´¹&nbsp;&nbsp;é¢†&nbsp;&nbsp;å–</el-button>
            </div>

            <van-popup v-model:show="showForm" position="bottom" round closeable>
                <div class="p-4">
                    <div class="text-lg font-bold mb-4">è¯·å¡«å†™é¢†å–ä¿¡æ¯</div>
                    <van-form @submit="submitForm">
                        <van-field v-model="form.fullname" name="fullname"
                            label="å§“&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;å" placeholder="è¯·è¾“å…¥æ‚¨çš„å§“å" required
                            label-align="left" class="px-0 py-3" />

                        <van-field v-model="form.telphone" name="telphone" label="è”ç³»ç”µè¯" placeholder="è¯·è¾“å…¥æ‚¨çš„æ‰‹æœºå·ç " required
                            label-align="left" class="px-0 py-3" />

                        <el-space fill v-if="!canReceive" class="my-3">
                            <el-alert type="warning" show-icon :closable="false">
                                <p>è¯¥æ‰‹æœºå·ç å·²é¢†å–è¿‡å…è´¹æœåŠ¡æˆ–ä¸ç¬¦åˆå…è´¹é¢†å–æ¡ä»¶ï¼Œæ— æ³•å†æ¬¡é¢†å–ï¼</p>
                            </el-alert>
                        </el-space>


                        <!-- <van-field v-else v-model="form.verify_sms" center clearable required
                            label="éªŒ&nbsp;&nbsp;è¯&nbsp;&nbsp;ç " placeholder="è¯·è¾“å…¥çŸ­ä¿¡éªŒè¯ç " label-align="left"
                            class="px-0 py-3">
                            <template #button>
                                <van-button size="small" :type="isCounting ? 'default' : 'primary'"
                                    :disabled="isCounting || form.telphone.length !== 11 || !canReceive"
                                    @click="sendSmsCode">{{ isCounting ? `${countdown}ç§’åŽé‡æ–°å‘é€` : 'å‘é€éªŒè¯ç ' }}</van-button>
                            </template>
                        </van-field> -->


                        <van-field name="birthday" label="å‡ºç”Ÿæ—¥æœŸ" clickable v-model="form.birthday" placeholder="è¯·è®¾ç½®æ‚¨çš„å‡ºç”Ÿæ—¥æœŸ"
                            @click="showBirthdayPicker = true" required label-align="left" class="px-0 py-3" />
                        <van-popup v-model:show="showBirthdayPicker" position="bottom">
                            <van-date-picker v-model="defaultPickerValue" @confirm="onConfirmBirthday"
                                @cancel="showBirthdayPicker = false" :min-date="new Date(1950, 0, 1)"
                                :max-date="new Date()" />
                        </van-popup>

                        <van-field name="hospital" label="ç¤¾åŒºåŒ»é™¢" clickable v-model="form.hospital"
                            placeholder="è¯·é€‰æ‹©è¾–åŒºç¤¾åŒºå«ç”ŸæœåŠ¡ä¸­å¿ƒ" @click="showHospitalPicker = true" required label-align="left"
                            class="px-0 py-3" />
                        <van-popup v-model:show="showHospitalPicker" position="bottom">
                            <van-picker :columns="hospitalList" @confirm="onSelectHospital"
                                @cancel="showHospitalPicker = false" />
                        </van-popup>

                        <van-field name="worker" label="åº·&nbsp;&nbsp;å¤&nbsp;&nbsp;å¸ˆ" clickable v-model="form.worker"
                            placeholder="è¯·é€‰æ‹©è´Ÿè´£åº·å¤å¸ˆ" @click="showWorkerPicker = true" required label-align="left"
                            class="px-0 py-3" />
                        <van-popup v-model:show="showWorkerPicker" position="bottom">
                            <van-picker :columns="workerLists" @confirm="onSelectWorker"
                                @cancel="showWorkerPicker = false" />
                        </van-popup>

                        <el-space fill class="my-3">
                            <el-alert type="info" show-icon :closable="false">
                                <p>å¦‚æ‚¨å¤„äºŽå­•æœŸï¼Œåªéœ€å¡«å†™é¢„äº§æœŸæ—¥æœŸï¼Œå¦åˆ™åªéœ€å¡«å†™å®å®å‡ºç”Ÿæ—¥æœŸå³å¯</p>
                            </el-alert>
                        </el-space>

                        <van-field name="remind_date1" label="é¢„&nbsp;&nbsp;äº§&nbsp;&nbsp;æœŸ" clickable
                            v-model="form.remind_date1" placeholder="é€‰æ‹©é¢„äº§æœŸ" @click="showDuePicker = true"
                            label-align="left" class="px-0 py-3" />
                        <van-popup v-model:show="showDuePicker" position="bottom">
                            <van-date-picker v-model="defaultPickerValue1" @confirm="onConfirmDueDate"
                                @cancel="showDuePicker = false" :min-date="new Date()" swipe-duration="300" />
                        </van-popup>

                        <van-field name="remind_date2" label="å®å®ç”Ÿæ—¥" clickable v-model="form.remind_date2"
                            placeholder="é€‰æ‹©å®å®å‡ºç”Ÿæ—¥æœŸ" @click="showDeliveryPicker = true" label-align="left"
                            class="px-0 py-3" />
                        <van-popup v-model:show="showDeliveryPicker" position="bottom">
                            <van-date-picker v-model="defaultPickerValue2" @confirm="onConfirmDeliveryDate"
                                @cancel="showDeliveryPicker = false" :min-date="new Date(2000, 0, 1)"
                                :max-date="new Date()" />
                        </van-popup>

                        <div class="mt-4">
                            <van-button round block type="primary" native-type="submit"
                                :disabled="!canReceive">ç«‹å³å…è´¹é¢†å–</van-button>
                        </div>
                    </van-form>
                </div>
            </van-popup>
        </div>
        <div class="magazine-wrapper bg-yellow-500"  v-else>
            <div class="pt-5 text-center text-yellow-800">
                <div class="text-lg font-bold">æ‚¨å·²é¢†å–æœ€æ–°ç‰ˆã€Šå­•äº§ä¿å¥æ‰‹å†Œã€‹</div>
                <div class="text-xs mt-2">You have received the Maternal and Child Health Handbook</div>
            </div>
            <component :is="FlipBook" :pages="pages" class="magazine" v-slot="flipbook">
                <div class="w-full absolute text-yellow-800 text-center" style="bottom: -8%;">
                   ç¬¬ {{ flipbook.page }} é¡µï¼Œå…± {{ flipbook.numPages }} é¡µ
                </div>
            </component>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import FlipBook from 'flipbook-vue';
import {
    Swipe as vanSwipe,
    SwipeItem as vanSwipeItem,
    Form as vanForm,
    Field as vanField,
    Popup as vanPopup,
    Picker as vanPicker,
    DatePicker as vanDatePicker,
    Button as vanButton,
    CellGroup as vanCellGroup,
    showToast
} from 'vant';
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route, ElMessage, showLoading, hideLoading, waiting } = useGlobal();

import bootPageContent1 from '@@/images/content/9892d09b-7e3d-48a1-b480-1a0d93b84c52.webp'
import bootPageContent2 from '@@/images/content/9892d09b-7e3d-48a1-b480-1a0d93b84c54.webp'

const showMagazine = ref(false);
const showForm = ref(false);
const canReceive = ref(true); // æ˜¯å¦å¯ä»¥é¢†å–
const isCounting = ref(false);
const countdown = ref(60);
let timer: NodeJS.Timeout;

const showHospitalPicker = ref(false);
const showWorkerPicker = ref(false);
const showBirthdayPicker = ref(false);
const showDuePicker = ref(false);
const showDeliveryPicker = ref(false);

const defaultPickerValue = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);
const defaultPickerValue1 = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);
const defaultPickerValue2 = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);

const hospitalList = ref([]);
const workerLists = ref([]);
const servicesLists = ref([]);


import page1 from '@@/images/content/mother-child-handbook-1.webp';
import page2 from '@@/images/content/mother-child-handbook-2.webp';
import page3 from '@@/images/content/mother-child-handbook-3.webp';
import page4 from '@@/images/content/mother-child-handbook-4.webp';
import page5 from '@@/images/content/mother-child-handbook-5.webp';
import page6 from '@@/images/content/mother-child-handbook-6.webp';
import page7 from '@@/images/content/mother-child-handbook-7.webp';
import page8 from '@@/images/content/mother-child-handbook-8.webp';
import page9 from '@@/images/content/mother-child-handbook-9.webp';
import page10 from '@@/images/content/mother-child-handbook-10.webp';
import page11 from '@@/images/content/mother-child-handbook-11.webp';
import page12 from '@@/images/content/mother-child-handbook-12.webp';
import page13 from '@@/images/content/mother-child-handbook-13.webp';
import page14 from '@@/images/content/mother-child-handbook-14.webp';
import page15 from '@@/images/content/mother-child-handbook-15.webp';
import page16 from '@@/images/content/mother-child-handbook-16.webp';
import page17 from '@@/images/content/mother-child-handbook-17.webp';
const pages = [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11, page12, page13, page14, page15, page16, page17];


onMounted(async () => {
    showLoading();
    const { data } = await axios.get('/company/branch_lists', { online: 1 }, { toast: 0 })
    if (data) {
        hospitalList.value = [];
        data.forEach((item: any) => {
            hospitalList.value.push({
                text: item.name,
                value: item.id
            })
        })
    }

    window.addEventListener('keydown', (ev) => {
      const flipbook = this.$refs.flipbook
      if (!flipbook) return
      if (ev.keyCode == 37 && flipbook.canFlipLeft) flipbook.flipLeft()
      if (ev.keyCode == 39 && flipbook.canFlipRight) flipbook.flipRight()
    })
    
    await waiting(500);
    if (store.userRole=='member' && store.isLogged) {
        showForm.value = false;
        showMagazine.value = true;
    }
    hideLoading();

});

const handleClaim = () => {
    showForm.value = true;
};

const form = reactive({
    fullname: '',
    telphone: '',
    verify_sms: '',
    birthday: '',
    remind_date1: '',
    remind_date2: '',
    bid: 0,
    worker_id: 0,
    openid: '',
    avatar: '',
    nickname: '',

    hospital: '',
    worker: ''
});



const onConfirmBirthday = (val: any) => {
    form.birthday = val.selectedValues.join('-');
    showBirthdayPicker.value = false;
};

const onConfirmDueDate = (val: any) => {
    form.remind_date1 = val.selectedValues.join('-');
    showDuePicker.value = false;
};

const onConfirmDeliveryDate = (val: any) => {
    form.remind_date2 = val.selectedValues.join('-');
    showDeliveryPicker.value = false;
};

const onSelectHospital = (val: any) => {
    form.hospital = val.selectedOptions[0].text;
    form.bid = val.selectedOptions[0].value;
    showHospitalPicker.value = false;
};

const onSelectWorker = (val: any) => {
    form.worker = val.selectedOptions[0].text;
    form.worker_id = val.selectedOptions[0].value;
    showWorkerPicker.value = false;
};

// watch(() => showHospitalPicker.value, async () => {
//     if (showHospitalPicker.value && hospitalList.value.length == 0) {
//         try {
//             showLoading();
//             const { data } = await axios.get('/company/branch_lists', { online: 1 }, { toast: 0 })
//             if (data) {
//                 hospitalList.value = [];
//                 data.forEach((item: any) => {
//                     hospitalList.value.push({
//                         text: item.name,
//                         value: item.id
//                     })
//                 })
//             }
//             hideLoading();
//         } catch (err) {
//             ElMessage.error('åŠ è½½é—¨åº—åˆ—è¡¨æ•°æ®å¤±è´¥')
//         }
//     }
// });

watch(() => showWorkerPicker.value, async () => {
    if (showWorkerPicker.value) {
        if (form.bid) {
            try {
                showLoading();
                const { data } = await axios.get('/worker/lists', { online: 1, bid: form.bid })
                if (data) {
                    workerLists.value = [];
                    data.forEach((item: any) => {
                        workerLists.value.push({
                            text: item.fullname,
                            value: item.id
                        })
                    })
                }
                hideLoading();
            } catch (err) {
                ElMessage.error('åŠ è½½å‘˜å·¥åˆ—è¡¨æ•°æ®å¤±è´¥')
            }
        } else {
            showWorkerPicker.value = false
            ElMessage.error('è¯·å…ˆé€‰æ‹©ç¤¾åŒºåŒ»é™¢')
        }
    }
});

watch(() => form.bid, async () => {
    // if (form.bid) {
    //     try {
    //         const res = await axios.get('/medical/services_lists', { bid: form.bid, name: 'å¬èƒŽå¿ƒ,æŠ½è¡€åŒ–éªŒ,Bè¶…æ£€æŸ¥,äº§åŽ7å¤©ä¸Šé—¨è®¿è§†,42å¤©äº§åŽå¤æŸ¥,å­•æœŸä¹³æˆ¿æŠ¤ç†,å­•æœŸæŒ‰æ‘©,ç›†åœ°åº·å¤ä½“éªŒ,å­å®«å¤æ—§ä½“éªŒ' });
    //         console.log(11111111111);
    //         servicesLists.value = res.data;
    //     } catch (error) {
    //         console.error('Failed to fetch worker lists:', error);
    //     }
    // }
})

watch(() => form.telphone, async () => {
    if (form.telphone.length == 11) {
        const { data } = await axios.get('/member/search', { card_number: form.telphone }, { toast: 0 });
        if (!data) {
            canReceive.value = true;
        } else {
            canReceive.value = false;
        }
    }
})

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

    const res = await axios.get('/index/verify_sms', { telphone: form.telphone, method: 'signup' });
    if (!res.status) {
        ElMessage.error(res.info);
        clearInterval(timer);
        isCounting.value = false;
    } else {
        ElMessage.success('éªŒè¯ç å·²å‘é€');
    }
};

const submitForm = async (event?: Event) => {
    // console.log(3333333333, form);
    // return;

    const res = await axios.post('/member/mch_member_services', form);
    if (!res.status) {
        ElMessage.error(res.info);
    } else {
        showForm.value = false;
        showMagazine.value = true;
        ElMessage.success(`${res.info}`);
    }

    //console.log(store.memberInfo)
    // event?.preventDefault();

    // showToast({ message: 'é¢†å–æˆåŠŸ', duration: 3000 });
    // setTimeout(() => {

    // }, 3000);
};
</script>

<style lang="scss" scoped>
.van-swipe-item {
    background-color: #f5f5f5;
}

.magazine-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.magazine {
    position: absolute;
    top: 15%;
    left: 5%;
    width: 90vw;
    height: 70vh;
}

.boot-page-1{
    background-image: url('@@/images/content/9892d09b-7e3d-48a1-b480-1a0d93b84c51.webp');
    background-size: 100% 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
}
.boot-page-2{
    background-image: url('@@/images/content/9892d09b-7e3d-48a1-b480-1a0d93b84c53.webp');
    background-size: 100% 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
}

:deep(.page){
    box-shadow: 0 0 22px  rgba(0, 0, 0, 0.6);
}
</style>

<template>
    <div class="relative" style="background-color: #8d84df; overflow-y: scroll;">
        <div style="padding-bottom:50px">
            <img src="https://com.e-eps.com/Uploads/com.e-eps.com/ybh1.webp" width="100%" height="100%">
        </div>
        <div class="fixed" style="left: 20px; right: 20px; bottom: 20px;">
            <el-button color="#fff0cd" size="large" round style="width: 100%; color:#433b6f" class="shadow-2 font-bold"
                @click="showDrawer = true;">马上登记 - 立享专属特权</el-button>
        </div>
    </div>
    <el-drawer v-model="showDrawer" title="I am the title" direction="btt" show-close :with-header="false" size="65%">
        <span>请填写您的联系信息：</span>
        <div>
            <div v-if="form" v-for="(items, index, i) in form.field" :key="index" :name="i">
                <div class="mt-3">
                    <el-form :model="form.field[index]" label-position="top" label-width="auto" style="max-width: 100%">
                        <el-row :gutter="15">
                            <el-col v-for="(item, ii) in items" :key="ii" :span="item.width" class="">
                                <el-form-item>
                                    <template #label>
                                        <div class="flex justify-content-between">
                                            <div class="text-md text-dblue-600">{{ ii }}</div>
                                            <div class="text-xs text-300">{{ item.unit }}</div>
                                        </div>
                                    </template>
                                    <template v-if="item.type === 'radio' || item.type === 'checkbox'">
                                        <van-field v-model="form.field[index][ii].value" :placeholder="item.placeholder" type="text" is-link readonly clickable
                                            :label="item.label" @click="showPicker = true" class="border-1 border-300 border-round-xs px-2 py-1" />

                                        <!-- Popup 弹出选择器 -->
                                        <van-popup v-model:show="showPicker" position="bottom">
                                            <van-picker v-model="selectedValues" cancel-button-text="" :columns="item.options.split('|').map(region => ({ text: region, value: region }))"
                                                :multiple="item.type === 'checkbox'" @confirm="onConfirm(index, ii)"
                                                @cancel="onCancel" />
                                        </van-popup>
                                    </template>
                                    <component v-else :is="getComponent(item.type)" v-model="form.field[index][ii].value"
                                        v-bind="getComponentProps(item)" class="w-full">
                                        <!-- <template v-if="item.type === 'radio' || item.type === 'checkbox'">
                                            <el-option v-for="option in item.options.split('|')" :key="option"
                                                :label="option" :value="option" />
                                        </template> -->
                                    </component>

                                    <div v-if="item.type === 'upload_images'" class="flex flex-wrap gap-2">
                                        <div v-for="(url, imgIndex) in form.field[index][ii].value" :key="imgIndex"
                                            class="mb-2">
                                            <img :src="url" alt="preview" style="max-width: 100px; max-height: 100px;">
                                        </div>
                                    </div>
                                    <div class="text-xs text-500">{{ item.description ? '* ' +
                                        item.description : '' }}</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <el-button type="default" class="w-full bg-dblue-500 border-dblue-600 text-dblue-50 mt-3" size="large"
                    @click="submit">立即提交</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject, watch, readonly } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import { login } from "@/api/user";

import { ElMessage } from 'element-plus';
import Cookies from "js-cookie";

import WeChatAuth from "@/utils/wechatAuth";
import wechatJs from "@/utils/wechatJs";

import { Picker as vanPicker, Popup as vanPopup, Field as vanField } from 'vant';

const globalStore = useGlobalStore();

const router = useRouter();
const route = useRoute();


const showPicker = ref(false); // 控制 Popup 显示状态
const selectedValues = ref([]); // 选择的值
const showDrawer = ref(false);
const form = ref();
const submitForm = ref({
    form_id: 0,
    bid: route.query.bid || 0,
    rules_id: 0,
    worker_id: route.query.worker_id || 0,
    fullname: '',
    telphone: '',
    field: {}
})

const submit = async () => {
    submitForm.value.rules_id = route.params.id
    submitForm.value.field = form.value.field
    Object.keys(form.value.field).forEach(key => {
        Object.keys(form.value.field[key]).forEach(k => {
            k == '联系电话' ? submitForm.value.telphone = form.value.field[key][k].value : '';
            k == '姓名' ? submitForm.value.fullname = form.value.field[key][k].value : '';
        });
    });

    const res = await axios.post('/form/add_form', submitForm.value)
    if (res.status) {
        ElMessage.success(res.info);
        router.push({ path: '/result/success', query: { title: '报名成功', description: '您已成功提交报名信息' } })
    }
}


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

const wechat = new wechatJs();
onMounted(async () => {
    try {
        const res = await axios.get('form/rules', { id: route.params.id })
        if (res.data) {
            form.value = res.data;
            document.title = res.data.name
        }
    } catch (error) {
        console.error('Failed to check token', error);
    }


    if (weChatAuth.isWeChatBrowser()) {
        await wechat.init();
        wechat.shareToFriend({
            title: form.value.name,
            desc: form.value.name,
            link: window.location.href,
            imgUrl: 'https://com.e-eps.com/Uploads/com.e-eps.com/ybh1.webp',
        });
        wechat.shareToTimeline({
            title: form.value.name,
            link: window.location.href,
            imgUrl: 'https://com.e-eps.com/Uploads/com.e-eps.com/ybh1.webp',
        })

        // 在微信浏览器中访问，检查 URL 中是否有 code 参数
        // if (window.location.search.includes('code')) {
        //     const urlParams = new URLSearchParams(window.location.search);
        //     const code = urlParams.get('code');
        //     if (code) {
        //         getWeChatUserInfo(code);
        //     }

        //     if (window.location.search.includes('state')) {
        //         useGlobalStore().setReplace(useRoute().query.state)
        //     }
        // } else {
        //     // 未找到 code 参数，进行授权
        //     weChatAuth.authorize();
        // }
    }



});

function getComponent(type) {
    const typeMap = {
        text: 'el-input',
        number: 'el-input',
        step_number: 'el-input-number',
        date: 'el-date-picker',
        radio: 'el-select',
        checkbox: 'el-select',
        textarea: 'el-input',
        upload_images: 'van-uploader',
    };
    return typeMap[type] || 'el-input';
}

function getComponentProps(item) {
    switch (item.type) {
        case 'number':
            return { type: 'number', modelValue: item.value ? Number(item.value) : '', placeholder: item.placeholder };
        case 'step_number':
            return { modelValue: Number(item.value) };
        case 'radio':
            return { placeholder: item.placeholder, filterable: false, automaticDropdown: true, placement: 'top' };
        case 'checkbox':
            return { multiple: true, placeholder: item.placeholder, filterable: false, automaticDropdown: true, placement: 'top' };
        case 'date':
            return { type: 'date', editable:false, valueFormat: 'YYYY-MM-DD', placeholder: item.placeholder, class: 'disable-keyboard' };
        case 'textarea':
            return { type: 'textarea', rows: 4, placeholder: item.placeholder };
        case 'upload_images':
            return { action: '/upload', multiple: true, listType: 'picture-card' };
        default:
            return { placeholder: item.placeholder };
    }
}


// 处理选择确认
const onConfirm = (index, ii) => {
    form.value.field[index][ii].value = selectedValues.value[0];
    showPicker.value = false; // 关闭弹出层
};

// 处理选择取消
const onCancel = () => {
    showPicker.value = false; // 取消时关闭弹出层
};

</script>

<style lang="scss">
#app {
    overflow: auto;
    /* 强制显示滚动条 */
}

.disable-keyboard input {
    caret-color: transparent; /* 隐藏光标 */
    user-select: none; /* 禁止选中文本 */
    pointer-events: none; /* 禁止点击 */
}
</style>

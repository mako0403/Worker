<template>
    <div class="relative" style="background-color: #8d84df; overflow-y: scroll;">
        <div style="padding-bottom:50px">
            <img src="https://com.e-eps.com/Uploads/com.e-eps.com/ybh1.webp" width="100%" height="100%">
        </div>
        <div class="fixed" style="left: 20px; right: 20px; bottom: 20px;">
            <el-button color="#fff0cd" size="large" round style="width: 100%; color:#433b6f" class="shadow-2 font-bold"
                @click="showDrawer = true;">é©¬ä¸Šç™»è®° - ç«‹äº«ä¸“å±žç‰¹æƒ</el-button>
        </div>
    </div>
    <el-drawer v-model="showDrawer" title="I am the title" direction="btt" show-close :with-header="false" size="65%">
        <span>è¯·å¡«å†™æ‚¨çš„è”ç³»ä¿¡æ¯ï¼š</span>
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

                                        <!-- Popup å¼¹å‡ºé€‰æ‹©å™¨ -->
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
                    @click="submit">ç«‹å³æäº¤</el-button>
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


import { Picker as vanPicker, Popup as vanPopup, Field as vanField } from 'vant';

const globalStore = useGlobalStore();

const router = useRouter();
const route = useRoute();


const showPicker = ref(false); // æŽ§åˆ¶ Popup æ˜¾ç¤ºçŠ¶æ€
const selectedValues = ref([]); // é€‰æ‹©çš„å€¼
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
            k == 'è”ç³»ç”µè¯' ? submitForm.value.telphone = form.value.field[key][k].value : '';
            k == 'å§“å' ? submitForm.value.fullname = form.value.field[key][k].value : '';
        });
    });

    const res = await axios.post('/form/add_form', submitForm.value)
    if (res.status) {
        ElMessage.success(res.info);
        router.push({ path: '/result/success', query: { title: 'æŠ¥åæˆåŠŸ', description: 'æ‚¨å·²æˆåŠŸæäº¤æŠ¥åä¿¡æ¯' } })
    }
}



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


// å¤„ç†é€‰æ‹©ç¡®è®¤
const onConfirm = (index, ii) => {
    form.value.field[index][ii].value = selectedValues.value[0];
    showPicker.value = false; // å…³é—­å¼¹å‡ºå±‚
};

// å¤„ç†é€‰æ‹©å–æ¶ˆ
const onCancel = () => {
    showPicker.value = false; // å–æ¶ˆæ—¶å…³é—­å¼¹å‡ºå±‚
};

</script>

<style lang="scss">
#app {
    overflow: auto;
    /* å¼ºåˆ¶æ˜¾ç¤ºæ»šåŠ¨æ¡ */
}

.disable-keyboard input {
    caret-color: transparent; /* éšè—å…‰æ ‡ */
    user-select: none; /* ç¦æ­¢é€‰ä¸­æ–‡æœ¬ */
    pointer-events: none; /* ç¦æ­¢ç‚¹å‡» */
}
</style>

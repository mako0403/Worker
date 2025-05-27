<template>
    <div class="h-full">
        <el-container class="h-full">
            <el-container class="h-full">
                <el-main class="h-full p-0 pb-3">
                    <HeaderSimple :content="form.name || '评估表单'" />
                    <div class="flex justify-content-between m-3">
                        <div class="text-xs text-left text-600" v-if="form.create_time">创建时间：{{ moment.unix(form.create_time).format('YYYY-MM-DD') }}</div>
                        <div class="text-xs text-left text-600" v-if="form.update_time">更新时间：{{ moment.unix(form.update_time).format('YYYY-MM-DD') }}</div>
                    </div>
                    <div class="mb-5 border-top-1 border-bottom-1 border-dblue-100 overflow-hidden">
                        <el-collapse v-model="activeNames" @change="handleChange" class="border-none">
                            <el-collapse-item v-for="(items, index, i) in form.field" :key="index" :name="i">
                                <template #title>
                                    <div class="px-3 w-full flex justify-content-between">
                                        <div class="text-dblue-800">{{ index }}</div>
                                        <div class="text-500">{{
                                            formCompleteness[index] > 0 ? `${formCompleteness[index]}%` : '' }}</div>
                                    </div>
                                </template>
                                <div class="p-3 border-left-3 border-right-3 border-dblue-50">
                                    <el-form :model="form.field[index]" label-position="top" label-width="auto"
                                        style="max-width: 100%">
                                        <el-row :gutter="15">
                                            <el-col v-for="(item, ii) in items" :key="ii" :span="item.width" class="">
                                                <el-form-item>
                                                    <template #label>
                                                        <div class="flex justify-content-between">
                                                            <div class="text-md text-dblue-600">{{ ii }}</div>
                                                            <div class="text-xs text-300">{{ item.unit }}</div>
                                                        </div>
                                                    </template>
                                                    <component :is="getComponent(item.type)"
                                                        v-model="form.field[index][ii].value"
                                                        v-bind="getComponentProps(item)" class="w-full">
                                                        
                                                        <template v-if="item.type === 'radio' || item.type === 'checkbox'">
                                                            <el-option v-for="option in item.options.split('|')"
                                                                :key="option" :label="option" :value="option" />
                                                        </template>
                                                    </component>

                                                    <div v-if="item.type === 'upload_images'" class="flex flex-wrap gap-2">
                                                        <div v-for="(url, imgIndex) in form.field[index][ii].value"
                                                            :key="imgIndex" class="mb-2 relative"
                                                            style="width: 100px; height: 100px; position: relative; overflow: hidden; border-radius: 4px; background-color: #f0f0f0;">

                                                            <img :src="url" alt="preview"
                                                                @click="showImagePreview({images:form.field[index][ii].value, startPosition: imgIndex, closeable: true})"
                                                                style="width: 100%; height: 100%; object-fit: cover; display: block;">

                                                            <el-icon
                                                                @click="form.field[index][ii].value.splice(imgIndex, 1)"
                                                                class="absolute bg-blue-900 text-white border-circle p-1 opacity-30"
                                                                style="right: 5px; top: 5px;">
                                                                <CloseBold />
                                                            </el-icon>
                                                        </div>
                                                        <van-uploader v-if="item.type === 'upload_images'"
                                                            style="height:108px; width: 108px;"
                                                            :after-read="(file) => handleUpload(file, index, ii)"
                                                            multiple>
                                                        </van-uploader>
                                                    </div>
                                                    <div class="text-xs text-500">{{ item.description ? '* ' +
                                                        item.description : '' }}</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </div>
                            </el-collapse-item>

                        </el-collapse>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <el-affix position="bottom" :offset="0" class="h-4rem w-full">
            <div class="flex px-4">
                <el-button type="default" class="w-full bg-dblue-500 border-dblue-600 text-dblue-50" size="large"
                    @click="submit">填写完成，保存表单</el-button>
            </div>
        </el-affix>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
import axios from '@/utils/axios'
import { useGlobalStore } from '@/store/global';
const { workerConfig } = toRefs(useGlobalStore());
import { ElMessage } from 'element-plus';
import moment from 'moment';

import { showImagePreview } from 'vant';
import { Uploader as VanUploader, Image as VanImage, ImagePreview as VanImagePreview } from 'vant'
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';
import defaultAvatar from '@@/images/default_avatar.webp'



const activeNames = ref(0)
const handleChange = (val: string[]) => {
    //console.log(val)
}

const abcddd = (val: string[]) => {
    //console.log(val)
}

const form = ref('');
const formCompleteness = ref([]);
const submitForm = ref({
    form_id: 0,
    rules_id: 0,
    worker_id: 0,
    fullname: '',
    telphone: '',
    field: {}
})

const submit = async () => {
    submitForm.value.rules_id = route.params.id
    submitForm.value.worker_id = workerConfig.value.id
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
        router.go(-1)
    }
}

onMounted(async () => {
    const res = await axios.get('form/rules', { id: route.params.id })
    if (res.data) {
        form.value = res.data;
        document.title = res.data.name
    }

    if (route.query.form_id) {
        submitForm.value.form_id = route.query.form_id
        const formRes = await axios.get('form/form_detail', { form_id: route.query.form_id }, { toast: 0 })
        submitForm.value.telphone = formRes.data.telphone
        if (formRes.data.field) {
            form.value.create_time = formRes.data.create_time;
            form.value.update_time = formRes.data.update_time;
            Object.entries(form.value.field).forEach((item, index) => {
                const aaa = Object.entries(item[1]);
                aaa.forEach((sub) => {
                    if (formRes.data.field[sub[0]]) {
                        //console.log(234234234, item[1][sub[0]].type)
                        item[1][sub[0]].value = formRes.data.field[sub[0]]
                    }
                })
            })
            console.log(3424, form.value.field)
            //form.value.field = formRes.data.field
        }
    }
})

watch(() => form.value.field, (newVal) => {
    calculateCompleteness();
}, { deep: true });


const calculateCompleteness = () => {
    const completeness = [];
    for (const [index, group] of Object.entries(form.value.field)) {
        let total = 0;
        let completed = 0;

        for (const item of Object.values(group)) {
            if (item.value && (Array.isArray(item.value) ? item.value.length > 0 : true)) {
                completed++;
            }
            total++;
        }

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        completeness[index] = completionRate;
    }

    formCompleteness.value = completeness;
}


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
            return { placeholder: item.placeholder, filterable: true };
        case 'checkbox':
            const value = typeof item.value === 'string' && item.value.includes(',') ? item.value.split(',').map(value => value.trim()).filter(value => value) : item.value || '';
            return { multiple: true, placeholder: item.placeholder, filterable: true, modelValue: value };
        case 'date':
            return { type: 'date', valueFormat: 'YYYY-MM-DD', placeholder: item.placeholder };
        case 'textarea':
            return { type: 'textarea', rows: 4, placeholder: item.placeholder };
        case 'upload_images':
            return { action: '/upload', multiple: true, listType: 'picture-card' };
        default:
            return { placeholder: item.placeholder };
    }
}

async function handleUpload(file, index, ii) {
    const files = Array.isArray(file) ? file : [file]; // 确保 `files` 是一个数组

    for (const singleFile of files) {
        if (!singleFile.file || !(singleFile.file instanceof Blob)) {
            console.error('Invalid file object:', singleFile);
            continue; // 跳过无效的文件
        }

        // 转换为 Base64
        const base64 = await handleImage(singleFile.file);
        singleFile.url = base64; // 设置 Base64 数据到 singleFile.url
        singleFile.status = 'finished'; // 设置状态为 'finished'

        // 确保 `form.value.field[index][ii].value` 是数组
        if (!Array.isArray(form.value.field[index][ii].value)) {
            form.value.field[index][ii].value = [];
        }

        form.value.field[index][ii].value.push(base64); // 添加到表单数据中
    }

    console.log('Updated form data:', form.value);
}

function handleImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxWidth = 1024;
                const maxHeight = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const base64 = canvas.toDataURL('image/jpeg');
                resolve(base64);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}



</script>
<style>
.van-uploader__upload {
    width: 100px;
    height: 100px;
    background-color: #f8f8fd;
}

.el-collapse-item__header {
    background-color: #f8f8fd;
}

.el-collapse-item__content {
    padding-bottom: 0;
}
</style>
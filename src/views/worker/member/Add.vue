<template>
    <div class="h-full">
        <HeaderSimple content="新增患者档案" />
        <div class="w-full text-center pt-5">
            <van-uploader v-model="avatar" :multiple="false" upload-text="档案头像" :max-count="1" :before-read="beforeRead"
                :max-size="1024 * 1024 * 2" accept="image/*" preview-size="100px"></van-uploader>
        </div>
        <div class="p-3">
            <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
                <el-form-item prop="fullname">
                    <template #label>
                        患者姓名
                    </template>
                    <el-input v-model="form.fullname" size="large" placeholder="请输入患者姓名" />
                </el-form-item>
                <el-form-item prop="telphone">
                    <template #label>
                        <div class="flex justify-content-between align-items-center">
                            <span>手机号码</span>
                            <!-- <span class="text-xs text-gray-500">同时作为患者卡号</span> -->
                        </div>
                    </template>
                    <el-input v-model="form.telphone" type="number" oninput="if(value.length>11)value=value.slice(0,11)" show-word-limit size="large"
                        placeholder="请输入患者手机号码" />
                    <div class="text-gray-500 text-xs ml-3">默认登录密码为手机号后6位</div>
                </el-form-item>
                <el-form-item prop="birthday">
                    <template #label>
                        患者生日
                    </template>
                    <el-date-picker v-model="form.birthday" :default-value="new Date(2000, 5, 1)" value-format="YYYY-MM-DD" :editable="false" size="large" type="date"
                        placeholder="请设置出生日期" class="w-full" />
                </el-form-item>
                <el-divider content-position="center"  border-style="dashed"></el-divider>
                <el-form-item v-if="globalConfig.MEMBER_REMIND_DATE_LABEL[0]">
                    <template #label>
                        {{ globalConfig.MEMBER_REMIND_DATE_LABEL[0] }}
                    </template>
                    <el-date-picker v-model="form.remind_date1" value-format="YYYY-MM-DD" :editable="false" size="large" type="date"
                        :placeholder="`请设置患者${globalConfig.MEMBER_REMIND_DATE_LABEL[0]}`" class="w-full" />
                </el-form-item>
                <el-form-item v-if="globalConfig.MEMBER_REMIND_DATE_LABEL[1]">
                    <template #label>
                        {{ globalConfig.MEMBER_REMIND_DATE_LABEL[1] }}
                    </template>
                    <el-date-picker v-model="form.remind_date2" value-format="YYYY-MM-DD" :editable="false" size="large" type="date"
                        :placeholder="`请设置患者${globalConfig.MEMBER_REMIND_DATE_LABEL[1]}`" class="w-full" />
                </el-form-item>
                <el-form-item v-if="globalConfig.MEMBER_REMIND_DATE_LABEL[2]">
                    <template #label>
                        {{ globalConfig.MEMBER_REMIND_DATE_LABEL[2] }}
                    </template>
                    <el-date-picker v-model="form.remind_date3" value-format="YYYY-MM-DD" :editable="false" size="large" type="date"
                        :placeholder="`请设置患者${globalConfig.MEMBER_REMIND_DATE_LABEL[2]}`" class="w-full" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" @click="handleSubmit"
                        class="w-full bg-dblue-500 border-dblue-700 mt-3">新增患者信息</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { Uploader as vanUploader } from 'vant';
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global'
const { globalConfig, workerConfig } = toRefs(useGlobalStore());
import Compressor from 'compressorjs';
import { blobToBase64 } from "@/utils/common"
import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';

const router = useRouter()
const avatar = ref([]);
const form = ref({
    bid:workerConfig.value.bid,
    worker_id: workerConfig.value.id,
    card_rule: globalConfig.value.MEMBER_DEFAULT_CARD_RULE,
    avatar: '',
    fullname: '',
    telphone: '',
    birthday: '',
    remind_date1: '',
    remind_date2: '',
    remind_date3: '',
})

const rules = {
    fullname: [{ required: true, message: '请填写患者姓名', trigger: 'blur' }],
    telphone: [{ required: true, message: '请填写手机号码', trigger: 'blur' }],
    birthday: [{ required: true, message: '请填写患者生日', trigger: 'blur' }],
};
const formRef = ref(null);
const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (valid) {
            try {
                if (form.value.telphone.length != 11) throw '手机号码必须为11位'
                axios.post('/member/add', form.value).then(res => {
                    if (res.status) {
                        ElMessage.success(`${res.info}`);
                        formRef.value.resetFields();
                        goBack()
                    }
                })
            } catch (error:any) {
                ElMessage.error(`${error}`);
            }
        } else {
            ElMessage.error('请填写完整表单');
        }
    });
};

const handleReset = () => {
    formRef.value.resetFields();
};


const beforeRead = async (file:any) => {
    // 限制文件类型为图片
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return false;
    }

    return new Promise((resolve) => {
        // compressorjs 默认开启 checkOrientation 选项
        // 会将图片修正为正确方向
        new Compressor(file, {
            quality: 0.8,
            width: 760,
            height: 760,
            resize: 'cover',
            success: async (result) => {
                let file1 = new File([result], file.name, { type: file.type })
                form.value.avatar = await blobToBase64(result) as string
                resolve(result);
            },
            error(err) {
                console.log(err.message);
            },
        });
    });

    return true;
};


const goBack = () => {
    // router.go(-1)
    router.go(-1)
}

</script>

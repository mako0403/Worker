<template>
    <div class="w-full h-full relative">
        <div class="layout">
            <div class="">
                <div class="flex align-items-center">
                    <el-icon size="20" class="text-dblue-500">
                        <Files />
                    </el-icon>
                    <div class="font-bold text-xl ml-2">添加患者提醒</div>
                </div>
                <div class="text-gray-400 text-sm mt-1">Add member reminder</div>
            </div>
            <div class="mt-3">
                <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
                    <el-form-item label="患者卡号" prop="card_number">
                        <el-input v-model="form.card_number" :value="cardNumber" size="large" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="提醒日期" prop="remind_date">
                        <el-date-picker v-model="form.remind_date" :editable="false" :disabled-date="disabledDate" value-format="YYYY-MM-DD" type="date" size="large" placeholder="选择提醒日期"
                            class="w-full"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提醒类型" prop="content">
                        <el-radio-group v-model="form.type">
                            <el-radio value="1" size="large">发送提醒消息</el-radio>
                            <el-radio value="2" size="large">仅做备注</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="提醒内容" prop="content">
                        <el-input type="textarea" v-model="form.content" rows="3" placeholder="请输入简短的提醒内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="w-full flex justify-content-between mt-2">
                            <el-button type="primary" size="large" @click="handleSubmit" class="w-full">添加提醒</el-button>
                            <el-button size="large" @click="handleReset" class="w-full">重置表单</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['remindAdded'])
const props = defineProps({
    cardNumber: {
        type: String,
        required: true
    },
    workerId:{
        type: String,
        required: true
    }
})


const form = ref({
    worker_id:'',
    card_number: '',
    remind_date: '',
    type: '1',
    content: ''
});

const rules = {
    remind_date: [{ required: true, message: '请选择提醒日期', trigger: 'blur' }],
    content: [{ required: true, message: '请输入提醒内容', trigger: 'blur' }]
};

const formRef = ref(null);

const handleSubmit = () => {
    formRef.value.validate(valid => {
        if (valid) {
            try {
                form.value.worker_id = props.workerId;
                form.value.card_number = props.cardNumber;
                axios.post('/member/add_remind', form.value).then(res=>{
                    if (res.status) {
                        ElMessage.success(`${res.info}`);
                        emit('remindAdded', true);
                        formRef.value.resetFields();
                    }
                })
            } catch (error) {
                ElMessage.error('提交数据写入失败');
            }
        } else {
            ElMessage.error('请填写完整表单');
        }
    });
};

const handleReset = () => {
    formRef.value.resetFields();
};

// 设置pickerOptions
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()
}
</script>
<style scoped>
.layout {
    height: auto;
    margin: 0 auto;
    padding: 20px;
}
</style>
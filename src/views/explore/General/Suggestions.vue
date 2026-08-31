<template>
    <div class="p-3">
        <div class="mt-3"><span class="bg-gray-300 border-round-2xl mr-2">&nbsp;</span>请您选择建议类型</div>
        <!-- 动态提示内容 -->
        <div v-if="form.type" class="mt-3">
            <el-alert v-if="form.type === '服务体验'" title="请描述您在康复师服务中的体验与建议" type="info" show-icon />
            <el-alert v-else-if="form.type === '康复项目'" title="请填写您对产后康复项目（如盆底康复、乳房护理等）的意见" type="info" show-icon />
            <el-alert v-else-if="form.type === '环境设施'" title="请分享您对环境、设备、卫生、私密性的建议" type="info" show-icon />
            <el-alert v-else-if="form.type === '预约流程'" title="请描述您在预约、挂号、收费流程中的问题或改进建议" type="info" show-icon />
            <el-alert v-else-if="form.type === '价格套餐'" title="请分享您对价格及套餐组合的看法" type="info" show-icon />
            <el-alert v-else title="欢迎填写其他方面的意见与建议" type="info" show-icon />
        </div>
        <div class="flex justify-content-between mt-3">
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '服务体验' }" @click="form.type = '服务体验'">服务体验</div>
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '康复项目' }" @click="form.type = '康复项目'">康复项目</div>
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '环境设施' }" @click="form.type = '环境设施'">环境设施</div>
        </div>
        <div class="flex justify-content-between mt-3">
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '预约流程' }" @click="form.type = '预约流程'">预约流程</div>
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '价格套餐' }" @click="form.type = '价格套餐'">价格套餐</div>
            <div class="bg-gray-50 border-1 border-gray-500 border-round-3xl mx-2 px-4 py-2 text-xs"
                :class="{ 'bg-gray-500 text-white': form.type == '其他建议' }" @click="form.type = '其他建议'">其他建议</div>
        </div>

        <div class="mt-5"><span class="bg-gray-300 border-round-2xl mr-2">&nbsp;</span>建议内容</div>
        <div class="mt-3">
            <el-input v-model="form.content" type="textarea" :rows="4" maxlength="120" show-word-limit placeholder="请输入您的留言" />
        </div>

        <div class="mt-5"><span class="bg-gray-300 border-round-2xl mr-2">&nbsp;</span>姓名及联系电话（选填）</div>
        <div class="mt-3">
            <el-input v-model="form.fullname" maxlength="5" show-word-limit placeholder="请输入您的姓名" class="mb-3" :input-style="{'padding-top':'18px', 'padding-bottom':'18px'}" />
            <el-input v-model="form.telphone" maxlength="11" show-word-limit placeholder="请输入您的联系电话"  :input-style="{'padding-top':'18px', 'padding-bottom':'18px'}"/>
        </div>

        <div class="fixed flex justify-content-between" style="left:15px; right:15px; bottom:15px;">
            <el-button class="flex-1 py-4" type="primary" @click="onSubmit">提交</el-button>
            <el-button class="flex-1 py-4" @click="onReset">重置</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject, watch, readonly } from "vue";
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route, isLoadedPage, ElMessage } = useGlobal();





const form = reactive({
    type: '',
    content: '',
    fullname: '',
    telphone: '',
})

const onSubmit = async () => {
    if (!form.type) {
        ElMessage.error('请选择建议类型')
        return
    }
    if (!form.content) {
        ElMessage.error('请输入建议内容')
        return
    }
    // 模拟提交
    const {data} = await axios.post('/suggestions/submit', form)
    ElMessage.success('提交成功，感谢您的反馈！')
    onReset()
}


const onReset = () => {
    form.type = ''
    form.content = ''
    form.fullname = ''
    form.telphone = ''
}
</script>


<style scoped></style>
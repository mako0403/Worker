<template>
    <div class="p-3">
        <div class="mt-3 font-bold text-lg"><span class="bg-gray-300 border-round-2xl mr-2">&nbsp;</span>匿名意见反馈查看</div>
        <van-cell-group class="mt-3">
            <van-cell title="反馈类型" :value="suggestion.type" />
            <van-cell title="反馈人" v-if="suggestion.fullname" :value="suggestion.fullname" />
            <van-cell title="联系电话" v-if="suggestion.telphone" :value="suggestion.telphone" />
            <van-cell title="反馈内容：" :label="suggestion.content" />
            
        </van-cell-group>


        <div class="my-3 border-1 border-round-lg border-gray-300 p-3">
            <div class="mb-3 text-xs text-800">回复反馈</div>
            <van-field v-model="replyContent" rows="3" autosize type="textarea" maxlength="200" placeholder="请输入回复内容"
                show-word-limit class="p-0" />
        </div>
        <van-button type="primary" size="normal" @click="submit()" block>立即回复</van-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject, watch, readonly } from "vue";
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route, isLoadedPage, ElMessage } = useGlobal();

import { CellGroup as vanCellGroup, Cell as vanCell, Field as vanField, Button as vanButton } from 'vant';

const suggestion = ref([]);
const replyContent = ref('')

onMounted(async () => {
    const { data } = await axios.get('/suggestions/show', { id: route.params.id });

    suggestion.value = data;
});

const submit = async () => {
    if (!replyContent.value) {
        ElMessage.error('请输入回复内容');
        return;
    }
    await axios.post('/suggestions/reply', { id: route.params.id, reply: replyContent.value });
    ElMessage.success('回复成功');
    replyContent.value = '';
    //router.back();
}

</script>


<style scoped>
:deep(.van-cell__label) {
    color: var(--red-600);
    font-size: 15px;
    line-height: 150%;
    margin-top: 8px;
}

:deep(.van-cell__value) span {
    color: var(--green-600)
}
</style>
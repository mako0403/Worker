<template>
    <div class="pt-8">
        <div class="mt-8" v-if="route.params.status == 'success'">
            <el-result icon="success" :title="route.query.title?route.query.title:'操作成功'" :sub-title="route.query.description?route.query.description:'已成功提交表单内容'">
                <template #extra>
                    <el-button type="primary" @click="router.go(-1)">返回</el-button>
                </template>
            </el-result>
        </div>
        <div class="mt-8" v-if="route.params.status == 'warning'">
            <el-result icon="warning" :title="route.query.title?route.query.title:'警告'" :sub-title="route.query.description?route.query.description:'请阅读警告内容'">
                <template #extra>
                    <el-button type="primary" @click="router.go(-1)">返回</el-button>
                </template>
            </el-result>
        </div>
        <div class="mt-8" v-if="route.params.status == 'error'">
            <el-result icon="error" :title="route.query.title?route.query.title:'操作失败'" :sub-title="route.query.description?route.query.description:'请根据提示正确操作'">
                <template #extra>
                    <el-button type="primary" @click="router.go(-1)">返回</el-button>
                </template>
            </el-result>
        </div>
        <div class="mt-8" v-if="route.params.status == 'info'">
            <el-result icon="info" :title="route.query.title?route.query.title:'Info Tip'">
                <template #sub-title>
                    <p>Using slot as subtitle</p>
                </template>
                <template #extra>
                    <el-button type="primary" @click="router.go(-1)">返回</el-button>
                </template>
            </el-result>
        </div>
    </div>
    <div class="absolute opacity-50 z-0" style="bottom:-5px; left:0; right:0;">
        <img alt="Vue logo" class="logo" src="@@/svg/bottom.svg" width="100%" />
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
const router = useRouter();
const route = useRoute();


onMounted(async () => {
    document.title = route.query.title?route.query.title:'结果通知'
})


</script>
<style lang="scss">
.h-full {
    background-color: #f3faff !important; /* 强制显示滚动条 */
}
</style>

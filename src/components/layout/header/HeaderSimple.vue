<template>
    <el-header class="px-3 flex align-items-center border-top-1 border-gray-50">
        <el-page-header @back="goBack">
            <!-- <template #icon>
                <el-icon>
                    <ArrowLeft />
                </el-icon>
            </template> -->
            <template #content>
                <span class="text-large font-600 text-900 mr-3"> {{ content }} </span>
            </template>
        </el-page-header>
    </el-header>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();

const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

const goBack = () => {
    router.go(-1)
}


</script>
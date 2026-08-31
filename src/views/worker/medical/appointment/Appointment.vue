<template>
    <div class="common-layout h-full">
        <el-scrollbar height="100%">
            <div class="">
                <div class="px-3">
                    <Info />
                </div>
                <div class="mt-5 px-3">
                    <Lists />
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from "vue";
import Info from "@/views/worker/medical/appointment/Info.vue";
import Lists from "@/views/worker/medical/appointment/Lists.vue";
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route, ElMessage, showLoading, hideLoading } = useGlobal();



onMounted(async () => {

})



</script>
<style lang="scss" scoped></style>
<template>
    <div class="">
        <el-result v-if="payDeal" class="mt-8 clear">
            <template #icon>
                <el-image src="/images/wechat_pay.png" />
            </template>
            <template #title>
                <div class="text-lg text-600">{{ payDeal.title }}</div>
                <div class="text-900 mt-3 mb-1">￥<span class="text-2xl ml-1 font-bold">{{ payDeal.total_fee }}</span></div>
            </template>
            <template #sub-title>
                <div class="text-xs text-400">请点击立即支付按钮完成支付</div>
            </template>
            <template #extra>
                <el-button type="success" size="large" @click="pay()">立即支付</el-button>
                <div class="text-400 text-sm mt-3" @click="router.go(-1)">返回</div>
            </template>
        </el-result>
        <div v-else class="mt-8">
            <el-result icon="info" title="无效支付交易">
                <template #sub-title>
                    <p>该笔支付交易已付款或已失效</p>
                </template>
                <template #extra>
                    <el-button type="primary" @click="router.go(-1)">返回上一页</el-button>
                </template>
            </el-result>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from '@/utils/axios'

import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();
import { useRoute, useRouter, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()

import wechatJs from "@/utils/wechatJs";
import WeChatAuth from "@/utils/wechatAuth";

const payDeal = ref([])
const wechat = new wechatJs();
const weChatAuth = new WeChatAuth(window.location.href, globalStore.replace);


onMounted(async () => {
    try {
        const params = {
            bill_no: route.params.no
        }
        const { data } = await axios.get('/payment/pending_pay', params)
        payDeal.value = data
    } catch (error) {
        payDeal.value = null;
    }
})

const pay = async () => {
    if(!globalStore.memberInfo.openid){
        ElMessage.error('无法识别有效微信用户身份')
        return;
    }
    if (weChatAuth.isWeChatBrowser()) {
        await wechat.init();
        wechat.payOrder({
            bill_no: payDeal.value.bill_no,
            openid: globalStore.memberInfo.openid
        }).then(res=>{
            router.go(-1);
        }).catch(err=>{
            console.log(err)
        });
    }else{
        ElMessage.error('请在微信中进行支付！')
    }
}



</script>

<style scoped></style>
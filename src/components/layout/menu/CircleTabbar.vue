<template>
    <div
        class="w-full surface-0 border-top-1 border-gray-100"
        style="height:56px;"
    >
        <div class="h-full flex justify-content-around align-items-center px-2">

            <!-- 贴文流 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('circle_post_list') ? 'text-purple-500' : 'text-400'"
                @click="go('/member/circle')"
            >
                <van-icon :name="isActive('circle_post_list') ? 'fire' : 'fire-o'" size="22" />
                <span style="font-size:10px;line-height:1;">圈子</span>
            </div>

            <!-- 专家列表 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('circle_expert_list') ? 'text-purple-500' : 'text-400'"
                @click="go('/member/circle/experts')"
            >
                <van-icon :name="isActive('circle_expert_list') ? 'manager' : 'manager-o'" size="22" />
                <span style="font-size:10px;line-height:1;">专家</span>
            </div>

            <!-- 中间：发布按钮 -->
            <div class="flex flex-column align-items-center justify-content-center flex-1">
                <div
                    class="flex align-items-center justify-content-center border-circle shadow-2 cursor-pointer"
                    style="width:46px;height:46px;margin-top:-18px;background:linear-gradient(135deg,#7c5cbf,#e05c8a);"
                    @click="goCreate"
                >
                    <van-icon name="plus" size="22" color="#fff" />
                </div>
                <span
                    class="text-purple-500"
                    style="font-size:10px;line-height:1;margin-top:3px;"
                >发布</span>
            </div>

            <!-- 我的贴文（预留）-->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1 text-400"
                @click="go('/member/aichat')"
            >
                <van-icon name="comment-o" size="22" />
                <span style="font-size:10px;line-height:1;">妈妈智问</span>
            </div>

            <!-- 返回主菜单 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1 text-400"
                @click="go('/member')"
            >
                <van-icon name="user-circle-o" size="22" />
                <span style="font-size:10px;line-height:1;">会员中心</span>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCircleStore } from '@/store/circle'
import { ElMessage } from 'element-plus'

const route       = useRoute()
const router      = useRouter()
const circleStore = useCircleStore()

function isActive(routeName: string): boolean {
    return route.name === routeName
}

function go(routeName: string) {
    if (route.name !== routeName) router.push({ path: routeName })
}

function goCreate() {
    if (!circleStore.isLogged) { ElMessage.error('请先登录'); return }
    router.push({ name: 'circle_post_create' })
}

function goMyPosts() {
    // 预留：跳转到我的贴文页
    // router.push({ name: 'circle_my_posts' })
    //showToast('功能开发中')
    ElMessage.warning('功能开发中');
}

function goHome() {
    router.push({ name: 'home' })
}
</script>
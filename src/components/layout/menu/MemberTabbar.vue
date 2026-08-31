<template>
    <div
        class="w-full surface-0 border-top-1 border-gray-100"
        style="height:56px;"
    >
        <div class="h-full flex justify-content-around align-items-center px-2">

            <!-- 会员中心 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('/member') ? 'text-purple-500' : 'text-400'"
                @click="go('/member')"
            >
                <van-icon :name="isActive('/member') ? 'contact' : 'user-circle-o'" size="22" />
                <span style="font-size:10px;line-height:1;">会员中心</span>
            </div>

            <!-- 我的服务 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('/member/medical/appointment') ? 'text-purple-500' : 'text-400'"
                @click="go('/member/medical/appointment')"
            >
                <van-icon :name="isActive('/member/medical/appointment') ? 'notes' : 'notes-o'" size="22" />
                <span style="font-size:10px;line-height:1;">我的服务</span>
            </div>

            <!-- 中间：圈子快捷入口 -->
            <div class="flex flex-column align-items-center justify-content-center flex-1">
                <div
                    class="flex align-items-center justify-content-center border-circle shadow-2 cursor-pointer"
                    style="width:46px;height:46px;margin-top:-18px;background:linear-gradient(135deg,#7c5cbf,#e05c8a);"
                    @click="go('/member/circle')"
                >
                    <van-icon name="fire-o" size="20" color="#fff" />
                </div>
                <span
                    class="text-purple-500"
                    style="font-size:10px;line-height:1;margin-top:3px;"
                >圈子</span>
            </div>

            <!-- 运动康复 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('/member/workout') ? 'text-purple-500' : 'text-400'"
                @click="go('/member/workout/plan')"
            >
                <van-icon :name="isActive('/member/workout') ? 'medal' : 'medal-o'" size="22" />
                <span style="font-size:10px;line-height:1;">运动康复</span>
            </div>

            <!-- 妈妈智问 -->
            <div
                class="flex flex-column align-items-center justify-content-center gap-1 cursor-pointer flex-1"
                :class="isActive('/member/aichat') ? 'text-purple-500' : 'text-400'"
                @click="go('/member/aichat')"
            >
                <van-icon :name="isActive('/member/aichat') ? 'chat' : 'chat-o'" size="22" />
                <span style="font-size:10px;line-height:1;">妈妈智问</span>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

// 路由激活判断：前缀匹配（除首页精确匹配）
function isActive(path: string): boolean {
    if (path === '/member') return route.path === '/member'
    return route.path.startsWith(path)
}

function go(path: string) {
    if (route.path !== path) router.push(path)
}
</script>
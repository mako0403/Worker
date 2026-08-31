<template>
    <!-- ── 模式一：首页 Header ────────────────────────────────── -->
    <template v-if="!headerConfig">
        <div class="h-full flex justify-content-between align-items-center px-3 border-top-1 border-gray-50">
            <div>
                <el-badge :is-dot="remind ? true : false">
                    <el-icon size="18" class="text-500" :class="{ 'bell text-800': remind }">
                        <Bell />
                    </el-icon>
                </el-badge>
            </div>
            <div><img :src="logoText" height="26px" /></div>
            <div>
                <el-icon size="18" @click="menuDrawer = true">
                    <Setting />
                </el-icon>
            </div>
        </div>

        <!-- 首页设置抽屉 -->
        <el-drawer v-model="menuDrawer" size="65%" :show-close="true" :with-header="false">
            <div class="text-center border-round-lg" style="background-color: #fefefe;">
                <img :src="logoIcon" width="65%">
            </div>
            <div class="mt-5 mx-2">
                <div class="mb-5">
                    <div class="flex align-items-center" @click="handleLogout">
                        <el-icon size="21" class="text-dblue-300 mr-2"><SwitchButton /></el-icon>
                        <div class="text-dblue-500 text-md">退出登录</div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </template>

    <!-- ── 模式二：通用导航 Header ────────────────────────────── -->
    <template v-else>
        <div class="nav-header h-full">

            <!-- 左侧 -->
            <div class="nav-left">
                <span
                    v-if="headerConfig.leftAction !== 'none'"
                    class="nav-btn"
                    @click="onLeftClick"
                >
                    <van-icon name="arrow-left" size="20" />
                </span>
            </div>

            <!-- 中间标题 -->
            <div class="nav-center">
                <div v-if="headerConfig.title=='none'"></div>
                <span v-else-if="headerConfig.title!='logo' && headerConfig.title" class="nav-title">{{ headerConfig.title }}</span>
                <div v-else><img :src="logoText" height="26px" /></div>
            </div>

            <!-- 右侧 -->
            <div class="nav-right">
                <!-- 有 rightMenu → 图标点击打开菜单 drawer -->
                <span
                    v-if="headerConfig.rightMenu?.length"
                    class="nav-btn"
                    @click="actionDrawer = true"
                >
                    <van-icon :name="headerConfig.rightIcon || 'ellipsis'" size="22" />
                </span>

                <!-- 无 rightMenu + 有 rightIcon → 普通图标按钮 -->
                <span
                    v-else-if="headerConfig.rightIcon"
                    class="nav-btn"
                    @click="onRightClick"
                >
                    <van-icon :name="headerConfig.rightIcon" size="20" />
                </span>

                <!-- 无 rightMenu + 有 rightText → 文字按钮 -->
                <span
                    v-else-if="headerConfig.rightText"
                    class="nav-btn nav-btn--text"
                    @click="onRightClick"
                >
                    {{ headerConfig.rightText }}
                </span>
            </div>
        </div>

        <!-- ── 右侧操作菜单 Drawer（从底部弹出）─────────────── -->
        <el-drawer
            v-model="actionDrawer"
            direction="btt"
            :with-header="false"
            :size="actionDrawerHeight"
            class="action-drawer"
        >
            <!-- 标题 -->
            <div class="drawer-title">
                {{ headerConfig.rightMenuTitle || '请选择操作' }}
            </div>

            <!-- 菜单项列表 -->
            <div class="drawer-menu">
                <div
                    v-for="item in headerConfig.rightMenu"
                    :key="item.action"
                    class="drawer-item"
                    :style="item.color ? { color: item.color } : {}"
                    @click="onMenuItemClick(item)"
                >
                    <van-icon
                        v-if="item.icon"
                        :name="item.icon"
                        size="20"
                        :color="item.color || '#555'"
                        class="drawer-item-icon"
                    />
                    <span class="drawer-item-label">{{ item.label }}</span>
                </div>
            </div>

            <!-- 取消 -->
            <div class="drawer-cancel" @click="actionDrawer = false">取消</div>
        </el-drawer>
    </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/store/global'
import { logout } from '@/utils/axios'
import emitter from '@/utils/emitter'
import logoText from '@@/images/logo_text.png'
import logoIcon from '@@/images/logo.png'

const route  = useRoute()
const router = useRouter()

// ── 读取路由 meta.header 配置 ─────────────────────────────────
// null = 首页模式；有值 = 通用导航模式
const headerConfig = computed(() => (route.meta.header as any) ?? null)

// ── 右侧菜单 Drawer ───────────────────────────────────────────
const actionDrawer = ref(false)

// 动态高度：标题56 + 每项60 + 取消64 + 底部安全区16
const actionDrawerHeight = computed(() => {
    const count = headerConfig.value?.rightMenu?.length ?? 0
    return `${56 + count * 60 + 64 + 16}px`
})

// 菜单项点击 → 关闭 drawer → emit action
function onMenuItemClick(item: {
    label:   string
    icon?:   string
    action:  string
    color?:  string
}) {
    actionDrawer.value = false
    // 等 drawer 关闭动画完成后再触发，避免动画卡顿
    setTimeout(() => {
        emitter.emit('header-right-click', item.action)
    }, 150)
}

// ── 普通右侧按钮点击（非 menu 模式）──────────────────────────
function onRightClick() {
    const cfg = headerConfig.value
    if (cfg?.rightTo) {
        router.push({ name: cfg.rightTo })
    } else if (cfg?.rightAction) {
        emitter.emit('header-right-click', cfg.rightAction)
    }
}

// ── 左侧按钮点击 ──────────────────────────────────────────────
function onLeftClick() {
    const cfg = headerConfig.value
    if (cfg?.leftTo) {
        router.push({ name: cfg.leftTo })
    } else {
        router.back()
    }
}

// ── 首页 Header 专用逻辑 ──────────────────────────────────────
const menuDrawer = ref(false)
const remind     = ref(null)

onMounted(() => {
    // getRemindLists() 按需开启
})

function handleLogout() {
    logout()
}
</script>

<style scoped lang="scss">
/* ── 首页铃铛动画 ──────────────────────────────────────────── */
.bell { animation: shake 1s infinite; }

@keyframes shake {
    0%   { transform: rotate(0deg);   }
    10%  { transform: rotate(20deg);  }
    20%  { transform: rotate(0deg);   }
    30%  { transform: rotate(-20deg); }
    40%  { transform: rotate(0deg);   }
    50%  { transform: rotate(20deg);  }
    60%  { transform: rotate(0deg);   }
    70%  { transform: rotate(-20deg); }
    80%  { transform: rotate(0deg);   }
    100% { transform: rotate(0deg);   }
}

/* ── 通用导航 Header ───────────────────────────────────────── */
.nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
}

.nav-left,
.nav-right {
    width: 48px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.nav-right { justify-content: flex-end; }

.nav-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #333;
    padding: 8px;

    &:active { opacity: 0.6; }
}

.nav-btn--text {
    font-size: 14px;
    color: #764ba2;
    font-weight: 600;
    padding: 4px 0;
}

.nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 120px);

    .nav-title {
        font-size: 17px;
        font-weight: 700;
        color: #1a1a1a;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
    }
}

/* ── 操作菜单 Drawer ───────────────────────────────────────── */
.action-drawer {
    :deep(.el-drawer__body) {
        padding: 0;
        display: flex;
        flex-direction: column;
    }
}

.drawer-title {
    text-align: center;
    font-size: 13px;
    color: #bbb;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
    flex-shrink: 0;
}

.drawer-menu {
    flex: 1;
}

.drawer-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 24px;
    height: 60px;
    cursor: pointer;
    color: #333;
    font-size: 16px;
    border-bottom: 1px solid #f8f8f8;
    transition: background 0.15s;

    &:active { background: #f5f5f5; }
    &:last-child { border-bottom: none; }

    .drawer-item-icon  { flex-shrink: 0; }
    .drawer-item-label { flex: 1; }
}

.drawer-cancel {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    border-top: 8px solid #f5f5f5;
    flex-shrink: 0;

    &:active { background: #f5f5f5; }
}
</style>
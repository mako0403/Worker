// src/composables/useHeaderAction.ts
import { onMounted, onUnmounted } from 'vue'
import emitter from '@/utils/emitter'

/**
 * 监听 Header 右侧按钮点击
 * 自动在组件挂载时注册，卸载时清理，无需手动 on/off
 *
 * @param action   对应 meta.header.rightAction 的值
 * @param callback 触发时执行的函数
 *
 * @example
 * useHeaderAction('submit', onSubmit)
 * useHeaderAction('filter', openFilterDrawer)
 * useHeaderAction('more',   openMoreMenu)
 */
export function useHeaderAction(action: string, callback: () => void) {
    function handler(incoming: string) {
        if (incoming === action) callback()
    }
    onMounted(()   => emitter.on('header-right-click', handler))
    onUnmounted(() => emitter.off('header-right-click', handler))
}
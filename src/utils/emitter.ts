// src/utils/emitter.ts
// 全局事件总线，基于 mitt
// 用于跨组件通信，当前主要用于 Header 右侧按钮 → 页面组件

import mitt from 'mitt'

// ── 事件类型定义 ──────────────────────────────────────────────
type Events = {
    // Header 右侧按钮点击事件
    // payload 为 meta.header.rightAction 的值
    'header-right-click': string

    // 预留：日后其他全局事件可在此扩展
    // 'global-refresh': void
    // 'toast-message': string
}

const emitter = mitt<Events>()

export default emitter
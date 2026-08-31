// ============================================================
//  router/index.ts — 路由 Meta 类型声明 & 使用文档
//  放在文件最顶部，import 之前
// ============================================================

// ── Meta 类型扩展 ─────────────────────────────────────────────

/**
 * Header 右侧菜单项（用于 rightMenu 折叠菜单模式）
 */
interface HeaderMenuItem {
    /** 菜单项文字 */
    label: string
    /** Vant icon name，可选
     *  常用值: 'share-o' | 'star-o' | 'edit' | 'delete-o' |
     *          'warning-o' | 'setting-o' | 'filter-o' | 'plus'
     */
    icon?: string
    /** 点击后触发的 action 名称，页面用 useHeaderAction(action, fn) 监听 */
    action: string
    /** 文字和图标颜色，危险操作建议用 '#f56c6c' */
    color?: string
}

/**
 * 顶部导航栏配置
 *
 * 使用场景：
 *   - 路由 meta 中不写 header 字段 → 显示首页默认 Header（铃铛+Logo+设置）
 *   - 路由 meta 中写了 header 字段 → 显示通用导航 Header（返回+标题+右侧按钮）
 *
 * 右侧按钮三种模式（优先级从高到低）：
 *   1. rightMenu 有值  → 折叠菜单（el-drawer 从底部弹出）
 *   2. rightIcon 有值  → 单个图标按钮
 *   3. rightText 有值  → 单个文字按钮
 *
 * 右侧点击行为（rightMenu 模式下每项单独配置 action）：
 *   - rightTo      → 直接跳转路由，无需页面监听
 *   - rightAction  → 通过 mitt 通知页面，页面用 useHeaderAction() 监听
 *
 * 页面监听示例：
 *   import { useHeaderAction } from '@/composables/useHeaderAction'
 *   useHeaderAction('submit', onSubmit)      // 监听单个 action
 *   useHeaderAction('share',  onShare)       // 菜单项各自监听
 */
interface HeaderConfig {
    // ── 中间标题 ────────────────────────────────────────────
    /** 显示在 Header 中间的页面标题 */
    title?: string

    // ── 左侧区域 ────────────────────────────────────────────
    /**
     * 左侧按钮类型
     * - 'back'（默认）显示返回键，点击执行 router.back() 或跳转 leftTo
     * - 'none'         左侧空白，适合首页/主 Tab 页
     */
    leftAction?: 'back' | 'none'

    /**
     * 左侧返回键的目标路由 name（可选）
     * 不填则执行 router.back()
     * 适合：需要指定返回目标而不是返回上一页的场景
     * 例：'circle_post_list'
     */
    leftTo?: string

    // ── 右侧区域 ────────────────────────────────────────────
    /**
     * 右侧图标按钮（Vant icon name）
     * - 单按钮模式：配合 rightTo 或 rightAction 使用
     * - 菜单模式：配合 rightMenu 使用，作为触发菜单的图标（默认 'ellipsis'）
     *
     * 常用值：
     *   'edit'        编辑 / 发布入口
     *   'ellipsis'    更多菜单（···）
     *   'search'      搜索
     *   'plus'        新增
     *   'delete-o'    删除
     *   'share-o'     分享
     *   'setting-o'   设置
     *   'filter-o'    筛选
     *   'star-o'      收藏
     *   'warning-o'   举报 / 警告（配合 color: '#f56c6c'）
     */
    rightIcon?: string

    /**
     * 右侧文字按钮（rightIcon 未填时生效）
     * 常用值：'发布' | '完成' | '保存' | '确认' | '提交'
     */
    rightText?: string

    /**
     * 右侧按钮点击后跳转的路由 name（适合纯跳转，无需页面参与）
     * 例：'circle_post_create'
     * 注意：rightMenu 模式下此字段无效，每项菜单单独配置 action
     */
    rightTo?: string

    /**
     * 右侧按钮点击后触发的 action 名称（适合需要页面处理的逻辑）
     * Header 会通过 mitt emit('header-right-click', action)
     * 页面用 useHeaderAction(action, fn) 监听
     * 例：'submit' | 'save' | 'confirm' | 'filter'
     * 注意：rightMenu 模式下此字段无效，每项菜单单独配置 action
     */
    rightAction?: string

    /**
     * 折叠菜单项列表（有值时右侧自动切换为菜单模式）
     * 点击右侧图标从底部弹出 el-drawer 菜单
     * 每项点击后触发对应 item.action，页面分别监听
     */
    rightMenu?: HeaderMenuItem[]

    /**
     * 折叠菜单顶部标题（rightMenu 模式下显示）
     * 默认值：'请选择操作'
     */
    rightMenuTitle?: string
}

/**
 * 路由 Meta 完整类型
 *
 * ── 快速配置参考 ──────────────────────────────────────────────
 *
 * 预设常量（在 meta 对象之前定义，直接展开使用）：
 *   DEFAULT_META  requiresAuth:true  showHeader:true  showTabbar:true
 *   PAGE          requiresAuth:true  showHeader:true  showTabbar:false
 *   PAGE_TAB      requiresAuth:true  showHeader:true  showTabbar:true（有tabbar无特殊header）
 *
 * ── Header 配置示例 ───────────────────────────────────────────
 *
 * // 首页默认 Header（不写 header 字段）
 * meta: { ...DEFAULT_META, title: '个人中心' }
 *
 * // 普通详情页（返回键 + 标题）
 * meta: { ...PAGE, showHeader: true, header: { title: '详情', leftAction: 'back' } }
 *
 * // 带发布按钮（跳转）
 * meta: { ...DEFAULT_META, showHeader: true, header: {
 *     title: '圈子', leftAction: 'none',
 *     rightIcon: 'edit', rightTo: 'circle_post_create'
 * }}
 *
 * // 带提交按钮（页面处理）
 * meta: { ...PAGE, showHeader: true, header: {
 *     title: '发布贴文', leftAction: 'back',
 *     rightText: '发布', rightAction: 'submit'
 * }}
 * // 页面内：useHeaderAction('submit', onSubmit)
 *
 * // 带折叠菜单
 * meta: { ...PAGE, showHeader: true, header: {
 *     title: '贴文详情', leftAction: 'back',
 *     rightIcon: 'ellipsis', rightMenuTitle: '更多操作',
 *     rightMenu: [
 *         { label: '分享', icon: 'share-o',   action: 'share'  },
 *         { label: '收藏', icon: 'star-o',    action: 'collect'},
 *         { label: '举报', icon: 'warning-o', action: 'report', color: '#f56c6c' },
 *     ]
 * }}
 * // 页面内：
 * // useHeaderAction('share',   onShare)
 * // useHeaderAction('collect', onCollect)
 * // useHeaderAction('report',  onReport)
 */
interface AppRouteMeta {
    /** 页面标题（浏览器标签 + Header 标题来源） */
    title?: string
    /** 是否需要登录，默认 true */
    requiresAuth?: boolean
    /** 是否显示顶部 Header，默认 true */
    showHeader?: boolean
    /** 是否显示底部 Tabbar，默认 false */
    showTabbar?: boolean
    /** 返回时记录当前路径到 globalStore.replace */
    replaceBack?: boolean
    /**
     * 额外权限控制（worker 端使用）
     * 可选值：'branchManager' | 'officeManager' | 'expert'
     * 不填 = 登录即可访问
     */
    permissions?: string[]
    /** 顶部导航栏配置，不填则显示首页默认 Header */
    header?: HeaderConfig
    /** 用于控制底部导航显示 */
    tabbarType?: 'default' | 'circle'
}

// TypeScript 模块扩展：让 vue-router 的 route.meta 有类型提示
declare module 'vue-router' {
    interface RouteMeta extends AppRouteMeta { }
}

// ── 以下是正常的 import 和路由配置 ───────────────────────────


import { createRouter, createWebHistory, type RouteRecordRaw, type RouteMeta } from 'vue-router'
import { useGlobalStore } from '@/store/global'
import Cookies from 'js-cookie'
import axios from '@/utils/axios'
import Header from '@/components/layout/header/Header.vue'

// ─── Typen ────────────────────────────────────────────────────────────────────

type Permission = 'branchManager' | 'officeManager'

interface AppRouteMeta extends RouteMeta {
    title?: string
    requiresAuth?: boolean
    permissions?: Permission[]
    replaceBack?: boolean
    showHeader?: boolean
    showTabbar?: boolean
}

// ─── Meta-Defaults ────────────────────────────────────────────────────────────

const DEFAULT_META: AppRouteMeta = {
    requiresAuth: true,
    permissions: undefined,
    replaceBack: false,
    showHeader: true,
    showTabbar: true,
}

/** Kurzform: Auth-Seiten ohne Header/Tabbar */
const PAGE: AppRouteMeta = { ...DEFAULT_META, showHeader: false, showTabbar: false }
/** Kurzform: Auth-Seiten ohne Header, aber mit Tabbar */
const PAGE_TAB: AppRouteMeta = { ...DEFAULT_META, showHeader: false, showTabbar: true }

// ─── Routen ───────────────────────────────────────────────────────────────────

const routes: RouteRecordRaw[] = [
    // Worker
    {
        path: '/',
        name: 'worker',
        component: () => import('../views/worker/Root.vue'),
        meta: DEFAULT_META,
        children: [
            { path: '/worker', name: 'appointment', component: () => import('../views/worker/medical/appointment/Appointment.vue'), meta: { ...DEFAULT_META, title: '预约管理' } },
            { path: '/worker/appointment/archive/:id', name: 'appointment_archive', component: () => import('../views/worker/medical/appointment/Archive.vue'), meta: { ...PAGE, title: '治疗记录' } },
            { path: '/worker/member/lists', name: 'member_lists', component: () => import('../views/worker/member/Lists.vue'), meta: { ...PAGE_TAB, title: '患者列表' } },
            { path: '/worker/member/add', name: 'member_add', component: () => import('../views/worker/member/Add.vue'), meta: { ...PAGE, title: '新增患者' } },
            { path: '/worker/member/interaction', name: 'member_interaction', component: () => import('../views/worker/member/Interaction.vue'), meta: { ...DEFAULT_META, title: '互动' } },
            { path: '/worker/member/record/:rule_id', name: 'member_record_lists', component: () => import('../views/worker/member/RecordLists.vue'), meta: { ...PAGE_TAB, title: '会员记录' } },
            { path: '/worker/services/sales_records', name: 'sales_records', component: () => import('../views/worker/services/SalesRecords.vue'), meta: { ...PAGE_TAB, title: '收费记录查询' } },
            { path: '/worker/services/usage_records', name: 'usage_records', component: () => import('../views/worker/services/UsageRecords.vue'), meta: { ...PAGE_TAB, title: '患者预约记录查询' } },
            { path: '/worker/medical/sales', name: 'medical_sales', component: () => import('../views/worker/medical/Sales.vue'), meta: { ...PAGE, title: '项目收费' } },
            { path: '/worker/video/lists', name: 'video_lists', component: () => import('../views/worker/video/Lists.vue'), meta: { ...PAGE_TAB, title: '视频资源库' } },
            { path: '/worker/video/record/:card_number?', name: 'video_record', component: () => import('../views/worker/video/Record.vue'), meta: { ...PAGE_TAB, title: '播放记录' } },
            { path: '/worker/medical/assessment/:id/:readonly?', name: 'assessment', component: () => import('../views/worker/medical/Assessment.vue'), meta: { ...PAGE, title: '评估表单' } },
            { path: '/worker/settings/offday', name: 'settings_offday', component: () => import('../views/worker/settings/Offday.vue'), meta: { ...PAGE, title: '设置休息日' } },
            { path: '/worker/remind', name: 'remind', component: () => import('../views/worker/settings/Remind.vue'), meta: { ...PAGE, title: '消息通知' } },
            { path: '/worker/assistant/aichat', name: 'assistant_aichat', component: () => import('../views/worker/assistant/AiChat.vue'), meta: { ...DEFAULT_META, title: 'AI助手', showTabbar: false } },
            // Manager (Berechtigungspflichtig)
            { path: '/worker/manager/overview', name: 'manager_overview', component: () => import('../views/worker/manager/Overview.vue'), meta: { ...PAGE_TAB, title: '总览', permissions: ['officeManager'] } },
            { path: '/worker/manager/branch', name: 'manager_branch', component: () => import('../views/worker/manager/Branch.vue'), meta: { ...PAGE_TAB, title: '门店', permissions: ['branchManager', 'officeManager'] } },
            { path: '/worker/manager/worker', name: 'manager_worker', component: () => import('../views/worker/manager/Worker.vue'), meta: { ...PAGE_TAB, title: '员工', permissions: ['officeManager'] } },
            { path: '/worker/manager/Services', name: 'manager_Services', component: () => import('../views/worker/manager/Services.vue'), meta: { ...PAGE_TAB, title: '服务', permissions: ['officeManager'] } },
            { path: '/worker/manager/member', name: 'manager_member', component: () => import('../views/worker/manager/Member.vue'), meta: { ...PAGE_TAB, title: '会员', permissions: ['officeManager'] } },
        ],
    },

    // Member
    {
        path: '/member',
        name: 'member',
        component: () => import('../views/member/Root.vue'),
        meta: DEFAULT_META,
        children: [
            { path: '/member', name: 'home', component: () => import('../views/member/central/Home.vue'), meta: { ...DEFAULT_META, title: '个人中心' } },
            { path: '/member/medical/appointment', name: 'member_medical_appointment', component: () => import('../views/member/medical/Appointment.vue'), meta: { ...PAGE, title: '预约服务', showTabbar: true } },
            { path: '/member/medical/appointment/lists', name: 'member_medical_appointment_lists', component: () => import('../views/member/medical/AppointmentLists.vue'), meta: { ...PAGE, title: '我的预约' } },
            { path: '/member/workout/plan', name: 'member_workout_plan', component: () => import('../views/member/workout/Plan.vue'), meta: { ...PAGE, title: '运动计划', showTabbar: true } },
            // 特殊公开访问路由（例如凯格尔训练），不要求登录
            {
                path: '/member/workout/plan/details/:i(6)',
                name: 'member_workout_plan_details_public',
                component: () => import('../views/member/workout/PlanDetails.vue'),
                meta: { ...PAGE, title: '凯格尔训练', requiresAuth: false },
            },
            // 其他需要登录的运动计划详情
            { path: '/member/workout/plan/details/:i', name: 'member_workout_plan_details', component: () => import('../views/member/workout/PlanDetails.vue'), meta: { ...PAGE, title: '运动计划详情' } },
            { path: '/member/workout/plan/play', name: 'member_workout_plan_play', component: () => import('../views/member/workout/PlanPlay.vue'), meta: { ...PAGE, title: '运动计划播放' } },
            { path: '/member/aichat', name: 'member_ai_chat', component: () => import('../views/member/central/AiChat.vue'), meta: { ...PAGE, title: '妈妈智问 & 一凡妈妈智慧产康', showHeader: true, header: { title: '妈妈智问', leftAction: 'back' }, requiresAuth: false } },
            { path: '/member/wxpay/:no', name: 'member_wx_pay', component: () => import('../views/member/central/WxPay.vue'), meta: { ...PAGE, title: '微信支付' } },
            { path: '/member/record/:id', name: 'member_record', component: () => import('../views/member/record/Record.vue'), meta: { ...PAGE, title: '会员记录' } },
            { path: '/member/record/breastfeeding', name: 'member_breastfeeding', component: () => import('../views/member/record/Breastfeeding.vue'), meta: { ...PAGE, title: '哺乳记录' } },
            { path: '/member/record/childcare', name: 'member_childcare', component: () => import('../views/member/record/Childcare.vue'), meta: { ...PAGE, title: '育儿记录' } },
            { path: '/member/record/breasthealth', name: 'member_breasthealth', component: () => import('../views/member/record/Breasthealth.vue'), meta: { ...PAGE, title: '乳房健康管理' } },
            // 妈妈圈
            { path: '/member/circle', name: 'circle_post_list', component: () => import('../views/member/circle/PostList.vue'), meta: { ...DEFAULT_META, title: '妈妈圈', requiresAuth: false, showHeader: true, showTabbar: true, tabbarType: 'circle', header: { leftAction: 'none', rightIcon: 'edit', rightTo: 'circle_post_create' } } },
            { path: '/member/circle/post/create', name: 'circle_post_create', component: () => import('../views/member/circle/PostCreate.vue'), meta: { ...PAGE, title: '发布贴文', requiresAuth: true } },
            { path: '/member/circle/post/:id', name: 'circle_post_detail', component: () => import('../views/member/circle/PostDetail.vue'), meta: { ...PAGE, title: '贴文详情', requiresAuth: false, showHeader: true, header: { leftAction: 'back', rightIcon: 'none', rightTo: 'circle_post_create' } } },
            {
                path: '/member/circle/experts', name: 'circle_expert_list', component: () => import('../views/member/circle/ExpertList.vue'), meta: {
                    ...DEFAULT_META, title: '专家', requiresAuth: false, showHeader: false, showTabbar: true, tabbarType: 'circle'
                }
            },
            { path: '/member/circle/expert/:id', name: 'circle_expert_profile', component: () => import('../views/member/circle/ExpertProfile.vue'), meta: { ...PAGE, title: '专家详情', requiresAuth: true } },
            { path: '/member/circle/expert/:id/consult', name: 'circle_consult_book', component: () => import('../views/member/circle/ConsultBook.vue'), meta: { ...PAGE, title: '预约咨询', requiresAuth: true } },
            { path: '/member/circle/consult/orders', name: 'circle_consult_orders', component: () => import('../views/member/circle/ConsultOrders.vue'), meta: { ...PAGE, title: '我的咨询', showHeader: true, header: { title: '我的咨询', leftAction: 'back' } } },
            { path: '/member/circle/chat/:session_id', name: 'circle_chat_room', component: () => import('../views/member/circle/ChatRoom.vue'), meta: { ...PAGE, title: '在线咨询', requiresAuth: true } },
        ],
    },

    // Explore (öffentlich)
    {
        path: '/explore',
        name: 'explore',
        component: () => import('../views/explore/Root.vue'),
        meta: { ...DEFAULT_META, requiresAuth: false, showHeader: false, showTabbar: false },
        children: [
            { path: '/explore/form/checkin/:id', name: 'explore_checkin', component: () => import('../views/explore/Form/Checkin.vue'), meta: { title: '登记表单' } },
            { path: '/explore/branch/lists', name: 'branch_lists', component: () => import('../views/explore/Branch/Lists.vue'), meta: { title: '科室导航' } },
            { path: '/explore/branch/details/:bid?', name: 'branch_details', component: () => import('../views/explore/Branch/Details.vue'), meta: { title: '康复师团队' } },
            { path: '/explore/branch/comments/:bid?', name: 'branch_comments', component: () => import('../views/explore/Branch/Comments.vue'), meta: { title: '患者评论' } },
            { path: '/explore/community/index', name: 'community_index', component: () => import('../views/explore/Community/Index.vue'), meta: { title: '社区' } },
            { path: '/explore/book/pregnant', name: 'pregnancy_index', component: () => import('../views/explore/Book/Pregnant.vue'), meta: { title: '孕产妇健康管理' } },
            { path: '/explore/book/mother-child-handbook', name: 'mother-child-handbook', component: () => import('../views/explore/Book/MotherChildHandbook.vue'), meta: { title: '孕产保健' } },
            { path: '/explore/general/suggestions', name: 'general-suggestions', component: () => import('../views/explore/General/Suggestions.vue'), meta: { title: '意见反馈' } },
            { path: '/explore/general/suggestions/view/:id', name: 'general-suggestions-view', component: () => import('../views/explore/General/SuggestionsView.vue'), meta: { title: '意见反馈' } },
        ],
    },

    // Öffentliche Routen
    { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { title: '用户登录' } },
    { path: '/signup', name: 'signup', component: () => import('../views/Signup.vue'), meta: { title: '用户登录' } },
    { path: '/result/:status', name: 'result', component: () => import('../views/Result.vue'), meta: { title: '操作结果' } },
]

// ─── Router-Instanz ───────────────────────────────────────────────────────────

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_RUN_PATH),
    routes,
    scrollBehavior: (_, __, savedPosition) => savedPosition ?? { top: 0 },
})

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

/** Setzt den Seiten-Titel inkl. optionalem Branch-Suffix */
function applyPageTitle(title: string | undefined, branchName: string | undefined): void {
    if (!title) return
    document.title = branchName ? `${title} - ${branchName}` : title
}

/** Setzt oder aktualisiert das Meta-Description-Tag */
function applyMetaDescription(description: string | undefined): void {
    if (!description) return
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
    }
    tag.content = description
}

/**
 * Prüft, ob der eingeloggte Nutzer Zugriff auf die Route hat.
 * Gibt `true` zurück wenn erlaubt, sonst einen Redirect-Pfad.
 */
function checkAccess(to: any, store: ReturnType<typeof useGlobalStore>): true | string | object {
    const { userRole, userManager, isLogged } = store

    if (isLogged !== 1) return '/login'

    // const roleMatchesPath =
    //     (userRole === 'worker' && to.path.startsWith('/worker')) ||
    //     (userRole === 'member' && to.path.startsWith('/member'))

    // if (!roleMatchesPath) return `/${userRole}`

    // ── 两种身份都可以访问的路由前缀 ──────────────────────────
    const sharedPaths = [
        '/member/circle',   // 圈子模块，worker 和 member 都可访问
    ]
    const isShared = sharedPaths.some(p => to.path.startsWith(p))
    if (isShared) return true

    // ── worker 路由 ───────────────────────────────────────────
    if (userRole === 'worker' && to.path.startsWith('/worker')) {
        if (to.meta.permissions) {
            const required = to.meta.permissions as string[]
            const currentPerms = Array.isArray(userManager) ? userManager : [userManager]
            const hasAuth = required.some(p => currentPerms.includes(p))
            if (!hasAuth) {
                return {
                    path: '/result/warning',
                    query: { title: '无权限', description: '你无权访问该管理页面' }
                }
            }
        }
        return true
    }

    // ── member 路由 ───────────────────────────────────────────
    if (userRole === 'member' && to.path.startsWith('/member')) {
        return true
    }

    // ── 默认回退到各自首页 ────────────────────────────────────
    return `/${userRole}`

    // if (userRole === 'worker' && to.meta.permissions) {
    //     const required = to.meta.permissions as Permission[]
    //     const current: string[] = Array.isArray(userManager) ? userManager : [userManager]
    //     if (!required.some(p => current.includes(p))) {
    //         return { path: '/result/warning', query: { title: '无权限', description: '你无权访问该管理页面' } }
    //     }
    // }

    // return true
}

// ─── Navigation Guard ─────────────────────────────────────────────────────────

router.beforeEach(async (to) => {
    const globalStore = useGlobalStore()
    const meta = to.meta as AppRouteMeta

    // Seiten-Meta setzen
    applyPageTitle(meta.title, globalStore.branchConfig?.name)
    applyMetaDescription(meta.description as string | undefined)

    // Replace-Pfad merken
    if (meta.replaceBack) globalStore.setReplace(to.fullPath)

    // Öffentliche Routen direkt durchlassen
    if (!meta.requiresAuth) return true

    // Fall A: bereits eingeloggt (Pinia-State)
    if (globalStore.isLogged === 1) return checkAccess(to, globalStore)

    // Fall B: Token vorhanden → stille Session-Prüfung
    if (Cookies.get('ERPAuth')) {
        try {
            const res = await axios.get('index/config', { toast: 0 })
            if (res.session?.isLogged === 1) return checkAccess(to, globalStore)
        } catch (err) {
            console.error('Stille Anmeldung fehlgeschlagen:', err)
        }
    }

    // Fall C: nicht eingeloggt → Login
    globalStore.setRedirect(to.fullPath)
    return '/login'
})

export default router
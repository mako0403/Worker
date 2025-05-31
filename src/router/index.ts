import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useGlobalStore } from '@/store/global'
import Cookies from 'js-cookie';
import axios from '@/utils/axios';


const metaData = {
    title: '',
    requiresAuth: true,
    permissions:false, // 额外权限控制目前有['branchManager','officeManager']
    replaceBack: false,  // 等会后返回页面
    showHeader: true,
    showTabbar: true
}
const routers: Array<RouteRecordRaw> = [
    // worker 路由
    {
        path: '/',
        name: 'worker',
        component: () => import('../views/worker/Root.vue'),
        meta: { ...metaData },
        children: [
            {
                path: '/worker',
                name: 'appointment',
                component: () => import('../views/worker/medical/appointment/Appointment.vue'),
                meta: { ...metaData, title: '预约管理' },
            },
            {
                path: '/worker/appointment/archive/:id',
                name: 'appointment_archive',
                component: () => import('../views/worker/medical/appointment/Archive.vue'),
                meta: { ...metaData, title: '治疗记录', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/member/lists',
                name: 'member_lists',
                component: () => import('../views/worker/member/Lists.vue'),
                meta: { ...metaData, title: '患者列表', showHeader: false },
            },
            {
                path: '/worker/member/add',
                name: 'member_add',
                component: () => import('../views/worker/member/Add.vue'),
                meta: { ...metaData, title: '新增患者', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/member/interaction',
                name: 'member_interaction',
                component: () => import('../views/worker/member/Interaction.vue'),
                meta: { ...metaData, title: '互动', showHeader: true, showTabbar: true },
            },
            {
                path: '/worker/services/sales_records',
                name: 'sales_records',
                component: () => import('../views/worker/services/SalesRecords.vue'),
                meta: { ...metaData, title: '收费记录查询', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/services/usage_records',
                name: 'usage_records',
                component: () => import('../views/worker/services/UsageRecords.vue'),
                meta: { ...metaData, title: '患者预约记录查询', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/medical/sales',
                name: 'medical_sales',
                component: () => import('../views/worker/medical/Sales.vue'),
                meta: { ...metaData, title: '项目收费', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/video/lists',
                name: 'video_lists',
                component: () => import('../views/worker/video/Lists.vue'),
                meta: { ...metaData, title: '视频资源库', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/video/record/:card_number?',
                name: 'video_record',
                component: () => import('../views/worker/video/Record.vue'),
                meta: { ...metaData, title: '播放记录', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/medical/assessment/:id',
                name: 'assessment',
                component: () => import('../views/worker/medical/Assessment.vue'),
                meta: { ...metaData, title: '评估表单', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/settings/offday',
                name: 'settings_offday',
                component: () => import('../views/worker/settings/Offday.vue'),
                meta: { ...metaData, title: '设置休息日', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/remind',
                name: 'remind',
                component: () => import('../views/worker/settings/Remind.vue'),
                meta: { ...metaData, title: '消息通知', showHeader: false, showTabbar: false },
            },
            {
                path: '/worker/assistant/aichat',
                name: 'assistant_aichat',
                component: () => import('../views/worker/assistant/AiChat.vue'),
                meta: { ...metaData, title: 'AI助手', showHeader: true, showTabbar: false },
            },
            // 管理员
            {
                path: '/worker/manager/overview',
                name: 'manager_overview',
                component: () => import('../views/worker/manager/Overview.vue'),
                meta: { ...metaData, permissions:['officeManager'], title: '总览', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/manager/branch',
                name: 'manager_branch',
                component: () => import('../views/worker/manager/Branch.vue'),
                meta: { ...metaData, permissions:['branchManager','officeManager'], title: '门店', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/manager/worker',
                name: 'manager_worker',
                component: () => import('../views/worker/manager/Worker.vue'),
                meta: { ...metaData, permissions:['officeManager'], title: '员工', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/manager/Services',
                name: 'manager_Services',
                component: () => import('../views/worker/manager/Services.vue'),
                meta: { ...metaData, permissions:['officeManager'], title: '服务', showHeader: false, showTabbar: true },
            },
            {
                path: '/worker/manager/member',
                name: 'manager_member',
                component: () => import('../views/worker/manager/Member.vue'),
                meta: { ...metaData, permissions:['officeManager'], title: '会员', showHeader: false, showTabbar: true },
            },
        ]
    },
    // member 路由
    {
        path: '/member',
        name: 'member',
        component: () => import('../views/member/Root.vue'),
        meta: { ...metaData },
        children: [
            {
                path: '/member',
                name: 'home',
                component: () => import('../views/member/central/Home.vue'),
                meta: { ...metaData, title: '个人中心', showHeader: true, showTabbar: true },
            },
            {
                path: '/member/medical/appointment',
                name: 'member_medical_appointment',
                component: () => import('../views/member/medical/Appointment.vue'),
                meta: { ...metaData, title: '预约服务', showHeader: false, showTabbar: false },
            },
            {
                path: '/member/medical/appointment/lists',
                name: 'member_medical_appointment_lists',
                component: () => import('../views/member/medical/AppointmentLists.vue'),
                meta: { ...metaData, title: '我的预约', showHeader: false, showTabbar: false },
            },
            {
                path: '/member/workout/plan',
                name: 'member_workout_plan',
                component: () => import('../views/member/workout/Plan.vue'),
                meta: { ...metaData, title: '运动计划', showHeader: false, showTabbar: false },
            },
            {
                path: '/member/workout/plan/details/:i',
                name: 'member_workout_plan_details',
                component: () => import('../views/member/workout/PlanDetails.vue'),
                meta: { ...metaData, title: '运动计划详情', showHeader: false, showTabbar: false },
            },
            {
                path: '/member/workout/plan/play',
                name: 'member_workout_plan_play',
                component: () => import('../views/member/workout/PlanPlay.vue'),
                meta: { ...metaData, title: '运动计划播放', showHeader: false, showTabbar: false },
            },
            {
                path: '/member/aichat',
                name: 'member_ai_chat',
                component: () => import('../views/member/central/AiChat.vue'),
                meta: { ...metaData, title: '妈妈智问 & 一凡妈妈智慧产康', requiresAuth: false, showHeader: true, showTabbar: false },
            },
            {
                path: '/member/wxpay/:no',
                name: 'member_wx_pay',
                component: () => import('../views/member/central/WxPay.vue'),
                meta: { ...metaData, title: '微信支付', showHeader: false, showTabbar: false },
            },
        ]
    },
    // 前端无限制访问
    {
        path: '/explore',
        name: 'explore',
        component: () => import('../views/explore/Root.vue'),
        meta: { ...metaData,  requiresAuth:false, showHeader: false, showTabbar: false },
        children: [
            // 表单
            {
                path: '/explore/form/checkin/:id',
                name: 'explore_checkin',
                component: () => import('../views/explore/Form/Checkin.vue'),
                meta: { title: '登记表单' }
            },
            // 门店
            {
                path: '/explore/branch/lists',
                name: 'branch_lists',
                component: () => import('../views/explore/Branch/Lists.vue'),
                meta: { title: '科室导航' }
            },
            {
                path: '/explore/branch/details/:bid?',
                name: 'branch_details',
                component: () => import('../views/explore/Branch/Details.vue'),
                meta: { title: '康复师团队' }
            },
            {
                path: '/explore/branch/comments/:bid?',
                name: 'branch_comments',
                component: () => import('../views/explore/Branch/Comments.vue'),
                meta: { title: '患者评论' }
            },
            // 社区
            {
                path: '/explore/community/index',
                name: 'community_index',
                component: () => import('../views/explore/Community/Index.vue'),
                meta: { title: '社区' }
            },
            // 孕产妇健康管理手册
            {
                path: '/explore/book/pregnant',
                name: 'pregnancy_index',
                component: () => import('../views/explore/Book/Pregnant.vue'),
                meta: { title: '孕产妇健康管理手册' }
            },
        ]
    },
    // 公共路由
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { title: '用户登录' }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../views/Signup.vue'),
        meta: { title: '用户登录' }
    },
    {
        path: '/result/:status',
        name: 'result',
        component: () => import('../views/Result.vue'),
        meta: { title: '操作结果' }
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_RUN_PATH),
    routes: routers,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
})



router.beforeEach(async (to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title as string
    }

    const globalStore = useGlobalStore()
    const {isLogged, userManager, branchConfig, userRole, setReplace } = globalStore
    if (branchConfig.name) {
        document.title = to.meta.title + ' - ' + branchConfig.name
    }

    if(to.meta.description) {
        // 更新 Meta 描述
        let metaDescriptionTag = document.querySelector('meta[name="description"]');
        if (!metaDescriptionTag) {
            // 如果不存在，则创建并添加到头部
            metaDescriptionTag = document.createElement('meta');
            metaDescriptionTag.setAttribute('name', 'description');
            document.head.appendChild(metaDescriptionTag);
        }
        // 设置或更新描述内容
        metaDescriptionTag.setAttribute('content', to.meta.description || ''); // 提供一个默认值
    }


    const token = Cookies.get('ERPAuth');
    to.meta.replaceBack ? setReplace(to.fullPath) : '';
    if (to.meta.requiresAuth) {
        if (isLogged) {
            console.log('1------', userRole)
            if (userRole === 'worker' && to.path.startsWith('/worker')) {
                const userPermissions = userManager; // 假设 userManager 是个权限数组

                // 需要特定权限才能访问的页面
                if (to.meta.permissions) {
                    const requiredPermissions = to.meta.permissions;
                    // 检查用户是否具有页面所需的任意权限
                    const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
                    if (!hasPermission) {
                        return next({
                            path: '/result/warning',
                            query: {
                                title: '无访问权限',
                                description: '你无权限访问该页面，请联系管理员或立即退出'
                            }
                        });
                    }
                }

                return next();
            } else if (userRole === 'member' && to.path.startsWith('/member')) {
                return next();
            } else {
                return next('/login');
            }
            //return next();
        } else if (token) {
            try {
                const res = await axios.get('index/config')
                if (!res.session.isLogged) {
                    // 判断session非登录状态直接返回异常
                    throw new Error("Logged status not available");
                }

                // 登录信息有效，判断及跳转
                globalStore.setUserRole(res.session.userType);
                globalStore.updateLoginStatus(res.session.isLogged);
                if (res.session.userType === 'worker' && to.path.startsWith('/worker')) {
                    return next();
                } else if (res.session.userType === 'member' && to.path.startsWith('/member')) {
                    return next();
                } else {
                    if(to.fullPath==='/'){
                        return next('/'+res.session.userType);
                    }

                    console.log('2-------')
                    throw new Error("Login authentication mismatch");
                    //return next('/login');
                }

                //return next();
            } catch (error) {
                console.log('3---------')
                console.log(error)
                globalStore.setRedirect(to.path)
                return next('/login');
                // Cookies.remove('ERPAuth'); 
                // localStorage.removeItem('ERPAuth'); 
            }
        } else {
            return next('/login');
        }
    } else {
        return next(); 
    }

    // if (typeof to.meta.icon === 'string' || to.meta.icon) {
    //     const icon = to.meta.icon || 'favicon.png'; // 如果路由没有设置图标，则使用默认图标
    //     document.querySelector("link[rel*='icon']").setAttribute('href', icon);
    // }


    next()
})



export default router

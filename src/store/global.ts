import { ref, reactive, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useGlobalStore = defineStore('global', () => {
    const uploadsPath = import.meta.env.VITE_BASE_API_RUL + import.meta.env.VITE_BASE_API_UPLOAD_PATH
    const isLogged = ref(0)
    const globalConfig = ref({})
    const branchConfig = ref({})
    const workerConfig = ref({})
    const memberInfo = ref({})
    const replace = ref('')
    const redirect = ref('') // 重定向页面,路由中判断，如果存在值则必须跳转并清空
    const userRole = ref('') // 用户角色信息
    const userManager = ref('') // 管理員角色，branchManager,officeManager

    //底部导航栏
    const tabbarName = ref('appointment');

    function updateTabbarName(name: string) {
        tabbarName.value = name;
    }

    //const doubleCount = computed(() => count.value * 2)
    function updateLoginStatus(status: number) {
        if(status != 1){
            // 清除登录状态
            localStorage.removeItem('ERPAuth');
            Cookies.remove('ERPAuth');
            
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
    
            const expireTime = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 15); // 当前时间+1小时
            localStorage.setItem('ERPAuth', uuid);
            Cookies.set('ERPAuth', uuid, { expires: expireTime });
            
            if(Cookies.get('ERPAuth')!=localStorage.getItem('ERPAuth')){
                Cookies.set('ERPAuth', localStorage.getItem('ERPAuth'));
            }
        }

        isLogged.value = status;
    }

    function setGlobalConfig(config: any) {
        globalConfig.value = config;
    }

    function setBranchConfig(config: any) {
        branchConfig.value = config;
    }

    function setWorkerConfig(config: any) {
        workerConfig.value = config;
    }

    function setMemberInfo(config: any){
        memberInfo.value = config;
    }

    function setReplace(config:any){
        replace.value = config;
    }

    function setRedirect(config:any){
        redirect.value = config;
    }

    function setUserRole(role) {
        userRole.value = role;
    }

    function setUserManager(role) {
        userManager.value = role;
    }

    return {
        tabbarName, 
        uploadsPath, 
        isLogged, 
        globalConfig, 
        branchConfig, 
        workerConfig, 
        memberInfo,
        replace,
        redirect,
        userRole,
        userManager,
        updateLoginStatus, 
        setGlobalConfig, 
        setBranchConfig, 
        setWorkerConfig, 
        setMemberInfo,
        updateTabbarName,
        setReplace,
        setRedirect,
        setUserRole,
        setUserManager
    }
})

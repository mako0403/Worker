import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { AxiosLoading } from "@/utils/common"
import { AxiosCancel } from "@/utils/calcel"
import { useGlobalStore } from "@/store/global";
import { ElMessage, ElNotification } from 'element-plus'
import router from "@/router";


const axiosLoading = new AxiosLoading()
const axiosCancel = new AxiosCancel()




enum RequestEnums {
    TIMEOUT = 50000,
    OVERDUE = 0, // 登录失效
    FAIL = 999, // 请求失败
    SUCCESS = 1, // 请求成功
}

const service: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_RUL}${import.meta.env.VITE_BASE_API_PATH}`,
    timeout: RequestEnums.TIMEOUT,
    headers: { 'Content-Type': 'application/json;charset=UTF-8'},
    withCredentials:true,
});


interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    toast?: number; // 添加一个可选的 toast 参数
}
const defaultConfig = {
    toast:1
}

const uuid = getUUID();
const expireTime = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 15); // 当前时间+1小时
if (!localStorage.getItem('ERPAuth')) {
    localStorage.setItem('ERPAuth', uuid);
}

if(!Cookies.get('ERPAuth')){
    Cookies.set('ERPAuth', uuid, { expires: expireTime });
}

if(Cookies.get('ERPAuth')!=localStorage.getItem('ERPAuth')){
    Cookies.set('ERPAuth', localStorage.getItem('ERPAuth'));
}

// # 请求拦截
service.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
    config.withCredentials = true;  // 允许携带 Cookie
    const ERPAuth = localStorage.getItem('ERPAuth');
    config.headers.Authorization = ERPAuth;

    if(config.toast==1){
        axiosLoading.addLoading();
    }
    axiosCancel.addPending(config);

    if(import.meta.env.MODE=='development'){
        console.log('请求拦截：', config);
    }

    return config;
}, (error: AxiosError) => {
    axiosLoading.closeLoading();
    return Promise.reject(error);
});

// # 响应拦截
service.interceptors.response.use((response: AxiosResponse) => {
    const globalStore = useGlobalStore();
    //const { data, config } = response; // 解构
    const { data, config } = response as { data: any, config: ExtendedAxiosRequestConfig };

    if(import.meta.env.MODE=='development'){
        console.log('响应拦截：', data);
    }

    // 假设后端返回 0 表示业务失败，但通过 data.session.isLogged 判断登录
    if (data.session && data.session.isLogged === 0) {
        // 发现登录失效，直接触发注销
        logout(); 
        return Promise.reject('Session Expired');
    }

    globalStore.updateLoginStatus(data.session.isLogged || 0)
    globalStore.setUserRole(data.session.userType || '')
    globalStore.setGlobalConfig(data.session.globalConfig || {})
    globalStore.setBranchConfig(data.session.branchConfig || {})
    globalStore.setWorkerConfig(data.session.workerConfig || {})
    globalStore.setMemberInfo(data.session.memberInfo || {})

    if (data.session.isLogged == RequestEnums.OVERDUE) {
        globalStore.updateLoginStatus(0);
        // router.replace({ path: '/login' });
        //return Promise.reject('Login expired');
    }

    // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
    if (data.status != RequestEnums.SUCCESS) {
        ElMessage.error(`${data.info}`);
        //return Promise.reject(data.info);
    }

    if(config.toast==1){
        axiosLoading.closeLoading();
    }
    axiosCancel.removePending(config);
    return data;
}, (error) => {
    //const { response, config } = error; // 解构
    const { response, config } = error as { response: any, config: ExtendedAxiosRequestConfig };

    if (error.code === 'ERR_CANCELED') {
        console.log('Request canceled:', error.message);
        axiosCancel.removePending(config); // 仍然需要从 pending 列表中移除
        axiosLoading.closeLoading(); // 如果被取消的请求触发了 loading，也要关闭
        return Promise.reject(error); // 拒绝 Promise，以便调用方可以捕获并处理取消
    }

    if (!window.navigator.onLine) {
        ElNotification({
            title: 'Network connection failed',
            message: 'Please check your network connection and try again later',
            type: 'error',
        })
        return;
    }

    if (response) {
        const message = response.statusText;
        ElNotification({
            title: 'Request failed',
            message: message,
            type: 'error',
        })
    } else {
        ElNotification({
            title: error.code,
            message: error.message,
            type: 'error',
        })
    }

    if(config.toast==1){
        axiosLoading.closeLoading();
    }
    axiosCancel.removePending(config);
    addAjaxErrorLog(error)
    return;
});

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const request = {
    get<T = any>(url: string, data?: any, config: any = defaultConfig): Promise<T> {
        return request.request("GET", url, { params: data, ...config });
    },
    post<T = any>(url: string, data?: any, config: any = defaultConfig): Promise<T> {
        return request.request("POST", url, { data, ...config });
    },
    put<T = any>(url: string, data?: any, config: any = defaultConfig): Promise<T> {
        return request.request("PUT", url, { data, ...config });
    },
    delete<T = any>(url: string, data?: any, config: any = defaultConfig): Promise<T> {
        return request.request("DELETE", url, { params: data, ...config });
    },
    request<T = any>(method = "GET", url: string, data?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            service({ method, url, ...data })
                .then((res) => {
                    resolve(res as unknown as Promise<T>);
                })
                .catch((e: Error | AxiosError) => {
                    // 同样在这里处理取消错误，避免重复的通知
                    if ((e as AxiosError).code === 'ERR_CANCELED') {
                        console.log('Request explicitly canceled at request wrapper level.');
                        // 不需要 reject，因为拦截器已经处理了，或者如果拦截器没处理，这里会抛出
                        // 如果拦截器已处理且 return Promise.reject，这里会捕获到
                        return; // 如果已在拦截器中处理，这里可以直接返回，阻止进一步的错误传递
                    }
                    reject(e);
                })
        });
    }
};

export default request;


function addAjaxErrorLog(error: AxiosError): void {
    console.groupCollapsed(`AJAX Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.log('Type: ajax');
    console.log('URL:', error.config?.url);
    console.log('Method:', error.config?.method);
    console.log('Params:', ["get", "delete"].includes(error.config?.method || '') ? JSON.stringify(error.config?.params) : JSON.stringify(error.config?.data));
    console.log('Detail:', error.toJSON());
    console.groupEnd();
}


/**
 * 统一退出登录逻辑
 * 放在 axios 文件中方便拦截器直接调用
 */
export async function logout() {
    const globalStore = useGlobalStore();

    try { 
        // 1. 发送注销请求（趁着 ERPAuth 还没删）
        // 使用 service 实例而不是封装好的 request，避免循环逻辑
        await service.post('/index/logout');
    } catch (error) {
        console.error("服务端 Session 销毁失败或已失效", error);
    } finally {
        // 2. 物理清理：LocalStorage 和 Cookies
        localStorage.removeItem('ERPAuth');
        Cookies.remove('ERPAuth');
        Cookies.remove('PHPSESSID', { path: '/' });

        // 3. 状态清理：调用 Pinia 的重置方法
        globalStore.logoutReset();

        // 4. 跳转：直接回到登录页
        // 如果当前不在登录页，则执行跳转并刷新页面（确保内存彻底干净）
        if (router.currentRoute.value.path !== '/login') {
            router.replace('/login');
        }
    }
}
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import Cookies from "js-cookie";
import { AxiosLoading } from "@/utils/common"
import { AxiosCancel } from "@/utils/calcel"
import { useGlobalStore } from "@/store/global";
import { ElMessage, ElNotification } from 'element-plus'



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

    
    globalStore.updateLoginStatus(data.session.isLogged || 0)
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
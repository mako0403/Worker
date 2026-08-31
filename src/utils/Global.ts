/** @description 全局
 * 引入常用组件，可在页面中调用该组件快速引入其他组件
 * import { useGlobal } from '@/utils/Global';
 * const { axios, globalStore, router, route, ElMessage } = useGlobal();
 */
import { reactive  } from 'vue';
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import { useRouter, useRoute} from 'vue-router';
import { ElMessage, ElLoading } from 'element-plus';

export function useGlobal() {
    const store = useGlobalStore();
    const router = useRouter();
    const route = useRoute();

    const state = reactive({
        isLoadedPage: sessionStorage.getItem(`hasLoaded_${route.fullPath}`) || false,
    });

    if (!state.isLoadedPage) {
        sessionStorage.setItem(`hasLoaded_${route.fullPath}`, 'true');
        state.isLoadedPage = true; // 直接修改
    }

    // 加载动画
    const showLoading = () => {
        return ElLoading.service({
            fullscreen: true,
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.2)',
        });
    }
    // 关闭加载动画
    const hideLoading = () => {
        ElLoading.service().close();
    }

    const waiting = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    return {
        axios,
        store,
        router,
        route,
        ElMessage,
        showLoading,
        hideLoading,
        waiting,
        ...state
    };
}
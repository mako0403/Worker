/** @description 全局
 * 引入常用组件，可在页面中调用该组件快速引入其他组件
 * import { useGlobal } from '@/components/Global';
 * const { axios, globalStore, router, route } = useGlobal();
 */
import { reactive  } from 'vue';
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

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


    return {
        axios,
        store,
        router,
        route,
        ElMessage,
        ...state
    };
}
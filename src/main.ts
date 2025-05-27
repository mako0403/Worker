import 'vant/lib/index.css';
/**
 * element-plus css
 */
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * primeflex css
 */
import '/node_modules/primeflex/primeflex.css'
import 'primeflex/themes/primeone-light.css'

/**
 * custom css
 */
import './assets/main.scss'

/**
 * iconfont css
 */
import '@@/iconfont/iconfont.js'



import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// 使用 provide 将全局变量注入到应用中, 需要在app.vue中inject变量，后在各页面组件中inject变量后使用，状态值为全局
// const isFocused = inject('isFocused');
const isFocused = ref(false);
app.provide('isFocused', isFocused);


// export default app;


// app.mount('#app')
router.isReady().then(() => {
    app.mount("#app");
});



//console.log(app.config.globalProperties.$toast)
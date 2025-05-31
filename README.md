# medical

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

# useHead
useHead({
  // 1. 页面标题
  // 设置 <title> 标签的内容。
  title: '你的页面标题',

  // 2. 页面标题的模板
  // 结合 `title` 参数，生成最终的 <title> 标签内容。
  // 例如：'我的应用 - %s'，其中 %s 会被 `title` 的值替换。
  // 如果 `title` 为 '首页'，则最终标题为 '我的应用 - 首页'。
  titleTemplate: (title) => (title ? `${title} - 你的网站名称` : '你的网站名称'),

  // 3. Meta 标签
  // 一个数组，每个元素都是一个对象，代表一个 <meta> 标签。
  // 可以用来设置 description, keywords, Open Graph (og:) 标签等。
  meta: [
    { charset: 'utf-8' }, // 字符集
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // 视口设置
    { name: 'description', content: '这是网页的描述，用于搜索引擎优化。' }, // 网页描述
    { name: 'keywords', content: '关键词1, 关键词2, Vue 3' }, // 网页关键词

    // Open Graph (OG) 标签：用于社交媒体分享（如微信、Facebook、Twitter等）
    // 微信分享主要依赖这些标签（当不使用JS-SDK主动配置时）。
    { property: 'og:title', content: '分享时的标题' }, // 分享卡片的标题
    { property: 'og:description', content: '分享卡片的描述内容。' }, // 分享卡片的描述
    { property: 'og:image', content: 'https://yourdomain.com/path/to/share-image.png' }, // 分享卡片的图片URL（必须是绝对路径）
    { property: 'og:url', content: 'https://yourdomain.com/current-page-url' }, // 分享卡片的URL（通常是当前页面的绝对URL）
    { property: 'og:type', content: 'website' }, // 页面类型，常见有 'website' 或 'article'

    // Twitter Card 标签：用于 Twitter 分享
    { name: 'twitter:card', content: 'summary_large_image' }, // 卡片类型，如 'summary', 'summary_large_image'
    { name: 'twitter:site', content: '@yourtwitterhandle' },
    { name: 'twitter:title', content: 'Twitter 分享标题' },
    { name: 'twitter:description', content: 'Twitter 分享描述' },
    { name: 'twitter:image', content: 'https://yourdomain.com/path/to/twitter-share-image.png' },
  ],

  // 4. Link 标签
  // 一个数组，每个元素都是一个对象，代表一个 <link> 标签。
  // 常用于引入 CSS 文件、Favicon、canonical URL 等。
  link: [
    { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }, // 网页图标
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }, // Apple 设备触摸图标
    { rel: 'stylesheet', href: '/css/some-styles.css' }, // 外部 CSS 文件
    { rel: 'canonical', href: 'https://yourdomain.com/canonical-url' }, // 规范URL，防止内容重复
    { rel: 'alternate', href: 'https://yourdomain.com/en/page', hreflang: 'en' }, // 多语言版本链接
  ],

  // 5. Script 标签
  // 一个数组，每个元素都是一个对象，代表一个 <script> 标签。
  // 用于引入外部 JavaScript 文件或内联脚本。
  script: [
    { src: 'https://third-party.com/sdk.js', body: true, async: true, defer: true }, // 引入外部 SDK，body: true 表示放在 <body> 底部
    {
      innerHTML: `
        console.log('Hello from an inline script!');
      `,
      type: 'text/javascript',
      charset: 'utf-8',
    }, // 内联脚本
  ],

  // 6. Style 标签
  // 一个数组，每个元素都是一个对象，代表一个 <style> 标签。
  // 用于内联 CSS 样式。
  style: [
    {
      innerHTML: `
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
      `,
    }, // 内联 CSS
  ],

  // 7. Html 属性
  // 一个对象，用于设置 <html> 标签的属性。
  htmlAttrs: {
    lang: 'zh', // 设置文档语言
    dir: 'ltr', // 文字方向
  },

  // 8. Body 属性
  // 一个对象，用于设置 <body> 标签的属性。
  bodyAttrs: {
    class: 'my-custom-body-class', // 添加 CSS 类
    'data-theme': 'dark', // 自定义数据属性
  },

  // 9. __VUE_HEAD_SSR_CONTENT__ (Nuxt 3 内部使用)
  // 这是一个 Nuxt 3 内部使用的参数，通常你不需要手动设置它。
  // 它用于在 SSR 过程中捕获 `<head>` 内容。
  // __VUE_HEAD_SSR_CONTENT__: '',
})
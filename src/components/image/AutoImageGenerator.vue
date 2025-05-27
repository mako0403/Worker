<template>
    <div v-if="imageURL">
        <img :src="uploadsPath + imageURL" width="100%" class="border-round-xl">
    </div>
    <div v-else class="bg-white border-round-2xl">
        <el-empty description="图片生成中..." />
    </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import axios from '@/utils/axios';
import { useGlobalStore } from '@/store/global';
const { uploadsPath } = toRefs(useGlobalStore());


// 隐藏的 canvas 元素
const canvas = ref(document.createElement('canvas'));

// 配置项
const props = defineProps({
    width: { type: Number, default: 800 }, // 默认宽度
    height: { type: Number, default: 800 }, // 默认高度
    baseImage: { type: String, default: '' }, // 底图URL
    smallImages: { type: Array, default: () => [] }, // 小图数组
    texts: { type: Array, default: () => [] }, // 文本数组
});
const emit = defineEmits(['update:imageURL']);


const imageURL = ref(''); // 保存生成的图片 URL
const defaultFont = '"Arial", "Helvetica", sans-serif'; // 默认回退字体

// 更新 imageURL 时，触发事件
const updateImageURL = (url) => {
    imageURL.value = url;
    emit('update:imageURL', url); // 触发事件，将 URL 传递到父组件
};

// 动态加载多个 CSS 文件来引入字体
const loadFontCSS = (fontCSSUrls) => {
    fontCSSUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    });
};

// 加载图片
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

// 生成图片
const generateImage = async () => {
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    canvas.value.width = props.width;
    canvas.value.height = props.height;

    // 设置白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, props.width, props.height);
    console.log(111111111111, props)
    // 绘制底图
    if (props.baseImage) {
        try {
            const baseImg = await loadImage(props.baseImage);
            ctx.drawImage(baseImg, 0, 0, props.width, props.height);
            console.log('底图绘制成功');
        } catch (error) {
            console.error('底图绘制失败', error);
        }
    }

    // 绘制小图
    for (const smallImgConfig of props.smallImages) {
        try {
            const img = await loadImage(smallImgConfig.url);
            ctx.drawImage(
                img,
                smallImgConfig.x,
                smallImgConfig.y,
                smallImgConfig.width,
                smallImgConfig.height
            );
            console.log(`小图绘制成功: ${smallImgConfig.url}`);
        } catch (error) {
            console.error(`小图绘制失败: ${smallImgConfig.url}`, error);
        }
    }

    // 绘制文字
    for (const textConfig of props.texts) {
        try {
            const fontWeight = textConfig.bold ? 'bold' : 'normal'; // 根据 bold 属性设置字体加粗
            ctx.font = `${fontWeight} ${textConfig.fontSize || 16}px ${textConfig.font || defaultFont}`;
            ctx.fillStyle = textConfig.color || '#000';
            ctx.fillText(textConfig.content, textConfig.x, textConfig.y);
            console.log(`文字绘制成功: ${textConfig.content}`);
        } catch (error) {
            console.error(`文字绘制失败: ${textConfig.content}`, error);
        }
    }



};

// 上传图片到服务器
const uploadImage = async (base64Image) => {
    try {
        const response = await axios.post('/common/uploads_base64', {
            base64_image: base64Image, // 图片 Base64 数据
        });
        return response.data.url; // 返回服务器生成的图片 URL
    } catch (error) {
        console.error('图片上传失败:', error);
        return null;
    }
};

// 自动生成并上传图片
const generateAndUploadImage = async () => {
    await generateImage(); // 先生成图片
    const base64Image = canvas.value.toDataURL('image/png'); // 获取 Base64 数据
    const url = await uploadImage(base64Image); // 上传图片
    if (url) {
        imageURL.value = url; // 保存生成的 URL
        updateImageURL(url); // 更新并通知父组件
    } else {
        console.error('图片上传失败');
    }
};

// 在组件挂载时执行
onMounted(async () => {
    // 加载多个 ZeoSeven 字体的 CSS
    loadFontCSS([
        'https://static.zeoseven.com/zsft/92/main/result.css', // 字体 1
        'https://static.zeoseven.com/zsft/447/main/result.css', // 字体 2
        'https://static.zeoseven.com/zsft/448/main/result.css', // 字体 3
    ]);

    // 生成并上传图片
    await generateAndUploadImage();
});
</script>

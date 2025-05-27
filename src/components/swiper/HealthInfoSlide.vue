<template>
  <div class="health-info-slide h-full w-full flex flex-column justify-content-between align-items-center p-3">
    <div class="top-title w-full py-3 text-center border-bottom-1 surface-border">
      <h2 class="title-text text-lg font-bold text-color-secondary m-0">{{ slideData.topTitle }}</h2>
    </div>

    <div class="content-area flex-grow-1 w-90 max-w-2xl my-3 flex flex-column justify-content-center align-items-start
                bg-orange-50 border-round-lg shadow-1 p-4">
      <div class="question-box w-full pb-3 mb-3 border-bottom-1 border-dashed surface-border-lighter text-center">
        <h3 class="question-text text-xl font-bold text-red-700 m-0">{{ slideData.question }}</h3>
      </div>
      <div class="answer-list w-full">
        <div v-for="(answer, index) in slideData.answers" :key="index" class="answer-item flex align-items-start mb-2">
          <el-icon class="answer-icon text-red-600 text-xl flex-shrink-0 mt-1 mr-2"><StarFilled /></el-icon>
          <p class="answer-text text-base text-700 m-0 line-height-3">{{ answer }}</p>
        </div>
      </div>
    </div>

    <div class="illustration-area w-full flex justify-content-center align-items-end pt-3" style="max-height: 35%;">
      <img v-if="slideData.illustrationSrc" :src="slideData.illustrationSrc" alt="Illustration" class="illustration-image max-w-90 h-auto object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
// 保持 ElIcon 和具体图标的引入，因为它们是按需注册的
import { ElIcon } from 'element-plus';
import { StarFilled } from '@element-plus/icons-vue';

// 定义滑块数据接口
interface SlideDataType {
  topTitle: string;
  question: string;
  answers: string[];
  illustrationSrc?: string; // 插画图片路径
}

const props = defineProps<{
  slideData: SlideDataType;
}>();
</script>

<style scoped>
/*
  这里不再需要定义 .health-info-slide, .top-title, .content-area, .question-box, .answer-list, .answer-item
  等大部分的 flex 布局和颜色、间距等样式，因为它们已经通过原子化 CSS 类名实现。
  只保留那些不能通过原子化 CSS 完全表达的，或者需要精确控制的样式。
  例如：background-color, object-fit, max-width/height 等。
*/
.health-info-slide {
  background-color: #ffffff; /* 白色背景 */
  color: #333; /* 默认文字颜色 */
  /* overflow: hidden;  Swiper会处理，这里可以考虑移除，如果不需要额外裁剪 */
}

/* 顶部标题的细线，如果van-hairline--bottom无法达到预期，这里可以手动控制 */
.top-title {
  /* 如果你使用了 PrimeFlex 或类似框架，这里可能不需要额外的 border 样式，
     van-hairline--bottom 已经是 Vant 提供的样式了 */
  /* border-bottom: 0.5px solid var(--surface-border); */
  /* 如果 PrimeFlex 没有提供 0.5px 的 border，可以自己添加 */
  /* 例如：border-bottom: 1px solid #eee; */
}


.question-box {
  /* 确保虚线边框效果，如果原子化 CSS 没有直接提供虚线，可以手动设置 */
  /* border-bottom: 1px dashed #ccc; */
}

.illustration-image {
  /* object-fit: contain; 确保图片完整显示 */
  /* max-width 和 max-height 已经通过类名设置，如果需要更精确的百分比可以手动调整 */
}

/* 覆盖Swiper默认的颜色，如果需要 */
.swiper-pagination-bullet-active {
  background-color: var(--primary-color) !important; /* 或者你项目的主题色变量 */
}
</style>
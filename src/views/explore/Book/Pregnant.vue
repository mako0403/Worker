<template>
  <div class="creative-slider-page h-full w-full overflow-hidden surface-ground"> <swiper
      :direction="'vertical'"
      :grabCursor="true"
      :effect="'creative'"
      :creativeEffect="{
        prev: {
          shadow: true,
          translate: [0, 0, -400],
        },
        next: {
          translate: [0, '100%', 0],
        },
      }"
      :modules="modules"
      :pagination="{ clickable: true }"
      class="mySwiper w-full h-full"
    >
      <swiper-slide v-for="(slide, index) in slidesData" :key="index">
        <HealthInfoSlide :slideData="slide" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCreative, Pagination } from 'swiper/modules';

// 导入 Swiper 样式
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';

// 导入 HealthInfoSlide 组件
import HealthInfoSlide from '@/components/swiper/HealthInfoSlide.vue'; // 确保路径正确

const modules = [EffectCreative, Pagination];

// 动态数据，等待你填充
const slidesData = ref([
  // 你需要在这里填充你的数据，示例如下：
  {
    topTitle: '孕产妇健康管理服务',
    question: '产后42天应去哪里做健康检查？',
    answers: [
      '正常分娩产妇到镇街卫生院（社区卫生服务中心）、村卫生室（卫生服务站）、区妇幼保健院接受产后健康检查；',
      '异常分娩产娩产妇到原分娩医疗卫生机构接受产后健康检查。'
    ],
    illustrationSrc: '/images/slider/cec3f808-9517-4888-b23f-718407be947f.jpg',
  },
  // ... 其他页面数据
]);
</script>

<style scoped>
/* 仅保留 Swiper 容器和 slide 的基础尺寸和定位，背景色等可以由类名控制 */
.creative-slider-page {
  /* background-color: #000; 如果不需要特定背景色，可以移除 */
}

/*
.mySwiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
*/
/* 针对 Swiper Pagination 的样式调整，使其符合项目主题色 */
:deep(.swiper-pagination-bullet-active) {
  background-color: var(--primary-color, #ff4d4f) !important; /* 使用你的主题色或默认红色 */
}
</style>
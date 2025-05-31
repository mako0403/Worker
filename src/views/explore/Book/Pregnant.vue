<template>
    <div class="app-page h-screen w-screen">
        <main class="main-content h-full w-full">
            <CreativeSlider :slides="mySlidesData" effect="creative" direction="vertical" :grabCursor="true"
                :pagination="{ clickable: true, dynamicBullets: true }" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreativeSlider from '@/components/swiper/FullPageSlide.vue'; // Adjust path if necessary

// Import your image assets (examples, replace with your actual paths)
import foregroundImage1 from '@@/images/bg-low-poly-grid-haikei.png';
import foregroundImage2 from '@@/images/nxrt.png';
import foregroundImage3 from '@@/images/wechat.png';

import pageBgImageA from '@@/images/340ac56edc6d532886c5d17188ff99f775cb2d49b3882-B3UNVC.png';
import pageBgImageB from '@@/images/340ac56edc6d532886c5d17188ff99f775cb2d49b3882-B3UNVC.png';

// Prepare the data to be passed to CreativeSlider
const mySlidesData = ref([
  {
    imageSrc: foregroundImage1,
    pageBgColor: '#e0ffe0', // Green background color
  },
  {
    imageSrc: foregroundImage2,
    pageBgImage: pageBgImageB, // Background image
    pageBgColor: '#ff0000', // Light pink background color
  },
  {
    imageSrc: foregroundImage3,
    pageBgColor: '#ff0000', // Light pink background color
  },
  {
    imageSrc: foregroundImage1,
    pageBgColor: '#f5f5f5', // Light gray background (image will take precedence if pageBgImage is also set)
    pageBgImage: pageBgImageA,
  },
    {
    imageSrc: foregroundImage2,
    pageBgImage: pageBgImageB, // Background image
    pageBgColor: '#ff0000', // Light pink background color
  },
  {
    imageSrc: foregroundImage3,
    pageBgColor: '#ff0000', // Light pink background color
  },
  {
    imageSrc: foregroundImage1,
    pageBgColor: '#f5f5f5', // Light gray background (image will take precedence if pageBgImage is also set)
    pageBgImage: pageBgImageA,
  },
]);

</script>

<style scoped>
.app-page {
    display: flex;
    flex-direction: column;
    /* Ensure your root container takes full screen height */
}

.main-content {
    flex-grow: 1;
    /* Allow content area to fill available space */
}
</style>
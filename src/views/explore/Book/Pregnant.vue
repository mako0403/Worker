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
import foregroundImage1 from '@@/images/pregnant/content_01.webp';
import foregroundImage2 from '@@/images/pregnant/content_02.webp';
import foregroundImage3 from '@@/images/pregnant/content_03.webp';
import foregroundImage4 from '@@/images/pregnant/content_04.webp';
import foregroundImage5 from '@@/images/pregnant/content_05.webp';
import foregroundImage6 from '@@/images/pregnant/content_06.webp';
import foregroundImage7 from '@@/images/pregnant/content_07.webp';
import foregroundImage8 from '@@/images/pregnant/content_08.webp';
import foregroundImage9 from '@@/images/pregnant/content_09.webp';


import pageBgImage1 from '@@/images/pregnant/bg_01.webp';
import pageBgImage2 from '@@/images/pregnant/bg_02.webp';
import pageBgImage3 from '@@/images/pregnant/bg_03.webp';
import pageBgImage4 from '@@/images/pregnant/bg_04.webp';
import pageBgImage5 from '@@/images/pregnant/bg_05.webp';
import pageBgImage6 from '@@/images/pregnant/bg_06.webp';
import pageBgImage7 from '@@/images/pregnant/bg_07.webp';
import pageBgImage8 from '@@/images/pregnant/bg_08.webp';
import pageBgImage9 from '@@/images/pregnant/bg_09.webp';




// Prepare the data to be passed to CreativeSlider
const mySlidesData = ref([
    {
        imageSrc: foregroundImage1,
        pageBgColor: '#f6f0eb', // Green background color
        pageBgImage: pageBgImage1,
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage2,
        pageBgImage: pageBgImage2, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'bottom'
    },
    {
        imageSrc: foregroundImage3,
        pageBgImage: pageBgImage3, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage4,
        pageBgImage: pageBgImage4, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage5,
        pageBgImage: pageBgImage5, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage6,
        pageBgImage: pageBgImage6, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage7,
        pageBgImage: pageBgImage7, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage8,
        pageBgImage: pageBgImage8, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'top'
    },
    {
        imageSrc: foregroundImage9,
        pageBgImage: pageBgImage9, // Background image
        pageBgColor: '#f6f0eb', // Light pink background color
        imageAlign: 'bottom'
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
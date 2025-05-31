<template>
    <div class="creative-slider-container h-full w-full overflow-hidden surface-ground">
        <swiper :direction="direction" :grabCursor="grabCursor" :effect="effect"
            :creativeEffect="effect === 'creative' ? creativeEffectOptions : undefined"
            :cubeEffect="effect === 'cube' ? cubeEffectOptions : undefined"
            :fadeEffect="effect === 'fade' ? fadeEffectOptions : undefined"
            :flipEffect="effect === 'flip' ? flipEffectOptions : undefined"
            :coverflowEffect="effect === 'coverflow' ? coverflowEffectOptions : undefined" :modules="swiperModules"
            :pagination="pagination" class="mySwiper w-full h-full">
            <swiper-slide v-for="(slide, index) in slides" :key="index">
                <div class="health-info-slide-content h-full w-full overflow-hidden flex justify-content-center align-items-start"
                    :style="generateSlideBackgroundStyle(slide)">
                    <img :src="slide.imageSrc" alt="Health Information" class="foreground-image object-contain" />
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCreative, Pagination, EffectCube, EffectFade, EffectFlip, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import all possible effect styles
import 'swiper/css/effect-creative';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-coverflow';

// Define the structure for each slide item
interface SlideDataItem {
    imageSrc: string; // Foreground image URL, designed by the designer with a transparent background
    pageBgColor?: string; // Page background color
    pageBgImage?: string; // Page background image URL
}

// Define component props
const props = defineProps({
    slides: {
        type: Array as () => SlideDataItem[],
        required: true,
    },
    effect: {
        type: String,
        default: 'creative', // Default creative effect
        validator: (value: string) => ['creative', 'fade', 'cube', 'flip', 'coverflow'].includes(value),
    },
    direction: {
        type: String,
        default: 'vertical', // Default vertical slide
        validator: (value: string) => ['vertical', 'horizontal'].includes(value),
    },
    grabCursor: {
        type: Boolean,
        default: true, // Default show grab cursor
    },
    pagination: {
        type: [Boolean, Object], // Can be true/false or a configuration object
        default: () => ({ clickable: true }), // Default clickable pagination
    },
    // You can add more Swiper core parameters here as props
    // e.g., loop, autoplay, speed etc.
});

// Dynamically load Swiper modules based on the effect prop
const swiperModules = ref([Pagination]);
watchEffect(() => {
    swiperModules.value = [Pagination]; // Reset each time to ensure only needed modules are included
    if (props.effect === 'creative') {
        swiperModules.value.push(EffectCreative);
    } else if (props.effect === 'cube') {
        swiperModules.value.push(EffectCube);
    } else if (props.effect === 'fade') {
        swiperModules.value.push(EffectFade);
    } else if (props.effect === 'flip') {
        swiperModules.value.push(EffectFlip);
    } else if (props.effect === 'coverflow') {
        swiperModules.value.push(EffectCoverflow);
    }
});

// Function to generate background styles for each slide
const generateSlideBackgroundStyle = (slide: SlideDataItem) => {
    const style: Record<string, string> = {};
    if (slide.pageBgColor) {
        style.backgroundColor = slide.pageBgColor;
    } else {
        // Default white background if no color or image is specified
        style.backgroundColor = '#ffffff';
    }
    if (slide.pageBgImage) {
        style.backgroundImage = `url(${slide.pageBgImage})`;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
        style.backgroundRepeat = 'no-repeat';
    }
    return style;
};

// Default configurations for Swiper effects
const creativeEffectOptions = {
    prev: {
        shadow: true,
        translate: [0, 0, -400],
    },
    next: {
        translate: [0, '100%', 0],
    },
};

const cubeEffectOptions = {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
};

const fadeEffectOptions = {
    crossFade: true,
};

const flipEffectOptions = {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
};

const coverflowEffectOptions = {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
};
</script>

<style scoped>
.creative-slider-container {
    /* Ensure the entire container takes full screen height/width */
    position: relative;
    /* background-color: #000; If no specific background color is needed, it can be removed */
}

.mySwiper {
    width: 100%;
    height: 100%;
}

/* Styles for the merged slide content */
.health-info-slide-content {
    position: relative;
    /* background-color: handled by inline style binding */
    /* Ensure content fills the swiper-slide space */
}

.foreground-image {
    /* Assuming image width of 1080px */
    /* Ensure the image is fully displayed within the container, maintaining its aspect ratio */
    object-fit: contain;
    /* Adjust max-width/height to adapt to different screen sizes, if needed based on design */
    max-width: 100%;
    max-height: 100%;
}

/* Adjust Swiper Pagination styles to match project theme color */
:deep(.swiper-pagination-bullet-active) {
    background-color: var(--primary-color, #ff4d4f) !important;
    /* Use your theme color or default red */
}
</style>
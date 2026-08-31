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
                <div class="health-info-slide-content h-full w-full overflow-hidden"
                    :style="generateSlideBackgroundStyle(slide)">
                    <img :src="slide.imageSrc" alt="Health Information" class="foreground-image"
                        :style="{ 'object-position': getImagePosition(slide.imageAlign) }" />
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
import 'swiper/css/effect-creative';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-coverflow';

// Define the structure for each slide item
interface SlideDataItem {
    imageSrc: string; // Foreground image URL (transparent background)
    pageBgColor?: string; // Page background color
    pageBgImage?: string; // Page background image URL (1080x1920 designed)
    imageAlign?: 'top' | 'bottom' | 'center'; // New: Alignment of the foreground image
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
});

// Dynamically load Swiper modules based on the effect prop
const swiperModules = ref([Pagination]);
watchEffect(() => {
    swiperModules.value = [Pagination];
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
    }
    if (slide.pageBgImage) {
        style.backgroundImage = `url(${slide.pageBgImage})`;
        style.backgroundSize = 'cover'; // Ensure background image always fills the container
        style.backgroundPosition = 'center'; // Center the background image
        style.backgroundRepeat = 'no-repeat';
    } else {
        // Default white background if no color or image is specified
        style.backgroundColor = '#ffffff';
    }
    return style;
};

// Function to determine the object-position based on imageAlign
const getImagePosition = (align?: 'top' | 'bottom' | 'center') => {
    if (align === 'bottom') {
        return 'center bottom'; // Align horizontally center, vertically bottom
    } else if (align === 'center') {
        return 'center center'; // Align horizontally center, vertically center
    }
    return 'center top'; // Default to top alignment
};

// Default configurations for Swiper effects (unchanged)
const creativeEffectOptions = { prev: { shadow: true, translate: [0, 0, -400], }, next: { translate: [0, '100%', 0], }, };
const cubeEffectOptions = { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94, };
const fadeEffectOptions = { crossFade: true, };
const flipEffectOptions = { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true, };
const coverflowEffectOptions = { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true, };
</script>

<style scoped>
.creative-slider-container {
    position: relative;
}

.mySwiper {
    width: 100%;
    height: 100%;
}

.health-info-slide-content {
    position: relative;
    /* Crucial for absolute positioning of foreground-image */
}

.foreground-image {
    position: absolute;
    /* Take out of flow */
    width: 100%;
    /* Occupy full width of container */
    height: 100%;
    /* Occupy full height of container */
    object-fit: contain;
    /* Ensure image content is fully visible and scaled */
    /* object-position is now dynamically set via inline style */
    top: 0;
    /* Add top and left to ensure it covers the space before object-position kicks in */
    left: 0;
}

/* Adjust Swiper Pagination styles to match project theme color */
:deep(.swiper-pagination-bullet-active) {
    background-color: var(--primary-color, #ff4d4f) !important;
}
</style>
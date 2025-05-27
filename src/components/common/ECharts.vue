<template>
    <div class="echartsMain" ref="chartContainer" :style="{width:width, height:height}"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    width: {
        type: String,
        required: false,
        default: '100%'
    },
    height: {
        type: String,
        required: false,
        default: '300px'
    },
    option:{
        type: Object,
        required: true,
        default: () => ({})
    }
})


const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
    if (chartContainer.value) {
        chartInstance = echarts.init(chartContainer.value);
        const option: echarts.EChartOption = props.option;
        chartInstance.setOption(option);
    } else {
        console.error('Invalid DOM element for ECharts initialization.');
    }
};

onMounted(() => {
    initChart();
});

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.dispose();
    }
});

watch(() => props.option, (newOption) => {
    if (chartInstance) {
        chartInstance.setOption(newOption);
    }
})
</script>

<style scoped>
/* You can add styles for your chart container here */
</style>
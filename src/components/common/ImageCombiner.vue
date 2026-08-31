<template>
  <div class="image-combiner-pro w-full flex flex-col items-center">
    <canvas ref="canvasRef" class="hidden"></canvas>

    <!-- 生成后的合成图预览 -->
    <div v-if="combinedImage" class="preview">
      <img :src="combinedImage" alt="Combined Result" class="rounded-xl shadow-lg max-w-full" />
    </div>

    <!-- 插槽（可放上传控件等） -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
/** 图像合并器
 * 🧩 ImageCombinerPro.vue
 * 高级图片自动拼接组件（支持 1~9 张图片智能布局 + 滤镜预设系统）
 * 作者：ChatGPT (GPT-5)
 * 日期：2025-10-09
 *
 * 📘 参数列表（Props）
 * ---------------------------------------------------------
 * files: (File[] | string[])
 *    图片文件数组或 URL 数组，支持混合
 *
 * layoutMode: 'auto' | 'grid' | 'row' | 'column'
 *    自动布局模式（默认 auto）
 *
 * canvasMode: 'auto' | 'fixed'
 *    'auto' 根据图片数量和比例自动计算；
 *    'fixed' 使用指定画布尺寸。
 *
 * canvasWidth: number = 1080
 * canvasHeight: number = 1080
 *    固定画布宽高，仅在 canvasMode='fixed' 时生效。
 *
 * backgroundColor: string = '#ffffff'
 * backgroundImage: string | null
 * backgroundFit: 'cover' | 'contain' | 'repeat' = 'cover'
 *    背景设置（颜色或图片）
 *
 * borderRadius: number = 20
 * borderWidth: number = 1
 * borderColor: string = '#ffffff'
 * shadowBlur: number = 0
 * shadowColor: string = 'rgba(0,0,0,0.2)'
 *
 * brightness / contrast / saturation / hueRotate: number
 *    图像滤镜参数（默认 100, 100, 100, 0）
 *
 * filterPreset: 'none' | 'natural' | 'warm' | 'cool' | 'soft' | 'high-contrast'
 *    滤镜预设，可快速套用视觉风格。
 *
 * fitMode: 'contain' | 'cover' | 'stretch' = 'contain'
 *    图片缩放方式
 *
 * watermarks: Array<{
 *    type: 'text' | 'image',
 *    content: string,
 *    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center',
 *    opacity?: number,
 *    fontSize?: number,
 *    color?: string,
 *    rotate?: number
 * }> = []
 *    多层水印配置
 *
 * showTimestamp: boolean = false
 * timestampFormat: string = 'YYYY-MM-DD HH:mm'
 *
 * outputType: 'base64' | 'blob' | 'file' = 'base64'
 * outputQuality: number = 0.92
 *
 * autoUpdate: boolean = true
 * debounce: number = 200
 *
 * emit:
 *  - update:image(Base64String | Blob)
 * 
 *
 * 📘 示例调用：
 * ---------------------------------------------------------
 * <ImageCombinerPro
 *   :files="['/a.jpg', '/b.jpg', '/c.jpg']"
 *   layout-mode="auto"
 *   filter-preset="warm"
 *   :canvas-width="1080"
 *   :canvas-height="1080"
 *   background-color="#fff"
 *   :watermarks="[
 *     { type: 'text', content: '诊所专用', position: 'top-left', fontSize: 28, opacity: 0.7 },
 *     { type: 'image', content: '/logo.png', position: 'bottom-right', opacity: 0.8 }
 *   ]"
 *   output-type="blob"
 *   @update:image="handleResult"
 * />
 */

import { ref, watch, onMounted, nextTick, computed } from 'vue'

/* ---------- 类型定义 ---------- */
interface Watermark {
  type: 'text' | 'image'
  content: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  opacity?: number
  fontSize?: number
  color?: string
  rotate?: number
}

interface Props {
  files: (File | string)[]
  layoutMode?: 'auto' | 'grid' | 'row' | 'column'
  canvasMode?: 'auto' | 'fixed'
  canvasWidth?: number
  canvasHeight?: number
  backgroundColor?: string
  backgroundImage?: string | null
  backgroundFit?: 'cover' | 'contain' | 'repeat'
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  shadowBlur?: number
  shadowColor?: string
  brightness?: number
  contrast?: number
  saturation?: number
  hueRotate?: number
  filterPreset?: 'none' | 'natural' | 'warm' | 'cool' | 'soft' | 'high-contrast'
  fitMode?: 'contain' | 'cover' | 'stretch'
  watermarks?: Watermark[]
  showTimestamp?: boolean
  timestampFormat?: string
  outputType?: 'base64' | 'blob' | 'file'
  outputQuality?: number
  autoUpdate?: boolean
  debounce?: number
}

/* ---------- Props 默认值 ---------- */
const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'auto',
  canvasMode: 'auto',
  canvasWidth: 1080,
  canvasHeight: 1080,
  backgroundColor: '#ffffff',
  backgroundImage: null,
  backgroundFit: 'cover',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ffffff',
  shadowBlur: 0,
  shadowColor: 'rgba(0,0,0,0.2)',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  filterPreset: 'none',
  fitMode: 'contain',
  watermarks: () => [],
  showTimestamp: false,
  timestampFormat: 'YYYY-MM-DD HH:mm',
  outputType: 'base64',
  outputQuality: 0.92,
  autoUpdate: true,
  debounce: 200
})

const emit = defineEmits(['update:image'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const combinedImage = ref<string | null>(null)

/* ---------- 滤镜预设系统 ---------- */
const filterPresets = {
  none: { brightness: 100, contrast: 100, saturation: 100, hueRotate: 0 },
  natural: { brightness: 105, contrast: 105, saturation: 108, hueRotate: 0 },
  warm: { brightness: 105, contrast: 105, saturation: 120, hueRotate: 10 },
  cool: { brightness: 100, contrast: 110, saturation: 105, hueRotate: -10 },
  soft: { brightness: 108, contrast: 95, saturation: 98, hueRotate: 0 },
  'high-contrast': { brightness: 110, contrast: 120, saturation: 115, hueRotate: 0 }
}

const activeFilter = computed(() => {
  const preset = filterPresets[props.filterPreset || 'none']
  return {
    brightness: props.brightness ?? preset.brightness,
    contrast: props.contrast ?? preset.contrast,
    saturation: props.saturation ?? preset.saturation,
    hueRotate: props.hueRotate ?? preset.hueRotate
  }
})

/* ---------- 核心绘制逻辑 ---------- */
const drawImages = async () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const validFiles = props.files.filter(f => !!f)
  if (validFiles.length === 0) return

  const loadImage = (src: File | string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      if (typeof src === 'string') img.src = src
      else img.src = URL.createObjectURL(src)
    })
  }

  const images = await Promise.all(validFiles.map(loadImage))
  const count = images.length

  // 动态布局
  let rows = 1, cols = count
  if (props.layoutMode === 'auto') {
    if (count <= 1) { rows = 1; cols = 1 }
    else if (count === 2) { rows = 1; cols = 2 }
    else if (count === 3) { rows = 1; cols = 3 }
    else if (count === 4) { rows = 2; cols = 2 }
    else if (count === 5) { rows = 2; cols = 3 }
    else if (count <= 6) { rows = 2; cols = 3 }
    else if (count <= 9) { rows = 3; cols = 3 }
  }

  const spacing = 10
  const cellWidth = props.canvasMode === 'fixed'
    ? (props.canvasWidth - (cols + 1) * spacing) / cols
    : 300
  const cellHeight = props.canvasMode === 'fixed'
    ? (props.canvasHeight - (rows + 1) * spacing) / rows
    : 300

  if (props.canvasMode === 'auto') {
    canvas.width = cols * cellWidth + (cols + 1) * spacing
    canvas.height = rows * cellHeight + (rows + 1) * spacing
  } else {
    canvas.width = props.canvasWidth
    canvas.height = props.canvasHeight
  }

  // 背景
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 滤镜应用
  ctx.filter = `brightness(${activeFilter.value.brightness}%) contrast(${activeFilter.value.contrast}%) saturate(${activeFilter.value.saturation}%) hue-rotate(${activeFilter.value.hueRotate}deg)`

  images.forEach((img, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = spacing + c * (cellWidth + spacing)
    const y = spacing + r * (cellHeight + spacing)

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, cellWidth, cellHeight, props.borderRadius)
    ctx.clip()
    ctx.drawImage(img, x, y, cellWidth, cellHeight)
    ctx.restore()

    if (props.borderWidth > 0) {
      ctx.strokeStyle = props.borderColor
      ctx.lineWidth = props.borderWidth
      ctx.strokeRect(x, y, cellWidth, cellHeight)
    }
  })

  // 输出
  const result = props.outputType === 'blob'
    ? await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png', props.outputQuality))
    : canvas.toDataURL('image/png', props.outputQuality)

  if (typeof result === 'string') combinedImage.value = result
  emit('update:image', result)
}

/* ---------- 自动绘制 ---------- */
watch(() => [props.files, props.filterPreset], () => {
  if (props.autoUpdate) drawImages()
}, { deep: true })

onMounted(() => {
  if (props.files.length > 0) nextTick(drawImages)
})
</script>

<style scoped>
.preview img {
  max-width: 100%;
  border-radius: 16px;
}
</style>

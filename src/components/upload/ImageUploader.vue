<!-- 圈子贴文 -->
<!-- <ImageUploader v-model="form.images" :max="9" upload-path="member/circle" /> -->

<!-- 聊天图片（Step 12 复用）-->
<!-- <ImageUploader v-model="chatImg" :max="1" upload-path="member/chat" /> -->

<!-- 其他场景 -->
<!-- <ImageUploader v-model="avatar" :max="1" upload-path="user/avatar" /> -->

<template>
    <div class="image-uploader">
        <div class="upload-grid flex flex-wrap w-full gap-2">

            <!-- 已上传图片 -->
            <div
                v-for="(url, idx) in modelValue"
                :key="idx"
                class="upload-item upload-item--preview"
            >
                <van-image :src="url" fit="cover" width="100%" height="100%" @click="previewImage(idx)" />
                <div class="item-delete" @click.stop="removeImage(idx)">
                    <van-icon name="cross" size="12" color="#fff" />
                </div>
            </div>

            <!-- 上传按钮 -->
            <div
                v-if="modelValue.length < max && !disabled"
                class="upload-item upload-item--add"
            >
                <van-uploader
                    :after-read="onAfterRead"
                    :multiple="max > 1"
                    :max-count="max - modelValue.length"
                    :disabled="uploading"
                    accept="image/*"
                >
                    <div class="add-inner">
                        <van-loading v-if="uploading" size="22" color="#bbb" />
                        <template v-else>
                            <van-icon name="photograph" size="26" color="#ccc" />
                            <span class="add-text">{{ modelValue.length }}/{{ max }}</span>
                        </template>
                    </div>
                </van-uploader>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showImagePreview } from 'vant'
import { useGlobal } from '@/utils/Global';
const { axios, store} = useGlobal();
import { ElMessage } from 'element-plus'
// ── Props & Emits ─────────────────────────────────────────────

const props = withDefaults(defineProps<{
    modelValue:   string[]   // v-model，已上传 URL 数组
    max?:         number     // 最大张数，默认 1
    disabled?:    boolean
    uploadPath?:  string     // 后端保存目录，默认 'member/circle'
    maxSize?:     number     // 最大尺寸 px，默认 2048
    quality?:     number     // 压缩质量 0~1，默认 0.80
}>(), {
    max:        1,
    disabled:   false,
    uploadPath: 'member/circle',
    maxSize:    2048,
    quality:    0.80,
})

const emit = defineEmits<{
    'update:modelValue': [urls: string[]]
    'upload-success':    [url: string]
    'upload-error':      [err: any]
}>()

// ── 状态 ─────────────────────────────────────────────────────

const uploading = ref(false)

// ── van-uploader after-read 回调 ──────────────────────────────

async function onAfterRead(file: any) {
    const files = Array.isArray(file) ? file : [file]
    uploading.value = true

    for (const f of files) {
        if (!f.file || !(f.file instanceof Blob)) continue
        try {
            const base64 = await fileToBase64(f.file as File)
            // 调用后端 common/uploads_base64，path 参数指定保存目录
            const res = await axios.post(
                'common/uploads_base64',
                { base64_image: base64 },
                { params: { path: props.uploadPath }, toast: 0 }
            )

            // 后端 returnJson($img) → 前端拦截器后 res 即整个 data 对象
            // res.data 是图片 URL 字符串
            const url = store.uploadsPath + res.data.url as string
            if (!url) throw new Error('未获取到图片地址')
            emit('update:modelValue', [...props.modelValue, url])
            emit('upload-success', url)
        } catch (err) {
            ElMessage.error('上传失败，请重试')
            emit('upload-error', err)
        }
    }

    uploading.value = false
}

// ── 图片转 base64（含等比缩放）────────────────────────────────

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = (e: any) => {
            const img = new Image()
            img.onerror = reject
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx    = canvas.getContext('2d')!
                const max    = props.maxSize
                let { width, height } = img

                // 等比缩放，超出 maxSize 时缩小
                if (width > height) {
                    if (width > max) { height = Math.round(height * max / width); width = max }
                } else {
                    if (height > max) { width = Math.round(width * max / height); height = max }
                }
                canvas.width  = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', props.quality))
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    })
}

// ── 删除 & 预览 ───────────────────────────────────────────────

function removeImage(idx: number) {
    const list = [...props.modelValue]
    list.splice(idx, 1)
    emit('update:modelValue', list)
}

function previewImage(startIndex: number) {
    if (props.modelValue.length) {
        showImagePreview({ images: props.modelValue, startPosition: startIndex })
    }
}
</script>

<style scoped lang="scss">
.image-uploader { width: 100%; }

// .upload-grid {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 8px;
// }

.upload-item {
    width: calc(33.33% - 6px);
    aspect-ratio: 1;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background: #f5f0fc;

    // 单张上限时撑满宽度
    &:first-child:last-child {
        width: 100%;
        aspect-ratio: 16 / 9;
        max-height: 200px;
    }

    &--preview {
        :deep(.van-image) { width: 100%; height: 100%; }
    }

    &--add {
        border: 1.5px dashed #d4c4f0;
        background: #faf7ff;
        transition: background 0.2s;
        &:active { background: #f0e8ff; }

        // van-uploader 撑满整个格子
        :deep(.van-uploader),
        :deep(.van-uploader__wrapper),
        :deep(.van-uploader__input-wrapper) {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .item-delete {
        position: absolute;
        top: 4px; right: 4px;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
    }
}

.add-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    pointer-events: none;

    .add-text { font-size: 11px; color: #c8b8e8; }
}
</style>

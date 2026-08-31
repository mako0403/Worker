<template>
    <div class="post-create-page">

        <!-- 背景装饰 -->
        <div class="bg-decoration">
            <div class="bg-blob bg-blob--1" />
            <div class="bg-blob bg-blob--2" />
        </div>

        <div class="create-body">

            <!-- 作者信息区 -->
            <div class="author-card">
                <div class="author-avatar-wrap">
                    <van-image
                        round width="46" height="46"
                        :src="currentAvatar || defaultAvatar"
                        fit="cover"
                    />
                    <div class="author-role-dot" :class="circleStore.isExpert ? 'dot--expert' : circleStore.isWorker ? 'dot--worker' : 'dot--member'" />
                </div>
                <div class="author-meta">
                    <div class="author-name">{{ currentNickname }}</div>
                    <div class="author-role-tag" :class="circleStore.isExpert ? 'tag--expert' : circleStore.isWorker ? 'tag--worker' : 'tag--member'">
                        {{ circleStore.isExpert ? '✦ 专家' : circleStore.isWorker ? '员工' : '会员' }}
                    </div>
                </div>
                <div class="char-counter" :class="{ 'char-counter--warn': form.content.length > 800 }">
                    {{ form.content.length }}/1000
                </div>
            </div>

            <!-- 正文输入 -->
            <div class="content-section">
                <van-field
                    v-model="form.content"
                    type="textarea"
                    :placeholder="placeholderText"
                    :rows="6"
                    maxlength="1000"
                    class="content-field"
                    autofocus
                />
            </div>

            <!-- 图片上传区 -->
            <div class="section-card">
                <div class="section-header">
                    <div class="section-icon section-icon--pink">
                        <van-icon name="photograph" size="14" color="#fff" />
                    </div>
                    <span class="section-label">添加图片</span>
                    <span class="section-badge">{{ form.images.length }}/9</span>
                </div>

                <div class="image-grid">
                    <ImageUploader
                        v-model="form.images"
                        :max="9"
                        upload-path="members/circle"
                    />
                </div>
            </div>

            <!-- 标签区 -->
            <div class="section-card">
                <div class="section-header">
                    <div class="section-icon section-icon--purple">
                        <van-icon name="label-o" size="14" color="#fff" />
                    </div>
                    <span class="section-label">话题标签</span>
                    <span class="section-badge">{{ form.tags.length }}/5</span>
                </div>

                <div v-if="form.tags.length > 0" class="selected-tags">
                    <div v-for="tag in form.tags" :key="tag" class="selected-tag" @click="removeTag(tag)">
                        <span># {{ tag }}</span>
                        <van-icon name="cross" size="10" />
                    </div>
                </div>

                <div class="preset-tags">
                    <div
                        v-for="tag in PRESET_TAGS" :key="tag"
                        class="preset-tag"
                        :class="{ 'preset-tag--active': form.tags.includes(tag), 'preset-tag--disabled': form.tags.length >= 5 && !form.tags.includes(tag) }"
                        @click="toggleTag(tag)"
                    >
                        # {{ tag }}
                    </div>
                </div>

                <div v-if="form.tags.length < 5" class="custom-tag-row">
                    <van-field
                        v-model="customTagInput"
                        placeholder="自定义标签..."
                        class="custom-tag-field"
                        :border="false"
                        clearable
                        @keyup.enter="addCustomTag"
                    />
                    <div class="custom-tag-btn" :class="{ 'custom-tag-btn--active': customTagInput.trim() }" @click="addCustomTag">
                        添加
                    </div>
                </div>
            </div>

            <div class="notice-strip">
                <van-icon name="info-o" size="13" color="#a78bcd" />
                <span>请发布正能量内容，共建温暖社区</span>
            </div>

            <div style="height: 100px;" />
        </div>

        <!-- 底部发布栏 -->
        <div class="publish-bar">
            <div class="publish-bar-inner">
                <div class="draft-hint" v-if="form.content.length > 0">已写 {{ form.content.length }} 字</div>
                <div v-else />
                <div class="publish-bar-right">
                    <div class="cancel-btn" @click="onCancel">取消</div>
                    <div
                        class="publish-btn"
                        :class="{ 'publish-btn--active': canSubmit, 'publish-btn--loading': submitting }"
                        @click="onSubmit"
                    >
                        <van-loading v-if="submitting" size="16" color="#fff" />
                        <span v-else>✦ 发布</span>
                    </div>
                </div>
            </div>
        </div>

        <van-dialog
            v-model:show="showCancelDialog"
            title="放弃这篇内容？"
            message="已编辑的内容将不会保存"
            show-cancel-button
            confirm-button-text="放弃"
            confirm-button-color="#e05c8a"
            cancel-button-text="继续编辑"
            @confirm="router.back()"
        />

    </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { useCircleStore } from '@/store/circle'
import { useGlobalStore } from '@/store/global'
import axios from '@/utils/axios'
import { useHeaderAction } from '@/composables/useHeaderAction'
import ImageUploader from '@/components/upload/ImageUploader.vue'
import defaultAvatar from '@@/images/default_avatar.webp'
import { ElMessage } from 'element-plus'

const router      = useRouter()
const circleStore = useCircleStore()
const globalStore = useGlobalStore()
const { workerConfig, memberInfo, userRole } = toRefs(globalStore)

useHeaderAction('submit', onSubmit)

// ── 当前用户信息 ──────────────────────────────────────────────
const currentNickname = computed(() => {
    if (userRole.value === 'worker') return (workerConfig.value as any)?.fullname || '员工'
    return (memberInfo.value as any)?.nickname || '会员'
})

const currentAvatar = computed(() => {
    if (userRole.value === 'worker') {
        const h = (workerConfig.value as any)?.headimg
        return h ? globalStore.uploadsPath + h : ''
    }
    const a = (memberInfo.value as any)?.avatar
    return a ? globalStore.uploadsPath + a : ''
})

const placeholderText = computed(() => {
    if (circleStore.isExpert) return '作为专家，分享你的专业知识和经验...'
    if (circleStore.isWorker) return '分享你在工作中的观察和心得...'
    return '分享你的产后恢复经历、育儿心得，或有用的健康知识...'
})

// ── 表单 ─────────────────────────────────────────────────────
const form = ref({ content: '', images: [] as string[], tags: [] as string[] })
const submitting    = ref(false)
const canSubmit     = computed(() => form.value.content.trim().length > 0 && !submitting.value)
const hasContent    = computed(() => form.value.content.trim().length > 0 || form.value.images.length > 0 || form.value.tags.length > 0)

// ── 标签 ─────────────────────────────────────────────────────
const PRESET_TAGS    = ['产后康复', '母乳喂养', '育儿经验', '运动计划', '营养饮食', '心理健康', '新生儿护理', '体型恢复']
const customTagInput = ref('')

function toggleTag(tag: string) {
    const idx = form.value.tags.indexOf(tag)
    if (idx !== -1) { form.value.tags.splice(idx, 1) }
    else { if (form.value.tags.length >= 5) { ElMessage.warning('最多 5 个标签'); return }; form.value.tags.push(tag) }
}
function removeTag(tag: string) { form.value.tags = form.value.tags.filter(t => t !== tag) }
function addCustomTag() {
    const tag = customTagInput.value.trim().replace(/^#\s*/, '')
    if (!tag) return
    if (form.value.tags.length >= 5) { ElMessage.warning('最多 5 个标签'); return }
    if (form.value.tags.includes(tag)) { ElMessage.info('标签已添加'); customTagInput.value = ''; return }
    if (tag.length > 10) { ElMessage.warning('标签最多 10 个字'); return }
    form.value.tags.push(tag); customTagInput.value = ''
}

// ── 发布 & 取消 ───────────────────────────────────────────────
async function onSubmit() {
    if (!canSubmit.value) { if (!form.value.content.trim()) { ElMessage.error('请填写内容'); return } }
    submitting.value = true
    try {
        // images 和 tags 后端用 I('post.xxx') 接收字符串，直接传 JSON 字符串
        const images = form.value.images.length > 0 ? JSON.stringify(form.value.images) : '[]'
        const tags   = form.value.tags.length   > 0 ? JSON.stringify(form.value.tags)   : '[]'
        const res = await axios.post('circle/create_post', {
            content: form.value.content.trim(),
            images,
            tags,
        })

        // 判断后端返回状态，失败时阻止跳转
        if (!res || res.status != 1) {
            //ElMessage.error(res?.info || '发布失败，请重试')
            return
        }

        ElMessage.success('发布成功 🎉')
        circleStore.resetPosts()
        router.back()
    } catch { ElMessage.error('发布失败，请重试') }
    finally { submitting.value = false }
}

const showCancelDialog = ref(false)
function onCancel() { if (hasContent.value) { showCancelDialog.value = true } else { router.back() } }
</script>

<style scoped lang="scss">
.post-create-page {
    --color-purple:    #7c5cbf;
    --color-purple-lt: #e8dcf8;
    --color-pink:      #e05c8a;
    --radius-card:     16px;
    min-height: 100vh;
    background: #f7f4fc;
    position: relative;
    overflow: hidden;
    padding-bottom: 80px;
}

.bg-decoration { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-blob {
    position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.12;
    &--1 { width: 300px; height: 300px; background: var(--color-purple); top: -80px; right: -60px; }
    &--2 { width: 200px; height: 200px; background: var(--color-pink); bottom: 100px; left: -60px; }
}

.create-body {
    position: relative; z-index: 1;
    padding: 12px 14px 0;
    display: flex; flex-direction: column; gap: 10px;
}

.author-card {
    display: flex; align-items: center; gap: 10px;
    background: #fff; border-radius: var(--radius-card);
    padding: 12px 14px;
    box-shadow: 0 2px 12px rgba(124,92,191,0.08);

    .author-avatar-wrap {
        position: relative; flex-shrink: 0;
        .author-role-dot {
            position: absolute; bottom: 0; right: 0;
            width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff;
            &.dot--expert { background: #f97316; }
            &.dot--worker { background: #10b981; }
            &.dot--member { background: var(--color-purple); }
        }
    }
    .author-meta { flex: 1;
        .author-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .author-role-tag {
            display: inline-block; font-size: 10px; font-weight: 600;
            padding: 1px 7px; border-radius: 8px; margin-top: 3px; letter-spacing: 0.5px;
            &.tag--expert { background: #fff3e0; color: #f97316; }
            &.tag--worker { background: #e6f9f3; color: #10b981; }
            &.tag--member { background: var(--color-purple-lt); color: var(--color-purple); }
        }
    }
    .char-counter { font-size: 11px; color: #bbb; flex-shrink: 0;
        &--warn { color: var(--color-pink); font-weight: 600; }
    }
}

.content-section {
    background: #fff; border-radius: var(--radius-card); overflow: hidden;
    box-shadow: 0 2px 12px rgba(124,92,191,0.08);
}
.content-field {
    :deep(.van-field__control) { font-size: 15px; line-height: 1.75; color: #2d2d3a;
        &::placeholder { color: #c4b8d8; }
    }
    :deep(.van-field__body) { padding: 14px 16px; }
}

.section-card {
    background: #fff; border-radius: var(--radius-card);
    padding: 14px 14px 16px;
    box-shadow: 0 2px 12px rgba(124,92,191,0.08);
}
.section-header {
    display: flex; align-items: center; gap: 7px; margin-bottom: 12px;
    .section-icon {
        width: 22px; height: 22px; border-radius: 6px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        &--pink   { background: linear-gradient(135deg, #e05c8a, #f093b0); }
        &--purple { background: linear-gradient(135deg, #7c5cbf, #9b7de0); }
    }
    .section-label { font-size: 14px; font-weight: 700; color: #2d2d3a; flex: 1; }
    .section-badge { font-size: 11px; color: #bbb; background: #f5f0fc; padding: 2px 8px; border-radius: 10px; }
}


.image-item {
    aspect-ratio: 1; border-radius: 10px; overflow: hidden; position: relative; background: #f5f0fc;
    :deep(.van-image) { width: 100%; height: 100%; }
    .image-delete {
        position: absolute; top: 4px; right: 4px;
        width: 20px; height: 20px; border-radius: 50%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 2; backdrop-filter: blur(4px);
    }
    .image-uploading {
        position: absolute; inset: 0; background: rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center; z-index: 3;
    }
}
.image-add-btn {
    aspect-ratio: 1; border-radius: 10px; border: 2px dashed #d4c4f0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; background: #faf7ff; transition: background 0.2s;
    &:active { background: #f0e8ff; }
    :deep(.van-uploader), :deep(.van-uploader__wrapper), :deep(.van-uploader__input-wrapper) {
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    }
}
.uploader-inner {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    .uploader-text { font-size: 10px; color: #c8b8e8; }
}

.selected-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 10px;
    .selected-tag {
        display: flex; align-items: center; gap: 5px;
        background: linear-gradient(135deg, var(--color-purple), #9b7de0);
        color: #fff; font-size: 12px; font-weight: 600;
        padding: 4px 10px; border-radius: 20px; cursor: pointer;
        &:active { opacity: 0.8; }
    }
}
.preset-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 10px;
    .preset-tag {
        font-size: 12px; padding: 4px 12px; border-radius: 20px;
        border: 1.5px solid #d4c4f0; color: #9b7de0; background: #faf7ff;
        cursor: pointer; transition: all 0.15s; font-weight: 500;
        &:active { opacity: 0.7; }
        &--active { background: var(--color-purple-lt); border-color: var(--color-purple); color: var(--color-purple); font-weight: 700; }
        &--disabled { opacity: 0.35; cursor: not-allowed; }
    }
}
.custom-tag-row {
    display: flex; align-items: center; gap: 8px;
    background: #f5f0fc; border-radius: 10px; padding: 2px 4px 2px 8px;
    .custom-tag-field {
        flex: 1; background: transparent;
        :deep(.van-field__control) { font-size: 13px; color: #2d2d3a; &::placeholder { color: #c4b8d8; } }
    }
    .custom-tag-btn {
        font-size: 12px; font-weight: 600; color: #bbb;
        padding: 5px 10px; border-radius: 8px; flex-shrink: 0; transition: all 0.15s;
        &--active { background: var(--color-purple); color: #fff; }
    }
}

.notice-strip {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: #a78bcd; padding: 0 4px;
}

.publish-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
    border-top: 1px solid #ede6f8;
    padding: 10px 16px; padding-bottom: calc(10px + env(safe-area-inset-bottom)); z-index: 100;
    .publish-bar-inner { display: flex; align-items: center; justify-content: space-between; }
    .draft-hint { font-size: 12px; color: #bbb; }
    .publish-bar-right { display: flex; align-items: center; gap: 10px; }
    .cancel-btn { font-size: 14px; color: #999; padding: 6px 12px; cursor: pointer; &:active { opacity: 0.6; } }
    .publish-btn {
        display: flex; align-items: center; justify-content: center;
        min-width: 90px; height: 38px; border-radius: 20px;
        font-size: 14px; font-weight: 700; letter-spacing: 1px;
        background: #e0d0f0; color: #bba8d8;
        transition: all 0.2s; cursor: not-allowed; padding: 0 20px;
        &--active {
            background: linear-gradient(135deg, #7c5cbf, #e05c8a);
            color: #fff; cursor: pointer;
            box-shadow: 0 4px 16px rgba(124,92,191,0.4);
            &:active { transform: scale(0.96); }
        }
        &--loading { cursor: wait; }
    }
}
</style>
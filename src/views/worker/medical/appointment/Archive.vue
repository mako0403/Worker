<template>
    <div class="w-full h-full relative">
        <HeaderSimple content="治疗记录归档" />
        <div class="record-form">
            <div class="mt-0">
                <div class="mb-2 flex justify-content-between align-items-center">
                    <div class="text-md">治疗效果</div>
                    <div class="text-xs text-red-200">患者可见，可分享</div>
                </div>
                <el-input v-model="submitForm.result" :rows="3" type="textarea" class="w-full" placeholder="请简短描述治疗效果..." />
            </div>
            <div class="mt-3">
                <div class="mb-2 flex justify-content-between align-items-center">
                    <div class="text-md">康复建议</div>
                    <div class="text-xs text-red-200">患者可见</div>
                </div>
                <el-input v-model="submitForm.exhort" :rows="3" type="textarea" class="w-full" placeholder="请输入康复建议..." />
            </div>
            <div class="mt-3">
                <div class="mb-2 flex justify-content-between align-items-center">
                    <div class="text-md">归档备注</div>
                    <div class="text-xs text-bluegray-200">选填，仅内部可见</div>
                </div>
                <el-input v-model="submitForm.remarks" :rows="3" type="textarea" class="w-full"
                    placeholder="请输入备注..." />
            </div>
            <div class="mt-3">
                <div class="flex justify-content-between align-items-center gap-3">
                    <div class="w-full">
                        <van-uploader v-model="fileList1" @before-read="handleAfterRead1" max-count="1" accept="image/*"
                            name="image1" preview-size="100%" class="m-0">
                            <template #default>
                                <div class="p-4 border-1 border-gray-300 border-dotted w-full text-center">
                                    <van-icon name="photo-o" size="30px" />
                                    <div class="text-sm text-gray-500 mt-2" v-if="fileList1.length === 0">治疗前图</div>
                                </div>
                            </template>
                        </van-uploader>
                    </div>
                    <div class="w-full">
                        <van-uploader v-model="fileList2" @before-read="handleAfterRead1" max-count="1" accept="image/*"
                            name="image2" preview-size="100%" class="m-0">
                            <template #default>
                                <div class="p-4 border-1 border-gray-300 border-dotted w-full text-center">
                                    <van-icon name="photo-o" size="30px" />
                                    <div class="text-sm text-gray-500 mt-2" v-if="fileList2.length === 0">治疗后图</div>
                                </div>
                            </template>
                        </van-uploader>
                    </div>
                </div>
                <div v-if="combinedImage">
                    <div class="mt-3">
                        <div class="flex align-items-center">
                            <el-icon size="20" class="text-orange-500">
                                <Picture />
                            </el-icon>
                            <div class="font-bold text-xl ml-2">组合图像</div>
                        </div>
                        <div class="text-gray-400 text-sm mt-1">Merge the combined image</div>
                    </div>
                    <el-collapse v-model="activeNames" class="border-0 mt-0 mb-3">
                        <el-collapse-item name="1">
                            <template #title>
                                <div class="text-sm">调整图像色彩</div>
                            </template>
                            <div class="px-3">
                                <div class="slider-demo-block">
                                    <div class="text-sm text-dblue-900">亮度 <span
                                            class="text-xs text-gray-500">Brightness</span>
                                    </div>
                                    <el-slider v-model="brightness" size="small" :min="0" :max="200" />
                                </div>
                                <div class="slider-demo-block">
                                    <div class="text-sm text-dblue-900">对比度 <span
                                            class="text-xs text-gray-500">Contrast</span>
                                    </div>
                                    <el-slider v-model="contrast" :min="0" :max="200" />
                                </div>
                                <div class="slider-demo-block">
                                    <div class="text-sm text-dblue-900">饱和度 <span
                                            class="text-xs text-gray-500">Saturation</span>
                                    </div>
                                    <el-slider v-model="saturation" :min="0" :max="200" />
                                </div>
                                <div class="slider-demo-block">
                                    <div class="text-sm text-dblue-900">色相 <span class="text-xs text-gray-500">Hue
                                            Rotate</span>
                                    </div>
                                    <el-slider v-model="hueRotate" :min="0" :max="360" />
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>

                    <div class="relative bg-gray-50">
                        <img :src="combinedImage" alt="Combined Image" width="100%" />
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed flex justify-content-between mt-3" style="left:20px; right: 20px; bottom:20px;">
            <el-button type="danger" size="large" @click="combineImages" class="flex-grow-1">
                生成组合图片
            </el-button>
            <el-button type="primary" size="large" class="flex-grow-1 bg-dblue-500 border-dblue-800"
                @click="handleSubmit">
                确认归档
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/utils/axios'
import { Field as vanField, Uploader as vanUploader, Button as vanButton, Icon as vanIcon } from 'vant';
import { ElMessage } from 'element-plus';
import { showLoadingToast, closeToast } from 'vant'
import Compressor from 'compressorjs';

import HeaderSimple from '@/components/layout/header/HeaderSimple.vue';

const { params } = useRoute();
const router = useRouter();

const appointment = ref([])
const submitForm = ref({
    result: '',
    exhort: '',
    remarks: '',
    comparison_image: '',
})
onMounted(async () => {
    await axios.get('/services/get_appointment', { id: params.id }).then(res => {
        appointment.value = res.data
    })
    submitForm.value.worker_id = appointment.value.services_worker_id
    submitForm.value.services_id = appointment.value.id
    submitForm.value.card_number = appointment.value.card_number
    submitForm.value.date = appointment.value.date
})



const activeNames = ref(1);

const fileList1 = ref([]);
const fileList2 = ref([]);
const combinedImage = ref(null);
const brightness = ref(108); // 亮度
const contrast = ref(108); // 对比度
const saturation = ref(108); // 饱和度
const hueRotate = ref(0);

watch(() => fileList1.value, (nval, oval) => {
    if (nval.length === 0) {
        combinedImage.value = null;
    }
})

watch(() => fileList2.value, (nval, oval) => {
    if (nval.length === 0) {
        combinedImage.value = null;
    }
})

const handleAfterRead1 = (file) => {
    // 限制文件类型为图片
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return false;
    }

    return new Promise((resolve) => {
        // compressorjs 默认开启 checkOrientation 选项
        // 会将图片修正为正确方向
        new Compressor(file, {
            quality: 0.8,
            width: 500,
            height: 1000,
            resize: 'cover',
            success: async (result) => {
                //let file1 = new File([result], file.name, { type: file.type })
                resolve(result);
            },
            error(err) {
                console.log(err.message);
            },
        });
    });

    return true;
};


const combineImages = () => {
    if (fileList1.value.length === 0 || fileList2.value.length === 0) {
        ElMessage.error('请先上传治疗前后图');
        return;
    }
    showLoadingToast({
        message: '生成中...',
        forbidClick: true,
        overlay: true,
        duration: 0,
    });
    pimages(fileList1.value[0].file, fileList2.value[0].file).then(() => {
        closeToast();
    }).catch(error => {
        console.error('Error processing images', error);
        closeToast();
    });
};

const pimages = async (file1, file2) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img1 = new Image();
    const img2 = new Image();

    const loadImage = (img, file) => {
        return new Promise((resolve, reject) => {
            const objectURL = URL.createObjectURL(file);
            img.src = objectURL;
            img.onload = () => {
                URL.revokeObjectURL(objectURL);
                resolve(img);
            };
            img.onerror = reject;
        });
    };

    try {
        const [loadedImg1, loadedImg2] = await Promise.all([loadImage(img1, file1), loadImage(img2, file2)]);

        const canvasSize = 1280;
        const padding = 20;
        const imageSpacing = 20;
        const borderWidth = 1;
        const labelHeight = 0;
        const availableWidth = canvasSize - 2 * padding - imageSpacing - 4 * borderWidth;
        const imageWidth = availableWidth / 2;

        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const scale1 = (canvasSize - 2 * padding - 2 * borderWidth - labelHeight) / loadedImg1.height;
        const scale2 = (canvasSize - 2 * padding - 2 * borderWidth - labelHeight) / loadedImg2.height;

        const scaledWidth1 = loadedImg1.width * scale1;
        const scaledWidth2 = loadedImg2.width * scale2;

        const cropWidth1 = (scaledWidth1 - imageWidth) / 2;
        const cropWidth2 = (scaledWidth2 - imageWidth) / 2;

        requestAnimationFrame(() => {
            updateImage(context, loadedImg1, loadedImg2, cropWidth1, cropWidth2, imageSpacing, borderWidth, labelHeight, padding, canvasSize, imageWidth);
        });
    } catch (error) {
        throw new Error('Error loading images');
    }
};

const updateImage = (context, img1, img2, cropWidth1, cropWidth2, imageSpacing, borderWidth, labelHeight, padding, canvasSize, imageWidth) => {
    const canvas = context.canvas;
    const totalImageWidth = imageWidth + 2 * borderWidth;

    context.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hueRotate.value}deg)`;
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRoundedImage(context, img1, cropWidth1, padding, padding, imageWidth, canvasSize, borderWidth, labelHeight, ''); //治疗前
    drawRoundedImage(context, img2, cropWidth2, padding + totalImageWidth + imageSpacing, padding, imageWidth, canvasSize, borderWidth, labelHeight, ''); //治疗后

    context.imageSmoothingEnabled = false;
    combinedImage.value = canvas.toDataURL('image/png');
};

const drawRoundedImage = (context, image, cropWidth, dx, dy, dw, canvasSize, borderWidth, labelHeight, labelText) => {
    const totalImageHeight = canvasSize - 2 * dy - 2 * borderWidth - labelHeight;
    const radius = 20;

    context.save();
    context.beginPath();
    context.moveTo(dx + radius, dy);
    context.arcTo(dx + dw, dy, dx + dw, dy + totalImageHeight, radius);
    context.arcTo(dx + dw, dy + totalImageHeight, dx, dy + totalImageHeight, radius);
    context.arcTo(dx, dy + totalImageHeight, dx, dy, radius);
    context.arcTo(dx, dy, dx + radius, dy, radius);
    context.closePath();

    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 1;
    context.stroke();

    context.clip();
    context.drawImage(image, cropWidth, 0, image.width - 2 * cropWidth, image.height, dx, dy, dw, totalImageHeight);
    context.restore();

    context.fillStyle = '#ffb703';
    context.font = 'bold 45px Arial';
    context.fillText(labelText, dx + dw / 2 - context.measureText(labelText).width / 2, canvasSize - dy - labelHeight / 2 - 40);
};

watch([brightness, contrast, saturation, hueRotate], () => {
    if (fileList1.value.length > 0 && fileList2.value.length > 0) {
        pimages(fileList1.value[0].file, fileList2.value[0].file);
    }
});

const handleSubmit = async () => {
    if (!submitForm.value.exhort) {
        ElMessage({ message: '请填写康复建议', type: 'error' })
        return
    }

    if (combinedImage.value) {
        submitForm.value.comparison_image = combinedImage.value
    } else {
        submitForm.value.comparison_image = ''
    }

    if (!submitForm.value.worker_id || !submitForm.value.services_id || !submitForm.value.card_number || !submitForm.value.date) {
        ElMessage({ message: '提交数据缺少完整的参数', type: 'error' })
        return
    }

    try {
        const res = await axios.post('/services/add_archive', submitForm.value)
        if (res.status) {
            ElMessage.success(`${res.info}`)
            fileList1.value = [];
            fileList2.value = [];
            combinedImage.value = null;
            submitForm.value = {
                worker_id: appointment.value.services_worker_id,
                services_id: appointment.value.id,
                card_number: appointment.value.card_number,
                date: appointment.value.date,
                exhort: '',
                remarks: '',
                comparison_image: ''
            }
            router.go(-1)
        }
    } catch (error) {
        console.error('Error fetching add_archive:', error);
    }
};
</script>

<style scoped>
.record-form {
    height: auto;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 80px;
}
</style>

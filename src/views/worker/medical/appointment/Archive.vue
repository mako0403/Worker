<template>
    <div class="w-full h-full relative">
        <HeaderSimple content="治疗记录归档" />
        <div class="record-form">
            <div class="mt-0 flex gap-3">
                <el-input v-model="submitForm.refer_1" style="max-width: 600px" placeholder="CM">
                    <template #prepend>腰围</template>
                </el-input>
            </div>
            <div class="mt-3 flex gap-3">
                <el-input v-model="submitForm.refer_2" style="max-width: 600px" placeholder="CM">
                    <template #prepend>臀围</template>
                </el-input>
                <el-input v-model="submitForm.refer_3" style="max-width: 600px" placeholder="CM">
                    <template #prepend>髂嵴间宽</template>
                </el-input>

            </div>
            <div class="mt-3 flex align-items-center">
                <div class="text-sm text-500 bg-gray-100 border-1 border-gray-300 border-right-none px-3 border-round-left-sm"
                    style="padding-top:9px; padding-bottom:9px;">腹直肌分离宽度</div>
                <el-select size="large" v-model="submitForm.refer_4" placeholder="请选择最新测量值" class="flex-1">
                    <el-option key="" label="请选择" value="" />
                    <el-option key="0" label="正常(<1指)" value="4:0" />
                    <el-option key="1" label="轻度(1-2指)" value="4:1" />
                    <el-option key="2" label="中度(2-3指)" value="4:2" />
                    <el-option key="3" label="重度(≥3指)" value="4:3" />
                </el-select>
            </div>
            <div class="mt-3 flex align-items-center">
                <div class="text-sm text-500 bg-gray-100 border-1 border-gray-300 border-right-none px-3 border-round-left-sm"
                    style="padding-top:9px; padding-bottom:9px;">漏尿</div>
                <el-select size="large" v-model="submitForm.refer_5" placeholder="请选择最新问询值" class="flex-1">
                    <el-option key="" label="请选择" value="" />
                    <el-option key="0" label="无漏尿" value="5:0" />
                    <el-option key="1" label="偶尔(剧烈运动/咳嗽打喷嚏时)" value="5:1" />
                    <el-option key="2" label="轻度(小量、频率较高)" value="5:2" />
                    <el-option key="3" label="中度(中量、需护垫)" value="5:3" />
                    <el-option key="4" label="重度(大量、频繁需护理用品)" value="5:4" />
                </el-select>
            </div>
            <div class="mt-3 flex align-items-center">
                <div class="text-sm text-500 bg-gray-100 border-1 border-gray-300 border-right-none px-3 border-round-left-sm"
                    style="padding-top:9px; padding-bottom:9px;">妊辰纹</div>
                <el-select size="large" v-model="submitForm.refer_6" placeholder="请选择最新观察值" class="flex-1">
                    <el-option key="" label="请选择" value="" />
                    <el-option key="0" label="无明显妊娠纹" value="5:0" />
                    <el-option key="1" label="颜色较浅，数量少" value="5:1" />
                    <el-option key="2" label="颜色明显，数量中等" value="5:2" />
                    <el-option key="3" label="范围较大、颜色深" value="5:3" />
                    <el-option key="4" label="伴随皮肤松弛或萎缩" value="5:4" />
                </el-select>
            </div>
            <div class="mt-3 flex align-items-center">
                <div class="text-sm text-500 bg-gray-100 border-1 border-gray-300 border-right-none px-3 border-round-left-sm"
                    style="padding-top:9px; padding-bottom:9px;">耻骨联合间隙</div>
                <el-select size="large" v-model="submitForm.refer_7" placeholder="请选择最新测量值" class="flex-1">
                    <el-option key="" label="请选择" value="" />
                    <el-option key="0" label="正常(<0.5cm)" value="4:0" />
                    <el-option key="1" label="轻度分离(0.5–1cm)" value="4:1" />
                    <el-option key="2" label="中度分离(1–2cm)" value="4:2" />
                    <el-option key="3" label="重度分离(≥2cm)" value="4:3" />
                </el-select>
            </div>
            <div class="mt-3 flex align-items-center">
                <div class="text-sm text-500 bg-gray-100 border-1 border-gray-300 border-right-none px-3 border-round-left-sm"
                    style="padding-top:9px; padding-bottom:9px;">肌力值</div>
                <el-select size="large" v-model="submitForm.refer_8" placeholder="请选择最新测量值" class="flex-1">
                    <el-option key="" label="请选择" value="" />
                    <el-option key="0" label="前静息阶段" value="5:0" />
                    <el-option key="1" label="快肌（Ⅱ类纤维）阶段" value="5:1" />
                    <el-option key="2" label="慢肌（Ⅰ类纤维）阶段" value="5:2" />
                    <el-option key="3" label="耐力测试阶段" value="5:3" />
                    <el-option key="4" label="后静息阶段" value="5:4" />
                </el-select>
            </div>
            <div class="mt-3">
                <div class="mb-2 flex justify-content-between align-items-center">
                    <div class="text-md">治疗效果</div>
                    <div class="text-xs text-red-200">患者可见，可分享</div>
                </div>
                <el-input v-model="submitForm.result" :rows="3" type="textarea" class="w-full"
                    placeholder="请简短描述治疗效果..." />
            </div>
            <div class="mt-3">
                <div class="mb-2 flex justify-content-between align-items-center">
                    <div class="text-md">康复建议</div>
                    <div class="text-xs text-red-200">患者可见</div>
                </div>
                <el-input v-model="submitForm.exhort" :rows="3" type="textarea" class="w-full"
                    placeholder="请输入康复建议..." />
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
    refer_1: '',
    refer_2: '',
    refer_3: '',
    refer_4: '',
    refer_5: '',
    refer_6: '',
    refer_7: '',
    refer_8: '',
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
        const [loadedImg1, loadedImg2] = await Promise.all([
            loadImage(img1, file1),
            loadImage(img2, file2),
        ]);

        const padding = 20; // 外边距
        const imageSpacing = 20; // 两图之间的间距
        const borderWidth = 1;
        const labelHeight = 0;

        // ✅ 以较短的一边为参考，等比例缩放
        const targetHeight = 1000; // 两张图显示高度（像素）
        const scale1 = targetHeight / loadedImg1.height;
        const scale2 = targetHeight / loadedImg2.height;

        const displayWidth1 = loadedImg1.width * scale1;
        const displayWidth2 = loadedImg2.width * scale2;

        // 计算画布宽高
        const canvasWidth =
            padding * 2 +
            borderWidth * 4 +
            displayWidth1 +
            displayWidth2 +
            imageSpacing;
        const canvasHeight = padding * 2 + borderWidth * 2 + targetHeight;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // 应用滤镜参数（如果有）
        context.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hueRotate.value}deg)`;

        // 左右绘制两张图
        const dx1 = padding + borderWidth;
        const dy = padding + borderWidth;
        const dx2 = dx1 + displayWidth1 + imageSpacing + borderWidth * 2;

        drawRoundedImage(context, loadedImg1, 0, dx1, dy, displayWidth1, targetHeight, borderWidth, labelHeight, '');
        drawRoundedImage(context, loadedImg2, 0, dx2, dy, displayWidth2, targetHeight, borderWidth, labelHeight, '');

        combinedImage.value = canvas.toDataURL('image/png');
    } catch (error) {
        console.error(error);
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
    // if (!submitForm.value.exhort) {
    //     ElMessage({ message: '请填写康复建议', type: 'error' })
    //     return
    // }

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
                comparison_image: '',
                refer_1: '',
                refer_2: '',
                refer_3: '',
                refer_4: '',
                refer_5: '',
                refer_6: '',
                refer_7: '',
                refer_8: '',
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

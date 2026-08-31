<template>
    <div class="breast-health-record-page bg-white">
        <div class="page-content">
            <div class="h-full bg-gray-50" style="overflow-y: auto;">
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" class="h-full">
                    <div v-if="listData.length > 0" class="van-clearfix">
                        <div v-for="group in groupedAndSortedData" :key="group.date" class="record-item-container pb-5">
                            <div class="text-sm text-yellow-700 text-left mb-1 flex justify-content-between align-items-center bg-yellow-50 px-3 py-3">
                                <div class="flex align-items-top gap-1"><el-icon class="text-yellow-700"><Calendar /></el-icon>{{ group.date }} </div>
                                <div class="text-yellow-400 text-xs">共 {{ group.items.length }} 条记录</div>
                            </div>
                            <div v-for="item in group.items" :key="item.id" class="record-item m-3">
                                <div class="flex align-items-center gap-2">
                                    <div class="text-xs text-500">{{ item.record_time.substring(10, 16) }}</div>
                                    <div class="flex-1"><van-divider /></div>
                                </div>
                                <div class="ml-5">
                                    <div class="border-0 shadow-1 p-3 border-round-lg relative overflow-hidden" 
                                         :class="{ 
                                            'bg-blue-50 border-blue-100': item.details['记录类型'] === '胀痛/硬块', 
                                            'bg-green-50 border-green-100': item.details['记录类型'] === '乳头状况', 
                                            'bg-purple-50 border-purple-100': item.details['记录类型'] === '乳汁分泌' 
                                         }">
                                        <div class="bg-red-100 h-6rem w-4rem absolute border-circle rotate-45" style="left: -25px; top: -15px;">
                                            </div>
                                        <div class="sticky " style="z-index: 1;">
                                            <div class="flex gap-3">
                                                <img v-if="item.details['记录类型'] === '胀痛/硬块'" src="@@/icon/book.png" width="30px" height="30px" />
                                                <img v-else-if="item.details['记录类型'] === '乳头状况'" src="@@/icon/book.png" width="30px" height="30px" />
                                                <img v-else-if="item.details['记录类型'] === '乳汁分泌'" src="@@/icon/book.png" width="30px" height="30px" />
                                                <img v-else src="@@/icon/book.png" width="30px" height="30px" /> <div>
                                                    <div class="text-lg font-bold">{{ item.details['记录类型'] || '未知记录' }}</div>
                                                    <div class="flex flex-column gap-1 mt-2">
                                                        <template v-if="item.details['记录类型'] === '胀痛/硬块'">
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否胀痛:</span> <span class="text-900 text-base">{{ item.details['是否胀痛'] || '未记录' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有硬块:</span> <span class="text-900 text-base">{{ item.details['是否有硬块'] || '未记录' }}</span>
                                                            </div>
                                                            <div v-if="item.details['是否有硬块'] !== '无硬块'" class="text-xs text-600">
                                                                <span class="text-500 mb-1">硬块大小:</span> <span class="text-900 text-base">{{ item.details['硬块大小'] || '未记录' }}</span>
                                                            </div>
                                                            <div v-if="item.details['是否有硬块'] !== '无硬块'" class="text-xs text-600">
                                                                <span class="text-500 mb-1">硬块性质:</span> <span class="text-900 text-base">{{ item.details['硬块性质'] || '未记录' }}</span>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="item.details['记录类型'] === '乳头状况'">
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">乳头疼痛:</span> <span class="text-900 text-base">{{ item.details['乳头疼痛'] || '无' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有皲裂:</span> <span class="text-900 text-base">{{ item.details['是否有皲裂'] || '否' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有破损:</span> <span class="text-900 text-base">{{ item.details['是否有破损'] || '否' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有水泡:</span> <span class="text-900 text-base">{{ item.details['是否有水泡'] || '否' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有小白点:</span> <span class="text-900 text-base">{{ item.details['是否有小白点'] || '否' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有出血:</span> <span class="text-900 text-base">{{ item.details['是否有出血'] || '否' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">是否有瘙痒:</span> <span class="text-900 text-base">{{ item.details['是否有瘙痒'] || '否' }}</span>
                                                            </div>
                                                            <div v-if="item.details['异常观察']" class="text-xs text-600">
                                                                <span class="text-500 mb-1">异常观察:</span> <span class="text-900 text-base">{{ item.details['异常观察'] }}</span>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="item.details['记录类型'] === '乳汁分泌'">
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">乳汁量:</span> <span class="text-900 text-base">{{ item.details['乳汁量'] || '未记录' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">排空感受:</span> <span class="text-900 text-base">{{ item.details['排空感受'] || '未记录' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">漏奶程度:</span> <span class="text-900 text-base">{{ item.details['漏奶程度'] || '无漏奶' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">乳腺症状:</span> <span class="text-900 text-base">{{ item.details['乳腺症状'] || '无症状' }}</span>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <span class="text-500 mb-1">挤奶方式:</span> <span class="text-900 text-base">{{ item.details['挤奶方式'] || '未记录' }}</span>
                                                            </div>
                                                            <div v-if="item.details['乳房感受']" class="text-xs text-600">
                                                                <span class="text-500 mb-1">乳房感受:</span> <span class="text-900 text-base">{{ item.details['乳房感受'] }}</span>
                                                            </div>
                                                        </template>
                                                        
                                                        <div v-if="item.details['主观感受']" class="text-xs text-600">
                                                            <span class="text-500 mb-1">主观感受:</span> <span class="text-900 text-base">{{ item.details['主观感受'] }}</span>
                                                        </div>
                                                        
                                                        <div v-if="item.alert_messages" class="text-xs text-red-600 mt-2">
                                                            <span class="text-red-500 mb-1">注意:</span> <span class="text-red-900 text-base">{{ item.alert_messages }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-empty v-else-if="finished && listData.length === 0" class="mt-8" :image="emptyImage" :image-size="300" :description="'暂无'+rules.name+'，点击右下角按钮添加。'">
                    </el-empty>
                </van-list>
            </div>
            <van-floating-bubble v-if="!showFormPopup" axis="xy" magnetic="x" icon="plus" @click="openFormPopup" class="">
                <img src="@@/icon/pink-ribbon_15371388.png" alt="logo" width="65%" />
            </van-floating-bubble>
        </div>

        <van-popup v-model:show="showFormPopup" position="bottom" :style="{ height: '100%', 'background-color': '#efeffb' }" :close-on-popstate="true">
            <van-nav-bar :title="'添加' + rules.name" left-arrow @click-left="closeFormPopup" style="background-color: #f6f6fe;"/>
            <div class="popup-content">
                <van-notice-bar wrapable color="#1989fa" background="#ecf9ff" left-icon="info-o"
                    :text="rules.description" class="mb-0"/>

                <DynamicForm v-if="inputSchema" :schema="inputSchema" v-model:formData="recordFormData" />
                <div v-else class="text-center my-5">
                    <van-loading type="spinner" size="24px">加载中...</van-loading>
                </div>

                <div class="submit-btn-wrapper-popup" style="background-color: #efeefc;">
                    <van-button type="primary" block round @click="submitRecord" :loading="isSubmitting" class="bg-blue-300 text-white font-bold border-0">
                        提交记录
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useGlobal } from '@/utils/Global';
const { axios, store, router, route } = useGlobal();
import {
    showToast,
    showSuccessToast,
    showFailToast,
    closeToast,
    NoticeBar as vanNoticeBar,
    NavBar as vanNavBar,
    Button as vanButton,
    Loading as vanLoading,
    Popup as vanPopup,
    FloatingBubble as vanFloatingBubble,
    List as vanList,
    CellGroup as vanCellGroup,
    Cell as vanCell,
    Icon as vanIcon,
    Divider as vanDivider
} from 'vant';
import DynamicForm from '@/components/common/DynamicForm.vue';

import type { DynamicFormSchema, DynamicFormField } from '@/components/common/DynamicForm.vue';
// import { ca } from 'element-plus/es/locales.mjs'; // This import seems unnecessary for this context

import emptyImage from '@@/images/17723656_5876273.webp'; // Assuming this is still a valid empty state image

const rulesId = ref(3); // Make sure this rulesId corresponds to the Breast Health Management Record in your backend
const rules = ref({});
const inputSchema = ref<DynamicFormSchema | null>(null);
const recordFormData = ref<Record<string, any>>({});
const isSubmitting = ref(false);

const showFormPopup = ref(false);

const listData = ref([]);
const loading = ref(false);
const finished = ref(false);
const currentPage = ref(0);

const onLoad = async () => {
    loading.value = true;
    currentPage.value++;
    console.log(`Loading page ${currentPage.value}...`);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const { data } = await axios.get('member/get_record_lists', { p: currentPage.value, rule_id: rulesId.value, card_number: store.memberInfo.card_number }, { toast: 0 });
    if(data){
        if (data.lists.length > 0) {
            listData.value.push(...data.lists);
        }
        loading.value = false;

        if (listData.value.length >= data.total) {
            finished.value = true;
        }
    }else{
        loading.value = false;
        finished.value = true;
    }
};

const refreshList = () => {
    console.log('强制刷新列表...');
    listData.value = [];
    finished.value = false;
    currentPage.value = 0;
    loading.value = true;
    onLoad();
};

const openFormPopup = () => {
    recordFormData.value = {}; // Clear form data when opening the popup
    showFormPopup.value = true;
};

const closeFormPopup = () => {
    showFormPopup.value = false;
};

const onClickLeft = () => {
    router.back();
};

const submitRecord = async () => {
    isSubmitting.value = true;
    showToast({ message: '提交中...', forbidClick: true, duration: 0 });

    try {
        const recordRuleId = rulesId.value;
        const card_number = store.memberInfo.card_number;

        const allFieldsMap: Map<string, DynamicFormField> = new Map();
        if (inputSchema.value) {
            inputSchema.value.sections.forEach(section => {
                section.fields.forEach(field => {
                    allFieldsMap.set(field.name, field);
                });
            });
        }

        const detailsPayload: Record<string, any> = {};
        const alertMessages: string[] = [];

        // Only include fields that are currently visible and have values
        for (const fieldName in recordFormData.value) {
            const fieldDef = allFieldsMap.get(fieldName);
            if (fieldDef && shouldShowFieldGlobal(fieldDef)) {
                if (recordFormData.value[fieldName] !== undefined && recordFormData.value[fieldName] !== '') {
                    detailsPayload[fieldName] = recordFormData.value[fieldName];
                }
            }
        }
        
        // Collect warning messages
        for (const fieldName in detailsPayload) {
            const fieldDef = allFieldsMap.get(fieldName);
            if (fieldDef && fieldDef.options) {
                const selectedOption = fieldDef.options.find(opt => opt.value === detailsPayload[fieldName]);
                if (selectedOption && selectedOption.warning === 1) {
                    alertMessages.push(`${fieldDef.name}:${selectedOption.value}`);
                }
            }
        }
        const finalAlertMessages = alertMessages.length > 0 ? alertMessages.join(',') : null;

        const payload = {
            rule_id: recordRuleId,
            card_number: card_number,
            record_time: recordFormData.value['记录时间'], // Use '记录时间' from the breast health schema
            details: detailsPayload,
            alert_messages: finalAlertMessages,
            remark: recordFormData.value['主观感受'] || recordFormData.value['异常观察'] || null, // Capture subjective/abnormal observation as remark
        };

        //console.log('提交的数据:', JSON.stringify(payload, null, 2));
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request delay

        try {
            const res = await axios.post('member/add_record_details', payload, { toast: 0 });
            closeToast();
            if (res.status) {
                showSuccessToast(res.info);
                resetForm();
                closeFormPopup();
                refreshList();
            } else {
                showFailToast(res.info || '提交失败');
            }
        } catch (err: any) {
            console.error('API 调用失败:', err);
            closeToast();
            showFailToast(err.message || '提交失败，请重试！');
        }

    } catch (error) {
        console.error('提交逻辑异常:', error);
        closeToast();
        showFailToast('提交过程中发生错误！');
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    recordFormData.value = {};
};

const shouldShowFieldGlobal = (field: DynamicFormField): boolean => {
    if (!field.dependsOn) {
        return true;
    }
    const parentFieldName = field.dependsOn.field;
    const expectedValue = field.dependsOn.value;
    const operator = field.dependsOn.operator || 'eq';
    const parentFieldValue = recordFormData.value[parentFieldName];

    switch (operator) {
        case 'eq': return parentFieldValue === expectedValue;
        case 'neq': return parentFieldValue !== expectedValue;
        case 'in': return Array.isArray(expectedValue) && expectedValue.includes(parentFieldValue);
        case 'nin': return Array.isArray(expectedValue) && !expectedValue.includes(parentFieldValue);
        default: return true;
    }
};

onMounted(async () => {
    try {
        showToast({ message: '加载表单配置...', forbidClick: true, duration: 0 });
        const { data } = await axios.get('member/get_record_rules', { id: rulesId.value }, { toast: 0 });
        await new Promise(resolve => setTimeout(resolve, 500));
        closeToast();
        if (data.id) {
            rules.value = data;
            inputSchema.value = data.input_schema;
            refreshList(); // Initial load of the list
        } else {
            showFailToast('加载表单配置失败');
        }
    } catch (error) {
        console.error('加载表单配置错误:', error);
        closeToast();
        showFailToast('加载表单配置失败');
    }
});

// Computed property: Group and sort listData
const groupedAndSortedData = computed(() => {
    const tempGroups = {};

    // 1. Iterate over all raw data, group them
    listData.value.forEach(item => {
        // Ensure item.record_time exists and is a string
        if (item.record_time && typeof item.record_time === 'string' && item.record_time.length >= 10) {
            const datePart = item.record_time.substring(0, 10); // Extract 'YYYY-MM-DD' part

            if (!tempGroups[datePart]) {
                tempGroups[datePart] = [];
            }
            tempGroups[datePart].push(item);
        } else {
            console.warn('Skipping item due to invalid record_time:', item);
        }
    });

    // 2. Convert object to array, and sort dates in descending order
    const finalGroupedArray = [];
    for (const dateKey in tempGroups) {
        if (Object.hasOwnProperty.call(tempGroups, dateKey)) {
            finalGroupedArray.push({
                date: dateKey,
                items: tempGroups[dateKey]
            });
        }
    }

    // 3. Sort by date in descending order
    finalGroupedArray.sort((a, b) => b.date.localeCompare(a.date));

    return finalGroupedArray;
});
</script>

<style scoped>
.breast-health-record-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    padding-bottom: 0px;
    position: relative;
}

.van-notice-bar {
    margin-bottom: 10px;
}

.record-list-container {
    flex: 1;
    overflow-y: auto;
    margin: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    padding: 1px 0;
}

.no-records-tip {
    font-size: 14px;
    color: var(--van-gray-6);
    text-align: center;
    padding: 20px 0;
}

.popup-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}

.submit-btn-wrapper-popup {
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #eee;
    margin-top: auto;
}
</style>
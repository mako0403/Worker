<template>
    <div class="baby-record-page bg-white">
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
                                         :class="getCardClass(item.details.记录类型)">
                                        <div class="bg-red-100 h-6rem w-4rem absolute border-circle rotate-45" style="left: -25px; top: -15px;">
                                            </div>
                                        <div class="sticky " style="z-index: 1;">
                                            <div class="flex gap-3">
                                                <img v-if="item.details.记录类型 === '睡眠记录'" src="@@/icon/book.png" width="30px" height="30px"/>
                                                <img v-else-if="item.details.记录类型 === '排泄记录'" src="@@/icon/book.png" width="30px" height="30px"/>
                                                <img v-else-if="item.details.记录类型 === '发育记录'" src="@@/icon/book.png" width="30px" height="30px"/>
                                                <img v-else-if="item.details.记录类型 === '用药记录'" src="@@/icon/book.png" width="30px" height="30px"/>
                                                <img v-else src="@@/icon/baby-head-with-a-small-heart-outline_30048.png" width="30px" height="30px"/> <div>
                                                    <div class="text-lg font-bold">{{ item.details.记录类型 }}</div>
                                                    <div class="flex gap-3 mt-2 flex-wrap">
                                                        <template v-if="item.details.记录类型 === '睡眠记录'">
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">睡眠时长</div>
                                                                <div class="text-900 text-lg">{{ item.details.睡眠时长 || 0 }}<span class="text-xs">小时</span></div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">睡眠质量</div>
                                                                <div class="text-900 text-base">{{ item.details.睡眠质量 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">醒后状态</div>
                                                                <div class="text-900 text-base">{{ item.details.醒后状态 || '未记录' }}</div>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="item.details.记录类型 === '排泄记录'">
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">大便颜色</div>
                                                                <div class="text-900 text-base">{{ item.details.大便颜色 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">大便性状</div>
                                                                <div class="text-900 text-base">{{ item.details.大便性状 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">大便气味</div>
                                                                <div class="text-900 text-base">{{ item.details.大便气味 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">小便颜色</div>
                                                                <div class="text-900 text-base">{{ item.details.小便颜色 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">小便气味</div>
                                                                <div class="text-900 text-base">{{ item.details.小便气味 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">小便尿量</div>
                                                                <div class="text-900 text-base">{{ item.details.小便尿量 || '未记录' }}</div>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="item.details.记录类型 === '发育记录'">
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">体重</div>
                                                                <div class="text-900 text-lg">{{ item.details.体重 || 0 }}<span class="text-xs">KG</span></div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">身高/身长</div>
                                                                <div class="text-900 text-lg">{{ item.details['身高/身长'] || 0 }}<span class="text-xs">CM</span></div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">头围</div>
                                                                <div class="text-900 text-lg">{{ item.details.头围 || 0 }}<span class="text-xs">CM</span></div>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="item.details.记录类型 === '用药记录'">
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">药品名称</div>
                                                                <div class="text-900 text-base">{{ item.details.药品名称 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">用药计量</div>
                                                                <div class="text-900 text-base">{{ item.details.用药计量 || '未记录' }}</div>
                                                            </div>
                                                            <div class="text-xs text-600">
                                                                <div class="text-500 mb-1">当日状况</div>
                                                                <div class="text-900 text-base">{{ item.details.当日状况 || '未记录' }}</div>
                                                            </div>
                                                        </template>
                                                        <div v-if="item.remark" class="text-xs text-600 w-full mt-2">
                                                            <div class="text-500 mb-1">备注</div>
                                                            <div class="text-900 text-base">{{ item.remark }}</div>
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
            <van-floating-bubble v-if="!showFormPopup" axis="xy" magnetic="x" icon="plus" @click="openFormPopup">
                <img src="@@/icon/baby-head-with-a-small-heart-outline_30048.png" alt="logo" width="65%" />
            </van-floating-bubble>
        </div>

        <van-popup v-model:show="showFormPopup" position="bottom" :style="{ height: '100%', 'background-color': '#efeffb' }" :close-on-popstate="true">
            <van-nav-bar :title="'添加' + rules.name" left-arrow @click-left="closeFormPopup" style="background-color: #f6f6fe;"/>
            <div class="popup-content">
                <van-notice-bar wrapable color="#1989fa" background="#ecf9ff" left-icon="info-o"
                    :text="rules.description" />

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

import emptyImage from '@@/images/13693512_1908.i301.037..Baby feeding isometric landing page.webp' // 确保你的图片路径正确

// 请根据你的实际情况修改这个 rulesId。如果你的育婴记录在数据库中对应 ID 为 1，则改为 1
const rulesId = ref(2); // 修改这里，根据新的数据结构设置正确的规则 ID
const rules = ref({});
const inputSchema = ref<DynamicFormSchema | null>(null);
const recordFormData = ref<Record<string, any>>({});
const isSubmitting = ref(false);

const showFormPopup = ref(false);

const listData = ref<any[]>([]); // 明确类型，方便后续操作
const loading = ref(false);
const finished = ref(false);

const currentPage = ref(0);

const onLoad = async () => {
    loading.value = true;
    console.log(`Loading page ${currentPage.value}...`);
    currentPage.value++;
    console.log(`Loading page ${currentPage.value}...`);

    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

    try {
        const { data } = await axios.get('member/get_record_lists', { p: currentPage.value, rule_id: rulesId.value, card_number: store.memberInfo.card_number }, { toast: 0 });
        if (data && data.lists) {
            if (data.lists.length > 0) {
                listData.value.push(...data.lists);
            }
            loading.value = false;

            if (listData.value.length >= data.total) {
                finished.value = true;
            }
        } else {
            loading.value = false;
            finished.value = true;
            console.warn('获取记录列表数据失败或无数据');
        }
    } catch (error) {
        console.error('获取记录列表错误:', error);
        loading.value = false;
        finished.value = true; // 发生错误也停止加载
        showFailToast('加载记录失败');
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
    recordFormData.value = {}; // 打开弹窗前清空表单数据
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

        for (const fieldName in recordFormData.value) {
            const fieldDef = allFieldsMap.get(fieldName);
            // 只有当字段应该显示且有值时才添加到 detailsPayload
            if (fieldDef && shouldShowFieldGlobal(fieldDef)) {
                if (recordFormData.value[fieldName] !== undefined && recordFormData.value[fieldName] !== '') {
                    detailsPayload[fieldName] = recordFormData.value[fieldName];
                }
            }
        }

        // 检查警告信息
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
            record_time: recordFormData.value['记录时间'], // 直接从 formData 中获取“记录时间”
            details: detailsPayload,
            alert_messages: finalAlertMessages,
            remark: recordFormData.value['备注'] || null, // 备注字段
        };

        console.log('提交的数据:', JSON.stringify(payload, null, 2));

        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500));

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
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
        closeToast();
        if (data && data.id) { // 检查 data 是否存在且有 id 属性
            rules.value = data;
            inputSchema.value = data.input_schema;
            refreshList(); // 页面加载时初始化列表
        } else {
            showFailToast('加载表单配置失败');
        }
    } catch (error) {
        console.error('加载表单配置错误:', error);
        closeToast();
        showFailToast('加载表单配置失败');
    }
});


// 计算属性：对 listData 进行分组和排序
const groupedAndSortedData = computed(() => {
    const tempGroups: { [key: string]: any[] } = {}; // 明确类型

    // 1. 遍历所有原始数据，进行分组
    listData.value.forEach(item => {
        if (item.record_time && typeof item.record_time === 'string' && item.record_time.length >= 10) {
            const datePart = item.record_time.substring(0, 10); // 提取 'YYYY-MM-DD' 部分

            if (!tempGroups[datePart]) {
                tempGroups[datePart] = [];
            }
            tempGroups[datePart].push(item);
        } else {
            console.warn('Skipping item due to invalid record_time:', item);
        }
    });

    // 2. 将对象转换为数组，并对日期进行倒序排序
    const finalGroupedArray = [];
    for (const dateKey in tempGroups) {
        if (Object.hasOwnProperty.call(tempGroups, dateKey)) {
            finalGroupedArray.push({
                date: dateKey,
                items: tempGroups[dateKey]
            });
        }
    }

    // 3. 根据日期进行倒序排序
    finalGroupedArray.sort((a, b) => b.date.localeCompare(a.date));

    return finalGroupedArray;
});

// 根据记录类型返回不同的卡片背景类名
const getCardClass = (recordType: string) => {
    switch (recordType) {
        case '睡眠记录':
            return 'bg-blue-50 border-blue-100';
        case '排泄记录':
            return 'bg-green-50 border-green-100';
        case '发育记录':
            return 'bg-yellow-50 border-yellow-100';
        case '用药记录':
            return 'bg-red-50 border-red-100';
        default:
            return 'bg-gray-50 border-gray-100';
    }
};

</script>

<style scoped>
.baby-record-page { /* 页面名称从 breastfeeding-record-page 改为 baby-record-page */
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
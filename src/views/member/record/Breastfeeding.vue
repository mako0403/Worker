<template>
    <div class="breastfeeding-record-page bg-white">
        <!-- <van-nav-bar :title="rules.name" left-arrow @click-left="onClickLeft" class="" /> -->
        <div class="page-content">
            <div class="h-full bg-gray-50" style="overflow-y: auto;">
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" class="h-full">
                    <div v-if="listData.length > 0" class="van-clearfix">
                        <div v-for="group in groupedAndSortedData" :key="group.date" class="record-item-container pb-5">
                            <div class="text-sm text-800 text-left mb-1 flex justify-content-between align-items-center bg-gray-100 px-3 py-3">
                                <div class="flex align-items-top gap-1"><el-icon class="text-800"><Calendar /></el-icon>{{ group.date }} </div>
                                <div class="text-400 text-xs">共 {{ group.items.length }} 条记录</div>
                            </div>
                            <div v-for="item in group.items" :key="item.id" class="record-item m-3">
                                <div class="flex align-items-start gap-3">
                                    <div class="text-xs text-500 mt-2">{{ item.record_time.substring(10, 16) }}</div>
                                    <div class="flex-1">
                                        <div class="border-0 shadow-1 p-3 border-round-lg relative overflow-hidden bg-white">
                                            <div class="bg-red-100 h-6rem w-4rem absolute border-circle rotate-45" style="right: -25px; bottom: -15px;">
                                                <!-- <img src="@@/svg/WaveBackground.svg" width="100%" /> -->
                                            </div>
                                            <div class="sticky " style="z-index: 1;">
                                                <div class="flex gap-3">
                                                    <img v-if="item.details.喂养方式 === '亲喂'"  src="@@/icon/weinai.png" width="30px" height="30px" style="transform: rotate(0deg);"/>
                                                    <img v-if="item.details.喂养方式 !== '亲喂'"  src="@@/icon/naiping.png" width="30px" height="30px" style="transform: rotate(45deg);"/>
                                                    <div>
                                                        <div class="text-sm font-bold">{{ item.details.喂养方式 }}</div>
                                                        <div v-if="('亲喂,吸奶').split(',').includes(item.details.喂养方式)">
                                                            <div class="flex gap-3 mt-1">
                                                                <div v-if="item.details.喂养方式 === '亲喂' || item.details.喂养方式 === '吸奶'" class="text-xs text-600 mt-2">
                                                                    <div class="text-500 mb-1">右乳</div>
                                                                    <div class="text-900 text-lg">{{ Number(item.details.右乳时长) }}<span class="text-xs">分钟</span></div>
                                                                </div>
                                                                <div v-if="item.details.喂养方式 === '亲喂' || item.details.喂养方式 === '吸奶'" class="text-xs text-600 mt-2">
                                                                    <div class="text-500 mb-1">左乳</div>
                                                                    <div class="text-900 text-lg">{{ Number(item.details.左乳时长) }}<span class="text-xs">分钟</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="flex gap-3 mt-1">    
                                                                <div v-if="item.details.喂养方式 === '亲喂'" class="text-xs text-600 mt-2">
                                                                    <div class="text-500 mb-1">总时长</div>
                                                                    <div class="text-900 text-lg">{{ Number(item.details.右乳时长) + Number(item.details.左乳时长) }}<span class="text-xs">分钟</span></div>
                                                                </div>
                                                                <div v-if="item.details.喂养方式 === '亲喂'" class="text-xs text-600 mt-2">
                                                                    <div class="text-500 mb-1">吸允</div>
                                                                    <div class="text-900 text-base">{{ item.details.吸吮质量 }}<span class="text-xs"></span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex gap-3 mt-1">
                                                            <div v-if="item.details.喂养方式 === '瓶喂' || item.details.喂养方式 === '奶粉'" class="text-xs text-600 mt-2">
                                                                <div class="text-500 mb-1">进食量</div>
                                                                <div class="text-900 text-lg">{{ item.details.进食量 || 0 }}<span class="text-xs">ml</span></div>
                                                            </div>
                                                            <div v-if="item.details.喂养方式 === '辅食'" class="text-xs text-600 mt-2">
                                                                <div class="text-500 mb-1">辅食名称</div>
                                                                <div class="text-900 text-lg">{{ item.details.辅食名称 }}<span class="text-xs"></span></div>
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
                    </div>
                    <el-empty v-else-if="finished && listData.length === 0" class="mt-8" :image="emptyImage" :image-size="300" :description="'暂无'+rules.name+'，点击右下角按钮添加。'">

                    </el-empty>
                </van-list>
            </div>
            <van-floating-bubble v-if="!showFormPopup" axis="xy" magnetic="x" icon="plus" @click="openFormPopup" class="">
                <img src="@@/icon/breastfeeding.png" alt="logo" width="65%" />
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
    FloatingBubble as vanFloatingBubble, // <-- 新增：引入 FloatingBubble 组件
    List as vanList,
    CellGroup as vanCellGroup,
    Cell as vanCell,
    Icon as vanIcon,
    Divider as vanDivider
} from 'vant';
import DynamicForm from '@/components/common/DynamicForm.vue';

import type { DynamicFormSchema, DynamicFormField } from '@/components/common/DynamicForm.vue';
import { ca } from 'element-plus/es/locales.mjs';

import emptyImage from '@@/images/10579507_8944.webp'

const rulesId = ref(1);
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

    await new Promise(resolve => setTimeout(resolve, 1000));

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
    recordFormData.value = {};
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
            if (fieldDef && shouldShowFieldGlobal(fieldDef)) {
                if (recordFormData.value[fieldName] !== undefined && recordFormData.value[fieldName] !== '') {
                    detailsPayload[fieldName] = recordFormData.value[fieldName];
                }
            }
        }

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
            record_time: recordFormData.value['记录时间'],
            details: detailsPayload,
            alert_messages: finalAlertMessages,
            remark: recordFormData.value['备注'] || null,
        };

        //console.log('提交的数据:', JSON.stringify(payload, null, 2));
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
        await new Promise(resolve => setTimeout(resolve, 500));
        closeToast();
        if (data.id) {
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
    const tempGroups = {};

    // 1. 遍历所有原始数据，进行分组
    listData.value.forEach(item => {
        // 确保 item.timestamp 存在且是字符串
        if (item.record_time && typeof item.record_time === 'string' && item.record_time.length >= 10) {
            const datePart = item.record_time.substring(0, 10); // 提取 'YYYY-MM-DD' 部分

            if (!tempGroups[datePart]) {
                tempGroups[datePart] = [];
            }
            tempGroups[datePart].push(item);
        } else {
            console.warn('Skipping item due to invalid timestamp:', item);
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
</script>

<style scoped>
.breastfeeding-record-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.page-content {
    flex: 1;
    display: flex;
    /* 让内容区域也变成 flex 容器 */
    flex-direction: column;
    overflow-y: hidden;
    /* 防止 page-content 出现滚动条，让 record-list-container 内部滚动 */
    padding-bottom: 0px;
    position: relative;
    /* 用于定位浮动气泡，虽然 FloatingBubble 默认是 fixed 定位 */
}

.van-notice-bar {
    margin-bottom: 10px;
}

/* 列表容器样式 */
.record-list-container {
    flex: 1;
    /* 让列表占据剩余空间 */
    overflow-y: auto;
    /* 列表自身滚动 */
    margin: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    padding: 1px 0;
    /* 防止 van-cell-group inset 导致边缘间距 */
}

.no-records-tip {
    font-size: 14px;
    color: var(--van-gray-6);
    text-align: center;
    padding: 20px 0;
}

/* van-floating-bubble 不需要额外的定位 CSS，它默认就是 fixed 定位 */
/* 如果你想微调它的位置，可以使用它的 offset-x 和 offset-y 属性 */


/* 弹窗内部的样式 */
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
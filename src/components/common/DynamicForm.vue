<template>
    <div class="mt-5">
        <template v-for="section in schema.sections" :key="section.id">
            <div v-if="shouldShowSection(section)">
                <div class="mx-3 mb-2 mt-1 text-sm text-dblue-500 flex gap-1 align-items-center pl-1">
                    <el-icon class=""><CaretRight /></el-icon>
                    {{ section.title }}
                </div>

                <div class="m-3 p-3 pb-1 border-round-lg shadow-1 block-bg">
                    <div v-if="section.description" class="text-xs text-dblue-200 mb-3">
                        {{ section.description }}
                    </div>
                    <template v-for="field in section.fields" :key="field.name">
                        <template v-if="shouldShowField(field)">
                            <van-field
                                v-if="['text', 'number', 'textarea', 'date', 'time', 'datetime'].includes(field.type)"
                                :name="field.name" :label="field.name" :type="getFieldInputType(field.type)"
                                v-model="internalFormData[field.name]"
                                :placeholder="field.placeholder || getPlaceholder(field)"
                                :input-align="field.type === 'number' ? 'right' : 'left'"
                                :rows="field.type === 'textarea' ? field.rows || 2 : undefined"
                                :autosize="field.type === 'textarea' ? true : undefined"
                                :maxlength="field.type === 'textarea' ? field.maxlength || 200 : undefined"
                                :show-word-limit="field.type === 'textarea' ? true : undefined"
                                :readonly="['date', 'time', 'datetime'].includes(field.type)"
                                :clickable="['date', 'time', 'datetime'].includes(field.type)"
                                @click="['date', 'time', 'datetime'].includes(field.type) ? showDateTimePicker(field) : null"
                                class="p-0 py-2 mb-3 block-bg">
                                <template #right-icon
                                    v-if="field.unit && !['date', 'time', 'datetime'].includes(field.type)">
                                    {{ field.unit }}
                                </template>
                                <template #right-icon v-if="['date', 'time', 'datetime'].includes(field.type)">
                                    <van-icon name="arrow" />
                                </template>
                            </van-field>

                            <van-field v-else-if="field.type === 'radio'" :name="field.name" :label="field.name"
                                class="p-0 block-bg">
                                <template #input>
                                    <van-radio-group v-model="internalFormData[field.name]" direction="horizontal">
                                        <van-radio v-for="option in field.options" :key="option.value" :name="option.value" class="mb-3">
                                            {{ option.value }}
                                            <van-icon v-if="option.warning === 1" name="warning" color="#ffd965"
                                                style="margin-left: 4px;" />
                                        </van-radio>
                                    </van-radio-group>
                                </template>
                            </van-field>

                            <van-field v-else-if="field.type === 'select'" readonly clickable :name="field.name"
                                v-model="internalFormData[field.name]" :label="field.name"
                                :placeholder="field.placeholder || `请选择${field.name}`"
                                @click="showPicker(field.name, field.options || [])"
                                class="p-0 py-2 mb-3 block-bg">
                                <template #right-icon>
                                    <div class="flex">
                                        <van-icon
                                            v-if="hasWarningOption(field.name, internalFormData[field.name], field.options)"
                                            name="warning" color="#ffd965" style="margin-left: 4px;" />
                                        <van-icon name="arrow" />
                                    </div>
                                </template>
                            </van-field>

                            <van-field v-else-if="field.type === 'slider'" :name="field.name" :label="field.name"
                                input-align="right" class=" block-bg">
                                <template #input>
                                    <div class="slider-wrapper">
                                        <van-slider v-model="internalFormData[field.name]" :min="field.min || 0"
                                            :max="field.max || 100" :step="field.step || 1" :bar-height="4"
                                            active-color="#1989fa" />
                                        <span class="slider-value">{{ internalFormData[field.name] }} {{ field.unit || ''
                                            }}</span>
                                    </div>
                                </template>
                            </van-field>
                        </template>
                    </template>
                </div>
            </div>
        </template>
    </div>

    <van-popup v-model:show="pickerShow" position="bottom">
        <van-picker :columns="pickerColumns" @confirm="onPickerConfirm" @cancel="pickerShow = false"
            :default-index="defaultPickerIndex" show-toolbar />
    </van-popup>

    <van-popup v-model:show="dateTimePickerShow" position="bottom">
        <van-date-picker v-if="currentDateTimePickerField && currentDateTimePickerField.type === 'date'"
            v-model="tempDateTimeValue" title="选择日期"
            :min-date="parseDateValue(currentDateTimePickerField.minDate) || new Date(2000, 0, 1)"
            :max-date="parseDateValue(currentDateTimePickerField.maxDate) || new Date()"
            @confirm="onDateTimePickerConfirm" @cancel="dateTimePickerShow = false" />
        <van-time-picker v-else-if="currentDateTimePickerField && currentDateTimePickerField.type === 'time'"
            v-model="tempDateTimeValue" title="选择时间" :min-hour="currentDateTimePickerField.minHour || 0"
            :max-hour="currentDateTimePickerField.maxHour || 23" :min-minute="currentDateTimePickerField.minMinute || 0"
            :max-minute="currentDateTimePickerField.maxMinute || 59" @confirm="onDateTimePickerConfirm"
            @cancel="dateTimePickerShow = false" />
        <van-picker-group v-else-if="currentDateTimePickerField && currentDateTimePickerField.type === 'datetime'"
            title="选择日期和时间" :tabs="['日期', '时间']" @confirm="onDateTimePickerConfirmGroup"
            @cancel="dateTimePickerShow = false">
            <van-date-picker v-model="tempDateValueForGroup"
                :min-date="parseDateValue(currentDateTimePickerField.minDate) || new Date(2000, 0, 1)"
                :max-date="parseDateValue(currentDateTimePickerField.maxDate) || new Date()" />
            <van-time-picker v-model="tempTimeValueForGroup" :min-hour="currentDateTimePickerField.minHour || 0"
                :max-hour="currentDateTimePickerField.maxHour || 23"
                :min-minute="currentDateTimePickerField.minMinute || 0"
                :max-minute="currentDateTimePickerField.maxMinute || 59" />
        </van-picker-group>
    </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue';
import {
    Field as VanField,
    RadioGroup as VanRadioGroup,
    Radio as VanRadio,
    Popup as VanPopup,
    Picker as VanPicker,
    Icon as VanIcon,
    CellGroup as VanCellGroup,
    Slider as VanSlider,
    // 移除 DatetimePicker as VanDatetimePicker
    DatePicker as VanDatePicker,   // 新增：日期选择器
    TimePicker as VanTimePicker,   // 新增：时间选择器
    PickerGroup as VanPickerGroup, // 新增：用于组合日期和时间选择器
} from 'vant';

// --- 类型定义 (与之前保持一致) ---
interface DynamicFormOption {
    value: string | number;
    warning?: 0 | 1;
}

interface FieldDependsOn {
    field: string;
    value: string | number | boolean | (string | number | boolean)[];
    operator?: 'eq' | 'neq' | 'in' | 'nin';
}

export interface DynamicFormField {
    name: string;
    type: 'text' | 'number' | 'radio' | 'select' | 'textarea' | 'slider' | 'date' | 'time' | 'datetime';
    unit?: string;
    options?: DynamicFormOption[];
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    maxlength?: number;
    minDate?: Date | string; // 修改这里
    maxDate?: Date | string; // 修改这里
    minHour?: number;
    maxHour?: number;
    minMinute?: number;
    maxMinute?: number;
    placeholder?: string;
    dependsOn?: FieldDependsOn;
}

export interface DynamicFormSection {
    id: string;
    title: string;
    description?: string;
    fields: DynamicFormField[];
}

export interface DynamicFormSchema {
    sections: DynamicFormSection[];
}

// --- Props 和 Emit ---
const props = defineProps({
    schema: {
        type: Object as PropType<DynamicFormSchema>,
        required: true,
    },
    formData: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    schemaTitle: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:formData']);

// --- 内部表单数据管理 ---
const internalFormData = ref<Record<string, any>>({});

// 辅助函数：获取字段的默认值 (可以复用)
const getDefaultFieldValue = (field: DynamicFormField) => {
    switch (field.type) {
        case 'number':
        case 'slider':
            return field.min !== undefined ? field.min : 0;
        case 'radio':
        case 'select':
            return field.options && field.options.length > 0 ? field.options[0].value : '';
        case 'date':
        case 'datetime':
            // 获取当前设备的本地时间作为默认值
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        case 'time':
            const timeNow = new Date();
            return `${String(timeNow.getHours()).padStart(2, '0')}:${String(timeNow.getMinutes()).padStart(2, '0')}`;
        case 'text':
        case 'textarea':
        default:
            return '';
    }
};

// 1. 监听 schema 变化来初始化 internalFormData (现有逻辑)
watch(
    () => props.schema,
    (newSchema) => {
        if (newSchema && newSchema.sections) {
            const newFormData: Record<string, any> = {};
            newSchema.sections.forEach(section => {
                section.fields.forEach(field => {
                    // 如果 props.formData 中有值，则使用，否则设置默认值
                    if (props.formData[field.name] !== undefined) {
                        newFormData[field.name] = props.formData[field.name];
                    } else {
                        newFormData[field.name] = getDefaultFieldValue(field);
                    }
                });
            });
            internalFormData.value = newFormData;
        }
    },
    { deep: true, immediate: true } // 立即执行一次，确保初始加载
);




// 2. 监听 internalFormData 变化，并 emit 回父组件 (现有逻辑)
watch(
    internalFormData,
    (newVal) => {
        emit('update:formData', newVal);
        // 重要：当依赖字段值变化时，清除被隐藏字段的值
        if (props.schema && props.schema.sections) {
            props.schema.sections.forEach(section => {
                section.fields.forEach(field => {
                    if (!shouldShowField(field) && internalFormData.value[field.name] !== undefined) {
                        delete internalFormData.value[field.name];
                    }
                });
            });
        }
    },
    { deep: true }
);

// --- 3. 新增：监听 props.formData 的外部变化，以重置内部状态 ---
watch(
    () => props.formData, // 直接监听父组件传进来的 props.formData
    (newFormData) => {
        // 只有当父组件传入的新数据是空对象，且当前内部数据不为空时才进行重置
        // 这样可以避免不必要的重置或无限循环
        if (Object.keys(newFormData).length === 0 && Object.keys(internalFormData.value).length > 0) {
            console.log('DynamicForm: 检测到 props.formData 为空，正在重置 internalFormData。');
            // 根据 schema 重新初始化 internalFormData 的所有字段为默认值
            const resetData: Record<string, any> = {};
            props.schema.sections.forEach(section => {
                section.fields.forEach(field => {
                    resetData[field.name] = getDefaultFieldValue(field);
                });
            });
            internalFormData.value = resetData; // 更新内部数据，触发 UI 渲染
        }
    },
    { deep: true } // 深度监听对象变化
);


// --- 条件渲染逻辑 ---

// 判断单个字段是否应该显示
const shouldShowField = (field: DynamicFormField): boolean => {
    if (!field.dependsOn) {
        return true; // 没有依赖，总是显示
    }

    const parentFieldName = field.dependsOn.field;
    const expectedValue = field.dependsOn.value;
    const operator = field.dependsOn.operator || 'eq'; // 默认为 'eq'

    const parentFieldValue = internalFormData.value[parentFieldName];

    switch (operator) {
        case 'eq':
            return parentFieldValue === expectedValue;
        case 'neq':
            return parentFieldValue !== expectedValue;
        case 'in':
            // expectedValue 必须是数组
            return Array.isArray(expectedValue) && expectedValue.includes(parentFieldValue);
        case 'nin':
            // expectedValue 必须是数组
            return Array.isArray(expectedValue) && !expectedValue.includes(parentFieldValue);
        default:
            return true; // 未知操作符，默认显示
    }
};

// 判断整个 Section 是否应该显示 (至少有一个字段可见)
const shouldShowSection = (section: DynamicFormSection): boolean => {
    return section.fields.some(field => shouldShowField(field));
};

// --- 其他辅助函数 (与之前保持一致) ---
const getPlaceholder = (field: DynamicFormField) => {
    if (field.placeholder) return field.placeholder;
    if (['date', 'time', 'datetime'].includes(field.type)) return `请选择${field.name}`;
    if (['text', 'number', 'textarea'].includes(field.type)) return `请输入${field.name}`;
    return '';
};

const getFieldInputType = (type: DynamicFormField['type']) => {
    if (type === 'number') return 'digit';
    if (type === 'textarea') return 'textarea';
    return 'text';
};

const getOptionLabel = (fieldName: string, value: string | number, options?: DynamicFormOption[]) => {
    if (!options) return '';
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.name : '';
};

const hasWarningOption = (fieldName: string, value: string | number, options?: DynamicFormOption[]) => {
    if (!options) return false;
    const selected = options.find(opt => opt.value === value);
    return selected && selected.warning === 1;
};

// --- 下拉选择器 (Picker) 逻辑 ---
const pickerShow = ref(false);
const currentPickerField = ref('');
const pickerColumns = ref<Array<{ text: string; value: string | number; warning?: 0 | 1 }>>([]);
const defaultPickerIndex = ref(0);

const showPicker = (fieldName: string, options: DynamicFormOption[]) => {
    currentPickerField.value = fieldName;
    pickerColumns.value = options.map(opt => ({ text: opt.value, value: opt.value, warning: opt.warning }));
    const currentValue = internalFormData.value[fieldName];
    const index = options.findIndex(opt => opt.value === currentValue);
    defaultPickerIndex.value = index !== -1 ? index : 0;
    pickerShow.value = true;
};

const onPickerConfirm = ({ selectedValues }: { selectedValues: (string | number)[] }) => {
    if (selectedValues.length > 0) {
        internalFormData.value[currentPickerField.value] = selectedValues[0];
    }
    pickerShow.value = false;
};

// --- 日期/时间/日期时间选择器 (DatePicker, TimePicker, PickerGroup) 逻辑 ---
const dateTimePickerShow = ref(false);
const currentDateTimePickerField = ref<DynamicFormField | null>(null);

// 用于 date 和 time 类型的临时值
const tempDateTimeValue = ref<Date | string>(new Date());

// 用于 datetime 类型 (PickerGroup) 的临时值
const tempDateValueForGroup = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]); // 年月日数组
const tempTimeValueForGroup = ref([String(new Date().getHours()).padStart(2, '0'), String(new Date().getMinutes()).padStart(2, '0')]); // 时分数组


const showDateTimePicker = (field: DynamicFormField) => {
    currentDateTimePickerField.value = field;
    const currentValue = internalFormData.value[field.name];

    // 在绑定到 Vant 组件时，使用 parseDateValue 函数
    // 这将在模板中使用，或者你可以在这里先处理好
    const resolvedMinDate = parseDateValue(currentDateTimePickerField.value.minDate);
    const resolvedMaxDate = parseDateValue(currentDateTimePickerField.value.maxDate);

    if (field.type === 'datetime') {
        // 处理 datetime 类型
        if (currentValue) {
            // 将存储的 'YYYY-MM-DD HH:mm:ss' 字符串解析
            const dateObj = new Date(currentValue);
            tempDateValueForGroup.value = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
            tempTimeValueForGroup.value = [String(dateObj.getHours()).padStart(2, '0'), String(dateObj.getMinutes()).padStart(2, '0')];
        } else {
            // 默认当前日期时间
            const now = new Date();
            tempDateValueForGroup.value = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
            tempTimeValueForGroup.value = [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')];
        }
    } else if (field.type === 'time') {
        // 处理 time 类型
        tempDateTimeValue.value = currentValue || '00:00';
    } else { // field.type === 'date'
        // 处理 date 类型
        tempDateTimeValue.value = currentValue ? new Date(currentValue) : new Date();
    }
    dateTimePickerShow.value = true;
};

// 处理 date 和 time 类型的确认
const onDateTimePickerConfirm = ({ selectedValues }: { selectedValues: (string | number)[] | Date }) => {
    if (!currentDateTimePickerField.value) return;

    let valueToStore: string | Date;

    if (currentDateTimePickerField.value.type === 'time') {
        // TimePicker 返回的是 [hour, minute] 数组
        const hour = String(selectedValues[0]).padStart(2, '0');
        const minute = String(selectedValues[1]).padStart(2, '0');
        valueToStore = `${hour}:${minute}`;
    } else if (currentDateTimePickerField.value.type === 'date') {
        // DatePicker 返回的是 Date 对象 (直接通过 v-model 绑定)
        // 或者如果你用的是 columns 形式，会返回 [year, month, day]
        if (selectedValues instanceof Date) {
            const year = selectedValues.getFullYear();
            const month = String(selectedValues.getMonth() + 1).padStart(2, '0');
            const day = String(selectedValues.getDate()).padStart(2, '0');
            valueToStore = `${year}-${month}-${day}`;
        } else { // 如果返回的是 [year, month, day] 数组
            const year = selectedValues[0];
            const month = String(selectedValues[1]).padStart(2, '0');
            const day = String(selectedValues[2]).padStart(2, '0');
            valueToStore = `${year}-${month}-${day}`;
        }
    } else {
        // 理论上不会走到这里，因为 datetime 类型由 onDateTimePickerConfirmGroup 处理
        valueToStore = '';
    }

    internalFormData.value[currentDateTimePickerField.value.name] = valueToStore;
    dateTimePickerShow.value = false;
};

// 处理 datetime 类型 (PickerGroup) 的确认
const onDateTimePickerConfirmGroup = () => {
    if (!currentDateTimePickerField.value) return;

    // PickerGroup 的 v-model 对应两个独立的 v-model，所以这里直接使用 tempDateValueForGroup 和 tempTimeValueForGroup
    const selectedYear = tempDateValueForGroup.value[0];
    const selectedMonth = tempDateValueForGroup.value[1];
    const selectedDay = tempDateValueForGroup.value[2];

    const selectedHour = tempTimeValueForGroup.value[0];
    const selectedMinute = tempTimeValueForGroup.value[1];

    // 组合成一个完整的 Date 对象，然后格式化为字符串
    const combinedDate = new Date(
        selectedYear as number,
        (selectedMonth as number) - 1, // 月份是从 0 开始的
        selectedDay as number,
        selectedHour as number,
        selectedMinute as number,
        0 // 秒数默认为 0
    );

    const year = combinedDate.getFullYear();
    const month = String(combinedDate.getMonth() + 1).padStart(2, '0');
    const day = String(combinedDate.getDate()).padStart(2, '0');
    const hours = String(combinedDate.getHours()).padStart(2, '0');
    const minutes = String(combinedDate.getMinutes()).padStart(2, '0');
    const seconds = String(combinedDate.getSeconds()).padStart(2, '0'); // 确保秒数也是两位

    const valueToStore = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    internalFormData.value[currentDateTimePickerField.value.name] = valueToStore;
    dateTimePickerShow.value = false;
};

// 辅助函数：将日期字符串（包括 "now" 和 "new Date()"）转换为 Date 对象
const parseDateValue = (dateVal: Date | string | undefined): Date | undefined => {
    if (!dateVal) {
        return undefined;
    }
    if (dateVal instanceof Date) {
        return dateVal; // 已经是 Date 对象
    }
    if (typeof dateVal === 'string') {
        if (dateVal.toLowerCase() === 'new date()' || dateVal.toLowerCase() === 'now') {
            return new Date(); // 返回当前的 Date 对象
        }
        // 尝试解析标准的日期字符串，例如 "2025-06-12"
        const parsed = new Date(dateVal);
        if (!isNaN(parsed.getTime())) { // 检查是否是有效的日期
            return parsed;
        }
    }
    // 如果无法解析，返回 undefined 或者你认为合适的默认值
    console.warn(`无法解析日期值: ${dateVal}`);
    return undefined;
};


</script>

<style scoped>
.form-section {
    margin-bottom: 15px;
    /* 每块之间的间距 */
}

.section-description {
    font-size: 13px;
    color: var(--van-gray-6);
    padding: 0 var(--van-cell-horizontal-padding) 10px;
    line-height: 1.5;
}

/* 其他样式与之前保持一致 */
.dynamic-form-radio-group-field {
    padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
}

.van-radio {
    display: flex;
    align-items: center;
    margin-right: 16px;
}

.slider-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 10px;
}

.van-slider {
    flex: 1;
    margin-right: 10px;
}

.slider-value {
    min-width: 50px;
    text-align: right;
    color: var(--van-gray-7);
}

.block-bg {
    background-color: #f6f6fe;
}
</style>
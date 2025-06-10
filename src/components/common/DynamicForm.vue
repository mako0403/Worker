<template>
    <van-cell-group :title="schemaTitle" inset>
        <template v-for="field in schema.fields" :key="field.name">
            <van-field v-if="['text', 'number', 'textarea', 'date', 'time', 'datetime'].includes(field.type)"
                :name="field.name" :label="field.label" :type="getFieldInputType(field.type)"
                v-model="internalFormData[field.name]" :placeholder="getPlaceholder(field)"
                :input-align="field.type === 'number' ? 'right' : 'left'"
                :rows="field.type === 'textarea' ? field.rows || 2 : undefined"
                :autosize="field.type === 'textarea' ? true : undefined"
                :maxlength="field.type === 'textarea' ? field.maxlength || 200 : undefined"
                :show-word-limit="field.type === 'textarea' ? true : undefined"
                :readonly="['date', 'time', 'datetime'].includes(field.type)"
                :clickable="['date', 'time', 'datetime'].includes(field.type)"
                @click="['date', 'time', 'datetime'].includes(field.type) ? showDateTimePicker(field) : null">
                <template #right-icon v-if="field.unit && !['date', 'time', 'datetime'].includes(field.type)">
                    {{ field.unit }}
                </template>
                <template #right-icon v-if="['date', 'time', 'datetime'].includes(field.type)">
                    <van-icon name="arrow" />
                </template>
            </van-field>

            <van-field v-else-if="field.type === 'radio'" :name="field.name" :label="field.label"
                class="dynamic-form-radio-group-field">
                <template #input>
                    <van-radio-group v-model="internalFormData[field.name]" direction="horizontal">
                        <van-radio v-for="option in field.options" :key="option.value" :name="option.value">
                            {{ option.label }}
                            <van-icon v-if="option.warning === 1" name="warning" color="#ee0a24"
                                style="margin-left: 4px;" />
                        </van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field v-else-if="field.type === 'select'" readonly clickable :name="field.name"
                :value="getOptionLabel(field.name, internalFormData[field.name], field.options)" :label="field.label"
                :placeholder="`请选择${field.label}`" @click="showPicker(field.name, field.options || [])">
                <template #right-icon>
                    <van-icon v-if="hasWarningOption(field.name, internalFormData[field.name], field.options)"
                        name="warning" color="#ee0a24" style="margin-left: 4px;" />
                    <van-icon name="arrow" />
                </template>
            </van-field>

            <van-field v-else-if="field.type === 'slider'" :name="field.name" :label="field.label" input-align="right">
                <template #input>
                    <div class="slider-wrapper">
                        <van-slider v-model="internalFormData[field.name]" :min="field.min || 0" :max="field.max || 100"
                            :step="field.step || 1" :bar-height="4" active-color="#1989fa" />
                        <span class="slider-value">{{ internalFormData[field.name] }} {{ field.unit || '' }}</span>
                    </div>
                </template>
            </van-field>
        </template>
    </van-cell-group>

    <van-popup v-model:show="pickerShow" position="bottom">
        <van-picker :columns="pickerColumns" @confirm="onPickerConfirm" @cancel="pickerShow = false"
            :default-index="defaultPickerIndex" show-toolbar />
    </van-popup>

    <van-popup v-model:show="dateTimePickerShow" position="bottom">
        <van-datetime-picker v-if="currentDateTimePickerField && currentDateTimePickerField.type === 'date'"
            v-model="tempDateTimeValue" type="date" title="选择日期"
            :min-date="currentDateTimePickerField.minDate || new Date(2000, 0, 1)"
            :max-date="currentDateTimePickerField.maxDate || new Date()" @confirm="onDateTimePickerConfirm"
            @cancel="dateTimePickerShow = false" />
        <van-datetime-picker v-else-if="currentDateTimePickerField && currentDateTimePickerField.type === 'time'"
            v-model="tempDateTimeValue" type="time" title="选择时间" :min-hour="currentDateTimePickerField.minHour || 0"
            :max-hour="currentDateTimePickerField.maxHour || 23" :min-minute="currentDateTimePickerField.minMinute || 0"
            :max-minute="currentDateTimePickerField.maxMinute || 59" @confirm="onDateTimePickerConfirm"
            @cancel="dateTimePickerShow = false" />
        <van-datetime-picker v-else-if="currentDateTimePickerField && currentDateTimePickerField.type === 'datetime'"
            v-model="tempDateTimeValue" type="datetime" title="选择日期和时间"
            :min-date="currentDateTimePickerField.minDate || new Date(2000, 0, 1)"
            :max-date="currentDateTimePickerField.maxDate || new Date()" @confirm="onDateTimePickerConfirm"
            @cancel="dateTimePickerShow = false" />
    </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed, PropType } from 'vue';
import {
    Field as VanField,
    RadioGroup as VanRadioGroup,
    Radio as VanRadio,
    Popup as VanPopup,
    Picker as VanPicker,
    Icon as VanIcon,
    CellGroup as VanCellGroup,
    Slider as VanSlider,
    DatetimePicker as VanDatetimePicker,
} from 'vant';

// --- 类型定义 ---
interface DynamicFormOption {
    value: string | number;
    label: string;
    warning?: 0 | 1;
}

interface DynamicFormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'radio' | 'select' | 'textarea' | 'slider' | 'date' | 'time' | 'datetime';
    unit?: string; // 单位
    options?: DynamicFormOption[]; // 针对 radio 或 select 类型
    min?: number; // 针对 number, slider
    max?: number; // 针对 number, slider
    step?: number; // 针对 slider
    rows?: number; // 针对 textarea
    maxlength?: number; // 针对 textarea
    minDate?: Date; // 针对 date, datetime
    maxDate?: Date; // 针对 date, datetime
    minHour?: number; // 针对 time, datetime
    maxHour?: number; // 针对 time, datetime
    minMinute?: number; // 针对 time, datetime
    maxMinute?: number; // 针对 time, datetime
}

interface DynamicFormSchema {
    fields: DynamicFormField[];
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

// 当 schema 变化时，初始化 internalFormData
watch(
    () => props.schema,
    (newSchema) => {
        if (newSchema && newSchema.fields) {
            const newFormData: Record<string, any> = {};
            newSchema.fields.forEach(field => {
                // 尝试从 props.formData 恢复旧值，否则设置默认值
                if (props.formData[field.name] !== undefined) {
                    newFormData[field.name] = props.formData[field.name];
                } else {
                    switch (field.type) {
                        case 'number':
                        case 'slider':
                            newFormData[field.name] = field.min !== undefined ? field.min : 0;
                            break;
                        case 'radio':
                        case 'select':
                            newFormData[field.name] = field.options && field.options.length > 0 ? field.options[0].value : '';
                            break;
                        case 'date':
                        case 'datetime':
                            newFormData[field.name] = new Date(); // 默认当前日期
                            break;
                        case 'time':
                            newFormData[field.name] = '00:00'; // 默认00:00
                            break;
                        case 'text':
                        case 'textarea':
                        default:
                            newFormData[field.name] = '';
                            break;
                    }
                }
            });
            internalFormData.value = newFormData;
        }
    },
    { deep: true, immediate: true } // 深度监听并立即执行
);

// 监听内部数据变化，同步到外部
watch(
    internalFormData,
    (newVal) => {
        emit('update:formData', newVal);
    },
    { deep: true }
);

// --- 辅助函数 ---
const getPlaceholder = (field: DynamicFormField) => {
    if (['date', 'time', 'datetime'].includes(field.type)) {
        return `请选择${field.label}`;
    }
    return `请输入${field.label}`;
};

const getFieldInputType = (type: DynamicFormField['type']) => {
    if (type === 'number') return 'digit'; // Vant 的数字键盘
    if (type === 'textarea') return 'textarea';
    return 'text'; // 默认文本
};

// 根据值获取选项的 label (用于 select 类型显示)
const getOptionLabel = (fieldName: string, value: string | number, options?: DynamicFormOption[]) => {
    if (!options) return '';
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : '';
};

// 判断选择的选项是否带有警告
const hasWarningOption = (fieldName: string, value: string | number, options?: DynamicFormOption[]) => {
    if (!options) return false;
    const selected = options.find(opt => opt.value === value);
    return selected && selected.warning === 1;
};

// --- 下拉选择器 (Picker) 逻辑 (用于 'select' 类型) ---
const pickerShow = ref(false);
const currentPickerField = ref(''); // 当前打开选择器的字段名
const pickerColumns = ref<Array<{ text: string; value: string | number; warning?: 0 | 1 }>>([]);
const defaultPickerIndex = ref(0);

const showPicker = (fieldName: string, options: DynamicFormOption[]) => {
    currentPickerField.value = fieldName;
    pickerColumns.value = options.map(opt => ({ text: opt.label, value: opt.value, warning: opt.warning }));

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

// --- 日期/时间/日期时间选择器 (DatetimePicker) 逻辑 ---
const dateTimePickerShow = ref(false);
const currentDateTimePickerField = ref<DynamicFormField | null>(null); // 当前打开选择器的字段对象
const tempDateTimeValue = ref<Date | string>(new Date()); // 用于 DatetimePicker 的临时值

const showDateTimePicker = (field: DynamicFormField) => {
    currentDateTimePickerField.value = field;
    // 初始化临时值：如果 formData 中有值，使用 formData 的值；否则使用当前时间
    const currentValue = internalFormData.value[field.name];
    if (currentValue) {
        if (field.type === 'time') {
            tempDateTimeValue.value = currentValue; // Vant time picker expects string "HH:mm"
        } else {
            tempDateTimeValue.value = new Date(currentValue);
        }
    } else {
        // 默认值处理
        if (field.type === 'time') {
            tempDateTimeValue.value = '00:00';
        } else {
            tempDateTimeValue.value = new Date();
        }
    }
    dateTimePickerShow.value = true;
};

const onDateTimePickerConfirm = ({ selectedValues }: { selectedValues: (string | number)[] }) => {
    if (!currentDateTimePickerField.value) return;

    let valueToStore: string | Date | number;

    if (currentDateTimePickerField.value.type === 'time') {
        // 时间选择器返回的是 [hour, minute] 数组，需要格式化成 "HH:mm"
        const hour = String(selectedValues[0]).padStart(2, '0');
        const minute = String(selectedValues[1]).padStart(2, '0');
        valueToStore = `${hour}:${minute}`;
    } else {
        // 日期或日期时间选择器返回 Date 对象
        const selectedDate = new Date(
            Number(selectedValues[0]),
            Number(selectedValues[1]) - 1, // 月份从0开始
            Number(selectedValues[2]),
            currentDateTimePickerField.value.type === 'datetime' ? Number(selectedValues[3]) : 0,
            currentDateTimePickerField.value.type === 'datetime' ? Number(selectedValues[4]) : 0
        );
        // 存储为 ISO 字符串或特定格式，便于后端处理，这里先转为字符串
        valueToStore = selectedDate.toISOString(); // 或 format as "YYYY-MM-DD HH:mm:ss"
    }

    internalFormData.value[currentDateTimePickerField.value.name] = valueToStore;
    dateTimePickerShow.value = false;
};

// 表单标题，如果未提供则不显示
const schemaTitle = computed(() => props.schemaTitle || '');
</script>

<style scoped>
.van-cell-group {
    margin-bottom: 15px;
}

.dynamic-form-radio-group-field {
    padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
}

.van-radio {
    display: flex;
    align-items: center;
    margin-right: 16px;
    /* 调整间距 */
}

/* 滑动选择器样式 */
.slider-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    /* 让滑块占据大部分空间 */
    padding-right: 10px;
    /* 为数值留出空间 */
}

.van-slider {
    flex: 1;
    margin-right: 10px;
}

.slider-value {
    min-width: 50px;
    /* 确保数值有足够的显示空间 */
    text-align: right;
    color: var(--van-gray-7);
}
</style>
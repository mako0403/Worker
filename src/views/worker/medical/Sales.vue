<template>
    <div class="h-full">
        <el-container class="h-full">
            <el-container class="h-full">
                <el-header class="px-3 flex align-items-center">
                    <el-page-header @back="goBack">
                        <template #icon>
                            <el-icon>
                                <ArrowLeft />
                            </el-icon>
                        </template>
                        <template #content>
                            <span class="mr-3 text-md"> 服务项目收费 </span>
                        </template>
                    </el-page-header>
                </el-header>
                <el-main class="h-full p-0 pb-3">
                    <div class="">
                        <el-steps :active="step" finish-status="success" process-status="wait" class="mx-4 mt-3 mb-3">
                            <el-step title="Step 1" description="选择项目" />
                            <el-step title="Step 2" description="单据细节" />
                            <el-step title="Step 3" description="确认收款" />
                        </el-steps>

                        <Transition leave-active-class="fadeoutleft animation-duration-300"
                            enter-active-class="fadeinright animation-duration-300">
                            <div class="h-full">
                                <div v-if="step == 1" class="fadeinright animation-duration-300">
                                    <van-tabs v-model:active="activeName" sticky offset-top="50px" color="#67c23a">
                                        <van-tab
                                            v-for="(category, cindex) in medicalCategory.filter(item => item.pid != 0)"
                                            :key="cindex" :title="category.name">
                                            <div class="border-top-1 border-gray-50"></div>
                                            <div v-for="(item, index) in services"
                                                v-show="item.category_id == category.id" :key="index"
                                                class="bg-white border-gray-100 border-1 px-3 py-2 border-round-xl mt-3 mx-4"
                                                :class="{ 'border-dblue-300 bg-dblue-50 text-dblue-500': form.model_id == item.id }"
                                                @click="selectServices(item)">
                                                <div class="flex align-items-center gap-3">
                                                    <img :src="item.cover" width="48px" />
                                                    <div class="w-full">
                                                        <div class="flex justify-content-between align-items-center">
                                                            <div class="text-900">{{ item.name }}</div>
                                                            <div class="text-orange-500 text-sm">￥{{ item.price }}</div>
                                                        </div>
                                                        <div class="text-gray-600 mt-1 text-xs">每疗程{{ item.limits }}次 {{
                                                            item.time_once }}分钟/次 </div>
                                                    </div>
                                                </div>
                                                <div class="mt-2 text-gray-500 text-xs">
                                                    <van-text-ellipsis :content="item.description" rows="2"
                                                        expand-text="展开" collapse-text="收起" />
                                                </div>
                                            </div>
                                        </van-tab>
                                    </van-tabs>
                                </div>

                                <el-form :model="form" size="large" label-width="auto" label-position="top"
                                    v-if="step == 2" class="fadeinright animation-duration-300 mx-4">
                                    <el-form-item class="mb-3">
                                        <template #label>患者卡号</template>
                                        <el-autocomplete v-model="form.card_number" type="text" :debounce="500"
                                            :fetch-suggestions="searchMemberAsync" value-key="fullname"
                                            placeholder="请输入患者姓名或手机号码" @select="handleSelect" class="w-full">
                                            <template #suffix>
                                                <el-icon class="el-input__icon">
                                                    <search />
                                                </el-icon>
                                            </template>
                                        </el-autocomplete>
                                        <div v-if="buyer.length != 0"
                                            class="w-full flex justify-content-between align-items-center gap-3 border-bluegray-100 border-1 px-3 border-round-2xl mt-3 bg-bluegray-50 relative">
                                            <div class="pt-3">
                                                <el-avatar :size="45" :src="buyer.avatar" class="align-items-center">
                                                    <img :src="defaultAvatar" />
                                                </el-avatar>
                                            </div>
                                            <div class="w-full line-height-1">
                                                <div class="text-md text-bluegray-900 font-bold">{{ buyer.fullname }}
                                                </div>
                                                <div
                                                    class="text-sm mt-2 text-bluegray-300 flex justify-content-between align-items-end">
                                                    <div>{{ buyer.card_rule ? buyer.card_rule.name : '' }}</div>
                                                    <div class="text-xs text-green-600">积分: {{ Math.abs(buyer.point) }}
                                                    </div>
                                                </div>
                                            </div>
                                            <el-icon size="18" @click="buyer = []; form.card_number = ''"
                                                class="absolute text-red-900" style="top:10px; right: 10px;">
                                                <Close />
                                            </el-icon>
                                        </div>
                                    </el-form-item>
                                    <el-row>
                                        <el-col :span="11">
                                            <el-form-item class="mb-3">
                                                <template #label>推荐员工</template>
                                                <el-select v-model="form.sale_worker_id" clearable
                                                    placeholder="请选择推荐员工">
                                                    <el-option v-for="item in workers" :key="item.id"
                                                        :label="item.fullname" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" class="text-center">

                                        </el-col>
                                        <el-col :span="11">
                                            <el-form-item class="mb-3">
                                                <template #label>服务员工</template>
                                                <el-select v-model="form.services_worker_id" clearable
                                                    placeholder="请选择服务员工">
                                                    <el-option v-for="item in workers" :key="item.id"
                                                        :label="item.fullname" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <div v-if="form.sale_worker_id" class="text-xs text-gray-500 mb-3">{{
                                            choseServices.sales_bonus > 0 ?
                                                `推荐员工获得${choseServices.sales_bonus * 100}%提成` : ''
                                        }}{{
                                                choseServices.sales_award > 0 ? ` + ${choseServices.sales_award}奖金` : '' }}
                                        </div>
                                        <div v-if="form.services_worker_id" class="text-xs text-gray-500 mb-3">{{
                                            choseServices.sales_bonus ? `职称奖金: ${choseServices.job_title_bonus_once}` :
                                            ''
                                            }}</div>
                                    </el-row>

                                    <el-form-item>
                                        <el-input v-model="form.remark" type="textarea" placeholder="(选填) 备注、客流来源等" />
                                    </el-form-item>

                                    <div
                                        class="border-green-100 bg-green-50 text-green-500 border-1 px-3 py-2 border-round-lg mb-3">
                                        <div class="flex align-items-center gap-3 mb-3 mt-3">
                                            <img :src="choseServices.cover" width="48px" />
                                            <div class="w-full">
                                                <div class="flex justify-content-between align-items-center">
                                                    <div class="text-900">{{ choseServices.name }}</div>
                                                    <div class="text-red-600 font-bold text-sm">￥{{ choseServices.price
                                                        }}</div>
                                                </div>
                                                <div class="text-gray-600 mt-1 text-xs">{{
                                                    choseServices.time_once }}分钟/次 每疗程{{ choseServices.limits }}次</div>
                                            </div>
                                        </div>
                                        <el-form-item class="mb-3">
                                            <div class="w-full flex justify-content-between" :class="{ 'text-gray-400': choseServices.job_title_bonus_once!='' }">
                                                <div class="">是否赠送项目</div>
                                                <el-switch v-model="form.is_gift" active-value="1" inactive-value="0" :disabled="choseServices.job_title_bonus_once?true:false"
                                                    inline-prompt active-text="是，本次项目免费赠送" inactive-text="否" />
                                            </div>
                                        </el-form-item>

                                        <el-row>
                                            <el-col :span="11">
                                                <el-form-item class="mb-3">
                                                    <template #label>服务次数</template>
                                                    <el-input v-model="form.limits" type="number" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="2" class="text-center">

                                            </el-col>
                                            <el-col :span="11">
                                                <el-form-item class="mb-3">
                                                    <template #label>应收金额</template>
                                                    <el-input v-model="form.price" type="number" :disabled="true" />
                                                </el-form-item>
                                                <!-- {{ choseServices.price_package}} -->
                                            </el-col>
                                        </el-row>

                                        <div v-if="choseServices.additional"
                                            class="bg-white p-3 border-round-md border-1 border-gray-100">
                                            <div class="text-sm text-800 mb-3 flex align-items-center">
                                                <el-icon class="text-lg mr-1">
                                                    <Expand />
                                                </el-icon>
                                                <div class="font-bold">附加服务项</div>
                                            </div>
                                            <div v-for="(item, ai) in choseServices.additional" :key="ai" class="">
                                                <div>
                                                    <div class="flex gap-3"
                                                        :class="{ 'mt-2 pt-2 border-top-1 border-gray-100': ai != 0 }"
                                                        @click="item.checkbox = !item.checkbox; choseAdditional(item);">
                                                        <div><img :src="item.cover" height="38px"
                                                                class="border-round-sm"></div>
                                                        <div class="w-full">
                                                            <div class="flex gap-1 align-items-center text-xs">
                                                                <el-checkbox v-model="item.checkbox" size="large"
                                                                    class="h-full"
                                                                    :class="{ 'bg-green-600': item.checkbox }"
                                                                    disabled />
                                                                <div
                                                                    class="w-full text-900 font-bold ellipsis ellipsis-line-1">
                                                                    <!-- <span class="text-600">[{{ item.related_model_name }}]</span> -->
                                                                    {{ item.title }}
                                                                </div>
                                                                <div class="text-red-600">￥<span class="text-sm">{{
                                                                    item.price }}</span>
                                                                </div>
                                                            </div>
                                                            <div class="text-xs text-600 mt-1">
                                                                <van-text-ellipsis rows="1" :content="item.description"
                                                                    expand-text="展开" collapse-text="收起" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="choseServices.additional_pay_method == 1 && form.additional_price > 0"
                                                class="flex justify-content-between mt-3 text-xs">
                                                <div>会员需自行支付</div>
                                                <div class="text-red-500 font-bold">￥{{ form.additional_price }}</div>
                                            </div>
                                        </div>

                                        <el-form-item class="mt-3" v-if="form.is_gift == 0">
                                            <div class="w-full flex justify-content-between px-1">
                                                <div class="">支付方式</div>
                                                <div class="text-red-500"></div>
                                            </div>
                                            <el-input v-for="(pay, pi) in form.paydetails" :key="pi" v-model="pay.value"
                                                type="number"
                                                :max="pay.paymethod === '积分抵现' ? maxPointOffsetAmount : undefined"
                                                :min="0" class="mb-3"
                                                :placeholder="pay.paymethod === '积分抵现' ? `最多可抵用${maxPointOffsetAmount}元` : '请输入金额'">
                                                <template #prepend>
                                                    <el-select v-model="pay.paymethod" style="width: 115px"
                                                        @change="handlePayMethodChange(pay, pi)">
                                                        <el-option v-for="(p, pi) in filteredPaymentMethods" :key="pi"
                                                            :label="pi" :value="pi">
                                                            <!-- <template v-if="pi === '积分抵现'">
                                                                    <span v-if="shouldShowPointOffset">{{ pi }}11</span>
                                                                </template>
                                <template v-else>
                                                                    <span>{{ pi }}55</span>
                                                                </template> -->
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                                <template #append v-if="pi != 0">
                                                    <el-icon @click="form.paydetails.splice(pi, 1)">
                                                        <Minus />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                            <div class="w-full flex justify-content-between align-items-center">
                                                <div class="text-red-600 font-bold pl-2">待收金额：￥<span
                                                        class="font-bold">{{ waitPayable
                                                        }}</span></div>
                                                <div>
                                                    <el-button v-if="waitPayable != 0" type="warning" size="small"
                                                        class="text-white" @click="addPayDetail">增加支付方式</el-button>
                                                    <!-- form.paydetails.push({paymethod:Object.entries(globalConfig.SYSTEM_PAYMETHOD)[0][0], value:''}) -->
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </el-form>

                                <el-result icon="success" v-if="step == 3">
                                    <template #icon>

                                    </template>
                                    <template #title>
                                        <div class="text-lg text-bluegray-500">已创建收费单</div>
                                    </template>
                                    <template #sub-title>
                                        <div class="text-bluegray-300 text-sm">
                                            患者现在可以通过在线平台预约和使用服务
                                        </div>
                                    </template>
                                </el-result>
                            </div>
                        </Transition>

                    </div>
                </el-main>
                <el-affix position="bottom" :offset="0" class="h-4rem w-full">
                    <div class="flex px-4">
                        <el-button type="default" class="w-full bg-indigo-50 border-indigo-100" size="large"
                            v-if="step == 2" @click="step = step - 1; resetChoseAdditional();">上一步</el-button>
                        <el-button type="primary" class="w-full bg-green-500 border-green-600" v-if="step == 1"
                            size="large" @click="nextStep">下一步</el-button>
                        <el-button type="primary" class="w-full bg-green-500 border-green-600" v-if="step == 2"
                            size="large" @click="nextStep">确认收费</el-button>
                        <el-button type="default" class="w-full bg-dblue-500 text-white" size="large" v-if="step == 3"
                            @click="step = 1">继续收费</el-button>
                        <el-button type="default" class="w-full" size="large" v-if="step == 3"
                            @click.once="goBack">返回控制台</el-button>
                    </div>
                </el-affix>
            </el-container>
        </el-container>
    </div>



</template>

<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

import axios from '@/utils/axios'
import { ElMessage } from 'element-plus';
import { useGlobalStore } from '@/store/global';
const { isLogged, workerConfig, globalConfig } = toRefs(useGlobalStore());


import defaultAvatar from '@@/images/default_avatar.webp'

import { TextEllipsis as vanTextEllipsis, Tabs as vanTabs, Tab as vanTab, showConfirmDialog } from 'vant'

const activeName = ref(0)
const step = ref<number>(1);
const buyer = ref<any | []>([]);
const choseServices = ref<any | []>([])
const medicalCategory = ref([])

const form = ref({
    model: 'MedicalServices',
    bid: workerConfig.value.bid,
    worker_card_number: workerConfig.value.card_number,
    sale_worker_id: ref<number | null>(null),
    services_worker_id: ref<number | null>(null),
    model_id: ref<number | null>(null),
    card_number: ref<string | ''>(''),
    limits_original: ref<number>(0),
    limits: ref<number>(1),
    price_original: ref<number>(0),
    price: ref<number>(0),
    additional_price: ref<number>(0),
    time_once: ref<number>(0),
    sales_bonus: ref<number>(0),
    sales_award: ref<number>(0),
    is_gift: ref<number | 0>(0),
    appointment_enable: ref<number | 0>(0),
    appointment_confirm: ref<number | 0>(0),
    paydetails: ref([{ paymethod: Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value: '' }]),
    remark: ref<string | ''>(''),
    additional: ref([]),
    additional_pay_method: ref(0)
});

const re_form = () => {

}

const selectServices = (item) => {
    form.value.model_id = item.id;
    form.value.limits = item.limits;
    form.value.price = item.price;
    form.value.sales_bonus = item.sales_bonus;
    form.value.sales_award = item.award;
    form.value.limits_original = item.limits;
    form.value.price_original = item.price;
    form.value.time_once = item.time_once;
    form.value.appointment_enable = item.appointment_enable;
    form.value.appointment_confirm = item.appointment_confirm;
    form.value.additional_pay_method = item.additional_pay_method;
    choseServices.value = item;
}

// 员工列表
interface Worker {
    id: number;
    fullname: string;
}
const workers = ref<Worker[]>([]);
const getWorkerLists = async () => {
    try {
        const res = await axios.get('/worker/lists', { bid: workerConfig.value.bid });
        workers.value = res.data as Worker[];
    } catch (error) {
        console.error('Failed to fetch worker lists:', error);
    }
};

// 服务列表
interface Service {
    id: number;
    name: string;
    sales_bonus: number;
    sales_award: number;
    limits: number;
    price: number;
}
const services = ref<Service[]>([]);
const getServiceLists = async () => {
    try {
        const res = await axios.get('/medical/services_lists', { bid: workerConfig.value.bid });
        services.value = res.data as Service[];
    } catch (error) {
        console.error('Failed to fetch worker lists:', error);
    }
};

/**
 * 获取单个会员信息
 * 这里仍然使用search去查询，只是肯定会获取唯一的会员信息，不会返回多个
 * 目的只是为了重新刷新会员信息
 * @param cardNumber 
 */
const getBuyerInfo = async (cardNumber: string) => {
    if (!cardNumber) {
        buyer.value = null;
        return;
    }
    try {
        const res = await axios.get(`/member/search`, { card_number: cardNumber, bid: workerConfig.value.bid }, { toast: 0 });
        if (res.data) {
            buyer.value = res.data[0];
        } else {
            buyer.value = null;
            ElMessage.warning('未能获取患者信息，可能卡号无效。');
        }
    } catch (error) {
        // 忽略被取消的请求错误，只处理其他错误
        if (!axios.isCancel(error)) {
            console.error('Failed to fetch member info:', error);
            buyer.value = null;
            ElMessage.error('获取患者信息失败。');
        }
    }
};

// 患者卡模糊查询
interface Member {
    id: number;
    card_number: string;
    fullname: string;
    avatar: string;
}
const members = ref<Member[]>([]);
let timeout: ReturnType<typeof setTimeout>
let abortController: AbortController | null = null; // 用于取消请求的 AbortController

const searchMemberAsync = (queryString: string, cb: (arg: any) => void) => {
    clearTimeout(timeout); // 清除上一次的 setTimeout
    if (abortController) {
        abortController.abort(); // 取消上一次的 axios 请求
    }

    timeout = setTimeout(async () => {
        if (queryString && queryString.length >= 2 && queryString.length <= 11) {
            abortController = new AbortController(); // 创建新的 AbortController
            try {
                const response = await axios.get(
                    `/member/search`,
                    {
                        card_number: queryString, bid: workerConfig.value.bid,
                        signal: abortController.signal, // 将 signal 传递给 axios
                    },
                    { toast: 0 }
                );

                if (response.data) {
                    members.value = response.data;
                    const results = queryString
                        ? members.value.filter(createFilter(queryString))
                        : members.value;
                    cb(results);
                } else {
                    cb([]);
                }
            } catch (error) {
                // 只有当错误不是取消请求时才进行日志和回调
                if (!axios.isCancel(error)) {
                    console.error('Error fetching members:', error);
                    cb([]);
                }
            } finally {
                abortController = null; // 请求完成后或被取消后清除 AbortController
            }
        } else {
            members.value = [];
            cb([]);
        }
    }, 500); // 500ms debounce
};

const createFilter = (queryString: string) => {
    return (member: Member) => {
        const lowerQuery = queryString.toLowerCase();
        const telphoneStr = member.telphone ? String(member.telphone) : ''; // 确保 telphone 是字符串

        if (
            member.card_number.toLowerCase().indexOf(lowerQuery) === 0 ||
            member.fullname.toLowerCase().includes(lowerQuery) || // 使用 includes 进行模糊匹配
            telphoneStr.toLowerCase().indexOf(lowerQuery) === 0
        ) {
            return true;
        }
    };
};

const handleSelect = async (item: Record<string, any>) => {
    form.value.card_number = item.card_number
    buyer.value = item
    // await getBuyerInfo(item.card_number);
}



onMounted(async () => {
    const res = await axios.get('/category/lists', { type: 'medical' })
    medicalCategory.value = res.data
    getWorkerLists()
    getServiceLists()
})

watch(() => form.value.is_gift, async (nval, oval) => {
    resetChoseAdditional();
    if (nval == 1) {
        form.value.price = 0;
        form.value.sales_bonus = 0;
        form.value.sales_award = 0;
    } else {
        form.value.price = Math.abs(((choseServices.value.price / choseServices.value.limits) * form.value.limits).toFixed(2));
        form.value.sales_bonus = choseServices.value.sales_bonus;
        form.value.sales_award = choseServices.value.sales_award;
    }
    form.value.paydetails = [{ paymethod: Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value: '' }];
})

watch(() => form.value.limits, async (nval, oval) => {
    if (nval > 0 && form.value.is_gift == 0) {
        form.value.price = Math.abs(((choseServices.value.price / choseServices.value.limits) * nval).toFixed(2));
        // form.value.price_original = Math.abs(((choseServices.value.price / choseServices.value.limits) * nval).toFixed(2));
    }
})

const goBack = () => {
    router.go(-1)
    //router.replace({path:'/'})
}

// 重置附加服务项目选择
const resetChoseAdditional = () => {
    form.value.additional_price = 0;
    form.value.additional = [];
    if (choseServices.value.additional) {
        Object.values(choseServices.value.additional).forEach(item => {
            item.checkbox = false;
        })
    }
}

// 附加服务项目选择
const choseAdditional = async (items) => {
    if (items.checkbox == true) {
        // if(!form.value.additional.hasOwnProperty(model)) {
        //     form.value.additional = [];
        // }

        form.value.additional.push(items)
    } else {
        form.value.additional = form.value.additional.filter(item => item.checkbox === true);
    }

    if (Array.isArray(form.value.additional) && form.value.additional.length === 0) {
        form.value.additional = []
        form.value.additional_price = 0;
    } else {
        form.value.additional_price = form.value.additional.reduce((sum, sub) => sum + sub.price, 0);
    }
    console.log(typeof form.value.additional, form.value.additional)
}

const nextStep = () => {
    switch (step.value) {
        case 1:
            if (!form.value.model_id) {
                ElMessage({ message: '请选择要收费的项目', type: 'info' })
                return;
            }
            form.value.is_gift = 0;
            step.value = 2;
            break;
        case 2:
            if (!form.value.card_number) {
                ElMessage({ message: '请选择购买患者', type: 'error' })
                return;
            }
            // 无收费员则不计收费提成及奖金
            if (!form.value.sale_worker_id) {
                form.value.sales_bonus = 0;
                form.value.sales_award = 0;
                // ElMessage({ message: '请选择收费员', type: 'error' })
                // return;
            } else {
                if (choseServices.value.sales_bonus < 1) {
                    form.value.sales_bonus = (form.value.price * choseServices.value.sales_bonus).toFixed(2)
                }
            }
            if (!form.value.sale_worker_id) {
                ElMessage({ message: '请选择销售推荐员工', type: 'error' })
                return;
            }
            if (!form.value.services_worker_id) {
                ElMessage({ message: '请选择服务员工', type: 'error' })
                return;
            }
            if (form.value.limits < 1) {
                ElMessage({ message: '请填写正确的服务次数', type: 'error' })
                return;
            }
            if (form.value.is_gift == 1 && form.value.price > 0) {
                ElMessage({ message: '赠送项目不允许有收费金额', type: 'error' })
                return;
            }
            if (form.value.is_gift == 0 && form.value.price <= 0) {
                ElMessage({ message: '请填写正确的收费金额', type: 'error' })
                return;
            }

            if((form.value.is_gift==1 || form.value.paydetails.some(item => item.paymethod === "优惠免除")) && form.value.remark==''){
                ElMessage({ message: '含优惠项，请填写备注', type: 'error' })
                return;
            }

            if (Number(waitPayable.value) < 0) {
                showConfirmDialog({
                    title: '待收金额为负',
                    message: '意味着多收患者￥' + waitPayable.value + '，确认继续提交收费吗？',
                })
                    .then(() => {
                        submitForm()
                    })
                    .catch(() => {
                        return
                    });
                // ElMessage({ message: '待支付金额不能为负', type: 'error' })
                // return;
            } else if (Number(waitPayable.value) > 0) {
                showConfirmDialog({
                    title: '存在待收金额',
                    message: '仍有￥' + waitPayable.value + '待支付金额，确认继续提交收费吗？',
                })
                    .then(() => {
                        submitForm()
                    })
                    .catch(() => {
                        return
                    });
            } else {
                submitForm()
            }



            break;
    }
}


const submitForm = async () => {
    // console.log(form.value)
    // return true;
    const res = await axios.post('/services/sale_services', form.value)
    if (res.status) {
        ElMessage({ message: res.info, type: 'success' })
        step.value = 3;

        // 在提交成功后，重新获取 buyer 的数据，以反映最新的积分余额
        if (form.value.card_number) {
            await getBuyerInfo(form.value.card_number);
        }

        form.value = {
            model: 'MedicalServices',
            bid: workerConfig.value.bid,
            worker_card_number: workerConfig.value.card_number,
            sale_worker_id: ref<number | null>(null),
            services_worker_id: ref<number | null>(null),
            model_id: ref<number | null>(null),
            card_number: buyer.value.card_number,
            limits_original: ref<number>(0),
            limits: ref<number>(1),
            price_original: ref<number>(0),
            price: ref<number>(0),
            additional_price: ref<number>(0),
            time_once: ref<number>(0),
            sales_bonus: ref<number>(0),
            sales_award: ref<number>(0),
            is_gift: ref<number | 0>(0),
            appointment_enable: ref<number | 0>(0),
            appointment_confirm: ref<number | 0>(0),
            paydetails: ref([{ paymethod: Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value: '' }]),
            remark: ref<string | ''>(''),
            additional: ref([]),
            additional_pay_method: ref(0)
        }
    } else {
        return;
    }
}


const waitPayable = computed(() => {
    const amount = form.value.paydetails.reduce((acc, payment) => {
        return Number(acc) + Number(payment.value);
    }, 0);
    return (Number(form.value.price) + (choseServices.value.additional_pay_method == 0 ? Number(form.value.additional_price) : 0) - Number(amount)).toFixed(2)

})

// 计算属性：根据条件过滤支付方式
const filteredPaymentMethods = computed(() => {
    const methods = { ...globalConfig.value.SYSTEM_PAYMETHOD }; // 复制一份，避免直接修改原对象

    // 检查“积分抵现”的显示条件
    const isPointOffsetEnabled = globalConfig.value.OFFSET_POINT_ENABLE == 1;
    const hasEnoughPoints = buyer.value.point > 0 && globalConfig.value.OFFSET_POINT_RATIO > 0 && (buyer.value.point / globalConfig.value.OFFSET_POINT_RATIO >= 1);

    if (methods['积分抵现'] !== undefined && (!isPointOffsetEnabled || !hasEnoughPoints)) {
        // 如果“积分抵现”不满足显示条件，则从结果中删除它
        delete methods['积分抵现'];
    }

    return methods;
});

// 计算属性：最大可抵现金额（整数部分）
const maxPointOffsetAmount = computed(() => {
    if (globalConfig.value.OFFSET_POINT_RATIO > 0) {
        return Math.floor(buyer.value.point / globalConfig.value.OFFSET_POINT_RATIO);
    }
    return 0;
});

// --- 处理支付方式选择的独占性 (删除旧的积分抵现) ---
const handlePayMethodChange = (currentPayDetail, currentIndex) => {
    if (currentPayDetail.paymethod === '积分抵现') {
        // 如果当前项被选为“积分抵现”，则遍历其他项进行处理
        // 从后往前遍历，避免 splice 影响索引
        for (let i = form.value.paydetails.length - 1; i >= 0; i--) {
            if (i !== currentIndex && form.value.paydetails[i].paymethod === '积分抵现') {
                // 如果发现其他项也是“积分抵现”，则直接删除它
                form.value.paydetails.splice(i, 1);
            }
        }
        // 确保当前选中的积分抵现项的值不会超过最大限制
        if (currentPayDetail.value !== null && currentPayDetail.value > maxPointOffsetAmount.value) {
            currentPayDetail.value = maxPointOffsetAmount.value;
        }
    } else {
        // 如果当前项被改为非“积分抵现”方式，则不再需要特殊处理
        // 其金额限制会自然解除，且不会影响其他“积分抵现”条目（因为只允许一个）
    }
};

// 获取一个默认的非积分抵现支付方式
const getDefaultPaymentMethod = () => {
    const availableMethods = Object.keys(filteredPaymentMethods.value);
    // 查找第一个不是“积分抵现”的支付方式作为默认值
    const defaultMethod = availableMethods.find(method => method !== '积分抵现');
    return defaultMethod || (availableMethods.length > 0 ? availableMethods[0] : ''); // 如果没有非积分，就用第一个，否则空
};


// 监听 pay.value 的变化，当选择积分抵现时，如果输入值超过最大值，则进行限制
watch(
    () => form.value.paydetails,
    (newDetails) => {
        newDetails.forEach(pay => {
            if (pay.paymethod === '积分抵现' && pay.value !== null && pay.value > maxPointOffsetAmount.value) {
                pay.value = maxPointOffsetAmount.value;
            }
            // 确保输入值不小于0
            if (pay.value !== null && pay.value < 0) {
                pay.value = 0;
            }
        });
    },
    { deep: true }
);


// 添加支付明细的函数
const addPayDetail = () => {
    // 检查是否已经存在“积分抵现”
    const hasPointOffset = form.value.paydetails.some(pay => pay.paymethod === '积分抵现');
    let newPayMethod = getDefaultPaymentMethod();

    if (filteredPaymentMethods.value['积分抵现'] && !hasPointOffset) {
        // 如果“积分抵现”选项可用且当前没有“积分抵现”支付方式，则默认添加“积分抵现”
        // 否则，如果用户点击“添加支付方式”时，默认添加的不是“积分抵现”，而应该根据逻辑处理
        // 这里为了演示独占性，我们让它默认添加第一个非积分方式
        // 实际业务中，可能根据需求默认添加某个非积分方式，或者弹窗提示
    }

    // 确保新添加的支付方式不是“积分抵现”，除非它是唯一可用的
    if (newPayMethod === '积分抵现' && hasPointOffset) {
        newPayMethod = getDefaultPaymentMethod(); // 避免添加重复的积分抵现
    }

    form.value.paydetails.push({ paymethod: newPayMethod, value: '' });

    // 如果新添加的是“积分抵现”，同样需要处理旧的
    if (newPayMethod === '积分抵现') {
        handlePayMethodChange(form.value.paydetails[form.value.paydetails.length - 1], form.value.paydetails.length - 1);
    }
};
</script>
<style lang="scss" scoped></style>
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
                                                        <div class="text-gray-600 mt-1 text-xs">每疗程{{item.limits}}次 {{
                                                            item.time_once}}分钟/次 </div>
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
                                                <div class="text-sm mt-2 text-bluegray-300">{{
                                                    buyer.card_rule ? buyer.card_rule.name : ''
                                                    }}</div>
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
                                        <div v-if="form.sale_worker_id" class="text-xs text-gray-500 mb-3">{{ choseServices.sales_bonus>0?`推荐员工获得${choseServices.sales_bonus*100}%提成`:'' }}{{ choseServices.sales_award>0?` + ${choseServices.sales_award}奖金`:'' }}</div>
                                        <div v-if="form.services_worker_id" class="text-xs text-gray-500 mb-3">{{ choseServices.sales_bonus?`职称奖金: ${choseServices.job_title_bonus_once}`:'' }}</div>
                                    </el-row>

                                    <el-form-item>
                                        <el-input v-model="form.remark" type="textarea" placeholder="(选填) 备注、客流来源等" />
                                    </el-form-item>

                                    <div class="border-green-100 bg-green-50 text-green-500 border-1 px-3 py-2 border-round-lg mb-3">
                                        <div class="flex align-items-center gap-3 mb-3 mt-3">
                                            <img :src="choseServices.cover" width="48px" />
                                            <div class="w-full">
                                                <div class="flex justify-content-between align-items-center">
                                                    <div class="text-900">{{ choseServices.name }}</div>
                                                    <div class="text-red-600 font-bold text-sm">￥{{ choseServices.price }}</div>
                                                </div>
                                                <div class="text-gray-600 mt-1 text-xs">{{
                                                    choseServices.time_once}}分钟/次 每疗程{{choseServices.limits}}次</div>
                                            </div>
                                        </div>
                                        <el-form-item class="mb-3">
                                            <div class="w-full flex justify-content-between">
                                                <div class="">是否赠送项目</div>
                                                <el-switch v-model="form.is_gift" active-value="1" inactive-value="0"
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
                                                    <el-input v-model="form.price" type="number"
                                                        :disabled="true" />
                                                </el-form-item>
                                                <!-- {{ choseServices.price_package}} -->
                                            </el-col>
                                        </el-row>

                                        <div v-if="choseServices.additional" class="bg-white p-3 border-round-md border-1 border-gray-100">
                                            <div class="text-sm text-800 mb-3 flex align-items-center">
                                                <el-icon class="text-lg mr-1"><Expand /></el-icon>
                                                <div class="font-bold">附加服务项</div>
                                            </div>
                                            <div v-for="(item, ai) in choseServices.additional" :key="ai" class="">
                                                <div>
                                                    <div class="flex gap-3" :class="{'mt-2 pt-2 border-top-1 border-gray-100':ai!=0}" @click="item.checkbox=!item.checkbox; choseAdditional(item);">
                                                        <div><img :src="item.cover" height="38px" class="border-round-sm"></div>
                                                        <div class="w-full">
                                                            <div class="flex gap-1 align-items-center text-xs" >
                                                                <el-checkbox v-model="item.checkbox" size="large" class="h-full" :class="{'bg-green-600':item.checkbox}" disabled />
                                                                <div class="w-full text-900 font-bold ellipsis ellipsis-line-1">
                                                                    <!-- <span class="text-600">[{{ item.related_model_name }}]</span> -->
                                                                    {{ item.title }}
                                                                </div>
                                                                <div class="text-red-600">￥<span class="text-sm">{{ item.price }}</span></div>
                                                            </div>
                                                            <div class="text-xs text-600 mt-1">
                                                                <van-text-ellipsis rows="1" :content="item.description" expand-text="展开" collapse-text="收起"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="choseServices.additional_pay_method == 1 && form.additional_price > 0" class="flex justify-content-between mt-3 text-xs">
                                                <div>会员需自行支付</div>
                                                <div class="text-red-500 font-bold">￥{{ form.additional_price }}</div>
                                            </div>
                                        </div>

                                        <el-form-item class="mt-3" v-if="form.is_gift==0">
                                            <div class="w-full flex justify-content-between px-1">
                                                <div class="">支付方式</div>
                                                <div class="text-red-500"></div>
                                            </div>
                                            <el-input v-for="(pay, pi) in form.paydetails" :key="pi" v-model="pay.value"
                                                type="number" class="mb-3" placeholder="请输入实收金额">
                                                <template #prepend>
                                                    <el-select v-model="pay.paymethod" style="width: 115px">
                                                        <el-option v-for="(p, pi) in globalConfig.SYSTEM_PAYMETHOD"
                                                            :label="pi" :value="pi" />
                                                    </el-select>
                                                </template>
                                                <template #append v-if="pi!=0">
                                                    <el-icon @click="form.paydetails.splice(pi, 1)">
                                                        <Minus />
                                                    </el-icon>
                                                </template>
                                            </el-input>
                                            <div class="w-full flex justify-content-between align-items-center">
                                                <div class="text-red-600 font-bold pl-2">待收金额：￥<span class="font-bold">{{ waitPayable }}</span></div>
                                                <div>
                                                    <el-button v-if="waitPayable!=0" type="warning" size="small"
                                                        class="text-white"
                                                        @click="form.paydetails.push({paymethod:Object.entries(globalConfig.SYSTEM_PAYMETHOD)[0][0], value:''})">增加支付方式</el-button>
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

import {TextEllipsis as vanTextEllipsis, Tabs as vanTabs, Tab as vanTab, showConfirmDialog } from 'vant'

const activeName = ref(0)
const step = ref<number>(1);
const buyer = ref<any | []>([]);
const choseServices = ref<any | []>([])
const medicalCategory = ref([])

const form = ref({
    model:'MedicalServices',
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
    paydetails:ref([{paymethod:Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value:''}]),
    remark: ref<string | ''>(''),
    additional: ref([]),
    additional_pay_method: ref(0)
});

const re_form = ()=>{

}

const selectServices = (item) =>{
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
    sales_award:number;
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

// 患者卡模糊查询
interface Member {
    id: number;
    card_number: string;
    fullname: string;
    avatar: string;
}
const members = ref<Member[]>([]);
let timeout: ReturnType<typeof setTimeout>
const searchMemberAsync = (queryString: string, cb: (arg: any) => void) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (queryString && queryString.length >= 2 && queryString.length <= 11) {
            axios.get(`/member/search`, { card_number: queryString, bid:workerConfig.value.bid }, { toast: 0 })
                .then(response => {
                    if (response.data) {
                        members.value = response.data;
                        //const results = members.value.filter(createFilter(queryString));
                        const results = queryString
                            ? members.value.filter(createFilter(queryString))
                            : members.value
                        cb(results);
                    } else {
                        cb([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching members:', error);
                    cb([]);
                });
        } else {
            members.value = [];
            cb([]);
        }
    }, 500);
};
const createFilter = (queryString: string) => {
    return (member: Member) => {
        if(member.card_number.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || member.fullname == queryString || member.telphone.toLowerCase().indexOf(queryString.toLowerCase()) === 0){
            return true;
        }
    };
};
const handleSelect = (item: Record<string, any>) => {
    form.value.card_number = item.card_number
    buyer.value = item
}

onMounted(async () => {
    const res = await axios.get('/category/lists', {type:'medical'})
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
    form.value.paydetails = [{paymethod:Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value:''}];
})

watch(()=>form.value.limits, async (nval, oval) => {
    if(nval>0 && form.value.is_gift == 0){
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
    if(choseServices.value.additional){
        Object.values(choseServices.value.additional).forEach(item=>{
            item.checkbox = false;
        })
    }
}

// 附加服务项目选择
const choseAdditional = async (items) => {
    if(items.checkbox == true){
        // if(!form.value.additional.hasOwnProperty(model)) {
        //     form.value.additional = [];
        // }
        
        form.value.additional.push(items)
    }else{
        form.value.additional = form.value.additional.filter(item => item.checkbox === true);
    }

    if (Array.isArray(form.value.additional) && form.value.additional.length === 0) {
        form.value.additional = []
        form.value.additional_price = 0;
    }else{
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
            }else{
                if(choseServices.value.sales_bonus < 1){
                    form.value.sales_bonus =  (form.value.price * choseServices.value.sales_bonus).toFixed(2)
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

            if(Number(waitPayable.value) < 0){
                showConfirmDialog({
                    title: '待收金额为负',
                    message:'意味着多收患者￥'+waitPayable.value+'，确认继续提交收费吗？',
                })
                .then(() => {
                    submitForm()
                })
                .catch(() => {
                    return
                });
                // ElMessage({ message: '待支付金额不能为负', type: 'error' })
                // return;
            }else if(Number(waitPayable.value) > 0){
                showConfirmDialog({
                    title: '存在待收金额',
                    message:'仍有￥'+waitPayable.value+'待支付金额，确认继续提交收费吗？',
                })
                .then(() => {
                    submitForm()
                })
                .catch(() => {
                    return
                });
            }else{
                submitForm()
            }

            
            
            break;
    }
}


const submitForm = async () => {
    
    const res = await axios.post('/services/sale_services', form.value)
    if(res.status){
        ElMessage({ message: res.info, type:'success' })
        step.value = 3;

        form.value = {
            model:'MedicalServices',
            bid: workerConfig.value.bid,
            worker_card_number: workerConfig.value.card_number,
            sale_worker_id: ref<number | null>(null),
            services_worker_id: ref<number | null>(null),
            model_id: ref<number | null>(null),
            card_number:buyer.value.card_number,
            limits_original: ref<number>(0),
            limits: ref<number>(1),
            price_original: ref<number>(0),
            price: ref<number>(0),
            additional_price:ref<number>(0),
            time_once: ref<number>(0),
            sales_bonus: ref<number>(0),
            sales_award: ref<number>(0),
            is_gift: ref<number | 0>(0),
            appointment_enable: ref<number | 0>(0),
            appointment_confirm: ref<number | 0>(0),
            paydetails:ref([{paymethod:Object.entries(globalConfig.value.SYSTEM_PAYMETHOD)[0][0], value:''}]),
            remark: ref<string | ''>(''),
            additional: ref([]),
            additional_pay_method: ref(0)
        }
    }else{
        return;
    }   
}


const waitPayable = computed(() => {
    const amount = form.value.paydetails.reduce((acc, payment) => {
        return Number(acc) + Number(payment.value);
    }, 0);
    return (Number(form.value.price) + (choseServices.value.additional_pay_method==0?Number(form.value.additional_price):0) - Number(amount)).toFixed(2)

})


</script>
<style lang="scss" scoped>
</style>
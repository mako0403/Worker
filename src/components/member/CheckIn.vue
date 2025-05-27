<template>
    <div class="check-in">
        <div>
            <div class="text-lg mb-1 text-red-300">
                <svg class="icon " aria-hidden="true" style="width:18px; height:18px;">
                    <use xlink:href="#icon-jifen11"></use>
                </svg>
                {{ '+' + (isCheckedIn ? tomorrowPoint : pointEarned) }}
            </div>
            <el-button size="small" :disabled="isCheckedIn" @click="handleCheckIn" round
                :class="{ 'bg-purple-500 border-purple-600 text-white': !isCheckedIn }">
                {{ isCheckedIn ? '明日签到' : '签到' }}
            </el-button>
            <!-- <van-button type="primary" size="small" :disabled="isCheckedIn" class="bg-purple-500">签到</van-button> -->
            <!-- <div v-if="tomorrowPoint" class="text-xs mt-1">{{ !isCheckedIn?'今日 +'+pointEarned:'明日 +'+tomorrowPoint }}</div>
            <div v-else class="text-xs">+{{ pointEarned }}积分</div> -->
        </div>
        <!-- 动画弹层 -->
        <van-overlay v-model:show="showOverlay" lock-scroll style="z-index: 999; padding-top: 40%;">
            <div class="check-in-popup">
                <div class="content">
                    <div class="text-900 font-bold text-md mt-8">签到成功！获得 {{ pointEarned }} 积分</div>
                    <div class="text-700 text-xs mt-3">加油哦！明日签到可获得 {{ tomorrowPoint }} 积分</div>
                    <div class="mt-8 pt-3">
                        <el-button size="large" @click="closeOverlay" round
                            class="bg-yellow-400 border-yellow-500 text-white px-5">返 回</el-button>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { Button as vanButton, Icon as vanIcon, Overlay as vanOverlay } from 'vant';
import { ElMessage } from 'element-plus';
import axios from '@/utils/axios'


// 定义 emits 以便组件在签到成功后向父组件通知
const emit = defineEmits(['checkInSuccess']);

const showOverlay = ref(false); // 控制弹层显示
const isCheckedIn = ref(false); // 是否已经签到
const pointEarned = ref(0); // 本次签到获得的积分
const tomorrowPoint = ref(null); // 明日签到可获得积分

// 获取用户签到信息
const getCheckInStatus = async () => {
    try {
        const { data } = await axios.get('/member/check_in_status');
        console.log(1111111111111, data)
        isCheckedIn.value = data.is_checked_in;
        pointEarned.value = data.today_point;
        tomorrowPoint.value = data.tomorrow_point || 0;
    } catch (error) {
        ElMessage.error('获取签到状态失败');
    }
};

// 签到逻辑
const handleCheckIn = async () => {
    try {
        const { data } = await axios.post('/member/check_in');
        pointEarned.value = data.point;
        getCheckInStatus();
        showOverlay.value = true;

        // 触发签到成功事件
        emit('checkInSuccess', data.point);

        // 3秒后自动关闭弹层
        setTimeout(() => {
            showOverlay.value = false;
        }, 3000);
    } catch (error) {
        ElMessage.error('签到失败，请稍后再试');
    }
};

// 手动关闭弹层
const closeOverlay = () => {
    showOverlay.value = false;
};

onMounted(() => {
    getCheckInStatus();
});
</script>

<style scoped>
.check-in {
    text-align: center;
}

.check-in-popup {
    width: 90%;
    max-width: 350px;
    /* 限制最大宽度 */
    margin: auto;
    text-align: center;
    background: url('@@/images/checkin-success.webp') center top no-repeat;
    background-size: cover;
    position: relative;
    padding-top: 100%;
    /* 控制高度的比例，使背景图保持适应不同屏幕 */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content {
    position: absolute;
    top: 56%;
    /* 确保文字在弹窗中垂直居中 */
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    /* 设置内容宽度，确保在不同设备上显示良好 */
}

.text-900 {
    font-size: 4vw;
    /* 适应不同分辨率 */
}

.text-700 {
    font-size: 3vw;
}
</style>
<template>
    <div class="h-full bg-white flex flex-column font-sans overflow-hidden">
        <template v-if="hasPermission">
            <!-- 1. 顶部固定播放器 -->
            <el-affix :offset="0">
                <div class="bg-white shadow-3 overflow-hidden" style="border-radius: 0 0 32px 32px;">
                    <div v-loading="videoLoading" class="video-container bg-black relative"
                        :style="{ height: playerHeight + 'px' }">
                        <div id="xg-player" class="w-full h-full"></div>

                        <!-- 启动引导 -->
                        <div v-if="!isPlaying"
                            class="absolute top-0 left-0 w-full h-full flex flex-column justify-content-center align-items-center bg-black-alpha-40 z-20">
                            <van-image :src="currentPlan.cover" width="100%" height="100%" fit="cover"
                                class="absolute top-0 left-0" />
                            <el-button type="primary" circle style="width: 75px; height: 75px; z-index: 30;"
                                class="shadow-4 scalein" @click="startTraining">
                                <el-icon size="35">
                                    <CaretRight />
                                </el-icon>
                            </el-button>
                            <div class="text-white text-sm mt-3 font-bold z-30 tracking-widest">开始今日康复训练</div>
                        </div>
                    </div>

                    <!-- 实时状态 -->
                    <div class="p-4 bg-white">
                        <div class="flex justify-content-between align-items-end mb-3">
                            <div class="flex-1 min-w-0 pr-3">
                                <div class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">正在播放</div>
                                <div
                                    class="text-xl font-black text-900 line-height-1 overflow-hidden text-overflow-ellipsis white-space-nowrap">
                                    {{ runRelatedItem.title || '准备开始' }}
                                </div>
                            </div>
                            <div class="text-right">
                                <template v-if="countdown > 0">
                                    <div class="text-xs text-500 font-bold mb-1">准备动作</div>
                                    <div class="text-3xl font-black text-blue-600 tracking-tighter tabular-nums">{{
                                        countdown }}s</div>
                                </template>
                                <template v-else>
                                    <div class="text-2xl font-black text-900 tracking-tighter tabular-nums">{{ formattedTime
                                        }}</div>
                                    <div class="text-0 text-500 uppercase tracking-tighter">Elapsed Time</div>
                                </template>
                            </div>
                        </div>

                        <div class="flex align-items-center gap-3">
                            <div class="flex-1 bg-gray-100 border-round-pill overflow-hidden" style="height: 6px;">
                                <div class="bg-blue-600 h-full transition-all transition-duration-500"
                                    :style="{ width: playProgress + '%' }">
                                </div>
                            </div>
                            <div class="flex align-items-center gap-2 bg-gray-50 px-2 py-1 border-round-pill">
                                <span class="text-xs text-600 font-bold">自动连播</span>
                                <el-switch v-model="autoPlay" size="small" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-affix>

            <!-- 2. 下方动作列表 -->
            <div class="flex-1 overflow-y-auto px-4 pt-4 pb-6 mt-1">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h2 class="text-xl font-black text-900 m-0">动作序列 ({{ videoList.length }})</h2>
                    <!-- 分享按钮：所有视频都超过80%显示 -->
                    <el-button v-if="allCompleted" type="warning" size="small" round @click="handleOpenShare">
                        生成打卡海报
                    </el-button>
                </div>

                <div v-for="(item, index) in videoList" :key="index" @click="handleVideoClick(item)"
                    class="flex align-items-center py-3 border-bottom-1 border-gray-100 gap-3 transition-all active:bg-gray-50"
                    :class="{ 'bg-blue-50 border-round-xl px-3 mx-n2 shadow-1': item.id === runRelatedItem.id }">

                    <div class="text-2xl font-light italic tracking-tighter"
                        :class="item.id === runRelatedItem.id ? 'text-blue-600' : 'text-200'" style="min-width: 35px;">
                        {{ String(index + 1).padStart(2, '0') }}
                    </div>

                    <div class="relative flex-shrink-0">
                        <el-image :src="item.cover" class="border-round-lg shadow-1" style="width: 85px; height: 60px;"
                            fit="cover" />
                        <div v-if="item.id === runRelatedItem.id && isPlaying"
                            class="absolute top-0 left-0 w-full h-full bg-blue-600-alpha-20 border-round-lg flex justify-content-center align-items-center">
                            <div class="flex gap-1 align-items-end" style="height: 12px;">
                                <div v-for="i in 3" :key="i" class="w-3px bg-white border-round animate-wave"
                                    :style="{ animationDelay: (i * 0.2) + 's' }"></div>
                            </div>
                        </div>
                        <!-- 进度判断改为 80% -->
                        <div v-if="videoStatistics.get(item.url)?.play_ratio >= 80"
                            class="absolute top-0 right-0 p-1 bg-orange-500 text-white text-0 border-round-bottom-left shadow-2">
                            <el-icon>
                                <Check />
                            </el-icon>
                        </div>
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-900 mb-1 line-height-2">{{ item.title }}</div>
                        <div class="flex align-items-center gap-2 text-xs text-500">
                            <span>{{ /[:]/g.test(item.spec) ? item.spec : item.spec + '次' }}</span>
                            <!-- 奖励判断改为 80% -->
                            <span v-if="videoStatistics.get(item.url)?.play_ratio >= 80"
                                class="text-orange-500 font-bold">已奖积分</span>
                            <span v-else class="text-400">+10 积分</span>
                        </div>
                    </div>

                    <div class="p-2" @click.stop="openInfo(item)">
                        <el-icon class="text-400" size="18">
                            <InfoFilled />
                        </el-icon>
                    </div>
                </div>
            </div>
        </template>
        <!-- 权限校验未通过：展示提示 -->
        <template v-else>
            <div class="flex-1 flex flex-column justify-content-center align-items-center p-5 text-center">
                <van-image 
                    src="/images/13818750_5377028.webp" 
                    width="160" 
                    height="160" 
                />
                <h3 class="text-900 font-black mt-4 mb-2">未获得访问权限</h3>
                <p class="text-600 text-sm line-height-3">
                    您当前的账号尚未开通此康复方案的权限。<br>
                    请咨询相关工作人员或完成购买后查看。
                </p>
                <el-button 
                    type="primary" 
                    round 
                    class="mt-4 px-5"
                    @click="router.back()"
                >返回上一页</el-button>
            </div>
        </template>
        <!-- 简介弹窗 -->
        <van-popup v-model:show="showDescription" position="bottom" round closeable :style="{ height: '55%' }">
            <div class="p-4">
                <div class="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">GUIDE</div>
                <div class="text-xl font-black text-900 mb-3">{{ selectedItemForDesc.title }}</div>
                <div class="text-sm text-700 line-height-4" v-html="selectedItemForDesc.description"></div>
            </div>
        </van-popup>

        <!-- 海报海报遮罩 -->
        <van-overlay :show="showShare" z-index="999">
            <div class="flex justify-content-center align-items-center h-full">
                <div class="w-10">
                    <AutoImageGenerator v-if="showShare" :width="1200" :height="1599" :baseImage="shareBackimage"
                        :smallImages="[{ url: globalStore.memberInfo.avatar, x: 112, y: 500, width: 100, height: 100 }]"
                        :texts="[
                            { content: globalStore.branchConfig.name + '产后康复运动打卡', x: 670, y: 144, fontSize: 26, font: 'ZeoFont3', color: '#26343d', bold: true }, 
                            { content: globalStore.memberInfo.nickname, x: 112, y: 632, fontSize: 26, font: 'ZeoFont2', color: '#26343d', bold: true }, 
                            { content: sumCollectionRecordDays + '天', x: 112, y: 730, fontSize: 36, font: 'ZeoFont2', color: '#df3636', bold: true }, 
                            { content: playtimeCompleted, x: 290, y: 1203, fontSize: 42, font: 'ZeoFont3', color: '#26343d', bold: true },
                            { content: globalStore.branchConfig.name + '产后康复科', x: 105, y: 1477, fontSize: 26, font: 'ZeoFont3', color: '#26343d', bold: true },
                            { content: '咨询电话：' + globalStore.branchConfig.telphone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3'), x: 105, y: 1510, fontSize: 20, font: 'ZeoFont3', color: '#26343d' }
                        ]"
                        @update:imageURL="handleImageURLUpdate"></AutoImageGenerator>
                    <div class="mt-3 p-3 bg-white border-round-xl">
                        <div class="font-bold text-center text-lg text-blue-600">打卡记录已生成</div>
                        <div class="text-right mt-2"><el-button size="small" type="primary"
                                @click="showShare = false">关闭</el-button></div>
                    </div>
                </div>
            </div>
        </van-overlay>

        <audio ref="countdownAudioRef" src="/audio/countdown-audio.ogg" />
        <audio ref="endAudioRef" src="/audio/end-audio.ogg" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/global';
import axios from '@/utils/axios';
import { ElMessage } from 'element-plus';
import moment from 'moment';
import Player from 'xgplayer';
import HlsPlugin from 'xgplayer-hls';
import 'xgplayer/dist/index.min.css';
import { useHead } from '@vueuse/head';

// 资源
import AutoImageGenerator from '@/components/image/AutoImageGenerator.vue';
import shareBackimage from '@@/images/ydkf_dk_bg.webp';
import { CaretRight, InfoFilled, Check } from '@element-plus/icons-vue';
import { Image as VanImage, Loading as vanLoading, Popup as vanPopup, Overlay as vanOverlay } from 'vant';

const route = useRoute();
const router = useRouter(); // 初始化 router 实例
const globalStore = useGlobalStore();

// 1. 状态定义
const currentPlan = ref({ title: '', cover: '' });
const videoList = ref([]);
const runRelatedItem = ref({ id: null, url: '', title: '', description: '' });
const isPlaying = ref(false);
const videoLoading = ref(false);
const playerHeight = ref(window.innerWidth * 0.5625);
const currentTime = ref(0);
const duration = ref(0);
const autoPlay = ref(true);
const countdown = ref(0);
let countdownInterval: any = null;
let playerInstance: Player | null = null;

const showDescription = ref(false);
const selectedItemForDesc = ref({});
const videoStatistics = ref(new Map());
const sumCollectionRecordDays = ref(1);
const playtimeCompleted = ref('0分0秒');
const countdownAudioRef = ref<HTMLAudioElement | null>(null);
const endAudioRef = ref<HTMLAudioElement | null>(null);
const showShare = ref(false);
const hasPermission = ref(true); // 默认有权限，避免加载闪烁
let canplayHandler: (() => void) | null = null;

const pageTitle = ref('运动康复详情');
useHead({
    title: pageTitle,
})

// 2. 计算属性
const formattedTime = computed(() => {
    const m = Math.floor(currentTime.value / 60);
    const s = Math.floor(currentTime.value % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});
const playProgress = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0));

// 判断是否所有视频都播放完成（超过80%）
const allCompleted = computed(() => {
    if (videoList.value.length === 0) return false;
    return videoList.value.every(v => {
        const stat = videoStatistics.value.get(v.url);
        return stat && stat.play_ratio >= 80;
    });
});
console.log(1111, currentPlan.value.title);

// 3. 数据加载
const initPage = async () => {
    try {
        const id = route.params.id || route.params.i;

        const res = await axios.get('/video/getPlanDetails', { id, card_number: globalStore.memberInfo.card_number });
        if (res.status) {
            currentPlan.value = res.data.plan;
            videoList.value = res.data.videos;
            pageTitle.value =   currentPlan.value.title; 

            // 如果视频列表为空，可能意味着没有权限或方案下架
            if (!videoList.value || videoList.value.length === 0) {
                hasPermission.value = false;
            }
        } else {
            hasPermission.value = false;
        }
        const countRes = await axios.get('/video/sum_record_days', { card_number: globalStore.memberInfo.card_number });
        if (countRes) {
            // 解决 [object Object] 问题：确保提取 data 中的纯数字
            sumCollectionRecordDays.value = typeof countRes === 'object' ? (countRes.data || 1) : countRes;
        }
    } catch (e) { 
        hasPermission.value = false;
        ElMessage.error('加载失败');
    }
};

// 4. 视频播放核心
const playVideo = async (videoItem: any) => {
    if (!videoItem || !videoItem.url) return;

    // 切换前先记录旧进度
    if (runRelatedItem.value.url) {
        await recordVideoEnd(runRelatedItem.value.url);
    }

    runRelatedItem.value = videoItem;
    isPlaying.value = true;
    videoLoading.value = true;

    await nextTick();

    const playerConfig = {
        id: 'xg-player',
        url: videoItem.url,
        plugins: [HlsPlugin],
        width: '100%',
        height: '100%',
        playsinline: true,
        autoplay: true,
        autoplayMuted: true,
        "x5-video-player-type": "h5-page",
        poster: videoItem.cover,
        commonStyle: { themeColor: '#3b82f6' }
    };

    try {
        if (!playerInstance) {
            playerInstance = new Player(playerConfig);
            bindPlayerEvents();

            // 首次初始化只 seek(0) 一次
            canplayHandler = () => { playerInstance?.seek(0); };
            playerInstance.once('canplay', canplayHandler);

        } else {
            // 切换前移除上一个未触发的 canplay 监听
            if (canplayHandler) {
                playerInstance.off('canplay', canplayHandler);
                canplayHandler = null;
            }

            playerInstance.switchURL(videoItem.url);

            canplayHandler = () => {
                playerInstance?.seek(0);
                playerInstance?.play().catch(err => {
                    console.warn('播放被中断:', err);
                });
                canplayHandler = null;
            };
            playerInstance.once('canplay', canplayHandler);
        }
    } catch (err) {
        console.error('XgPlayer Init/Switch Error', err);
    }

    recordVideoStart(videoItem.url);
};

const bindPlayerEvents = () => {
    if (!playerInstance) return;
    playerInstance.on('timeupdate', () => { currentTime.value = playerInstance!.currentTime; });
    playerInstance.on('durationchange', () => { duration.value = playerInstance!.duration; });
    playerInstance.on('playing', () => { videoLoading.value = false; });

    // 自然播放结束
    playerInstance.on('ended', () => {
        recordVideoEnd(runRelatedItem.value.url);
        playNextVideo();
    });
};

const startTraining = () => { if (videoList.value.length > 0) playVideo(videoList.value[0]); };
const handleVideoClick = (item: any) => playVideo(item);
const openInfo = (item: any) => { selectedItemForDesc.value = item; showDescription.value = true; };

const playNextVideo = () => {
    if (!autoPlay.value) return;
    const idx = videoList.value.findIndex(v => v.id === runRelatedItem.value.id);
    if (idx !== -1 && idx < videoList.value.length - 1) {
        countdownAudioRef.value?.play().catch(() => { });
        countdown.value = 5;
        countdownInterval = setInterval(() => {
            if (countdown.value > 1) countdown.value--;
            else {
                clearInterval(countdownInterval);
                countdown.value = 0;
                playVideo(videoList.value[idx + 1]);
            }
        }, 1000);
    } else {
        endAudioRef.value?.play().catch(() => { });
        isPlaying.value = false;
    }
};

const recordVideoStart = (url: string) => {
    if (!url) return;
    if (!videoStatistics.value.has(url)) {
        videoStatistics.value.set(url, { start_time: new Date(), duration: 0, play_ratio: 0, recorded: false });
    } else {
        videoStatistics.value.get(url).start_time = new Date();
    }
};

const recordVideoEnd = async (url: string) => {
    const stat = videoStatistics.value.get(url);
    if (stat && playerInstance && playerInstance.duration > 0) {
        const endTime = new Date();
        const diff = moment(endTime).diff(moment(stat.start_time), 'seconds');

        // 累加本次播放的时长
        stat.duration += diff;
        stat.play_ratio = Math.min(((stat.duration / playerInstance.duration) * 100), 100);

        // 核心：超过80%且未上报过，则上报记录并奖励积分
        if (stat.play_ratio >= 80 && !stat.recorded) {
            stat.recorded = true; // 锁定，一个视频只记一次

            try {
                await axios.post('/video/add_record', {
                    video_id: runRelatedItem.value.id,
                    url,
                    duration: stat.duration,
                    play_ratio: stat.play_ratio.toFixed(2),
                    card_number: globalStore.memberInfo.card_number,
                    start_time: moment(stat.start_time).format('YYYY-MM-DD HH:mm:ss'),
                    end_time: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
                    total_time: playerInstance.duration.toFixed(0)
                }, { toast: 0 });
            } catch (e) {
                stat.recorded = false; // 失败允许重试
            }
        }
    }
};

/**
 * 核心逻辑：汇总本次训练的所有累计时长
 * 包含已结束的视频和当前正在播的视频增量
 */
const handleOpenShare = () => {
    let totalSec = 0;
    
    // 1. 汇总所有 videoStatistics 中的累计时长
    videoStatistics.value.forEach(v => {
        totalSec += v.duration;
    });

    // 2. 特别处理：当前正在播放的视频产生的尚未计入 v.duration 的增量
    const currentStat = videoStatistics.value.get(runRelatedItem.value.url);
    if (currentStat && isPlaying.value) {
        const currentDiff = moment().diff(moment(currentStat.start_time), 'seconds');
        if (currentDiff > 0) totalSec += currentDiff;
    }

    playtimeCompleted.value = `${Math.floor(totalSec / 60)}分${totalSec % 60}秒`;
    showShare.value = true;
};

const handleImageURLUpdate = (url: string) => { };

onMounted(async () => {
    await initPage();
});

onUnmounted(() => {
    if (canplayHandler && playerInstance) {
        playerInstance.off('canplay', canplayHandler);
    }
    if (playerInstance) playerInstance.destroy();
    if (countdownInterval) clearInterval(countdownInterval);
    if (runRelatedItem.value.url) recordVideoEnd(runRelatedItem.value.url);
});
</script>

<style scoped>
.font-sans {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.animate-wave {
    animation: wave 0.8s infinite ease-in-out;
}

@keyframes wave {

    0%,
    100% {
        height: 4px;
    }

    50% {
        height: 12px;
    }
}

.animate-fadein {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.scalein {
    animation: scalein 0.3s ease-out;
}

@keyframes scalein {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

/* 强制覆盖富文本中的不换行样式 */
:deep(.text-sm.text-700.line-height-4 span) {
    white-space: normal !important;
    text-wrap: wrap !important;
}

:deep(.text-sm.text-700.line-height-4 p) {
    margin-bottom: 8px;
}

:deep(.text-sm.text-700.line-height-4 ul) {
    padding-left: 20px;
    margin: 10px 0;
}
</style>
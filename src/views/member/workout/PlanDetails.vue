<template>
    <div class="h-full">
        <div v-if="choseAdditional.related_model == 'Video'" class="pb-6">
            <div>
                <el-affix v-loading="videoLoading" element-loading-text="视频加载中，请稍后..." :offset="0">
                    <div class="bg-white">
                        <div v-show="isPlaying" class="video-container" :style="{ height: playerHeight + 'px' }">
                            <video ref="videoPlayer" class="plyr" webkit-playsinline="true" playsinline="true" muted controls :poster="choseAdditional.cover"
                                :style="{ height: playerHeight + 'px', opacity: playerVisible ? 1 : 0 }"></video>
                        </div>
                        <van-image v-if="!isPlaying" :src="choseAdditional.cover" width="100%"
                            :style="{ height: playerHeight + 'px' , display:'block'}">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <div class="p-3 bg-white">
                            <div class="text-md font-bold">{{ runRelatedItem.title || choseAdditional.title }}</div>
                            <div class="flex justify-content-between align-items-center mt-2 text-xs">
                                <div class="ellipsis ellipsis-line-1 overflow-hidden" v-html="runRelatedItem.description || choseAdditional.description"></div>
                                <div class="text-blue-400 text-right" style="min-width: 20%;" @click="readMore">阅读更多</div>
                            </div>
                        </div>
                        <div v-if="isPlaying" class="bg-blue-50 m-3 p-3 border-round-xl">
                            <div class="flex justify-content-between align-items-center">
                                <div v-if="countdown != 0" class="">
                                    <div class="text-xs text-500">休息一下，进行下一个动作</div>
                                    <div class="text-2xl text-orange-500 font-bold">{{ countdown }}</div>
                                </div>
                                <div v-else class="">
                                    <div class="text-xs text-500">进行中</div>
                                    <div class="text-2xl text-600 font-bold">{{ formattedTime }}</div>
                                </div>
                                <div><el-switch v-model="autoPlay" inline-prompt active-text="自动连播" inactive-text="点击播放" />
                                </div>
                            </div>
                        </div>
                    </div>
                </el-affix>
            </div>
            <div>
                <div v-for="(items, index) in choseAdditional.items" :key="index" class="mt-3">
                    <div class="m-3 pl-1 line-height-1 border-left-3 border-purple-500 font-bold text-sm">{{ items.name
                        }}</div>
                    <div v-for="(item, i) in items.related_data" :key="i"
                        @click="runRelatedItem.url != item.url ? runRelatedItem = item : ''; playVideo(item.url)" class=""
                        :class="{ 'bg-dblue-50': runRelatedItem.url == item.url }">
                        <div class="px-3 py-3"
                            :class="{ 'border-dblue-100': runRelatedItem.url == item.url }">
                            <div class="flex justify-content-between gap-3">
                                <div class="">
                                    <el-image style="width: 80px;" :src="globalStore.uploadsPath + item.cover"
                                        fit="cover" class="border-round-md border-1 border-bluegray-100" />
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-bold flex align-items-center gap-1">
                                        <img v-if="runRelatedItem.url == item.url" src="@@/images/audio-8777_128.gif"
                                            height="14px">
                                        <div class=" ellipsis ellipsis-line-1">{{ item.title }}</div>
                                    </div>
                                    <div class="flex justify-content-between align-items-center text-xs mt-1">
                                        <div class="text-dblue-400">
                                            {{ /[:]/g.test(item.spec) ? item.spec : item.spec + '次'}}
                                        </div>
                                        <div>
                                            <div v-if="Array.from(videoStatistics.values()).filter(data => data.url === item.url)[0]?.play_ratio>=60" class="flex align-items-center text-orange-300">
                                                <svg class="icon mr-1" aria-hidden="true" style="width: 18px;">
                                                    <use xlink:href="#icon-renzheng1"></use>
                                                </svg>
                                                已奖励10积分
                                            </div>
                                            <div v-else class="flex align-items-center text-400">
                                                <svg class="icon mr-1" aria-hidden="true" style="width: 18px;">
                                                    <use xlink:href="#icon-shipin1"></use>
                                                </svg>
                                                +10积分
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <!-- <van-divider class="m-0 border-gray-500"/> -->
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <van-popup v-model:show="showDescription" position="bottom" :closeable="true"
        :style="{ padding: '15px', height: '80%' }">
        <div class="text-sm">
            <div class="mt-1 font-bold text-lg">训练指引</div>
            <div class="p-3">
                <div class="mt-3" v-html="runRelatedItem.description || choseAdditional.description"></div>
            </div>
        </div>
    </van-popup>
    <!-- 分享 -->
    <van-overlay :show="showShare" z-index="999">
        <div class="flex justify-content-center align-items-center h-full">
            <div class="w-8">
                <AutoImageGenerator 
                :width="1200" 
                :height="1599" 
                :baseImage="shareBackimage" 
                :smallImages="[
                    { url: globalStore.memberInfo.avatar, x: 112, y: 500, width: 100, height: 100 }
                ]" 
                :texts="[
                    { content: globalStore.memberInfo.nickname, x: 112, y: 632, fontSize: 26, font: 'ZeoFont2', color: '#26343d', bold: true },
                    { content: sumCollectionRecordDays+'天', x: 112, y: 730, fontSize: 36, font: 'ZeoFont2', color: '#df3636', bold: true },
                    { content: choseAdditional.title, x: 112, y: 780, fontSize: 26, font: 'ZeoFont3', color: '#26343d' },
                    { content: playtimeCompleted, x: 290, y: 1203, fontSize: 42, font: 'ZeoFont3', color: '#26343d', bold: true },
                    { content: globalStore.branchConfig.name+'产后康复科', x: 105, y: 1457, fontSize: 26, font: 'ZeoFont3', color: '#26343d', bold: true },
                    { content: '咨询电话：'+globalStore.branchConfig.telphone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3'), x: 105, y: 1490, fontSize: 20, font: 'ZeoFont3', color: '#26343d' }
                ]"
                @update:imageURL="handleImageURLUpdate"></AutoImageGenerator>
                <div class="mt-3 p-3 bg-white border-round-xl">
                    <div class="font-bold text-center text-lg text-teal-600">分享打卡记录</div>
                    <div class="text-xs text-600 mt-1">
                        恭喜您完成今日运动康复打卡，请长按上方图片保存到手机并分享到朋友圈，您的每一次分享都是对我们莫大的支持！
                    </div>

                    <div class="text-right">
                        <el-button type="default" size="small" @click="showShare = false; isShared = true;">关闭</el-button>
                    </div>
                </div>
            </div>
        </div>
    </van-overlay>

    <!-- 播放倒计时语音 -->
    <audio ref="countdownAudio" src="/audio/countdown-audio.ogg" />
    <!-- 播放结束语音 -->
    <audio ref="endAudio" src="/audio/end-audio.ogg"/>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import axios from '@/utils/axios'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { useGlobalStore } from '@/store/global';
const globalStore = useGlobalStore();

// import wechatJs from "@/utils/wechatJs";
// import WeChatAuth from "@/utils/wechatAuth";
// const wechat = new wechatJs();
// const weChatAuth = new WeChatAuth(window.location.href, globalStore.replace);

import AutoImageGenerator from '@/components/image/AutoImageGenerator.vue';
import shareBackimage from '@@/images/ydkf_dk_bg.webp';

import moment from 'moment';

import { ElMessage } from 'element-plus'
import { TextEllipsis as vanTextEllipsis, Popup as vanPopup, Image as VanImage, Loading as vanLoading, Divider as vanDivider, Overlay as vanOverlay } from 'vant'


import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
const videoPlayer = ref<HTMLVideoElement | null>(null);
const player = ref<Plyr | null>(null);
const pageWidth = ref(window.innerWidth); // 页面宽度
const playerHeight = ref(pageWidth.value * 0.5625); // 播放器高度 (16:9)
const playerVisible = ref(false); // 控制播放器透明度
// 当前播放的视频索引
const currentVideoUrl = ref<number | null>(null);
const playList = ref([])
const countdown = ref(0); // 用于倒计时
let countdownInterval = null; // 定时器引用
const currentTime = ref(0); // 当前播放时间
const autoPlay = ref(true); // 是否自动播放下一集
const isPlaying = ref(false) // 是否为播放状态
const textDescription = ref(false)

const videoLoading = ref(false)
const countdownAudio = ref(null);
const endAudio = ref(null);


const additionalLists = ref([])
const choseAdditional = ref([])
const runRelatedItem = ref([])
const showDescription = ref(false)

const videoStatistics = ref(new Map()); // 记录每个视频的播放数据
const playrateCompleted = ref(false) // 是否已完成要求的60%播放率
const playtimeCompleted = ref(0) // 总播放时间
const playContinuous = ref(0) // 累计多少天播放
const sumCollectionRecordDays = ref(1) // 统计合计累计播放了多少天

const isShared = ref(false) // 是否已分享过
const showShare = ref(false) // 显示分享窗口
const shareImageURL = ref(''); // 父组件中存储 imageURL 的变量

// 更新父组件中的 imageURL
const handleImageURLUpdate = (url) => {
    shareImageURL.value = url;
};

// 检测是否为 iOS 设备
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// 切换视频并播放
const playVideo = async (src: string) => {
    // 停止统计当前视频
    recordVideoEnd(currentVideoUrl.value);

    currentVideoUrl.value = src;

    if (videoPlayer.value && player.value) {
        playerVisible.value = false; // 将播放器设为透明
        

        // 开始记录新视频的播放
        recordVideoStart(src);

        // 如果有旧的 HLS 实例，销毁它
        if (window.hlsInstance) {
            window.hlsInstance.destroy();
        }

        if (Hls.isSupported() && /\.m3u8$/.test(src)) {
            const hls = new Hls();
            window.hlsInstance = hls; // 存储当前 HLS 实例

            // 加载源并附加到视频播放器
            hls.loadSource(src);
            hls.attachMedia(videoPlayer.value);

            // 播放器加载完成后开始播放
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.value?.play();
            });

            // 错误处理
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', event, data);
            });
        } else {
            // 对于原生支持的格式
            videoPlayer.value.src = src;

            // 等待视频加载完成
            await new Promise((resolve) => {
                videoPlayer.value.onloadeddata = () => {
                    resolve(true);
                };
            });

            // 播放视频并使播放器可见
            nextTick(() => {
                player.value?.play();
                playerVisible.value = true; // 视频播放后显示播放器
            });
        }

        player.value.volume = 1;
    }

    exportStatistics();
};

// 播放下一个视频
const playNextVideo = () => {
    if (currentVideoUrl.value !== null && autoPlay.value === true) {
        const index = playList.value.findIndex(url => url === currentVideoUrl.value);
        if (index !== -1) {
            const nextIndex = index + 1;

            // 检查下一个索引是否在数组范围内
            if (nextIndex < playList.value.length) {
                // 播放倒计时语音
                countdownAudio.value.play().catch((error) => {
                    console.error('倒计时语音播放失败: ', error);
                });

                // 设置倒计时为5秒
                countdown.value = 5;
                // 显示倒计时，并在倒计时结束后播放下一个视频
                countdownInterval = setInterval(() => {
                    if (countdown.value > 1) {
                        countdown.value -= 1;
                    } else {
                        countdown.value = 0;
                        clearInterval(countdownInterval);
                        playVideo(playList.value[nextIndex]);
                    }
                }, 1000);
            } else {
                // 自动播放完最后一个视频
                // 播放完最后一个视频时的语音
                // console.log(endAudio.value)
                endAudio.value.play().catch((error) => {
                    console.error('Audio playback failed: ', error);
                });

                player.value.stop();
                runRelatedItem.value = [];
                clearInterval(countdownInterval);
                countdown.value = 0;
                currentVideoUrl.value = null;
            }
        } else {
            console.log('未找到匹配的 URL');
        }
    } else {
        clearInterval(countdownInterval);
    }
};

// 格式化时间（秒转为分钟:秒）
const formattedTime = computed(() => {
    const minutes = Math.floor(currentTime.value / 60);
    const seconds = Math.floor(currentTime.value % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// 计算播放器宽度和高度
const updatePlayerDimensions = () => {
    pageWidth.value = window.innerWidth;
    playerHeight.value = pageWidth.value * 0.5625;
};

const readMore = () => {
    showDescription.value = true
    //textDescription.value.toggle()
}

// 清除播放器
watch(currentVideoUrl, (src) => {
    if (src === null && player.value) {
        player.value.stop();
        isPlaying.value = false;
    } else {
        additionalLists.value.forEach((additional) => {
            additional.items.forEach((item) => {
                item.related_data.forEach(data => {
                    if (data.url === currentVideoUrl.value) {
                        runRelatedItem.value = data;
                    }
                })
            })
        })
    }
});


watch(() => runRelatedItem.value, (nval, oval) => {
    if (nval) {

    }
}, { immediate: true })

watch(() => choseAdditional.value, (nval, oval) => {
    choseAdditional.value.items.forEach((item) => {
        item.related_data.forEach((data, index) => {
            data.url !== undefined ? playList.value.push(data.url) : ''
        })
    })
})


const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
        // 进入全屏，设置横屏样式
        videoPlayer.value.style.width = '100vw';
        videoPlayer.value.style.height = '100vh';
        videoPlayer.value.style.objectFit = 'cover'; // 确保视频填充屏幕
    } else {
        // 退出全屏，恢复默认样式
        videoPlayer.value.style.width = '';
        videoPlayer.value.style.height = '';
        videoPlayer.value.style.objectFit = '';
    }
};

// 触发播放函数
const triggerPlay = () => {
    if (player.value) {
        player.value.play().catch((err) => {
            console.error('播放失败:', err);
        });
    }
};

// 开始记录视频播放
const recordVideoStart = (videoUrl: string | null) => {
    if (!videoUrl || !videoPlayer.value) return;

    const now = new Date();
    if (!videoStatistics.value.has(videoUrl)) {
        // 初始化视频统计对象
        videoStatistics.value.set(videoUrl, {
            start_time: now,
            end_time: null,
            duration: 0, // 累计播放时长（秒）
            total_time: 0, // 视频总时长（秒）
            play_ratio: 0, // 播放比率
        });
    } else {
        const videoStat = videoStatistics.value.get(videoUrl);
        if (videoStat) {
            // 如果之前有暂停记录，更新为新开始时间
            videoStat.start_time = now;
        }
    }
};

// 结束单个视频的记录
const recordVideoEnd = async (videoUrl: string | null) => {
    if (!videoUrl || !videoPlayer.value) return;

    const now = new Date();
    if (videoStatistics.value.has(videoUrl)) {
        const videoStat = videoStatistics.value.get(videoUrl);
        if (videoStat && videoStat.start_time) {
            // 计算本次播放的时长
            videoStat.duration = moment(new Date()).diff(moment(videoStat.start_time), 'seconds'); // 累加播放时长

            // 更新结束时间
            videoStat.start_time = moment(videoStat.start_time).format('YYYY-MM-DD h:mm:ss');
            videoStat.end_time = moment(new Date()).format('YYYY-MM-DD h:mm:ss');

            // 更新总时长（仅首次记录）
            videoStat.total_time = videoPlayer.value.duration || videoStat.total_time;

            // 计算播放比率
            if (videoStat.total_time > 0) {
                videoStat.play_ratio = Math.min(
                    ((videoStat.duration / videoStat.total_time) * 100).toFixed(2),
                    100
                );
            }
            choseAdditional.value.items.forEach((item) => {
                videoStat.video_id = item.related_data.filter(data => data.url === videoUrl)[0].id

            })
            
            videoStat.url = videoUrl;
            videoStat.card_number = globalStore.memberInfo.card_number;
            if(videoStat.duration > 3){
                try {
                    const {data} = await axios.post('/video/add_record', videoStat, {toast:0});
                        //ElMessage.success('视频统计已成功上传');
                } catch (error) {
                    console.error('上传统计失败:', error);
                    //ElMessage.error('视频统计上传失败');
                }
            }

        }
    }
};


const exportStatistics = async () => {
    const statistics = Array.from(videoStatistics.value.entries()).map(([url, data]) => ({
        url,
        ...data,
    }));

    /// console.log(11111111111, statistics)

    // try {
    //     await axios.post('/api/video-statistics', { statistics });
    //     ElMessage.success('视频统计已成功上传');
    // } catch (error) {
    //     console.error('上传统计失败:', error);
    //     ElMessage.error('视频统计上传失败');
    // }
};

/**
 * 监听播放统计
 */
watch(videoStatistics.value, (nval, oval)=>{
    const video_number = choseAdditional.value.items.map(subGroup => Array.isArray(subGroup.related_data) ? subGroup.related_data.length : 0)[0];
    let total_ratio = 0;
    playtimeCompleted.value = 0;
    Array.from(nval.entries()).map(([url, data]) => {
        total_ratio += data.play_ratio
        playtimeCompleted.value += data.duration;
    })

    // 使用 moment 将秒数转换为分钟和秒
    const duration = moment.duration(playtimeCompleted.value, 'seconds');
    const minutes = String(Math.floor(duration.asMinutes())).padStart(2, '0'); // 分钟补零
    const secs = String(duration.seconds()).padStart(2, '0'); // 秒补零
    playtimeCompleted.value = `${minutes}分${secs}秒`;

    if(total_ratio/video_number >= 60){
        playrateCompleted.value = true;
    }else{
        playrateCompleted.value = false;
    }
})

/** 
 * 判断并显示分享图片
 */
const isPlayRateCompletedAndShowShare = async ()=>{
    if(playrateCompleted.value && !isShared.value){
        showShare.value = true
    }
}

onMounted(async () => {
    try {
        const additional = await axios.get('/services/member_services_additional', { card_number: globalStore.memberInfo.card_number }, { totast: 0 });
        if (additional.status) {
            additionalLists.value = additional.data;
            if (route.params.i) {
                choseAdditional.value = additionalLists.value[route.params.i];
            }
        }
    } catch (e) {
        ElMessage.error(e);
    }

    try{
        const {data} = await axios.get('/video/sum_record_days', { card_number: globalStore.memberInfo.card_number }, { totast: 0 });
        sumCollectionRecordDays.value = data;
    } catch (e) {
        ElMessage.error(e);
    }

    await nextTick();
    if (videoPlayer.value) {
        updatePlayerDimensions();
        window.addEventListener('resize', updatePlayerDimensions);

        // 初始化 Plyr 播放器
        player.value = new Plyr(videoPlayer.value, {
            controls: ['play', 'progress', 'mute', 'fullscreen'],
            //clickToPlay: false,
            clickToPlay: true, // 确保点击播放有效
            muted: true,       // 静音初始播放
        });
        //player.value.volume = 1;

        videoPlayer.value.addEventListener('timeupdate', () => {
            currentTime.value = videoPlayer.value?.currentTime || 0;
            videoLoading.value = false;
            isPlayRateCompletedAndShowShare()
        });
        // 监听播放暂停
        videoPlayer.value.addEventListener('pause', () => {
            
        });
        // 监听播放结束
        videoPlayer.value.addEventListener('ended', () => {
            //recordVideoEnd(currentVideoUrl.value);
            playNextVideo();
        });

        videoPlayer.value.addEventListener('loadeddata', () => {
            playerVisible.value = true;
            videoLoading.value = true;
        });

        player.value.on('play', () => {
            isPlaying.value = true;
            playerVisible.value = true;
        });

        if ('orientation' in screen && screen.orientation.lock) {
            // 监听播放器全屏事件
            player.value.on('enterfullscreen', async () => {
                try {
                    await screen.orientation.lock('landscape'); // 锁定横屏
                } catch (err) {
                    ElMessage.error('横屏锁定失败');
                }
            });

            // 恢复竖屏模式
            player.value.on('exitfullscreen', async () => {
                try {
                    await screen.orientation.lock('portrait'); // 恢复竖屏
                } catch (err) {
                    ElMessage.error('竖屏锁定失败');
                }
            });
        } else {
            ElMessage.error('屏幕方向锁定不支持');
        }



    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    videoPlayer.value?.addEventListener('click', triggerPlay);

});

// 清除事件监听器
onUnmounted(() => {
    window.removeEventListener('resize', updatePlayerDimensions);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    videoPlayer.value?.removeEventListener('click', triggerPlay);

    recordVideoEnd(currentVideoUrl.value);
});

</script>
<style scoped>
.video-container {
    position: relative;
    width: 100%;
    margin: 0 auto;
}

.plyr {
    width: 100%;
    margin: 0 auto;
    height: 100%;
}

/* 覆盖 Plyr 控件样式 */
:deep(.plyr__controls) {
    opacity: 0.6 !important;
    /* 不透明度 */
    transition: none !important;
    /* 去掉渐变效果 */
}

:deep(.plyr__control) {
    color: #ffffff !important;
    /* 控件图标颜色 */
    background-color: rgb(0, 0, 0, 0) !important;
}

:deep(.plyr--full-ui input[type=range]) {
    color: rgb(189, 52, 243) !important;
}

:deep(video) {
    width: 100%; /* 默认宽度 */
    height: 100%; /* 默认高度 */
    object-fit: contain; /* 默认填充模式 */
}
</style>
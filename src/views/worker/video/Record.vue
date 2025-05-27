<template>
    <div class="h-full">
        <el-affix :offset="0">
            <div class="flex align-items-center px-1 bg-white">
                <div class="flex-1">
                    <van-search v-model="search.keyword" placeholder="请输入搜索关键词" @search="onSearch" />
                </div>
                <div>
                    <el-icon class="mt-1 mr-2 text-700" size="24">
                        <Fold />
                    </el-icon>
                </div>
            </div>
        </el-affix>
        <div v-if="videoLists.length" class="p-0">
            <van-list v-model:loading="loading" :finished="finished" offset="50" finished-text="没有更多了" @load="getLists"
                class="p-3 mt-2 bg-white border-round-lg">
                <div v-for="(item, index) in videoLists" :key="index" class="mb-3" @click="play(item.url)">
                    <div class="flex justify-content-between align-items-top gap-3 bg-white border-round-lg">
                        <div>
                            <img :src="item.cover" width="120px" height="68px" class="border-round-lg" />
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <div class="text-sm text-dblue-900 font-bold ellipsis ellipsis-line-1">
                                {{ item.title }}
                            </div>
                            <div class="text-xs text-dblue-300 mt-1">
                                <div class="ellipsis ellipsis-line-1" v-html="item.description"></div>
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <el-icon class="text-dblue-500">
                                <VideoPlay />
                            </el-icon>
                        </div>
                    </div>
                    <van-divider v-if="index != videoLists.length - 1" />
                </div>
            </van-list>
        </div>
        <div v-else class="text-center py-5 text-gray-500">暂无视频内容</div>

        <van-popup v-model:show="playVideo" position="top" :style="{ height: playerHeight+'px', padding: '0px' }">
            <div>
                <video ref="videoPlayer" class="plyr" playsinline controls
                    :style="{ height: playerHeight + 'px' }"></video>
            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import axios from '@/utils/axios';
import { ElMessage } from 'element-plus';
import { Popup as vanPopup, Divider as vanDivider, Search as vanSearch, List as vanList } from 'vant';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// 视频播放器相关
const videoPlayer = ref<HTMLVideoElement | null>(null);
const player = ref<Plyr | null>(null);
const playVideo = ref(false);
const playUrl = ref('');
const pageWidth = ref(window.innerWidth);
const playerHeight = ref(pageWidth.value * 0.5625);

// 视频列表与加载
const search = ref({ keyword: '', category_id: '', p: 0 });
const videoLists = ref([]);
const loading = ref(false);
const finished = ref(false);

// 获取视频列表
const getLists = async () => {
    try {
        search.value.p += 1;
        const { data } = await axios.get('/video/lists', search.value);
        videoLists.value.push(...data.lists);
        loading.value = false;

        if (videoLists.value.length >= data.total) {
            finished.value = true;
        }
    } catch (error) {
        loading.value = false;
        ElMessage.error('加载视频失败，请稍后重试');
    }
};

// 搜索处理
const onSearch = () => {
    search.value.p = 0;
    videoLists.value = [];
    finished.value = false;
    getLists();
};

// 播放视频
const play = async (url: string) => {
    playUrl.value = url;
    playVideo.value = true;

    // 等待 DOM 渲染
    await nextTick();

    initPlayer();
};

// 初始化播放器
const initPlayer = async () => {
    if (!videoPlayer.value) return;

    // 销毁现有播放器实例
    destroyPlayer();

    // 初始化 Plyr 和 HLS
    const isHls = Hls.isSupported() && playUrl.value.endsWith('.m3u8');

    if (isHls) {
        const hls = new Hls();
        window.hlsInstance = hls; // 存储当前 HLS 实例

        // 加载源并附加到视频播放器
        hls.loadSource(playUrl.value);
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
        videoPlayer.value.src = playUrl.value;
        player.value = new Plyr(videoPlayer.value);

        // 自动播放
        videoPlayer.value.play().catch(() => {
            ElMessage.error('自动播放失败，请手动播放');
        });


        if ('orientation' in screen && screen.orientation.lock) {
            // 监听播放器全屏事件
            player.value.on('enterfullscreen', async () => {
                try {
                    await screen.orientation.lock('landscape'); // 锁定横屏
                } catch (err) {
                    ElMessage.error('横屏锁定失败:');
                }
            });

            // 恢复竖屏模式
            player.value.on('exitfullscreen', async () => {
                try {
                    await screen.orientation.lock('portrait'); // 恢复竖屏
                } catch (err) {
                    ElMessage.error('竖屏锁定失败:');
                }
            });
        } else {
            ElMessage.error('屏幕方向锁定不支持');
        }

    }


};

// 销毁播放器
const destroyPlayer = () => {
    if (window.hlsInstance) {
        window.hlsInstance.destroy();
    }
    if (player.value) {
        player.value.destroy();
        player.value = null;
    }
    if (videoPlayer.value) {
        videoPlayer.value.src = ''; // 清空视频 URL，确保资源释放
    }
};

// 窗口尺寸更新
const updatePlayerDimensions = () => {
    pageWidth.value = window.innerWidth;
    playerHeight.value = pageWidth.value * 0.5625;
};

// 锁定屏幕方向
const lockOrientation = async (orientation: 'portrait' | 'landscape') => {
    if (screen.orientation && screen.orientation.lock) {
        try {
            await screen.orientation.lock(orientation);
        } catch (error) {
            console.warn('屏幕方向锁定失败:', error);
        }
    } else {
        console.warn('当前设备不支持屏幕方向锁定');
    }
};

// 监听 popup 关闭
watch(playVideo, (newVal) => {
    if (!newVal) {
        destroyPlayer();
    }
});

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


// 组件挂载与卸载
onMounted(() => {
    updatePlayerDimensions();
    window.addEventListener('resize', updatePlayerDimensions);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    getLists();
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePlayerDimensions);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    destroyPlayer();
});
</script>

<template>
    <el-container>
        <!-- 顶部导航 -->
        <el-header>
            <h1>社区互动交流</h1>
        </el-header>

        <!-- 主内容区域 -->
        <el-main>
            <!-- 滚动加载 -->
            <el-infinite-scroll @infinite="loadMore" :disabled="loading" :distance="10">
                <el-card v-for="message in messages" :key="message.id" class="message-card">
                    <div class="user-info">
                        <el-avatar :src="message.avatar"></el-avatar>
                        <span class="user-name">{{ message.username }}</span>
                    </div>
                    <div class="message-content">
                        <p>{{ message.content }}</p>
                        <!-- 展示图片 -->
                        <el-image v-for="img in message.images" :src="img" :key="img" class="message-image"></el-image>
                    </div>
                </el-card>
            </el-infinite-scroll>
        </el-main>

        <!-- 发表按钮 -->
        <el-footer class="footer">
            <el-button type="primary" @click="dialogVisible = true">发表信息</el-button>
        </el-footer>

        <!-- 发表信息弹出窗口 -->
        <el-dialog title="发表新信息" v-model:visible="dialogVisible">
            <el-form :model="newMessage">
                <el-form-item label="文字内容">
                    <el-input v-model="newMessage.content" type="textarea" placeholder="写点什么吧..."></el-input>
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload action="#" list-type="picture-card" :on-preview="handlePreview" :on-remove="handleRemove"
                        v-model:file-list="newMessage.images">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitMessage">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 消息列表
const messages = ref([
    { id: 1, username: '张三', avatar: '/avatar1.jpg', content: '今天很开心！', images: ['/image1.jpg'] },
    { id: 2, username: '李四', avatar: '/avatar2.jpg', content: '分享一张美图', images: ['/image2.jpg'] },
]);

// 新消息
const newMessage = reactive({
    content: '',
    images: [] as any[]
});

// 控制弹窗
const dialogVisible = ref(false);

// 加载状态
const loading = ref(false);

// 加载更多消息
const loadMore = () => {
    if (loading.value) return;
    loading.value = true;
    setTimeout(() => {
        messages.value.push(
            { id: messages.value.length + 1, username: '王五', avatar: '/avatar3.jpg', content: '这是新加载的内容！', images: ['/image3.jpg'] },
        );
        loading.value = false;
    }, 1000);
};

// 提交新信息
const submitMessage = () => {
    if (!newMessage.content) {
        ElMessage.error('请输入文字内容');
        return;
    }
    messages.value.unshift({
        id: messages.value.length + 1,
        username: '当前用户',
        avatar: '/my-avatar.jpg',
        content: newMessage.content,
        images: newMessage.images.map((file: any) => file.url || file),
    });
    newMessage.content = '';
    newMessage.images = [];
    dialogVisible.value = false;
    ElMessage.success('发表成功');
};

// 处理图片预览
const handlePreview = (file: any) => {
    console.log('预览图片', file);
};

// 处理图片移除
const handleRemove = (file: any) => {
    console.log('移除图片', file);
};
</script>

<style scoped>
.message-card {
    margin-bottom: 20px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-info .el-avatar {
    margin-right: 10px;
}

.message-content p {
    margin-top: 10px;
}

.message-image {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-top: 10px;
}

.footer {
    text-align: center;
}

.el-upload .el-upload__input {
    display: none;
}
</style>
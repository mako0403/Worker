<template>
    <div class="h-full" style="background-color: #ffffff;">
        <RouterView />
    </div>
    <!-- <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <HelloWorld msg="You did it!" />

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView /> -->


</template>

<script setup lang="ts">
import { onMounted, ref, reactive, inject } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
const route = useRoute();
const router = useRouter();

// 注入 main.js 中提供的全局 isFocused 变量
const isFocused = inject('isFocused');

onMounted(()=>{
    //console.log(23424234234, route.query)
})


</script>

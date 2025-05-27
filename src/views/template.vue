<template>
    <div class="h-full">
        template
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeMount, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import axios from '@/utils/axios'


onBeforeMount(async () => {

})


let choseSheet = (item: any) => {
    console.log(item);

}

</script>

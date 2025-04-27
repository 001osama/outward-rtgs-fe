<script setup>
import {computed} from 'vue';
import { useRoute } from 'vue-router';
import {useHeaderStore} from '@/stores/index.js';

const $route = useRoute();


const headerStore = useHeaderStore();

const currentComponentTitle = computed(() => {

  if($route?.name === 'SBPOutwardTransfer' && headerStore?.headerTitle !== '')
    return headerStore.headerTitle;
  else
  if($route?.meta?.title)
    return $route.meta.title;
  else
    return 'Main Menu';
})
</script>
<template>
    <div class="header">
        <div class="text-bold-1" style="min-width: 50%;">{{currentComponentTitle}}</div>
        <div class="text-bold-1">ALHABIB VERSION 2.45.0 (TeReSol)</div>
        <div><button class="close-button">x</button></div>
    </div>
</template>
<style scoped>
.close-button{
  padding: 0px 6px;
  border: none;
  background: transparent;
  border:none;
  outline:none;
}

.close-button:hover{
  background:var(--bg-danger);
}

.close-button:active{
  background:var(--bg-danger) !important;
  border:none !important;

}

.header{
    display: flex;
    justify-content: space-between;
}

</style>

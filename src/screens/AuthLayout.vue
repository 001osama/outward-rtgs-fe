<script setup>
import MainFooter from '@/components/MainFooter.vue';
import MainHeader from '@/components/MainHeader.vue';
import SideNav from '@/components/SideNav.vue';
// import MainMenuScreen from './MainMenuScreen.vue';
// import RemittanceScreen from './RemittanceScreen.vue';

</script>
<template>
  <div class="common-container">
    <el-container style="height: 100%;">
      <SideNav />
      <el-container style="height: 100%;">
        <el-header>
          <MainHeader />
        </el-header>
        <el-main>
          <RouterView />
          <!-- <MainMenuScreen/> -->
           <!-- <RemittanceScreen /> -->
        </el-main>
        <MainFooter />
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
.common-container{
    height: 100vh;
    background-color: var(--bg-secondary);
}

.el-header {
    --el-header-padding: 15px 10px 5px 10px;
    --el-header-height: auto;
}
.el-main {
    --el-main-padding: 10px;
    background-color: var(--bg-ternary);
}

</style>
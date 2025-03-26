<script setup></script>
<template>
  <el-aside class="side-nav">
    <div class="image-container">
      <img src="../../public/bahl-logo.png" width="55%;"  alt="main-logo">
    </div>
    <ul class="menu-item-container">
      <li class="menu-item is-active">Main Menu</li>
      <li class="menu-item is-disabled">Setup</li>
      <li class="menu-item is-disabled">CRM - Account Opening</li>
      <li class="menu-item is-disabled">CRM Operational Activities</li>
      <li class="menu-item is-disabled">Trade Finance</li>
      <li class="menu-item is-disabled">User Profile Management</li>
      <li class="menu-item is-disabled">Back Office</li>
      <li class="menu-item is-disabled">Special Reports</li>
    </ul>
  </el-aside>
</template>
<style scoped>
.side-nav
{
    width: 18%;
}

.menu-item-container
{
    padding: 0;
}

.menu-item.is-active{
    color: #000 !important;
    background-image: linear-gradient(#a0c8a8 10%, #006363 120%);
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
}

.menu-item.is-disabled {
    opacity: .25;
    cursor: not-allowed;
    background: 0 0 !important;
}


.menu-item
{
    display: flex;
    align-items: center;
    height: 25px;
    font-size: var(--normal-font-size);
    color: var(--text-primary);
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color var(--el-transition-duration), background-color var(--el-transition-duration), color var(--el-transition-duration);
    box-sizing: border-box;
    white-space: nowrap;
}

.image-container
{
    display: flex;
    padding-bottom: 8px;
    justify-content: center;
}
</style>
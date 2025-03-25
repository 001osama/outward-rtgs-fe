<script></script>
<template>
    <div class="common-container">
        <el-container style="height: 100%;;">
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
            <el-container style="height: 100%;">
                <el-header>
                    <div class="header">
                        <div>Main Menu</div>
                        <div>ALHABIB VERSION </div>
                        <div>x</div>
                    </div>
                </el-header>
                <el-main>
                    <h1>ALHABIB BANKING SYSTEM</h1>
                    <div>
                        
                    </div>
                </el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<style scoped>
.common-container{
    height: 100vh;
    padding: 10px 0px;
    background-color: var(--bg-secondary);
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

.el-header {
    --el-header-padding: 0 10px;
    --el-header-height: 20px;
}

.el-footer {
    --el-footer-padding: 0 10px;
    --el-footer-height: 20px;
}

.el-main {
    --el-main-padding: 10px;
}

.header{
    display: flex;
    justify-content: space-between;
}

.side-nav
{
    width: 18%;
}

.el-main {
    background-color: var(--bg-ternary);
}

.image-container
{
    display: flex;
    padding-bottom: 8px;
    justify-content: center;
}
</style>
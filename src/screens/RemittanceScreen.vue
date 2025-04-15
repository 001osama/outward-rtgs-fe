<script setup>
import { useRouter } from 'vue-router';
import showMenu from '@/menuButton';

const router = useRouter();

const signOff = ()=>{
  router.push('/');
}

const mainMenuBtnClicked = () => {
  router.push('/authlayout');
}

</script>
<template>
<el-row>
  <div class="heading-container">
    <h2>ALHABIB BANKING SYSTEM</h2>
    <h3>REMITTANCE</h3>
  </div>
</el-row>
<el-row>
  <el-col :span="5">
    <h4>BANKERS CHEQUE</h4>
    <div class="thin-button-container">
      <button class="tile-button thin" disabled>Request</button>
      <button class="tile-button thin" disabled>Issue</button>
      <button class="tile-button thin" disabled>Print</button>
      <button class="tile-button thin" disabled>Process For Payment</button>
      <button class="tile-button thin" disabled>Caution Payment Request</button>
      <button class="tile-button thin" disabled>Revalidate / Review</button>
      <button class="tile-button thin" disabled>Inquiry</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>PAY ORDER</h4>
    <div class="thin-button-container">
      <button class="tile-button thin" disabled>Issue</button>
      <button class="tile-button thin" disabled>Print</button>
      <button class="tile-button thin" disabled>Process for Payment</button>
      <button class="tile-button thin" disabled>Caution Payment Request</button>
      <button class="tile-button thin" disabled>Cancel</button>
      <button class="tile-button thin" disabled>Revalidate</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>DEMAND DRAFT</h4>
    <div class="thin-button-container">
      <button class="tile-button thin" disabled>Issue</button>
      <button class="tile-button thin" disabled>Print</button>
      <button class="tile-button thin" disabled>Process for Payment</button>
      <button class="tile-button thin" disabled>Caution Payment Request</button>
      <button class="tile-button thin" disabled>Cancel</button>
      <button class="tile-button thin" disabled>Renew</button>
    </div>
  </el-col>
  <el-col :span="2"></el-col>
</el-row>

<el-row>
  <el-col :span="3">
    <div style="
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    padding-bottom: 40px;
    gap: 15px;"
    >

    <div class="menu-wrapper">
      <button @click="showMenu($event)" class="tile-button thin menu-button">General Posting</button>
      <ul class="menu-list">
        <li class="menu-item"><button disabled>Transfer Funds</button></li>
        <li class="menu-item"><button disabled>Cancel Transaction</button></li>
        <li class="menu-item has-nested-menu">
          <button>SBP Outward</button>
          <ul class="menu-list">
            <li class="menu-item"><button @click="router.push('/sbpoutwardtransfer')">Transfer</button></li>
            <li class="menu-item"><button @click="router.push('/sbpoutwardcancel')">Cancel</button></li>
            <li class="menu-item"><button @click="router.push('/sbpoutwardauth')">Authorize</button></li>
          </ul>
        </li>
        <li class="menu-item">
          <button disabled>SBP Inward</button>
        </li>
      </ul>
    </div>
    <button class="tile-button thin" disabled>General Inquiry</button>
    </div>
    </el-col>
  <el-col :span="5"></el-col>
  <el-col :span="5">
    <h4>CALL DEPOSIT RECEIPT</h4>
    <div class="thin-button-container">
      <button class="tile-button thin" disabled>Issue</button>
      <button class="tile-button thin" disabled>Print</button>
      <button class="tile-button thin" disabled>Process for Payment</button>
      <button class="tile-button thin" disabled>Caution Payment Request</button>
      <button class="tile-button thin" disabled>Cancel</button>
      <button class="tile-button thin" disabled>Revalidate</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>INQUIRY</h4>
    <div class="thin-button-container">
      <button class="tile-button thin" disabled>Inflight</button>
      <button class="tile-button thin" disabled>Issued</button>
      <button class="tile-button thin" disabled>Outstanding</button>
      <button class="tile-button thin" disabled>Paid</button>
    </div>
  </el-col>
  <el-col :span="2"></el-col>
</el-row>
<div style="margin-top: 15px;">
  <el-row>
    <el-col :span="2">
      <button class="tile-button bottom" disabled>Profile</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="3">
      <button class="tile-button bottom" disabled>Change Password</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <button class="tile-button bottom">Report</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <button class="tile-button bottom">Batch</button>
    </el-col>
    <el-col :span="3"></el-col>
    <el-col :span="3">
      <button @click="mainMenuBtnClicked" class="tile-button bottom">Main Menu</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <button class="tile-button bottom" disabled>Help</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <button @click="signOff" class="tile-button bottom">Sign Off</button>
    </el-col>
  </el-row>
</div>


</template>
<style scoped>
.thin-button-container > button:not(:last-child)
{
  margin-bottom: 4px;
}

.thin-button-container
{
  margin-top: 6px;
}

.heading-container{
  padding: 0px 0px 15px 45px;
}

</style>

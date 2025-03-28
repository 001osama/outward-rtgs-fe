<script setup>
import { useRouter } from 'vue-router';


const router = useRouter();

const signOff = ()=>{
  router.push('/');
}

const generalPostingClicked = () => {
  router.push('sbpoutwardcancel');
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
      <button class="tile-button thin">Request</button>
      <button class="tile-button thin">Issue</button>
      <button class="tile-button thin">Print</button>
      <button class="tile-button thin">Process For Payment</button>
      <button class="tile-button thin">Caution Payment Request</button>
      <button class="tile-button thin">Revalidate / Review</button>
      <button class="tile-button thin">Inquiry</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>PAY ORDER</h4>
    <div class="thin-button-container">
      <button class="tile-button thin">Issue</button>
      <button class="tile-button thin">Print</button>
      <button class="tile-button thin">Process for Payment</button>
      <button class="tile-button thin">Caution Payment Request</button>
      <button class="tile-button thin">Cancel</button>
      <button class="tile-button thin">Revalidate</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>DEMAND DRAFT</h4>
    <div class="thin-button-container">
      <button class="tile-button thin">Issue</button>
      <button class="tile-button thin">Print</button>
      <button class="tile-button thin">Process for Payment</button>
      <button class="tile-button thin">Caution Payment Request</button>
      <button class="tile-button thin">Cancel</button>
      <button class="tile-button thin">Renew</button>
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
      <button @click="generalPostingClicked" class="tile-button thin">General Posting</button>
      <button class="tile-button thin">General Inquiry</button>
    </div>
    </el-col>
  <el-col :span="5"></el-col>
  <el-col :span="5">
    <h4>CALL DEPOSIT RECEIPT</h4>
    <div class="thin-button-container">
      <button class="tile-button thin">Issue</button>
      <button class="tile-button thin">Print</button>
      <button class="tile-button thin">Process for Payment</button>
      <button class="tile-button thin">Caution Payment Request</button>
      <button class="tile-button thin">Cancel</button>
      <button class="tile-button thin">Revalidate</button>
    </div>
  </el-col>
  <el-col :span="3"></el-col>
  <el-col :span="5">
    <h4>INQUIRY</h4>
    <div class="thin-button-container">
      <button class="tile-button thin">Inflight</button>
      <button class="tile-button thin">Issued</button>
      <button class="tile-button thin">Outstanding</button>
      <button class="tile-button thin">Paid</button>
    </div>
  </el-col>
  <el-col :span="2"></el-col>
</el-row>
<div style="margin-top: 15px;">
  <el-row>
    <el-col :span="2">
      <button class="tile-button bottom">Profile</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="3">
      <button class="tile-button bottom">Change Password</button>
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
      <button class="tile-button bottom">Help</button>
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
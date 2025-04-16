<script setup>
// import axios  from 'axios';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus'
import axios from '@/axiosInstance.js';

const router = useRouter();
let isMessageShown = localStorage.getItem('messageShown');
onMounted(() => {
  if(!isMessageShown)
    ElMessageBox.alert(
    `Sign-on is Successful<br>
    Last Sign-on date is 16/04/2025`,
    'Message',
    {
      confirmButtonClass: 'mb-confirm-button',
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'OK',
      showCancelButton: false,
      showClose: false,
      draggable: true,
      center: true,
      callback: () => {
        localStorage.setItem('messageShown','true');
      }
    })
})


const signOff = async ()=>{
  try {
    const response = await axios.post(`/start`, { transition:'SIGNOFF' });
    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        localStorage.removeItem("token");
        localStorage.removeItem("messageShown");
        router.push('/');
      }
      else
      {
        console.error(data.message);
      }
    }
    else
    {
      console.error(response.message);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const remittance = () =>{
 router.push('remittance');
}

</script>
<template>
  <h1>ALHABIB BANKING SYSTEM</h1>
  <div class="main-menu-button-container">
    <el-row gutter=50>
      <el-col :span="8">
        <button class="tile-button" disabled>Setup</button>
      </el-col>
      <el-col :span="8">
        <el-row>
          <button style="margin-bottom: 20px;" class="tile-button thin" disabled>CRM - Account Opening</button>
          <button class="tile-button thin" disabled>CRM - Operational Activities</button>
        </el-row>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Teller</button>
      </el-col>
    </el-row>
    <el-row gutter=50>
      <el-col :span="8">
        <button class="tile-button" disabled>Trade Finance</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Credit Management</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Term Deposit</button>
      </el-col>
    </el-row>
    <el-row gutter=50>
      <el-col :span="8">
        <button @click="remittance" class="tile-button">Remittance</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Customer Id Management</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Transactional Security</button>
      </el-col>
    </el-row>
    <el-row gutter=50>
      <el-col :span="8">
        <button class="tile-button" disabled>User Profile</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Back Office</button>
      </el-col>
      <el-col :span="8">
        <button class="tile-button" disabled>Portals</button>
      </el-col>
    </el-row>
  </div>
  <el-row>
    <el-col :span="2">
      <button class="tile-button bottom" disabled>Profile</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="3">
      <button class="tile-button bottom" disabled>Change Password</button>
    </el-col>
    <el-col :span="13"></el-col>
    <el-col :span="2">
      <button class="tile-button bottom" disabled>Help</button>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <button @click="signOff" class="tile-button bottom">Sign Off</button>
    </el-col>
  </el-row>
</template>
<style scoped>
.main-menu-button-container {
  padding: 2% 8%;
}

.main-menu-button-container>.el-row:not(:last-child) {
  margin-bottom: 20px;
}

</style>

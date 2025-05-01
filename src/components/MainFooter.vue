<script setup>
import { onMounted, reactive } from 'vue'
import { getToken } from '@/utils/jwtDecoder'
import dayjs from '@/utils/dayjs';

const loggedInUserInfo = reactive({
  branchCode: '1001',
  loginId: 'TEST1',
  loggedInUserDate: new Date(),
  loggedInUserDay: 'Sunday'
})

const dateStr = '02/05/2025'
const parsedDate = dayjs(dateStr, 'DD/MM/YYYY')
const dayName = parsedDate.format('dddd')

console.log(dayName)


onMounted(()=>{
  const userInfo = getToken();
  if(userInfo)
  {
    const parsedDate = dayjs(userInfo.currentLoggedInDate, 'DD/MM/YYYY')
    const dayName = parsedDate.format('dddd')

   loggedInUserInfo.branchCode = userInfo.branchCode;
   loggedInUserInfo.loginId = userInfo.loginId.toUpperCase();
   loggedInUserInfo.loggedInUserDate = userInfo.currentLoggedInDate;
   loggedInUserInfo.loggedInUserDay =  dayName;
  }
})



</script>
<template>
  <el-footer>
    <el-row>
      <el-col :span="6">
        <div class="footer-block">{{loggedInUserInfo.loggedInUserDay}} - {{loggedInUserInfo.loggedInUserDate}}</div>
      </el-col>
      <el-col :span="18">
        <div class="footer-block">{{loggedInUserInfo.branchCode}} - {{loggedInUserInfo.loginId}}</div>
      </el-col>
    </el-row>
  </el-footer>
</template>
<style scoped>
.el-footer {
  --el-footer-padding: 0px 0px 8px 0px;
  --el-footer-height: auto;

}

.footer-block{
  border: 1px inset;
  padding: 1px 0px;
}
</style>

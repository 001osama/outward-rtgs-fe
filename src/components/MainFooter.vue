<script setup>
import { computed, onMounted, reactive } from 'vue'
import { getToken } from '@/utils/jwtDecoder'

const loggedInUserInfo = reactive({
  branchCode: '1001',
  loginId: 'TEST1'
})

onMounted(()=>{
  const userInfo = getToken();
  if(userInfo)
  {
   loggedInUserInfo.branchCode = userInfo.branchCode;
   loggedInUserInfo.loginId = userInfo.loginId.toUpperCase();
  }
})
const formattedDate = computed(() => {
  const date = new Date()

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  const dayName = daysOfWeek[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
  const year = date.getFullYear()

  return `${dayName} - ${day}/${month}/${year}`
})



</script>
<template>
  <el-footer>
    <el-row>
      <el-col :span="6">
        <div class="footer-block">{{formattedDate}}</div>
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

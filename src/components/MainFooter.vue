<script setup>
import { computed } from 'vue'

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
        <div class="footer-block">1001 - TEST1</div>
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

<script setup>

</script>
<template>
  <el-row>
      <el-col :span="8">
        <el-form-item>
          <span>Voucher No.</span>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-input dir="rtl" v-model="voucherInfo.voucherNo" />
      </el-col>
    </el-row>
</template>
<style scoped>

</style>
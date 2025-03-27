<script setup>
import { reactive } from 'vue';

  const voucherInfo = reactive({
    voucherNo:'',
    voucherYear:'2025'
  })

const formAlign = 'left';


</script>
<template>
  <el-form
    :label-position="formAlign"
    label-width="auto"
    :model="voucherInfo"
  >
  <el-row>
    <el-col :span="8">
      <el-input v-model="voucherInfo.voucherNo" />
    </el-col>
    <el-col :span="2"> / </el-col>
    <el-col :span="8">
      <el-input v-model="voucherInfo.voucherYear" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <el-button>OK</el-button>
    </el-col>
    <el-col :span="6">
      <el-button>Cancel</el-button>
    </el-col>
  </el-row>
  </el-form>
</template>
<style></style>
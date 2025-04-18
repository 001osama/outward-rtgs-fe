<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';


const adviseNoList = ref([
  {
    value:'6491929'
  },
  {
    value:'6491930'
  },
]);


const router = useRouter();



const formData = reactive({
  adviseNo:'6491929',
  voucherNo: '82236/2025'
})
</script>
<template>
  <fieldset>
    <el-row style="padding: 3% 0% 1% 0%;">
      <el-col :span="8"></el-col>
      <el-col :span="8">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <span>Advice Nos.</span>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item>
              <el-select v-model="formData.adviseNo" placeholder="Select Advice">
                <el-option v-for="item in adviseNoList" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="justify-content: center; margin-bottom: 5%;">
          <strong>SBP Cheque Outward</strong>
        </el-row>
        <el-row style="justify-content: center; margin-bottom: 4%;">
          Voucher No. {{ formData.voucherNo }}
        </el-row>
        <el-row class="justify-center">
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-button @click="router.push('/')" class="generic-button" type="primary">OK</el-button>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </fieldset>
</template>
<style></style>
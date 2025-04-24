<script setup>
import { reactive } from 'vue';
import axios from '@/axiosInstance.js';
import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import { isNumber } from '@/utils/helpers';

const router = useRouter();


const voucherInfo = reactive({
  voucherNo: '',
  voucherYear: '2025'
})

const insertPadding = () => {
    if(voucherInfo.voucherNo)
    voucherInfo.voucherNo = voucherInfo.voucherNo.padStart(7, '0');
}


const CancelBtnClicked = () => {
  router.push('remittance');
}
const handleSubmit = async () => {
  try {
    const response = await axios.post('/start', {
      transition:'ISVOUCHEREXISTFORCANCELLATION',
      data:{
        voucherNo: voucherInfo.voucherNo,
        voucherYear: voucherInfo.voucherYear
      }
    })

    if(response.status == 200)
    {
      console.log(response.data)
      if(response.data.success)
        router.push({ path: '/sbpoutwardtransfer', query: { mode: 'cancel', voucherNo: voucherInfo.voucherNo, voucherYear: voucherInfo.voucherYear} });
      else
        invokeDefaultDialog('Error', response.data.message);
    }
  }
  catch(ex)
  {
    console.log(ex)
    invokeDefaultDialog('Error', 'Network Error');
  }

}
</script>
<template>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-form :label-position="left" label-width="auto" :model="voucherInfo">
        <el-row>
          <el-col :span="8">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <span>Voucher No.</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item>
                  <el-input dir="rtl" v-model="voucherInfo.voucherNo" @blur="insertPadding" @keydown="isNumber" maxlength="7"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <div style="display: flex; justify-content: center; width: 4%;">/</div>
          <el-col :span="8">
            <el-row>
              <el-col :span="0">
                <el-form-item>
                  <span></span>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-input v-model="voucherInfo.voucherYear" maxlength="4"/>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-button @click="handleSubmit" :disabled="voucherInfo.voucherNo.length < 6" class="generic-button" type="primary">OK</el-button>
          </el-col>
          <el-col :span="14"></el-col>
          <el-col :span="3">
            <el-button @click="CancelBtnClicked" class="generic-button" type="primary">Cancel</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
  </el-row>
</template>
<style></style>
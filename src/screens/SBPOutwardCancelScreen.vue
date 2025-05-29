<script setup>
import { reactive, ref } from 'vue';
import axios from '@/axiosInstance.js';
import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import { isNumber } from '@/utils/helpers';
import { validateYear } from '@/utils/validators';

const router = useRouter();

const today = new Date();
const currentYear = today.getFullYear();

const voucherInfo = reactive({
  voucherNo: '',
  voucherYear: currentYear
})

const cancelFormRef = ref();

const insertPadding = () => {
    if(voucherInfo.voucherNo)
    voucherInfo.voucherNo = voucherInfo.voucherNo.padStart(7, '0');
}


const rules = reactive({
  voucherNo: [
    { required: true, message: 'Field is required', trigger: 'blur' },
  ],
  voucherYear: [
    { required: true, message: 'Feilds is required', trigger: 'blur' },
    { validator: validateYear, trigger: 'blur' },
  ],
})


const CancelBtnClicked = () => {
  router.push('remittance');
}


const handleSubmit = async (formEl) => {
  if (!formEl) {
    console.log("Form was null");
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
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
    } else {
      console.log('error submit!', fields)
    }
  })

}


</script>
<template>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-form
        ref="cancelFormRef"
        :rules="rules"
        :label-position="left"
        label-width="auto"
        :model="voucherInfo">
        <el-row style="margin-bottom: 1%;">
          <el-col :md="10" :lg="8">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <span>Voucher No.</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item prop="voucherNo">
                  <el-input dir="rtl" v-model="voucherInfo.voucherNo" @blur="insertPadding" @keydown="isNumber" maxlength="7"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <div style="display: flex; justify-content: center; width: 4%;">/</div>
          <el-col :md="10" :lg="8">
            <el-row>
              <el-col :span="0">
                <el-form-item>
                  <span></span>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item prop="voucherYear">
                  <el-input @keydown="isNumber" v-model="voucherInfo.voucherYear" maxlength="4"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-button @click="handleSubmit(cancelFormRef)" :disabled="voucherInfo.voucherNo.length < 6 || voucherInfo.voucherYear.length < 4" class="generic-button" type="primary">OK</el-button>
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

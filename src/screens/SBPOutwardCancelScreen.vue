<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


const voucherInfo = reactive({
  voucherNo: '',
  voucherYear: '2025'
})


const CancelBtnClicked = () => {
  router.push('remittance')
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
                  <el-input dir="rtl" v-model="voucherInfo.voucherNo" />
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
                <el-input v-model="voucherInfo.voucherYear" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-button disabled class="generic-button" type="primary">OK</el-button>
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
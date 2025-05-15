<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';


const formData = reactive({
  adviceNo:'0000000',
  voucherNo: '00000/0000',
  transactionNo: '000000',
})


const props = defineProps({
  activityCode: Number,
  transactionNoList:{
    type: Array,
    default: ()=>[]
  },
  adviceNoList: Array,
  voucherNo: String
});


onMounted(()=>{
  console.log('Props of message window is',props);
  if(props.adviceNoList && props.voucherNo)
  {
    formData.adviceNo = props.adviceNoList[0];
    formData.voucherNo = props.voucherNo;
  }
  if(props.transactionNoList)
  {
    formData.transactionNo = props.transactionNoList[0]
  }

});



const router = useRouter();


const acknowledge = () => {
  // localStorage.removeItem('voucher');
  router.push('remittance');
}

</script>
<template>
  <fieldset>
    <el-row style="padding: 3% 0% 1% 0%;">
      <el-col>
        <el-row>
          <el-col :span="5"></el-col>
          <el-col :span="14">
            <el-row v-if="props.transactionNoList.length > 0">
              <el-col :span="5">
                <el-form-item>
                  <span>Transaction Nos.</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="formData.transactionNo" placeholder="Select Transaction">
                    <el-option v-for="item in props.transactionNoList" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="5">
                <el-form-item>
                  <span>Advice Nos.</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="formData.adviceNo" placeholder="Select Advice">
                    <el-option v-for="item in props.adviceNoList" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="5"></el-col>
              <el-col :span="4">
                <el-form-item>
                  <span>Advice Nos.</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item>
                  <el-select v-model="formData.adviceNo" placeholder="Select Advice">
                    <el-option v-for="item in props.adviceNoList" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5"></el-col>
            </el-row>
          </el-col>
          <el-col :span="5"></el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-row style="justify-content: center; margin-bottom: 5%;">
              <strong v-if="props?.activityCode == 100">SBP Cheque Outward</strong>
            </el-row>
            <el-row style="justify-content: center; margin-bottom: 4%;">
              Voucher No. {{ props.voucherNo }} {{ props?.activityCode === 300 ? 'Authorized':'' }}
            </el-row>
            <el-row class="justify-center">
              <el-col :span="8"></el-col>
              <el-col :span="8">
                <el-button @click="acknowledge" class="generic-button" type="primary">OK</el-button>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-col>
    </el-row>
  </fieldset>
</template>
<style></style>

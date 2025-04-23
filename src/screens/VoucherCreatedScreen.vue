<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';


onMounted(()=>{
  let data = localStorage.getItem('voucher');
  data = JSON.parse(data);
  console.log("getting data from local Storage",data);
  let adviceArray = [];
  if(data)
  {
    data.adviceNoList.forEach((u) => {
      adviceArray.push({advice:u});
    })
    adviceNoList.value = adviceArray;

    formData.adviceNo = data.adviceNoList[0];
    formData.voucherNo = data.voucherLaxList[0].voucherNo;

    console.log(data);
    console.log("working");
  }
});

const adviceNoList = ref([]);


const router = useRouter();


const formData = reactive({
  adviceNo:'7070535',
  voucherNo: '82236/2025'
})

const acknowledge = () => {
  localStorage.removeItem('voucher');
  router.push('/');
}
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
              <el-select v-model="formData.adviceNo" placeholder="Select Advice">
                <el-option v-for="item in adviceNoList" :key="item.advice" :label="item.advice" :value="item.advice" />
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
            <el-button @click="acknowledge" class="generic-button" type="primary">OK</el-button>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </fieldset>
</template>
<style></style>
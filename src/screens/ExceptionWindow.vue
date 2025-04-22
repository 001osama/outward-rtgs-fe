<script setup>
import { ref, reactive,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import axios from '@/axiosInstance.js';

const router = useRouter();
const isDialogVisible = ref(false);

const exceptionList = ref([]);

onMounted(async () => {
  try {
    console.log("Hitting api")
    const response = await axios.post(`/start`, { transition:'GETEXCEPTIONLIST' });
    debugger;
    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        exceptionList.value = data.data;
        console.log(data);
      }
    }
    else
    {
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
})




const reasonCodeList = ref([
  {
    label: 'REQUESTED BY CUSTOMER',
    value: '0005'
  }
]);

const voucherList = ref([
  {
    voucherNo: '386144/2025',
    referenceNo: 'A1072',
    accountNo: '1334',
    currencyCode: 'PKR',
    debitAmount: '0.00',
    creditAmount: '9000000.00',
  },
  {
    voucherNo: '386144/2025',
    referenceNo: 'A1073',
    accountNo: '1335',
    currencyCode: 'PKR',
    debitAmount: '9000000.00',
    creditAmount: '0.00',
  },
]);

onMounted(async ()=>{
  try {
    const response = await axios.post('/start', {transition:'GETEXCEPTIONLIST'})
    if(response.status == 200)
    {
      console.log(response.data)
      if(response.data.success)
        exceptionList.value = response.data.data;
      else
        invokeDefaultDialog('Error', response.data.message);
    }
  }
  catch(ex)
  {
    console.log(ex)
    invokeDefaultDialog('Error', 'Network Error');
  }
})


const exceptionForm = reactive({
  reasonCode:'0005',
  reasonDesc:'REQUESTED BY CUSTOMER'
})

const exceptionAcknowledged = async () => {
  try {
    const response = await axios.post(`/start`, { transition:'POSTOUTWARDRTGS' });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        voucherList.value = data.data.voucherLaxList;

        localStorage.setItem("voucher", JSON.stringify(data.data));
        console.log("Success response is received from backend", data.data);
        isDialogVisible.value = true;
      }
    }
    else
    {
      console.log('Error getting success response');
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const exit = () =>{
  router.push('/sbpoutwardtransfer')
}
</script>
<template>
  <div>
    <el-table :data="exceptionList" style="width: 100%" height="300" max-height="300">
      <el-table-column property="exceptionCode" label="Code"  />
      <el-table-column property="exceptionDescription" label="Exception" />
      <el-table-column property="actionRequired" label="Action" />
    </el-table>
  </div>

  <!-- <fieldset style="margin-top: 1%;">
    <el-row>
      <el-col :span="3">
        <el-form-item>
          <span>Reason Code</span>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-select v-model="exceptionForm.reasonCode" placeholder="">
            <el-option v-for="item in reasonCodeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5"></el-col>
      <el-col :span="3">
        <el-form-item>
          <span>Reason Description</span>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-input v-model="exceptionForm.reasonDesc" :autosize=false type="textarea" :rows="2"/>
        </el-form-item>
      </el-col>
    </el-row>
  </fieldset> -->
  <fieldset style="margin-top: 10px;">
    <el-row>
      <el-col :span="4">
        <el-button @click="exceptionAcknowledged" class="generic-button" type="primary">Continue</el-button>
      </el-col>
      <el-col :span="15"></el-col>
      <el-col :span="4">
        <el-button @click="exit" class="generic-button" type="primary">Back</el-button>
      </el-col>
    </el-row>
  </fieldset>
  <el-dialog
    v-model="isDialogVisible"
    :show-close="false"
    title="Voucher"
    width="1000"
    :close-on-click-modal="false"
    >
    <el-table
      :data="voucherList"
      ref="VoucherTableRef"
      highlight-current-row
      style="width: 100%"
      height="350"
      max-height="400"
      @current-change="handleCurrentChange"
      >
      <el-table-column property="voucherNo" label="Vouch No." width="120"/>
      <el-table-column property="referenceNo" label="Ref No" width="100"/>
      <el-table-column property="accountNo" label="Account No." width="220"/>
      <el-table-column property="accountNo" label="A/C Title" width="220"/>
      <el-table-column property="currencyCode" label="CCY" width="100"/>
      <el-table-column property="debitAmount" label="DR" width="150"/>
      <el-table-column property="creditAmount" label="CR" width="150"/>
    </el-table>
    <fieldset style="margin-top: 20px;">
      <el-row>
        <el-col :span="3">
          <el-button @click="router.push('/vouchercreatedscreen')" class="generic-button" type="primary">OK</el-button>
        </el-col>
        <el-col :span="18"></el-col>
        <el-col :span="3">
          <el-button @click="isDialogVisible = false" class="generic-button" type="primary">Print</el-button>
        </el-col>
      </el-row>
    </fieldset>
  </el-dialog>
</template>

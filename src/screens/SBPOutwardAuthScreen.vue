<script setup>
import { useRouter} from 'vue-router';
import { ref, onMounted } from 'vue';
import { invokeDefaultDialog } from '@/utils/dialog';
import axios from '@/axiosInstance.js';

const router = useRouter();

const currentSelectedRow = ref(null);

const ExitBtnClicked = () => {
  router.push('remittance')
}

// const tableData = [
//   {
//     amount: 120.50,
//     currency: 'USD',
//     expCode: 'EXP-101',
//     postedBy: 'John Doe',
//     postedDate: '2023-10-26',
//     voucherNo: 'VCH-001',
//   }
// ]

const tableData = ref([])

onMounted(async ()=>{
  try {
    const response = await axios.post('/start', {transition:'FETCHUNAUTHOUTWARDRTGSLIST'})
    if(response.status == 200)
    {
      console.log(response.data)
      if(response.data.success)
      {
        tableData.value = response.data.data;
      }
      else
        invokeDefaultDialog('Error', response.data.message);
    }
  }
  catch(ex)
  {
    console.log(ex)
    invokeDefaultDialog('Error', 'Network Error');
  }
});

const handleRowClick = (row) => {
  currentSelectedRow.value = row.voucherNo;
  console.log('current Selected Row Value Updated', currentSelectedRow.value);
}

const handleDoubleClick = (row)=>{
  console.log(`Double click event is working`);
  console.log(`row double clicked : ${row.voucherNo}`);
}

const OpenVoucher = () => {
  if(!currentSelectedRow.value)
  {
    invokeDefaultDialog("Message", "Please select a row");
    return;
  }

  const voucherInfoList = currentSelectedRow.value.split('/');
  router.push({ path: '/sbpoutwardtransfer', query: { mode: 'auth', voucherNo: voucherInfoList[0], voucherYear: voucherInfoList[1] } });
  console.log('Sending Voucher Id ',currentSelectedRow.value);
}



</script>
<template>
  <div>
    <el-table :data="tableData" highlight-current-row style="width: 100%"
      height="350"
      max-height="450"
      @row-click="handleRowClick"
      @row-dblclick="handleDoubleClick">
      <el-table-column property="currency" label="Currency" width="150" />
      <el-table-column property="amount" label="Amount" width="200" />
      <el-table-column property="postedBy" label="PostBy" />
      <el-table-column property="postedDate" label="PostDate" />
      <el-table-column property="voucherNo" label="VoucherNo" />
      <el-table-column property="expCode" label="ExpCode" />
    </el-table>

    <el-row style="margin-top: 20px;">
      <el-col :span="2"></el-col>
      <el-col :span="2"><el-button class="generic-button" type="primary" @click="OpenVoucher">OK</el-button></el-col>
      <el-col :span="12"></el-col>
      <el-col :span="2"><el-button class="generic-button" type="primary" @click="ExitBtnClicked">Exit</el-button></el-col>
    </el-row>

    <!-- <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Select second row</el-button>
      <el-button @click="setCurrent()">Clear selection</el-button>
    </div> -->
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus'

const router = useRouter();
const currentSelectedRow = ref(null);

const ExitBtnClicked = () => {
  router.push('remittance')
}


const handleRowClick = (row) => {
  currentSelectedRow.value = row.id;
  console.log('current Selected Row Value Updated', currentSelectedRow.value);
}

const handleDoubleClick = (row, column, event)=>{
  console.log(`Double click event is working`);
  console.log(`Receiving Id is ${row.id}`);
  console.log(`row : ${row}, column: ${column}, event: ${event}`);
}

const OpenVoucher = () => {
  if(!currentSelectedRow.value)
    ElMessageBox.alert(
      `Please select a row`,
      'Message',
      {
        confirmButtonClass: 'mb-confirm-button',
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'OK',
        showCancelButton: false,
        showClose: false,
        draggable: true,
        center: true,
      }
    )

  console.log('Sending Voucher Id',currentSelectedRow.value);
}


const tableData = [
  {
    id: 1,
    Currency: 'USD',
    Amount: 120.50,
    PostBy: 'John Doe',
    PostDate: '2023-10-26',
    VoucherNo: 'VCH-001',
    ExpCode: 'EXP-101',
  },
  {
    id: 2,
    Currency: 'EUR',
    Amount: 85.75,
    PostBy: 'Jane Smith',
    PostDate: '2023-10-25',
    VoucherNo: 'VCH-002',
    ExpCode: 'EXP-102',
  },
  {
    id: 3,
    Currency: 'GBP',
    Amount: 250.00,
    PostBy: 'David Lee',
    PostDate: '2023-10-24',
    VoucherNo: 'VCH-003',
    ExpCode: 'EXP-103',
  },
  {
    id: 4,
    Currency: 'JPY',
    Amount: 5000,
    PostBy: 'Sarah Kim',
    PostDate: '2023-10-23',
    VoucherNo: 'VCH-004',
    ExpCode: 'EXP-104',
  },
  {
    id: 5,
    Currency: 'CAD',
    Amount: 90.20,
    PostBy: 'Michael Brown',
    PostDate: '2023-10-22',
    VoucherNo: 'VCH-005',
    ExpCode: 'EXP-105',
  }
]
</script>
<template>
  <div>
    <el-table :data="tableData" highlight-current-row style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleDoubleClick">
      <el-table-column property="Currency" label="Currency" width="120" />
      <el-table-column property="Amount" label="Amount" width="120" />
      <el-table-column property="PostBy" label="PostBy" />
      <el-table-column property="PostDate" label="PostDate" />
      <el-table-column property="VoucherNo" label="VoucherNo" />
      <el-table-column property="ExpCode" label="ExpCode" />
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
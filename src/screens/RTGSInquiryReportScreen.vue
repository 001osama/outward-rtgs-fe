<script setup>
import { ref } from 'vue';
import { ElDatePicker } from 'element-plus';

const branch = ref('KASUR BRANCH-0038');
const transactionType = ref('102');
const fromDate = ref(new Date('2025-04-03'));
const toDate = ref(new Date('2025-04-03'));
const custAcNo = ref('');
const status = ref('All');

const handleOk = () => {
  // Implement your logic for the "Ok" button
  console.log('Ok button clicked');
  console.log('Branch:', branch.value);
  console.log('Transaction Type:', transactionType.value);
  console.log('From Date:', fromDate.value);
  console.log('To Date:', toDate.value);
  console.log('Cust/Ac No:', custAcNo.value);
  console.log('Status:', status.value);
};

const handleExport = () => {
  // Implement your logic for the "Export(xls)" button
  console.log('Export(xls) button clicked');
};

const handleBack = () => {
  // Implement your logic for the "Back" button
  console.log('Back button clicked');
};

const handleExit = () => {
  // Implement your logic for the "Exit" button
  console.log('Exit button clicked');
};
</script>

<template>
  <el-container style="height: 400px; border: 1px solid #ccc; padding: 20px; background-color: transparent;">
    <el-main>
      <el-form label-width="120px">
        <el-form-item label="Branch">
          <el-select v-model="branch">
            <el-option label="KASUR BRANCH-0038" value="KASUR BRANCH-0038"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Transaction Type">
          <el-radio-group v-model="transactionType">
            <el-radio label="102">102</el-radio>
            <el-radio label="103">103</el-radio>
            <el-radio label="202">202</el-radio>
            <el-radio label="All">All</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="From">
              <el-date-picker v-model="fromDate" type="date" placeholder="Pick a date" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="To">
              <el-date-picker v-model="toDate" type="date" placeholder="Pick a date" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Cust / Ac No">
          <el-input v-model="custAcNo" placeholder="Enter Customer or Account Number" />
          </el-form-item>

        <el-form-item label="Status">
          <el-select v-model="status">
            <el-option label="All" value="All"></el-option>
            <el-option label="Processed" value="Processed"></el-option>
            <el-option label="Pending" value="Pending"></el-option>
            </el-select>
        </el-form-item>

        <el-row style="margin-top: 20px;">
          <el-col :span="6">
            <el-button type="primary" @click="handleOk">Ok</el-button>
          </el-col>
          <el-col :span="6">
            <el-button @click="handleExport">Export(xls)</el-button>
          </el-col>
          <el-col :span="6" :offset="6" style="text-align: right;">
            <el-button @click="handleBack">Back</el-button>
            <el-button type="danger" @click="handleExit">Exit</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>
h1 {
  margin-bottom: 20px;
  text-align: left;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-radio-group {
  margin-left: 10px;
}
.el-button {
  margin-right: 10px;
}
</style>
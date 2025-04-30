<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElDatePicker } from 'element-plus';
import { useRouter} from 'vue-router';

const router = useRouter();

const branch = ref('KASUR BRANCH-0038');
const transactionType = ref('102');
const fromDate = ref();
const toDate = ref(new Date('2025-04-03'));
const custAcNo = ref('');
const status = ref('All');


onMounted(()=>{


});

const getBranchList = () => {

}

const reportForm = reactive({
  branchCode:'',
  rtgsType:'outward',
  transactionType:'',
  isFromDate:true,
  fromDate:new Date('2025-04-03'),
  isToDate:true,
  toDate:new Date('2025-04-03'),
  customerNo:'',
  accountNo:'',
  status:''
})

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
  console.log('Export(xls) button clicked');
};

const handleBack = () => {
  console.log('Back button clicked');
};

const handleExit = () => {
  console.log('Exit button clicked');
};
</script>

<template>
  <el-row>
    <el-col :span="4"></el-col>
    <el-col :span="16">
      <fieldset>
        <el-row>
          <el-col :span="3">
            <el-form-item>
              <span>Branch</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-select v-model="reportForm.branchCode" disabled placeholder="Select Branch">
                <el-option />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-form-item>
          <el-radio-group v-model="reportForm.rtgsType">
            <el-radio value="outward">RTGS Outward</el-radio>
            <el-radio disabled value="inward">RTGS Inward</el-radio>
            <el-radio disabled value="unprocessed">UNPROCESSED</el-radio>
          </el-radio-group>
        </el-form-item>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Transaction Type</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-radio-group v-model="reportForm.transactionType">
                <el-radio value="102">102</el-radio>
                <el-radio value="103">103</el-radio>
                <el-radio value="202">202</el-radio>
                <el-radio value="All">All</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="2">
            <el-form-item>
              <span style="margin-top: 6px;">From</span>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-checkbox v-model="reportForm.isFromDate"/>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="reportForm.fromDate" type="date" placeholder="Pick a date" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>
          <el-col :span="1">
            <el-form-item>
              <span style="margin-top: 6px;">To</span>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-checkbox v-model="reportForm.isToDate"/>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="reportForm.toDate" type="date" placeholder="Pick a date" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>Customer No.</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="reportForm.customerNo" maxlength="6"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <span>A/C No.</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="reportForm.accountNo" placeholder="Select A/C">
                <el-option />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>Status</span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <el-select v-model="reportForm.accountNo" placeholder="Select Status">
                <el-option />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="4">
            <el-button class="generic-button" type="primary">OK</el-button>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
            <el-button class="generic-button" type="primary">Export(.xls)</el-button>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="4">
            <el-button disabled class="generic-button" type="primary">Back</el-button>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
            <el-button @click="router.push('remittance')" class="generic-button" type="primary">Exit</el-button>
          </el-col>
        </el-row>
      </fieldset>
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>


</template>

<style scoped></style>
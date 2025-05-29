<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElDatePicker } from 'element-plus';
import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import { downloadBase64ReportPdf, downloadBase64ReportExcel, convertToIsoFormat } from '@/utils/helpers';
import axios from '@/axiosInstance';
import { getToken } from '@/utils/jwtDecoder';
import { isNumber, removeValidationRule, addValidationRule } from '@/utils/helpers';
import dayjs from '@/utils/dayjs';

const router = useRouter();

const formRef = ref();
const branchList = ref([]);
const accountNoList = ref([]);
const loggedInDate = ref('');


const reportForm = reactive({
  branchCode: '',
  rtgsType: 'outward',
  transactionType: '',
  isFromDate: true,
  fromDate: '2025-04-03',
  isToDate: true,
  toDate: '2025-04-03',
  customerNo: '',
  accountNo: '',
  status: 'All'
})


const validateFromDate = (rule, value, callback) => {
  // if (!value) {
  //   return callback(new Error('Field is required'))
  // }

  const parsedFromDate = dayjs(value, 'YYYY-MM-DD', true);
  const parsedToDate = dayjs(reportForm.toDate, 'YYYY-MM-DD', true);
  if (parsedToDate.isBefore(parsedFromDate))
    return callback(new Error('From Date should be before To Date.'))

  callback()
}

const validateToDate = (rule, value, callback) => {
  // if (!value) {
  //   return callback(new Error('Field is required'))
  // }

  const parsedToDate = dayjs(value, 'YYYY-MM-DD', true);
  const parsedFromDate = dayjs(reportForm.fromDate, 'YYYY-MM-DD', true);
  if (parsedToDate.isBefore(parsedFromDate))
    return callback(new Error('To Date should be after From Date.'))

  callback()
}

const rules = reactive({
  transactionType: [
    { required: true, message: 'Field is required', trigger: 'change' },
  ],
  fromDate: [
    { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' },
    { validator: validateFromDate, trigger: 'blur' }
  ],
  toDate: [
    { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' },
    { validator: validateToDate, trigger: 'blur' }
  ],
  accountNo: []
})



onMounted(async () => {
  await getBranchList();

  const token = getToken();
  loggedInDate.value = convertToIsoFormat(token.currentLoggedInDate);
  reportForm.fromDate = loggedInDate.value;
  reportForm.toDate = loggedInDate.value;
});



const getBranchList = async () => {
  try {
    const token = getToken();


    if (!token) {
      localStorage.removeItem('token');
      router.push('/');
    }

    const response = await axios.post(`/start`, { transition: 'FETCHBRANCHLIST' });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        branchList.value = data.data;
        console.log("Recieved branch list is")
        console.log(data.data);
        reportForm.branchCode = token.branchCode;
      }
      else
        invokeDefaultDialog("Error", data.message);
    }
    else {
      console.log(response.data);
    }
  }
  catch (error) {
    invokeDefaultDialog("Error", "Network Error");
    console.error(error);
  }
}




// const downloadPdfReport = async () => {
//   try {
//     const response = await axios.post(`/start`, {
//       transition: 'FETCHRTGSPDFREPORT',
//       // data:{}
//     });

//     if (response.status == 200) {
//       const { data } = response;
//       if (data.success) {
//         console.log("Report is being fetch successfully", data.data);
//         downloadBase64ReportPdf(data.data);
//       }
//       else
//         invokeDefaultDialog('Error', data.message);
//     }
//     else {
//       console.log('Error getting success response');
//       console.log(response.data);
//       invokeDefaultDialog('Error', 'Network Error');
//     }
//   }
//   catch (error) {
//     console.error(error);
//     invokeDefaultDialog('Error', 'Network Error');
//   }
// }


const downloadReport = async (formRef, reportFormat) => {
  if (!formRef) return
  formRef.validate(async (valid) => {
    if (!valid)
      return;

    try {
      const token = getToken();
      const response = await axios.post(`/start`, {
        transition: 'FETCHRTGSREPORT',
        data: {reportForm:
          {
            loginId: token.loginId,
            reportFormat,
            ...reportForm
          }
        }
      });

      if (response.status == 200) {
        const { data } = response;
        if (data.success) {
          console.log("Report is being fetch successfully", data.data);

          reportFormat === 'pdf' ? downloadBase64ReportPdf(data.data) : downloadBase64ReportExcel(data.data);
          invokeDefaultDialog('Message', 'File is downloaded successfully. </br> Please check path <b>Downloads.</b>');
        }
        else
          invokeDefaultDialog('Error', data.message);
      }
      else {
        console.log('Error getting success response');
        console.log(response.data);
        invokeDefaultDialog('Error', 'Network Error');
      }
    }
    catch (error) {
      console.error(error);
      invokeDefaultDialog('Error', 'Network Error');
    }
  })

}




const getCustAccounts = async () => {
  if(reportForm?.customerNo?.length > 0 && reportForm?.customerNo?.length < 6)
    reportForm.customerNo = reportForm.customerNo.padStart(6, '0');


  try {
    const response = await axios.post(`/start`, { transition: 'FETCHCUSTACCOUNTS', data: { customerNo: reportForm.customerNo } });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        accountNoList.value = data.data;
        console.log(data);
      }
      else
      {
        accountNoList.value = [];
        reportForm.accountNo = '';
      }
    }
    else {
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const disabledDate = (time) => {
  return time.getTime() > new Date(loggedInDate.value)
}

// const handleSubmit = async (formRef) => {
//   if (!formRef) return
//   formRef.validate(async (valid) => {
//     if (!valid)
//       return;

//     await downloadPdfReport();
//   })
// };

// const handleExport = () => {
//   console.log('Export(xls) button clicked');
// };




const modifyAccountNoValidation = () => {
  if(reportForm.customerNo.length > 0)
    addValidationRule(rules, 'accountNo', { required: true, message: 'Field is required', trigger: 'change' });
  else
    removeValidationRule(rules, 'accountNo', 'required');
}

</script>

<template>
  <el-row>
    <el-col :md="2" :lg="4"></el-col>
    <el-col :md="20" :lg="16">
      <el-form ref="formRef" :rules="rules" :label-position="formAlign" :model="reportForm">
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
                  <el-option v-for="item in branchList" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-form-item prop="transactionType">
                <el-radio-group v-model="reportForm.transactionType">
                  <el-radio value="102">102</el-radio>
                  <el-radio value="103">103</el-radio>
                  <!-- <el-radio value="202">202</el-radio> -->
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
              <el-checkbox v-model="reportForm.isFromDate" />
            </el-col>
            <el-col :span="6">
              <el-form-item prop="fromDate">
                <el-date-picker v-model="reportForm.fromDate" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD"
                  placeholder="Pick a date" :disabled-date="disabledDate" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="4"></el-col>
            <el-col :span="1">
              <el-form-item>
                <span style="margin-top: 6px;">To</span>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-checkbox v-model="reportForm.isToDate" />
            </el-col>
            <el-col :span="6">
              <el-form-item prop="toDate">
                <el-date-picker v-model="reportForm.toDate" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD"
                  placeholder="Pick a date" :disabled-date="disabledDate" style="width: 100%;" />
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
              <el-form-item prop="customerNo">
                <el-input @click.right.prevent @copy.prevent @paste.prevent v-model="reportForm.customerNo" @change="modifyAccountNoValidation" @blur="getCustAccounts" @keydown="isNumber" maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <span style="margin-left: 8%;">A/C No.</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="accountNo">
                <el-select v-model="reportForm.accountNo" placeholder="Select A/C">
                  <el-option v-for="item in accountNoList" :key="item" :label="item" :value="item" />
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
                <el-select v-model="reportForm.status" placeholder="Select Status">
                  <el-option label="All" value="All" />
                  <el-option label="Unauthorized" value="U" />
                  <el-option label="Authorized" value="A" />
                  <el-option label="Cancelled" value="C" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset>
          <el-row>
            <el-col :span="4">
              <el-button @click="downloadReport(formRef, 'pdf')" class="generic-button" type="primary">OK</el-button>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="4">
              <el-button @click="downloadReport(formRef, 'excel')" class="generic-button"
                type="primary">Export(.xls)</el-button>
            </el-col>
            <el-col :span="6"></el-col>
            <el-col :span="4">
              <!-- <el-button disabled class="generic-button" type="primary">Back</el-button> -->
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="4">
              <el-button @click="router.push('remittance')" class="generic-button" type="primary">Exit</el-button>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
    </el-col>
    <el-col :md="2" :lg="4"></el-col>
  </el-row>


</template>

<style scoped></style>

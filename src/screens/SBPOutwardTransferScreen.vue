<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { decodeJwt } from '@/utils/jwtDecoder';
import { invokeDefaultDialog } from '@/utils/dialog'
import axios from '@/axiosInstance.js';
import { isNumber, dateMasking } from '@/utils/helpers';
import ExceptionWindow from '@/components/ExceptionWindow.vue';
import AuthWindow from '@/components/AuthWindow.vue';
import MessageWindow from '@/components/MessageWindow.vue';
import { validateDate } from '@/utils/validators';


const step = ref(1);
const currentActivityCode = ref(100);
const router = useRouter();
const $route = useRoute();


const formRef = ref();

const voucherLaxList = ref([
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

const adviceNoList = ref([]);

const isVoucherDialogVisible = ref(false);

const isFormDisabled = ref(false);
const mode = ref('');
const branchList = ref([]);
const accNoList = ref([]);
const currencyList = ref([]);
const sBPTranTypeList = ref([]);
const purposeOfPaymentList = ref([]);
const chargesLaxList = ref([]);

const selectedChargesLax = ref();
const selectedTransactionLax = ref();


let previousCustomerNo = '';




const rules = reactive({
  chequeDate: [
    { validator: validateDate, trigger: 'blur' },
  ],
})


const submitButtonText = computed(() => {
  if (mode.value === 'auth') return 'Authorize'
  if (mode.value === 'cancel') return 'Cancel'
  return 'OK'
})


const dialogTableVisible = ref(false);
const benefBankList = ref([]);
const benefBankListTableRef = ref(null);


const rtgsForm = reactive({
  branchCode: '',
  currencyCode: '',
  sbpTranTypeCode: '',
  transferTypeCode: '103',
  isCustAcc: false,
  customerNo: '',
  accountNo: '',
  accountType: '',
  iBAN: '',
  accountName: '',
  availableBalance: '',
  beneficiaryAmount: 0,
  paymentMode: "cheque",
  transactionLaxList: [],
  purposeOfPaymentCode: '',
  remarks: '',
  senderToReceiverInformation: '',
  chequeNo: '',
  chequeDate: ''
});


const transactionLaxForm = reactive({
  transactionAmount: '',
  beneficiaryBankName: '',
  beneficiaryBankCode: '',
  beneficiaryAccountName: '',
  beneficiaryIbanOrAccountNo: '',
  beneficiaryAddress: '',
  beneficiaryBranchCode: ''
});

const disabilityController = reactive({
  isSingleBeneficiaryDisabled: false,
  isMultipleBeneficiaryDisabled: false,
  isBankDisabled: false,


})

const resetForm = () => {
  rtgsForm.isCustAcc = false;
  rtgsForm.customerNo = '';
  rtgsForm.accountNo = '';
  rtgsForm.accountType = '';
  rtgsForm.iBAN = '';
  rtgsForm.accountName = '';
  rtgsForm.availableBalance = '';
  rtgsForm.beneficiaryAmount = 0;
  rtgsForm.paymentMode = 'cheque';
  rtgsForm.transactionLaxList = [];
  rtgsForm.purposeOfPaymentCode = '';
  rtgsForm.remarks = '';
  rtgsForm.senderToReceiverInformation = '';
  rtgsForm.chequeNo= '';
  rtgsForm.chequeDate= '';


  transactionLaxForm.transactionAmount = '';
  transactionLaxForm.beneficiaryBankName = '';
  transactionLaxForm.beneficiaryBankCode = '';
  transactionLaxForm.beneficiaryAccountName = '';
  transactionLaxForm.beneficiaryIbanOrAccountNo = '';
  transactionLaxForm.beneficiaryAddress = '';
  transactionLaxForm.beneficiaryBranchCode = '';
}




// const setCurrent = (row) => {
//   if (benefBankListTableRef.value && typeof benefBankListTableRef.value.setCurrentRow === 'function') {
//     benefBankListTableRef.value.setCurrentRow(row);
//   }
// };

const handleCurrentChange = (val) => {
  console.log(`Handle current change is working`, val);
  if (val && val.value) {
    transactionLaxForm.beneficiaryBankName = val.label;
    transactionLaxForm.beneficiaryBankCode = val.value;
  }
  else console.error('Handle current change is not giving values')
};

const handleTransactionLaxSelectedChange = (val) => {
  console.log(`Handle transaction current change is working`, val);
  if (val && val.beneficiaryIbanOrAccountNo) {
    selectedTransactionLax.value = val.beneficiaryIbanOrAccountNo;
  }
  else console.error('Handle current change is not giving values');
};

const handleChargesLaxSelectedChange = (val) => {
  console.log(`Handle transaction current change is working`, val);
  if (val && val.value) {
    selectedChargesLax.value = val.tranCode;
  }
  else console.error('Handle current change is not giving values');
}



watch(() => rtgsForm.sbpTranTypeCode, (sbpTranTypeCode) => {


  switch (sbpTranTypeCode) {
    case '41':
      disabilityController.isSingleBeneficiaryDisabled = false;
      disabilityController.isMultipleBeneficiaryDisabled = false;
      // disabilityController.isBankDisabled = true;
      rtgsForm.transferTypeCode = '103';
      break;

    // case '35':
    // case '47':
    // case '49':
    // disabilityController.isSingleBeneficiaryDisabled = true;
    // disabilityController.isMultipleBeneficiaryDisabled = true;
    // disabilityController.isBankDisabled = false;
    // rtgsForm.transferTypeCode = '202';
    // break;


    case '52':
      disabilityController.isSingleBeneficiaryDisabled = true;
      disabilityController.isMultipleBeneficiaryDisabled = false;
      // disabilityController.isBankDisabled = true;
      rtgsForm.transferTypeCode = '102';
      break;

    default:
      disabilityController.isSingleBeneficiaryDisabled = false;
      disabilityController.isMultipleBeneficiaryDisabled = false;
      // disabilityController.isBankDisabled = false;
      rtgsForm.transferTypeCode = '103';
      break;
  }
  resetForm();

});




onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const parsedToken = decodeJwt(token);
    console.log('parsed token is working', parsedToken);


    if (!parsedToken.loginId) {
      localStorage.removeItem('token');
      router.push('/');
    }

    const response = await axios.post(`/start`, { transition: 'FETCHLOV' });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        branchList.value = data.data.branchList;
        currencyList.value = data.data.currencyList;
        sBPTranTypeList.value = data.data.sBPTranTypeList;
        purposeOfPaymentList.value = data.data.purposeOfPaymentList;
        rtgsForm.branchCode = parsedToken.branchCode;
        rtgsForm.currencyCode = '586';
        rtgsForm.sbpTranTypeCode = '1';

        console.log(data);

        console.log(`we are getting the route ${$route.query}`, $route.query);

        if ($route.query && $route.query.mode && $route.query.voucherNo && $route.query.voucherYear) {
          isFormDisabled.value = true;

          if ($route.query.mode === 'auth')
            currentActivityCode.value = 100;
          if ($route.query.mode === 'cancel')
            currentActivityCode.value = 200;


          mode.value = $route.query.mode;

          await getOutwardRtgs($route.query.voucherNo, $route.query.voucherYear);
        }
      }
    }
    else {
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
})

const getOutwardRtgs = async (voucherNo, voucherYear) => {
  console.log(`route mode is ${$route.query.mode}`);
  console.log(`route voucherNo is ${$route.query.voucherNo}`);
  const response = await axios.post(`/start`, { transition: 'FETCHOUTWARDRTGS', data: { voucherNo: voucherNo, voucherYear: voucherYear } });

  if (response.status == 200) {
    const { data } = response;
    if (data.success) {
      const responseData = data.data;

      rtgsForm.branchCode = responseData.branchCode;
      rtgsForm.currencyCode = responseData.currencyCode;
      rtgsForm.sbpTranTypeCode = responseData.sbpTranTypeCode;
      rtgsForm.customerNo = responseData.customerNo;
      rtgsForm.transferTypeCode = responseData.transferTypeCode;
      rtgsForm.accountNo = responseData.accountNo;
      rtgsForm.paymentMode = responseData.paymentMode;
      rtgsForm.beneficiaryAmount = responseData.totalAmount;
      rtgsForm.purposeOfPaymentCode = responseData.purposeOfPaymentCode;
      rtgsForm.remarks = responseData.remarks;
      rtgsForm.transactionLaxList = responseData.transactionLaxList;
      rtgsForm.chequeDate = responseData.chequeDate;
      rtgsForm.senderToReceiverInformation = responseData.senderToReceiverInformation;
      rtgsForm.chequeNo = responseData.chequeNo;
      await getCustAccounts();
      await getAccountDetails();
      insertCharges();



      console.log("Success response is received from backend", data.data);
      console.log(data);
    }
  }

}

// const isAccNoListEmpty = computed(() => accNoList.value.length === 0);
const isBankTransferType = computed(() => rtgsForm.transferTypeCode === '202');





const handleExitClick = () => {
  if (mode.value === 'auth') {
    router.push('sbpoutwardauth');
  }
  else if (mode.value === 'cancel') {
    router.push('sbpoutwardcancel');
    return
  }
  else router.push('remittance');;
}

const getCustAccounts = async () => {
  if (rtgsForm.customerNo.length < 6 || previousCustomerNo == rtgsForm.customerNo)
    return;


  try {
    const response = await axios.post(`/start`, { transition: 'FETCHCUSTACCOUNTS', data: { customerNo: rtgsForm.customerNo } });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        accNoList.value = data.data;
        console.log(data);
        previousCustomerNo = rtgsForm.customerNo
      }
      else accNoList.value = [];
    }
    else {
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const getAccountDetails = async () => {
  try {
    const response = await axios.post(`/start`, { transition: 'FETCHACCOUNTDETAILS', data: { accountNo: rtgsForm.accountNo } });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        rtgsForm.accountType = data.data.accountType;
        rtgsForm.accountName = data.data.accountName;
        rtgsForm.availableBalance = data.data.availableBalance;
        rtgsForm.iBAN = data.data.iban;
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

const getBenefBankList = async () => {
  try {
    const response = await axios.post(`/start`, { transition: 'FETCHBENEFBANKLIST', });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        benefBankList.value = data.data;
      }
    }
    else {
      console.log(response.data);
    }
  }
  catch (error) {
    benefBankList.value = [];
    console.error(error);
  }
}

const getBenefBankDetails = async () => {
  if (!transactionLaxForm.beneficiaryBankCode.length > 0) {
    invokeDefaultDialog('Error', 'Please Select Beneficiary Bank first')
    return
  }

  if (!transactionLaxForm.beneficiaryIbanOrAccountNo.length > 0) {
    invokeDefaultDialog('Error', 'Please Select Benef Bank first')
    return
  }

  try {
    const response = await axios.post(`/start`,
      {
        transition: 'FETCHBENEFACCDETAILS',
        data: {
          accOrIban: transactionLaxForm.beneficiaryIbanOrAccountNo,
          bankCode: transactionLaxForm.beneficiaryBankCode,
        }
      });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        transactionLaxForm.beneficiaryAccountName = data.data.accountTitle;
        transactionLaxForm.beneficiaryBranchCode = data.data.beneficiaryBranchCd;
      }
      else {
        invokeDefaultDialog('error', response.data.message);
        return
      }
    }
    else {
      console.log('Error getting success response');
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}


const handleSubmitClick = async (formRef) => {

  if (mode?.value === 'auth') {
    step.value = 3;
    return;
  }
  else if (mode?.value === 'cancel') {
    step.value = 2;
    return
  }
  else {
    console.log(formRef);
    if (!formRef) return
    formRef.validate(async (valid) => {
      if (valid) {
        console.log('submit!');
        await submitRTGSForm();
      } else {
        console.log('error submit!')
      }
    })


  }
}

const submitRTGSForm = async () => {
  if (rtgsForm.beneficiaryAmount < 1000000) {
    invokeDefaultDialog('Error', 'Minimum amount is 10 Lac Rupees');
    return;
  }

  currentActivityCode.value = 100;
  step.value = 2;
}

const insertTransactionLax = () => {

  if (transactionLaxForm.transactionAmount !== '' &&
    transactionLaxForm.beneficiaryBankName !== '' &&
    transactionLaxForm.beneficiaryBankCode !== '' &&
    transactionLaxForm.beneficiaryBranchCode !== '' &&
    transactionLaxForm.beneficiaryAccountName !== '' &&
    transactionLaxForm.beneficiaryIbanOrAccountNo !== '')
    {
      const accountAlreadyAdded = rtgsForm.transactionLaxList.some(
        (item) => item.beneficiaryIbanOrAccountNo === transactionLaxForm.beneficiaryIbanOrAccountNo
      );

      if(accountAlreadyAdded)
      {
        invokeDefaultDialog("Message", "Beneficiary Account already added");
        return
      }

      rtgsForm.transactionLaxList.push({ ...transactionLaxForm });
      rtgsForm.beneficiaryAmount = rtgsForm.beneficiaryAmount + parseInt(transactionLaxForm.transactionAmount);

      transactionLaxForm.transactionAmount = '';
      transactionLaxForm.beneficiaryBankName = '';
      transactionLaxForm.beneficiaryBankCode = '';
      transactionLaxForm.beneficiaryAccountName = '';
      transactionLaxForm.beneficiaryIbanOrAccountNo = '';
      transactionLaxForm.beneficiaryAddress = '';
      transactionLaxForm.beneficiaryBranchCode = '';
  }

}

const removeTransactionLax = () => {
  console.log("debugger")
  if (selectedTransactionLax.value !== '') {
    let selectedRowData = rtgsForm.transactionLaxList.find((item) => item.beneficiaryIbanOrAccountNo === selectedTransactionLax.value );
    rtgsForm.beneficiaryAmount = rtgsForm.beneficiaryAmount - parseInt(selectedRowData.transactionAmount);
    rtgsForm.transactionLaxList = rtgsForm.transactionLaxList.filter((item) => item.beneficiaryIbanOrAccountNo !== selectedTransactionLax.value)
    selectedTransactionLax.value = '';
  }
}

const insertCharges = () => {
  if (rtgsForm.transactionLaxList.length == 0) {
    invokeDefaultDialog('Error', 'Please complete the form first');
    return;
  }

  const transactionLaxList = [
    {
      trancd: 81213,
      tranDesc: 'RTGS103 SBP T1',
      glAccount: 'C870116010009',
      amount: '0.00'
    },
    {
      trancd: 81212,
      tranDesc: 'RTGS103 BNK T1',
      glAccount: '1790801510002',
      amount: '0.00'
    },
  ]
  chargesLaxList.value = transactionLaxList;
}

const removeCharges = () => {
  chargesLaxList.value = []
}

const changeCharges = () => {
  if (chargesLaxList.value.length == 0)
    invokeDefaultDialog('Message', 'Please add charges first');
  else
    invokeDefaultDialog('Message', 'Default charges cannot be modified');
}

const onExceptionCancelled = () => {
  step.value = 1;
}

const onExceptionAcknowledge = async () => {
  if (mode?.value == 'cancel') {
    step.value = 3;
    return;
  }

  await createOutwardRTGS();
}

const onAuthSuccess = async () => {
  if (mode?.value == 'auth') {
    await authorizeOutwardRTGS();
    return;
  }
  else if (mode?.value == 'cancel') {
    await cancelOutwardRTGS();
    return;
  }
}

const cancelOutwardRTGS = async () => {
  try {
    const voucherNo = $route.query.voucherNo;
    const voucherYear = $route.query.voucherYear;
    const response = await axios.post(`/start`, {
      transition: 'CANCELOUTWARDRTGS',
      data: {
        voucherNo: voucherNo,
        voucherYear: voucherYear
      }
    });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        invokeDefaultDialog("Message", `Voucher ${voucherNo}/${voucherYear} cancelled successfully`, () => { router.push('/') });
      }
      else
        invokeDefaultDialog("Message", data.message);
    }
    else {
      console.log('Error getting success response');
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}


const authorizeOutwardRTGS = async () => {
  try {
    const voucherNo = $route.query.voucherNo;
    const voucherYear = $route.query.voucherYear;
    const response = await axios.post(`/start`, {
      transition: 'AUTHORIZEOUTWARDRTGS',
      data: {
        voucherNo: voucherNo,
        voucherYear: voucherYear
      }
    });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);
        invokeDefaultDialog("Message", `Voucher ${voucherNo}/${voucherYear} authorized successfully`, () => { router.push('/') });
      }
      else
        invokeDefaultDialog("Message", data.message);
    }
    else {
      console.log('Error getting success response');
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}


const createOutwardRTGS = async () => {
  const token = localStorage.getItem('token');
  const parsedToken = decodeJwt(token);
  console.log('parsed token is working', parsedToken);

  if (!parsedToken.loginId) {
    localStorage.removeItem('token');
    router.push('/');
  }

  const reqObject = {
    loginId: parsedToken.loginId,
    branchCode: rtgsForm.branchCode,
    currencyCode: rtgsForm.currencyCode,
    sbpTranTypeCode: rtgsForm.sbpTranTypeCode,
    transferTypeCode: rtgsForm.transferTypeCode,
    isCustAcc: rtgsForm.isCustAcc,
    customerNo: rtgsForm.customerNo,
    accountNo: rtgsForm.accountNo,
    totalAmount: rtgsForm.beneficiaryAmount,
    paymentMode: rtgsForm.paymentMode,
    transactionLaxList: rtgsForm.transactionLaxList,
    purposeOfPaymentCode: rtgsForm.purposeOfPaymentCode,
    remarks: rtgsForm.remarks,
    senderToReceiverInformation: rtgsForm.senderToReceiverInformation,
    chequeNo: rtgsForm.chequeNo,
    chequeDate: rtgsForm.chequeDate,
    activityCode: 100,
  }

  try {
    const response = await axios.post(`/start`, { transition: 'POSTOUTWARDRTGS', data: { rtgsForm: reqObject } });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);

        voucherLaxList.value = data.data.voucherLaxList;
        adviceNoList.value = data.data.adviceNoList;

        isVoucherDialogVisible.value = true;
      }
      else invokeDefaultDialog("Error",data.message);
    }
    else {
      console.log('Error getting success response');
      console.log(response.data);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const onAuthCancel = () => {
  step.value = 2;
}

const voucherSeen = () => {
  isVoucherDialogVisible.value = false;
  step.value = 4;
}

</script>

<template>
  <template v-if="step === 1">
    <el-form
      ref="formRef"
      :rules="rules"
      :label-position="formAlign"
      :model="rtgsForm"
      label-width="auto">
      <fieldset>
        <fieldset>
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <span>Branch</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item>
                <el-select disabled v-model="rtgsForm.branchCode" placeholder="Select Branch">
                  <el-option v-for="item in branchList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset>
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <span>Currency</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item>
                <el-select disabled v-model="rtgsForm.currencyCode" placeholder="Select Currency">
                  <el-option v-for="item in currencyList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset>
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <span>SBP tran. Type</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item>
                <el-select :disabled="isFormDisabled" v-model="rtgsForm.sbpTranTypeCode"
                  placeholder="Select SBP Tran Type">
                  <el-option v-for="item in sBPTranTypeList" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item>
                <span>Transfer Type</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-radio-group :disabled="isFormDisabled" v-model="rtgsForm.transferTypeCode">
                  <el-radio :disabled="disabilityController.isMultipleBeneficiaryDisabled" value="102">102(Multiple
                    Beneficiary)</el-radio>
                  <el-radio :disabled="disabilityController.isSingleBeneficiaryDisabled" value="103">103(Single
                    Beneficiary)</el-radio>
                  <!-- <el-radio
                  :disabled="disabilityController.isBankDisabled"
                  value="202">202(Bank)</el-radio> -->
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <!-- <el-col :span="5">
              <el-checkbox v-if="isBankTransferType" v-model="rtgsForm.isCustAcc" label="Customer Acc."/>
            </el-col> -->
          </el-row>
        </fieldset>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>Customer No.</span>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-input v-model="rtgsForm.customerNo"
                :disabled="isFormDisabled || (rtgsForm.transferTypeCode === '202' && !rtgsForm.isCustAcc)"
                @blur="getCustAccounts" @keydown="isNumber" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <span>A/C No.</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-select :disabled="isFormDisabled" v-model="rtgsForm.accountNo" @change="getAccountDetails"
                placeholder="Select A/C">
                <el-option v-for="item in accNoList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>A/C Type</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input v-model="rtgsForm.accountType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>IBAN</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input v-model="rtgsForm.iBAN" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>A/C Name</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input v-model="rtgsForm.accountName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>Available Balance</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-input v-model="rtgsForm.availableBalance" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <span>Benef Amount</span>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-input disabled v-model="rtgsForm.beneficiaryAmount" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="3">
            <el-form-item>
              <span>Payment Mode</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-radio-group :disabled="isFormDisabled" v-model="rtgsForm.paymentMode">
                <el-radio value="cheque">Cheque</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="1"></el-col>

          <el-col :span="2">
            <el-form-item>
              <span>Cheque#</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="rtgsForm.chequeNo" @keydown="isNumber" maxlength="6"
                :disabled="isFormDisabled || rtgsForm.isCustAcc" />
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item>
              <span>Cheque Date</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="chequeDate">
              <el-input
                :disabled="isFormDisabled"
                v-model="rtgsForm.chequeDate"
                @keydown="dateMasking"
                placeholder="  /   /  "
                maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Tran. Amount</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-input :disabled="isFormDisabled" v-model="transactionLaxForm.transactionAmount" @keydown="isNumber"
                maxlength="18" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Benef. Bank Name</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input v-model="transactionLaxForm.beneficiaryBankName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2">
            <el-button :disabled="isFormDisabled" class="generic-button" @click="dialogTableVisible = true"
              type="primary">List</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Benef IBAN/AC No.</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input
                :disabled="isFormDisabled"
                v-model="transactionLaxForm.beneficiaryIbanOrAccountNo"
                maxLength="16"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2">
            <el-button :disabled="isFormDisabled" class="generic-button" @click="getBenefBankDetails"
              type="primary">Fetch</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Benef A/C Name</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input v-model="transactionLaxForm.beneficiaryAccountName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <span>Benef. Branch Code</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-input v-model="transactionLaxForm.beneficiaryBranchCode" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span class="optional-field">Beneficiary Address</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input :disabled="isFormDisabled" v-model="transactionLaxForm.beneficiaryAddress" :autosize=false
                type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <div>
        <el-table :data="rtgsForm.transactionLaxList" @current-change="handleTransactionLaxSelectedChange"
          highlight-current-row style="width: 100%" height="120" max-height="250">
          <el-table-column property="transactionAmount" label="Transaction Amount" width="200" />
          <el-table-column property="beneficiaryIbanOrAccountNo" label="Beneficiary IBAN/AC #" width="180" />
          <el-table-column property="beneficiaryAccountName" label="Account Name" />
          <el-table-column property="beneficiaryBankName" label="Beneficiary Bank Name" />
          <el-table-column property="beneficiaryAddress" label="Beneficiary Address" />
        </el-table>
      </div>
      <fieldset>
        <el-row style="margin-bottom: 8px;">
          <el-col :span="17"></el-col>
          <el-col :span="3" style="margin-right: 8px;">
            <el-button class="generic-button" :disabled="isFormDisabled" @click="removeTransactionLax"
              type="primary">Remove</el-button>
          </el-col>
          <el-col :span="3">
            <el-button class="generic-button"
              :disabled="isFormDisabled || (rtgsForm.transferTypeCode === '103' && rtgsForm.transactionLaxList.length > 0)"
              @click="insertTransactionLax" type="primary">Add</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span>Purpose of Payment</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
              <el-select :disabled="isFormDisabled" v-model="rtgsForm.purposeOfPaymentCode"
                placeholder="Select Purpose of Payment">
                <el-option v-for="item in purposeOfPaymentList" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span class="optional-field">Remarks</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
              <el-input :disabled="isFormDisabled" v-model="rtgsForm.remarks" :autosize=false type="textarea"
                :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item>
              <span class="optional-field">Sender To Receiver Information</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
              <el-input :disabled="isFormDisabled" v-model="rtgsForm.senderToReceiverInformation" :autosize=false
                type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <h4>Charges:</h4>
      <el-row>
        <el-col :span="20">
          <el-table :data="chargesLaxList" highlight-current-row @current-change="handleChargesLaxSelectedChange"
            style="width: 100%" height="110" max-height="250">
            <el-table-column property="trancd" label="Trancd" width="150" />
            <el-table-column property="tranDesc" label="Tran Description" width="300" />
            <el-table-column property="glAccount" label="GL Account" width="400" />
            <el-table-column property="amount" label="Amount" />
          </el-table>
        </el-col>
        <el-col :span="4">
          <el-row style="gap: 6px;padding: 0px 6px;">
            <el-col>
              <el-button :disabled="isFormDisabled" class="generic-button" @click="insertCharges" type="primary">Add
                Charges</el-button>
            </el-col>
            <el-col>
              <el-button :disabled="isFormDisabled" class="generic-button" @click="changeCharges" type="primary">Change
                Charges</el-button>
            </el-col>
            <el-col>
              <el-button class="generic-button" :disabled="isFormDisabled || chargesLaxList.length == 0"
                @click="removeCharges" type="primary">Remove Charges</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <fieldset>
        <el-row>
          <el-col :span="3">
            <el-button class="generic-button" @click="handleSubmitClick(formRef)" type="primary">{{ submitButtonText }}</el-button>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="3">
            <el-button :disabled="isFormDisabled" class="generic-button" type="primary">View Signature</el-button>
          </el-col>
          <el-col :span="13"></el-col>
          <el-col :span="3">
            <el-button @click="handleExitClick" class="generic-button" type="primary">Exit</el-button>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
  </template>

  <template v-if="step === 2">
    <ExceptionWindow
      :activityCode="currentActivityCode"
      @acknowledged="onExceptionAcknowledge"
      @cancelled="onExceptionCancelled" />
  </template>

  <template v-if="step === 3">
    <AuthWindow
      @success="onAuthSuccess"
      @cancelled="onAuthCancel" />
  </template>

  <template v-if="step === 4">
    <MessageWindow
      :adviceNoList="adviceNoList"
      :voucherNo="voucherLaxList[0].voucherNo" />
  </template>

  <el-dialog v-model="dialogTableVisible" :show-close="false" title="Select Beneficiary Bank"
    :before-close="(doneFn) => {console.log('before-close'), doneFn() }"
    @open="getBenefBankList" width="1000">
    <el-table :data="benefBankList" ref="benefBankListTableRef" highlight-current-row style="width: 100%"
      @current-change="handleCurrentChange">
      <el-table-column property="label" />
    </el-table>
    <el-row style="margin-top: 20px;">
      <el-col :span="19"></el-col>
      <el-col :span="2">
        <el-button @click="dialogTableVisible = false" class="generic-button" type="primary">Select</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-button @click="dialogTableVisible = false" class="generic-button" type="primary">Cancel</el-button>
      </el-col>
    </el-row>
  </el-dialog>

  <el-dialog v-model="isVoucherDialogVisible" :show-close="false" title="Voucher" width="1000"
    :close-on-click-modal="false">
    <el-table
      :data="voucherLaxList" ref="VoucherTableRef" highlight-current-row style="width: 100%" height="350"
      max-height="400" @current-change="handleCurrentChange">
      <el-table-column property="voucherNo" label="Vouch No." width="120" />
      <el-table-column property="referenceNo" label="Ref No" width="100" />
      <el-table-column property="accountNo" label="Account No." width="220" />
      <el-table-column property="accountNo" label="A/C Title" width="220" />
      <el-table-column property="currencyCode" label="CCY" width="100" />
      <el-table-column property="debitAmount" label="DR" width="150" />
      <el-table-column property="creditAmount" label="CR" width="150" />
    </el-table>
    <fieldset style="margin-top: 20px;">
      <el-row>
        <el-col :span="3">
          <el-button @click="voucherSeen" class="generic-button" type="primary">OK</el-button>
        </el-col>
        <el-col :span="18"></el-col>
        <el-col :span="3">
          <el-button @click="isVoucherDialogVisible=false" class="generic-button" type="primary">Print</el-button>
        </el-col>
      </el-row>
    </fieldset>
  </el-dialog>

</template>

<style scoped>
.el-select:has(.el-select__wrapper.is-disabled) {
  cursor: not-allowed;
}



.el-input__inner:disabled {
  color: var(--text-primary) !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}
</style>

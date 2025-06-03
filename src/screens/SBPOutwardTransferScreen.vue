<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { getToken } from '@/utils/jwtDecoder';
import { invokeDefaultDialog } from '@/utils/dialog'
import axios from '@/axiosInstance.js';
import ExceptionWindow from '@/components/ExceptionWindow.vue';
import AuthWindow from '@/components/AuthWindow.vue';
import SelectListWindow from '@/components/SelectListWindow.vue';
import MessageWindow from '@/components/MessageWindow.vue';
import { validateDate } from '@/utils/validators';
import { useHeaderStore } from '@/stores';
import {
  convertDateFormat,
  parseFormattedAmount,
  formatAmount,
  isNumber,
  handleMultiLineTextboxPaste,
  handleMultiLineTextboxKeyPress,
  isAlphaNumeric,
  convertToIsoFormat,
  downloadBase64ReportPdf}
from '@/utils/helpers';

const headerStore = useHeaderStore();
const step = ref(1);
const currentActivityCode = ref(100);
const router = useRouter();
const $route = useRoute();

const voucherNo = ref('');
const voucherYear = ref('');
const cancellationReason = ref('');

const stepHeaders = {
    1: 'SBP Cheque Outward Lodgement',
    2: 'Exceptions',
    3: 'Authorization',
    4: 'Message',
    5: 'List of Banks'
  };

const changeStep = (stepNo) => {
  const title = stepHeaders[stepNo] || 'SBP Cheque Outward Lodgement';
  step.value=stepNo;
  headerStore.setHeaderTitle(title);
};


const formRef = ref();
const isBenefAccFetchDisabled = ref(false);


const benefBankSearchBox = ref('');
const selectedBenefBank = ref({});

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
const transactionNoList = ref([]);

// dialog visibility
const isSignatureDialogVisible = ref(false);
const isVoucherDialogVisible = ref(false);
const dialogTableVisible = ref(false);



const isFormDisabled = ref(false);
const mode = ref('');
const branchList = ref([]);
const accNoList = ref([]);
const currencyList = ref([]);
const sBPTranTypeList = ref([]);
const purposeOfPaymentList = ref([]);
const chargesLaxList = ref([]);

const selectedChargesLax = ref();
const selectedTransactionLax = ref(null);


let previousCustomerNo = '';


const rules = reactive({
  chequeDate: [
    { validator: validateDate, trigger: 'blur' },
  ],
  chequeNo: [
    { required: true, message:'Field is required', trigger: 'blur'},
    { min: 6, message: 'Please insert complete value', trigger: 'blur' }
  ],
  purposeOfPaymentCode: [
    { required: true, message:'Field is required', trigger: 'change'}
  ]
})


const submitButtonText = computed(() => {
  if (mode.value === 'auth') return 'Authorize'
  if (mode.value === 'cancel') return 'Cancel'
  return 'OK'
})



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
  beneficiaryAmount: '',
  paymentMode: "cheque",
  transactionLaxList: [],
  purposeOfPaymentCode: '',
  remarks: '',
  senderToReceiverInformation: '',
  chequeNo: '',
  chequeDate: '',
  isSignatureSeen: false,
  postedBy:''
});


const transactionLaxForm = reactive({
  id:0,
  transactionAmount: '',
  beneficiaryBankName: '',
  beneficiaryBankCode: '',
  beneficiaryAccountName: '',
  beneficiaryIbanOrAccountNo: '',
  beneficiaryAddress: '',
  beneficiaryBranchCode: '',
  isBeneficiaryTitleFetch: true
});

const disabilityController = reactive({
  isSingleBeneficiaryDisabled: false,
  isMultipleBeneficiaryDisabled: false,
  isBankDisabled: false,
})


const resetForm = () => {
  rtgsForm.isCustAcc = false;
  previousCustomerNo = '';
  rtgsForm.customerNo = '';
  rtgsForm.accountNo = '';
  rtgsForm.accountType = '';
  rtgsForm.iBAN = '';
  rtgsForm.accountName = '';
  rtgsForm.availableBalance = '';
  rtgsForm.beneficiaryAmount = '';
  rtgsForm.paymentMode = 'cheque';
  rtgsForm.transactionLaxList = [];
  rtgsForm.purposeOfPaymentCode = '';
  rtgsForm.remarks = '';
  rtgsForm.senderToReceiverInformation = '';
  rtgsForm.chequeNo= '';
  rtgsForm.chequeDate= '';
  chargesLaxList.value = [];
  accNoList.value = [];

  transactionLaxForm.transactionAmount = '';
  transactionLaxForm.beneficiaryBankName = '';
  transactionLaxForm.beneficiaryBankCode = '';
  transactionLaxForm.beneficiaryAccountName = '';
  transactionLaxForm.beneficiaryIbanOrAccountNo = '';
  transactionLaxForm.beneficiaryAddress = '';
  transactionLaxForm.beneficiaryBranchCode = '';
  transactionLaxForm.isBeneficiaryTitleFetch = true;
}




// const setCurrent = (row) => {
//   if (benefBankListTableRef.value && typeof benefBankListTableRef.value.setCurrentRow === 'function') {
//     benefBankListTableRef.value.setCurrentRow(row);
//   }
// };

const handleSelectedBenefBankChange = (val) => {

  console.log(`Handle current change is working`, val);
  benefBankListTableRef.value?.setCurrentRow(val);
  if (val && val.value) selectedBenefBank.value = val;
};

const selectBenefBank = () =>{
  transactionLaxForm.beneficiaryBankCode = selectedBenefBank.value.value;
  transactionLaxForm.beneficiaryBankName = selectedBenefBank.value.label;
  dialogTableVisible.value = false;
}

const handleTransactionLaxSelectedChange = (val) => {
  console.log(`Handle transaction current change is working`, val);
  if (val && val.id != null) {
    selectedTransactionLax.value = val.id;
  }
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
});






onMounted(async () => {
  try {
    changeStep(1);
    const token = getToken();

    if (!token) {
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
        rtgsForm.branchCode = token.branchCode;
        rtgsForm.currencyCode = '586';
        rtgsForm.sbpTranTypeCode = '1';

        console.log(data);

        console.log(`we are getting the route ${$route.query}`, $route.query);

        if ($route.query && $route.query.mode && $route.query.voucherNo && $route.query.voucherYear) {
          isFormDisabled.value = true;

          if ($route.query.mode === 'auth')
            currentActivityCode.value = 300;
          if ($route.query.mode === 'cancel')
            currentActivityCode.value = 200;


          voucherNo.value = $route.query.voucherNo;
          voucherYear.value = $route.query.voucherYear;

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

  const token = getToken();

  if (!token) {
    localStorage.removeItem('token');
    router.push('/');
  }

  const response = await axios.post(`/start`, { transition: 'FETCHOUTWARDRTGS', data: { voucherNo: voucherNo, voucherYear: voucherYear, branchCode: token.branchCode } });

  if (response.status == 200) {
    const { data } = response;
    if (data.success) {
      const responseData = data.data;

      const formattedDate = convertDateFormat(responseData?.chequeDate);

      if (responseData?.transactionLaxList && Array.isArray(responseData.transactionLaxList)) {
        responseData.transactionLaxList.forEach(item => {
          if (typeof item.transactionAmount === 'string') {
            item.transactionAmount = formatAmount(item.transactionAmount);
          }
        });
      }

      rtgsForm.branchCode = responseData.branchCode;
      rtgsForm.currencyCode = responseData.currencyCode;
      rtgsForm.sbpTranTypeCode = responseData.sbpTranTypeCode;
      rtgsForm.customerNo = responseData.customerNo;
      rtgsForm.transferTypeCode = responseData.transferTypeCode;
      rtgsForm.accountNo = responseData.accountNo;
      rtgsForm.paymentMode = responseData.paymentMode;
      rtgsForm.beneficiaryAmount = formatAmount(responseData.totalAmount);
      rtgsForm.purposeOfPaymentCode = responseData.purposeOfPaymentCode;
      rtgsForm.remarks = responseData.remarks;
      rtgsForm.transactionLaxList = responseData.transactionLaxList;
      rtgsForm.chequeDate = formattedDate;
      rtgsForm.senderToReceiverInformation = responseData.senderToReceiverInformation;
      rtgsForm.chequeNo = responseData.chequeNo;
      rtgsForm.postedBy = responseData.postedBy;
      console.log('Transfer type code', rtgsForm.transferTypeCode);
      await getCustAccounts();
      await getAccountDetails();
      insertCharges();


      console.log("Success response is received from backend", data.data);
      console.log(data);
    }
  }

}

// const isAccNoListEmpty = computed(() => accNoList.value.length === 0);
// const isBankTransferType = computed(() => rtgsForm.transferTypeCode === '202');


const validateChequeStatus = async () => {

  if(!rtgsForm.accountNo || rtgsForm.chequeNo.length < 6)
    return;

  try {
    const response = await axios.post(`/start`, {
      transition: 'FETCHCHEQUESTATUS',
      data: {
        accountNo: rtgsForm.accountNo,
        chequeNo: rtgsForm.chequeNo
      }
    });

    if (response.status == 200) {

      const { data } = response;

      if (data.success) {
        console.log("Success response is received from backend", data.data);
      }
      else
      {
        rtgsForm.chequeNo = '';
        invokeDefaultDialog("Message", data.message);
      }
    }
    else {
      invokeDefaultDialog("Message", "Network Error");
    }
  }
  catch (error) {
    invokeDefaultDialog("Error", "Network Error");
    console.error(error);
  }
}


const handleExitClick = () => {
  console.log("handle exit click")
  let errorMessage;
  if (mode.value === 'auth' || mode.value === 'cancel')
    errorMessage = 'Are you sure you want to exit';
  else
    errorMessage = 'Any changes will be lost. Are you sure you want to exit?';

  ElMessageBox.confirm(errorMessage, 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    showCancelButton: true,
    showClose: false,
    autofocus: false,
    center: true,
    draggable: true,
    closeOnClickModal: false,
  })
  .then(() => {
    if(mode.value === 'auth') router.push('sbpoutwardauth')
    else if (mode.value === 'cancel') router.push('sbpoutwardcancel')
    else router.push('remittance') })
  .catch(() => {})
}

const getCustAccounts = async () => {

  if(rtgsForm?.customerNo?.length > 0 && rtgsForm?.customerNo?.length < 6)
    rtgsForm.customerNo = rtgsForm.customerNo.padStart(6, '0');

  if(!mode.value && (!previousCustomerNo || previousCustomerNo != rtgsForm.customerNo))
  {

    accNoList.value = []
    rtgsForm.accountType='';
    rtgsForm.accountNo='';
    rtgsForm.iBAN='';
    rtgsForm.accountName='';
    rtgsForm.availableBalance='';
    previousCustomerNo = '';
    rtgsForm.chequeDate = '';
    rtgsForm.chequeNo = '';
    rtgsForm.transactionLaxList = [];
  }

  if (previousCustomerNo == rtgsForm.customerNo)
    return;

  const token = getToken();

  if (!token) {
    localStorage.removeItem('token');
    router.push('/');
  }

  try {
    const response = await axios.post(`/start`,
      {
        transition: 'FETCHCUSTACCOUNTS',
        data: {
          customerNo: rtgsForm.customerNo,
          branchCode: token.branchCode
        }
      }
    );

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
        rtgsForm.availableBalance = formatAmount(data.data.availableBalance);
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
    const response = await axios.post(`/start`, { transition: 'FETCHBENEFBANKLIST', data:{ searchTerm: benefBankSearchBox.value }});

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

    benefBankListTableRef.value?.setCurrentRow(selectedBenefBank.value);
    console.log(benefBankListTableRef);
  }
  catch (error) {
    benefBankList.value = [];
    console.error(error);
  }
}

const getBenefBankDetails = async () => {
  if (!transactionLaxForm?.beneficiaryBankCode?.length > 0) {
    invokeDefaultDialog('Error', 'Please Select Beneficiary Bank first');
    return
  }

  if (!transactionLaxForm.beneficiaryIbanOrAccountNo.length > 0) {
    invokeDefaultDialog('Error', 'Please Enter benef account No');
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
        // transactionLaxForm.beneficiaryBranchCode = data.data.beneficiaryBranchCd;
        transactionLaxForm.isBeneficiaryTitleFetch = true;
      }
      else {
        transactionLaxForm.isBeneficiaryTitleFetch = false;
        transactionLaxForm.beneficiaryAccountName = '';
        // transactionLaxForm.beneficiaryBranchCode = '';
        invokeDefaultDialog('error', response.data.message);
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
  isBenefAccFetchDisabled.value=true;
}


const handleSubmitClick = async (formRef) => {

  if(!rtgsForm.accountNo ||
      rtgsForm.transactionLaxList.length === 0)
  {
    invokeDefaultDialog("Error", "Please Complete the form")
    return;
  }

  if(chargesLaxList.value.length ==0)
  {
    invokeDefaultDialog("Error", "Please add charges");
    return;
  }

  if(!rtgsForm.isSignatureSeen && mode?.value !== 'cancel')
  {
    invokeDefaultDialog("Message", "Please view customer signature");
    return;
  }

  if (mode?.value === 'auth') {
    // changeStep(3);
    const userInfo = getToken();
    await authorizeOutwardRTGS(userInfo.loginId);
  }
  else if (mode?.value === 'cancel') {
    changeStep(2);
  }
  else {
    if (!formRef) return
    formRef.validate(async (valid) => {
      if(!valid)
      {
        console.log('error submit!');
        invokeDefaultDialog("Error", "Please complete the form correctly")
        return;
      }

      await submitRTGSForm();
    })
  }
}

const submitRTGSForm = async () => {


  currentActivityCode.value = 100;
  changeStep(2);

}

const insertTransactionLax = () => {

  if(transactionLaxForm.transactionAmount === '')
  {
    invokeDefaultDialog('Error','Please Insert Beneficiary Transaction Amount');
    return;
  }

  const transactionAmount = parseFormattedAmount(transactionLaxForm.transactionAmount);
  const availableBalance = parseFormattedAmount(rtgsForm.availableBalance);
  const beneficiaryAmount = parseFormattedAmount(rtgsForm.beneficiaryAmount);


  // if(transactionAmount > availableBalance)
  // {
  //   invokeDefaultDialog("Message", "Entered balance should be less than available balance.");
  //   return;
  // }


  if(rtgsForm.sbpTranTypeCode === "1" &&
      rtgsForm.transferTypeCode === '102' &&
      transactionAmount < 100000)
  {
    invokeDefaultDialog('Error', 'Minimum amount is 1 Lac Rupees');
    return;
  }


  if(rtgsForm.sbpTranTypeCode === "41" &&
      rtgsForm.transferTypeCode === '102' &&
      transactionAmount < 50000)
  {
    invokeDefaultDialog('Error', 'Minimum amount is 50 Thousand Rupees');
    return;
  }


  if(rtgsForm.transferTypeCode === '102' &&
      transactionAmount > 999999)
  {
    invokeDefaultDialog('Error', 'Transfer amount should be less than 10 lac.');
    return;
  }


  // if( rtgsForm.sbpTranTypeCode === "1" &&
  //     rtgsForm.transferTypeCode === '102' &&
  //     (transactionAmount + beneficiaryAmount) > 999999)
  // {
  //   invokeDefaultDialog('Error', 'Total Amount should be less than 10 lac');
  //   return;
  // }

  // if( rtgsForm.sbpTranTypeCode === "41" &&
  //     rtgsForm.transferTypeCode === '102' &&
  //     rtgsForm.transactionLaxList.length === 0 &&
  //     (transactionAmount + beneficiaryAmount) > 999999)
  // {
  //   invokeDefaultDialog('Error', 'Transaction Amount should be less than 10 lac');
  //   return;
  // }

  if(rtgsForm.transferTypeCode === '103' && transactionAmount < 1000000 )
  {
    invokeDefaultDialog('Error', 'Minimum amount is 10 Lac Rupees');
    return;
  }

  if(rtgsForm.transactionLaxList.length >= 10)
  {
    invokeDefaultDialog("Message", "Maximum 10 Beneficiary can be added");
    return;
  }

  // if(transactionLaxForm.beneficiaryBankName === '')
  // {
  //     invokeDefaultDialog('Error','Please Select Beneficiary Bank Name');
  //     return;
  // }


  if(transactionLaxForm.beneficiaryBankCode === '')
  {
    invokeDefaultDialog('Error','Please Select Beneficiary Bank');
    return;
  }

  // if(transactionLaxForm.beneficiaryBranchCode === '')
  // {
  //     invokeDefaultDialog('Error','Please Insert Beneficiary Branch Code');
  //     return;
  // }



  if(transactionLaxForm.beneficiaryIbanOrAccountNo === '')
  {
    invokeDefaultDialog('Error','Please Insert Beneficiary IBAN or Account No');
    return;
  }

  if(transactionLaxForm.beneficiaryAccountName === '')
  {
      invokeDefaultDialog('Error','Please Insert Beneficiary Account Name');
      return;
  }


  console.log("Transaction Lax before insertion", transactionLaxForm);
  rtgsForm.transactionLaxList.push({ ...transactionLaxForm });

  rtgsForm.beneficiaryAmount = formatAmount(beneficiaryAmount + transactionAmount);
  const currentBalance = availableBalance - transactionAmount;
  // rtgsForm.availableBalance = formatAmount(currentBalance);

  if(rtgsForm.transferTypeCode !== '102')
  {
    transactionLaxForm.beneficiaryBankName = '';
    transactionLaxForm.beneficiaryBankCode = '';
  }

  transactionLaxForm.id += 1;
  transactionLaxForm.transactionAmount = '';
  transactionLaxForm.beneficiaryAccountName = '';
  transactionLaxForm.beneficiaryIbanOrAccountNo = '';
  transactionLaxForm.beneficiaryAddress = '';
  transactionLaxForm.beneficiaryBranchCode = '';
  transactionLaxForm.isBeneficiaryTitleFetch = true;
  isBenefAccFetchDisabled.value = true;
}

const removeTransactionLax = () => {

  if (selectedTransactionLax.value !== '') {
    let selectedRowData = rtgsForm.transactionLaxList.find((item) => item.id === selectedTransactionLax.value );


    const transactionLaxAmount = parseFormattedAmount(selectedRowData.transactionAmount);
    const beneficiaryAmount = parseFormattedAmount(rtgsForm.beneficiaryAmount)
    rtgsForm.beneficiaryAmount = formatAmount(beneficiaryAmount - transactionLaxAmount);


    const currentBalance = parseFormattedAmount(rtgsForm.availableBalance) + transactionLaxAmount
    // rtgsForm.availableBalance = formatAmount(currentBalance);

    rtgsForm.transactionLaxList = rtgsForm.transactionLaxList.filter((item) => item.id !== selectedTransactionLax.value)
    selectedTransactionLax.value = null;
    transactionLaxForm.id -= 1;

    if(rtgsForm.transferTypeCode === '102' && rtgsForm.transactionLaxList.length == 0)
    {

      transactionLaxForm.beneficiaryBankName = '';
      transactionLaxForm.beneficiaryBankCode = '';
    }
  }
}

const insertCharges = () => {
  if (rtgsForm.transactionLaxList.length == 0) {
    invokeDefaultDialog('Error', 'Please complete the form first');
    return;
  }

  if (chargesLaxList.value.length != 0)
    return;

  console.log('insert charges working')
  let transactionLaxList;
  if(rtgsForm.transferTypeCode == '103')
  {
    transactionLaxList = [
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
  }
  else
  {
    transactionLaxList = [
      {
        trancd: 81213,
        tranDesc: 'RTGS102 SBP T1',
        glAccount: 'C870116010009',
        amount: '0.00'
      },
      {
        trancd: 81212,
        tranDesc: 'RTGS102 BNK T1',
        glAccount: '1790801510002',
        amount: '0.00'
      },
    ]
  }
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
  changeStep(1)
}

const onExceptionAcknowledged = async (cancelReason) => {
  if (mode?.value == 'cancel') {
    cancellationReason.value = cancelReason ? cancelReason : '';
    console.log("Cancellation reason received", cancellationReason.value);
    changeStep(3)
    return;
  }

  await createOutwardRTGS();
}

const onAuthSuccess = async (loginId) => {
  if (mode?.value == 'auth') {
    await authorizeOutwardRTGS(loginId);
    return;
  }
  else if (mode?.value == 'cancel') {
    await cancelOutwardRTGS();
    return;
  }
}

const onAuthCancel = () => {
  console.log("on Auth cancel")
  if (mode?.value == 'auth') changeStep(1)
  else changeStep(2)
}

const cancelOutwardRTGS = async () => {
  const token = getToken();

  if (!token) {
      localStorage.removeItem('token');
      router.push('/');
  }

  try {
    const voucherNo = $route.query.voucherNo;
    const voucherYear = $route.query.voucherYear;

    const response = await axios.post(`/start`, {
      transition: 'CANCELOUTWARDRTGS',
      data: {
        loginId: token?.loginId,
        voucherNo,
        voucherYear,
        cancellationReason: cancellationReason.value
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


const authorizeOutwardRTGS = async (loginId) => {
  try {

    const voucherNo = $route.query.voucherNo;
    const voucherYear = $route.query.voucherYear;
    const response = await axios.post(`/start`, {
      transition: 'AUTHORIZEOUTWARDRTGS',
      data: {
        voucherNo: voucherNo,
        voucherYear: voucherYear,
        loginId: loginId,
      }
    });

    if (response.status == 200) {
      const { data } = response;
      if (data.success) {
        console.log("Success response is received from backend", data.data);

        voucherLaxList.value = data.data.voucherLaxList;
        adviceNoList.value = data.data.adviceNoList;
        transactionNoList.value = data.data.transactionNoList;

        isVoucherDialogVisible.value = true;
        // invokeDefaultDialog("Message", `Voucher ${voucherNo}/${voucherYear} authorized successfully`, () => { router.push('/') });
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
  const token = getToken()

  if (!token) {
    localStorage.removeItem('token');
    router.push('/');
  }

  const chequeDate = convertToIsoFormat(rtgsForm.chequeDate);

  if (rtgsForm && rtgsForm.transactionLaxList && Array.isArray(rtgsForm.transactionLaxList)) {
    rtgsForm.transactionLaxList.forEach(item => {
      if (typeof item.transactionAmount === 'string') {
        item.transactionAmount = parseFormattedAmount(item.transactionAmount);
      }
    });
  }


  const reqObject = {
    loginId: token.loginId,
    branchCode: rtgsForm.branchCode,
    currencyCode: rtgsForm.currencyCode,
    sbpTranTypeCode: rtgsForm.sbpTranTypeCode,
    transferTypeCode: rtgsForm.transferTypeCode,
    isCustAcc: rtgsForm.isCustAcc,
    customerNo: rtgsForm.customerNo,
    accountNo: rtgsForm.accountNo,
    totalAmount: parseFormattedAmount(rtgsForm.beneficiaryAmount),
    paymentMode: rtgsForm.paymentMode,
    transactionLaxList: rtgsForm.transactionLaxList,
    purposeOfPaymentCode: rtgsForm.purposeOfPaymentCode,
    remarks: rtgsForm.remarks,
    senderToReceiverInformation: rtgsForm.senderToReceiverInformation,
    chequeNo: rtgsForm.chequeNo,
    chequeDate: chequeDate,
    activityCode: 100,
  }
  console.log("Creating Outward Rtgs with data", reqObject);
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

const showSignature = () => {
  rtgsForm.isSignatureSeen = true;
  isSignatureDialogVisible.value = true;
}

const voucherSeen = () => {
  isVoucherDialogVisible.value = false;
  changeStep(4);
}


const downloadVoucherReport = async () => {
  const voucherInfo = voucherLaxList?.value[0]?.voucherNo;

  if(!voucherInfo) return;

  const voucherInfoList = voucherInfo.split('/');
  try
  {
    const response = await axios.post(`/start`, {
        transition:'FETCHVOUCHERREPORT',
        data:{
        voucherNo: voucherInfoList[0],
        voucherYear: voucherInfoList[1],
        }
      });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        console.log("User successfully authorized", data.data);
        downloadBase64ReportPdf(data.data, 'OutwardRTGSVoucher');
      }
      else
        invokeDefaultDialog('Error', data.message);
    }
    else
    {
      console.log('Error getting success response');
      console.log(response.data);
      invokeDefaultDialog('Error', 'Network Error');
    }
  }
  catch (error) {
    console.error(error);
    invokeDefaultDialog('Error', 'Network Error');
  }
}

const insertPadding = () => {
    if(transactionLaxForm.beneficiaryBranchCode)
      transactionLaxForm.beneficiaryBranchCode = transactionLaxForm.beneficiaryBranchCode.padStart(4, '0');
}

const removeAmountFormat = () => {
  transactionLaxForm.transactionAmount = parseFormattedAmount(transactionLaxForm.transactionAmount);
}
const applyAmountFormat = () => {
  transactionLaxForm.transactionAmount = formatAmount(transactionLaxForm.transactionAmount);
}


const setSelectedBenefBankValue = (selectedBank) => {
  console.log("we are getting the value", selectedBank);
  changeStep(1);
  if(transactionLaxForm.beneficiaryBankCode != selectedBank.value)
  {
    let wordsArray = selectedBank.label.split('-');
    transactionLaxForm.beneficiaryBankName = `${wordsArray[0]}-${wordsArray[1]}`;
    transactionLaxForm.beneficiaryBankCode = selectedBank.value;
    // transactionLaxForm.beneficiaryIbanOrAccountNo = '';
    isBenefAccFetchDisabled.value=false;
  }
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
            <el-col :lg="3" :md="4">
              <el-form-item>
                <span>Branch</span>
              </el-form-item>
            </el-col>
            <el-col :lg="14" :md="17">
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
            <el-col :lg="3" :md="4">
              <el-form-item>
                <span>Currency</span>
              </el-form-item>
            </el-col>
            <el-col :lg="14" :md="17">
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
            <el-col :lg="3" :md="4">
              <el-form-item>
                <span>SBP Tran. Type</span>
              </el-form-item>
            </el-col>
            <el-col :lg="14" :md="17">
              <el-form-item>
                <el-select :disabled="isFormDisabled" @change="resetForm" v-model="rtgsForm.sbpTranTypeCode"
                  placeholder="Select SBP Tran Type">
                  <el-option v-for="item in sBPTranTypeList" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="3" :md="4">
              <el-form-item>
                <span>Transfer Type</span>
              </el-form-item>
            </el-col>
            <el-col :md="16" :lg="12">
              <el-form-item>
                <el-radio-group :disabled="isFormDisabled" @change="resetForm()" v-model="rtgsForm.transferTypeCode">
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
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span>Customer No.</span>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-form-item>
              <el-input
                v-model="rtgsForm.customerNo"
                @click.right.prevent @copy.prevent @paste.prevent
                :disabled="isFormDisabled || (rtgsForm.transferTypeCode === '202' && !rtgsForm.isCustAcc)"
                @blur="getCustAccounts" @keydown="isNumber" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span style="margin-left: 8%;">A/C No.</span>
            </el-form-item>
          </el-col>
          <el-col :md="13" :lg="12">
            <el-form-item>
              <el-select :disabled="isFormDisabled" v-model="rtgsForm.accountNo" @change="getAccountDetails"
                placeholder="Select A/C">
                <el-option v-for="item in accNoList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span>A/C Type</span>
            </el-form-item>
          </el-col>
          <el-col :md="20" :lg="17">
            <el-form-item>
              <el-input v-model="rtgsForm.accountType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span>IBAN</span>
            </el-form-item>
          </el-col>
          <el-col :md="20" :lg="17">
            <el-form-item>
              <el-input v-model="rtgsForm.iBAN" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span>A/C Name</span>
            </el-form-item>
          </el-col>
          <el-col :md="20" :lg="17">
            <el-form-item>
              <el-input v-model="rtgsForm.accountName" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span>Available Balance</span>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="7">
            <el-form-item>
              <el-input dir="rtl" v-model="rtgsForm.availableBalance" disabled/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :lg="3">
            <el-form-item>
              <span style="margin-left: 8%;">Benef Amount</span>
            </el-form-item>
          </el-col>
          <el-col :md="8" :lg="7">
            <el-form-item>
              <el-input disabled dir="rtl" v-model="rtgsForm.beneficiaryAmount" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :lg="3" :md="4">
            <el-form-item>
              <span>Payment Mode</span>
            </el-form-item>
          </el-col>
          <el-col :md="2" :lg="4">
            <el-form-item>
              <el-radio-group :disabled="isFormDisabled" v-model="rtgsForm.paymentMode">
                <el-radio value="cheque">Cheque</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="0" :md="1"></el-col>

          <el-col :md="3" :lg="2">
            <el-form-item>
              <span>Cheque#</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="4">
            <el-form-item prop="chequeNo">
              <el-input
                @click.right.prevent
                @copy.prevent
                @paste.prevent
                v-model="rtgsForm.chequeNo"
                @blur="validateChequeStatus"
                @keydown="isNumber"
                maxlength="6"
                :disabled="isFormDisabled || rtgsForm.isCustAcc || rtgsForm.accountNo == ''" />
            </el-form-item>
          </el-col>

          <el-col :md="4" :lg="3">
            <el-form-item>
              <span style="margin-left: 8%;">Cheque Date</span>
            </el-form-item>
          </el-col>
          <el-col :md="5" :lg="4">
            <el-form-item prop="chequeDate">
              <el-input
                @click.right.prevent @copy.prevent @paste.prevent
                :disabled="isFormDisabled || rtgsForm.accountNo == ''"
                v-model="rtgsForm.chequeDate"
                v-date
                placeholder="  /   /  "
                maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :md="4" :lg="4">
            <el-form-item>
              <span>Tran. Amount</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="8">
            <el-form-item>
              <el-input
                dir="rtl"
                @click.right.prevent
                @copy.prevent
                @paste.prevent
                :disabled="isFormDisabled ||
                rtgsForm.accountNo == ''"
                @click="removeAmountFormat"
                @blur="applyAmountFormat"
                v-model="transactionLaxForm.transactionAmount"
                @keydown="isNumber"
                maxlength="15" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="4">
            <el-form-item>
              <span>Benef. Bank Name</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="13">
            <el-form-item>
              <el-input @click.right.prevent @copy.prevent @paste.prevent v-model="transactionLaxForm.beneficiaryBankName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :md="3" :lg="2">
            <el-button
              :disabled="isFormDisabled ||
              rtgsForm.accountNo == '' ||
              rtgsForm.transactionLaxList.length > 0"
              class="generic-button"
              @click="changeStep(5)"
              type="primary">List</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="4">
            <el-form-item>
              <span>Benef IBAN/AC No.</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="13">
            <el-form-item>
              <el-input
                v-uppercase
                @click.right.prevent @copy.prevent @paste.prevent
                :disabled="isFormDisabled ||
                  rtgsForm.accountNo == ''"
                v-model="transactionLaxForm.beneficiaryIbanOrAccountNo"
                @keydown="(event) => isAlphaNumeric(event,24)"
                @change="() => {
                  if(transactionLaxForm.isBeneficiaryTitleFetch)
                    transactionLaxForm.beneficiaryAccountName = '';
                  isBenefAccFetchDisabled=false;
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :md="3" :lg="2">
            <el-button :disabled="isFormDisabled ||
              rtgsForm.accountNo == '' ||
              isBenefAccFetchDisabled || transactionLaxForm.beneficiaryIbanOrAccountNo == ''"
              class="generic-button"
              @click="getBenefBankDetails"
              type="primary">Fetch</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="4">
            <el-form-item>
              <span>Benef A/C Name</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="13">
            <el-form-item>
              <el-input
                @click.right.prevent
                @copy.prevent
                @paste.prevent
                v-model="transactionLaxForm.beneficiaryAccountName"
                v-uppercase
                :disabled="transactionLaxForm.isBeneficiaryTitleFetch || rtgsForm.accountNo == ''"
                maxlength="150" />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :lg="6" :md="7">
            <el-row>
              <el-col :md="14" :lg="12">
                <el-form-item>
                  <span>Benef. Branch Code</span>
                </el-form-item>
              </el-col>
              <el-col :md="10" :lg="12">
                <el-form-item>
                  <el-input @click.right.prevent @copy.prevent @paste.prevent @keydown="isNumber" @blur="insertPadding" v-model="transactionLaxForm.beneficiaryBranchCode" :disabled="rtgsForm.accountNo == ''" maxlength="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4" :lg="4">
            <el-form-item>
              <span class="optional-field">Beneficiary Address</span>
            </el-form-item>
          </el-col>
          <el-col :md="12" :lg="13">
            <el-form-item>
              <el-input
                @click.right.prevent @copy.prevent @paste.prevent
                :disabled="isFormDisabled || rtgsForm.accountNo == ''"
                v-model="transactionLaxForm.beneficiaryAddress"
                :autosize=false
                @keypress="handleMultiLineTextboxKeyPress"
                @paste="handleMultiLineTextboxPaste"
                type="textarea"
                :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <div>
        <el-table :data="rtgsForm.transactionLaxList" @current-change="handleTransactionLaxSelectedChange"
          highlight-current-row style="width: 100%" max-height="150">
          <el-table-column property="transactionAmount" align="center" label="Transaction Amount" width="200" />
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
            <el-button
              class="generic-button"
              :disabled="isFormDisabled ||
                rtgsForm.transactionLaxList.length == 0 ||
                selectedTransactionLax === null"
              @click="removeTransactionLax"
              type="primary">Remove</el-button>
          </el-col>
          <el-col :span="3">
            <el-button class="generic-button"
              :disabled="isFormDisabled || rtgsForm.accountNo == '' ||(rtgsForm.transferTypeCode === '103' && rtgsForm.transactionLaxList.length > 0)"
              @click="insertTransactionLax" type="primary">Add</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 8px;">
          <el-col :span="4">
            <el-form-item>
              <span>Purpose of Payment</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item prop="purposeOfPaymentCode">
              <el-select :disabled="isFormDisabled" v-model="rtgsForm.purposeOfPaymentCode"
                placeholder="Select Purpose of Payment">
                <el-option v-for="item in purposeOfPaymentList" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 8px;">
          <el-col :span="4">
            <el-form-item>
              <span class="optional-field">Remarks</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
              <el-input
                :disabled="isFormDisabled ||  rtgsForm.accountNo == ''"
                @keypress="handleMultiLineTextboxKeyPress"
                @paste="handleMultiLineTextboxPaste"
                @click.right.prevent @copy.prevent @paste.prevent
                v-model="rtgsForm.remarks"
                :autosize=false
                type="textarea"
                :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 8px;">
          <el-col :span="4">
            <el-form-item>
              <span class="optional-field">Sender To Receiver Information</span>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item>
              <el-input
                :disabled="isFormDisabled || rtgsForm.accountNo == ''"
                v-model="rtgsForm.senderToReceiverInformation"
                :autosize=false
                type="textarea"
                @click.right.prevent @copy.prevent @paste.prevent
                @keypress="handleMultiLineTextboxKeyPress"
                @paste="handleMultiLineTextboxPaste"
                :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <h4 style="padding: 0.8% 0.2%;">Charges:</h4>
      <el-row>
        <el-col :lg="20" :md="19">
          <el-table :data="chargesLaxList" highlight-current-row @current-change="handleChargesLaxSelectedChange"
            style="width: 100%" height="110" max-height="250">
            <el-table-column property="trancd" label="Trancd" width="100" />
            <el-table-column property="tranDesc" label="Tran Description" width="200" />
            <el-table-column property="glAccount" label="GL Account" width="300" />
            <el-table-column property="amount" label="Amount" />
          </el-table>
        </el-col>
        <el-col :lg="4" :md="5">
          <el-row style="gap: 6px;padding: 0px 6px;">
            <el-col>
              <el-button :disabled="isFormDisabled" class="generic-button" @click="insertCharges" type="primary">Add Charges</el-button>
            </el-col>
            <el-col>
              <el-button :disabled="isFormDisabled" class="generic-button" @click="changeCharges" type="primary">Change Charges</el-button>
            </el-col>
            <el-col>
              <el-button
                class="generic-button"
                :disabled="isFormDisabled || chargesLaxList.length == 0"
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
          <el-col :md="4" :lg="3">
            <el-button :disabled="!rtgsForm.customerNo" @click="showSignature" class="generic-button" type="primary">View Signature</el-button>
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
      @acknowledged="onExceptionAcknowledged"
      @cancelled="onExceptionCancelled" />
  </template>

  <template v-if="step === 3">
    <AuthWindow
      :voucherNo="voucherNo"
      :voucherYear="voucherYear"
      @success="onAuthSuccess"
      @cancelled="onAuthCancel" />
  </template>

  <template v-if="step === 4">
    <MessageWindow
      :activityCode=currentActivityCode
      :adviceNoList="adviceNoList"
      :transactionNoList="transactionNoList"
      :voucherNo="voucherLaxList[0].voucherNo" />
  </template>

  <template v-if="step === 5">
    <SelectListWindow
      :selectedValue=transactionLaxForm.beneficiaryBankCode
      @valueSelected="setSelectedBenefBankValue"
      @cancelled="changeStep(1)"
      />
  </template>

  <el-dialog
    v-model="dialogTableVisible"
    :before-close="(doneFn) => { benefBankSearchBox.value = '', doneFn() }"
    :show-close="false"
    title="Select Beneficiary Bank"
    fullscreen
    @closed="()=>{ benefBankSearchBox = ''}"
    @open="getBenefBankList" width="1000">
    <el-form @submit.prevent="getBenefBankList">
      <el-row style="margin-bottom: 1%;">
        <el-col :span="21">
          <el-form-item>
            <el-input
              v-model="benefBankSearchBox"
              @keydown="(event) => isAlphaNumeric(event,150,true)"
              v-uppercase
              @click.right.prevent @copy.prevent @paste.prevent
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="2">
          <el-button
            class="generic-button"
            @click="getBenefBankList"
            type="primary">
            Search
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="benefBankList"
      :show-header="false"
      ref="benefBankListTableRef"
      highlight-current-row
      style="width: 100%"
      height="500"
      @current-change="handleSelectedBenefBankChange">
      <el-table-column property="label"/>
    </el-table>
    <el-row style="margin-top: 20px;">
      <el-col :span="19"></el-col>
      <el-col :span="2">
        <el-button @click="selectBenefBank" :disabled="!selectedBenefBank" class="generic-button" type="primary">Select</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-button @click="dialogTableVisible = false" class="generic-button" type="primary">Cancel</el-button>
      </el-col>
    </el-row>
  </el-dialog>


  <!-- <el-dialog
    v-model="dialogTableVisible"
    :show-close="false"
    title="Select Beneficiary Bank"
    @open="getBenefBankList" width="1000">
    <el-table
      :data="benefBankList"
      :show-header="false"
      ref="benefBankListTableRef"
      highlight-current-row
      style="width: 100%"
      :fit="true"
      @current-change="handleSelectedBenefBankChange">
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
  </el-dialog> -->



  <el-dialog
    v-model="isVoucherDialogVisible"
    :show-close="false"
    title="Voucher"
    width="80%"
    top="8vh"
    :close-on-click-modal="false">
    <el-table
      :data="voucherLaxList"
      ref="VoucherTableRef"
      style="width: 100%"
      height="350"
      max-height="400">
      <el-table-column property="voucherNo" label="Vouch No." width="120" />
      <el-table-column property="referenceNo" label="Ref No" width="100" />
      <el-table-column property="accountNo" label="Account No." width="220" />
      <el-table-column property="accountTitle" label="A/C Title" width="220" />
      <el-table-column property="currencyCode" label="CCY" width="100" />
      <el-table-column property="debitAmount" label="DR" min-width="200"/>
      <el-table-column property="creditAmount" label="CR" min-width="200"/>
    </el-table>
    <fieldset style="margin-top: 20px;">
      <el-row>
        <el-col :span="3">
          <el-button @click="voucherSeen" class="generic-button" type="primary">OK</el-button>
        </el-col>
        <el-col :span="18"></el-col>
        <el-col :span="3">
          <el-button @click="downloadVoucherReport" class="generic-button" type="primary">Print</el-button>
        </el-col>
      </el-row>
    </fieldset>
  </el-dialog>

  <el-dialog v-model="isSignatureDialogVisible" :show-close="false" :close-on-click-modal="false" title="Customer Signature"
    :before-close="(doneFn) => {console.log('before-close'), doneFn() }" width="1000">
    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <el-image style="width: 100%; height: 300px" :src="'/cust-sign.jpeg'" />
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row>
      <el-col :span="21"></el-col>
      <el-col :span="3">
        <el-button @click="isSignatureDialogVisible = false" class="generic-button" type="primary">Close</el-button>
      </el-col>
    </el-row>
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

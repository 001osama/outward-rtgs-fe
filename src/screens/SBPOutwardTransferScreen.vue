<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import axios from '@/axiosInstance.js';

const router = useRouter();

const branchList = ref([]);
const accNoList = ref([]);
const currencyList = ref([]);
const sBPTranTypeList = ref([]);
const purposeOfPaymentList = ref([]);

onMounted(async () => {
  try {
    const response = await axios.post(`/start`, { transition:'FETCHLOV' });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        console.log("Success response is received from backend", data.data);
        branchList.value = data.data.branchList;
        currencyList.value = data.data.currencyList;
        sBPTranTypeList.value = data.data.sBPTranTypeList;
        purposeOfPaymentList.value = data.data.purposeOfPaymentList;

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

const checkDigits = (event) => {
    if (event.key.length === 1 && isNaN(Number(event.key)) )
    {
        event.preventDefault();
    }
}

const rtgsForm = reactive({
  branch: '',
  currency: '',
  sBPTranType:'',
  transferType:'',
  custNo:'',
  accNo:'',
  accType:'',
  accName:'',
  availableBalance:'',
  iBAN:'',
  purposeOfPayment:'',
  paymentMode:'instruction',
})

const ExitBtnClicked = () => {
  router.push('remittance')
}

const getCustAccounts = async () => {

  try {
    const response = await axios.post(`/start`, { transition:'FETCHCUSTACCOUNTS', data:{ customerNo: rtgsForm.custNo } });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        console.log("Success response is received from backend", data.data);
        accNoList.value = data.data;
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
}

const getAccountDetails = async () => {
  try {
    const response = await axios.post(`/start`, { transition:'FETCHACCOUNTDETAILS', data:{ accountNo: rtgsForm.accNo } });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        console.log("Success response is received from backend", data.data);
        rtgsForm.accType = data.data.accountType;
        rtgsForm.accName = data.data.accountName;
        rtgsForm.availableBalance = data.data.availableBalance;
        rtgsForm.iBAN = data.data.iban;
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
}

</script>

<template>
  <el-form :label-position="formAlign" label-width="auto">
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
              <el-select v-model="rtgsForm.branch" placeholder="Select Branch">
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
              <el-select v-model="rtgsForm.currency" placeholder="Select Currency">
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
              <el-select v-model="rtgsForm.sBPTranType" placeholder="Select SBP Tran Type">
                <el-option v-for="item in sBPTranTypeList" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-radio-group v-model="rtgsForm.transferType">
                <el-radio value="102">102(Multiple Beneficiary)</el-radio>
                <el-radio value="103">103(Single Beneficiary)</el-radio>
                <el-radio value="202">202(Bank)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="5">
            <el-checkbox label="Customer Acc."/>
          </el-col>
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
            <el-input v-model="rtgsForm.custNo" @blur="getCustAccounts" @keydown="checkDigits" maxlength="6"/>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <span>A/C No.</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-select v-model="rtgsForm.accNo" @change="getAccountDetails" placeholder="Select A/C">
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
            <el-input v-model="rtgsForm.accType" disabled/>
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
            <el-input v-model="rtgsForm.iBAN" disabled/>
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
            <el-input v-model="rtgsForm.accName" disabled/>
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
            <el-input v-model="rtgsForm.availableBalance" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <span>Benef Amount</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item>
            <el-input />
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
            <el-radio-group v-model="rtgsForm.paymentMode">
              <el-radio value="instruction">Instruction</el-radio>
              <!-- <el-radio value="2">Cheque</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="1"></el-col>

        <!-- <el-col :span="2">
          <el-form-item>
            <span>Cheque#</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <span>Cheque Date</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input />
          </el-form-item>
        </el-col> -->
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
            <el-input />
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
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="2">
          <el-button class="generic-button" type="primary">List</el-button>
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
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="2">
          <el-button class="generic-button" type="primary">Fetch</el-button>
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
            <el-input />
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
                <el-input />
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
            <el-input :autosize=false type="textarea" :rows="2"/>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
    <div>
      <el-table highlight-current-row style="width: 100%" max-height="250">
        <el-table-column property="TransactionAmount" label="Transaction Amount" width="200" />
        <el-table-column property="Amount" label="Beneficiary IBAN/AC #" width="180" />
        <el-table-column property="PostBy" label="Account Name" />
        <el-table-column property="PostDate" label="Beneficiary Bank Name" />
        <el-table-column property="VoucherNo" label="Beneficiary Address" />
      </el-table>
    </div>
    <fieldset>
      <el-row gutter="1">
        <el-col :span="17"></el-col>
        <el-col :span="3" style="margin-right: 8px;">
          <el-button class="generic-button" type="primary">Remove</el-button>
        </el-col>
        <el-col :span="3">
          <el-button class="generic-button" type="primary">Add</el-button>
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
            <el-select v-model="rtgsForm.purposeOfPayment" placeholder="Select Purpose of Payment">
              <el-option v-for="item in purposeOfPaymentList" :key="item.value" :label="item.label" :value="item.value" />
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
            <el-input :autosize=false type="textarea" :rows="2"/>
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
            <el-input :autosize=false type="textarea" :rows="2"/>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
    <h4>Charges:</h4>
    <el-row>
      <el-col :span="21">
        <el-table highlight-current-row style="width: 100%" max-height="250">
          <el-table-column property="tranDesc" label="Tran Description" width="200" />
          <el-table-column property="glAccount" label="GL Account" width="180" />
          <el-table-column property="trancd" label="Trancd" />
          <el-table-column property="amount" label="Amount" />
        </el-table>
      </el-col>
      <el-col :span="3">
        <el-row gutter="2">
          <el-col>
            <el-button class="generic-button" type="primary">Add Charges</el-button>
          </el-col>
          <el-col>
            <el-button class="generic-button" type="primary">Change Charges</el-button>
          </el-col>
          <el-col>
            <el-button class="generic-button" type="primary">Remove Charges</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <fieldset>
      <el-row>
        <el-col :span="3">
          <el-button class="generic-button" type="primary">OK</el-button>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="3">
          <el-button class="generic-button" type="primary">View Signature</el-button>
        </el-col>
        <el-col :span="13"></el-col>
        <el-col :span="3">
          <el-button @click="ExitBtnClicked" class="generic-button" type="primary">Exit</el-button>
        </el-col>
      </el-row>
    </fieldset>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const transferType = ref('');
const branch = ref('');


const ExitBtnClicked = () => {
  router.push('remittance')
}
const branchOptionList = [
  {
    value: '0038',
    label: 'KASUR BRANCH - 0038',
  },
  {
    value: '0002',
    label: 'KARACHI MAIN - 0002',
  },
]

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
              <el-select v-model="branch" placeholder="Select Branch">
                <el-option v-for="item in branchOptionList" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-select v-model="branch" placeholder="Select Branch">
                <el-option v-for="item in branchOptionList" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-select v-model="branch" placeholder="Select Branch">
                <el-option v-for="item in branchOptionList" :key="item.value" :label="item.label" :value="item.value" />
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
              <el-radio-group v-model="transferType">
                <el-radio value="1">102(Multiple Beneficiary)</el-radio>
                <el-radio value="2">103(Single Beneficiary)</el-radio>
                <el-radio value="3">202(Bank)</el-radio>
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
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <span>A/C No.</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-select v-model="branch" placeholder="Select Branch">
              <el-option v-for="item in branchOptionList" :key="item.value" :label="item.label" :value="item.value" />
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
            <el-input />
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
            <el-input />
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
            <el-input />
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
            <el-input />
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
            <el-radio-group>
              <el-radio value="1">Instruction</el-radio>
              <el-radio value="2">Cheque</el-radio>
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
            <el-select v-model="branch" placeholder="Select Branch">
              <el-option v-for="item in branchOptionList" :key="item.value" :label="item.label" :value="item.value" />
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

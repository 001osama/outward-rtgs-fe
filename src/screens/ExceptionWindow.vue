<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isDialogVisible = ref(false);
const exceptionList = ref([
  {
    code:'80',
    exception:'Need Authorization',
    action:'Need Authorization'
  }
]);

const reasonCodeList = ref([
  {
    label: 'REQUESTED BY CUSTOMER',
    value: '0005'
  }
]);

const voucherList = ref([
  {
    vouchNo: '386144/2025',
    refNo: 'A1072',
    accNo: '1334',
    accTitle: '1334',
    currencyCode: 'PKR',
    debitAmount: '0.00',
    creditAmount: '9000000.00',
  },
  {
    vouchNo: '386144/2025',
    refNo: 'A1073',
    accNo: '1335',
    accTitle: 'Test Account',
    currencyCode: 'PKR',
    debitAmount: '9000000.00',
    creditAmount: '0.00',
  },
]);

const exceptionForm = reactive({
  reasonCode:'0005',
  reasonDesc:'REQUESTED BY CUSTOMER'
})

const exceptionAcknowledged = () => {
  isDialogVisible.value = true;
}

const exit = () =>{
  router.push('/sbpoutwardtransfer')
}
</script>
<template>
  <div>
    <el-table :data="exceptionList" style="width: 100%" height="300" max-height="300">
      <el-table-column property="code" label="Code"  />
      <el-table-column property="exception" label="Exception" />
      <el-table-column property="action" label="Action" />
    </el-table>
  </div>

  <fieldset style="margin-top: 1%;">
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
  </fieldset>
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
      <el-table-column property="vouchNo" label="Vouch No." />
      <el-table-column property="refNo" label="Ref No"/>
      <el-table-column property="accNo" label="Account No."/>
      <el-table-column property="accTitle" label="A/C Title"/>
      <el-table-column property="currencyCode" label="CCY"/>
      <el-table-column property="debitAmount" label="DR"/>
      <el-table-column property="creditAmount" label="CR"/>
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
<style scoped>
</style>
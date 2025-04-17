<script setup>
import { ref } from 'vue';
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
  <fieldset style="margin-top: 10px;">
    <el-row>
      <el-col :span="4">
        <el-button @click="exceptionAcknowledged" class="generic-button" type="primary">Ok</el-button>
      </el-col>
      <el-col :span="16"></el-col>
      <el-col :span="4">
        <el-button @click="exit" class="generic-button" type="primary">Exit</el-button>
      </el-col>
    </el-row>
  </fieldset>
  <el-dialog
    v-model="isDialogVisible"
    :show-close="false"
    title="Voucher"
    width="1000"
    >
    <el-table
      :data="benefBankList"
      ref="benefBankListTableRef"
      highlight-current-row
      style="width: 100%"
      height="350"
      max-height="400"
      @current-change="handleCurrentChange"
      >
      <el-table-column property="vouchNo" label="Vouch No." />
      <el-table-column property="refNo" label="Ref No"/>
      <el-table-column property="accNo" label="Account No."/>
      <el-table-column property="accTitle" label="Account No"/>
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
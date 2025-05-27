<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import axios from '@/axiosInstance.js';
const emit = defineEmits(['bankSelected', 'cancelled']);

const benefBankListTableRef = ref(null);
const benefBankList = ref([]);
const selectedBenefBank = ref({});
const benefBankSearchBox = ref('');

const handleSelectedBenefBankChange = (val) => {
  console.log(`Handle current change is working`, val);
  benefBankListTableRef.value?.setCurrentRow(val);
  if (val && val.value) selectedBenefBank.value = val;
};

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

</script>
<template>
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
        <el-button @click="emit()" :disabled="!selectedBenefBank" class="generic-button" type="primary">Select</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-button @click="dialogTableVisible = false" class="generic-button" type="primary">Cancel</el-button>
      </el-col>
    </el-row>
</template>

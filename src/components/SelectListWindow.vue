<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axiosInstance.js';
import { isAlphaNumeric } from '@/utils/helpers';
const emit = defineEmits(['valueSelected', 'cancelled']);

const props = defineProps({
  selectedValue: String
});


const benefBankListTableRef = ref(null);
const benefBankList = ref([]);
const selectedBenefBank = ref(null);
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

onMounted(async ()=>{
  console.log('Props of message window is',props);
  await getBenefBankList();
  if(props?.selectedValue)
  {
    const selectedBank = benefBankList.value.findIndex(item=>item.value == props.selectedValue)
    benefBankListTableRef.value?.setCurrentRow(benefBankList.value[selectedBank]);
  }
})

</script>
<template>
  <el-form @submit.prevent="getBenefBankList">
      <el-row style="margin-bottom: .5%;">
        <p class="text-bold-1">Search</p>
      </el-row>
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
      height="300"
      @current-change="handleSelectedBenefBankChange">
      <el-table-column property="label"/>
    </el-table>
    <el-row style="margin-top: 20px;">
      <el-col :span="19"></el-col>
      <el-col :span="2">
        <el-button @click="emit('valueSelected', selectedBenefBank)" :disabled="!selectedBenefBank" class="generic-button" type="primary">Select</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-button @click="emit('cancelled')" class="generic-button" type="primary">Cancel</el-button>
      </el-col>
    </el-row>
</template>

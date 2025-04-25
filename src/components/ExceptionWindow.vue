<script setup>
import { ref, reactive,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import axios from '@/axiosInstance.js';

const router = useRouter();
const isDialogVisible = ref(false);
const exceptionList = ref([]);


const props = defineProps({
  activityCode: String
});
const emit = defineEmits(['cancelled', 'acknowledged']);

const reasonCodeList = ref([
  {
    label: 'REQUESTED BY CUSTOMER',
    value: '0005'
  }
]);



onMounted(async ()=>{
  try {
    const response = await axios.post('/start', { transition:'FETCHEXCEPTIONDATA', data: { activityCode: props.activityCode } })

    if(response.status == 200)
    {
      console.log(response.data)
      if(response.data.success)
      {
        exceptionList.value = response.data.data.exceptionList;
      }
      else
        invokeDefaultDialog('Error', response.data.message);
    }
  }
  catch(ex)
  {
    console.log(ex)
    invokeDefaultDialog('Error', 'Network Error');
  }
})


const exceptionForm = reactive({
  reasonCode:'0005',
  reasonDesc:'REQUESTED BY CUSTOMER'
});


// const exceptionAcknowledged = async () => {
//   if(onAcknowledgeAction?.length <= 0)
//     return;

//   if(onAcknowledgeAction === "AUTHORIZEUSER")
//   {
//     router.push("/authWindow");
//     return;
//   }

//   try {
//     const response = await axios.post(`/start`, { transition:onAcknowledgeAction });

//     if(response.status == 200)
//     {
//       const { data } = response;
//       if(data.success)
//       {
//         voucherList.value = data.data.voucherLaxList;

//         localStorage.setItem("voucher", JSON.stringify(data.data));
//         console.log("Success response is received from backend", data.data);
//         isDialogVisible.value = true;
//       }
//     }
//     else
//     {
//       console.log('Error getting success response');
//       console.log(response.data);
//     }
//   }
//   catch (error) {
//     console.error(error);
//   }
// }

const exit = () =>{
  router.push('/sbpoutwardtransfer')
}
</script>
<template>
  <div>
    <el-table :data="exceptionList" style="width: 100%" height="300" max-height="300">
      <el-table-column property="exceptionCode" label="Code"  />
      <el-table-column property="exceptionDescription" label="Exception" />
      <el-table-column property="actionRequired" label="Action" />
    </el-table>
  </div>

  <!-- <fieldset style="margin-top: 1%;">
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
  </fieldset> -->
  <fieldset style="margin-top: 10px;">
    <el-row>
      <el-col :span="4">
        <el-button @click="emit('acknowledged')" class="generic-button" type="primary">Continue</el-button>
      </el-col>
      <el-col :span="15"></el-col>
      <el-col :span="4">
        <el-button @click="emit('cancelled')" class="generic-button" type="primary">Back</el-button>
      </el-col>
    </el-row>
  </fieldset>

</template>

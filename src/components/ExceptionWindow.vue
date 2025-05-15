<script setup>
import { ref, reactive,onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import { invokeDefaultDialog } from '@/utils/dialog';
import axios from '@/axiosInstance.js';

// const router = useRouter();
// const isDialogVisible = ref(false);
const exceptionList = ref([]);

const formRef = ref();
const props = defineProps({
  activityCode: String
});

const emit = defineEmits(['cancelled', 'acknowledged']);
const reasonCodeList = ref([
  {
      label: "<OTHERS>",
      value: 0
  }
]);


const exceptionForm = reactive({
  reasonCode:0,
  reasonDesc:''
});


const formRules = reactive({
  reasonDesc: [
    { required: true, message: 'Field is required', trigger: 'blur' },
  ],
})


onMounted(async ()=>{
  try {
    const response = await axios.post('/start', { transition:'FETCHEXCEPTIONDATA', data: { activityCode: props.activityCode } })

    if(response.status == 200)
    {
      console.log(response.data)
      if(response.data.success)
      {
        exceptionList.value = response.data.data.exceptionList;
        if(props.activityCode == 200)
          await getReasonList();
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


const getReasonList = async () => {
  try {
    const response = await axios.post(`/start`, { transition:'FETCHREASONLIST' });

    if(response.status == 200)
    {
      const { data } = response;
      if(data.success)
      {
        console.log("successfully get reason list");
        reasonCodeList.value.push(...data.data.reasonList)
        exceptionForm.reasonCode = data.data.reasonList[0].value;
        reasonCodeChanged(data.data.reasonList[0].value)
      }
    }
    else
    {
      console.log('Error getting success response');
      console.log(response.data);
      invokeDefaultDialog('Error', response.data.message);
    }
  }
  catch (error) {
    console.error(error);
    invokeDefaultDialog('Error', 'Network Error');
  }
}


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

// const exit = () =>{
//   router.push('/sbpoutwardtransfer')
// }

const reasonCodeChanged = ( selectedValueId, formRef) => {
  if (formRef) formRef.resetFields()
  console.log(selectedValueId);
  let selectedRowData = reasonCodeList.value.find((item) => item.value === selectedValueId );
  const label_code = selectedRowData.label.split('-');
  exceptionForm.reasonDesc = (selectedValueId === 0 || !label_code && !label_code[0]) ? '' : label_code[0]
}


const handleAcknowledged = (formRef) => {
  if (!formRef) return
  formRef.validate(async (valid) => {
      if (!valid)
        return;
      props.reasonCode != 100 ?  emit('acknowledged', exceptionForm.reasonDesc) : emit('acknowledged')
    }
  )
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
  <el-form ref="formRef" :rules="formRules" :label-position="formAlign" :model="exceptionForm">
    <fieldset v-if="activityCode !== 100" style="margin-top: 1%;">
      <el-row>
        <el-col :span="3">
          <el-form-item>
            <span>Reason Code</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select v-model="exceptionForm.reasonCode" @change="(event)=>reasonCodeChanged(event, formRef)" placeholder="">
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
          <el-form-item prop="reasonDesc">
            <el-input v-model="exceptionForm.reasonDesc" :disabled="exceptionForm.reasonCode !== 0" maxlength="40" :autosize=false type="textarea" :rows="2"/>
          </el-form-item>
        </el-col>
      </el-row>
    </fieldset>
    <fieldset style="margin-top: 10px;">
      <el-row>
        <el-col :span="4">
          <el-button @click="handleAcknowledged(formRef)" class="generic-button" type="primary">Continue</el-button>
        </el-col>
        <el-col :span="15"></el-col>
        <el-col :span="4">
          <el-button @click="emit('cancelled')" class="generic-button" type="primary">Back</el-button>
        </el-col>
      </el-row>
    </fieldset>
  </el-form>
</template>

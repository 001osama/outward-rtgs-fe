<script setup>
import { invokeDefaultDialog } from '@/utils/dialog';
import {reactive, defineEmits} from 'vue';
import axios from '@/axiosInstance.js';



const emit = defineEmits(['cancelled', 'success']);

const authForm = reactive({
  loginId:'',
  password:'',
})





const activityAuthorized = async () => {
  try {
      const response = await axios.post(`/start`, {
         transition:'AUTHORIZEUSER',
         data:{
          loginId: authForm.loginId,
          password: authForm.password,
          }
        });

      if(response.status == 200)
      {
        const { data } = response;
        if(data.success)
        {
          console.log("User successfully authorized", data.data);
          emit('success');
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
</script>
<template>
  <el-row>
    <el-col :span="7"></el-col>
    <el-col :span="9">
      <fieldset style="padding: 3% 10% 1% 10% !important; margin-bottom: 3%;">
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>User Id</span>
            </el-form-item>
          </el-col>
          <el-col :span="19">
            <el-form-item>
              <el-input v-model="authForm.loginId" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item>
              <span>Password</span>
            </el-form-item>
          </el-col>
          <el-col :span="19">
            <el-form-item>
              <el-input type="password" v-model="authForm.password" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="7">
            <el-button :disabled="authForm.loginId.length < 3 || authForm.password.length < 3" @click="activityAuthorized" class="generic-button" type="primary">Authorize</el-button>
          </el-col>
          <el-col :span="10"></el-col>
          <el-col :span="7">
            <el-button @click="emit('cancelled')" class="generic-button" type="primary">Back</el-button>
          </el-col>
        </el-row>
      </fieldset>
    </el-col>
    <el-col :span="7"></el-col>
  </el-row>
</template>
<style></style>

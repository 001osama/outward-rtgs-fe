<script setup>
import { invokeDefaultDialog } from '@/utils/dialog';
import {reactive} from 'vue';
import {useRouter} from 'vue-router';

const authForm = reactive({
  loginId:'',
  password:'',
})

const router = useRouter();

const activityAuthorized = () => {
  invokeDefaultDialog('Message', 'Voucher No 0082236/2025 has been cancelled', ()=>{ router.push('/') });
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
              <el-input v-model="authForm.loginId"/>
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
              <el-input v-model="authForm.password"/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <el-row>
          <el-col :span="7">
            <el-button @click="activityAuthorized" class="generic-button" type="primary">Authorize</el-button>
          </el-col>
          <el-col :span="10"></el-col>
          <el-col :span="7">
            <el-button class="generic-button" type="primary">Back</el-button>
          </el-col>
        </el-row>
      </fieldset>
    </el-col>
    <el-col :span="7"></el-col>
  </el-row>
</template>
<style></style>
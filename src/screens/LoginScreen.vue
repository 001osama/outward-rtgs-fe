<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axiosInstance.js';


const router = useRouter();
const maxLength = 4;
const branchCode = ref('');
const loginId = ref('');
const password = ref('');
const errorMessage = ref('');

const onSubmit = async () => {
    const resultObj = {
      data:{
        branchCode: branchCode.value,
        loginId: loginId.value,
        password: password.value
      },
      transition:"LOGIN"
    };

    console.log("Data is being submitted", resultObj);

    try {
      const response = await axios.post(`/start`, resultObj);

      if(response.status == 200)
      {
        const { data } = response;
        if(data.success)
        {
          localStorage.setItem("token", data.data);
          router.push('/authlayout');
        }
        else
        {
          errorMessage.value = data.message;
        }
      }
      else
      {
        errorMessage.value = 'Error occurred While getting response!';
        console.log(response.data);
      }
    } catch (error) {
      errorMessage.value = 'Network Error';
      console.error(error);
    }

}


const checkDigits = (event) => {
    if (
        event.key.length === 1 &&
        (
            isNaN(Number(event.key)) ||
            branchCode.value.length >= maxLength
        )
    )
    {
        event.preventDefault();
    }
}

const insertPadding = () => {
    if(branchCode.value)
        branchCode.value = branchCode.value.padStart(4, '0');
}

const isInvalid = computed(() => {
    return !branchCode.value.trim() || !loginId.value.trim() || !password.value.trim();
});

</script>

<template>
    <div class="main-container">
      <el-row>
          <h1 >ALHABIB BANKING SYSTEM</h1>
      </el-row>
      <el-row>
          <el-col :span="1"></el-col>
          <el-col :span="10">
              <div class="bahl-logo-container">
                  <img class="bahl-logo-img" src="/bahl-logo.png" alt="">
              </div>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="10">
            <div class="login-form-wrapper">
              <form @submit.prevent="onSubmit" class="login-form-container">
                  <div class="login-form">
                      <div style="display: flex; margin-bottom: 24px; gap: 24px;">
                          <input v-model="branchCode" @blur="insertPadding" @keydown="checkDigits" class="form-control" style="width: 25%;" type="text">
                          <input v-model="loginId" class="form-control" style="width: 75%;" type="password">
                      </div>
                      <div>
                          <input v-model="password" class="form-control" type="password">
                      </div>
                  </div>
                  <div class="button-container">
                      <div>
                          <button :disabled="isInvalid" type="submit" class="primary-button">Sign In</button>
                      </div>
                      <div>
                          <button class="primary-button">Exit</button>
                      </div>
                  </div>
              </form>
              <div class="error-message" v-if="errorMessage">{{errorMessage}}</div>
            </div>
          </el-col>
      </el-row>
    </div>
</template>

<style scoped>
.form-control {
    display: block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: .25rem;
    transition: border-color .15sease-in-out, box-shadow .15sease-in-out;
}

.primary-button {
    padding: 0px 20px;
    height: 40px;
    width: 100%;
    background-color: var(--bg-secondary);
    border: black;
    color: black;
    font-size: 16px;
    font-weight: bold;
    border-radius: 0%;
}

.primary-button[disabled] {
    padding: 0px 20px;
    height: 40px;
    width: 100%;
    background-color: #cccccc;
    border: black;
    color: black;
    font-size: 16px;
    font-weight: bold;
    border-radius: 0%;
}

.form-control:focus {
    color: #212529;
    background-color: #fff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 .25rem rgba(13, 110, 253, .25);
}


.login-form {
    border: 2px var(--border-primary) solid;
    padding: 8px;
    margin-bottom: 20px;
    position: relative;
    padding-top: 40px;
}

.login-form-wrapper
{
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-end;
}
.login-form::after
{
    position: absolute;
    top: -24px;
    left: 10px;
    padding: 9px;
    content: 'Login';
    background: var(--bg-primary);
    font-size: 22px;
    font-weight: 700;
}

.main-container {
    padding: 2% 10%;
}

.main-div {
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.main-header-1 {
    padding-bottom: 4%;
    font-weight: 500;
    font-size: 38px;
}

.bahl-logo-container {
    width: 100%;
}

.button-container {
    display: flex;
    justify-content: space-between;
}

.bahl-logo-img {
    float: right;
    width: 100%;
}

.error-message{
  color: var(--white);
  font-weight: bolder;
  font-size: 2vw;
  margin-top: 8px;
}
</style>
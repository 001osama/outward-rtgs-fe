<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const loginForm = reactive({
    branchCode:'',
    loginId:'',
    password:'',
});

const isInvalid = computed(() => {
    return !loginForm.branchCode.trim() || !loginForm.loginId.trim() || !loginForm.password.trim();
});



const checkDigits = (event) => {
    if (
        event.key.length === 1 && isNaN(Number(event.key))) 
    {
        event.preventDefault();
    }
}

const insertPadding = () => {
    if(loginForm.branchCode)
        loginForm.branchCode = loginForm.branchCode.padStart(4, '0');
}


const onSubmit = () => {
  console.log('submit!',loginForm);
  router.push('/dummyLoginScreen');
}

</script>
<template>
    <div>
        <el-row :span="24">
            <el-col :span="4"></el-col>
            <el-col :span="20">
                <h1>ALHABIB BANKING SYSTEM</h1>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3"></el-col>
            <el-col :span="8">
                <img src="../../public/bahl-logo.png" width="100%"  alt="main-logo">
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="8">
                <div class="login-form-container">
                    <el-form ref="formRef" :model="loginForm" label-width="auto">
                        <div class="login-form-input-container"> 
                            <el-form-item>
                                <el-col :span="8">
                                    <el-input maxlength="4" v-model="loginForm.branchCode" @blur="insertPadding" @keydown="checkDigits"/>
                                </el-col>
                                <el-col :span="1"></el-col>
                                <el-col  :span="15">
                                    <el-input maxlength="10" type="password" v-model="loginForm.loginId" />
                                </el-col>
                            </el-form-item>
                            <el-form-item style="margin-bottom: 0px;">
                                <el-input maxlength="10" type="password" v-model="loginForm.password" />
                            </el-form-item>
                        </div>
                        <el-row justify="space-between">
                            <el-button :disabled="isInvalid" type="primary" @click="onSubmit">Sign In</el-button>
                            <el-button type="primary" @click="onSubmit">Cancel</el-button>
                        </el-row>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="4"></el-col>
        </el-row>
    </div>
</template>
<style scoped>

    .login-form-container
    {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
    }

    .login-form-input-container
    {
        position: relative;
        padding: 3%;
        padding-top: 8%;
        border: 2px solid var(--border-primary);
        margin-bottom: 5%;
    } 

    .login-form-input-container::after
    {
        position: absolute;
        top: -20%;
        font-size: 22px;
        content: 'Login';
        padding: 2%;
        background: var(--bg-primary);
        font-weight: 500;
    }

</style>
<script setup>
import { ref, reactive } from 'vue';
const adviseNoList = ref([
  {
    value:'6491929'
  },
  {
    value:'6491930'
  },
]);


const formData = reactive({
  adviseNo:''
})
</script>
<template>
  <fieldset>
    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="10">
        <el-row>
          <el-col :span="3">
            <el-form-item>
              <span>Advice Nos.</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item>
              <el-select disabled v-model="formData.adviseNo" placeholder="Select Advice">
                <el-option v-for="item in adviseNoList" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </fieldset>
</template>
<style></style>
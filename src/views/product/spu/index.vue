<template>
  <div>
    <!-- 三级级联 -->
    <el-card class="box-card mb-10">
      <div class="text item">
        <CategorySelector></CategorySelector>
      </div>
    </el-card>
    <!-- 表格信息 -->
    <el-card class="box-card">
      <SpuList v-if="showStatus == SPUSTATUS.SPULIST" v-model="showStatus"></SpuList>
      <SpuForm v-if="showStatus == SPUSTATUS.SPUFORM" v-model="showStatus"></SpuForm>
    </el-card>
  </div>
</template>

<script lang="ts">
// 定义枚举 控制显示页面
export enum SPUSTATUS {
  SPULIST = 1,
  SPUFORM = 2,
  SKUFORM = 3,
}
</script>
<script setup lang="ts">
import { ref } from "vue";
import SpuList from "./SpuList/index.vue";
import SpuForm from "./SpuForm/index.vue";
// 控制显示页面
const showStatus = ref(1)
</script>

<style scoped>
</style>
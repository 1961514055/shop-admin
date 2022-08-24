<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" :icon="Plus">添加</el-button>
      </div>
    </template>
    <el-table  border style="width: 100%">
      <el-table-column prop="date" label="序号" width="180" />
      <el-table-column prop="name" label="品牌名称" width="180" />
      <el-table-column prop="address" label="品牌Logo" />
      <el-table-column prop="address" label="操作" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { Plus} from '@element-plus/icons-vue'


</script>

<style scoped>

</style>
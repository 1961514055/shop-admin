<template>
  <div>
    <el-card class="box-card">
      <div class="text item">
        <CategorySelector></CategorySelector>
      </div>
    </el-card>
    <el-card class="box-card mt-10">
      <div class="text item">属性信息</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import CategorySelector from "../../../components/categorySelector/index.vue";
/**
分析:
1. 三级联动 - 用组件去做(全局公用组件)
  1.1 静态搭建
  1.2 接口做好 - 去查看接口返回的数据,使用TS限制数据格式
  1.3 数据展示 - 交互
  1.4 当选择完3id的时候(如何让attr组件知道,3id有值了) - 有两个交互
    按钮可用
    获取主体内容列表展示数据
2. 主体内容
  2.1 把编辑和列表展示切换搞定 - 三级分类的禁用
  ---------------------------------------------
  2.2 准备api
  2.2 列表展示页
  2.3 新增/编辑页面
*/
</script>

<style scoped>
</style>
<template>
  <el-form :inline="true">
    <!-- 一级分类 -->
    <el-form-item label="一级分类">
      <el-select placeholder="请选择" v-model="categoryStore.category1Id" @change="changeCategory1Id">
        <el-option v-for="c1 in categoryStore.category1List" :value="c1.id" :label="c1.name" :key="c1.id" />
      </el-select>
    </el-form-item>
    <!-- 二级分类 -->
    <el-form-item label="二级分类">
      <el-select placeholder="请选择" v-model="categoryStore.category2Id" @change="changeCategory2Id">
        <el-option v-for="c2 in categoryStore.category2List" :value="c2.id" :label="c2.name" :key="c2.id" />
      </el-select>
    </el-form-item>
    <!-- 三级分类 -->
    <el-form-item label="三级分类">
      <el-select placeholder="请选择" v-model="categoryStore.category3Id">
        <el-option v-for="c3 in categoryStore.category3List" :label="c3.name" :value="c3.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category'
const categoryStore = useCategoryStore()


onMounted(() => {
  // 获取一级分类的名字
  categoryStore.getCategory1List()
})

// 改变一级分类时触发调用查询二级分类接口
const changeCategory1Id = () => {
  categoryStore.getCategory2List()
}
const changeCategory2Id = () => {
  categoryStore.getCategory3List()
}
</script>

<style scoped>
</style>
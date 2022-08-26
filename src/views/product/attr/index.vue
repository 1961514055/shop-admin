<template>
  <div>
    <el-card class="box-card">
      <div class="text item">
        <CategorySelector></CategorySelector>
      </div>
    </el-card>
    <el-card class="box-card mt-10">
      <div class="text item">
        <!-- 添加按钮 -->
        <!-- <el-button type="primary" :icon="Plus" size="small" class="mb-10" :disabled="!categoryStore.category3Id ">添加属性 -->
        <el-button type="primary" :icon="Plus" size="small" class="mb-10">添加属性
        </el-button>
        <!-- 列表表格 -->
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column label="序号" width="80" type="index" />
          <el-table-column prop="attrName" label="分类" width="160" />
          <el-table-column prop="name" label="属性值列表">
            <template #default="{ row, $index }">
              <el-tag class="mr-10" type="success" v-for="attrVal in row.attrValueList">{{ attrVal.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="140">
            <template #default="{ row, $index }">
              <el-button type="warning" size="small" :icon="EditPen"></el-button>
              <el-button type="danger" size="small" :icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus, EditPen, Delete } from "@element-plus/icons-vue";
import { useCategoryStore } from "@/stores/category";
import type { attrInfoModel, attrInfoListModel } from '@/api/attr'
import attrApi from '@/api/attr'
// 三级分类仓库
const categoryStore = useCategoryStore()
// 平台属性  用来展示数据
const attrList = ref<attrInfoListModel>()



// 查询列表数据
const getList = async () => {
  const result = await attrApi.getAttrInfoList(categoryStore.category1Id as number, categoryStore.category2Id as number, categoryStore.category3Id as number)
  attrList.value = result
}


// 监听三级分类 数据变化则调用查询接口
watch(() => categoryStore.category3Id, (navl) => {
  //  如果nval = und = false = 什么也没有  nval = dsa = true = 有值
  if (!navl) {
    attrList.value = []
    return
  }
  getList()
}, { immediate: true })






</script>
  
<style scoped>
</style>
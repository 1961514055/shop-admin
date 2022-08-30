<template>
  <div>
    <el-button type="primary" :icon="Plus" class="mb-10" @click="addSpu">添加Spu</el-button>
    <!-- 表格 -->
    <el-table :data="spuList" border>
      <el-table-column type="index" label="序号" width="180"></el-table-column>
      <el-table-column property="spuName" label="SPU名称"></el-table-column>
      <el-table-column property="description" label="SPU描述"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Plus" size="small" title="新增SKU"></el-button>
          <el-button type="warning" :icon="Edit" size="small" title="修改SPU" @click="editSpu(row)"></el-button>
          <el-button type="info" :icon="InfoFilled" size="small" title="查看SKU列表"></el-button>
          <el-button type="danger" :icon="Delete" size="small" title="删除SPU"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-model:currentPage="page" v-model:page-size="limit" :page-sizes="[3, 6, 9]"
      layout=" prev, pager, next, jumper,->, sizes, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
import { Plus, Edit, InfoFilled, Delete } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import spuApi, { type SpuListModel, type SpuModel } from '@/api/spu'
import { useCategoryStore } from "@/stores/category";
import { SPUSTATUS } from '../index.vue'
const categoryStore = useCategoryStore()
const emits = defineEmits(['update:modelValue', 'spuInfo'])

// 分页 数据初始化
const page = ref(1);
const limit = ref(3);
const total = ref(0);
// 存放表格数据
const spuList = ref<SpuListModel>()
const getPage = async () => {
  try {
    let result = await spuApi.getPage(page.value, limit.value, categoryStore.category3Id as number)
    spuList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error('获取spu列表失败')
  }

}

// 点击添加spu
const addSpu = () => {
  emits("update:modelValue", SPUSTATUS.SPUFORM)
}
// 分页
// 点击页码跳转
const handleCurrentChange = (val: number) => {
  page.value = val
  // 发送请求
  getPage()
}

// 分页,跳转到某一页
const handleSizeChange = (val: number) => {
  limit.value = val
  // 发送请求
  getPage()

}

// 点击编辑按钮  把当前要编辑的spu传给父组件,在让父组件传给 spuform

const editSpu = (row: SpuModel) => {
  emits('spuInfo', row)
  emits('update:modelValue', SPUSTATUS.SPUFORM) // 切换界面的显示


}

const initSpuForm = () => ({
  category3Id: undefined, // 保存之前再赋值
  spuName: '', // spu名称
  description: '', // 描述
  tmId: undefined, // 品牌
  spuSaleAttrList: [], // 销售属性列表
  spuImageList: [] // 图片列表
})
const spuForm = ref<SpuModel>(initSpuForm()); // 新增-初始化数据



watch(() => categoryStore.category3Id, (nval) => {
  if (!nval) {
    // 清除页面表格数据
    spuList.value = []
    return
  }
  // 调用查询接口
  getPage()
}, { immediate: true })
</script>

<style scoped>
</style>
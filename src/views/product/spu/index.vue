<template>
  <div>
    <!-- 三级级联 -->
    <el-card class="box-card mb-10">
      <div class="text item">
        <CategorySelector :disabled="showStatus != SPUSTATUS.SPULIST"></CategorySelector>
      </div>
    </el-card>
    <!-- 表格信息 -->
    <el-card class="box-card">
      <SpuList v-if="showStatus == SPUSTATUS.SPULIST" v-model="showStatus" @spuInfo="changeSpuInfo" />
      <SpuForm v-if="showStatus == SPUSTATUS.SPUFORM" v-model="showStatus" :spuInfo="spuInfo"
        @spuInfo="changeSpuInfo" />
      <SkuForm v-if="showStatus == SPUSTATUS.SKUFORM" v-model="showStatus" :spuInfo="spuInfo" />
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
import SkuForm from './SkuForm/index.vue'
import type { SpuModel } from '@/api/spu'
// 控制显示页面
const showStatus = ref(1)
// 定义spu初始化的值
const initSpu = (): SpuModel => ({
  // id?: number,
  spuName: '', // spu名称
  description: '', // spu描述
  category3Id: undefined, // 三级分类的id
  tmId: undefined, // 品牌id
  spuSaleAttrList: [], // spu销售属性列表
  spuImageList: []  // spu图片列表
})
const spuInfo = ref<SpuModel>(initSpu())
const changeSpuInfo = (row: SpuModel) => {
  if (row) { //有值说明为修改
    spuInfo.value = row
  } else {
    spuInfo.value = initSpu()
  }
}

</script>

<style scoped>
</style>
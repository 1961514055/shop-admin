<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <div>{{  spuInfo.spuName  }}</div>
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuForm.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuForm.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" v-model="skuForm.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item :label="attrInfo.attrName" v-for="attrInfo in attrInfoList">
          <el-select placeholder="请选择">
            <el-option :value="attrVal.valueName" v-for="attrVal in attrInfo.attrValueList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form>
        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList" :key="saleAttr.id">
          <el-select placeholder="请选择">
            <el-option :value="saleVal.saleAttrValueName" v-for="saleVal in  saleAttr.spuSaleAttrValueList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table border :data="spuImageList">
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <img :src="row.imgUrl" style="width: 60px;height:60px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName" />
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-tag class="ml-2" type="success" v-if="row.isDefault == '1'">默认</el-tag>
            <el-button type="primary" size="small" @click="setDefault(row)" v-else>设为默认</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { SpuModel } from '@/api/spu';
import type { SkuModel } from '@/api/sku'
import { SPUSTATUS } from '../index.vue';
import attrApi, { type AttrModel } from '@/api/attr'
import spuApi, { type SpuSaleAttrListModel, type SpuImageListModel, type SpuImageModel } from '@/api/spu'
import { useCategoryStore } from '@/stores/category';


const categoryStore = useCategoryStore()
const props = defineProps<{
  spuInfo: SpuModel
}>()

const emits = defineEmits(['update:modelValue'])
// 初始值
const initSkuForm = (): SkuModel => ({
  spuId: undefined, // 保存的时候去收集
  tmId: undefined, // 保存的时候去收集
  category3Id: undefined, // 保存的时候去收集
  price: undefined,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '', // 默认图片 - 交互间接收集
  createTime: '', // 不重要忽略
  skuImageList: [], // 图片列表
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [] // 销售属性
})
const skuForm = ref<SkuModel>(initSkuForm())

// 获取平台属性
const attrInfoList = ref<AttrModel>()
const getAttrInfoList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore
    let result = await attrApi.getAttrInfoList(category1Id as number, category2Id as number, category3Id as number)
    attrInfoList.value = result

  } catch (error) {
    ElMessage.error('获取平台属性失败')
  }
}

// 获取销售属性
const saleAttrList = ref<SpuSaleAttrListModel>()
const getSpuSaleAttrList = async () => {
  try {
    let result = await spuApi.getSpuSaleAttrList(props.spuInfo.id!)
    saleAttrList.value = result

  } catch (error) {
    ElMessage.error('获取销售属性失败！！')
  }
}

// 获取图片列表
const spuImageList = ref<SpuImageListModel>()
const getSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageList(props.spuInfo.id!)
    spuImageList.value = result
  } catch (error) {
    ElMessage.error('获取图片列表失败！！')
  }
}

// 设置默认
const setDefault = (row: SpuImageModel) => {
  spuImageList.value?.forEach(item => {
    item.isDefault = '0'
  })
  row.isDefault = '1'
}

// 保存
const onSave = () => {
  // 默认图片收集
  skuForm.value.skuDefaultImg = spuImageList.value?.find(item => item.isDefault == '1')?.imgUrl!
  // 平台属性
  skuForm.value.skuAttrValueList = attrInfoList.value?.filter(item => item.attrIdValueId).map(item => {
    const [attrId, valueId] = item.attrIdValueId.split(':');
    return {
      attrId,
      valueId
    }
  })!
  // 销售属性
  skuForm.value.skuSaleAttrValueList = saleAttrList.value?.filter(item => item.attrIdValueId).map(item => {
    const [saleAttrId, saleAttrValueId] = item.attrIdValueId.split(':');
    return {
      saleAttrId,
      saleAttrValueId
    }
  })!
}





// 取消
const cancelSave = () => {
  emits('update:modelValue', SPUSTATUS.SPULIST)
}
// 初始化数据
const initDate = () => {
  getAttrInfoList()
  getSpuSaleAttrList()
  getSpuImageList()
}

onMounted(() => {
  initDate()
})
</script>

<style scoped>
</style>
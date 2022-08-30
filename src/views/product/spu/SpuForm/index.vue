<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SUP名称" v-model="spuForm.spuName" />
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuForm.tmId">
        <el-option v-for="tm in trademarkList" :key="tm.id" :value="(tm.id as number)" :label="tm.tmName" />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="spuForm.description" />
    </el-form-item>
    <!-- 图片上传 -->
    <el-form-item>
      <el-upload v-model:file-list="(spuImageList as any)" action="/app-dev/admin/product/upload"
        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
        :on-success="handleAvatarSuccess">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select placeholder="还有3个未选择">
          <el-option v-for="base in saleAttrList" :key="base.id" :value="`${base.id}:${base.name}`"
            :label="base.name" />
        </el-select>
        <el-button type="primary" :icon="Plus" class="ml-10">添加销售属性</el-button>
      </div>
      <!-- 销售属性表格 -->
      <el-table border class="mb-10">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="属性名" property="spuName"></el-table-column>
        <el-table-column label="属性值名称列表" property="description"></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="{ row, $index }">
            <el-button type="danger" :icon="Delete" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存按钮 -->
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import spuApi, { type BaseSaleListModel, type SpuModel, type SpuSaleAttrListModel, } from '@/api/spu'
import trademarkApi, { type trademarkListModel } from '@/api/trademark';

// 图片列表
const dialogVisible = ref(false) // 显示预览
const dialogImageUrl = ref('') // 预览图片的url

const props = defineProps<{
  spuInfo: SpuModel,
}>()

const initSpuForm = () => ({
  category3Id: undefined, // 保存之前再赋值
  spuName: '', // spu名称
  description: '', // 描述
  tmId: undefined, // 品牌
  spuSaleAttrList: [], // 销售属性列表
  spuImageList: [] // 图片列表
})
// 初始化表单数据
const spuForm = ref<SpuModel>(initSpuForm()); // 新增-初始化数据


// 预览的回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 删除的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  spuImageList.value = uploadFiles as any
}
// 文件上传成功时的钩子
// const tempImgList: SpuImageListModel = [] //临时存放的中间变量
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
  // 把所有的变量赋值给收集的变量
  spuImageList.value = uploadFiles as any
  spuImageList.value?.forEach((item: any) => {
    //把url变成本地真实的url
    item.url = item.response.data
    item.imgName = item.name as string
    item.imgUrl = item.url as string
  })
}




// 品牌下拉数据
const trademarkList = ref<trademarkListModel>()
const getTrademarkList = async () => {
  try {
    let result = await trademarkApi.getList()
    trademarkList.value = result
  } catch (error) {
    ElMessage.error('获取品牌下拉数据失败')
  }
}
// 销售属性 下拉 需要过滤掉表格中以存在的数据
const baseSaleAttrList = ref<BaseSaleListModel>()
const getBaseSaleAttrList = async () => {
  try {
    let result = await spuApi.getSaleAttrList()
    baseSaleAttrList.value = result
  } catch (error) {
    ElMessage.error('获取销售属性下拉数据失败')
  }
}

// 销售属性过滤
const saleAttrList = computed(() => {
  // filter 满足条件的会被过滤留下,不满足条件的会被过滤掉
  return baseSaleAttrList.value?.filter(item => {
    // spuForm.value.spuSaleAttrList - 表格数据
    const isRepate = spuForm.value.spuSaleAttrList.some(row => {
      return row.saleAttrName == item.name
    })
    return !isRepate
  })
})
// 获取图片列表
const spuImageList = ref<SpuImageListModel>()
const getSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageList(spuForm.value.id as number)
    spuImageList.value = result
  } catch (error) {
    ElMessage.error('获取图片列表失败')
  }
}
// 获取销售属性列表
const spuSaleAttrList = ref<SpuSaleAttrListModel>()
const getSpuSaleAttrList = async () => {
  try {
    let result = await spuApi.getSpuSaleAttrList(spuForm.value.id as number)
    spuSaleAttrList.value = result
    console.log('spuSaleAttrList', spuSaleAttrList.value)


  } catch (error) {
    ElMessage.error('获取SPU的销售属性列表失败')
  }
}

// 初始化数据
const initDate = () => {
  if (spuForm.value.id) { // id存在说明是编辑页面
    // 获取当前spu的图片列表
    getSpuImageList()
    getSpuSaleAttrList(); // 获取当前spu的销售属性列表

  }
  // 新增
  getTrademarkList() // 品牌下拉数据
  getBaseSaleAttrList() // 销售属性下拉
}

onMounted(() => {
  initDate()
})
</script>

<style scoped>
</style>
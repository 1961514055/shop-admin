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
        <el-select :placeholder="`还有${saleAttrList?.length}个未选择`" v-model="attrIdAttrVal">
          <el-option v-for="base in saleAttrList" :key="base.id" :value="`${base.id}:${base.name}`"
            :label="base.name" />
        </el-select>
        <el-button type="primary" :icon="Plus" class="ml-10" @click="addSaleAttr">添加销售属性</el-button>
      </div>
      <!-- 销售属性表格 -->
      <el-table border class="mb-10" :data="spuForm.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column label="属性名" property="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template #default="{ row, $index }">
            <el-tag class="mr-5" v-for="(saleAttrVal, idx) in row.spuSaleAttrValueList" :key="idx" closable
              @close="row.spuSaleAttrValueList.splice(idx, 1)">{{
               saleAttrVal.saleAttrValueName 
              }}
            </el-tag>
            <el-input v-if="row.inputVisible" ref="inputRef" v-model="row.inputValue" class="w-100" size="small"
              @keyup.enter="handleInputConfirm(row)" @blur="handleInputConfirm(row)">

            </el-input>
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
              新增
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <el-table-column label="操作" width="80">
            <template #default="{ row, $index }">
              <el-button type="danger" :icon="Delete" size="small" title="删除属性名"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存按钮 -->
    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, type InputInstance, type UploadProps, type UploadUserFile } from 'element-plus'
import spuApi, { type BaseSaleListModel, type SpuModel, type SpuSaleAttrListModel, type SpuImageListModel, type SpuSaleAttrModel } from '@/api/spu'
import trademarkApi, { type trademarkListModel } from '@/api/trademark';
import { useCategoryStore } from '@/stores/category';
import { SPUSTATUS } from '../index.vue'
import { cloneDeep } from 'lodash';
const categoryStore = useCategoryStore()
// 图片列表
const dialogVisible = ref(false) // 显示预览
const dialogImageUrl = ref('') // 预览图片的url
const inputRef = ref<InputInstance>(); // 始终保持页面中只有一个input显示的时候,它拿的就是显得是那个input

const props = defineProps<{
  spuInfo: SpuModel,
}>()

const emits = defineEmits(['update:modelValue', 'spuInfo'])

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
  /*   // 把所有的变量赋值给收集的变量
    spuImageList.value = uploadFiles as any
    spuImageList.value?.forEach((item: any) => {
      //把url变成本地真实的url
      item.url = item.response.data
      item.imgName = item.name as string
      item.imgUrl = item.url as string
    })
   */
  const tempImgList: SpuImageListModel = []; // 临时的中间变量
  uploadFiles.forEach(item => {
    if (item.response) { //说明是新上传的
      tempImgList.push({
        imgName: item.name,
        imgUrl: (item.response as any).data,
        name: item.name,
        url: (item.response as any).data,
        response: item.response
      })
    } else { // 说明不是新增是修改
      tempImgList.push(item as any)
    }
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
// 销售属性 下拉 
const baseSaleAttrList = ref<BaseSaleListModel>()
const getBaseSaleAttrList = async () => {
  try {
    let result = await spuApi.getSaleAttrList()
    baseSaleAttrList.value = result
  } catch (error) {
    ElMessage.error('获取销售属性下拉数据失败')
  }
}


// 获取图片列表
const spuImageList = ref<SpuImageListModel>()
const getSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageList(spuForm.value.id as number)
    spuImageList.value = result.map(item => {
      return {
        ...item,
        name: item.imgName,
        url: item.imgUrl
      }
    })
  } catch (error) {
    ElMessage.error('获取图片列表失败')
  }
}
// 收集销售属性
// 收集销售属性下拉框数据的时候,即需要收集到id,还需要收集到name
const attrIdAttrVal = ref('');
// 下卡框选择到内容的时候,attrIdAttrVal就收集到了`id:name`
// 当点击添加按钮的时候,应该把当前收集的这个数据,拆开创建一个 销售属性的对象
//    添加到 spuForm.spuSaleAttrList
//    拿着添加好的值去展示
// 当将销售属性添加到 表格中的时候,此时下拉框的的数据将要发生变化
//    已经添加到表格的销售属性不能在下拉框中去显示
//    下拉框不能写死,要么使用computed 要么使用watch
//    同时需要清除掉刚刚选中的值 attrIdAttrVal - 点击按钮的时候

// 下拉框真实展示的数据,需要过滤掉表格中以存在的数据
// baseSaleAttrList -> 原始数据
// saleAttrList 过滤后的数据
// 点击销售属性按钮
const addSaleAttr = () => {
  if (!attrIdAttrVal.value) { return }
  const [baseSaleAttrId, saleAttrName] = attrIdAttrVal.value.split(':')
  spuForm.value.spuSaleAttrList.push({
    baseSaleAttrId: Number(baseSaleAttrId), // 类型不同,需要强转
    saleAttrName,
    spuSaleAttrValueList: [] // 属性值列表也比有
  })
  // 清除已选择的值
  attrIdAttrVal.value = ''

}

// 属性值列表交互
const showInput = (row: SpuSaleAttrModel) => {
  row.inputVisible = true; // 之前的数据是没有这个值的,在点击新增属性值按钮的时候是第一次添加这个值
  /**
  vue2中,初始化的时候没有这个值,后期给添加上这个值是不会响应式的
    只能使用$set()来设置响应式
  vue3中,只要你给数据添加属性就会响应式(ref和reactive)
   */


  nextTick(() => {
    inputRef.value?.focus();
  })
}
// 失焦的时候,将输入的内容添加到 SpuSaleAttrValueListModel 属性值列表中
const handleInputConfirm = (row: SpuSaleAttrModel) => {
  // 判断有没有输入的值
  if (!row.inputValue) {
    row.inputVisible = false;
    return;
  } else {
    // 添加之前要去重
    const isRepate = row.spuSaleAttrValueList.map(item => item.saleAttrValueName).includes(row.inputValue);
    if (isRepate) { // 有重复
      row.inputValue = ""; // 请内容
      row.inputVisible = false; // 切显示
      ElMessage.error('输入属性值重复,请重试')
      return;
    }

    // 将值添加到属性值列表中(添加进去自动v-for循环就会显示)
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrValueName: row.inputValue,
    })
    // 清空输入的内容
    row.inputValue = "";
    // 切换显示
    row.inputVisible = false;
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
// 获取销售属性列表
const spuSaleAttrList = ref<SpuSaleAttrListModel>()
const getSpuSaleAttrList = async () => {
  try {
    let result = await spuApi.getSpuSaleAttrList(spuForm.value.id as number)
    spuForm.value.spuSaleAttrList = result
  } catch (error) {
    ElMessage.error('获取SPU的销售属性列表失败')
  }
}

// 保存
const onSave = async () => {
  // 处理间接收集的数据
  spuForm.value.spuImageList = (spuImageList.value as SpuImageListModel)?.map(item => {
    if (item.id) { // 如果存在说明是老图片
      return item
    } else {
      return {
        imgName: item.imgName as string,
        imgUrl: item.imgUrl as string
      }
    }
  })
  // 清除数据 
  spuForm.value.spuSaleAttrList.forEach(item => {
    delete item.inputVisible
    delete item.inputValue
  })

  // 判断三级联动category3Id是否存在 不存在给他赋值
  if (!spuForm.value.category3Id) {
    spuForm.value.category3Id = categoryStore.category3Id
  }

  // 简单校验
  const { spuName, tmId, category3Id, spuImageList: imgList, spuSaleAttrList } = spuForm.value
  // ------有问题-----
  // if (!(spuName && tmId && category3Id && imgList.length && spuSaleAttrList.length)) {
  //   ElMessage.error('名称、品牌图片列表为必填项！！！')
  //   return
  // }
  // ------有问题-----
  // 发送请求
  try {
    let result = await spuApi.saveSpu(spuForm.value)
    ElMessage.success('保存成功')
    cancelSave()
  } catch (error) {
    ElMessage.error('保存失败！')
  }
}

// 取消保存
const cancelSave = () => {
  emits('update:modelValue', SPUSTATUS.SPULIST)
  emits('spuInfo');
}


// 初始化数据
const initDate = async () => {
  if (props.spuInfo.id) { // id存在说明是编辑页面
    spuForm.value = cloneDeep(props.spuInfo)
    await getSpuImageList(),     // 获取当前spu的图片列表
      await getSpuSaleAttrList(); // 获取当前spu的销售属性列表
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
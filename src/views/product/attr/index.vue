<template>
  <div>
    <el-card class="box-card">
      <div class="text item">
        <CategorySelector :isEdit="isEdit"></CategorySelector>
      </div>
    </el-card>
    <el-card class="box-card mt-10">
      <!-- 列表展示 -->
      <div class="text item" v-show="!isEdit">
        <!-- 添加按钮 -->
        <el-button type="primary" :icon="Plus" size="small" class="mb-10" :disabled="!categoryStore.category3Id"
          @click="isEdit = true">添加属性
          <!-- <el-button type="primary" :icon="Plus" size="small" class="mb-10" @click="isEdit = true">添加属性 -->
        </el-button>
        <!-- 列表表格 -->
        <el-table border :data="attrList">
          <el-table-column label="序号" width="80" type="index" />
          <el-table-column prop="attrName" label="分类" width="160" />
          <el-table-column prop="name" label="属性值列表">
            <template #default="{ row, $index }">
              <el-tag class="mr-10" type="success" v-for="attrVal in row.attrValueList">{{  attrVal.valueName  }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="140">
            <template #default="{ row, $index }">
              <el-button type="warning" size="small" :icon="EditPen" @click="editAttr(row)"></el-button>
              <el-popconfirm :title="`确定要删除[${row.attrName}]吗`" @confirm="removeAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 编辑模式 -->
      <div v-show="isEdit">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrForm.attrName" />
          </el-form-item>
        </el-form>
        <el-button type="primary" class="mb-10" :disabled="!attrForm.attrName" size="small" @click="addAttrVal">添加属性值
        </el-button>

        <!-- 表格 -->
        <el-table border class-name="mb-10" :data="attrForm.attrValueList">
          <el-table-column label="序号" width="140" type="index" />
          <el-table-column prop="valueName" label="属性值名称">
            <template #default="{ row, $index }">
              <el-input v-model="row.valueName" v-if="row.inputVisible" size="small" clearable type="text"
                ref="inputRef" @blur="inputBlur(row, $index)">
              </el-input>

              <div v-else @click="inputFocus(row)">{{  row.valueName  }}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160">
            <template #default="{ row, $index }">
              <el-popconfirm :title="`确定要删除[${row.valueName}]吗`" @confirm="removeAttrVal(row, $index)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
        <!-- 保存按钮 -->
        <div>
          <el-button type="primary" :disabled="!(attrForm.attrName && attrForm.attrValueList.length)" @click="onSave">保存
          </el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { Plus, EditPen, Delete } from "@element-plus/icons-vue";
import { useCategoryStore } from "@/stores/category";
import type { attrInfoModel, attrInfoListModel, attrValueModel } from '@/api/attr'
import attrApi from '@/api/attr'
import { ElMessage, type InputInstance } from "element-plus";
import { cloneDeep } from "lodash";
// 三级分类仓库
const categoryStore = useCategoryStore()
// 平台属性  用来展示数据
const attrList = ref<attrInfoListModel>()
// 控制编辑页面的展示
const isEdit = ref(false)
// 获取input框元素
const inputRef = ref<InputInstance>()

// 初始化表单数据
const initAttrForm = () => ({
  attrName: "",
  attrValueList: [],
  categoryId: undefined,
  categoryLevel: 3
})
// 收集数据  新增-修改
const attrForm = ref<attrInfoModel>(initAttrForm())
// 查询列表数据
const getList = async () => {
  const result = await attrApi.getAttrInfoList(categoryStore.category1Id as number, categoryStore.category2Id as number, categoryStore.category3Id as number)
  attrList.value = result
}
// 添加属性值
const addAttrVal = () => {
  attrForm.value.attrValueList.push({
    valueName: '',
    inputVisible: true,
  })
  // 让input 聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })
}
// 删除新增里面的表格删除
const removeAttrVal = (row: attrValueModel, index: number) => {
  attrForm.value.attrValueList.splice(index, 1)
}
//  新增保存
const onSave = async () => {
  // 校验合法性
  if (!(attrForm.value.attrName && attrForm.value.attrValueList.length)) {
    ElMessage.error('[属性名] 和[属性值列表] 必须有值')
    return
  }
  if (!attrForm.value.categoryId) { // 新增是没有这个值的 值为attrForm.value.categoryId == undefind
    attrForm.value.categoryId = categoryStore.category3Id
  }
  try {
    // 调用接口
    const result = await attrApi.save(attrForm.value)
    ElMessage.success('添加成功')
    // 关闭当前页面 重置表单页
    onCancel()
    // 查询列表数据
    getList()
  } catch (error) {
    ElMessage.error('添加shibai')
    Promise.reject(error)
  }
}
// 取消按钮
const onCancel = () => {
  // 重置表单中的值
  attrForm.value = initAttrForm()
  // 修改控制编辑页面的展示
  isEdit.value = false
}
// 修改
const editAttr = (row: attrInfoModel) => {
  // 拷贝数据
  attrForm.value = cloneDeep(row)
  isEdit.value = true
}
// 删除
const removeAttr = async (row: attrInfoModel) => {
  try {
    await attrApi.del(row.id as number)
    ElMessage.success('删除成功')
    getList() // 查询列表
  } catch (error) {
    ElMessage.error('删除失败')
    Promise.reject(error)
  }
}

// 新增/修改页 input框失焦
const inputBlur = (row: attrValueModel, index: number) => {
  // 失焦的时候如果有值则切换展示div中的内容
  // 如果没有值则把添加的数据干掉
  if (row.valueName) { // 判断是否为空的
    // 判断值是否重复
    const isRepate = attrForm.value.attrValueList.some((item, ind) => {
      if (ind != index) { // 首先要排除当条数据自己跟自己判断
        return item.valueName = row.valueName
      }
    })
    if (isRepate) { // 重复
      ElMessage.error('输入属性值重复！')
      attrForm.value.attrValueList.splice(index, 1)
      return
    }


    // 定义属性控制input框的可输入和不可输入
    row.inputVisible = false // 不可输入


  } else {
    // 删除空的
    attrForm.value.attrValueList.splice(index, 1)
  }
}
// 聚焦
const inputFocus = (row: attrValueModel) => { //点击div触发的
  row.inputVisible = true
  // 让input 聚焦
  nextTick(() => {
    inputRef.value?.focus()
  })

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
<template>
  <el-card class="box-card">
    <!-- 头部 -->
    <template #header>
      <div class="card-header">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">添加</el-button>
      </div>
    </template>
    <!-- 表格 -->
    <el-table border class="mb-10" :data="trademarkList">
      <el-table-column type="index" label="序号" width="180" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="180" />
      <el-table-column prop="logoUrl" label="品牌Logo">
        <!-- 图片设置兼容 -->
        <template #default="{ row, $index }">
          <img :src="row.logoUrl" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button type="warning" :icon="Edit" @click="getOneTradeMark(row)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="delTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-model:currentPage="page" v-model:page-size="limit" :page-sizes="[3, 6, 9]"
      layout=" prev, pager, next, jumper,->, sizes, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新增按钮 模态框-->
    <!-- {trademarkForm.id}?"修改品牌":"新增品牌 -->
    <el-dialog v-model="dialogVisible" title="新增品牌">
      <!-- 表单 -->
      <el-form ref="trademarkFormRef" label-width="120px" class="demo-dynamic" style="width: 500px;"
        :model="trademarkForm" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName" placeholder="请填写品牌名称" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 图片上传 -->
          <el-upload class="avatar-uploader" action="/app-dev/admin/product/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkForm.logoUrl" :src="trademarkForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <!-- 提示信息 -->
            <template #tip>
              <div class="el-upload__tip text-red">
                上传必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部 确定取消按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancelSave(trademarkFormRef)">取消</el-button>
          <el-button type="primary" @click="onSave(trademarkFormRef)">确定</el-button>
        </span>
      </template>

    </el-dialog>
  </el-card>
</template>


<script setup lang="ts">
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { UploadProps, FormRules, FormInstance } from 'element-plus'
import trademarkApi from '@/api/trademark'
import type { trademarkListModel, trademarkModel } from '@/api/trademark'
import { onMounted, ref, reactive } from 'vue';
import { cloneDeep } from 'lodash'

// 定义品牌数据
const trademarkList = ref<trademarkListModel>()
//总条数
const total = ref(0)
// 当前页
const page = ref(1)
// 每页条数
const limit = ref(3)
// 定义关闭模态框标识
const dialogVisible = ref(false)
// 存储图片路径
const imageUrl = ref('')

// 定义表单信息
const trademarkForm = ref<trademarkModel>({
  tmName: '', //品牌名称
  logoUrl: '', // 图片路径
  id: -1
})

const trademarkFormRef = ref<FormInstance>()

// 校验规则
const rules = reactive<FormRules>({
  tmName: [
    { required: true, message: '品牌名必填', trigger: 'blur' },
    { min: 2, message: '最少需要两个字符', trigger: 'blur' },
  ],
  logoUrl: [
    { required: true, message: '品牌LOGO必传', trigger: 'blur' },
  ],
})

// 挂载后加载数据
onMounted(() => {
  getPage()
})

//  获取分页数据
const getPage = async () => {
  try {
    let result = await trademarkApi.get(page.value, limit.value)
    // 赋值数据 品牌信息 总条数
    trademarkList.value = result.records
    total.value = result.total
  } catch (error) {

  }
}
// 分页,跳转到某一页
const handleSizeChange = (val: number) => {
  limit.value = val
  // 发送请求
  getPage()

}
// 点击页码跳转
const handleCurrentChange = (val: number) => {
  page.value = val
  // 发送请求
  getPage()
}

// 点击取消 关闭模态框
const onCancelSave = (formEl: FormInstance | undefined) => {
  console.log("点击");
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false

}

// 点击保存 发送请求 关闭模态框
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      try {
        // 发送请求
        // 根据id是否存在判断是添加还是修改
        if (trademarkForm.value.id === -1) { //-1代表不存在 走添加
          const result = trademarkApi.add({ tmName: trademarkForm.value.tmName, logoUrl: trademarkForm.value.logoUrl })
          trademarkForm.value.tmName = ''
          trademarkForm.value.logoUrl = ''
        } else {
          const result = trademarkApi.update({ id: trademarkForm.value.id, tmName: trademarkForm.value.tmName, logoUrl: trademarkForm.value.logoUrl })
        }
        getPage()
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('失败！')
        Promise.reject(error)
      }
    } else {
      console.log('验证失败!')
      return false
    }
  })
}

// 文件上传成功时的钩子

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // 将上传之后的返回的地址给imgurl赋值
  trademarkForm.value.logoUrl = response.data
}

// 上传文件之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须为jpg格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能大于2M!')
    return false
  }
  return true
}

// 点击修改弹框回显数据
const getOneTradeMark = async (trademark: trademarkModel) => {
  // 将数据进行深拷贝
  trademarkForm.value = cloneDeep(trademark)
  dialogVisible.value = true
}

const delTradeMark = async (row: trademarkModel) => {
  try {
    const result = await ElMessageBox.confirm(
      `确认要删除[${row.tmName}]`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // 判断当前页面是否只有一条数据，如果是则删除成功后需要页面往前跳转一页
    if (trademarkList.value?.length === 1 && page.value != 1) {
      console.log('条数', trademarkList.value?.length);

      page.value -= 1
      console.log('页数', page.value);

    }
    // 调用接口
    await trademarkApi.remove(row.id as number)

    ElMessage.success('删除成功')
    getPage()
  } catch (error) {
  }

}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
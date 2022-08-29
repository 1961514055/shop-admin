<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SUP名称" />
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌">
        <el-option value="哈哈哈" />
        <el-option value="呵呵呵" />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" />
    </el-form-item>
    <!-- 图片上传 -->
    <el-form-item>
      <el-upload action="/app-dev/admin/product/upload" list-type="picture-card" :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select placeholder="还有3个未选择">
          <el-option value="颜色" />
          <el-option value="分类" />
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
import { ref } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'


const dialogVisible = ref(false)
const dialogImageUrl = ref('')

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

</script>

<style scoped>
</style>
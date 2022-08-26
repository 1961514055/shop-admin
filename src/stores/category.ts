import { defineStore } from 'pinia'
import type { categoryModel, categoryListModel } from '@/api/category'
import categoryApi from '@/api/category'
import { ElMessage } from 'element-plus'

// 定义类型
interface CategoryStoreModel {
  category1Id?: number | undefined
  category2Id?: number | undefined
  category3Id?: number | undefined
  category1List: categoryListModel,
  category2List: categoryListModel,
  category3List: categoryListModel,


}
// 定义初始化数据
const initCategoryData = (): CategoryStoreModel => ({
  category1Id: undefined,
  category2Id: undefined,
  category3Id: undefined,
  category1List: [],
  category2List: [],
  category3List: [],
})

export const useCategoryStore = defineStore('category', {
  state: (): CategoryStoreModel => initCategoryData(),
  actions: {
    // 获取一级分类
    async getCategory1List() {
      try {
        let result = await categoryApi.getCategory1ListInfo()
        this.category1List = result
      } catch (error) {
        ElMessage.error('获取一级分类数据失败')
        Promise.reject(error)
      }
    },
    // 获取二级分类数据
    async getCategory2List() {
      // 获取信息前清除二级分类 三级分类的id 及三级分类的列表信息
      this.category2Id = undefined
      this.category3Id = undefined
      this.category3List = []

      try {
        let result = await categoryApi.getCategory2ListInfo(this.category1Id as number)
        this.category2List = result

      } catch (error) {
        ElMessage.error('获取二级分类数据失败')
        Promise.reject(error)
      }
    },
    // 获取三级分类数据
    async getCategory3List() {
      try {
        this.category3Id = undefined
        this.category3List = []
        let result = await categoryApi.getCategory3ListInfo(this.category2Id as number)
        this.category3List = result
      } catch (error) {
        ElMessage.error('获取三级分类数据失败')
        Promise.reject(error)
      }
    },
  },
  getters: {

  }
})
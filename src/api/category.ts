import request from '@/utils/request'



export interface categoryModel {
  id: number,
  name: string,
  category1Id?: number
  category2Id?: number
}
export type categoryListModel = categoryModel[]

export default {
  //获取一级分类数据
  getCategory1ListInfo() {
    return request.get<any, categoryListModel>('/admin/product/getCategory1')
  },
  // 获取二级分类数据
  getCategory2ListInfo(category1Id: number) {
    return request.get<any, categoryListModel>(`/admin/product/getCategory2/${category1Id}`)
  },
  // 获取三级分类数据
  getCategory3ListInfo(category2Id: number) {
    return request.get<any, categoryListModel>(`/admin/product/getCategory3/${category2Id}`)
  },

}
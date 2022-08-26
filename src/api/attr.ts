import request from '@/utils/request'

export interface attrValueModel {
  id?: number,
  attrId?: number,
  valueName: string
}
export interface attrInfoModel {
  id?: number,
  attrName: string,
  attrValueList: attrValueModel[]
  categoryId: number | undefined,
  categoryLevel: number,

}
export type attrInfoListModel = attrInfoModel[]

export default {
  // 查询列表数据--平台属性
  getAttrInfoList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, attrInfoListModel>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 新增 修改
  save(data: attrInfoModel) {
    return request.post<any, null>('/admin/product/saveAttrInfo', data)
  },
  // 删除
  del(attrId: number) {
    return request.delete<any, null>(`/admin/product/deleteAttr/${attrId}`)
  }
}
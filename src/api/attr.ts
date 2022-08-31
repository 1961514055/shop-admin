import request from '@/utils/request'

// 获取所有平台属性列表        attrInfoList       GET     /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// 保存平台属性(新增和更新)    saveAttrInfo       POST    /admin/product/saveAttrInfo
// 删除平台属性               deleteAttr         DELETE  /admin/product/deleteAttr/{attrId}
// 根据属性id获取属性详情      getAttrValueList   GET     /admin/product/getAttrValueList/{attrId}


export interface AttrValueModel {
  valueName: string,
  id?: number,
  attrId?: number,
  inputVisible?: boolean, // 前端交互使用,和后端没关系
}

export interface AttrModel {
  id?: number,
  attrName: string, // 属性名
  attrValueList: AttrValueModel[], // 表格中添加的属性值列表
  categoryId: number | undefined, // 三级分类的id(不是二级,不是一级)
  categoryLevel: number, // 第几级分类,写死是 3 
  attrIdValueId: string, // 前端skuForm页面使用
}

// 以后写限制类型的TS interface
//    直接先看保存,保存是必传参数
//    再看查看列表,非必传参数就会有
export default {
  // 获取列表
  getAttrInfoList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrModel[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 保存
  save(data: AttrModel) { // 保存是必传的参数
    return request.post<any, null>(`/admin/product/saveAttrInfo`, data);
  },
  // 删除
  delete(attrId: number) {
    return request.delete<any, null>(`/admin/product/deleteAttr/${attrId}`)
  }
}


import request from '@/utils/request'


export default {
  //查询
  getAttrInfoList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 新增 修改
  update() {
    return request.post('/admin/product/saveAttrInfo')
  },
  del() {
    return request.delete('/admin/product/deleteAttr')
  }
}
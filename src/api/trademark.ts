import request from '@/utils/request'


// 定义品牌信息类型
export interface trademarkModel {
  id?: number, //品牌id
  logoUrl: string, //logo图片
  tmName: string //品牌名称
}

export type trademarkListModel = trademarkModel[]
//定义分页返回类型
export interface pageListModel {
  current: number, //当前页
  pages: number, // 总页数
  records: trademarkModel[], //品牌信息
  searchCount: boolean,
  size: number, // 每页记录数
  total: number //总条数
}



export default {
  // 分页 page ：当前页码, limit：每页记录数
  get(page: number, limit: number) {
    return request.get<any, pageListModel>(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  // 添加
  add(data: trademarkModel) {
    return request.post('/admin/product/baseTrademark/save', data)
  },
  // 查询单条数据一个
  getOne(id: number) {
    return request.get<any, trademarkModel>(`/admin/product/baseTrademark/get/${id}`)
  },


  //修改
  update(data: trademarkModel) {
    return request.put<any, null>('/admin/product/baseTrademark/update', data)
  },
  // 删除
  remove(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${id}`)
  }
}

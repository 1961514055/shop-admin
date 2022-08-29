import request from '@/utils/request'

// 定义数据详情信息返回类型
interface listDetailModel {
  category3Id: number,
  createTime: string,
  id: number,
  price: number,
  skuAttrValueList: null,
  skuDefaultImg: number,
  skuDesc: string,
  skuImageList: null,
  skuName: string,
  skuSaleAttrValueList: null,
  spuId: number,
  tmId: number,
  weight: number
}
// 定义页面数据返回类型 包含分页所需信息
interface listModel {
  current: number, // 当前页码
  pages: number, // 总页数
  records: listDetailModel[], // 数据详情信息
  searchCount: boolean,
  size: number, // 每页多少条
  total: number, // 总条数
}

// 商品管理-sku管理接口
export default {
  // 查询列表数据 分页
  getList(page: number, limit: number) { // page当前页码  limit每页记录数
    return request.get(`/admin/product/list/${page}/${limit}`)
  }
}
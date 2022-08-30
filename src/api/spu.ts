import request from '@/utils/request'
// 用于销售属性下拉框类型
export interface BaseSaleModel {
  id: number,
  name: string
}
export type BaseSaleListModel = BaseSaleModel[]

// 图片列表
export interface SpuImageModel {
  id?: number, // 保存没有
  spuId?: number, // 保存没有
  imgName: string, // 图片名称
  imgUrl: string, // 图片url
  // -------
  name?: string, // 前端交互使用
  url?: string, // 前端交互使用
  response?: any, // 前端交互使用
}
export type SpuImageListModel = SpuImageModel[]

export interface SpuSaleAttrValueModel {
  id?: number,
  spuId?: number,
  saleAttrName?: string,
  isChecked?: null,
  baseSaleAttrId: number, // 销售属性的id 和 上一层级的数据的销售属性id是一个值
  saleAttrValueName: string, // 输入的销售属性值内容
}
export type SpuSaleAttrValueListModel = SpuSaleAttrValueModel[]

// 销售属性 - 是表格每一行的数据
// 数据来源 - 来源于销售属性的下拉数据
export interface SpuSaleAttrModel {
  id?: number,
  spuId?: number,
  baseSaleAttrId: number, // 销售属性id
  saleAttrName: string, // 销售属性的name
  spuSaleAttrValueList: SpuSaleAttrValueListModel
}

export type SpuSaleAttrListModel = SpuSaleAttrModel[]
//  spu信息
export interface SpuModel {
  id?: number,
  spuName: string, // spu名称
  description: string, // spu描述
  category3Id: number | undefined, // 三级分类的id
  tmId: number | undefined, // 品牌id
  spuSaleAttrList: SpuSaleAttrListModel, // spu销售属性列表
  spuImageList: SpuImageListModel  // spu图片列表
}
// spu信息 数组
export type SpuListModel = SpuModel[]
// 查询分页返回值
export interface SpuPageModel {
  records: SpuListModel,
  total: number,
  size: number,
  current: number,
  pages: number,
  searchCount: boolean, // 没用
}
// 获取分页列表数据
export default {
  getPage(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },
  // 获取销售属性 - 新增展示下拉框
  getSaleAttrList() {
    return request.get<any, BaseSaleListModel>(`/admin/product/baseSaleAttrList`);
  },
  // 获取当前spu的图片列表
  getSpuImageList(spuId: number) {
    return request.get<any, SpuImageListModel>(`/admin/product/spuImageList/${spuId}`)
  },
  // 获取当前spu的销售列表
  getSpuSaleAttrList(spuId: number) {
    return request.get<any, SpuSaleAttrListModel>(`/admin/product/spuSaleAttrList/${spuId}`)

  }
}
import request from '@/utils/request'

// 获取spu分页数据           GET   /admin/product/${ page }/${ limit }?category3Id=${ category3Id }
// 保存spu                  POST  /admin/product/saveSpuInfo
// 获取销售属性列表          GET   /admin/product/baseSaleAttrList - 新增要调用
// 获取品牌下拉列表          GET   /admin/product/baseTrademark/getTrademarkList - 这个接口写哪,写到trademark.ts中 - 新增要调用
// 获取当前spu图片列表       GET   /admin/product/spuImageList/${ spuId } - 编辑的时候拿
// 获取当前spu销售属性列表   GET   /admin/product/spuSaleAttrList/${ spuId } - 编辑的时候拿
// 更新spu                  POST  /admin/product/updateSpuInfo
// 删除spu                  DELETE /admin/product/deleteSpu/${ spuId }

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
  isDefault: string // skuForm设置默认图片使用
}
export type SpuImageListModel = SpuImageModel[]


// 用于销售属性下拉框类型
export interface BaseSaleModel {
  id: number,
  name: string
}
export type BaseSaleListModel = BaseSaleModel[]


// 销售属性值
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
  spuSaleAttrValueList: SpuSaleAttrValueListModel,
  inputVisible?: boolean, // 前端交互使用
  inputValue?: string, // 前端交互使用
  attrIdValueId: string, // SkuForm中使用,收集两个id
}
export type SpuSaleAttrListModel = SpuSaleAttrModel[]

export interface SpuModel {
  id?: number,
  spuName: string, // spu名称
  description: string, // spu描述
  category3Id: number | undefined, // 三级分类的id
  tmId: number | undefined, // 品牌id
  spuSaleAttrList: SpuSaleAttrListModel, // spu销售属性列表
  spuImageList: SpuImageListModel  // spu图片列表
}
export type SpuListModel = SpuModel[]

export interface SpuPageModel {
  records: SpuListModel,
  total: number,
  size: number,
  current: number,
  pages: number,
  searchCount: boolean, // 没用
}

export default {
  // 获取分页
  getPage(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },
  // 保存spu
  saveSpu(spuInfo: SpuModel) {
    return request.post<any, null>(`/admin/product/${spuInfo.id ? 'updateSpuInfo' : 'saveSpuInfo'}`, spuInfo);
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
  },
  // 删除spu
  delete(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${spuId}`)
  }
}
import request from '@/utils/request'

// GET /admin/product/baseTrademark/{page}/{limit}  分页
// POST /admin/product/baseTrademark/save 新增
//  PUT /admin/product/baseTrademark/update 修改
// DELETE /admin/product/baseTrademark/remove/{id} 删除


export default {
  // 分页 page ：当前页码, limit：每页记录数
  getPage(page:number, limit:number){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  save(){
    return request.post('/admin/product/baseTrademark/save')
  },
  update(){

  },
  remove(){

  }
}

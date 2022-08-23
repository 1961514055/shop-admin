import request from '@/utils/request'

// 登录管理


//定义 userParam 类型
interface userParamModel {
  username:string,
  password:string
}
// 定义登录成功之后token的返回值类型
interface tokenModel{
  token:string
}

// 登录
export default {
  login(userParam:userParamModel){
    return request.post<any,tokenModel>('/admin/acl/index/login',userParam)
  }
}
import request from '@/utils/request'

// 用户管理


//定义 userParam 类型
interface userParamModel {
  username:string,
  password:string
}
// 定义登录成功之后token的返回值类型
interface tokenModel{
  token:string
}

// 定义info返回的类型
interface infoModel{
  avatar:string,
  buttons:string[],
  name:string,
  roles:string[],
  routes:string[]
}



// 登录
export default {
  login(userParam:userParamModel){
    return request.post<any,tokenModel>('/admin/acl/index/login',userParam)
  },
  
// 获取用户信息
// GET /admin/acl/index/info
  info(){
    return request.get<any,infoModel>(`/admin/acl/index/info`)
  },
  

  //登出
  // POST 
  loginOut(token:string){
    return request.post<any,null>('/admin/acl/index/logout',token)
  }
}


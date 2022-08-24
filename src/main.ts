import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'

const app = createApp(App)


ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')





import {useUserInfoStore} from '@/stores/userInfo'
// 测试登录
import userInfo from '@/api/userInfo'

// 调用登录接口
async function fn(){
  const result = await userInfo.login({username:'admin',password:'111111'})  
  console.log('登录成功',result);
  // 存到仓库中
  const userInfoStore = useUserInfoStore();
  localStorage.setItem('vue_admin_template_token', result.token); // 这就是个字符串
  userInfoStore.token = result.token
  console.log('仓库---',userInfoStore.token);
    
}
fn()

// 测试用户信息
async function users(){
  const result = await userInfo.info();
  console.log("users-->",result);
  
}
users()

// 测试登出
async function out() {
  const result = await userInfo.loginOut('eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSSkzJzcxT0lFKrShQsjI0MzM0MrU0sTCoBQAEClaGIAAAAA.5FXLOtzYXMpnoJ7AvC95z62xIk5F2bgr5id8OiAHOnt6MuZraGknLMnTrZdxsVaSgV9R-rflZfn-8TbZ2gU6Tw');
  console.log('登出成功111111');
  
}

out()


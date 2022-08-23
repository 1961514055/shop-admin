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


  // 测试登录
  import userInfo from '@/api/userInfo'

  // 调用登录接口
  async function fn(){
    const result = await userInfo.login({username:'admin',password:'111111'})    
  }

  fn()

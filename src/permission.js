import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken ,setToken} from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/resetPwd']

router.beforeEach((to, from, next) => {
  NProgress.start()
  // setToken('233434234')
  console.log('getToken()',getToken())
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.permissions.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then((res) => {
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
             next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      console.log('重定向到登录页,',to.fullPath)
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

// const dealRoute = (data) =>{
//   data.forEach((el)=>{
//     console.log("el ===>",el)
//     const aname = el.component
//     const component = Vue.component('button-counter',{
//       data: function () {
//        return {
//          count: 0
//        }
//      },
//      template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
//    });
//   })
// }

router.afterEach(() => {
  NProgress.done()
})

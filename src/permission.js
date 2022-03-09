import router, { constantRoutes } from './router'
import Router from 'vue-router'

import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken, } from '@/utils/auth'
import { objReduce } from '@/utils/ddc'

import { http_request } from './api'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/resetPwd', '/protocol', '/privacy']




router.beforeEach((to, from, next) => {
  NProgress.start()
  // setToken('233434234')
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
            console.log('router', router)

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

        if (to.path.includes('app')) {
          const tmpMenus = JSON.parse(JSON.stringify(store.getters.menus));
          addAppPage(tmpMenus).then((count) => {
            if (count != store.getters.addMenusTotal) {
              store.commit('SET_ADDMENUSTOTAL', count)
              store.dispatch('GenerateRoutes').then(accessRoutes => {
                resetRouter()

                router.addRoutes(accessRoutes) // 动态添加可访问路由表
                console.log('router m', router)
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
            } else {
              next()
            }
          })

        } else {
          next()
        }

      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      console.log('重定向到登录页,', to.fullPath)
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})


// 清理路由
const resetRouter = () => {
  const newRouter = new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher // reset router
}

const addAppPage = async (menu) => {
  // 添加应用动态路由
  const obj = {
    moduleName: "http_app",
    method: "get",
    url_alias: "listAppRouterConfig",
  }
  const res = await http_request(obj)
  // 处理数据
  const tmpData = JSON.parse(JSON.stringify(res.data))
  if (tmpData.length === 0) return 0
  tmpData.forEach(el => {
    el.hidden = true
    el.meta = {
      title: el.name,
      noCache: false
    }
  });
  // console.log('动态应用路由', tmpData)

  menu.forEach((el) => {
    if (el.name === '应用' && el.path === '/app') {
      el.children = el.children.concat(tmpData)
      const tmp = JSON.parse(JSON.stringify(el.children))
      el.children = objReduce(tmp, 'component')
    }
  })

  // console.log('结果', menu)
  store.commit('SET_MENUS', menu)
  return tmpData.length
}



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

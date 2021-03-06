import { constantRoutes } from '@/router';
import { getRouters } from '@/api/menu';
import Layout from '@/layout/index';
import ParentView from '@/components/ParentView';
import InnerLink from '@/layout/components/InnerLink';
import { http_request } from '@/api';
import store from '@/store';
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    sideSecondRouters:[]
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      // const index = [
      //   {
      //     path: 'index',
      //     meta: { title: '统计报表', icon: 'dashboard' },
      //   },
      // ];
      state.topbarRouters = routes;
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    },
    //sideSecondRouters
    SET_SIDE_SECOND_ROUTERS:(state, routes)=> {
      state.sideSecondRouters = routes;
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      const menus = store.getters.menus;
     
      const sdata = JSON.parse(JSON.stringify(menus));
      const rdata = JSON.parse(JSON.stringify(menus));
    
      // 需要更改
      sdata.map(item => {
        if (item.component === null) {
          item.component = 'Layout'
        }
      })
      rdata.map(item => {
        if (item.component === null) {
          item.component = 'Layout'
        }
      })
      const sidebarRoutes = filterAsyncRouter(sdata);
      const rewriteRoutes = filterAsyncRouter(rdata, false, true);
      // changeSingleTitle(rewriteRoutes) //标签栏 只有一个子组件时显示夫名称
      rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true });
      commit('SET_ROUTES', rewriteRoutes);
      // test
      commit('SET_SIDEBAR_ROUTERS', sidebarRoutes);
      // commit('SET_DEFAULT_ROUTES', sidebarRoutes);
      // commit('SET_TOPBAR_ROUTES', sidebarRoutes);
      return rewriteRoutes;
    },
  },
};

const changeSingleTitle = (data) => {
  data.forEach((el) => {
    if (el.children && el.children.length > 0) {
      let realTotal = 0
      el.children.forEach(item=>{
        if(!item.hidden){
          realTotal++
        }
      })
      if(realTotal ===1){
        el.children.forEach(item=>{
          if(!item.hidden){
            item.meta.title = el.meta.title
          }
        })
      }
    }

  })
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else if (route.component === 'InnerLink') {
       
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c) => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;

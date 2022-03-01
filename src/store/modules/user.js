import {
  login,
  logout,
  getInfo
} from "@/api/login";
import {
  getToken,
  getOnceToken,
  setToken,
  setOnceToken,
  removeToken,
  removeOnceToken
} from "@/utils/auth";
import {
  http_request
} from "../../api";

const user = {
  state: {
    token: getToken(),
    onceToken: getOnceToken(),
    name: "",
    avatar: "",
    permissions: [],
    menus: [],
    nickName: "",
    test: '',
    company_name: '',
    phoneNumber: ''
  },

  mutations: {
    SET_TEST: (state, data) => {
      console.log(' state.test', state.test)
      state.test = data
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName;
    },
    SET_COMPANY_NAME: (state, company_name) => {
      state.company_name = company_name;
    },
    SET_ONCETOKEN: (state, onceToken) => {
      state.onceToken = onceToken;
    },
    SET_PHONENUMBER: (state, phoneNumber) => {
      state.phoneNumber = phoneNumber;
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      userInfo.telephone = userInfo.telephone.trim();
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "post",
          url_alias: "login",
          data: userInfo
        };
        console.log('登录参数', obj)
        http_request(obj)
          .then(res => {
            if (!res.data.access_token) return resolve();
            setToken(res.data.access_token);
            commit("SET_TOKEN", res.data.access_token);
            setOnceToken(res.data.access_token);
            commit("SET_ONCETOKEN", res.data.access_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    LoginBySms({
      commit
    }, userInfo) {
      userInfo.telephone = userInfo.telephone.trim();
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "post",
          url_alias: "loginBySms",
          data: userInfo
        };
        console.log('短信登录参数', obj)
        http_request(obj)
          .then(res => {
            if (!res.data.access_token) return resolve();
            setToken(res.data.access_token);
            commit("SET_TOKEN", res.data.access_token);
            setOnceToken(res.data.access_token);
            commit("SET_ONCETOKEN", res.data.access_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "getInfo"
        };
        http_request(obj)
          .then(res => {
            console.log('res userinfo', res.data)
            if (!res) return;
            const menu = JSON.parse(JSON.stringify(res.data.menus))
            const user = res.data.user;
            user.avatar = user.avatar || '';
            const avatar =
              user.avatar == ""
                ? require("@/assets/images/profile.png")
                : process.env.VUE_APP_BASE_API + user.avatar;
            addAppPage(menu).then(() => {
              commit('SET_MENUS', menu)
              commit("SET_PERMISSIONS", res.data.permissions);
            commit("SET_NAME", user.userName);
            commit("SET_NICKNAME", user.nickName);
            commit("SET_AVATAR", avatar);
            commit("SET_COMPANY_NAME", res.data.company.name);
            commit("SET_PHONENUMBER", user.phoneNumber);
            resolve(res.data);
            })
            
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getLoginInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "getInfo"
        };
        http_request(obj)
          .then(res => {
            console.log('res logininfo', res.data)

            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "delete",
          url_alias: "logout"
        };
        http_request(state).then(() => {
          commit("SET_TOKEN", "");
          // commit("SET_ROLES", []);
          commit("SET_PERMISSIONS", []);
          removeToken();
          resolve();
        })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    },
    //无登录权限处理
    NoAuth({ commit }) {
      return new Promise(resolve => {
        //清楚缓存token,但是保留vuex中的token用户身份认证信息获取
        removeToken();
        resolve();
      })
    },

  }
};


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
  tmpData.forEach(el => {
    el.meta = {
      title:el.name,
      noCache:false
    }
  });
  console.log('动态应用路由', tmpData)

  menu.forEach((el) => {
    if (el.name === '应用' && el.path === '/app') {
      console.log('就是你了', el)
      el.children =  el.children.concat(tmpData)
      // el.children.push(res.data[0])
    }
  })
  console.log('结果', menu)
}
export default user;

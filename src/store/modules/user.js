import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { http_request } from "../../api";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    permissions: [],
    menus:[],
    nickName: "",
    test:'',
    company_name:''
  },

  mutations: {
    SET_TEST:(state ,data) =>{
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
    SET_MENUS:(state, menus)=>{
      state.menus = menus
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName;
    },
    SET_COMPANY_NAME: (state, company_name)=> {
      state.company_name = company_name;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      userInfo.telephone = userInfo.telephone.trim();
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "post",
          url_alias: "login",
          data: userInfo
        };
        console.log('登录参数',obj)
        http_request(obj)
          .then(res => {
            if(!res.data.access_token) return resolve();
            setToken(res.data.access_token);
            commit("SET_TOKEN", res.data.access_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    LoginBySms({ commit }, userInfo) {
      userInfo.telephone = userInfo.telephone.trim();
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "post",
          url_alias: "loginBySms",
          data: userInfo
        };
        console.log('短信登录参数',obj)
        http_request(obj)
          .then(res => {
            if(!res.data.access_token) return resolve();
            setToken(res.data.access_token);
            commit("SET_TOKEN", res.data.access_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "getInfo"
        };
        http_request(obj)
          .then(res => {
            console.log('res userinfo',res.data)
            if (!res) return;
            const user = res.data.user;
            user.avatar = user.avatar || '';
            const avatar =
              user.avatar == ""
                ? require("@/assets/images/profile.jpg")
                : process.env.VUE_APP_BASE_API + user.avatar;
                console.log('avatar',avatar)
              commit('SET_MENUS',res.data.menus)
              commit("SET_PERMISSIONS", res.data.permissions);
            commit("SET_NAME", user.userName);
            commit("SET_NICKNAME", user.nickName);
            commit("SET_AVATAR", avatar);
            commit("SET_COMPANY_NAME", res.data.company.name);
            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
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
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};

export default user;

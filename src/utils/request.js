import axios from 'axios'
import {
  Notification,
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
  tansParams,
  parseTime
} from '@/utils/ruoyi'
import {
  defaultH
} from '@/api'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  //  console.log(config)
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== '' && value !== null && value !== undefined && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && typeof (value[key]) !== 'undefined') {
              let params = propName + '[' + key + ']';
              let subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
      return Promise.reject('令牌验证失败')
      // } else if (code === 500 && res.data.msg === '手机号已存在') {

    } else if (code === 500) {
      if (msg === '手机号已存在') {
        return Promise.reject(msg) //wyp
      } else {
        Message({
          message: msg,
          type: 'error',
          duration: 3 * 1000,
          showClose: true
        })
        return Promise.reject(new Error(msg)) //原代码
      }

      
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let {
      message
    } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 3 * 1000,
      showClose: true
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename, headers, type = '.xlsx') {
  filename = filename + '_' + parseTime(new Date(), '{y}{m}{d}{h}{i}') + type;
  Message({
    message: '导出中，请稍候',
    type: 'info',
    duration: 3 * 1000,
    showClose: true
  });
  return service.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params);
    }],
    headers: Object.assign({}, defaultH, {
      'Content-Type': headers || 'application/x-www-form-urlencoded'
    }),
    responseType: 'blob',
    timeout: 10 * 60 * 1000 // 有些表导出数据量太大, 超时时间设为10分钟
  }).then((data) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      const result = reader.result.length < 100 ? JSON.parse(reader.result) : ''; // 内容就在这里
      if (Object.prototype.toString.call(result) === '[object Object]' && (result.code === 400 || result.code === 404)) {
        // 400
        Message({
          message: result.msg,
          type: 'error',
          duration: 3 * 1000,
          showClose: true
        });
      } else {
        // success
        Message({
          message: '导出成功',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        });
        const content = data;
        const blob = new Blob([content]);
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a');
          elink.download = filename;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          navigator.msSaveBlob(blob, filename);
        }
      }
    };
    reader.readAsText(data);
  }).catch((r) => {
    Message({
      message: '导出失败',
      type: 'error',
      duration: 3 * 1000,
      showClose: true
    });
    console.error(r);
  });
}

// 通用下载字典方法
export function getDicts(dictType, dictObj) {
  const formData = new FormData()
  if (!dictType && dictObj) {
    formData.append('status', dictObj.status)
    formData.append('dictPid', dictObj.dictPid)
    formData.append('dictType', dictObj.dictType)
  } else {
    formData.append('dictType', dictType)
  }
  console.log('formData', formData)
  return service.post('/chy/system/dict/data/listByDict', formData, {
    headers: Object.assign({}, defaultH, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
}

export default service

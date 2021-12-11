import request from '@/utils/request'
import http_login from './login'
import http_menu from './menu'
import http_vehicle from './archives/vehicle'
import http_driver from './archives/driver'
import http_employee from './archives/employee'
import http_role from './archives/role'
import http_org from './archives/org'
import http_group from './archives/group'
import http_warning from './archives/warning'
import http_common from './common'
import http_dispatch from './dispatch/dispatch'
import http_purse from './finance/purse'
import http_map from './map/map';
import http_monitor from './monitor/carlist'
import http_home from './home/home'
import http_company from './archives/company'
import http_address from './archives/address'
import http_statistic from './statistic/statistic'
import http_weight from './weight/weight'
import Vue from 'vue'

export const defaultH = {
  "App-Code": '6d818ca732214b6e889dbf6ac3d25aee', //应用编码
  "App-Type": 0,
  "App-Version": '1.0.0',
  "Produce-Code": '1c3646219beb4c7b978b4600965b2c9f',
  "Terminal-Type": 'web',
  "Content-Type": "application/json"
}

/**
* 将各个对象挂上
* @param {string} 请求包名 name 
* @returns 
*/
const selModuleName = (name) => {
  const tmpObj = {
    http_login,
    http_menu,
    http_vehicle,
    http_driver,
    http_employee,
    http_role,
    http_org,
    http_group,
    http_common,
    http_dispatch,
    http_warning,
    http_purse,
    http_map,
    http_monitor,
    http_home,
    http_company,
    http_address,
    http_statistic,
    http_weight
  }
  return tmpObj[name]
}

/**
 * 请求封装
 * @param {*} obj 
 * moduleName, 必填
 * method, 必填 请求类型
 * url_alias, 必填 url对象对应的key
 *  url_code = [],  参数code
 * data   param或者body  
 * header  配置头部数据 
 * query  true/false
 * @returns 
 */
export const http_request = async  (obj) =>  {
  const tmp = {};
  if (!obj.moduleName || !obj.method || !obj.url_alias) return console.error('请填写请求必要条件')
  const request_url = selModuleName(obj.moduleName)
  // get url
  if (!obj.url_code || obj.url_code.length === 0) {
    tmp.url = request_url[obj.url_alias];
  } else {
    tmp.url = request_url[obj.url_alias](...obj.url_code);
  }
  //method
  tmp.method = obj.method;
  //data or params
  if (obj.method === 'get' || obj.query) {
    obj.data ? tmp.params = obj.data : null;
  } else {
    obj.data ? tmp.data = obj.data : null;
  }
  //header
  tmp.headers = defaultH
  if (obj.header) tmp.headers = { ...tmp.headers, ...obj.header }
  //  console.log('最终结果',tmp)
  const res  = await  request(tmp);
  return res
};

/**
 * 处理请求返回结果
 * @param {any} res 
 * @returns 请求返回处理结果 or null
 */
const error_respone = (res) =>{
  if(!res) console.error('res error null')
  if(res.code == '200') return res
  Vue.msgErro(res.message)
  if(res.code == '500') return
  const emnu = {
    '40100':'帐号被停用',
    '40110':'短信/图形验证码不匹配',
    '40120':'无业务访问权限',
    '40130':'数据存在无权操作',
    '40400':'通过帐号/手机号/邮箱进行获取不到用户',
    '40401':'用户被伪删除',
    '40402':'帐号（手机号）不存在/密码错误',
    '40410':'验证码已过期',
    '40420':'缺少必要参数',
    '40430':'缺少查询的数据记录',
    '50601':'缺少个推配置信息',
    '50602':'调用个推接口获取手机信息失败',
    '50700':'业务异常',
    '50800':'服务调用异常'
  }
  console.log(emnu[res.code])
  return null
}


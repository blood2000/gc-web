import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import {defaultH} from '@/api'


// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 查询字典类
export function listByDict(data) {
  return request({
    url: '/chy/system/dict/data/listByDict',
    method: 'post',
    data: data,
    headers: {
      'Authorization': getToken(),
      'Produce-Code': defaultH['Produce-Code'],
      'App-Code': defaultH['App-Code'],
      'App-Version':defaultH['App-Version'],
      'Terminal-Type': defaultH['Terminal-Type'],
      'Content-Type':'application/x-www-form-urlencoded',
    },
  });
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}

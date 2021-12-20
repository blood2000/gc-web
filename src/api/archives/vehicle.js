
// 测试
export default {
  vehicle_add: '/fmsweb/basic/vehicle/v2/add', // 添加车辆
  vehicle_edit: '/fmsweb/basic/vehicle/v2/edit', //修改车辆
  vehicle_del: `/fmsweb/basic/vehicle/v2/delete`, //删除车辆
  vehicle_list: '/fmsweb/basic/vehicle/v2/list', //查询车辆
  vehicle_detail: (code) => {
    return `/fmsweb/basic/vehicle/v2/detail/${code}`
  }, //车辆详情
  vehicle_list_page: '/fmsweb/basic/vehicle/v2/paging',//获取分页 
  vehicle_enabled: '/fmsweb/basic/vehicle/v1/updateEnabled', //修改停用状态
  paging_de_driver: '/fmsweb/basic/vehicle/v2/pagingDefaultDriver',
  device_list: '/fmsweb/basic/org/device/v1/list',//获取当前组织所有设备列表
  device_paging: '/fmsweb/basic/org/device/v1/paging',//获取当前组织所有设备分页列表
  device_bind: '/fmsweb/vehicle/device/v1/binding',//绑定设备
  device_unbind: '/fmsweb/vehicle/device/v1/unbinding',//解除绑定
  qrcode_decode: (type) => `/fmsweb/basic/common/v1/qrcode/decode/${type}`,
  checkAdd: '/fmsweb/basic/vehicle/v2/checkAdd',  //校验车辆
  confirmAdd: '/fmsweb/basic/vehicle/v2/confirmAdd', //确认添加
  checkDelete:'/fmsweb/basic/vehicle/v2/checkDelete',//校验车辆删除
}

// 正式
// export default {
//   vehicle_add: '/fmsweb/basic/vehicle/v1/add', // 添加车辆
//   vehicle_edit: '/fmsweb/basic/vehicle/v1/edit', //修改车辆
//   vehicle_del: `/fmsweb/basic/vehicle/v1/delete`, //删除车辆
//   vehicle_list: '/fmsweb/basic/vehicle/v1/list', //查询车辆
//   vehicle_detail: (code) => {
//     return `/fmsweb/basic/vehicle/v1/detail/${code}`
//   }, //车辆详情
//   vehicle_list_page: '/fmsweb/basic/vehicle/v1/paging',//获取分页 
//   vehicle_enabled: '/fmsweb/basic/vehicle/v1/updateEnabled', //修改停用状态
//   paging_de_driver: '/fmsweb/basic/vehicle/v1/pagingDefaultDriver',
//   device_list: '/fmsweb/basic/org/device/v1/list',//获取当前组织所有设备列表
//   device_paging: '/fmsweb/basic/org/device/v1/paging',//获取当前组织所有设备分页列表
//   device_bind: '/fmsweb/vehicle/device/v1/binding',//绑定设备
//   device_unbind: '/fmsweb/vehicle/device/v1/unbinding',//解除绑定
//   qrcode_decode: (type) => `/fmsweb/basic/common/v1/qrcode/decode/${type}`,
//   checkAdd: '/fmsweb/basic/vehicle/v1/checkAdd',  //校验车辆
//   confirmAdd: '/fmsweb/basic/vehicle/v1/confirmAdd', //确认添加
//   checkDelete:'/fmsweb/basic/vehicle/v1/checkDelete',//校验车辆删除
// }
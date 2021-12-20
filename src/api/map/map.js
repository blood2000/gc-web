// //测试
export default {
  orgVehicleTree:'/fmsweb/basic/org/v2/orgVehicleTree', //查询组织车辆树
  orgDriverTree:'/fmsweb/basic/org/v2/orgDriverTree', //查询组织司机树
  countVehicle:'/fmsweb/basic/vehicle/v2/countEachStatus', //统计各状态车辆数
  countDriver:'/fmsweb/basic/driver/v2/countEachStatus', // 统计各状态司机数
  getVehicleLoLocations:'/fmsweb/vehicle/device/v1/locations', // 获取车辆定位列表
  getDeviceLocationInfo:(plateNumber)=>`/fmsweb/vehicle/device/v1/location/${plateNumber}`, // 获取设备定位信息
  getVehicleInfo:(vehicleCode,type)=>`/fmsweb/vehicle/device/v1/detail/${vehicleCode}/${type}`, // 获取车辆信息接口
  getAppointCarOrderIng:(vehicleCode)=>`/fmsweb/basic/appointCarOrder/v1/detailAppointCarOrderIngByVehicleCode/${vehicleCode}`, // 获取当前正在运行中的派车单
  getWarnCount:'/fmsweb/alarm/v1/getTodayVehicleAlarmNotification', // 获取告警条数
  getRealWarnList:'/fmsweb/alarm/v1/realTimeNotificationList', // 实时获取车辆告警通知列表
  getOtherWarnList:'/fmsweb/alarm/v1/alarmObjectNotificationList', // 获取车辆/设备/人员告警
  getOtherWarnDetail:'/fmsweb/alarm/v1/vehicleAlarmNotificationListDetails', // 获取车辆/设备/人员告警详情列表
  getVehicleTrack:'/fmsweb/vehicle/device/v1/track', // 查询车辆历史轨迹
  getVehicleEventTrack:'/fmsweb/vehicle/event/v1/list' // 查询事件轨迹
}

//正式
// export default {
//   orgVehicleTree:'/fmsweb/basic/org/v1/orgVehicleTree', //查询组织车辆树
//   orgDriverTree:'/fmsweb/basic/org/v1/orgDriverTree', //查询组织司机树
//   countVehicle:'/fmsweb/basic/vehicle/v1/countEachStatus', //统计各状态车辆数
//   countDriver:'/fmsweb/basic/driver/v1/countEachStatus', // 统计各状态司机数
//   getVehicleLoLocations:'/fmsweb/vehicle/device/v1/locations', // 获取车辆定位列表
//   getDeviceLocationInfo:(plateNumber)=>`/fmsweb/vehicle/device/v1/location/${plateNumber}`, // 获取设备定位信息
//   getVehicleInfo:(vehicleCode,type)=>`/fmsweb/vehicle/device/v1/detail/${vehicleCode}/${type}`, // 获取车辆信息接口
//   getAppointCarOrderIng:(vehicleCode)=>`/fmsweb/basic/appointCarOrder/v1/detailAppointCarOrderIngByVehicleCode/${vehicleCode}`, // 获取当前正在运行中的派车单
//   getWarnCount:'/fmsweb/alarm/v1/getTodayVehicleAlarmNotification', // 获取告警条数
//   getRealWarnList:'/fmsweb/alarm/v1/realTimeNotificationList', // 实时获取车辆告警通知列表
//   getOtherWarnList:'/fmsweb/alarm/v1/alarmObjectNotificationList', // 获取车辆/设备/人员告警
//   getOtherWarnDetail:'/fmsweb/alarm/v1/vehicleAlarmNotificationListDetails', // 获取车辆/设备/人员告警详情列表
//   getVehicleTrack:'/fmsweb/vehicle/device/v1/track', // 查询车辆历史轨迹
//   getVehicleEventTrack:'/fmsweb/vehicle/event/v1/list' // 查询事件轨迹
// }
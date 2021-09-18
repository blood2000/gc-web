export default {
  orgVehicleTree:'/fmsweb/basic/org/v1/orgVehicleTree', //查询组织车辆树
  orgDriverTree:'/fmsweb/basic/org/v1/orgDriverTree', //查询组织司机树
  countVehicle:'/fmsweb/basic/vehicle/v1/countEachStatus', //统计各状态车辆数
  countDriver:'/fmsweb/basic/driver/v1/countEachStatus', // 统计各状态司机数
  getVehicleLoLocations:'/fmsweb/vehicle/device/v1/locations', // 获取车辆定位列表
  getDeviceLocationInfo:(plateNumber)=>`/fmsweb/vehicle/device/v1/location/${plateNumber}`, // 获取设备定位信息
  getVehicleInfo:(vehicleCode)=>`/fmsweb/vehicle/device/v1/detail/${vehicleCode}`, // 获取车辆信息接口
  getVehicleTrack:'/fmsweb/vehicle/device/v1/track', // 查询车辆历史轨迹
}
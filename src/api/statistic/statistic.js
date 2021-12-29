export default {
  wholeStatistics: '/fmsweb/basic/benefit/v1/wholeStatistics', // 效益分析
  transportationStatistics:
    '/fmsweb/basic/benefit/v1/pagingTransportationStatistics', // 运输统计
  freightStatistics: '/fmsweb/basic/benefit/v1/pagingFreightStatistics', // 运费统计
  vehicleTotal: '/fmsweb/basic/driverVehicleRevenue/v1/vehicleTotal', // 车辆收益总共
  vehicle: '/fmsweb/basic/driverVehicleRevenue/v1/vehicle', // 车辆收益列表
  driverTotal: '/fmsweb/basic/driverVehicleRevenue/v1/driverTotal', // 司机收益总共
  driver: '/fmsweb/basic/driverVehicleRevenue/v1/driver', // 司机收益列表
  pagingFirstDispatchOrder:
    '/fmsweb/basic/dispatch/v1/pagingFirstDispatchOrder', // 调度统计一级
  pagingDispatchOrderByCompanyName:
    '/fmsweb/basic/dispatch/v1/pagingDispatchOrderByCompanyName', // 调度统计二级
  pagingDispatchOrderByDispatchOrderCode:
    '/fmsweb/basic/dispatch/v1/pagingDispatchOrderByDispatchOrderCode', // 调度统计三级
  pagingWeighbridgeStatistics:
    '/fmsweb/basic/weighbridge/v1/pagingWeighbridgeStatistics', // 磅单统计一级
  pagingWeighbridgeStatisticsByCode:
    '/fmsweb/basic/weighbridge/v1/pagingWeighbridgeStatisticsByCode', // 磅单统计二级
  pagingLastWeighbridgeStatistics:
    '/fmsweb/basic/weighbridge/v1/pagingLastWeighbridgeStatistics', // 磅单统计三级
    userOverView: '/fmsweb/basic/largeScreen/v1/userOverView', // 用户总览
    getCityTotal: '/fmsweb/basic/largeScreen/v1/getCityTotal', // 地区分布
    vehicleType: '/fmsweb/basic/largeScreen/v1/vehicleType', // 车辆类型
    totalScreen: '/fmsweb/basic/largeScreen/v1/totalScreen', // 大屏中心数据统计
    deviceScreenTotal: '/fmsweb/basic/largeScreen/v1/deviceScreenTotal', // 设备资产信息
    deviceTypeAccounted: '/fmsweb/basic/largeScreen/v1/DeviceTypeAccounted', // 设备占比
    organizationAlarm: '/fmsweb/dashboard/tempAlarm/v1/organizationAlarm', // 组织告警排行
    illegalVehicle: '/fmsweb/dashboard/tempAlarm/v1/illegalVehicle', // 违规车辆排行
    illegalDriver: '/fmsweb/dashboard/tempAlarm/v1/illegalDriver', // 违规司机排行
    alarmTypeStatistics: '/fmsweb/dashboard/tempAlarm/v1/alarmTypeStatistics', // 告警类型统计
    alarmInfo: '/fmsweb/dashboard/tempAlarm/v1/alarmInfo', // 获取告警信息
    thermodynamicDiagramAlarm: '/fmsweb/dashboard/tempAlarm/v1/thermodynamicDiagramAlarm' // 热力图
}

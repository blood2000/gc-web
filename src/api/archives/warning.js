export default {
  warning_list:'/fmsweb/alarm/v1/webAlarmNotificationList', //查询告警信息列表/告警明细列表 
  warningType_list: '/fmsweb/alarmTypeInfo/v1/alarmTypeInfoList',   //告警类型列表
  deviceType_list: '/fmsweb/alarm/deviceSeriesModelInfo/v1/deviceSeriesModelInfoList',   //设备类型列表
  warning_detail:(code)=>{
    return `/fmsweb/alarm/v1/getAlarmNotificationDetailsById/${code}`
  }, //车辆详情
  warning_list_page:'/fmsweb/basic/warning/v1/paging',//获取分页 
  warning_notice_list:'/fmsweb/alarm/v2/webAlarmNotificationList',//告警通知统计列表 
}
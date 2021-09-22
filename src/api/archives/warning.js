export default {
  warning_list:'/fmsweb/alarm/v1/webAlarmNotificationList', //查询告警信息列表
  warning_detail:(code)=>{
    return `/fmsweb/alarm/v1/getAlarmNotificationDetailsById/${code}`
  }, //车辆详情
  warning_list_page:'/fmsweb/basic/warning/v1/paging',//获取分页 
}
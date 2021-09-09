export default {
  warning_list:'/fmsweb/basic/warning/v1/list', //查询车辆
  warning_detail:(code)=>{
    return `/fmsweb/basic/warning/v1/detail/${code}`
  }, //车辆详情
  warning_list_page:'/fmsweb/basic/warning/v1/paging',//获取分页 
}
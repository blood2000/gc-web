export default {
  vehicle_add:'/fmsweb/basic/vehicle/v1/add', // 添加车辆
  vehicle_edit:'/fmsweb/basic/vehicle/v1/edit', //修改车辆
  vehicle_del: `/fmsweb/basic/vehicle/v1/delete`, //删除车辆
  vehicle_list:'/fmsweb/basic/vehicle/v1/list', //查询车辆
  vehicle_detail:(code)=>{
    return `/fmsweb/basic/vehicle/v1/detail/${code}`
  }, //车辆详情
  vehicle_list_page:'/fmsweb/basic/vehicle/v1/paging',//获取分页 
  vehicle_enabled:'/fmsweb/basic/vehicle/v1/updateEnabled', //修改停用状态
  paging_de_driver: '/fmsweb/basic/vehicle/v1/pagingDefaultDriver'
}
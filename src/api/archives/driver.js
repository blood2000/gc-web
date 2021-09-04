export default {
  driver_add:'/fmsweb/basic/driver/v1/add', //添加司机
  driver_edit:'/fmsweb/basic/driver/v1/edit',
  driver_list:'/fmsweb/basic/driver/v1/list',
  driver_paging:'/fmsweb/basic/driver/v1/paging',
  driver_detail:(code)=>`/fmsweb/basic/driver/v1/detail/${code}`,
  driver_del:(teamCode,driverCode)=>`/fmsweb/basic/driver/v1/delete/${teamCode}/${driverCode}`
}
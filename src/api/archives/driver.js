export default {
  driver_add:'/fmsweb/basic/driver/v1/add', //添加司机
  driver_edit:'/fmsweb/basic/driver/v1/edit',
  driver_list:'/fmsweb/basic/driver/v1/list',
  driver_paging:'/fmsweb/basic/driver/v1/paging',
  driver_detail:(code)=>`/fmsweb/basic/driver/v1/detail/${code}`,
  driver_del:'/fmsweb/basic/driver/v1/delete',
  driver_enabled:'/fmsweb/basic/driver/v1/updateEnabled',
  driver_reset_pwd:'/fmsweb/basic/driver/v1/restPassword'
}
export default {
  driver_add:'/fmsweb/basic/driver/v1/add', //添加司机
  driver_edit:'/fmsweb/basic/driver/v1/edit',//修改司机
  driver_list:'/fmsweb/basic/driver/v1/list',//查询列表
  driver_paging:'/fmsweb/basic/driver/v1/paging',//获得分页
  driver_detail:(code)=>`/fmsweb/basic/driver/v1/detail/${code}`,//获得详情
  driver_del:'/fmsweb/basic/driver/v1/delete',//删除司机
  driver_enabled:'/fmsweb/basic/driver/v1/updateEnabled',//启停状态修改
  driver_reset_pwd:'/fmsweb/basic/driver/v1/restPassword',//重置密码
  driver_check:'/fmsweb/basic/driver//v1/check',//校验司机电话号码 身份证号
  driver_bind:'/fmsweb/basic/driver//v1/bind'//绑定司机车队长关联关系
}
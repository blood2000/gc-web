// // 测试
export default {
  checkPhoneExist:'/fmsweb/basic/teamEmployee/v1/checkPhoneExist', // 检查手机号码是否存在
  listEmployee:'/fmsweb/basic/teamEmployee/v2/paging', // 职员分页列表
  export:'/basic/teamEmployee/v2/export',// export导入导出
  addEmployee:'/fmsweb/basic/teamEmployee/v2/add', // 添加职员
  editEmployee:'/fmsweb/basic/teamEmployee/v2/edit', // 修改职员
  infoEmployee:(res)=>`/fmsweb/basic/teamEmployee/v2/detail/${res}`, // 职员详情
  deleteEmployee:(res)=>`/fmsweb/basic/teamEmployee/v2/delete/${res}`, // 删除职员
  deleteEmployeeList:'/fmsweb/basic/teamEmployee/v2/deleteByCodeList', // 删除多个职员
  changeEmployeeStatus:'/fmsweb/basic/teamEmployee/v2/changeEmployeeStatus', // 修改职员状态
  resetPassword:'/fmsweb/basic/teamEmployee/v2/resetPassword', // 重置密码
  bindByphoneNumber:'/fmsweb/basic/teamEmployee/v1/bindByphoneNumber' // 根据手机号绑定职员
}

// 正式

// export default {
//   checkPhoneExist:'/fmsweb/basic/teamEmployee/v1/checkPhoneExist', // 检查手机号码是否存在
//   listEmployee:'/fmsweb/basic/teamEmployee/v1/paging', // 职员分页列表
//   addEmployee:'/fmsweb/basic/teamEmployee/v1/add', // 添加职员
//   editEmployee:'/fmsweb/basic/teamEmployee/v1/edit', // 修改职员
//   infoEmployee:(res)=>`/fmsweb/basic/teamEmployee/v1/detail/${res}`, // 职员详情
//   deleteEmployee:(res)=>`/fmsweb/basic/teamEmployee/v1/delete/${res}`, // 删除职员
//   deleteEmployeeList:'/fmsweb/basic/teamEmployee/v1/deleteByCodeList', // 删除多个职员
//   changeEmployeeStatus:'/fmsweb/basic/teamEmployee/v1/changeEmployeeStatus', // 修改职员状态
//   resetPassword:'/fmsweb/basic/teamEmployee/v1/resetPassword', // 重置密码
//   bindByphoneNumber:'/fmsweb/basic/teamEmployee/v1/bindByphoneNumber' // 根据手机号绑定职员
// }

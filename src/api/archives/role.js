
export default {
  listRoleAll:'/fmsweb/basic/role/v1/list', // 角色列表
  listRole:'/fmsweb/basic/role/v1/paging', // 角色分页列表
  addRole:'/fmsweb/basic/role/v1/add', // 添加角色
  editRole:'/fmsweb/basic/role/v1/edit', // 修改角色
  infoRole:(res)=>`/fmsweb/basic/role/v1/detail/${res}`, // 角色详情
  deleteRole:(res)=>`/fmsweb/basic/role/v1/delete/${res}`, // 删除角色
  deleteRoleList:`/fmsweb/basic/role/v1/deleteByCodeList`, // 删除多个角色
}

export default {
  listRoleAll:'/fmsweb/basic/role/v1/list', // 角色列表
  listRole:'/fmsweb/basic/role/v1/paging', // 角色分页列表
  addRole:'/fmsweb/basic/role/v1/add', // 添加角色
  editRole:'/fmsweb/basic/role/v1/edit', // 修改角色
  infoRole:(res)=>`/fmsweb/basic/role/v1/detail/${res}`, // 角色详情
  deleteRole:(res)=>`/fmsweb/basic/role/v1/delete/${res}`, // 删除角色
  deleteRoleList:`/fmsweb/basic/role/v1/deleteByCodeList`, // 删除多个角色
  roleMenuTree:(code)=>`/fmsweb/basic/role/v1/roleMenuTree/${code}`, // 查询角色菜单树
  roleAssignMenu:'/fmsweb/basic/role/v1/roleAssignMenu', // 角色功能分配
  roleAssignEmployeeInfo:(code)=>`/fmsweb/basic/role/v1/roleAssignEmployeeInfo/${code}`, // 根据角色编号获取角色分配职员信息（含未分配）
  roleAssignEmployee:'/fmsweb/basic/role/v1/roleAssignEmployee', // 角色分配职员
  roleList:'/fmsweb/basic/role/v1/list' // 查询角色列表
}

export default {
  orgTree:'/fmsweb/basic/org/v1/companyTree', // 查询组织树（公司为根）
  userOrgTree:'/fmsweb/basic/org/v1/userOrgTree', // 当前用户所在的组织树
  addOrg:'/fmsweb/basic/org/v1/add', // 添加部门
  editOrg:'/fmsweb/basic/org/v1/edit', //修改部门信息
  infoOrg:(code)=>`/fmsweb/basic/org/v1/detail/${code}`, // 部门详情
  deleteOrg:(code)=>`/fmsweb/basic/org/v1/delete/${code}` // 删除部门
}
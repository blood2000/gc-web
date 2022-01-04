export default {
  pageCarCaptain: '/fmsweb/basic/teamLeader/v1/paging', // 车队长列表
  addCaptain: '/fmsweb/basic/teamLeader/v1/add', // 新增车队长
  getDetail: (teamLeaderCode) => `/fmsweb/basic/teamLeader/v1/detail/${teamLeaderCode}`, // 添加常用路线
  updateCaptain: '/fmsweb/basic/teamLeader/v1/edit', // 编辑车队长
  delCaptain: (teamLeaderCode) => `/fmsweb/basic/teamLeader/v1/delete/${teamLeaderCode}`, // 删除车队长
  openWallet: '/fmsweb/basic/teamLeader/v1/openWallet', // 申请开通钱包
}

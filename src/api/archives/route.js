export default {
  route_page: '/fmsweb/basic/rout/v1/page', // 常用路线分页查询
  route_add: '/fmsweb/basic/rout/v1/add', // 添加常用路线
  route_update: '/fmsweb/basic/rout/v1/update', // 修改常用路线
  route_del: (id) => `/fmsweb/basic/rout/v1/del/${id}`, // 添加常用路线
  route_detail: (id) => `/fmsweb//basic/rout/v1/getById/${id}` // 根据id获取详情
}

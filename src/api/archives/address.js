export default {
    address_add: '/fmsweb/basic/address/v1/add',//新增车队长常用地址
    address_update: '/fmsweb/basic/address/v1/update',//修改地址
    address_del: (id) => `/fmsweb/basic/address/v1/del/${id}`,//删除地址
    address_list: '/fmsweb/basic/address/v1/list',//获取分页数据
    address_get_id: (id) => `/fmsweb/basic/address/v1/get/${id}`,//根据id获取地址
}
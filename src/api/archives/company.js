export default {
    shipment_common_del: `/fmsweb/basic/shipment/v2/del`,//删除常用货主
    shipment_add: '/fmsweb/basic/shipment/v2/add',//新增常用货主
    shipment_update: '/fmsweb/basic/shipment/v2/update',//修改常用货主
    shipment_get_id: (id) => `/fmsweb/basic/shipment/v2/get/${id}`,//根据id获取常用货主
    shipment_list: '/fmsweb/basic/shipment/v2/list',//获取分页数据
    shipment_Alllist: '/fmsweb/basic/shipment/v2/allList',//获取非分页数据
}
// http_company
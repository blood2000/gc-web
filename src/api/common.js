
// // 测试
export default {
    ocr: '/fmsweb/system/common/v1/certificates',// ocr 识别
    address_add: "/fmsweb/basic/address/v2/add",//新增车队长常用地址
    address_update: '/fmsweb/basic/address/v2/update',//修改地址
    address_del: (id) => `/fmsweb/basic/address/v2/del/${id}`,//删除地址
    address_list: '/fmsweb/basic/address/v2/list',//获取分页数据
    address_get_id: (id) => `/fmsweb/basic/address/v2/get/${id}`,//根据id获取地址
    shipment_del: (id) => `/fmsweb/basic/shipment/v2/del/${id}`,//删除常用货主
    shipment_add: '/fmsweb/basic/shipment/v2/add',//新增常用货主
    shipment_update: '/fmsweb/basic/shipment/v2/update',//修改常用货主
    shipment_getid: (id) => `/fmsapp/basic/shipment/v2/get/${id}`,//根据id获取常用货主
    shipment_llist: '/fmsweb/basic/shipment/v2/list',//获取分页数据
    shipment_all: '/fmsweb/basic/shipment/v2/allList',//获取拉下数据
}

//http_common

// // 正式
// export default {
//     ocr: '/fmsweb/system/common/v1/certificates',// ocr 识别
//     address_add: "/fmsweb/basic/address/v1/add",//新增车队长常用地址
//     address_update: '/fmsweb/basic/address/v1/update',//修改地址
//     address_del: (id) => `/fmsweb/basic/address/v1/del/${id}`,//删除地址
//     address_list: '/fmsweb/basic/address/v1/list',//获取分页数据
//     address_get_id: (id) => `/fmsweb/basic/address/v1/get/${id}`,//根据id获取地址

//     shipment_del: (id) => `/fmsweb/basic/shipment/v1/del/${id}`,//删除常用货主
//     shipment_add: '/fmsweb/basic/shipment/v1/add',//新增常用货主
//     shipment_update: '/fmsweb/basic/shipment/v1/update',//修改常用货主
//     shipment_getid: (id) => `/fmsapp/basic/shipment/v1/get/${id}`,//根据id获取常用货主
//     shipment_llist: '/fmsweb/basic/shipment/v1/list',//获取分页数据
//     shipment_all: '/fmsweb/basic/shipment/v1/allList',//获取拉下数据
// }
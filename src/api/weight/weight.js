export default {
    detailWeighbridge:(code)=>`/fmsweb/basic/weighbridge/v1/detailWeighbridge/${code}`,//磅单详情
    pagingWeighbridgeRecord:`/fmsweb/basic/weighbridge/v1/pagingWeighbridgeRecord`,//磅单管理
    addWeighBridgeRecord:'/fmsweb/basic/weighbridge/v1/addWeighBridgeRecord',//新增磅单
    updateWeighBridgeRecord:'/fmsweb/basic/weighbridge/v1/updateWeighBridgeRecord',//编辑磅单
    listCompany:'/fmsweb/basic/CompanyRout/v1/listCompany',//获取企业列表
    listCompanyRoute:(code)=>`/fmsweb/basic/CompanyRout/v1/listCompanyRoute/${code}`,//通过企业Code查询路线列表
    listGoodsPrice:'/fmsweb/basic/CompanyRout/v1/listGoodsPrice',//通过企业Code及路线Code查询货品价格列表
    deleteWeighbridgeRecord:(code)=>`/fmsweb/basic/weighbridge/v1/deleteWeighbridgeRecord/${code}`
}
export default {
    list:'/fmsweb/appMarket/market/category/v1/list',//分类列表
    paging:'/fmsweb/appMarket/market/app/v1/paging',//应用分页列表
    detail:(code)=>`/fmsweb/appMarket/market/app/v1/detail/${code}`,//应用详情
    listAppGroupByCategory:'/fmsweb/appMarket/market/app/v1/listAppGroupByCategory',//查询分类应用列表（全部、推荐）
    topRanking:'/fmsweb/appMarket/market/app/v1/topRanking',//热门排行
    userList:'/fmsweb/appMarket/userApp/v1/listAppGroupByCategory',//获取根据分类分组的用户应用列表
    companyList:'/fmsweb/appMarket/companyApp/v1/listAppGroupByCategory',//查询企业分类应用列表
    subscribe:(code)=>`/fmsweb/appMarket/market/app/v1/subscribe/${code}`//开通
}
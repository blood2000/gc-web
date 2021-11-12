const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName:state => state.user.nickName,
  company_name:state=>state.user.company_name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menus:state => state.user.menus,
  permission_routes: state => state.permission.routes,
  topbarRouters:state => state.permission.topbarRouters,
  defaultRoutes:state => state.permission.defaultRoutes,
  sidebarRouters:state => state.permission.sidebarRouters,
  vehicleEnergyTypeList:state => state.dict.vehicleEnergyTypeList,
  vehicleTypeCodeList:state => state.dict.vehicleTypeCodeList,
  carrierTypeList:state => state.dict.carrierTypeList,
  vehicleLicenseColorCodeList:state => state.dict.vehicleLicenseColorCodeList,
  showDispatchVehicle:state => state.map.showDispatchVehicle,
  showVehicleDetail:state => state.map.showVehicleDetail,
  vehicleInfo:state => state.map.vehicleInfo,
  isFresh:state => state.map.isFresh,
  dispatchInfo:state => state.map.dispatchInfo,
  isClose:state => state.map.isClose,
  isMany:state => state.map.isMany,
  channelNumList:state =>state.map.channelNumList
}
export default getters

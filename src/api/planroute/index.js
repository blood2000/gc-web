export default {
  'planRoutePage': '/fmsweb/basic/plan-route/v1/page',
  'planRouteDetail': code => `/fmsweb/basic/plan-route/v1/detail/${code}`,
  'planRouteAdd': '/fmsweb/basic/plan-route/v1/add',
  'planRouteUpdate': '/fmsweb/basic/plan-route/v1/update',
  'planRouteDelete': code => `/fmsweb/basic/plan-route/v1/delete/${code}`,

  'routeRelVehicle': '/fmsweb/basic/plan-route/v1/routeRelVehicle',
  'removeRouteVehicle': '/fmsweb/basic/plan-route/v1/RemoveRouteVehicle',
  'getBindableVehicles': '/fmsweb/basic/plan-route/v1/getBindableVehicles',
  'routeBindableVehicles': code => `/fmsweb/basic/plan-route/v1/routeBindableVehicles/${code}`,
}

export default {
    carlist:'/fmsweb/vehicle/device/v1/paging',//车辆列表
    device_detail:(vehicleCode,type)=>`/fmsweb/vehicle/device/v1/detail/${vehicleCode}/${type}`,//获取车辆信息接口
}
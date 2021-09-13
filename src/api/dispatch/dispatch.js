export default {
    paging_dispatch:'/fmsweb/basic/dispatchOrder/v1/pagingDispatchOrder', //调度单管理  
    detail_dispatch:(dispatchOrder)=>`/fmsweb/basic/dispatchOrder/v1/detailDispatcherOrder/${dispatchOrder}`, //调度单详情
    list_vehicle_select:'/fmsweb/basic/vehicle/v1/listVehicleSelect', //获取派车的车辆Select
    by_vehicle_code:(vehicleCode)=>`/fmsweb/basic/driver/v1/listDeptDriverByVehicleCode/${vehicleCode}`, //根据车辆Code获取可选择的司机
    appoint_car:'/fmsweb/basic/appointCarRecord/v1/appointCar',//派单  调度单派车
    paging_appoint_car_record:'/fmsweb/basic/appointCarRecord/v1/pagingAppointCarRecord', //派车记录列表 
    dispatch_order_info:'/fmsweb/basic/appointCarRecord/v1/generateDispatchOrderInfo', //生成调度信息
    car_order:'/fmsweb/basic/appointCarOrder/v1/pagingAppointCarOrder', //派车单列表 派车单管理
    del_by_codes:(codes)=>`/fmsweb/basic/appointCarRecord/v1/deleteAppointCarRecordByCodes/${codes}`//删除派车单
}
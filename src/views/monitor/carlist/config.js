export const tableColumnsConfig = [
    {
        isShow: true,
        label: "车辆",
        prop: "plate_number",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "司机",
        prop: "driver_name",
        sortNum: 2,
        tooltip: true,
    },
    {
        isShow: true,
        label: "车辆状态",
        prop: "vehicle_status",
        sortNum: 3,
        tooltip: true,
    },
    // {
    //     isShow: true,
    //     label: "行驶状态",
    //     prop: "driverStatus",
    //     sortNum: 4,
    //     tooltip: true,
    // },
    {
        isShow: true,
        label: "当前位置",
        prop: "attribute",
        sortNum: 5,
        tooltip: true,
    },
    {
        isShow: true,
        label: "上报时间",
        prop: "update_time",
        sortNum: 6,
        tooltip: true,
    },
    {
        isShow: true,
        label: "设备类型",
        prop: "model_name",
        sortNum: 7,
        tooltip: true,
    },
    {
        isShow: true,
        label: "最近告警",
        prop: "alarm_type",
        sortNum: 8,
        tooltip: true,
    },
    {
        isShow: true,
        label: "最近告警时间",
        prop: "alarm_time",
        sortNum: 9,
        tooltip: true,
        width: 150,
    },
    {
        isShow: true,
        label: "最近告警位置",
        prop: "alarm_address",
        sortNum: 10,
        tooltip: true,
        width: 200,
    },
    {
        isShow: true,
        label: "操作",
        prop: "edit",
        sortNum: 99,
        tooltip: true,
        width: 200,
        fixed: 'right'
    },
]

export const onlineStatusList = [
    { label: '离线', value: '0' }, {
        label: '在线', value: '1'
    }
]

// 0 空闲 1 任务中 2 维修 3 保养
export const vehicleStatusList = [
    {
        label: '空闲', value: '0',
        color:'#4682FA'
    }, {
        label: '任务中', value: '1',
        color:'#43B91E'
    },
    {
        label: '维修', value: '2',
        color:'#FF8C00'
    },
    {
        label: '保养', value: '3',
        color:'#F4A460'
    }
]
export const tableColumnsConfig = [
    {
        isShow: true,
        label: "设备号",
        prop: "factoryOnlyCode",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "产品系列",
        prop: "seriesName",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "设备型号",
        prop: "modelName",
        sortNum: 1,
        tooltip: true,
    },

    {
        isShow: true,
        label: "设备状态",
        prop: "status",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "激活状态",
        prop: "activationFlagValue",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "绑定车辆",
        prop: "vehicleInfo",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "操作",
        prop: "edit",
        sortNum: 1,
        tooltip: true,
    }
]


export const statusList = [
    {
        label: '离线',
        color: '#B3B3B3',
        value: 0
    }, {
        label: '在线',
        color: '#43B91E',
        value: 1
    }
]
export const activationFlagList = [
    {
        label: '未激活',
        color: '#B3B3B3',
        value: 0
    }, {
        label: '激活',
        color: '#43B91E',
        value: 1
    }
]
export const statusObj = {
    0: {
        label: '● 离线',
        color: '#B3B3B3'
    },
    1: {
        label: '● 在线',
        color: '#43B91E'
    }
}
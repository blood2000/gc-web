const warningTypeList = [
  {type: 0, typeName: '设备异常告警', warningType: 0,warningName: '外电低电',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 1,warningName: '设备换卡',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 2,warningName: '设备关机',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 3,warningName: 'GPS盲区',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 4,warningName: '设备拆卸',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 5,warningName: '卡到期',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 6,warningName: '设备开盖',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 7,warningName: '设备断电',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 8,warningName: '低电告警',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 9,warningName: '后备电池电量不足',isChoose: true},
  {type: 0, typeName: '设备异常告警', warningType: 10,warningName: '内部电池电量过低',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 11,warningName: '超速',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 12,warningName: '异常震动',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 13,warningName: '停留告警',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 14,warningName: '车辆碰撞',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 15,warningName: '急加速',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 16,warningName: '急减速',isChoose: true},
  {type: 1, typeName: '车辆告警', warningType: 17,warningName: '急转弯',isChoose: true}
]

const deviceTypeList = [
  {
    label: '小黑盒',
    value: 0
  },
  {
    label: 'ADAS+传感器',
    value: 1
  }
]
const vehicleColumn = [
  {
    isShow: true,
    label: "车辆",
    prop: "vehicle",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "司机",
    prop: "driver",
    sortNum: 2,
    tooltip: true,
  },
]

const driverColumn = [

  {
    isShow: true,
    label: "司机",
    prop: "driver",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "车辆",
    prop: "vehicle",
    sortNum: 2,
    tooltip: true,
  },
]


const tableColumnsConfig = [
  
  {
    isShow: true,
    label: "告警类型",
    prop: "warinigType",
    sortNum: 3,
    tooltip: true,
    width: 100
  },
  {
    isShow: true,
    label: "上报时速(km/h)",
    prop: "speed",
    sortNum: 4,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "设备类型",
    prop: "deviceType",
    sortNum: 5,
    tooltip: true,
    width: 100
  },
  {
    isShow: true,
    label: "上报时间",
    prop: "upTime",
    sortNum: 6,
    tooltip: true,
    width: 120
  },
  {
    isShow: true,
    label: "上报位置",
    prop: "upAddr",
    sortNum: 7,
    tooltip: true,
    width: 200
  },
]

const warningTabs = [
  {
    label: '按车辆',
    value: '1'
  },
  {
    label: '按司机',
    value: '2'
  }
]

const mockData = [
  {
    vehicle: '闽A123123',
    driver: '王重阳',
    warinigType: 11,
    speed: '110',
    deviceType: 1,
    upTime: '2021-08-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A223322',
    driver: '王安石',
    warinigType: 4,
    speed: '92',
    deviceType: 0,
    upTime: '2021-09-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A44445',
    driver: '司马光',
    warinigType: 10,
    speed: '80',
    deviceType: 1,
    upTime: '2021-09-08',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A123123',
    driver: '王重阳',
    warinigType: 11,
    speed: '110',
    deviceType: 1,
    upTime: '2021-08-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A223322',
    driver: '王安石',
    warinigType: 4,
    speed: '92',
    deviceType: 0,
    upTime: '2021-09-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A44445',
    driver: '司马光',
    warinigType: 10,
    speed: '80',
    deviceType: 1,
    upTime: '2021-09-08',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A123123',
    driver: '王重阳',
    warinigType: 11,
    speed: '110',
    deviceType: 1,
    upTime: '2021-08-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A223322',
    driver: '王安石',
    warinigType: 4,
    speed: '92',
    deviceType: 0,
    upTime: '2021-09-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A44445',
    driver: '司马光',
    warinigType: 10,
    speed: '80',
    deviceType: 1,
    upTime: '2021-09-08',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A123123',
    driver: '王重阳',
    warinigType: 11,
    speed: '110',
    deviceType: 1,
    upTime: '2021-08-06',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A44445',
    driver: '司马光',
    warinigType: 10,
    speed: '80',
    deviceType: 1,
    upTime: '2021-09-08',
    upAddr: '福州仓山区'
  },
  {
    vehicle: '闽A123123',
    driver: '王重阳',
    warinigType: 11,
    speed: '110',
    deviceType: 1,
    upTime: '2021-08-06',
    upAddr: '福州仓山区'
  },
]

export default {
  deviceTypeList,
  warningTypeList,
  tableColumnsConfig,
  vehicleColumn,
  driverColumn,
  warningTabs,
  mockData
}

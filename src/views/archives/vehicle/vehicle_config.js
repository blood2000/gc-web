const vehicleStatusList = [
  {
    label: "●空闲中",
    color: "#67C23A",
    value: "0"
  },
  {
    label: "●任务中",
    color: "#409EFF",
    value: "1"
  },
  {
    label: "●维修中",
    color: "#FF8C00",
    value: "2"
  },
  {
    label: "●保养中",
    color: "#F4A460",
    value: "3"
  },
  {
    label: "●不可用",
    color: "#F56C6C",
    value: "4"
  },
]

const enabledList = [
  {
    label: "启用",
    value: "1"
  },
  {
    label: "停用",
    value: "0"
  }
]

const tableColumnsConfig = [
  {
    isShow: true,
    label: "车牌号",
    prop: "licenseNumber",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "车辆状态",
    prop: "vehicleStatus",
    sortNum: 2,
    tooltip: true,
  },
  {
    isShow: true,
    label: "分组",
    prop: "groupCode",
    sortNum: 3,
    tooltip: true,
  },
  {
    isShow: true,
    label: "是否停用",
    prop: "enabled",
    sortNum: 4,
    tooltip: true,
  },
  {
    isShow: true,
    label: "绑定设备",
    prop: "deviceInf",
    sortNum: 5,
    tooltip: true,
  },
  {
    isShow: true,
    label: "创建时间",
    prop: "createTime",
    sortNum: 6,
    tooltip: true,
  },
  {
    isShow: true,
    label: "操作",
    prop: "edit",
    sortNum: 7,
    tooltip: true,
    width: 150
  },
]

const warningTypeList = [
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 0,
    warningName: "外电低电",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 1,
    warningName: "设备换卡",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 2,
    warningName: "设备关机",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 3,
    warningName: "GPS盲区",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 4,
    warningName: "设备拆卸",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 5,
    warningName: "卡到期",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 6,
    warningName: "设备开盖",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 7,
    warningName: "设备断电",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 8,
    warningName: "低电告警",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 9,
    warningName: "后备电池电量不足",
    isChoose: true
  },
  {
    type: 0,
    typeName: "设备异常告警",
    warningType: 10,
    warningName: "内部电池电量过低",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 11,
    warningName: "超速",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 12,
    warningName: "异常震动",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 13,
    warningName: "停留告警",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 14,
    warningName: "车辆碰撞",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 15,
    warningName: "急加速",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 16,
    warningName: "急减速",
    isChoose: true
  },
  {
    type: 1,
    typeName: "车辆告警",
    warningType: 17,
    warningName: "急转弯",
    isChoose: true
  }
];

const warningLevelList = [
  { level: 0, name: "一级告警" },
  { level: 1, name: "二级告警" },
  { level: 2, name: "三级告警" }
];

const warningInfoTableColumnsConfig = [
  {
    isShow: true,
    label: "告警类型",
    prop: "warinigType",
    sortNum: 1,
    tooltip: true,
    width: 100
  },
  {
    isShow: true,
    label: "司机",
    prop: "driver",
    sortNum: 2,
    tooltip: true
  },
  {
    isShow: true,
    label: "告警级别",
    prop: "warningLevel",
    sortNum: 3,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "告警时间",
    prop: "upTime",
    sortNum: 4,
    tooltip: true,
    width: 120
  },
  {
    isShow: true,
    label: "告警时速(km/h)",
    prop: "speed",
    sortNum: 5,
    tooltip: true,
    width: 100
  },
  
  {
    isShow: true,
    label: "告警位置",
    prop: "upAddr",
    sortNum: 6,
    tooltip: true,
    width: 200
  },
  {
    isShow: true,
    label: "操作",
    prop: "handle",
    sortNum: 7,
    tooltip: true,
    width: 80
  }
];

const warningInfo = [
  {
    vehicle: "闽A223322",
    driver: "王安石",
    warinigType: 4,
    warningLevel: 0,
    speed: "92",
    deviceType: 0,
    upTime: "2021-09-06",
    upAddr: "福州仓山区"
  },
  {
    vehicle: "闽A44445",
    driver: "司马光",
    warinigType: 10,
    warningLevel: 2,
    speed: "80",
    deviceType: 1,
    upTime: "2021-09-08",
    upAddr: "福州仓山区"
  },
  {
    vehicle: "闽A123123",
    driver: "辛弃疾",
    warinigType: 11,
    warningLevel: 1,
    speed: "110",
    deviceType: 1,
    upTime: "2021-08-06",
    upAddr: "福州仓山区"
  },
]

export default {
  enabledList,
  vehicleStatusList,
  tableColumnsConfig,
  warningInfo,
  warningTypeList,
  warningLevelList,
  warningInfoTableColumnsConfig,
}

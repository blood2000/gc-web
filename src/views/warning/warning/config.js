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
  { level: 1, name: "一级告警" },
  { level: 2, name: "二级告警" },
  { level: 3, name: "三级告警" }
];
const warningLevelObj =
{
  1: { text: "一级告警", img: require('@/assets/images/detail/warn_level_1.png') },
  2: { text: "二级告警", img: require('@/assets/images/detail/warn_level_2.png') },
  3: { text: "三级告警", img: require('@/assets/images/detail/warn_level_3.png') }
};
const deviceTypeList = [
  {
    label: "小黑盒",
    value: 0
  },
  {
    label: "ADAS+传感器",
    value: 1
  }
];
const vehicleColumn = [
  {
    isShow: true,
    label: "车辆",
    prop: "licenseNumber",
    sortNum: 1,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "司机",
    prop: "nickName",
    sortNum: 2,
    tooltip: true,
    width: 80
  }
];

const driverColumn = [
  {
    isShow: true,
    label: "司机",
    prop: "nickName",
    sortNum: 1,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "车辆",
    prop: "licenseNumber",
    sortNum: 2,
    tooltip: true,
    width: 80
  }
];

const tableColumnsConfig = [
  {
    isShow: true,
    label: "告警类别",
    prop: "alarmTypeName",
    sortNum: 3,
    tooltip: true,
    headerSlot: true,
    width: 80
  },

  {
    isShow: true,
    label: "告警类型",
    prop: "vendorAlarmTypeName",
    sortNum: 4,
    tooltip: true,
    headerSlot: true,
    width: 80
  },

  {
    isShow: true,
    label: "告警级别",
    prop: "alarmLevel",
    sortNum: 5,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "告警描述",
    prop: "alarmContent",
    sortNum: 6,
    tooltip: true,
    width: 140
  },

  // {
  //   isShow: true,
  //   label: "设备类型",
  //   prop: "name",
  //   sortNum: 7,
  //   tooltip: true,
  //   width: 110
  // },
  {
    isShow: true,
    label: "告警时间",
    prop: "alarmTime",
    sortNum: 7,
    tooltip: true,
    width: 120
  },
  // {
  //   isShow: true,
  //   label: "上报位置",
  //   prop: "alarmAddress",
  //   sortNum: 9,
  //   tooltip: true,
  //   width: 200
  // },
  {
    isShow: true,
    label: "操作",
    prop: "handle",
    fixed: 'right',
    sortNum: 10,
    tooltip: true,
    width: 80
  }
];

const warningTabs = [
  {
    label: "按车辆",
    value: "1"
  },
  {
    label: "按司机",
    value: "2"
  },
  {
    label: "偷换货",
    value: "3"
  }
];

const mockData = [
  {
    licenseNumber: "闽A123123",
    nickName: "王重阳",
    alarmTypeName: '告警类型',
    warningLevel: 0,
    speed: "110",
    deviceType: 1,
    upTime: "2021-08-06",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A223322",
    nickName: "王安石",
    alarmTypeName: '告警类型',
    warningLevel: 0,
    speed: "92",
    deviceType: 0,
    upTime: "2021-09-06",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A44445",
    nickName: "司马光",
    alarmTypeName: '告警类型',
    warningLevel: 2,
    speed: "80",
    deviceType: 1,
    upTime: "2021-09-08",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A123123",
    nickName: "辛弃疾",
    alarmTypeName: '告警类型',
    warningLevel: 1,
    speed: "110",
    deviceType: 1,
    upTime: "2021-08-06",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A223322",
    nickName: "苏轼",
    alarmTypeName: '告警类型',
    warningLevel: 0,
    speed: "92",
    deviceType: 0,
    upTime: "2021-09-06",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A44445",
    nickName: "李白",
    alarmTypeName: '告警类型',
    warningLevel: 1,
    speed: "80",
    deviceType: 1,
    upTime: "2021-09-08",
    upAddr: "福州仓山区"
  },
  {
    licenseNumber: "闽A123123",
    nickName: "杜甫",
    alarmTypeName: '告警类型',
    warningLevel: 0,
    speed: "110",
    deviceType: 1,
    upTime: "2021-08-06",
    upAddr: "福州仓山区"
  },
  // {
  //   licenseNumber: "闽A223322",
  //   nickName: "王阳明",
  //   warinigType: 4,
  //   warningLevel: 1,
  //   speed: "92",
  //   deviceType: 0,
  //   upTime: "2021-09-06",
  //   upAddr: "福州仓山区"
  // },
  // {
  //   licenseNumber: "闽A44445",
  //   nickName: "孟轲",
  //   warinigType: 10,
  //   warningLevel: 0,
  //   speed: "80",
  //   deviceType: 1,
  //   upTime: "2021-09-08",
  //   upAddr: "福州仓山区"
  // },
  // {
  //   licenseNumber: "闽A123123",
  //   nickName: "王献之",
  //   warinigType: 11,
  //   warningLevel: 2,
  //   speed: "110",
  //   deviceType: 1,
  //   upTime: "2021-08-06",
  //   upAddr: "福州仓山区"
  // },
  // {
  //   licenseNumber: "闽A44445",
  //   nickName: "张旭",
  //   warinigType: 10,
  //   warningLevel: 0,
  //   speed: "80",
  //   deviceType: 1,
  //   upTime: "2021-09-08",
  //   upAddr: "福州仓山区"
  // },
  // {
  //   licenseNumber: "闽A123123",
  //   nickName: "杜康",
  //   warinigType: 11,
  //   warningLevel: 1,
  //   speed: "110",
  //   deviceType: 1,
  //   upTime: "2021-08-06",
  //   upAddr: "福州仓山区"
  // }
];

const videoList = [
  { id: 0, src: "" },
  { id: 1, src: "" },
  { id: 2, src: "" },
  { id: 3, src: "" }
];

export default {
  deviceTypeList,
  warningTypeList,
  warningLevelList,
  tableColumnsConfig,
  vehicleColumn,
  driverColumn,
  warningTabs,
  mockData,
  videoList,
  warningLevelObj,
};

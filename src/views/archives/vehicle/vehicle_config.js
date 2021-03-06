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

const authStatusList = [
  {
    label: "认证中",
    color: "#B3B3B3",
    img: 'ing',
    value: "0"
  },
  {
    label: "认证中",
    color: "#B3B3B3",
    img: 'ing',
    value: "1"
  },
  {
    label: "认证失败",
    color: "#EF6969",
    img: 'error',
    value: "2"
  },
  {
    label: "已认证",
    color: "#43B91E",
    img: 'success',
    value: "3"
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
const vehicleOwnershipList = [
  {
    label: "自有",
    value: 0
  },
  {
    label: "外援",
    value: 1
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
    label: "认证状态",
    prop: "authStatus",
    sortNum: 2,
    tooltip: true,
  },
  {
    isShow: true,
    label: "所属组织",
    prop: "orgName",
    sortNum: 3,
    tooltip: true,
  },
  {
    isShow: true,
    label: "分组",
    prop: "groupName",
    sortNum: 3,
    tooltip: true,
  },
  {
    isShow: true,
    label: "是否启用",
    prop: "enabled",
    sortNum: 4,
    tooltip: true,
  },
  {
    isShow: true,
    label: "司机",
    prop: "defaultDriverName",
    sortNum: 4,
    tooltip: true,
  },
  {
    isShow: true,
    label: "绑定设备",
    prop: "seriesModelName",
    sortNum: 5,
    tooltip: true,
  },
  {
    isShow: true,
    label: "设备编码",
    prop: "factoryOnlyCode",
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
    width: 200,
    fixed: 'right'
  },
]

const offsetList = {
  ztc: [-17, -38],
  jbc: [-17, -40],
  llc: [-14, -31],
  phc: [-15, -39],
  qt: [-15, -39],
}


const warningInfoTableColumnsConfig = [
  {
    isShow: true,
    label: "告警类型",
    prop: "alarmTypeName",
    sortNum: 1,
    tooltip: true,
    width: 100
  },
  // {
  //   isShow: true,
  //   label: "司机",
  //   prop: "nickName",
  //   sortNum: 2,
  //   tooltip: true
  // },
  {
    isShow: true,
    label: "告警级别",
    prop: "alarmLevel",
    sortNum: 3,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "告警时间",
    prop: "alarmTime",
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
    prop: "alarmAddress",
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
    width: 80,
    fixed: 'right'
  }
];

const rulesDisList=['vehicleLicenseImg','vehicleLicenseSecondImg',
'licenseNumber',
'vehicleTypeCode',
'chassisNumber',
'issuingOrganizations',
'vehicleEnergyType',
'vehicleLicenseColorCode',
'vehicleLoadWeight',
'vehicleTotalWeight',
'orgCode',
'vehicleOwnership',
'carrierType'
]



export default {
  enabledList,
  vehicleStatusList,
  tableColumnsConfig,
  warningInfoTableColumnsConfig,
  offsetList,
  vehicleOwnershipList,
  authStatusList,
  rulesDisList
}

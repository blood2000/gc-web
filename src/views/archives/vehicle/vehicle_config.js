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
    value: "0"
  },
  {
    label: "停用",
    value: "1"
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

export default {
  enabledList,
  vehicleStatusList,
  tableColumnsConfig
}

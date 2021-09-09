const tableColumnsConfig = [
  {
    isShow: true,
    label: "手机号码",
    prop: "telphone",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "用户名称",
    prop: "name",
    sortNum: 2,
    tooltip: true,
  },
  {
    isShow: true,
    label: "组织",
    prop: "orgName",
    sortNum: 3,
    tooltip: true,
  },
  {
    isShow: true,
    label: "司机状态",
    prop: "driverStatus",
    sortNum: 4,
    tooltip: true,
  },
  {
    isShow: true,
    label: "实名状态",
    prop: "realStatus",
    sortNum: 5,
    tooltip: true,
  },
  {
    isShow: true,
    label: "停用状态",
    prop: "enabled",
    sortNum: 6,
    tooltip: true,
  },
  {
    isShow: true,
    label: "创建时间",
    prop: "createTime",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "操作",
    prop: "edit",
    sortNum: 8,
    tooltip: true,
    width: 200
  },
]

const driverStatusCongfig = {
  "1": { text: "●空闲中", color: "#43B91E" },
  "0": { text: "●任务中", color: "#4682FA" },
  "2": { text: "●不可用", color: "#F56C6C" }
}
const driverStatusCongfigArr = [
  { text: "空闲中", color: "#43B91E",value:'1' },
   { text: "任务中", color: "#4682FA" ,value:'0'},
   { text: "不可用", color: "#F56C6C" ,value:'2'}
]
const realStatusConfig = {
  "3": { text: "●已实名", color: "#43B91E" },
  "0": { text: "●未实名", color: "##E6A23C" },
  "1": { text: "●未实名", color: "##E6A23C" },
  "2": { text: "●未实名", color: "##E6A23C" },
}

const realStatusConfigArr = [
  {
    label:'已实名',value:'1',
    label:"未实名",value:"0"
  }
]

export default {
  tableColumnsConfig,
  driverStatusCongfig,
  driverStatusCongfigArr,
  realStatusConfig,
  realStatusConfigArr
}
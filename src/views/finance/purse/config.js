
const caseTableColumnsConfig = [
  {
    isShow: true,
    label: "银行卡号",
    prop: "bankNumber",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "开户行",
    prop: "bankName",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "开户姓名",
    prop: "bankUserName",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "银行预留手机号",
    prop: "bankUserPhone",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "提现时间",
    prop: "applyDate",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "提现金额(元)",
    prop: "money",
    sortNum: 1,
    tooltip: true,
  },
  {
    isShow: true,
    label: "提现状态",
    prop: "status",
    sortNum: 1,
    tooltip: true,
  }
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

const DetailTableColumnsConfig = [

  {
    isShow: true,
    label: "派车单号",
    prop: "waybillNo",
    sortNum: 3,
    tooltip: true,
  },
  {
    isShow: true,
    label: "出发地",
    prop: "loadFormattedAddress",
    sortNum: 4,
    tooltip: true,
  },
  {
    isShow: true,
    label: "目的地",
    prop: "unloadFormattedAddress",
    sortNum: 5,
    tooltip: true,
  },
  {
    isShow: true,
    label: "货物大类",
    prop: "goodsBigTypeName",
    sortNum: 6,
    tooltip: true,
  },
  {
    isShow: true,
    label: "货物小类",
    prop: "goodsTypeName",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "承运司机",
    prop: "driverName",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "承运车辆",
    prop: "licenseNumber",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "承运组织",
    prop: "teamName",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "收款总额",
    prop: "paidAmount",
    sortNum: 7,
    tooltip: true,
  },
  {
    isShow: true,
    label: "交易时间",
    prop: "createTime",
    sortNum: 7,
    tooltip: true,
  },
]

const DetailTableColumnsConfig1 = [

  {
    isShow: true,
    label: "支出类型",
    prop: "paidItem",
    sortNum: 3,
    tooltip: true,
    width: 100
  },
  {
    isShow: true,
    label: "支出金额",
    prop: "paidAmount",
    sortNum: 4,
    tooltip: true,
    width: 80
  },
  {
    isShow: true,
    label: "支出时间",
    prop: "createTime",
    sortNum: 5,
    tooltip: true,
    width: 100
  },

]
// 提现申请（0）、提交成功（1）、转账成功（2）、转账失败（3）、处理中（4）、驳回（5）
const statusConfig = {
  '0': { text: '提现申请', color: "#67C23A" },
  '2': { text: '转账成功', color: "#909399" },
  '3': { text: '转账失败', color: "#F56C6C" },
  '4': { text: '处理中', color: "#409EFF" },
  '5': { text: '驳回', color: "#E6A23C" },
}
//明细 收款/支出 消费项目(0-充值，1-保证金 2-运费 3-保费 4-罚款 5-提现 6-信息费 7=油费)	
const tablist = [{ tabName: '收款记录' }, { tabName: '支出记录' }]
//消费项目
const paidItem = {
  '0': { text: '充值', color: "#67C23A" },
  '1': { text: '保证金', color: "#67C23A" },
  '2': { text: '运费', color: "#909399" },
  '3': { text: '保费', color: "#F56C6C" },
  '4': { text: '罚款', color: "#409EFF" },
  '5': { text: '提现', color: "#E6A23C" },
  '6': { text: '信息费', color: "#E6A23C" },
  '7': { text: '油费', color: "#E6A23C" },

}



export default {
  tableColumnsConfig,
  caseTableColumnsConfig,
  tablist,
  DetailTableColumnsConfig,
  DetailTableColumnsConfig1,
  statusConfig,
  paidItem
}


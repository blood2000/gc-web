const overviewMock = {
  rest: 12000,
  handle: 10000
};

const cardTypeList = [
  {
    cardType: "中国工商银行",
    userName: "李白",
    acct: "6226111122223333586",
    id: 0
  },
  {
    cardType: "中国建设银行",
    userName: "李白",
    acct: "0026 1111 2222 3333",
    id: 1
  },
  {
    cardType: "中国农业银行",
    userName: "李白",
    acct: "6200 1111 2222 3333",
    id: 2
  },
  {
    cardType: "招商银行",
    userName: "李白",
    acct: "3700 1111 2222 3333",
    id: 3
  },
  {
    cardType: "交通银行",
    userName: "李白",
    acct: "5200 1111 2222 3333",
    id: 4
  }
];

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
  }
];

export default {
  overviewMock,
  cardTypeList,
  tableColumnsConfig
};

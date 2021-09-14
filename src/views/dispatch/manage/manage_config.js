export const tableColumnsConfig = [
    {
        isShow: true,
        label: "派车记录编号",
        prop: "appointCarOrderCode",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "派车单号",
        prop: "appointCarRecordNo",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "派车单状态",
        prop: "status",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "承运组织",
        prop: "dispatchOrderNo",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "司机姓名",
        prop: "driverName",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "司机电话",
        prop: "driverPhone",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "承运车辆",
        prop: "vehicleNumber",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "下单客户",
        prop: "shipmentNameAndPhone",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "用车企业",
        prop: "companyName",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "货物小类",
        prop: "goodsSmallTypeName",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "出发地",
        prop: "loadAddress",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "目的地",
        prop: "unloadAddress",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "货物单价",
        prop: "freight",
        sortNum: 1,
        tooltip: true,
    },
    {
        isShow: true,
        label: "操作",
        prop: "edit",
        sortNum: 1,
        tooltip: true,
    },
]
//10已接单 20已出车 30已回车 40已失效 50待付款 60 已付款
export const statusList = [
    {
        label: '已接单',
        value: 10
    },
    {
        label: '已出车',
        value: 20
    },
    {
        label: '已回车',
        value: 30
    },
    {
        label: '已失效',
        value: 40
    },
    {
        label: '待付款',
        value: 50
    },
    {
        label: '已付款',
        value: 60
    },
]


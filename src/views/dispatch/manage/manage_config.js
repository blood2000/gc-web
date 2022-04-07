export const tableColumnsConfig = [
    {
        isShow: true,
        label: "派车记录编号",
        prop: "appointCarRecordNo",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "派车单号",
        prop: "appointCarOrderNo",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "派车单状态",
        prop: "status",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "承运组织",
        prop: "vehicleOrgName",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "司机姓名",
        prop: "driverName",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "司机电话",
        prop: "driverPhone",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "承运车辆",
        prop: "vehicleNumber",
        sortNum: 1,
        tooltip: true,
        width:'140'
    },
    {
        isShow: true,
        label: "下单客户",
        prop: "shipmentNameAndPhone",
        sortNum: 1,
        tooltip: true,
        width:200
    },
    {
        isShow: true,
        label: "用车企业",
        prop: "companyName",
        sortNum: 1,
        tooltip: true,
        width:200
    },
    {
        isShow: true,
        label: "货物类型",
        prop: "goodsSmallTypeName",
        sortNum: 1,
        tooltip: true,
        width:140
    },
    {
        isShow: true,
        label: "出发地",
        prop: "loadAddress",
        sortNum: 1,
        tooltip: true,
        width:450
    },
    {
        isShow: true,
        label: "目的地",
        prop: "unloadAddress",
        sortNum: 1,
        tooltip: true,
        width:260
    },
    {
        isShow: true,
        label: "接单时间",
        prop: "receiveTime",
        sortNum: 1,
        tooltip: true,
        width:260
    },
    {
        isShow: true,
        label: "出车时间",
        prop: "loadTime",
        sortNum: 1,
        tooltip: true,
        width:260
    },
    {
        isShow: true,
        label: "回车时间",
        prop: "unloadTime",
        sortNum: 1,
        tooltip: true,
        width:260
    },
    // {
    //     isShow: true,
    //     label: "运费单价",
    //     prop: "freight",
    //     sortNum: 1,
    //     tooltip: true,
    // },
    {
        isShow: true,
        label: "操作",
        prop: "edit",
        sortNum: 1,
        tooltip: true,
        fixed:'right'

    },
]
//10已接单 20已出车 30已回车 40已失效 50待付款 60 已付款
export const statusList = [
    {
        label: '未接单',
        value: 0
    },
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


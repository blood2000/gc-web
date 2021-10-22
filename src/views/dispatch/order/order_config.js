

//0 关闭 1 未派车 2 派车
export const dispatchOrderStatusList = [
    {
        label: "关闭",
        value: 0,
        color: "#333333"
    },
    {
        label: "未派车",
        value: 1,
        color: '#67C23A'
    },
    {
        label: "已派车",
        value: 2,
        color: '#E6A23C'
    },
]

//调度单来源
export const sourceConfig = {
    'chy': "超好运",
    'zj': '自建'
}

export const tableColumnsConfig = [
    {
        isShow: true,
        label: "调度单号",
        prop: "dispatchOrderNo",
        sortNum: 1,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "调度单来源",
        prop: "source",
        sortNum: 2,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "下单客户姓名",
        prop: "shipmentName",
        sortNum: 3,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "用车企业",
        prop: "companyName",
        sortNum: 4,
        tooltip: true,
        //width:200
    }, {
        isShow: true,
        label: "项目名称",
        prop: "companyName",
        sortNum: 5,
        tooltip: true,
        //width:200
    },
    // {
    //     isShow: true,
    //     label: "货物大类",
    //     prop: "goodsBigTypeName",
    //     sortNum: 6,
    //     tooltip: true,
    // },
    {
        isShow: true,
        label: "货物类型",
        prop: "goodsTypeName",
        sortNum: 7,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: '调度单状态',
        prop: "dispatchOrderStatus",
        sortNum: 7,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "货源备注",
        prop: "remark",
        sortNum: 9,
        tooltip: true,
        //width:200
    },

    {
        isShow: true,
        label: "出发地",
        prop: "loadFormattedAddress",
        sortNum: 9,
        tooltip: true,
        //width:400
    },
    {
        isShow: true,
        label: "目的地",
        prop: "unloadFormattedAddress",
        sortNum: 9,
        tooltip: true,
        //width:400
    },
    {
        isShow: true,
        label: "司机应收金额（元）",
        prop: "freightStr",
        sortNum: 9,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "创建时间",
        prop: "createTime",
        sortNum: 9,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "修改时间",
        prop: "remark",
        sortNum: 9,
        tooltip: true,
        //width:200
    },
    {
        isShow: true,
        label: "操作",
        prop: "edit",
        sortNum: 8,
        tooltip: true,
        width: 200,
        fixed: 'right'
    },
]

export const settlementWayConfig = [
    {
        label: "按趟结算",
        value: "1"
    },
    {
        label: "按净重结算",
        value: "2"
    }
]

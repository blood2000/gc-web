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
        prop: "org",
        sortNum: 3,
        tooltip: true,
      },
      {
        isShow: true,
        label: "司机状态",
        prop: "driverStatus ",
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
        prop: "stopStatus",
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
        width:200
      },
]

export default {
    tableColumnsConfig
}
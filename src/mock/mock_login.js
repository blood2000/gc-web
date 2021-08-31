const getuserinfo = {
  code: 200,
  defaultRoleCode: "team,driver,shipment_company,shipment,6809f8526e764abea23e6f302b9cf44d",
  isAdmin: true,
  isDispatcher: false,
  isDriver: false,
  isShipment: false,
  isZtShipment: false,
  message: '操作成功',
  permissions: ["*:*:*"],
  roles: ['admin'],
  user: {
    avatar: "https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/头像.jpg",
    branch: {
      branchAddress: null,
      branchArtificialName: null,
      branchTel: null,
      code: "a301840e69d6306fd44ca72eb3bd25cc",
      id: 1,
      name: "福建大道成物流科技有限公司",
      orgCode: "280df9c3195e4c33803338e57ccaa9e0",
      uniformSocialCreditCode: null,
    },
    email: "ddc@163.com",
    nickName: "大道成超级管理员",
    org: {
      id: 1,
      delFlag: "0",
      orgCode: "280df9c3195e4c33803338e57ccaa9e0",
      orgName: "福建大道成物流科技有限公司",
      status: null,
      orgType: null,
      authStatus: 3,
    },
    orgCode: "280df9c3195e4c33803338e57ccaa9e0",
    orgId: 1,
    phonenumber: "15888888888",
    remark: null,
    roles: [{
      dataScope: "1",
      roleCode: "all_admin",
      roleId: 1,
      roleKey: "all_admin",
      roleName: "平台超级管理员",
    }],
    sex: "0",
    status: "0",
    userCode: "ca8b3f3528a34365b41ad4cdb2074f67",
    userId: -1,
    userName: "admin"
  }
}

const getRouters = {
  code: 200,
  message: '操作成功',
  data: [{
    alwaysShow: 'true',
    children: [{
      component: "orders/release/index",
      hidden: false,
      meta: { title: "发布货源", icon: "peoples", noCache: false },
      name: "Release",
      path: "release",
    }, {
      component: "orders/manage/index",
      hidden: false,
      meta: { title: "货源管理", icon: "peoples", noCache: false },
      name: "Manage",
      path: "manage"
    }],
    component: "Layout",
    hidden: false,
    name: "Orders",
    path: "/orders",
    redirect: "noRedirect",
    meta: { title: "货源", icon: 'el-icon-box', noCache: false }
  }, {
    component: "Layout",
    hidden: false,
    name: "usermanagement",
    path: "/usermanagement",
    redirect: "management",
    children: [{
      name: "management",
      path: "/management",
      component: "usermanagement",
      meta: { title: "用户管理", icon: "nav-waybill", noCache: false },
    }]
  }]
}


export default {
  // 'get|/getInfo': getuserinfo,
  'get|/dev-api/getRouters': getRouters
}

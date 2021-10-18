export default {
    carList: '/fmsweb/basic/wallet/v1/carList',//银行卡列表
    getInfoPersonWallet: '/fmsweb/basic/wallet/v1/getInfoPersonWallet',//获取钱包信息
    delList: (id) => `/fmsweb/basic/wallet/v1/del/${id}`,//解绑
    rel_car: '/fmsweb/basic/wallet/v1/carRel',// 绑定银行卡
    transferApply: '/fmsweb/basic/wallet/v1/transferApply',//申请提现
    transferApplyList: '/fmsweb/basic/wallet/v1/transferApplyList',//提现列表
    listForTeam: '/fmsweb/basic/wallet/v1/listForTeam',//收支明细
    forgetPassword: '/fmsweb/basic/wallet/v1/forgetPassword',//忘记密码
    dealApply: '/fmsweb/basic/wallet/v1',//已打款金额处理中金额
    provinceList: '/fmsweb/basic/wallet/v1/province',//省列表
    cityList: '/fmsweb/basic/wallet/v1/city', //市列表
    certificates: 'fmsweb/basic/wallet/v1/certificates' //银行卡识别
}

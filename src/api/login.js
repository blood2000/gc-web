
export default {
  login:'/fmsweb/basic/common/v1/login',  // 密码登录方法
  loginBySms:'/fmsweb/basic/common/v1/loginBySms',  // 验证码登录方法
  register:'/fmsweb/basic/common/v1/register', // 注册方法
  getInfo:'/fmsweb/basic/common/v1/userinfo', // 获取用户详细信息
  logout:'/logout', // 退出方法
  getCodeImg:'/captchaImage', // 获取验证码
  mock_test:'/parameter/query', //mock测试
  getCode: '/auth/send_sms',   //获取短信验证码
  checkCode: '/auth/check_captcha',   //验证手机号及短信验证码是否匹配
  // uploadImg: '/fmsweb/system/common/v1/upload',
  uploadImg: '/fmsweb/basic/common/v1/uploadCertAndGetInfoWithoutToken',
  resetPwd: '/fmsweb/basic/common/v1/resetPwd',  //重设密码/忘记密码
}

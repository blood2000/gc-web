
//   // 测试
export default {
  login:'/fmsweb/basic/common/v2/login',  // 密码登录方法
  loginBySms:'/fmsweb/basic/common/v2/loginBySms',  // 验证码登录方法
  getInfo:'/fmsweb/basic/common/v2/userinfo', // 获取用户详细信息
  getInfo:'/fmsweb/basic/common/v1/userinfo', // 获取用户详细信息
  logout:'/logout', // 退出方法
  getCodeImg:'/captchaImage', // 获取验证码
  mock_test:'/parameter/query', //mock测试
  checkPhoneNumber: '/fmsweb/basic/common/v1/phoneNumberIsExist', //验证手机号是否已存在
  getCode: '/chy/auth/send_sms',   //获取短信验证码
  checkCode: '/chy/auth/check_captcha',   //验证手机号及短信验证码是否匹配
  uploadImg: '/fmsweb/basic/common/v1/uploadCertAndGetInfoWithoutToken',
  resetPwd: '/fmsweb/basic/common/v1/resetPwd',  //重设密码/忘记密码
  protocol:'/assets/protocol/protocol.html',
  changePwd: '/fmsweb/basic/common/v1/changePwd',   //修改密码（通过旧密码）
  changePwdBySMS: '/fmsweb/basic/common/v1/changePwdBySMS',   //修改密码（通过短信）
  getTeamInfo: '/fmsweb/basic/common/v1/getTeamInfo',   //获取车队长信息（身份认证信息）
  updateTeamInfo: '/fmsweb/basic/common/v1/updateTeamInfo'   //编辑车队长信息（身份认证信息）
}


  // 正式
// export default {
//   login:'/fmsweb/basic/common/v1/login',  // 密码登录方法
//   loginBySms:'/fmsweb/basic/common/v1/loginBySms',  // 验证码登录方法
//   register:'/fmsweb/basic/common/v1/register', // 注册方法
//   getInfo:'/fmsweb/basic/common/v1/userinfo', // 获取用户详细信息
//   logout:'/logout', // 退出方法
//   getCodeImg:'/captchaImage', // 获取验证码
//   mock_test:'/parameter/query', //mock测试
//   checkPhoneNumber: '/fmsweb/basic/common/v1/phoneNumberIsExist', //验证手机号是否已存在
//   getCode: '/chy/auth/send_sms',   //获取短信验证码
//   checkCode: '/chy/auth/check_captcha',   //验证手机号及短信验证码是否匹配
//   // uploadImg: '/fmsweb/system/common/v1/upload',
//   uploadImg: '/fmsweb/basic/common/v1/uploadCertAndGetInfoWithoutToken',
//   resetPwd: '/fmsweb/basic/common/v1/resetPwd',  //重设密码/忘记密码
//   protocol:'/assets/protocol/protocol.html',
//   changePwd: '/fmsweb/basic/common/v1/changePwd',   //修改密码（通过旧密码）
//   changePwdBySMS: '/fmsweb/basic/common/v1/changePwdBySMS',   //修改密码（通过短信）
//   getTeamInfo: '/fmsweb/basic/common/v1/getTeamInfo',   //获取车队长信息（身份认证信息）
//   updateTeamInfo: '/fmsweb/basic/common/v1/updateTeamInfo'   //编辑车队长信息（身份认证信息）
// }

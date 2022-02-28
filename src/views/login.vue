<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div class="login-title">Welcome to you</div>
      <div class="login-label">欢迎您来到至简管车</div>
      <!-- <h3 class="title">智慧车队后台管理系统</h3> -->
      <div
        class="login-type"
        :class="captchaOnOff ? 'captcha-login' : 'acct-login'"
      >
        <div class="line"></div>
        <div style="margin-right:35px" :class="captchaOnOff ? 'cur-login' : ''" @click="login(0)">
          账号登录
        </div>
        <div :class="!captchaOnOff ? 'cur-login' : ''" @click="login(1)">
          短信登录
        </div>
      </div>
      <el-form-item prop="telephone">
        <div class="input-box">
          <div class="input-box-img">
            <img
              style="width: 100%; height: 100%"
              src="../assets/images/login/user.png"
              alt=""
            />
          </div>
          <div class="input-box-line"></div>
          <el-input
            v-model="loginForm.telephone"
            type="text"
            auto-complete="off"
            placeholder="请输入账号/手机号登录"
            clearable
          >
          </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="password" v-if="captchaOnOff">
        <div class="input-box">
          <div class="input-box-img">
            <img
              style="width: 100%; height: 100%"
              src="../assets/images/login/password.png"
              alt=""
            />
          </div>
          <div class="input-box-line"></div>
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="请输入密码"
            clearable
            @keyup.enter.native="handleLogin"
          >
            <!-- <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          /> -->
          </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="captcha" v-if="!captchaOnOff">
        <div class="input-box">
          <div class="input-box-img">
            <img
              style="width: 100%; height: 100%"
              src="../assets/images/login/yanzhengma.png"
              alt=""
            />
          </div>
          <div class="input-box-line"></div>
          <el-input
            v-model="loginForm.captcha"
            auto-complete="off"
            placeholder="请输入验证码"
            clearable
            @keyup.enter.native="handleLogin"
          >
          </el-input>
          <div class="login-code" @click="getCode">
            {{ verCodeText }}
          </div>
        </div>
      </el-form-item>
      <div class="check-box">
        <el-checkbox v-if="captchaOnOff" v-model="loginForm.rememberMe">
          记住密码
        </el-checkbox>
        <router-link class="link-type" :to="'/resetPwd'" v-show="captchaOnOff">
          忘记密码
        </router-link>
      </div>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <!-- <div class="form-bottom">
        还没有账号？
        <router-link class="link-type2" :to="'/register'">
          立即去注册
        </router-link>
      </div> -->
    </el-form>
    <img
      class="login-title-bg"
      src="../assets/images/login/logo.png"
      style="width: 238px; height: 56px"
      alt=""
    />
    <video
      autoplay
      muted
      loop
      class="login-bg"
      src="../assets/images/login/login-bg.mp4"
    ></video>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <div>福建至简至一信息科技有限公司 版权所有</div>
      <span>CopyRight@ 2021 All Rights Reserved 闽ICP备2021009502号-4</span>
    </div> -->
  </div>
</template>

<script>
import { http_request } from "@/api";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import formValidate from "../utils/formValidate";
import { Notification, MessageBox, Message } from "element-ui";
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginType: 0,
      sendCode: true,
      verCodeText: "获取验证码",
      verCodeSecond: 60, //当前秒数
      countdownSeconds: 60, //倒计时总秒数
      countdownTimer: null,
      loginForm: {
        telephone: "",
        password: "",
        rememberMe: false,
        captcha: "12",
        uuid: "",
      },
      loginRules: {
        telephone: [
          {
            required: true,
            trigger: "change",
            validator: formValidate.telphone,
          },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        captcha: [
          { required: true, trigger: "change", message: "请输入验证码" },
        ],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log(route);
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    login(type) {
      if (type === 0) {
        this.captchaOnOff = true;
      } else {
        this.captchaOnOff = false;
      }
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      });
    },
    // 验证手机号
    //验证手机号是否已注册
    checkPhone() {
      if (!this.sendCode) {
        return;
      }
      this.$refs.loginForm.validateField("telephone", (msg) => {
        if (msg) {
          return;
        }
        const data = {
          phoneNumber: this.loginForm.telephone,
        };
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "checkPhoneNumber",
          data: data,
        };
        http_request(obj)
          .then((res) => {})
          .catch((msg) => {
            console.log(msg);
          });
      });
    },
    getCode() {
      if (!this.sendCode) {
        return;
      }
      this.$refs.loginForm.validateField("telephone", (msg) => {
        if (msg) {
          return;
        }
        const data = {
          telno: this.loginForm.telephone,
          type: "login",
        };
        const obj = {
          moduleName: "http_login",
          method: "post",
          url_alias: "getCode",
          data: data,
        };
        http_request(obj)
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.countdown();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });

      // getCodeImg().then(res => {
      // this.captchaOnOff =
      //   res.captchaOnOff === undefined ? true : res.captchaOnOff;
      // if (this.captchaOnOff) {
      //   this.codeUrl = "data:image/gif;base64," + res.img;
      //   this.loginForm.uuid = res.uuid;
      // }
      // });
    },
    //验证码倒计时
    countdown() {
      this.sendCode = false;
      this.verCodeSecond = 60;
      let that = this;
      this.countdownTimer = setInterval(() => {
        this.verCodeSecond > 0 && this.verCodeSecond--;
        this.verCodeText = `已获取(${this.verCodeSecond})`;
      }, 1000);
      setTimeout(() => {
        this.sendCode = true;
        this.verCodeSecond = this.countdownSeconds;
        //this.countdownTimer = null;
        this.verCodeText = "获取验证码";
        clearInterval(that.countdownTimer);
        console.log(this.countdownTimer);
      }, that.countdownSeconds * 1000);
    },
    getCookie() {
      const telephone = Cookies.get("telephone");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        telephone:
          telephone === undefined ? this.loginForm.telephone : telephone,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
                console.log('!this.captchaOnOff',this.captchaOnOff)

      this.$refs.loginForm.validate((valid) => {
        console.log('valid',valid)
        if (valid) {
          if (!this.captchaOnOff) {
           
             this.checkCode();
          } else {
             this.loading = true;
            this.pwdLogin();
           
          }
        }
      });
    },
    checkCode() {
      const data = {
        type: "login",
        telno: this.loginForm.telephone,
        captcha: this.loginForm.captcha,
      };
      const obj = {
        moduleName: "http_login",
        method: "post",
        url_alias: "checkCode",
        data: data,
      };
      http_request(obj)
        .then((res) => {
          this.loading = true;
          this.smsLogin();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    pwdLogin() {
      if (this.loginForm.rememberMe) {
        Cookies.set("telephone", this.loginForm.telephone, { expires: 30 });
        Cookies.set("password", encrypt(this.loginForm.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", this.loginForm.rememberMe, {
          expires: 30,
        });
      } else {
        Cookies.remove("telephone");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }

      this.$store
        .dispatch("Login", this.loginForm)
        .then(() => {
          // this.loading = false;
          this.getUserInfo();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    smsLogin() {
      let loginInfo = {
        telephone: this.loginForm.telephone,
        captcha: this.loginForm.captcha,
      };
      this.$store
        .dispatch("LoginBySms", loginInfo)
        .then(() => {
          // this.loading = false;
          this.getUserInfo();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //获取用户信息判断是否已审核
    getUserInfo() {
      this.$router.push({ path: this.redirect || "/" }).catch(() => {});
      console.log("你过不过来");
      this.loading = false;
      return;
      this.$store
        .dispatch("getLoginInfo")
        .then((res) => {
          console.log("用户信息==>", res);
          // if (res.team.authStatus !== 3) {
          //   let message = ['欢迎来到至简管车，您提交的注册信息正在认证中，请耐心等待', '欢迎来到至简管车，您提交的注册信息正在认证中，请耐心等待', '欢迎来到至简管车，您提交的注册信息认证失败，请修改注册信息后重新提交。']
          //   this.$store.dispatch("NoAuth").then(() => {
          //     this.$message({
          //       message: message[res.team.authStatus],
          //       type: "warning",
          //     });
          //     let timer = setTimeout(() => {
          //       // location.href = "/index";
          //       this.$router.push("/register?registerStatus=2");
          //       clearTimeout(timer);
          //     }, 1000);
          //   });
          //   return;
          // }
          this.$router.push({ path: this.redirect || "/" }).catch(() => {});
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  // display: flex;
  // justify-content: flex-end;
  // align-items: center;
  height: 100%;
  // background-image: url("../assets/images/login-background.gif");
  // background-size: 100% 100%;
}
.login-bg {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.login-title {
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  font-family: PingFang SC;
  margin-bottom: 10px;
  background: url("../assets/images/login/login-title-bg.png") no-repeat;
  background-position: 0px 33px;
}
.login-title-bg {
  position: absolute;
  top: 37px;
  left: 46px;
  z-index: 300;
}
.login-label {
  font-size: 21px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #e0e0e0;
  opacity: 0.89;
  margin-bottom: 40px;
}
.title {
  margin: 0px auto 10px auto;
  text-align: center;
  color: #121212;
  font-weight: bold;
}

.login-type {
  position: relative;
  width: 200px;
  // height: 50px;
  margin: 0 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #ffffff;
  .line {
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.18);
    position: absolute;
    width: 392px;
    height: 1px;
    top: 40px;
  }
}

.login-type::before {
  content: "";
  transition: all 0.25s linear;
}

.captcha-login::before {
  position: absolute;
  content: "";
  width: 51px;
  height: 3px;
  background: #ffffff;
  left: 15px;
  bottom: -13px;
  border-radius: 2px;
}

.acct-login::before {
  position: absolute;
  content: "";
  width: 51px;
  height: 3px;
  background: #ffffff;
      left: 130px;
  bottom: -13px;
  border-radius: 2px;
}

.cur-login {
  font-weight: bold !important;
  color: #ffffff !important;
}

.login-type > div {
  cursor: pointer;
  width: 100px;
  font-size: 19px;
  font-weight: 400;
  font-family: PingFang SC;
  color: rgba($color: #ffffff, $alpha: 0.8);
}

.login-form {
  -webkit-animation: loginformanimation 1s ease-in-out; /* Safari 与 Chrome */
  position: fixed;
  z-index: 110;
  top: calc(50% - 292.5px);
  right: 0;
  width: 454px;
  height: 585px;
  // border: 2px solid #ffffff;
  background: #04132f;
  border-radius: 10px 0px 0px 10px;
  padding: 53px 19px 35px 27px;
  .el-input {
    height: 43px;
    input {
      height: 43px;
    }
  }
  .input-icon {
    height: 43px;
    width: 14px;
    margin-left: 2px;
  }
  .input-icon::after {
    content: "|";
    width: 1px;
    height: 43px;
    margin-left: 20px;
  }
}

@keyframes loginformanimation {
  from {
    right: -454px;
  }
  to {
    right: 0;
  }
}

.input-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: url("../assets/images/login/login-input.png") no-repeat;
  padding-left: 20px;
  &-img {
    width: 24px;
    height: 24px;
  }
  &-line {
    width: 1px;
    height: 28px;
    border-right: 1px solid rgba($color: #fff, $alpha: 0.22);
    margin-left: 7px;
  }
}
::v-deep .el-input--medium .el-input__inner {
  height: 43px !important;
  line-height: 43px !important;
  background: transparent;
  border: none;
  // padding-left: 64px;
  color: #fff;
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
}
::v-deep .el-input--medium .el-input__inner::-webkit-input-placeholder {
  color: #d4dbe8;
}
::v-deep .el-input--medium .el-input__inner::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #d4dbe8;
}
::v-deep .el-input--medium .el-input__inner:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #d4dbe8;
}
::v-deep .el-input--medium .el-input__inner:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #d4dbe8;
}
::v-deep .el-button--medium {
  border-radius: 8px;
  font-size: 19px;
}
::v-deep .el-button--primary {
  background: #0b5599;
  border-color: #0b5599;
}
::v-deep .el-button--primary:hover,
.el-button--primary:focus {
  background: #46a6ff;
  border-color: #46a6ff;
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 41px;
  float: right;
  position: absolute;
  top: 1px;
  right: 1px;
  line-height: 41px;
  text-align: center;
  background: #eee;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: 1px solid #dcdfe6;
  cursor: pointer;
  color: #fff;
  background: #263651;
  border-left: 1px solid #263651;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
}

.no-send {
  color: #fff;
  background: #263651;
  border-left: 1px solid #263651;
}

.form-bottom {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.8;
  position: relative;
  background: url("../assets/images/login/goTo.png") no-repeat;
  padding-bottom: 2px;
  background-position: 212px 21px;
  .link-type2 {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    opacity: 0.8;
  }
}

.el-login-footer {
  // height: 40px;
  // line-height: 40px;
  position: fixed;
  padding: 10px 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.check-box {
  height: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
}
// #0B5599
::v-deep .el-checkbox__inner {
  background: transparent;
  border: 1px solid #acacac;
  border-radius: 4px;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #0b5599;
  border-color: #0b5599;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0b5599;
}
.link-type {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba($color: #c2c2c2, $alpha: 0.9);
}
.link-type:focus {
  color: #0b5599;
}
</style>

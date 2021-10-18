<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <!-- <h3 class="title">智慧车队后台管理系统</h3> -->
      <div class="login-type" :class="captchaOnOff ? 'captcha-login' : 'acct-login'">
        <div :class="captchaOnOff ? 'cur-login' : ''" @click="login(0)">
          短信登录
        </div>
        <div :class="!captchaOnOff ? 'cur-login' : ''" @click="login(1)">
          账号登录
        </div>
      </div>
      <el-form-item prop="telephone">
        <el-input
          v-model="loginForm.telephone"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password" v-if="!captchaOnOff">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div
          class="login-code"
          :class="sendCode ? 'no-send' : ''"
          @click="getCode"
        >
          {{ verCodeText }}
        </div>
      </el-form-item>
      <div class="check-box">
        <el-checkbox v-if="!captchaOnOff" v-model="loginForm.rememberMe">
          记住密码
        </el-checkbox>
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
      <div class="form-bottom">
          <router-link class="link-type" :to="'/register'">
            立即注册
          </router-link>
          <router-link class="link-type" :to="'/resetPwd'" v-show="!captchaOnOff">
            忘记密码
          </router-link>
        </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <div>福建至简至一信息科技有限公司 版权所有</div>
      <span>CopyRight@ 2021 All Rights Reserved 闽ICP备19023755号-2</span>
    </div>
  </div>
</template>

<script>
import { http_request } from "@/api";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import formValidate from "../utils/formValidate";
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
        console.log(route)
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
      this.$refs.loginForm.clearValidate();
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
      let that = this;
      this.countdownTimer = setInterval(() => {
        this.verCodeSecond--;
        this.verCodeText = `再次发送(${this.verCodeSecond})`;
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
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (!this.captchaOnOff) {
            this.pwdLogin();
          } else {
            this.smsLogin();
          }
        }
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
          this.$router.push({ path: this.redirect || "/" }).catch(() => {});
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;
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
  margin: 0 auto 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #5f5f5f;
}

.login-type::before {
  content: '';
  transition: all .25s linear;
}

.captcha-login::before {
  position: absolute;
  content: '';
  width: 40px;
  height: 2px;
  background: #4682FA;
  left: 30px;
  bottom: -10px;
}

.acct-login::before {
  position: absolute;
  content: '';
  width: 40px;
  height: 2px;
  background: #4682FA;
  left: 130px;
  bottom: -10px;
}

.cur-login {
  font-weight: bold;
  color: #121212;
}

.login-type > div {
  cursor: pointer;
  width: 100px;
  text-align: center;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  // height: 380px;
  margin-right: 100px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 34px;
  float: right;
  position: absolute;
  top: 1px;
  right: 1px;
  text-align: center;
  background: #eee;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: 1px solid #dcdfe6;
  cursor: pointer;
  color: #999;
}

.no-send {
  color: #fff;
  background: #1890ff;
  border-left: 1px solid #1890ff;
}

.form-bottom {
  height: 40px;
  display: flex;
  justify-content: space-between;
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
  margin-bottom: 20px;
}
</style>

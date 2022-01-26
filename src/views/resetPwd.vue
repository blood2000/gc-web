<template>
  <div class="reset">
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="resetRules"
      class="login-form"
    >
      <div class="login-title">Welcome to you</div>
      <div class="login-label">欢迎您来到至简管车</div>
      <div class="login-type">
        <div> 忘记密码</div>
         <div class="line"></div>
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
          v-model="resetForm.telephone"
          type="text"
          auto-complete="off"
          placeholder="请输入账号/手机号登录"
          clearable
        >
        </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="captcha">
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
          v-model="resetForm.captcha"
          auto-complete="off"
          placeholder="请输入验证码"
          clearable
        >
        </el-input>
        <div
          class="login-code"
          :class="sendCode ? 'no-send' : ''"
          @click="checkPhone"
        >
          {{ verCodeText }}
        </div>
        </div>
      </el-form-item>
      <el-form-item prop="password">
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
          v-model="resetForm.password"
          type="password"
          auto-complete="off"
          placeholder="请输入密码"
          clearable
          @keyup.enter.native="handleReset"
        >
          
        </el-input>
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleReset"
        >
          <span>提交</span>
          <!-- <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span> -->
        </el-button>
      </el-form-item>
      <div class="register-type">
        <!-- <router-link class="link-type" :to="'/login'"> 返回登录 </router-link> -->
        <div class="link-type" @click="toLogin">返回登录</div>
      </div>
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
  </div>
</template>

<script>
import { getCodeImg, register } from "@/api/login";
import { http_request } from "../api";
import formValidate from "../utils/formValidate";
import { getToken, setToken } from "@/utils/auth";
import { Notification, MessageBox, Message } from "element-ui";
export default {
  name: "Register",
  data() {
    // const equalToPassword = (rule, value, callback) => {
    //   if (this.registerForm.password !== value) {
    //     callback(new Error("两次输入的密码不一致"));
    //   } else {
    //     callback();
    //   }
    // };
    const pwdValid = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      sendCode: true,
      verCodeText: "获取验证码",
      verCodeSecond: 60, //当前秒数
      countdownSeconds: 60, //倒计时总秒数
      countdownTimer: null,
      resetForm: {
        captcha: "",
        telephone: "",
        password: "",
      },

      resetRules: {
        telephone: [
          {
            required: true,
            trigger: "change",
            validator: formValidate.telphone,
          },
        ],
        captcha: [
          { required: true, trigger: "change", message: "请输入验证码" },
        ],
        password: [{ required: true, trigger: "change", validator: pwdValid }],
      },
      loading: false,
    };
  },
  created() {
    // this.getCode();
    let myEndTime = localStorage.getItem("resetEndTime");
    // this.registerForm.telephone = localStorage.getItem('registerTel');
    myEndTime && this.countdown(myEndTime);
  },
  mounted() {
    // setTimeout(() => {
    //   this.$refs.registerForm.clearValidate();
    //   this.registerStatus = 1;
    // }, 3000);
  },

  methods: {
    //验证手机号是否已注册
    checkPhone() {
      if (!this.sendCode) {
        return;
      }
      this.$refs.resetForm.validateField("telephone", (msg) => {
        if (msg) {
          return;
        }
        const data = {
          phoneNumber: this.resetForm.telephone,
        };
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "checkPhoneNumber",
          data: data,
        };
        http_request(obj)
          .then((res) => {
            Message({
              message: "手机号未注册",
              type: "error",
              duration: 3 * 1000,
              showClose: true,
            });
          })
          .catch((msg) => {
            console.log("wyp---", msg);
            if (msg === "手机号已存在") {
              this.getCode();
            }
          });
      });
    },
    getCode() {
      if (!this.sendCode) {
        return;
      }

      // let leap = this.verifyTel();validateField
      this.$refs.resetForm.validateField("telephone", (msg) => {
        if (msg) {
          return;
        }
        const data = {
          telno: this.resetForm.telephone,
          type: "reset",
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
              let endMsRes =
                new Date().getTime() + this.countdownSeconds * 1000;
              localStorage.setItem("resetEndTime", endMsRes);
              // localStorage.setItem("registerTel", this.registerForm.telephone);
              this.countdown(endMsRes);
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
    countdown(endMsRes) {
      this.sendCode = false;
      let that = this;
      this.verCodeSecond = Math.ceil((endMsRes - new Date().getTime()) / 1000);
      this.countdownTimer = setTimeout(() => {
        this.verCodeSecond--;
        this.verCodeText = `已获取(${this.verCodeSecond})`;
        if (this.verCodeSecond < 1) {
          this.sendCode = true;
          this.verCodeSecond = this.countdownSeconds;
          localStorage.removeItem("resetEndTime");
          this.verCodeText = "获取验证码";
          clearTimeout(that.countdownTimer);
        } else {
          that.countdown(endMsRes);
        }
      }, 1000);
    },

    handleReset() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // register(this.registerForm)
          const obj = {
            moduleName: "http_login",
            method: "post",
            url_alias: "resetPwd",
            data: this.resetForm,
            Headers: { isToken: false },
          };
          http_request(obj)
            .then((res) => {
              console.log("重设密码", res);
              this.loading = false;
              this.$alert("操作成功", {
                dangerouslyUseHTMLString: true,
              })
                .then(() => {
                  this.$router.push("/login");
                })
                .catch(() => {});
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    toLogin() {
      console.log(getToken());
      if (getToken()) {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push("/login");
        });
      } else {
        this.$router.push("/login");
      }
      // this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="scss">
.login-title-bg {
  position: absolute;
  top: 37px;
  left: 46px;
  z-index: 300;
}
.login-bg {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.reset {
   height: 100%;

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
.login-type > div {
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

.link-type {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba($color: #c2c2c2, $alpha: 0.9);
  text-align: center;
}
.link-type:focus {
  color: #0b5599;
}

</style>

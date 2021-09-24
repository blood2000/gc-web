<template>
  <div class="reset">
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="resetRules"
      class="reset-form"
    >
      <h3 class="title">忘记密码</h3>
      <el-form-item prop="telephone">
        <el-input
          v-model="resetForm.telephone"
          type="text"
          auto-complete="off"
          placeholder="手机号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          v-model="resetForm.captcha"
          auto-complete="off"
          placeholder="验证码"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div
          class="register-code"
          :class="sendCode ? 'no-send' : ''"
          @click="getCode"
        >
          {{ verCodeText }}
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="resetForm.password"
          type="password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleReset"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
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
        <router-link class="link-type" :to="'/login'"> 返回登录 </router-link>
      </div>
    </el-form>

    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, register } from "@/api/login";
import { http_request } from "../api";
import formValidate from "../utils/formValidate";
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
      if (value === undefined || value === null || value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      } else {
        callback();
      }
    }
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
        password: [
          { required: true, trigger: "change", validator: pwdValid },
        ],
      },
      loading: false,
    }
  },
  created() {
    // this.getCode();
  },
  mounted() {
    // setTimeout(() => {
    //   this.$refs.registerForm.clearValidate();
    //   this.registerStatus = 1;
    // }, 3000);
  },

  methods: {
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
              console.log('重设密码',res)
              this.loading = false;
              this.$alert(
                "操作成功",
                {
                  dangerouslyUseHTMLString: true,
                }
              )
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
  },
};
</script>

<style scoped lang="scss">
.reset {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #121212;
  font-weight: bold;
}

.reset-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
   margin-right: 100px;
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
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-type {
  height: 40px;
  text-align: center;
}

.register-code {
  width: 33%;
  height: 36px;
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
// .register-code {
//   width: 33%;
//   height: 38px;
//   float: right;
//   img {
//     cursor: pointer;
//     vertical-align: middle;
//   }
// }
.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-code-img {
  height: 38px;
}

.img-box,
.img-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.img-title {
  margin-bottom: 10px;
  span {
    width: 45%;
    text-align: center;
  }
}

.img {
  width: 45%;
  height: 100px;
  background: #ddd;
  img {
    width: 100%;
    height: 100%;
  }
}

.input-title {
  height: 30px;
}

.input-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .el-form-item {
    width: 180px;
    margin-bottom: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>

<template>
  <el-form
    class="center-form"
    ref="form"
    :model="user"
    :rules="rules"
    label-width="80px"
    :loading="loading"
  >
    <el-form-item label="手机" prop="phone">
      <el-input :value="phoneNumber" :readonly="true" type="text" />
    </el-form-item>
    <el-form-item prop="captcha" label="验证码">
      <el-input v-model="user.captcha" auto-complete="off" placeholder="验证码">
      </el-input>
      <div
        class="captcha-code"
        :class="sendCode ? 'no-send' : ''"
        @click="getCode"
      >
        {{ verCodeText }}
      </div>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <!-- <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password
      />
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">确认</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import { http_request } from "../../../../api";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      user: {
        captcha: undefined,
        newPassword: undefined,
      },
      sendCode: true,
      verCodeText: "获取验证码",
      verCodeSecond: 60, //当前秒数
      countdownSeconds: 60, //倒计时总秒数
      countdownTimer: null,
      loading: false,
      // 表单校验
      rules: {
        captcha: [
          { required: true, trigger: "change", message: "请输入验证码" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
    };
  },
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  methods: {
    getCode() {
      if (!this.sendCode) {
        return;
      }
      const data = {
        telno: this.phoneNumber,
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          // register(this.registerForm)
          this.user.telephone = this.phoneNumber;
          const obj = {
            moduleName: "http_login",
            method: "post",
            url_alias: "changePwdBySMS",
            data: this.user,
            // Headers: { isToken: false },
          };
          http_request(obj)
            .then((res) => {
              console.log("短信修改密码", res);
              this.loading = false;
              this.$alert(res.msg, "提示", {
                confirmButtonText: "确定",
                callback: () => {
                  this.$store.dispatch("LogOut").then(() => {
                    location.href = "/index";
                  });
                },
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    },
  },
};
</script>
<style lang="scss" scoped>
.center-form {
  width: 360px;
}
.captcha-code {
  width: 33%;
  height: 36px;
  float: right;
  position: absolute;
  top: 0;
  right: 0;
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
</style>

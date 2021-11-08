<template>
  <div class="register">
    <!-- <iframe class="iframe" src="/static/protocol/protocol.html" frameborder="0" /> -->
    <el-form
      v-if="registerStatus === 0"
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <h3 class="title">欢迎注册</h3>
      <el-form-item prop="telephone">
        <el-input
          v-model="registerForm.telephone"
          type="text"
          auto-complete="off"
          placeholder="手机号"
          clearable
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
          v-model="registerForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          clearable
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
          @click="checkPhone"
        >
          {{ verCodeText }}
        </div>
      </el-form-item>
      <div class="protocol">
        注册即表示您同意我们的
        <span @click="toProtocol">《用户协议》</span>
        <!-- <router-link class="link-type" :to="'/protocol'">
          《用户协议》
        </router-link> -->
        <span @click="toPrivacy">《隐私政策》</span>
      </div>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="checkCode"
        >
          <span>下一步</span>
          <!-- <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span> -->
        </el-button>
      </el-form-item>
      <div class="register-type">
        <!-- <router-link class="link-type" :to="'/login'">
          使用已有账户登录
        </router-link> -->
        <div class="link-type" @click="toLogin">使用已有账户登录</div>
      </div>
    </el-form>

    <el-form
      v-if="registerStatus === 1 || registerStatus === 2"
      v-loading="loading"
      ref="idCardForm"
      :model="idCardForm"
      :rules="idCardRules"
      class="register-form register-idcard"
    >
      <h3 class="title">完善身份信息</h3>
      <!-- <div class="idcard">
        <div class="img-title">
          <span>身份证正面</span>
          <span>身份证反面</span>
        </div>
        
      </div> -->
      <div class="img-box">
        <input
          type="file"
          @change="fileChange"
          ref="import"
          style="display: none"
        />
        <div class="img face-img" @click="importIdCard(0)">
          <img
            v-if="idCardForm.idCardFaceImageUrl"
            :src="idCardForm.idCardFaceImageUrl"
            alt=""
          />
        </div>
        <div class="img emblem-img" @click="importIdCard(1)">
          <img
            v-if="idCardForm.idCardNationalEmblemImageUrl"
            :src="idCardForm.idCardNationalEmblemImageUrl"
            alt=""
          />
        </div>
      </div>
      <el-form-item prop="name">
        <el-input
          v-model="idCardForm.name"
          type="text"
          auto-complete="off"
          placeholder="请输入姓名"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="number">
        <el-input
          v-model="idCardForm.number"
          type="text"
          auto-complete="off"
          placeholder="请输入身份证号码"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="textarea"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <div class="input-title">身份证有效期</div>
      <div class="input-box">
        <!-- <el-form-item prop="dateRange">
          <el-date-picker
            v-model="idCardForm.dateRange"
            :editable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="截止日期"
            value-format="yyyy-MM-dd"
            :format="dateFormat"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item prop="validFrom">
          <el-date-picker
            popper-class="idcard-date"
            v-model="idCardForm.validFrom"
            :editable="false"
            type="date"
            placeholder="有效起始日期"
            value-format="yyyy-MM-dd"
          >
            <svg-icon
              slot="prefix"
              icon-class="date"
              class="el-input__icon input-icon"
            />
          </el-date-picker>
        </el-form-item>

        <div>至</div>
        <el-form-item prop="validTo" v-if="showValidTo">
          <el-date-picker
            popper-class="idcard-date"
            v-model="idCardForm.validTo"
            type="date"
            :editable="false"
            placeholder="有效截止日期"
            value-format="yyyy-MM-dd"
            :picker-options="validToOption"
          >
            <svg-icon
              slot="prefix"
              icon-class="date"
              class="el-input__icon input-icon"
            />
          </el-date-picker>
        </el-form-item>
        <!-- 显示长期 -->
        <el-form-item prop="isExpired" v-if="!showValidTo">
          <el-input
            v-model="idCardForm.isExpired"
            @focus="showValidTo = true;"
            type="text"
            auto-complete="off"
            readonly="readonly"
            clearable
          >
            <svg-icon
              slot="prefix"
              icon-class="date"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
      </div>
      <el-form-item style="margin-bottom: 0"> </el-form-item>
      <el-form-item prop="orgName">
        <el-input
          v-model="idCardForm.orgName"
          type="text"
          auto-complete="off"
          placeholder="请输入企业或车队全称"
          clearable
        >
          <svg-icon
            slot="prefix"
            icon-class="nav-enterprise"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>

      <el-form-item style="width: 100%" v-if="registerStatus === 1">
        <el-button
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleRegister"
        >
          <span>注 册</span>
          <!-- <span v-else>注 册 中...</span> -->
        </el-button>
      </el-form-item>
      <el-form-item style="width: 100%" v-if="registerStatus === 2">
        <el-button
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleAuth"
        >
          <span>提交资料</span>
          <!-- <span v-else>注 册 中...</span> -->
        </el-button>
      </el-form-item>
      <div class="register-type">
        <!-- <router-link class="link-type" :to="'/login'">
          使用已有账户登录
        </router-link> -->
        <div class="link-type" @click="toLogin">使用已有账户登录</div>
      </div>
    </el-form>

    <!--  底部  -->
    <div class="el-register-footer">
      <div>福建至简至一信息科技有限公司 版权所有</div>
      <span>CopyRight@ 2021 All Rights Reserved 闽ICP备19023755号-2</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, register } from "@/api/login";
import { http_request } from "../api";
import vm from "vue";
import formValidate from "../utils/formValidate";
import { compareBeginEndTime } from "@/utils/index";
import {
  getOnceToken,
  setOnceToken,
  removeOnceToken,
  getToken,
} from "@/utils/auth";
import { Notification, MessageBox, Message } from "element-ui";
export default {
  name: "Register",
  data() {
    const idCardValidTimeEffect = (rule, value, callback) => {
      let endTime = this.idCardForm.validTo;
      console.log(endTime);
      if (!value) {
        callback(new Error(`请选择身份证有效期`));
      } else if (!compareBeginEndTime(value, "2021-12-05")) {
        callback(new Error(`起始日期不能大于截止日期`));
      } else {
        callback();
      }
    };

    const validBeginTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`请选择身份证有效起始日期`));
      } else if (this.idCardForm.validTo && !compareBeginEndTime(value, this.idCardForm.validTo)) {
        callback(new Error(`起始日期不能大于截止日期`));
      } else {
        callback();
      }
    };

    const validEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`请选择身份证有效截止日期`));
      } else if (this.idCardForm.validFrom && !compareBeginEndTime(this.idCardForm.validFrom, value)) {
        callback(new Error(`截止日期不能小于起始日期`));
      } else {
        callback();
      }
    };

    return {
      codeUrl: "",
      registerStatus: 0,
      registerTitle: "欢迎注册智慧车队",
      sendCode: true,
      verCodeText: "获取验证码",
      verCodeSecond: 60, //当前秒数
      countdownSeconds: 60, //倒计时总秒数
      countdownTimer: null,
      registerForm: {
        captcha: "",
        telephone: "",
      },

      idCardForm: {
        name: "",
        number: "",
        orgName: "",
        validFrom: "",
        validTo: "",
        isExpired: "长期",  //长期有效的字段名
        // dateRange: "",
        idCardFaceImageUrl: "",
        idCardNationalEmblemImageUrl: "",
        issue: "",
      },
      showValidTo: true,
      validToOption: {
        shortcuts: [
          {
            text: "长期",
            onClick(picker) {
              // this.showValidTo = false;
              // console.log(Vue)
              picker.$emit("pick", "2500-01-01");
            },
          },
        ],
      },
      registerRules: {
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
      },
      idCardRules: {
        name: [
          { required: true, trigger: "change", validator: formValidate.name },
        ],
        orgName: [
          {
            required: true,
            trigger: "change",
            message: "请输入企业或车队全称",
          },
        ],
        number: [
          { required: true, trigger: "change", validator: formValidate.idCard },
        ],

        validFrom: [
          { required: true, trigger: "change", validator: validBeginTime },
        ],
        validTo: [
          { required: true, trigger: "change", validator: validEndTime },
        ],

        // dateRange: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     validator: idCardValidTimeEffect,
        //   },
        // ],
      },
      loading: false,
      captchaOnOff: true,
      idcardType: 0,
    };
  },
  created() {
    // this.getCode();
  },
  watch: {
    idCardForm: {
      
      handler(newVal,oldVal) {
        if (newVal.validTo === '2500-01-01') {
          this.showValidTo = false;
          newVal.validTo = '';
        }
      },
      deep: true
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.$refs.registerForm.clearValidate();
    //   this.registerStatus = 1;
    // }, 3000);
    let option = document.location.search.split("=")[1];
    let status = option || 0;
    this.registerStatus = status * 1;
    if (this.registerStatus === 2) {
      //获取用户身份认证信息
      this.getIdentityAuth();
    }
  },

  methods: {
    //获取身份认证信息
    getIdentityAuth() {
      let header = {
        Authorization: this.$store.state.user.onceToken,
      };
      const obj = {
        moduleName: "http_login",
        method: "get",
        url_alias: "getTeamInfo",
        header: header,
      };
      http_request(obj).then((res) => {
        console.log("车队长信息", res);
        this.idCardForm.orgName = res.data.orgName || "";
        let idCardInfo = res.data.identificationInf;
        this.idCardForm.idCardFaceImageUrl = idCardInfo.identificationImage;
        this.idCardForm.idCardNationalEmblemImageUrl =
          idCardInfo.identificationBackImage;
        this.idCardForm.name = idCardInfo.name;
        this.idCardForm.validFrom = this.handleDate(idCardInfo.identificationBeginTime);
        this.idCardForm.validTo = this.handleDate(idCardInfo.identificationEndTime);
        this.idCardForm.number = idCardInfo.identificationNumber;
        // this.idCardForm.dateRange = [];
        // this.idCardForm.dateRange[0] = idCardInfo.identificationBeginTime;
        // this.idCardForm.dateRange[1] = idCardInfo.identificationEndTime;
      });
    },
    //验证手机号是否已注册
    checkPhone() {
      if (!this.sendCode) {
        return;
      }
      this.$refs.registerForm.validateField("telephone", (msg) => {
        if (msg) {
          return;
        }
        const data = {
          phoneNumber: this.registerForm.telephone,
        };
        const obj = {
          moduleName: "http_login",
          method: "get",
          url_alias: "checkPhoneNumber",
          data: data,
        };
        http_request(obj)
          .then((res) => {
            this.getCode();
          })
          .catch((msg) => {
            Message({
              message: msg,
              type: "error",
              duration: 3 * 1000,
              showClose: true,
            });
          });
      });
    },
    getCode() {
      const data = {
        telno: this.registerForm.telephone,
        type: "register",
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
      // if (!this.sendCode) {
      //   return;
      // }

      // // let leap = this.verifyTel();validateField
      // this.$refs.registerForm.validateField("telephone", (msg) => {
      //   if (msg) {
      //     return;
      //   }
      // });

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

    checkCode() {
      // this.registerStatus = 1; //wyptest
      // return;
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            type: "register",
            telno: this.registerForm.telephone,
            captcha: this.registerForm.captcha,
          };
          const obj = {
            moduleName: "http_login",
            method: "post",
            url_alias: "checkCode",
            data: data,
          };
          http_request(obj)
            .then((res) => {
              this.loading = false;
              if (res.code === 200) {
                // this.$refs.registerForm.clearValidate();
                this.registerStatus = 1;
              }
            })
            .catch((error) => {
              this.loading = false;
            });
        }
      });
    },

    //跳转用户协议
    toProtocol() {
      // const code = item.dispatchOrderCode;
      // this.$router.push("../../dispatch/order/detail?code=" + code);
      this.$router.push("protocol");
    },

    toPrivacy() {
      this.$router.push("privacy");
    },

    //上传身份证图片
    importIdCard(type) {
      this.idcardType = type; //0-正面；1-反面
      this.$refs.import.dispatchEvent(new MouseEvent("click"));
    },
    //选取文件
    fileChange(e) {
      let file = e.currentTarget.files[0];
      // let reader = new FileReader(); //读取文件
      // reader.readAsText(file);
      // reader.onload = function () {
      //   let json = JSON.parse(this.result);
      //   console.log(json);
      // };
      let formData = new window.FormData();
      formData.append("file", file);
      formData.append("type", "0");
      const obj = {
        moduleName: "http_login",
        method: "post",
        url_alias: "uploadImg",
        data: formData,
        Headers: {
          "Content-type": "multipart/form-data",
        },
      };
      this.loading = true;
      http_request(obj)
        .then((res) => {
          console.log("上传图片ocr返回", res);
          this.loading = false;
          if (res.code === 200) {
            if (this.idcardType === 0) {
              this.idCardForm.idCardFaceImageUrl = res.data.imageUrl;
              this.idCardForm.name = res.data.result.name;
              this.idCardForm.number = res.data.result.number;
              let { sex, birth, address, ethnicity } = res.data.result;
              this.idCardForm = {
                ...this.idCardForm,
                ...{
                  sex,
                  birth,
                  address,
                  ethnicity,
                },
              };
            } else {
            
              this.idCardForm.idCardNationalEmblemImageUrl = res.data.imageUrl;
              // this.idCardForm.dateRange = [];
              // this.handleDate(res.data.result.valid_from) &&
              //   (this.idCardForm.dateRange[0] = res.data.result.valid_from);
              // this.handleDate(res.data.result.valid_to) &&
              //   (this.idCardForm.dateRange[1] = res.data.result.valid_to);
              this.idCardForm.validFrom = this.handleDate(res.data.result.valid_from);
              this.idCardForm.validTo = this.handleDate(res.data.result.valid_to, 1);
              this.idCardForm.issue = res.data.result.issue;
              // console.log(this.idCardForm);
            }
          }

          console.log(112233);
          console.log(this.idCardForm);
        })
        .catch(() => {
          this.loading = false;
        });
      // let localURL = "";
      // if (window.createObjectURL != undefined) {
      //   // basic
      //   localURL = window.createObjectURL(file);
      // } else if (window.URL != undefined) {
      //   // mozilla(firefox)
      //   localURL = window.URL.createObjectURL(file);
      // } else if (window.webkitURL != undefined) {
      //   // webkit or chrome
      //   localURL = window.webkitURL.createObjectURL(file);
      // }
    },

    handleDate(date, type = 0) {
      if (date === '长期') {
        this.showValidTo = false;
        return '';
      } 
      if (type === 1) {
        this.showValidTo = true;
      }
      let arr = date.split("-");
      if (arr.length === 3) {
        return date;
      }
      return '';
    },

    handleRegister() {
      console.log(this.idCardForm);
      this.$refs.idCardForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // register(this.registerForm)
          // let data1 = { ...this.registerForm, ...this.idCardForm };
          let data = {
            name: this.idCardForm.name,
            number: this.idCardForm.number,
            idCardFaceImageUrl: this.idCardForm.idCardFaceImageUrl,
            idCardNationalEmblemImageUrl:
              this.idCardForm.idCardNationalEmblemImageUrl,
            telephone: this.registerForm.telephone,
            captcha: this.registerForm.captcha,
            // telephone: '15586869898',
            // captcha: '000000',
            validFrom: this.idCardForm.validFrom,
            // validTo: this.idCardForm.validTo,
            address: this.idCardForm.address,
            issue: this.idCardForm.issue,
            brith: this.idCardForm.birth,
            ethnicity: this.idCardForm.ethnicity,
            sex: this.idCardForm.sex,
            orgName: this.idCardForm.orgName,
          };
          if (this.showValidTo) {
            data.validTo = this.idCardForm.validTo
          } else {
            data.validTo = '长期'
          }
          console.log(data);
          const obj = {
            moduleName: "http_login",
            method: "post",
            url_alias: "register",
            data: data,
            // Headers: { isToken: false },
          };
          http_request(obj)
            .then((res) => {
              this.loading = false;
              this.$confirm(
                "注册信息提交成功，请耐心等待。如有其他问题可联系客服咨询。",
                "信息",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              ).then((res) => {
                this.$router.push("/login");
              });
            })
            .catch(() => {
              this.loading = false;
              // if (this.captchaOnOff) {
              //   this.getCode();
              // }
            });
        }
      });
    },
    handleAuth() {
      this.$refs.idCardForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // register(this.registerForm)
          // let data1 = { ...this.registerForm, ...this.idCardForm };
          let data = {
            orgName: this.idCardForm.orgName,
            identificationInf: {
              identificationBeginTime: this.idCardForm.validFrom,
              identificationEndTime: '',
              name: this.idCardForm.name,
              identificationImage: this.idCardForm.idCardFaceImageUrl,
              identificationBackImage:
                this.idCardForm.idCardNationalEmblemImageUrl,
              identificationNumber: this.idCardForm.number,
            },
          };
          if (this.showValidTo) {
            data.identificationInf.identificationEndTime = this.idCardForm.validTo;
          } else {
            data.identificationInf.identificationEndTime = '长期';
          }
          let header = {
            Authorization: this.$store.state.user.onceToken,
          };
          const obj = {
            moduleName: "http_login",
            method: "put",
            url_alias: "updateTeamInfo",
            data: data,
            header: header,
            // Headers: { isToken: false },
          };
          http_request(obj)
            .then((res) => {
              this.loading = false;
              removeOnceToken();
              this.$store.commit("SET_ONCETOKEN", "");
              this.$alert(" 修改成功! </font>", "系统提示", {
                dangerouslyUseHTMLString: true,
              })
                .then(() => {
                  this.$router.push("/login");
                })
                .catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              // if (this.captchaOnOff) {
              //   this.getCode();
              // }
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

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.gif");
  background-size: 100% 100%;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #121212;
  font-weight: bold;
}

.protocol {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #8590a6;
  margin-bottom: 20px;
}

.protocol > span {
  color: #3c81ff;
  cursor: pointer;
}

.register-form {
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

.register-idcard {
  width: 500px;
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
  width: 48%;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
  }
}

.face-img {
  background: url("../assets/images/login/face.png") no-repeat center;
  background-size: contain;
}

.emblem-img {
  background: url("../assets/images/login/back.png") no-repeat center;
  background-size: contain;
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
    // width: 100%;
    margin-bottom: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>

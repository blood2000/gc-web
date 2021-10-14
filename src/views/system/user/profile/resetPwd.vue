<template>
  <el-form
    ref="form"
    :model="user"
    :rules="rules"
    label-width="80px"
    :loading="loading"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password
      />
    </el-form-item>
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
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
      loading: false,
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
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
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
          //   response => {
          //     this.msgSuccess("修改成功");
          //   }
          // );
          this.loading = true;
          // register(this.registerForm)
          let data = {
            oldPassword: this.user.oldPassword,
            newPassword: this.user.newPassword,
          };
          const obj = {
            moduleName: "http_login",
            method: "post",
            url_alias: "changePwd",
            data: data,
          };
          http_request(obj)
            .then((res) => {
              this.loading = false;
              console.log("修改密码-->", res);
              if (res.code === 200) {
                this.$alert(res.msg, "提示", {
                  confirmButtonText: "确定",
                  callback: () => {
                    this.$store.dispatch("LogOut").then(() => {
                      location.href = "/index";
                    });
                  },
                });
              }
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

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <!-- <svg-icon icon-class="user" /> -->
                用户名称
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ user.phoneNumber }}</div>
              </li>
              <!-- <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li> -->
              <!-- <li class="list-group-item">
                所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li> -->
              <li class="list-group-item">
                创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :xs="24">
        <el-card>
          <!-- <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div> -->
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane> -->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
            <el-tab-pane label="短信修改密码" name="changePwd">
              <changePwd :phoneNumber="user.phoneNumber" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import changePwd from "./changePwd";
import { getUserProfile } from "@/api/system/user";
import { http_request } from "@/api";
export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd, changePwd },
  data() {
    return {
      user: {
        phoneNumber: '',
      },
      roleGroup: {},
      postGroup: {},
      activeTab: "resetPwd"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.$store
        .dispatch("GetInfo").then((res) => {
          console.log('用户信息==>',res)
          this.user = res.user;
        })
      // getUserProfile().then(response => {
      //   this.user = response.data;
      //   this.roleGroup = response.roleGroup;
      //   this.postGroup = response.postGroup;
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    height: calc(100vh - 149px);
  }
  .box-card {
    height: calc(100vh - 180px);
  }
</style>

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
      <el-col :span="20" :xs="24">
        <!-- <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
            <el-tab-pane label="短信修改密码" name="changePwd">
              <changePwd :phoneNumber="user.phoneNumber" />
            </el-tab-pane>
          </el-tabs>
        </el-card> -->
        <div class="profile-card">
          <div class="as-tab">
            <div class="tab-title" :class="activeTab === 0 ? '' : 'un-choose'" @click="changeTab(0)">
              <div class="img-left" v-if="activeTab === 0">
                <img src="../../../../assets/images/tab-left.png" alt="">
              </div>
              <span>修改密码</span>
            </div>
            <div class="tab-title" :class="activeTab === 1 ? '' : 'un-choose'" @click="changeTab(1)">
              <div class="img-right" v-if="activeTab === 1">
                <img src="../../../../assets/images/tab-right.png" alt="">
              </div>
              <span>短信修改密码</span>
            </div>
          </div>
          <div class="as-tab-pannel">
            <resetPwd v-if="activeTab === 0" :user="user" />
            <changePwd v-if="activeTab === 1" :phoneNumber="user.phoneNumber" />
          </div>
        </div>
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
      activeTab: 0
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    },
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
    background: #f2f5f8;
  }
  .box-card {
    height: calc(100vh - 180px);
  }

  .profile-card {
    padding: 15px 20px 20px;
    // border-radius: 4px;
    // box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  }
  
  .as-tab {
    width: 270px;
    height: 34px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .tab-title {
    width: 135px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #262626;
    cursor: pointer;
  }

  .un-choose {
    color: #BABDCA;
    background: #E9EBEE;
  }

  .tab-title span {
    position: relative;
    z-index: 1;
  }

  .tab-title img {
    width: 168px;
    height: 36px;
  }

  .img-left {
    position: relative;
    left: -68px;
    top: -2px;
    height: 0;
    width: 0;
    z-index: 0;
  }

  .img-right {
    position: relative;
    left: -100px;
    top: -2px;
    height: 0;
    width: 0;
    z-index: 0;
  }

  .as-tab-pannel {
    padding: 30px 20px 10px;
    background: #fff;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
    border-radius: 0 8px 8px 8px;
  }
</style>

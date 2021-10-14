<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="3" :xs="24">
        <el-card class="box-card">
          
          <div class="profile-menu">
            <div :class="activeIndex === 0 ? 'active' : ''" class="profile-menu-item" @click="baseSet">基本设置</div>
            <div :class="activeIndex === 1 ? 'active' : ''" class="profile-menu-item" @click="changePwd">修改密码</div>
            <div :class="activeIndex === 2 ? 'active' : ''" class="profile-menu-item" @click="identity">身份认证</div>
            
          </div>
        </el-card>
      </el-col>
      <el-col :span="21" :xs="24">
        <el-card>
          <div class="profile-title" v-if='activeIndex === 0'>基本设置</div>
          <div class="profile-box" v-if='activeIndex === 0'>
            <userInfo :user="user" />
          </div>

          <div class="profile-title" v-if='activeIndex === 1'>修改密码</div>
          <div class="profile-box" v-if='activeIndex === 1'>
            <!-- <userInfo :user="user" /> -->
            <resetPwd :user="user" />
          </div>
          <!-- <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      activeIndex: 0,
    };
  },
  created() {
    // this.getUser();
  },
  methods: {
    baseSet() {
      this.activeIndex = 0;
    },
    changePwd() {
      this.activeIndex = 1;
    },
    identity() {
      this.activeIndex = 2;
    },
  }
};
</script>
<style lang="scss" scoped>
  .profile-menu {
    height: 400px;
    margin: -15px -20px 0;
  }
  .profile-menu-item {
    position: relative;
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
  .active::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    background: rgba(24, 144, 255, 1);
  }

  .active {
    background: rgba(230, 247, 255, 1);
  }

  .profile-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .profile-box {
    padding: 20px 0;
    font-size: 16px;
  }
</style>

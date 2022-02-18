<template>
  <div >
    <el-row :gutter="20">
      <el-col :span="3" :xs="24">
        <div class="box-card">
          <div
            v-for="(item, index) in cardMenu"
            :key="index"
            class="card-menu-item"
            :class="menuIndex === index ? 'menu-active' : ''"
            @click="changeMenu(index)"
          >
            {{ item }}
          </div>
        </div>
        <!-- <el-card class="box-card">
          
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                用户名称
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ user.phoneNumber }}</div>
              </li>
             
              <li class="list-group-item">
                创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card> -->
      </el-col>
      <el-col :span="21" :xs="24">
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
        <!-- 基本资料 -->
        <div class="profile-card" v-if="menuIndex === 0" v-loading="loading">
          <div class="as-tab">
            <div class="tab-title">
              <div class="img-left">
                <img src="../../../../assets/images/tab-left.png" alt="" />
              </div>
              <span>基本信息</span>
            </div>
          </div>
          <div class="as-tab-pannel">
            <div class="as-tab-pannel-card">
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

                <li class="list-group-item">
                  创建日期
                  <div class="pull-right">{{ user.createTime }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 车队资料 -->
        <div class="profile-card" v-if="menuIndex === 1">
          <div class="as-tab">
            <div class="tab-title">
              <div class="img-left">
                <img src="../../../../assets/images/tab-left.png" alt="" />
              </div>
              <span>车队资料</span>
            </div>
          </div>
          <div class="as-tab-pannel">
            <vehicleTeam :team="teamInfo"/>
          </div>
        </div>

        <!-- 修改密码 -->
        <div class="profile-card" v-if="menuIndex === 2">
          <div class="as-tab">
            <div
              class="tab-title"
              :class="activeTab === 0 ? '' : 'un-choose'"
              @click="changeTab(0)"
            >
              <div class="img-left" v-if="activeTab === 0">
                <img src="../../../../assets/images/tab-left.png" alt="" />
              </div>
              <span>修改密码</span>
            </div>
            <div
              class="tab-title"
              :class="activeTab === 1 ? '' : 'un-choose'"
              @click="changeTab(1)"
            >
              <div class="img-right" v-if="activeTab === 1">
                <img src="../../../../assets/images/tab-right.png" alt="" />
              </div>
              <span>短信修改密码</span>
            </div>
          </div>
          <div class="as-tab-pannel">
            <resetPwd v-if="activeTab === 0" :user="user" />
            <changePwd v-if="activeTab === 1" :phoneNumber="user.phoneNumber" />
          </div>
        </div>

        <!-- 身份信息 -->
        <div class="profile-card" v-if="menuIndex === 3">
          <div class="as-tab">
            <div class="tab-title">
              <div class="img-left">
                <img src="../../../../assets/images/tab-left.png" alt="" />
              </div>
              <span>身份信息</span>
            </div>
          </div>
          <div class="as-tab-pannel">
            <idCardInfo/>
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
import vehicleTeam from "./vehicleTeam";
import idCardInfo from "./idCardInfo";
import { getUserProfile } from "@/api/system/user";
import { http_request } from "@/api";
export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd, changePwd,vehicleTeam,idCardInfo },
  data() {
    return {
      user: {
        phoneNumber: "",
      },
      teamInfo: {},   //车队信息
      cardMenu: ["基本信息", "车队资料", "修改密码", "身份信息"],
      menuIndex: 0,
      roleGroup: {},
      postGroup: {},
      activeTab: 0,
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    changeMenu(index) {
      this.menuIndex = index;
    },
    changeTab(tab) {
      this.activeTab = tab;
    },
    getUser() {
      this.loading = true;
      this.$store.dispatch("GetInfo").then((res) => {
        this.loading = false;
        console.log("用户信息==>", res);
        this.user = res.user;
        this.teamInfo = {
          teamLeader: res.team.teamLeader,
          code: res.user.code,
          companyName: res.company.name
        }
      });
      // getUserProfile().then(response => {
      //   this.user = response.data;
      //   this.roleGroup = response.roleGroup;
      //   this.postGroup = response.postGroup;
      // });
    },
  },
};
</script>
<style lang="scss" scoped>

.box-card {
  height: calc(100vh - 180px);
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.card-menu-item {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 20px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.menu-active {
  position: relative;
  color: #1890ff;
  background: #e6f7ff;
}

.menu-active::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 100%;
  top: 0;
  right: 0;
  background: #1890ff;
}

.profile-card {
  // padding: 15px 20px 20px;
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
  color: #babdca;
  background: #e9ebee;
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
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0 8px 8px 8px;
  &-card {
    width: 320px;
    padding: 0 20px;
  }
}

.list-group-item {
	border-bottom: none;
	border-top: none;
	
}
</style>

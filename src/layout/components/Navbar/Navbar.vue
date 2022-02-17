<template>
  <div class="navbar">
    <div class="left-menu">
      <router-link to="/index" @click.native="handlelogo">
        <img src="@/assets/logo/logo.png" style="" />
      </router-link>
      <div class="company-name">
        <img src="../../../assets/images/home/team-icon.png" alt="" />
        <span>{{ company_name }}</span>
      </div>
    </div>
    <div></div>
    <div class="right-menu">
      <div>
        <div class="avatar-wrapper">
          <img
            v-real-img="avatar"
            src="@/assets/images/workbench/icon_noavator.png"
            class="avatar-wrapper__image"
          />
          <!-- <span v-if="roleName !== ''" class="avatar-wrapper__role">{{ roleName }}</span> -->
        </div>
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <div class="dropdown-userinfo">
              <span class="avatar-wrapper__user">{{ nickName || name }}</span>
              <span class="avatar-wrapper__phone">{{ phoneNumber }}</span>
            </div>
            <i class="el-icon-caret-bottom avatar-wrapper__icon" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user/profile" @click.native="handleProfile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="main-menu">
        <el-menu
          :default-active="activeMenu"
          :text-color="
            settings.sideTheme === 'theme-dark'
              ? variables.menuText
              : variables.topMenuText
          "
          :active-text-color="variables.topMenuActiveText"
          mode="horizontal"
          class="main-menu-horizontal"
        >
          <NavbarBar
            v-for="(route, index) in sidebarMenu"
            :key="route.path + index"
            :item="route"
            :base-path="route.path"
            :recordModuleName="recordModuleName"
            @setRecordModuleName="setRecordModuleName"
          />
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import variables from "@/assets/styles/variables.scss";
import NavbarBar from "./NavbarBar.vue";

export default {
  components: { NavbarBar },
  data() {
    return {
      sidebarMenu: [],
      recordModuleName: "",
    };
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters([
      "sidebar",
      "avatar",
      "device",
      "nickName",
      "phoneNumber",
      "name",
      "roleName",
      "isShipment",
      "company_name",
      "sidebarRouters",
      "sideSecondRouters",
    ]),

    variables() {
      return variables;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  mounted() {
    this.setNewMenu();
    console.log("sidebarMenu", this.sidebarMenu);
    this.initSideSecondRouters();
  },

  methods: {
    // logo
    handlelogo() {
      this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
      this.recordModuleName = "index";
      this.$store.commit("SET_SIDE_SECOND_ROUTERS", []);
    },
    // 跳转个人中心
    handleProfile() {
      console.log("跳转个人中心");
      this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
      this.recordModuleName = "profile";
      this.$store.commit("SET_SIDE_SECOND_ROUTERS", []);
    },
    //设置默认模块名
    setRecordModuleName(path) {
      console.log("ckc 设置默认模块名", path);
      this.recordModuleName = path;
    },
    // f5刷新页面侧边栏重新赋值
    initSideSecondRouters() {
      if (!window.location.pathname) return;
      let strTemp = window.location.pathname.split("/");
      // 路径上一级菜单值
      this.recordModuleName = strTemp[1];
      console.log("ckc f5刷新页面", this.recordModuleName);
      this.sidebarMenu.forEach((el) => {
        console.log("el.path", el.path, el);
        if (
          `/${this.recordModuleName}` === el.path &&
          el.children &&
          el.children.length > 1
        ) {
          // 有效二级菜单
          const result = [];
          el.children.forEach((item) => {
            if (!item.hidden) {
              result.push(item);
            }
          });
          console.log("ckc  el.children", result, result.length);
          this.$store.commit("SET_SIDE_SECOND_ROUTERS", result);
        }
      });
    },
    // toggleSideBar() {
    //   this.$store.dispatch("app/toggleSideBar");
    // },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.href = "/index";
        });
      });
    },
    goToStatistic() {
      if (this.isShipment) return;
      const routeData = this.$router.resolve({
        // path: '/statistic',
        path: "/statisticSecond",
        query: {
          isScale: true,
        },
      });
      window.open(routeData.href, "_blank");
    },
    // 重新构造菜单结构
    setNewMenu() {
      this.sidebarMenu = JSON.parse(JSON.stringify(this.sidebarRouters));
      this.sidebarMenu.forEach((firstMenu) => {
        if (firstMenu.children && firstMenu.children.length > 0) {
          const child = JSON.parse(JSON.stringify(firstMenu.children));
          firstMenu.children = [];
          this.eachMenu(firstMenu, child, firstMenu.path);
        }
      });
      console.log("this.sidebarMenu", this.sidebarMenu);
    },
    eachMenu(firstMenu, children, path) {
      children.forEach((el) => {
        // if (path && !el.path.includes("app")) {
        el.path = path + "/" + el.path;
        // }
        firstMenu.children.push(el);
        if (el.children && el.children.length > 0) {
          const child = JSON.parse(JSON.stringify(el.children));
          el.children = [];
          this.eachMenu(firstMenu, child, el.path);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  // 70: headerHeight
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  justify-content: space-between;
  &__logo {
    float: left;
    width: 134px;
    height: 36px;
    margin: 18px 10px 18px 24px;
    cursor: pointer;
  }

  .hamburger-container {
    // 70: headerHeight
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    padding-top: 7px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-menu {
    height: 100%;
    // padding: 15px 12px;
    display: flex;
    align-items: center;
    & > a {
      margin-right: 16px;
    }
    .company-name {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #3d4050;
      display: flex;
      align-items: center;
      & > img {
        padding-right: 6px;
      }
    }
  }

  .right-menu {
    // float: right;
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    height: 100%;
    // 70: headerHeight
    line-height: 70px;
    .main-menu {
      height: 60px;
      margin-right: 55px;
      .el-menu.el-menu--horizontal {
        border-bottom: none;
      }
      // min-width: 300px;
      // background: chartreuse;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .dropdown-userinfo {
        display: flex;
        flex-direction: column;
        margin-right: 19px;
        .avatar-wrapper__user {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #3d4050;
        }
        .avatar-wrapper__phone {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #3d4050;
        }
      }
    }

    .avatar-container {
      margin-right: 16px;
      cursor: default;
      background: transparent !important;
    }

    .avatar-wrapper {
      position: relative;
      height: 100%;
      float: left;
      line-height: 20px;
      display: flex;
      align-items: center;
      &__image {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        vertical-align: middle;
      }

      &__role {
        padding: 0 12px 0 10px;
        font-size: 14px;
        font-family: PingFang SC;
        color: #3d4050;
        vertical-align: middle;
        position: relative;
        &::after {
          content: "";
          width: 1px;
          height: 12px;
          position: absolute;
          top: 50%;
          margin-top: -6px;
          right: 0;
          background: #fff;
          font-size: 14px;
          opacity: 0.4;
        }
      }

      &__user {
        margin: 0 6px 0 2px;
        font-size: 14px;
        font-family: PingFang SC;
        color: #3d4050;
        font-weight: bold;
      }

      &__icon {
        position: relative;
        top: 3px;
      }
    }
  }
}
.main-menu-horizontal {
  display: flex;
}
</style>

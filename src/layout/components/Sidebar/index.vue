<template>
  <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <img src="../../../assets/logo/collapsed.png" @click="handleCollapsed" class="collapsed-image" :style="{transform:isCollapse?'rotate(-180deg)':'rotate(0deg)'}">
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : variables.menuLightText"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sideSecondRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
          :isCollapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      sidebarMenu: []
    };
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sideSecondRouters', 'sidebar',]),
    activeMenu() {
      // console.log('sideSecondRouters path',this.sideSecondRouters)
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      // console.log('path',path,path.split('/')[2])
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    // this.setNewMenu();
    // this.sidebarMenu =  this.sideSecondRouters
    // console.log(' this.sidebarMenu', this.sidebarMenu)
  },
  methods: {
    handleCollapsed(){
    this.$store.commit('app/TOGGLE_SIDEBAR')
    },
    // // 重新构造菜单结构
    // setNewMenu() {
    //   this.sidebarMenu = JSON.parse(JSON.stringify(this.sidebarRouters));
    //   this.sidebarMenu.forEach(firstMenu => {
    //     if (firstMenu.children && firstMenu.children.length > 0) {
    //       const child = JSON.parse(JSON.stringify(firstMenu.children));
    //       firstMenu.children = [];
    //       this.eachMenu(firstMenu, child);
    //     }
    //   });
    // },
    // eachMenu(firstMenu, children, path) {
    //   children.forEach(el => {
    //     if (path) {
    //       el.path = path + '/' + el.path;
    //     }
    //     firstMenu.children.push(el);
    //     if (el.children && el.children.length > 0) {
    //       const child = JSON.parse(JSON.stringify(el.children));
    //       el.children = [];
    //       this.eachMenu(firstMenu, child, el.path);
    //     }
    //   });
    // }
  }
};
</script>

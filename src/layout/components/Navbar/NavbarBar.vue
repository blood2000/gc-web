<template>
  <div v-if="!item.hidden">
    <!-- 这块没做 记得继续做 -->
    <template>
      <app-link v-if="item.meta" :to="pathRoute(item)">
        <el-menu-item @click="handleJump(item)" :index="pathRoute(item)">
          <item
            v-if="item.meta"
            :icon="item.meta && item.meta.icon"
            :title="item.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script>
import Item from "../Sidebar/Item.vue";
import AppLink from "../Sidebar/Link";
import FixiOSBug from "../Sidebar/FixiOSBug";
import { mapGetters } from "vuex";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["recordModuleName"]),
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    handleJump(item) {
      console.log('item',item)
      // 和记录不同就清空tagview
      if (this.recordModuleName && this.recordModuleName != item.path) {
        this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
      }
      this.$store.commit("app/SET_RECORDMODULENAME", item.path.split("/")[1]);
      let result = [];
      // 有效二级菜单
      if (!item.hidden) {
        if (item.children && item.children.length > 1) {
          item.children.forEach((element) => {
            if (!element.hidden) {
              result.push(element);
            }
          });
        }
      }
      console.log('result',result)
      this.$store.commit("SET_SIDE_SECOND_ROUTERS", result);
    },
    // 非一级默认算最后一个
    pathRoute(item) {
      const result = { result: "" };
      if (item.children && item.children.length > 0) {
        this.dealPath(item.children[0], result);
      } else {
        result.result = item.path;
      }
      return result.result;
    },
    dealPath(child, result) {
      if (child.children && child.children.length > 0) {
        this.dealPath(child.children[0], result);
      } else {
        result.result = child.path;
      }
    },
  },
};
</script>
<style scoped>
/* .el-menu.el-menu--horizontal */
</style>


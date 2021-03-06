<template>
  <div
    id="tags-view-container"
    ref="TagsViewContainer"
    class="tags-view-container"
  >
    <div class="tags-view-wrapper" ref="tagsViewWrapper">
      <!--         :style="activeStyle(tag)"
 -->
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : 'unactive'"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="{ 'min-width': setItemWidth }"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        <span class="label">{{ tag.title }}</span>
        <span
          v-if="!isAffix(tag)"
          class="tag-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </div>

    <el-dropdown
      ref="TagsDerpDown"
      v-show="overflowTagsList.length > 0"
      class="btn-arrow-container"
      trigger="click"
    >
      <div class="btn-arrow" />
      <el-dropdown-menu
        slot="dropdown"
        :append-to-body="false"
        class="tags-dropdown"
      >
        <router-link
          v-for="tag in overflowTagsList"
          :key="tag.path"
          :class="isActive(tag) ? 'tags-dropdown-item-active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          <el-dropdown-item class="btn-arrow-container-item">
            <span>{{ tag.title }}</span>
            <span
              v-if="!isAffix(tag)"
              class="tag-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)"
            />
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item
          v-show="overflowTagsList.length == 0"
          class="btn-arrow-container-none"
          disabled
          >暂无更多</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭当前
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import path from "path";
import { ThrottleFun } from "@/utils/index.js";
export default {
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      overflowTagsList: [],
      currIndex: null,
      setItemWidth: 0,
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    theme() {
      return this.$store.state.settings.theme;
    },
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
      this.$nextTick(() => {
        this.tagsOverflow();
      });
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    overflowTagsList() {
      // console.log('111')
      const parentClientWidth = this.$refs.tagsViewWrapper.clientWidth;
      let tt = parentClientWidth / 11 - 4;
      this.setItemWidth = tt + "px";
    },
  },
  mounted() {
    this.initTags();
    this.addTags();
    this.$nextTick(() => {
      this.tagsOverflow();
    });
    window.addEventListener("resize", this.resizeFun);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFun);
  },
  methods: {
    resizeFun() {
      const throttle = ThrottleFun(this.tagsOverflow, 300);
      this.$refs.TagsDerpDown.hide();
      throttle();
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) return {};
      return {
        "background-color": "rgba(242, 245, 248, 1)",
        "border-color": "rgba(242, 245, 248, 1)",
      };
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          console.log('route 111111',route)
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            // this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      console.log("refreshSelectedTag view", view);
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    closeSelectedTag(view) {
      console.log("closeSelectedTag view", view);
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
      this.$nextTick(() => {
        this.tagsOverflow();
        console.log("this.overflowTagsList", this.overflowTagsList);
        if (this.overflowTagsList.length === 0) {
          console.log("不会是我吧");
          this.$refs.TagsDerpDown.hide();
        }
      });
    },
    closeOthersTags() {
      console.log("closeSelectedTag view", view);

      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      console.log("closeAllTags view", view);
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          console.log("redirect");
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
          this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
          this.$store.commit("app/SET_RECORDMODULENAME", "index");
          this.$store.commit("SET_SIDE_SECOND_ROUTERS", []);
        } else {
          console.log("/");
          this.$router.push("/");
          this.$store.commit("tagsView/DEL_ALL_VISITED_VIEWS");
          this.$store.commit("app/SET_RECORDMODULENAME", "index");
          this.$store.commit("SET_SIDE_SECOND_ROUTERS", []);
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      // 70: headerHeight
      this.top = e.clientY - 70;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    tagsOverflow() {
      if (this.$refs.TagsViewContainer) {
        const $ContainerWidth = this.$refs.TagsViewContainer.offsetWidth;
        const tagList = this.$refs.tag;
        let tagswidth = 0;
        let index;
        let flag = true;
        for (let i = 0; i < tagList.length; i++) {
          tagswidth += tagList[i].$el.clientWidth;
          // 36: The width of a arrow
          if (flag && tagswidth > $ContainerWidth - 36) {
            flag = false;
            index = i;
            this.overflowTagsList = this.visitedViews.slice(index);
          }
        }
        if (tagswidth < $ContainerWidth - 36) {
          this.overflowTagsList = [];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 36px;
  width: 100%;
  background: transparent;
  position: relative;
  box-sizing: border-box;
  .tags-view-wrapper {
    width: calc(100% - 36px);
    height: 100%;
    overflow: hidden;
    position: relative;

    .tags-view-item {
      border-right: 1px solid #f2f2f2;
      margin-right: 4px;
      // min-width: 147px;
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 100%;
      line-height: 36px;
      // color: #262626;
      background: #fff;
      padding: 0 10px 0 14px;
      font-size: 14px;
      border-radius: 10px 10px 0px 0px;
      > .label {
        display: inline-block;
        vertical-align: middle;
        padding-right: 20px;
      }
      &:not(:first-child) {
        &::after {
          content: "";
          width: 1px;
          height: 14px;
          position: absolute;
          right: -1px;
          top: 50%;
          margin-top: -7px;
          background: rgba(159, 162, 181, 0.4);
        }
      }
      &::before {
        content: "";
        width: 1px;
        height: 14px;
        position: absolute;
        left: -1px;
        top: 50%;
        margin-top: -7px;
        background: rgba(159, 162, 181, 0.4);
      }
      &.active {
        > .label {
          color: #3d4050;
          font-weight: bold;
          padding-left: 14px;
          position: relative;
          &::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #4682fa;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -3px;
          }
        }
        &::before,
        &::after {
          opacity: 0;
        }
        & + span {
          &::before {
            opacity: 0;
          }
        }
      }
      &.unactive {
        background: #f7f8fa;
        > .label {
          color: #cccccc;
          padding-left: 14px;
          position: relative;

          &::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #cccccc;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -3px;
          }
        }
        &::before,
        &::after {
          opacity: 0;
        }
        & + span {
          &::before {
            opacity: 0;
          }
        }
      }
    }
  }
  .btn-arrow-container {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border-radius: 10px 10px 0 0;

    .btn-arrow-container-item {
      min-width: 160px;
    }
    .btn-arrow-container-none {
      text-align: center;
      min-width: 94px;
    }
  }
  .btn-arrow {
    height: 36px;
    width: 36px;
    color: #666;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background: url("~@/assets/images/navBar/tag_icon.png") 12px 17px no-repeat;
    background-size: 12px 16px;
    padding: 17px 12px 11px;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 1px 1px 6px 0 rgba(0, 0, 0, 0.1);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
@mixin tag-icon-close {
  width: 16px;
  height: 16px;
  vertical-align: -1px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
  position: absolute;
  top: 50%;
  margin-top: -8px;
  right: 8px;
  color: #9fa2b5;
  background: transparent url("~@/assets/images/navBar/close_icon.png")
    no-repeat center center;
  &:hover {
    background: rgba(180, 188, 204, 0.3)
      url("~@/assets/images/navBar/close_icon.png") no-repeat center center;
  }
}
//tag-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .tag-icon-close {
      @include tag-icon-close;
    }
  }
}
.tags-dropdown {
  .el-dropdown-menu__item {
    position: relative;
    height: 36px;
    line-height: 36px;
    color: #606266;
    &:hover {
      background-color: #fafafa;
      color: #606266;
    }
    &.is-disabled {
      color: #bbb;
    }
  }
  .tags-dropdown-item-active {
    .el-dropdown-menu__item {
      color: rgba(64, 158, 255, 1);
      background: #fafafa;
    }
  }
  .tag-icon-close {
    @include tag-icon-close;
  }
  .gray {
    color: gray;
  }
}
</style>

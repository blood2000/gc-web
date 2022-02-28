<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <!-- tab -->
      <StoreTab
        @handleTab="handleTab"
        :initValue="initTabValue"
        :tabData="tabList"
      />
      <!-- page -->
      <div class="store-page">
        <component v-bind:is="currentTabComponent" :code="code"></component>
      </div>
    </div>
  </div>
</template>
<script>
import { http_request } from "../../../api";
import StoreTab from "./component/storeTab.vue";
import HotRecommend from "./hotRecommend.vue";
import StoreAll from "./storeAll.vue";
import StoreOther from "./storeOther.vue";
export default {
  components: { StoreTab, HotRecommend, StoreAll, StoreOther },
  data() {
    return {
      tabObj: null,
      code:null,
      initTabValue: 0,
      tabList: [
        {
          title: "热门推荐",
          value: 0,
        },
        {
          title: "全部",
          value: 1,
        },
      ],
      currentTabComponent: null,
      currValue:0
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.tabObj = this.tabList[this.initTabValue];
      this.code = this.tabList[this.initTabValue].value
      const obj = {
        moduleName: "http_app",
        method: "get",
        url_alias: "list",
      };
      const res = await http_request(obj);
      if (res.data.length === 0) return;
      for (const item of res.data) {
        const tmp = {
          title: item.categoryName,
          value: item.code,
        };
        this.tabList.push(tmp);
      }
      this.setCom();
    },
    setCom() {
      this.code = this.tabObj.value
      switch (this.tabObj.value) {
        case 0:
          this.currentTabComponent = "hotRecommend";
          break;
        case 1:
          this.currentTabComponent = "storeAll";
          break;
        default:
          this.currentTabComponent = "storeOther";

          break;
      }
    },
    handleTab(obj) {
      this.tabObj = obj;
      this.setCom();
    },
  },
};
</script>

<style lang="scss" scoped>
.pages-info-right {
  padding: 26px 40px 19px 28px;
  position: relative;
}
.store-page {
  width: 100%;
  overflow: auto;
  height: calc(100% - 54px);
  padding: 0;
}
</style>


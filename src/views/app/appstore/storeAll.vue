<template>
  <div>
    <!-- search -->
    <StoreSearch v-model="queryParams" @getList="getList" />
    <div class="store-list">
      <div v-for="item in list" :key="item.categoryCode">
        <div class="title">
          {{ `${item.categoryName}(${item.appCount})` }}
        </div>
        <StoreList :appList="item.appList" />
      </div>
    </div>
  </div>
</template>
<script>
import { http_request } from "../../../api";
import StoreList from "../components/storeList.vue";
import StoreSearch from "./component/stroeSearch.vue";
export default {
  components: { StoreList, StoreSearch },
  data() {
    return {
      queryParams: {
        appName: null,
        recommendFlag: null,
        chargeType: null,
      },

      list: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getList();
    },
    async getList() {
      console.log("param", this.queryParams);
      const obj = {
        moduleName: "http_app",
        method: "post",
        url_alias: "listAppGroupByCategory",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.list = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-family: PingFang BOLD;
  color: #3d4050;
  margin-bottom: 24px;
}
</style>
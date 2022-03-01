<template>
  <div>
    <div class="hot-banner">
      <img src="../../../assets/images/app/banner.png" alt="" />
      <img src="../../../assets/images/app/banner2.png" alt="" />
    </div>
    <div class="hot-content">
      <div class="hot-list">
        <StoreList :appList="list" />
      </div>
      <div class="hot-Ranking">
        <div class="hot-Ranking-title">热门排行</div>
        <div class="hot-list">
          <div
            class="hot-list-item"
            v-for="(item, index) in hotList"
            :key="index"
            @click="hotRank(item)"
          >
            <div style="display: flex">
              <div
                class="hot-top-3"
                v-if="index < 3"
                :class="`hot-top-3-${index + 1}`"
              >
                {{ index + 1 }}
              </div>

              <div class="hot-top-other" v-else>{{ index + 1 }}</div>
              <div class="hot-name">{{ item.appName }}</div>
            </div>
            <div class="hot-label">已被开通{{ item.usingCount }}次</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { http_request } from "../../../api";
import StoreList from "../components/storeList.vue";

export default {
  components: { StoreList },
  data() {
    return {
      hotList: [],
      list: [],
    };
  },
  mounted() {
    this.getHotList();
    this.getList();
  },
  methods: {
    hotRank(item){
      console.log('item',item)
        this.$router.push('detail?code='+item.appCode)
    },
    async getList() {
      this.list = [];
      const queryParams = {
        appName: null,
        categoryCode: null,
        recommendFlag: 1,
        chargeType: null,
        pageNum: 1,
        pageSize: 1000,
      };
      const obj = {
        moduleName: "http_app",
        method: "post",
        url_alias: "paging",
        data: queryParams,
      };
      const res = await http_request(obj);
      this.list = res.data.rows;
      console.log("推荐", res, this.list);
    },
    async getHotList() {
      this.hotList = [];
      const limit = 10;
      const obj = {
        moduleName: "http_app",
        method: "get",
        url_alias: "topRanking",
        data: { limit },
      };
      const res = await http_request(obj);
      console.log("rank", res);
      this.hotList = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.hot-banner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 17px;
  & > img {
    width: 48.637%;
    height: 196px;
  }
}
.hot-content {
  display: flex;
  .hot-list {
    flex: 1;
    padding-top: 8px;
  }
  .hot-list-item:last-child {
    border: none;
  }
  .hot-Ranking {
    width: 376px;
    min-height: 497px;
    background: linear-gradient(180deg, #fffbf6 0%, #ffffff 100%);
    border-radius: 6px;
    padding: 14px 16px;
    &-title {
      font-size: 16px;
      font-family: PingFang BOLD;
      color: #1b1b1b;
      margin-bottom: 16px;
    }
  }
}

.hot-list-item {
  border-bottom: 1px solid #efefef;
  height: 33px;
  width: 334px;
  margin-bottom: 18px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #3d4050;
  display: flex;
  justify-content: space-between;
  .hot-top-3 {
    width: 19px;
    height: 19px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 12px;
    font-family: PingFang BOLD;
    color: #ffffff;
    margin-right: 6px;
    padding-top: 4px;
    text-align: center;
  }
  .hot-top-3-1 {
    background-image: url("../../../assets/images/app/hot_1.png");
  }
  .hot-top-3-2 {
    background-image: url("../../../assets/images/app/hot_2.png");
  }
  .hot-top-3-3 {
    background-image: url("../../../assets/images/app/hot_3.png");
  }
  .hot-top-other {
    width: 18px;
    height: 18px;
    background: #efefef;
    border-radius: 3px;
    text-align: center;
    font-size: 12px;
    font-family: PingFang BOLD;
    color: #3d4050;
    margin-right: 6px;
  }
  .hot-name {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #3d4050;
  }
  .hot-label {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #959aa4;
  }
}
</style>
<!-- 调度单列表 -->
<template>
  <div class="dispatch-list-container" v-loading="loading">
    <div class="list-main">
      <div
        class="list-box"
        :class="item.isChoosed ? 'choosed' : ''"
        v-for="(item, index) in dispatchList"
        :key="index"
        @click="chooseItem(index)"
      >
        <div class="first-line">
          <div>{{ item.goodsBigTypeName }}</div>
          <div>
            {{ parseFloat(item.freightStr) }}
            <span>{{ "元/" + item.freightStr.split("/")[1] }}</span>
          </div>
        </div>
        <div class="second-line">{{ item.companyName }}</div>
        <div class="addr-box">
          <div class="addr-icon start">起</div>
          <div class="addr start-addr">{{ item.loadFormattedAddress }}</div>
        </div>
        <div class="addr-box">
          <div class="addr-icon end">终</div>
          <div class="addr end-addr">{{ item.unloadFormattedAddress }}</div>
        </div>
        <div class="btn-box">
          <div class="btn dispatch" @click.stop="toDispatchVehicle(item)">
            派车
          </div>
          <div class="btn detail" @click.stop="toDispatchDetail(item)">
            详情
          </div>
        </div>
      </div>
    </div>
    <pagination
      :total="total"
      hide-on-single-page
      layout="prev, pager, next"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { http_request } from "../../../api";
import config from "./config";
export default {
  data() {
    return {
      dispatchList: [],
      showDispatchVehicle: false,
      vehicleInfo: {},
      total: 0,
      loading: false,
      queryParams: {
        pageNum: 1, //页码
        pageSize: 10, //每页显示条数
        shipmentNameOrCompanyName: null, //下单用户
        loadFormattedAddress: null, //装货地址
        unloadFormattedAddress: null, //卸货地址
        dispatchOrderNo: null, //调度单号
        goodsType: null, //货品类型
        source: null, //来源
        startDate: "", //创建开始时间 yyyy-MM-dd
        endDate: "", //创建结束时间 yyyy-MM-dd
        remark: null, //备注
        dispatchOrderStatus: [1, 2], //状态为非关闭的调度单
      },
    };
  },

  components: {},

  created() {},

  mounted() {
    this.searchQuery();
    this.vehicleInfo = config.vehicleInfo;
  },

  methods: {
    toDispatchVehicle(item) {
      this.showDispatchVehicle = true;
      this.$store.commit("set_dispatchVehicle", true);
      this.$store.commit("set_dispatchInfo", item);
    },
    //跳转调度单详情
    toDispatchDetail(item) {
      const code = item.dispatchOrderCode;
      this.$router.push("../../dispatch/order/detail?code=" + code);
    },

    //选择调度单
    chooseItem(index) {
      // this.$store.commit("set_showVehicleDetail", true);
      this.vehicleInfo.vehicleCode = this.dispatchList[index].vehicleCode;
      this.$store.commit("set_vehicleInfo", this.vehicleInfo);
      this.$emit("getVehicleInfo", this.vehicleInfo);
      this.dispatchList.map((dItem, dIndex) => {
        if (dIndex === index) {
          dItem.isChoosed = true;
        } else {
          dItem.isChoosed = false;
        }
      });
    },
    // 获取调度单列表
    async getList() {
      this.loading = true;
      const tmp = { ...this.queryParams };
      console.log("tmp", tmp);
      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "paging_dispatch",
        data: tmp,
      };
      const res = await http_request(obj);
      console.log("geatlist ===>", res);
      this.total = res.data.total;
      let dispatchList = res.data.rows;
      dispatchList.map((item) => {
        item.isChoosed = false;
      });
      this.dispatchList = dispatchList;
      this.loading = false;
      console.log(this.dispatchList);
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
  },
};
</script>
<style lang='scss' scoped>
.dispatch-list-container {
  box-sizing: border-box;

  // background: rgba(0, 0, 0, 0.2);
}
.list-main {
  height: 100%;
  overflow-y: auto;
}
.map-container .show-detail {
  width: 780px;
}

.pagination-container {
  position: fixed;
  // width: 100%;
  margin: 0;
  bottom: 15px;
  right: 9px;
  background: rgba(0, 0, 0, 0);
}
.detail-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ddd;
  top: 0;
  right: 400px;
}
.list-box {
  // height: 884px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #3d4050;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.25);
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.25s linear;
  .first-line {
    height: 28px;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background: linear-gradient(
      90deg,
      rgba(70, 130, 250, 0.16) 0%,
      rgba(70, 130, 250, 0) 100%
    );
    font-size: 16px;
    font-weight: bold;
    color: #3d4050;
    span {
      font-size: 12px;
    }
  }
  .second-line {
    height: 20px;
    padding-left: 5px;
    margin-bottom: 10px;
    line-height: 20px;
    color: #a1a1a1;
  }
  .addr-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .addr-icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      border-radius: 3px;
      text-align: center;
      line-height: 18px;
      color: #fff;
      font-size: 12px;
    }
    .addr {
      position: relative;
      flex: 1;
    }

    .start-addr::before {
      content: "";
      position: absolute;
      top: calc(50% + 11px);
      left: -20px;
      width: 0px;
      height: calc(50% - 5px);
      border: 1px solid #c7cbd2;
    }
    .end-addr::before {
      content: "";
      position: absolute;
      bottom: calc(50% + 11px);
      left: -20px;
      width: 0px;
      height: calc(50% - 5px);
      border: 1px solid #c7cbd2;
    }
    .start {
      position: relative;
      background: #ffbc00;
    }
    // .start::after {
    //   content: "";
    //   position: absolute;
    //   top: 19px;
    //   left: 8px;
    //   width: 0px;
    //   height: 8px;
    //   border: 1px solid #c7cbd2;
    // }
    .end {
      background: #4682fa;
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 80px;
      height: 32px;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
    .dispatch {
      background: #4682fa;
      color: #fff;
      margin-right: 20px;
    }
    .detail {
      background: #fff;
      color: #4682fa;
      border: 1px solid #4682fa;
      line-height: 30px;
    }
  }
}

.choosed {
  background: #ffffff;
  border: 1px solid #4682fa;
  box-shadow: 0px 3px 8px rgba(70, 130, 250, 0.51);
}

::-webkit-scrollbar {
  width: 0;
  height: 20px;
  background-color: #0e1013;
}
::-webkit-scrollbar-thumb {
  background: #333;
}
</style>
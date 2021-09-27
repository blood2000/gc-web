<!-- 调度单列表 -->
<template>
  <div class="dispatch-list-container">
    <div
      class="list-box"
      :class="item.isChoosed ? 'choosed' : ''"
      v-for="(item, index) in dispatchList"
      :key="index"
      @click="chooseItem(index)"
    >
      <div class="first-line">
        <div>{{ item.dispatchType }}</div>
        <div>
          {{ item.price }} <span>{{ "元/" + item.unit }}</span>
        </div>
      </div>
      <div class="second-line">{{ item.company }}</div>
      <div class="addr-box">
        <div class="addr-icon start">起</div>
        <div>{{ item.start }}</div>
      </div>
      <div class="addr-box">
        <div class="addr-icon end">终</div>
        <div>{{ item.end }}</div>
      </div>
      <div class="btn-box">
        <div class="btn dispatch" @click.stop="toDispatchVehicle">派车</div>
        <div class="btn detail" @click.stop="toDispatchDetail">详情</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config";
export default {
  data() {
    return {
      dispatchList: [],
      showDispatchVehicle: false,
      vehicleInfo: {},
    };
  },

  components: {},

  created() {},

  mounted() {
    let dispatchList = config.dispatchList;
    dispatchList.map((item) => {
      item.isChoosed = false;
    });
    this.dispatchList = dispatchList;
    this.vehicleInfo = config.vehicleInfo;
  },

  methods: {
    toDispatchVehicle() {
      this.showDispatchVehicle = true;
      this.$store.commit("set_dispatchVehicle", true);
    },
    //跳转调度单详情
    toDispatchDetail() {},

    //选择调度单
    chooseItem(index) {
      this.$store.commit("set_showVehicleDetail", true);
      this.vehicleInfo.vehicleCode = this.dispatchList[index].vehicleCode;
      this.$store.commit("set_vehicleInfo", this.vehicleInfo);
      this.$emit('getVehicleInfo', this.vehicleInfo);
      this.dispatchList.map((dItem, dIndex) => {
        if (dIndex === index) {
          dItem.isChoosed = true;
        } else {
          dItem.isChoosed = false;
        }
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.dispatch-list-container {
  height: 100%;
  overflow-y: auto;
  // background: rgba(0, 0, 0, 0.2);
}
.map-container .show-detail {
  width: 780px;
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
  height: 184px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #3d4050;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all .25s linear;
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
    .start {
      position: relative;
      background: #ffbc00;
    }
    .start::after {
      content: "";
      position: absolute;
      top: 19px;
      left: 8px;
      width: 0px;
      height: 8px;
      border: 1px solid #c7cbd2;
    }
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
	background-color: #0E1013;
}
::-webkit-scrollbar-thumb {
	background: #333;
}
</style>
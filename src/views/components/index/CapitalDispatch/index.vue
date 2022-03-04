<template>
  <div class="capital-dispatch">
    <div class="home-title">资产</div>
    <div class="home-box">
      <div class="home-item" @click="toVehicle">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-icon"></div>
            <div class="home-item-name">车辆</div>
          </div>
          <div class="home-item-value">
            <div>{{vehicle}}</div>
            <span>辆</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-bg"></div>
      </div>
      <div class="home-item" @click="toDriver">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon driver-icon"></div>
            <div class="home-item-name">司机</div>
          </div>
          <div class="home-item-value">
            <div>{{driver}}</div>
            <span>位</span>
          </div>
        </div>
        <div class="home-item-bg driver-bg"></div>
      </div>
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon device-icon"></div>
            <div class="home-item-name">设备</div>
          </div>
          <div class="home-item-value">
            <div>{{device}}</div>
            <span>台</span>
          </div>
        </div>
        <div class="home-item-bg device-bg"></div>
      </div>
    </div>
    <div class="home-title">调度</div>
    <div class="home-box">
      <div class="home-item" @click="toDispatch">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon dispatch-icon"></div>
            <div class="home-item-name">调度单</div>
          </div>
          <div class="home-item-value">
            <div>{{dispatchOrder}}</div>
            <span>单</span>
          </div>
        </div>
        <div class="home-item-bg dispatch-bg"></div>
      </div>
      <div class="home-item" @click="toVehicleRecord">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-report-icon"></div>
            <div class="home-item-name">派车记录</div>
          </div>
          <div class="home-item-value">
            <div>{{carRecord}}</div>
            <span>条</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-report-bg"></div>
      </div>
      <div class="home-item" @click="toVehicleManage">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-list-icon"></div>
            <div class="home-item-name">派车单</div>
          </div>
          <div class="home-item-value">
            <div>{{carOrderCount}}</div>
            <span>单</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-list-bg"></div>
      </div>
    </div>
    <!-- 调试使用，不用上传 -->
    <!-- <div class="home-title">调式</div>
    <div class="home-box">
      <div class="home-test" @click="forTest(0)">驾驶员异常报警(driver)</div>
      <div class="home-test" @click="forTest(1)">前向碰撞报警(driver)</div>
      <div class="home-test" @click="forTest(2)">频繁变道报警(vehicle)</div>
      <div class="home-test" @click="forTest(3)">驾驶辅助功能失效报警(device)</div>
      <div class="home-test" @click="forTest(4)">障碍物报警(device)</div>
      <div class="home-test" @click="forTest(5)">双手同时脱离方向盘报警(driver)</div>
      <div class="home-test" @click="forTest(6)">分神驾驶报警(driver)</div>
    </div> -->
  </div>
</template>

<script>
import { http_request } from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "Capital",
  components: {
    // ScheduleDialog,
  },
  data() {
    return {
      vehicle: '',
      driver: '',
      device: '',
      dispatchOrder: '',
      carRecord: '',
      carOrderCount: ''
    };
  },

  computed: {},
  created() {},
  mounted() {
    this.getVehicle();
    this.getDriver();
    this.getDevice();
    this.getDispatchOrder();
    this.getCarRecord();
    this.getCarOrderCount();
  },

  methods: {
    //调试用
    forTest(index) {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "",
      };
      let url = 'forTest';
      if (index === 0) {
        url = url;
      } else {
        url += index;
      }
      obj.url_alias = url;
      console.log(obj)
      http_request(obj).then((res) => {
        console.log("调试切换--->", res);
        
      });
    },
    getVehicle() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "vehicle",
      };
      http_request(obj).then((res) => {
        console.log("车辆统计--->", res);
        this.vehicle = res.data;
      });
    },
    getDriver() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "driver",
      };
      http_request(obj).then((res) => {
        console.log("司机统计--->", res);
        this.driver = res.data;
      });
    },
    getDevice() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "device",
      };
      http_request(obj).then((res) => {
        console.log("设备统计--->", res);
        this.device = res.data;
      });
    },
    getDispatchOrder() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "dispatchOrder",
      };
      http_request(obj).then((res) => {
        console.log("调度单统计--->", res);
        this.dispatchOrder = res.data;
      });
    },
    getCarRecord() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "carRecord",
      };
      http_request(obj).then((res) => {
        console.log("派车记录统计--->", res);
        this.carRecord = res.data;
      });
    },
    getCarOrderCount() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "carOrderCount",
      };
      http_request(obj).then((res) => {
        console.log("派车单统计--->", res);
        this.carOrderCount = res.data;
      });
    },

    toVehicle() {
      this.$router.push('../../../archives/vehicle');
    },
    toDriver() {
      this.$router.push('../../../archives/driver');
    },

    toDispatch() {
      this.$router.push('../../../transport/order');
    },

    toVehicleRecord() {
      this.$router.push('../../../transport/recode');
    },
    toVehicleManage() {
      this.$router.push('../../../transport/manage');
    },
  },
};
</script>

<style lang="scss" scoped>
.home-title {
  color: #3d4050;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
}
.home-box {
  height: 92px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.home-test {
  width: 200px;
  padding: 10px;
  background: #ddd;
  margin-right: 20px;
  cursor: pointer;
}

.home-item {
  box-sizing: border-box;
  width: 232px;
  height: 92px;
  padding: 10px 8px;
  background: #f7f9fb;
  opacity: 1;
  border-radius: 3px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  cursor: pointer;
}

.home-item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.home-item-icon {
  width: 17px;
  height: 17px;
  margin-right: 6px;
}

.vehicle-icon {
  background: url("../../../../assets/images/home/vehicle.png");
  background-size: 100% 100%;
}

.driver-icon {
  background: url("../../../../assets/images/home/driver.png");
  background-size: 100% 100%;
}

.device-icon {
  background: url("../../../../assets/images/home/device.png");
  background-size: 100% 100%;
}

.dispatch-icon {
  background: url("../../../../assets/images/home/dispatch.png");
  background-size: 100% 100%;
}

.vehicle-report-icon {
  background: url("../../../../assets/images/home/vehicle_report.png");
  background-size: 100% 100%;
}

.vehicle-list-icon {
  background: url("../../../../assets/images/home/vehicle_list.png");
  background-size: 100% 100%;
}

.home-item-name {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}

.home-item-value {
  display: flex;
  align-items: center;
}

.home-item-value > div {
  font-size: 26px;
  font-family: Bahnschrift;
  font-weight: 600;
  color: #3d4050;
  margin-right: 6px;
}

.home-item-value > span {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}

.home-item-bg {
  width: 74px;
  height: 74px;
  background-size: 100% 100%;
}

.vehicle-bg {
  background: url("../../../../assets/images/home/vehicle_bg.png");
}

.driver-bg {
  background: url("../../../../assets/images/home/driver_bg.png");
}

.device-bg {
  background: url("../../../../assets/images/home/device_bg.png");
}
.dispatch-bg {
  background: url("../../../../assets/images/home/dispatch_bg.png");
}

.vehicle-report-bg {
  background: url("../../../../assets/images/home/vehicle_report_bg.png");
}

.vehicle-list-bg {
  background: url("../../../../assets/images/home/vehicle_list_bg.png");
}
</style>


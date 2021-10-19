<template>
  <div class="capital-dispatch">
    <div class="home-title">资产</div>
    <div class="home-box">
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-icon"></div>
            <div class="home-item-name">车辆</div>
          </div>
          <div class="home-item-value">
            <div>20</div>
            <span>辆</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-bg"></div>
      </div>
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon driver-icon"></div>
            <div class="home-item-name">司机</div>
          </div>
          <div class="home-item-value">
            <div>105</div>
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
            <div>15</div>
            <span>台</span>
          </div>
        </div>
        <div class="home-item-bg device-bg"></div>
      </div>
    </div>
    <div class="home-title">调度</div>
    <div class="home-box">
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon dispatch-icon"></div>
            <div class="home-item-name">调度单</div>
          </div>
          <div class="home-item-value">
            <div>200</div>
            <span>单</span>
          </div>
        </div>
        <div class="home-item-bg dispatch-bg"></div>
      </div>
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-report-icon"></div>
            <div class="home-item-name">派车记录</div>
          </div>
          <div class="home-item-value">
            <div>105</div>
            <span>条</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-report-bg"></div>
      </div>
      <div class="home-item">
        <div class="home-item-info">
          <div class="home-item-title">
            <div class="home-item-icon vehicle-list-icon"></div>
            <div class="home-item-name">派车单</div>
          </div>
          <div class="home-item-value">
            <div>215</div>
            <span>单</span>
          </div>
        </div>
        <div class="home-item-bg vehicle-list-bg"></div>
      </div>
    </div>
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
    return {};
  },

  computed: {},
  created() {},
  methods: {},
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

.dirver-icon {
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


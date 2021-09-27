<!-- 车辆详情 -->
<template>
  <div class="vehicle-detail-container">
    <!-- 车辆信息 -->
    <div class="card-box">
      <div class="first-line">
        <div class="first-title">{{vehicleInfo.vehicleCode}}</div>
        <div class="first-status">{{vehicleState}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config";
export default {
  name: "vehicleDetail",
  data() {
    return {
      vehicleState: '',
    };
  },
  // props: {
  //   vehicleInfo: {
  //     type: Object,
  //     default() {
  //       return {};
  //     },
  //   },
  // },

  components: {},

  computed: {
    vehicleInfo() {
      console.log(123, this.$sotre.getters.vehicleInfo.vehicleCode)
      return this.$store.getters.vehicleInfo;
    },
  },

  mounted() {
    let travelStatus = config.travelStatus;
    travelStatus.map(item => {
      if (this.vehicleInfo.status === item.id) {
        console.log(item.id)
        this.vehicleState = item.status;
      }
    })
    console.log(this.vehicleInfo);
  },

  methods: {},
};
</script>
<style lang='scss' scoped>
.vehicle-detail-container {
  overflow-y: auto;
}
.card-box {
  padding: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #3d4050;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.first-line {
  display: flex;
  justify-content: space-between;
  height: 28px;
  font-size: 16px;
  font-weight: bold;
  color: #3d4050;
}

.first-title {
  width: 284px;
  line-height: 28px;
  padding: 0 5px;
  background: linear-gradient(
    90deg,
    rgba(70, 130, 250, 0.16) 0%,
    rgba(70, 130, 250, 0) 100%
  );
}
.first-status {
  line-height: 28px;
  font-size: 14px;
}
</style>
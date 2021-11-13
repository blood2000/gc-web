<!-- 告警卡片组件 -->
<template>
  <div class="warn-card" @click="openList(0)">
    <div class="warn-card-more">
      <div class="warn-card-more-box">
        <div class="point"></div>
        <div class="point"></div>
        <div class="point"></div>
      </div>
      <!-- <el-dropdown>
        <div class="warn-card-more-box">
          <div class="point"></div>
          <div class="point"></div>
          <div class="point"></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>

    <div class="warn-card-title" v-if="tabIndex === '1'">
      {{ cardInfo.licenseNumber }}
    </div>
    <div class="warn-card-title" v-else>{{ cardInfo.nickName }}</div>
    <div class="warn-card-subtitle">
      <div class="warn-card-subtitle-text">最新告警</div>
      <div class="warn-card-subtitle-img">
        <img src="../../../../assets/images/monitor-line.png" alt="" />
      </div>
    </div>
    <div
      
      class="warn-card-main"
      :class="'warn-level-' + (cardInfo.alarmLevel)"
    >
      <div class="card-main-left" v-if="cardInfo.vendorAlarmTypeName">
        <img src="../../../../assets/images/detail/fms-yczd.png" alt="" />
        <div class="warn-card-type">{{ cardInfo.vendorAlarmTypeName || "无" }}</div>
      </div>
      <div class="card-main-right" v-if="cardInfo.vendorAlarmTypeName">
        <div>{{ cardInfo.alarmAddress || "-" }}</div>
        <div>{{ cardInfo.alarmTime || "-" }}</div>
      </div>
      <div class="card-main-none" v-if="!cardInfo.vendorAlarmTypeName">
        <img src="../../../../assets/images/detail/warn_none.png" alt="">
        <div>暂无数据</div>
      </div>
    </div>
    <div class="warn-card-bottom">
      <div
        class="warn-card-bottom-item"
        v-for="(wItem, wIndex) in cardInfo.vehicleAlarmStatistics"
        :key="wIndex"
        @click.stop="openList(wItem.alarmObject)"
      >
        <div class="warn-card-bottom-item-value">{{ wItem.number || 0 }}</div>
        <div class="warn-card-bottom-item-name me-text-beyond">
          {{ wItem.describe }}
        </div>
      </div>

      <!-- <div class="warn-card-bottom-item" @click.stop="openList(1)">
        <div class="warn-card-bottom-item-value">54</div>
        <div class="warn-card-bottom-item-name">行车事件</div>
      </div>
      <div class="warn-card-bottom-item" @click.stop="openList(2)">
        <div class="warn-card-bottom-item-value">320</div>
        <div class="warn-card-bottom-item-name">设备异常</div>
      </div>
      <div class="warn-card-bottom-item" @click.stop="openList(3)">
        <div class="warn-card-bottom-item-value">54</div>
        <div class="warn-card-bottom-item-name">辅助驾驶</div>
      </div>
      <div class="warn-card-bottom-item" @click.stop="openList(4)">
        <div class="warn-card-bottom-item-value">54</div>
        <div class="warn-card-bottom-item-name">司机行为</div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},
  props: {
    level: {
      type: Number,
      default: 1,
    },
    cardInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    tabIndex: {
      type: String,
      default: "1",
    },
  },

  computed: {},

  mounted() {
    // console.log("warnCard", this.cardInfo);
  },

  methods: {
    openList(type) {
      this.$emit("openList", { type: type, item: this.cardInfo });
    },
  },
};
</script>
<style lang='scss' scoped>
.warn-card {
  position: relative;
  width: 23%;
  height: 192px;
  background: #fefefe;
  border-radius: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
  margin: 0 1% 20px 1%;
  cursor: pointer;
  &-more {
    position: absolute;
    top: 0;
    right: 20px;
    cursor: pointer;
    &-box {
      height: 20px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
  .point {
    width: 4px;
    height: 4px;
    margin-left: 4px;
    background: #3d4050;
    border-radius: 50%;
    opacity: 1;
  }
  &-title {
    padding: 10px 15px 0;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3d4050;
  }
  &-subtitle {
    padding: 0 15px;
    margin-bottom: 3px;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #adb5bd;
    &-text {
      min-width: 50px;
      margin-right: 2px;
    }
    &-img {
      flex: 1;
      > img {
        max-width: 100%;
        height: 9px;
      }
    }
  }
  &-main {
    position: relative;
    width: calc(100% - 30px);
    margin: 0 auto;
    padding: 0 10px;
    height: 60px;
    font-size: 12px;
    color: #3d4050;
    border-radius: 2px;
    display: flex;
    align-items: center;
    div {
      z-index: 2;
    }
  }
  &-bottom {
    padding-right: 7px;
    margin-top: 8px;
    height: 57px;
    display: flex;
    &-item {
      // flex: 1;
      box-sizing: border-box;
      width: 33%;
      height: 56px;
      padding: 5px 20px;
      text-align: left;
      border-top: 1px solid #f3f4f5;
      border-right: 1px solid #f3f4f5;
      color: #3d4050;
      font-size: 12px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      &-value {
        font-weight: bold;
        font-size: 16px;
      }
      &-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .warn-card-bottom-item:last-child {
      border-right: none;
    }
  }
}

.warn-card:nth-child(4n - 3) {
  margin-left: 2%;
}

.warn-card:nth-child(4n) {
  margin-right: 0;
}

.warn-card-main::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 60px;
  border-radius: 2px;
  top: 0;
  left: 0;
}

.warn-card-main::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.29;
  z-index: 1;
}

.warn-level-1::before {
  background: #ef6969;
}

.warn-level-2::before {
  background: #ff8f00;
}

.warn-level-3::before {
  background: #4682fa;
}

.warn-level-3::after {
  background: linear-gradient(
    273deg,
    rgba(70, 130, 250, 0) 0%,
    rgba(70, 130, 250, 0.35) 100%
  );
}
.warn-level-1::after {
  background: linear-gradient(
    273deg,
    rgba(255, 0, 0, 0) 0%,
    rgba(255, 0, 0, 0.3) 100%
  );
}
.warn-level-2::after {
  background: linear-gradient(
    273deg,
    rgba(255, 143, 0, 0) 0%,
    rgba(255, 143, 0, 0.35) 100%
  );
}
.card-main-left {
  min-width: 50px;
  margin-right: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.warn-card-type {
  font-weight: bold;
}

.card-main-right {
  box-sizing: border-box;
  max-width: 80%;
  padding-right: 20px;
  div {
    padding: 2px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
}

.card-main-none {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #909398;
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
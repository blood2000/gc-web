<template>
  <div class="alarmInfo">
    <div class="alarmInfo__bar">
      <div class="alarmInfo__title">
        <img src="@/assets/images/index/alarmInfo-icon.png" alt="" />
        <span>告警信息</span>
      </div>
      <el-button type="text" @click="onClickMore">更多信息</el-button>
    </div>
    <div class="alarmInfo-wrapper">
      <NoneData v-if="alarmList.length <= 0" />
      <div class="alarmInfo-wrapper__container" v-for="item in alarmList" :key="item.id">
        <div class="alarmInfo-wrapper__box" :class="'alarmInfo-wrapper__level' + item.alarmLevel">
          <div class="alarmInfo-wrapper__tips">
            <img :src="item.icon" alt="" />
            <p class="g-single-row">{{ item.vendorAlarmTypeName }}</p>
          </div>
          <div class="alarmInfo-wrapper__detail">
            <div class="top">
              <div class="car">
                <div class="id" v-show="item.vehicleAlias">{{ item.vehicleAlias }}</div>
                <span class="license">{{ item.licenseNumber }}</span>
              </div>
              <div class="date">{{ item.alarmTime }}</div>
            </div>
            <div class="bottom">
              <div class="left" v-show="item.nickName">
                <img src="@/assets/images/index/driver-userIcon.png" alt="" />
                <span class="username">{{ item.nickName }}</span>
              </div>
              <div class="right">
                <img src="@/assets/images/index/alarmInfo-location.png" alt="" />
                <span class="g-single-row">{{ item.alarmAddress }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import NoneData from '../NoneData'

export default {
  name: 'alarmInfo',
  components: {
    NoneData,
  },
  data() {
    return {
      alarmList: [],
    }
  },
  created() {
    this.queryAlarmNotificationList()
  },
  methods: {
    queryAlarmNotificationList() {
      const objDispatch = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'alarmNotificationList',
        data: {
          pageNum: 1,
          pageSize: 5,
        },
      }
      http_request(objDispatch).then((res) => {
        const data = res.data ? res.data.rows || [] : []
        this.alarmList = data
      })
    },
    onClickMore() {
      this.$router.push({ path: '/warning/warning' })
    },
  },
}
</script>

<style lang="scss" scoped>
.alarmInfo {
  width: 448px;
  height: 500px;
  position: relative;
  &__bar {
    width: 100%;
    height: 300px;
    position: absolute;
    top: 0px;
    left: 0px;
    background: linear-gradient(-20deg, #ffffff 0%, #85aeff 100%);
    border-radius: 4px;
    padding: 5px 15px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  &__title {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 1px 3px #165ae1;
    img {
      width: 67px;
      height: 52px;
      vertical-align: middle;
    }
  }
  .alarmInfo-wrapper {
    z-index: 1;
    width: 100%;
    min-height: 405px;
    position: relative;
    top: 57px;
    background: #ffffff;
    border-radius: 10px 10px 4px 4px;
    padding: 0 8px;
    &__container {
      padding: 10px 0 6px 0;
      border-bottom: 1px solid #f6f6f6;
      &:last-child {
        border-bottom: none;
      }
    }
    &__box {
      position: relative;
      padding: 7px 10px;
      display: flex;
      align-items: center;
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.29;
        z-index: 1;
      }
    }
    &__level1::after {
      background: linear-gradient(273deg, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 0.3) 100%);
    }
    &__level2::after {
      background: linear-gradient(273deg, rgba(255, 143, 0, 0) 0%, rgba(255, 143, 0, 0.35) 100%);
    }
    &__level3::after {
      background: linear-gradient(273deg, rgba(70, 130, 250, 0) 0%, rgba(70, 130, 250, 0.35) 100%);
    }
    &__tips {
      width: 50px;
      margin-right: 20px;
      img {
        width: 48px;
        height: 30px;
        display: block;
        margin: auto;
      }
      p {
        font-size: 12px;
        font-weight: bold;
        color: #3d4050;
      }
    }
    &__detail {
      flex: 1 1 auto;
      width: 0;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .car {
          display: flex;
          align-items: center;
        }
        .id {
          height: 18px;
          line-height: 18px;
          text-align: center;
          background: linear-gradient(90deg, #4682fa 0%, #155ff2 100%);
          border-radius: 2px;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          margin-right: 7px;
          padding: 0 6px;
        }
        .license {
          font-size: 16px;
          font-weight: bold;
          color: #3d4050;
        }
        .date {
          font-size: 14px;
          color: #b9b9b9;
        }
      }
      .bottom {
        font-size: 14px;
        color: #3d4050;
        margin-top: 5px;
        display: flex;
        align-items: center;
        .left {
          width: 60px;
          margin-right: 10px;
        }
        .right {
          flex: 1 1 auto;
          width: 0;
          display: flex;
          align-items: center;
        }
        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>

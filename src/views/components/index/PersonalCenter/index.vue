<template>
  <div class="personalCenter">
    <!-- 用户信息 -->
    <div class="user-container">
      <div class="avatar">
        <img v-if="user.avatar" :src="user.avatar" />
        <img v-else src="../../../../assets/images/profile.png" alt="默认头像" />
      </div>
      <div class="info">
        <div class="top g-single-row">HI, {{ user.nickName }}</div>
        <div class="mid g-single-row">{{ user.isAdmin === 1 ? companyName : dept.deptName }}</div>
        <div class="bottom" v-if="roleNames.length > 0">
          <el-tag class="mr5" size="mini">{{ roleNames[0] }}</el-tag>
          <el-dropdown v-if="roleNames.length > 1">
            <span class="el-dropdown-link">
              <el-tag size="mini"><i class="el-icon-more"></i></el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in roleNames"
                :key="index"
                v-show="index !== 0"
              >
                <el-tag size="mini">{{ item }}</el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 日历表 -->
    <div class="calendar-container">
      <!-- 日期操作 -->
      <div class="calendar-container__tips">
        <div class="calendar-container__date">{{ currentTM }}</div>
        <div class="calendar-container__op">
          <i class="arrow el-icon-arrow-left" @click="skip('preMon')"></i>
          <i class="arrow el-icon-arrow-right" @click="skip('nextMon')"></i>
        </div>
      </div>
      <!-- 日历表 -->
      <div class="calendar-container__main">
        <el-calendar ref="monChild" v-model="value" :first-day-of-week="7">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div @click="onClickDay(data)" :class="data.isSelected ? 'is-selected' : ''">
              <div style="line-height: 17px">
                {{ parseTime(data.day, '{d}') }}
              </div>
              <div class="g-flexcenter">
                <div
                  v-if="
                    warnDateList.findIndex((res) => res.alarmTime === data.day) !== -1 &&
                    new Date() > new Date(data.day).getTime()
                  "
                  :class="data.isSelected ? 'schedule' : 'schedule g-color-error'"
                >
                  ·
                </div>
                <div
                  v-if="transList.findIndex((res) => res.datetime === data.day) !== -1"
                  :class="data.isSelected ? 'schedule' : 'schedule g-color-blue'"
                >
                  ·
                </div>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
      <!-- 告警运输 -->
      <div class="calendar-container__detail">
        <div class="bar">
          <span class="left">告警</span>
          <span class="right">
            {{ warnDateCount }}
          </span>
        </div>
        <div class="bar">
          <span class="left">运输</span>
          <span class="right">
            {{ transCount }}
          </span>
        </div>
      </div>
    </div>
    <!-- 数据 -->
    <div class="date-container">
      <div class="date-container__box">
        <div class="date-container__title">
          <img class="icon" src="../../../../assets/images/home/vehicle.png" alt="" />
          <span>车辆</span>
        </div>
        <div class="date-container__tips">
          <div>
            已安装设备<span>{{ vehicle.bindingDevice }}</span>
          </div>
          <div>
            全部车辆<span class="bigger">{{ vehicle.allVehicle }}</span>
          </div>
        </div>
        <el-progress
          class="date-container__progress"
          :percentage="vehicle.percent"
          :show-text="false"
          color="#4682fa"
          :stroke-width="4"
        />
        <div class="date-container__tips date-container__detail">
          <div class="blue">
            任务中<span>{{ vehicle.taskVehicle }}</span>
          </div>
          <div class="green">
            空闲中<span class="bigger">{{ vehicle.freeVehicle }}</span>
          </div>
        </div>
      </div>
      <div class="date-container__box">
        <div class="date-container__title">
          <img class="icon" src="../../../../assets/images/home/driver.png" alt="" />
          <span>司机</span>
        </div>
        <div class="date-container__tips">
          <div></div>
          <div>
            全部司机<span class="bigger">{{ driver.allDriver }}</span>
          </div>
        </div>
        <el-progress
          class="date-container__progress"
          :percentage="driver.percent"
          :show-text="false"
          color="#4682fa"
          :stroke-width="4"
        />
        <div class="date-container__tips date-container__detail">
          <div class="blue">
            任务中<span>{{ driver.taskDriver }}</span>
          </div>
          <div class="green">
            空闲中<span class="bigger">{{ driver.freeDriver }}</span>
          </div>
        </div>
      </div>
      <div class="date-container__box">
        <div class="date-container__title">
          <img class="icon" src="../../../../assets/images/home/device.png" alt="" />
          <span>设备</span>
        </div>
        <div class="date-container__tips">
          <div>
            未激活设备<span>{{ device.inactiveDevice }}</span>
          </div>
          <div>
            全部设备<span class="bigger">{{ device.deviceCount }}</span>
          </div>
        </div>
        <el-progress
          class="date-container__progress"
          :percentage="device.percent"
          :show-text="false"
          color="#4682fa"
          :stroke-width="4"
        />
        <div class="date-container__tips date-container__detail">
          <div class="blue">
            在线<span>{{ device.onlineDevice }}</span>
          </div>
          <div class="green">
            离线<span class="bigger">{{ device.offlineDevice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
export default {
  name: 'PersonalCenter',
  data() {
    return {
      user: {},
      dept: {},
      companyName: '',
      roleNames: [],
      value: new Date(),
      warnDateCount: 0,
      warnDateList: [],
      transCount: 0,
      transList: [],
      title: '',
      openSchedule: false,
      vehicle: {}, // 车辆
      driver: {}, // 司机
      device: {}, // 设备
    }
  },
  computed: {
    currentTM() {
      return this.parseTime(this.value, '{y}年{m}月')
    },
  },
  created() {
    this.getUser()
    this.getList()
    this.queryDriverVehicleEquipment()
  },
  methods: {
    // 获取用户信息
    getUser() {
      this.$store.dispatch('GetInfo').then((res) => {
        console.log('用户信息==>', res)
        this.user = res.user
        this.dept = res.dept
        this.companyName = res.company.name
        this.roleNames = res.roleNames || []
      })
    },
    getList() {
      this.getDispatch()
      this.getWarn()
    },
    // 日历告警
    getWarn() {
      const obj = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'schedule_warn',
        data: {
          alarmTime: this.parseTime(this.value, '{y}-{m}'),
        },
      }
      http_request(obj).then((res) => {
        console.log('日历告警--->', res)
        this.warnDateList = res.data
        this.onClickDay({
          day: this.parseTime(this.value, '{y}-{m}-{d}'),
        })
      })
    },
    // 日历运输
    getDispatch() {
      const objDispatch = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'schedule_dispatch',
        data: {
          date: this.parseTime(this.value, '{y}-{m}'),
        },
      }
      http_request(objDispatch).then((res) => {
        console.log('日历运输--->', res)
        this.transList = res.data
        this.onClickDay({
          day: this.parseTime(this.value, '{y}-{m}-{d}'),
        })
      })
    },
    // 获取司机设备车辆信息
    queryDriverVehicleEquipment() {
      const obj = {
        moduleName: 'http_home',
        method: 'get',
        url_alias: 'driverVehicleEquipment',
      }
      http_request(obj).then((res) => {
        console.log('qewqwwe--->', res)
        const data = res.data
        if (data) {
          this.vehicle = data.vehicle
          this.vehicle.percent = parseInt(
            (this.vehicle.taskVehicle / (this.vehicle.taskVehicle + this.vehicle.freeVehicle)) * 100
          )
          this.driver = data.driver
          this.driver.percent = parseInt(
            (this.driver.taskDriver / (this.driver.taskDriver + this.driver.freeDriver)) * 100
          )
          this.device = data.device
          this.device.percent = parseInt(
            (this.device.taskDevice / (this.device.taskDevice + this.device.freeDevice)) * 100
          )
        }
      })
    },
    // 周切换
    skip(val) {
      if (val === 'preMon') {
        this.value = new Date(this.value.setMonth(this.value.getMonth() - 1))
      } else if (val === 'nextMon') {
        this.value = new Date(this.value.setMonth(this.value.getMonth() + 1))
      } else if (val === 'today') {
        this.value = new Date()
      } else if (val === 'preYear') {
        this.value = new Date(this.value.setFullYear(this.value.getFullYear() - 1))
      } else if (val === 'nextYear') {
        this.value = new Date(this.value.setFullYear(this.value.getFullYear() + 1))
      }
      this.getList()
    },
    // 点击了日子
    onClickDay(data) {
      let warnDateCount = 0
      this.warnDateList.forEach((item) => {
        if (item.alarmTime === data.day) {
          warnDateCount = item.number
        }
      })
      this.warnDateCount = warnDateCount

      let transCount = 0
      this.transList.forEach((item) => {
        if (item.datetime === data.day) {
          transCount = item.number
        }
      })
      this.transCount = transCount
    },
  },
}
</script>

<style lang="scss" scoped>
.personalCenter {
  .user-container {
    height: 56px;
    margin-top: 40px;
    display: flex;
    align-items: center;
    .avatar {
      height: 56px;
      margin-right: 18px;
      img {
        width: 56px;
        height: 56px;
        border-radius: 100%;
      }
    }
    .info {
      flex: 1 1 auto;
      width: 0;
      .top {
        font-size: 20px;
        font-weight: bold;
        color: #3d4050;
      }
      .bottom {
        font-size: 14px;
        color: #3d4050;
        .mr5 {
          margin-right: 5px;
        }
      }
    }
  }
  .calendar-container {
    margin-top: 30px;
    &__tips {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__date {
      font-size: 20px;
      font-weight: bold;
      color: #3d4050;
    }
    &__op {
      display: flex;
      align-items: center;
      .arrow {
        width: 24px;
        height: 24px;
        border: 1px solid #e1e1e1;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7e7f81;
        font-weight: bold;
        cursor: pointer;
        &:first-child {
          margin-right: 13px;
        }
      }
    }
    &__main {
      margin-top: 15px;
    }
    &__detail {
      margin: 10px 0;
      .bar {
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-weight: bold;
        color: #3d4050;
        &:first-child {
          background: rgba(239, 105, 105, 0.1);
          margin-bottom: 12px;
          border-left: 4px solid #ef6969;
        }
        &:last-child {
          background: rgba(70, 130, 250, 0.1);
          border-left: 4px solid #4682fa;
        }
        .left {
          margin-left: 8px;
        }
        .right {
          margin-right: 16px;
        }
      }
    }
  }
  .date-container {
    &__box {
      padding: 8px 12px;
      background: #f7f9fb;
      border-radius: 3px;
      margin-bottom: 10px;
    }
    &__title {
      font-size: 18px;
      font-weight: bold;
      color: #3d4050;
      display: flex;
      align-items: center;
      .icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
    }
    &__tips {
      font-size: 12px;
      color: #3d4050;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      .bigger {
        font-size: 22px;
        font-weight: bold;
        font-family: Bahnschrift;
        margin-left: 3px;
      }
    }
    &__detail {
      margin-top: 3px;
      .bigger {
        font-size: 14px;
      }
      .blue {
        color: #4682fa;
      }
      .green {
        color: #43b91e;
      }
    }
  }
}
.schedule {
  line-height: 5px;
  font-weight: bold;
  font-size: 22px;
}
::v-deep .el-calendar__header {
  display: none;
  font-size: 12px;
  padding: 10px 0px;
  .el-button--mini {
    padding: 2px 5px;
    border-radius: 3px;
  }
}
::v-deep .el-calendar__body {
  padding: 0;
  .el-calendar-table thead th {
    padding: 0;
  }
}

::v-deep .el-calendar-table .el-calendar-day {
  height: auto;
  padding: 5px;
}
::v-deep .el-calendar-table tr td {
  border: 0px;
  text-align: center;
}
::v-deep .el-calendar-table td.is-selected {
  display: flex;
  justify-content: center;
  background: #fff;
  .el-calendar-day {
    width: 30px;
    height: 30px;
    background: #4682fa;
    background: linear-gradient(180deg, #68b1fc 0%, #007dff 100%);
    box-shadow: 0px 3px 6px rgba(70, 130, 250, 0.23);
    border-radius: 50%;
    font-weight: bold;
    color: #ffffff;
  }
}
::v-deep .el-calendar-table td :hover {
  background: none;
  color: #409eff;
}
::v-deep .el-calendar-table td.is-selected :hover {
  background: #68b1fc;
  color: #fff;
}
::v-deep .date-container .el-progress-bar__outer {
  background: #43b91e;
}
::v-deep .el-tag {
  border-radius: 12px;
}
</style>

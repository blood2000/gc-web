<template>
  <div class="personalCenter">
    <!-- 个人中心 -->
    <div class="home-title">个人中心</div>
    <div class="ly-flex bg-info">
      <div class="information g-single-row">
        <div class="top g-single-row">HI, {{ user.nickName }}</div>
        <div class="role g-single-row g-flex">
          <div class="g-single-row" style="max-width: 90px; margin-right: 5px">
            {{ dept || "-" }}
          </div>
          | {{ roles || "-" }}
        </div>
      </div>
      <div class="avatar">
        <img v-if="user.avatar" class="user-avator" :src="user.avatar" />
        <img
          v-else
          class="user-avator"
          src="../../../../assets/images/profile.png"
          alt="默认头像"
        />
      </div>
    </div>

    <!-- 考勤统计 -->
    <!-- <div class="statistics ly-flex-align-center ly-flex-pack-justify">
      <div class="item">
        <span class="item0">22</span>
        <span class="item1">考勤统计</span>
      </div>
      <div class="item">
        <span class="item0">22</span>
        <span class="item1">考勤统计</span>
      </div>
    </div> -->

    <!-- 日历表 -->

    <div class="ly-flex my_calendar_header">
      <span class="shou" @click="skip('preYear')">
        <i v-once class="iconfont icon-zuoshuangjiantou" />
      </span>

      <span class="shou" @click="skip('preMon')">
        <i v-once class="iconfont icon-shangyiye" />
      </span>

      <span class="shou el-calendar__title mtime" @click="skip('today')">
        {{ currentTM }}
      </span>

      <span class="shou" @click="skip('nextMon')">
        <i v-once class="iconfont icon-xiayiye1" />
      </span>

      <span class="shou" @click="skip('nextYear')">
        <i v-once class="iconfont icon-youshuangjiantou" />
      </span>
    </div>
    <el-calendar ref="monChild" v-model="value" :first-day-of-week="7">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <!-- slot="dateCell" -->
      <!-- slot-scope="{date, data}"> -->
      <template #dateCell="{ data }">
        <div
          :class="data.isSelected ? 'is-selected' : ''"
          @click="handleClick(data)"
        >
          <div style="line-height: 17px">
            {{ parseTime(data.day, "{d}") }}
          </div>
          <div class="g-flexcenter">
            <div
              v-if="
                dispatchDateList.findIndex((res) => res === data.day) !==
                -1
              "
              :class="data.isSelected ? 'schedule' : 'schedule g-color-blue'"
            >
              ·
            </div>
            <div
              v-if="
                warnDateList.findIndex((res) => res.alarmTime === data.day) !==
                  -1 && new Date() > new Date(data.day).getTime()
              "
              :class="data.isSelected ? 'schedule' : 'schedule g-color-error'"
            >
              ·
            </div>
          </div>
          <!-- <div v-else style="height: 5px" /> -->
        </div>
      </template>
    </el-calendar>
    <div class="tag-frame g-flexcenter">
      <div class="schedule g-color-blue margin-r">·</div>
      <div class="tag">派车</div>
      <div class="schedule g-color-error margin-r">·</div>
      <div class="tag">告警</div>
    </div>
    <!-- <schedule-dialog
      ref="ScheduleDialog"
      :title="title"
      :open.sync="openSchedule"
      @refresh="getList"
    /> -->
  </div>
</template>

<script>
// import { getUserInfo } from '@/utils/auth';
// import { listSchedule } from "@/api/workbench/workbench";
// import { WebDaily } from "@/api/application/daily";
// import ScheduleDialog from "./ScheduleDialog.vue";
import { http_request } from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "PersonalCenter",
  components: {
    // ScheduleDialog,
  },
  data() {
    return {
      user: {},
      dept: "",
      value: new Date(),
      dispatchDateList: [],
      // warnDateList: ['2021-10-12', '2021-10-13'],
      warnDateList: [],
      title: "",
      openSchedule: false,
    };
  },

  computed: {
    // 获取用户信息
    // userInfo() {
    //   console.log(getUserInfo());
    //   return getUserInfo() || {};
    // },

    // 结构用户
    // user() {
    //   return this.userInfo.user || {};
    // },

    // 结构角色
    roles() {
      return this.user.roles
        ? this.user.roles.map((e) => e.roleName).join(",")
        : "";
    },

    currentTM() {
      return this.parseTime(this.value, "{y}年{m}月");
    },
  },
  created() {
    this.getUser();
    this.getList();
  },
  methods: {
    // 获取用户信息
    getUser() {
      this.$store.dispatch("GetInfo").then((res) => {
        console.log("用户信息==>", res);
        this.user = res.user;
        this.dept = res.dept;
      });
      // getUserProfile().then(response => {
      //   this.user = response.data;
      //   this.roleGroup = response.roleGroup;
      //   this.postGroup = response.postGroup;
      // });
    },
    getList() {
      this.getDispatch();
      this.getWarn();
    },
    getDispatch() {
      const objDispatch = {
        moduleName: "http_home",
        method: "get",
        url_alias: "schedule_dispatch",
        data: {
          date: this.parseTime(this.value, "{y}-{m}"),
        },
      };
      http_request(objDispatch).then((res) => {
        console.log("日历派车--->", res);
        this.dispatchDateList = res.data;
      });
    },
    getWarn() {
      const obj = {
        moduleName: "http_home",
        method: "get",
        url_alias: "schedule_warn",
        data: {
          alarmTime: this.parseTime(this.value, "{y}-{m}"),
        },
      };
      http_request(obj).then((res) => {
        console.log("日历告警--->", res);
        this.warnDateList = res.data;
      });
    },
    handleClick(data) {
      this.$refs.ScheduleDialog.reset();
      this.title = "今日事项（" + data.day + "）";
      this.openSchedule = true;
      const schedule = this.dateList.find(
        (item) => item.scheduleTime === data.day
      );
      const daily = this.dailyList.find((item) => item.dailyTime === data.day);
      // console.log(schedule);
      this.$refs.ScheduleDialog.setForm(data, schedule, daily);
      // console.log(this.dateList.findIndex(res => res.scheduleTime === data.day));
    },

    // 周切换
    skip(val) {
      if (val === "preMon") {
        // console.log(this.value.getMonth() - 1);
        // console.log(new Date(this.value.setMonth(this.value.getMonth() - 1)));
        this.value = new Date(this.value.setMonth(this.value.getMonth() - 1));
        // console.log(this.$refs.monChild);
        // this.$refs.monChild.changeValue(this.value)
      } else if (val === "nextMon") {
        this.value = new Date(this.value.setMonth(this.value.getMonth() + 1));
      } else if (val === "today") {
        this.value = new Date();
      } else if (val === "preYear") {
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() - 1)
        );
        // getFullYear()
      } else if (val === "nextYear") {
        this.value = new Date(
          this.value.setFullYear(this.value.getFullYear() + 1)
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-title {
  color: #3d4050;
  font-size: 16px;
  font-weight: bold;
}
.schedule {
  line-height: 5px;
  font-weight: bold;
  font-size: 22px;
}
.tag + .schedule {
  margin-left: 26px;
}
.margin-r {
  margin-right: 7px;
}
.tag {
  color: #3d4050;
}
.tag-frame {
  border-top: 1px solid #e4ecf4;
  padding: 5px;
  margin-top: 10px;
}

.personalCenter {
  height: 100%;
  .bg-info {
    position: relative;
    right: 15px;
    margin: 4% 0 4%;
    padding: 8px 10px 8px 30px;
    background: url("~@/assets/images/home/info-bg.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 0 100px 100px 0;
  }
  .ly-flex {
    width: 100%;
  }
  .avatar {
    width: 60px;
    // min-width: 60px;
    height: 60px;
    border: 5px solid #ffffff;
    border-radius: 50%;
    overflow: hidden;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .information {
    flex: 1;
    height: 60px;
    // padding-left: 15px;
    .top {
      font-size: 20px;
      line-height: 1;
      padding: 10px 0;
      font-weight: bold;
      color: #ffffff;
    }
    .role {
      line-height: 1;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
  }

  // 考勤统计
  .statistics {
    width: 100%;
    height: 70px;
    background-color: #f7f8fb;
    margin: 20px 0 0;
    .item {
      width: 50%;
      text-align: left;
      padding-left: 20px;
      // display: flex;
      // flex-wrap: wrap;
      span {
        display: block;
        width: 100%;
      }
      .item0 {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
}

// 其他样式
// .is-selected{
//     color: #1989FA;
// }

// 日历

.my_calendar_header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  color: #8592ad;
  .mtime {
    font-weight: 700;
  }
  .iconfont {
    font-size: 14px;
  }
}

// .el-calendar{
//     // width: 100%;
//     // height: 3.15rem;
// }
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
  padding: 10px 10px 0;
  .el-calendar-table thead th {
    padding: 0;
  }
}

::v-deep .el-calendar-table .el-calendar-day {
  height: auto;
  //   padding: .02rem;
  //   width: 25px;
  // height: 28px;
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
    // padding: 0;
    // margin: 0 auto;
    width: 30px;
    height: 30px;
    background: #4682fa;
    background: linear-gradient(180deg, #68b1fc 0%, #007dff 100%);
    box-shadow: 0px 3px 6px rgba(70, 130, 250, 0.23);
    border-radius: 50%;
    // font-family: PingFang SC;
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
</style>


<!-- 告警详情 -->
<template>
  <el-drawer
    :title="options.title"
    :visible.sync="listDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="70%"
  >
    <div class="warn-drawer">
      <div class="warn-drawer-title">
        <span>{{ keyWord }}</span>
      </div>

      <div class="warn-drawer-queryForm">
        <div class="warn-drawer-queryForm-label">告警日期:</div>
        <el-date-picker
          v-model="queryParams.dateRange"
          unlink-panels
          :picker-options="pickerOptions"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="warn-drawer-count">共 99 次</div>
      <div class="warn-drawer-table">
        <RefactorTable
          :loading="loading"
          :data="warningData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
        >
          
          <!-- <template #deviceType="{ row }">
            {{ getDeviceTypeName(row.deviceType) }}
          </template> -->
          <template #handle="{ row }">
            <el-button size="mini" type="text" @click="toDetail(row)"
              >详情
            </el-button>
          </template>
        </RefactorTable>
      </div>

      <Detail
        :id="id"
        :detailDrawer="detailDrawer"
        :options="{
          title: '告警详情',
          warningTypeList: options.warningTypeList,
        }"
        @colseDetailDrawer="colseDetailDrawer"
      />
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "@/api";
import warningConfig from "./config";
import Detail from "./components/WarnDetail.vue";
import { pickerOptions } from "@/utils/dateRange";
import { number } from "echarts";
// import store from "@/store";
export default {
  name: "warningList",
  data() {
    return {
      detail: {},
      videoList: [],
      loading: false,
      warningData: [],  //测试数据
      detailDrawer: false,
      pickerOptions,
      queryParams: {
        dateRange: [],
      },
      tableColumnsConfig: [], //配置表头数据
    };
  },
  components: { Detail },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    listDrawer: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: String,
      default: "1",
    },
    keyWord: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: {},
    },
  },
  watch: {
    listDrawer() {
      console.log("我在监听");
      if (this.listDrawer) {
        console.log("他变成true");
        // this.getWarningDetail();
        this.videoList = warningConfig.videoList;
      }
    },
    tabIndex() {
      if (this.tabIndex === "1") {
        this.tableColumnsConfig = [
          ...warningConfig.vehicleColumn,
          ...warningConfig.tableColumnsConfig,
        ];
      } else {
        this.tableColumnsConfig = [
          ...warningConfig.driverColumn,
          ...warningConfig.tableColumnsConfig,
        ];
      }
      console.log(this.tableColumnsConfig, "<---");
    },
    keyWord(val) {
      this.keyWord = val;
      console.log("关键词", this.keyWord);
    },
  },
  mounted() {
    this.warningData = warningConfig.mockData;
    console.log(this.warningData)
  },

  methods: {
    dealAlarmImg() {
      if (!this.detail.key) return "";
      return require(`@/assets/images/detail/${this.detail.key}.png`);
    },
    levelDeal(type) {
      const obj = {
        text: () => {
          if (!this.detail.alarmLevel) return "-";
          console.log(
            "text",
            warningConfig.warningLevelObj[this.detail.alarmLevel][type]
          );
          return warningConfig.warningLevelObj[this.detail.alarmLevel].text;
        },
        img: () => {
          if (!this.detail.alarmLevel) return "";
          console.log(
            "warningConfig.warningLevelObj[this.detail.alarmLevel].img",
            warningConfig.warningLevelObj[this.detail.alarmLevel]
          );
          return warningConfig.warningLevelObj[this.detail.alarmLevel].img;
        },
      };
      return obj[type]();
    },
    async getWarningDetail() {
      this.loading = true;
      // let option = document.location.search.split("=")[1];
      // this.id = option;
      console.log(this.id);
      // this.driver = this.$router.param.driver;
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_detail",
        url_code: [this.id],
      };
      const res = await http_request(obj);
      this.loading = false;
      console.log("告警详情-->", res);
      if (res.code === 200) {
        this.detail = res.data;
      }
      console.log(this.detail);
    },
    //告警类型
    getWarinigTypeName(warningType) {
      let warningName = "";
      warningConfig.warningTypeList.map((item) => {
        if (item.warningType === warningType) {
          warningName = item.warningName;
        }
      });
      return warningName;
    },
    //设备类型
    getDeviceTypeName(deviceType) {
      let name = "";
      warningConfig.deviceTypeList.map((item) => {
        if (item.value === deviceType) {
          name = item.label;
        }
      });
      return name;
    },
    // 告警级别
    getWarningLevelName(level) {
      let levelName = "";
      warningConfig.warningLevelList.map((item) => {
        if (item.level === level) {
          levelName = item.name;
        }
      });
      return levelName;
    },
    handleClose() {
      this.$emit("colseListDrawer");
    },

    //打开详情
    openDetail() {
      this.detailDrawer = true;
    },
    colseDetailDrawer() {
      this.detailDrawer = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.warn-drawer {
  padding: 20px;
  color: #3d4050;
  &-title {
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    span {
      min-width: 90px;
      padding: 0 5px;
      height: 28px;
      background: url("../../../assets/images/detail/warn_title.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 28px;
    }
  }
  &-queryForm {
    font-size: 14px;
    &-label {
      font-weight: bold;
      padding: 10px 0;
    }
  }
  &-count {
    margin-top: 16px;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>

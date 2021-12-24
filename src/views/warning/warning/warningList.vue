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
        <div class="warn-drawer-form">
          <div>
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
          <div>
            <div class="warn-drawer-queryForm-label">告警类型:</div>
            <el-input
              v-model="warningNames"
              clearable
              :readonly="true"
              placeholder="请选择告警类型"
              style="width: 160px"
              @focus="chooseWarningTypes"
            />
          </div>
        </div>
        <div class="btn-box">
          <div class="as-btn btn1" @click="searchQuery">搜索</div>
          <div class="as-btn btn2" @click="reset">重置</div>
        </div>
      </div>
      <div class="warn-drawer-count">共 {{total}} 次</div>
      <div class="warn-drawer-table">
        <RefactorTable
          is-show-index
          :loading="loading"
          :data="warningData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
        >
        <!-- licenseNumber -->
           <template #licenseNumber="{ row }">
            {{
              row.vehicleAlias
                ? `(${row.vehicleAlias})  ${row.licenseNumber}`
                : row.licenseNumber
            }}
          </template>
          <template #alarmLevel="{ row }">
            <div class="warn-level-td">
              <img :src="levelDeal(row.alarmLevel).img" alt="" />
              {{ levelDeal(row.alarmLevel).text }}
            </div>
          </template>
          <template #handle="{ row }">
            <el-button size="mini" type="text" @click="openDetail(row)">
              详情
            </el-button>
          </template>
        </RefactorTable>
        <!-- 分页 -->
        <pagination
          v-show="total > queryParams.pageSize"
          :total="total"
          layout="prev, pager, next,jumper, total,sizes"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getWarningList"
        />
      </div>

      <Detail
        :id="currId"
        :detailDrawer="detailDrawer"
        :options="{
          title: '告警详情',
          warningTypeList: options.warningTypeList,
        }"
        @colseDetailDrawer="colseDetailDrawer"
      />
    </div>
    <el-dialog
      title="告警类型选择"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancel"
      :destroy-on-close="true"
    >
      <div v-for="(item, index) in warningTypes" :key="index">
        <div class="types-title">{{ item.alarmObjectName }}</div>
        <div class="types-box">
          <div
            class="types-item"
            v-for="(cItem, cIndex) in item.alarmTypeInfoList"
            :title="cItem.isChoose ? '单击取消' : '单击选中'"
            :key="cIndex"
            :class="cItem.isChoose ? 'choosed' : ''"
            @click="changeWarningType(cItem)"
          >
            {{ cItem.alarmTypeName }}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" :loading="loading">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
      keyWord: "",
      videoList: [],
      currId: 0,
      loading: false,
      warningData: [], //表格数据
      detailDrawer: false,
      pickerOptions,
      queryParams: {
        dateRange: [],
        pageNum: 1,
        pageSize: 10,
        nickName: "",
        licenseNumber: "",
        dimensionType: "vehicle",
        alarmTypeInfoId: "",
        // idAndAlarmObject: "",
      },
      open: false,
      warningTypes: [],
      warningNames: "",
      tableColumnsConfig: [], //配置表头数据
      total: 0,
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

    options: {
      type: Object,
      default: {},
    },
    drawerQuerys: {
      type: Object,
      required: true,
    },
    // warningTypeList: {
    //   type: Array,
    //   default: () => [],
    // },
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

    drawerQuerys(val) {
      console.log(val);
      this.queryParams.dateRange = val.dateRange;
      this.queryParams.dimensionType = val.dimensionType;
      if (val.dimensionType === "vehicle") {
        this.tableColumnsConfig = [
          ...warningConfig.vehicleColumn,
          ...warningConfig.tableColumnsConfig,
        ];
        this.keyWord = val.licenseNumber;
        this.queryParams.licenseNumber = val.licenseNumber;
      } else {
        this.tableColumnsConfig = [
          ...warningConfig.driverColumn,
          ...warningConfig.tableColumnsConfig,
        ];
        this.keyWord = val.nickName;
        this.queryParams.nickName = val.nickName;
      }

      this.warningTypes = JSON.parse(JSON.stringify(val.subWarningTypeList));
      console.log("000----", this.warningTypes);
      if (this.warningTypes.length === 1) {
        this.warningTypes.map((item) => {
          item.alarmTypeInfoList.map((cItem) => {
            cItem.isChoose = true;
          });
        });
      }
      this.getWarnTypeId();
      this.searchQuery();
    },
    // warningTypeList(list) {
    //   this.warningTypes = JSON.parse(JSON.stringify(list));
    //   this.getWarnTypeId();
    // },
  },
  mounted() {
    // this.warningData = warningConfig.mockData;
    // this.searchQuery();
  },

  methods: {
    dealAlarmImg() {
      if (!this.detail.key) return "";
      return require(`@/assets/images/detail/${this.detail.key}.png`);
    },
    levelDeal(level) {
      let obj = {};
      if (!level) {
        obj.text = "-";
        obj.img = "";
      } else {
        obj.text = warningConfig.warningLevelObj[level].text;
        obj.img = warningConfig.warningLevelObj[level].img;
      }

      return obj;
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getWarningList();
    },
    reset() {
      this.queryParams.pageNum = 1;
      this.queryParams.dateRange = [];
      this.queryParams.alarmTypeInfoId = "";
      this.warningNames = "";
      this.getWarningList();
    },
    async getWarningList() {
      this.loading = true;
      let tmp = { ...this.queryParams };
      delete tmp.dateRange;
      tmp.bigAlarmTime =
        (this.queryParams.dateRange && this.queryParams.dateRange[0]) || null;
      tmp.endAlarmTime =
        (this.queryParams.dateRange && this.queryParams.dateRange[1]) || null;

      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_list",
        data: tmp,
      };
      const res = await http_request(obj);
      this.loading = false;
      console.log("告警明细列表-->", res);
      if (res.code === 200) {
        this.warningData = res.data.rows;
        this.total = res.data.total;
      }
      console.log(this.detail);
    },
    //告警类型
    // getWarinigTypeName(warningType) {
    //   let warningName = "";
    //   warningConfig.warningTypeList.map((item) => {
    //     if (item.warningType === warningType) {
    //       warningName = item.warningName;
    //     }
    //   });
    //   return warningName;
    // },

    //打开告警类型模态框并赋值渲染数据this.warningTypes
    chooseWarningTypes() {
      this.open = true;
      console.log(this.warningTypes);
    },
    //改变选中状态
    changeWarningType(item) {
      // console.log(item)
      item.isChoose = !item.isChoose;
    },
    //确认选中的告警类型名称及ID
    confirm() {
      this.getWarnTypeId();
      this.searchQuery();
      this.open = false;
    },
    cancel() {
      this.open = false;
    },
    //告警类型ID
    getWarnTypeId() {
      this.warningNames = "";
      let alarmTypeInfoId = [];
      this.warningTypes.map((item) => {
        item.alarmTypeInfoList.map((cItem) => {
          if (cItem.isChoose) {
            this.warningNames += cItem.alarmTypeName + ",";
            alarmTypeInfoId.push(cItem.idAndAlarmObject);
          }
        });
      });
      console.log("告警类型id", alarmTypeInfoId);
      console.log("传送的告警类型列表", this.warningTypes);
      // this.$emit("updateWarningTypeList", this.warningTypes);
      this.queryParams.alarmTypeInfoId = alarmTypeInfoId.join(",");
      // this.queryParams.idAndAlarmObject = alarmTypeInfoId.join(",");
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
    openDetail(obj) {
      this.detailDrawer = true;
      this.currId = obj.id;
      console.log("详情", obj);
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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

.warn-drawer-form {
  display: flex;
  align-items: center;
  div {
    margin-right: 20px;
  }
}

.btn-box {
  display: flex;
}

.as-btn {
  width: 80px;
  height: 32px;
  cursor: pointer;
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
}

.btn1 {
  background: #4682fa;
  color: #fff;
  margin-right: 16px;
}

.btn2 {
  border: 1px solid #4682fa;
  line-height: 30px;
  color: #4682fa;
  background: #fff;
}

.warn-level-td {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
}

.types-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.types-title {
  padding-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.types-item {
  box-sizing: border-box;
  min-width: 80px;
  padding: 0 10px;
  height: 30px;
  line-height: 28px;
  border: 1px solid #29bfff;
  background: #fff;
  color: #29bfff;
  text-align: center;
  border-radius: 6px;
  margin: 0 10px 10px 0;
  cursor: pointer;
}

.choosed {
  background: #29bfff;
  color: #fff;
}
</style>

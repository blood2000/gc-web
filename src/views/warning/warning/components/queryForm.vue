<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="80px"
      size="small"
          class="ddc-queryParams"
    label-position="top"
    >
        <div class="ddc-queryParams-left">
      <div class="up">
      <el-form-item label="车牌号" prop="vehicleCode" v-if="warningTab === '1'">
        <el-input
          v-model="queryParams.vehicleCode"
          placeholder="请输入车牌号"
          clearable
          style="width: 160px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="司机" prop="driver" v-if="warningTab === '2'">
        <el-input
          v-model="queryParams.driver"
          placeholder="请输入司机姓名"
          clearable
          style="width: 160px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>
      <el-form-item label="上报时间">
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
      </el-form-item>
      <el-form-item label="告警类型" prop="warningTypes">
        <el-input
          v-model="warningNames"
          clearable
          :readonly="true"
          placeholder="请选择告警类型"
          style="width: 160px"
          @focus="chooseWarningTypes"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select
          v-model="queryParams.deviceType"
          clearable
          filterable
          style="width: 185px"
          placeholder="请选择设备类型"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in deviceTypeList"
            :key="index"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
  </div>
    </div>
     <div class="ddc-queryParams-right">
      <!-- <div @click="hanleIsShow">
        <i :class="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        <span>{{ isShow ? "收起" : "展开" }}</span>
      </div> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('handleQuery')"
        >
          搜索
        </el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="reset">
          重置
        </el-button>
      </el-form-item>
      </div>
    </el-form>
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
        <!-- <div class="types-title">设备异常警告</div>
        <div class="types-box">
          <div
            class="types-item"
            v-for="(item, index) in warningTypes"
            :title="item.isChoose ? '单击取消' : '单击选中'"
            :key="index"
            v-show="item.alarmObject === 'device'"
            :class="item.isChoose ? 'choosed' : ''"
            @click="changeWarningType(item)"
          >
            {{ item.alarmTypeName }}
          </div>
        </div>
        <div class="types-title">车辆警告</div>
        <div class="types-box">
          <div
            class="types-item"
            v-for="(item, index) in warningTypes"
            :title="item.isChoose ? '单击取消' : '单击选中'"
            :key="index"
            v-show="item.alarmObject === 'vehicle'"
            :class="item.isChoose ? 'choosed' : ''"
            @click="changeWarningType(item)"
          >
            {{ item.alarmTypeName }}
          </div>
        </div> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" :loading="loading">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pickerOptions } from "@/utils/dateRange";
import warning from "../../../../api/archives/warning";

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    warningTypeList: {
      type: Array,
      default: () => [],
    },
    deviceTypeList: {
      type: Array,
      default: () => [],
    },
    warningTab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pickerOptions,
      open: false,
      loading: false,
      warningTypes: [],
      warningNames: "",
            isShow: false,

      // 'projectList': []
    };
  },
  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  created() {},
  mounted() {},

  methods: {
    reset() {
      this.queryParams.pageNum = 1;
      // this.resetForm('queryForm');
      this.queryParams.vehicleCode = "";
      this.warningNames = "";
      this.queryParams.warningTypes = [];
      this.queryParams.dateRange = [];
      this.queryParams.deviceType = null;
      console.log(this.queryParams);
      this.$emit("handleQuery");
    },
      hanleIsShow() {
      this.isShow = !this.isShow;
    },

    chooseWarningTypes() {
      this.open = true;
      this.warningTypes = JSON.parse(JSON.stringify(this.warningTypeList));
      console.log(this.warningTypes);
    },
    changeWarningType(item) {
      // console.log(item)
      item.isChoose = !item.isChoose;
    },
    confirm() {
      console.log(this.queryParams);
      this.warningNames = "";
      this.warningTypes.map((item) => {
        item.alarmTypeInfoList.map((cItem) => {
          if (cItem.isChoose) {
            this.warningNames += cItem.alarmTypeName + ",";
          }
        });
      });
      this.$emit("updateWarningTypeList", this.warningTypes);
      this.open = false;
    },
    cancel() {
      this.open = false;
    },
  },
};
</script>

<style scoped>
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

>>> .el-dialog__body {
  padding: 10px 20px;
}
</style>

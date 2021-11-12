<template>
  <el-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    label-width="90px"
    label-position="top"
  >
    <el-row>
      <el-col :span="13" v-show="!isZj">
        <el-tag class="warning-text" type="danger"
          >超好运货源，仅认证通过的车辆与司机可以进行运输</el-tag
        >
      </el-col>
    </el-row>

    <div style="margin-bottom: 40px">
      <el-row class="dispatch-base-contents-big">
        <el-col :span="8">
          <el-form-item label="出车日期:" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出车时间:" prop="outCarTime">
            <el-time-picker
              :picker-options="{
                selectableRange: outCarMinTime,
              }"
              v-model="form.outCarTime"
              value-format="HH:mm"
              placeholder="选择出车时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tag
        class="warning-text"
        type="warning"
        v-show="haveAppointCarRecord"
        >{{ haveAppointCarRecordText }}</el-tag
      >
      <el-row class="dispatch-base-contents-big">
        <el-col :span="8">
          <el-form-item label="承运车辆:" prop="vehicleCode">
            <el-select
              v-model="form.vehicleCode"
              clearable
              filterable
              @change="vehicleChange"
              style="width: 240px"
              placeholder="请选择承运车辆"
            >
              <el-option
                v-for="(sub, i) in vehicleList"
                :key="i"
                :label="sub.vehicleNumber"
                :value="sub.vehicleCode"
                :disabled="!isZj && sub.authStatus != '3'"
              >
                <span style="float: left">{{ sub.vehicleNumber }}</span>
                <span
                  v-if="isZj || sub.authStatus === '3'"
                  class="vehicle-item-sub-right"
                  >{{ vehicleOwnershipObj[sub.vehicleOwnership] }}</span
                >
                <span
                  v-else
                  class="vehicle-item-sub-unright"
                  :style="{ color: dealvehicleListSubText(sub, 'color', 'v') }"
                  >{{ dealvehicleListSubText(sub, "text", "v") }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="承运司机:"
            prop="driverCode"
            style="position: relative"
          >
            <el-select
              v-model="form.driverCode"
              clearable
              filterable
              @change="driverChange"
              style="width: 220px"
              placeholder="请选择承运司机"
            >
              <el-option
                v-for="(sub, i) in driverList"
                :key="i"
                :label="sub.driverName"
                :value="sub.driverCode"
                :disabled="!isZj && sub.authStatus != '3'"
              >
                <span style="float: left">{{ sub.driverName }}</span>
                <span
                  v-if="isZj"
                  style="float: right; color: #8492a6; font-size: 13px"
                  >{{ sub.driverPhone }}</span
                >
                <span
                  v-else
                  style="float: right; font-size: 13px"
                  :style="{ color: dealvehicleListSubText(sub, 'color', 'd') }"
                  >{{ dealvehicleListSubText(sub, "text", "d") }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        class="dispatch-base-contents-big"
        v-if="isZj && currVehicleInfo.vehicleOwnership === 1"
      >
        <el-col :span="8">
          <el-form-item
            :label="pageData.settlementWay == 1 ? '应收金额' : '运费单价'"
            prop="freight"
          >
            <el-input
              v-model="pageData.freight"
              clearable
              disabled
              style="width: 220px"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="pageData.settlementWay == 1 ? '应付金额' : '应付单价'"
            prop="realFreight"
          >
            <el-input
              v-model="form.realFreight"
              clearable
              type="number"
              @input="imposeInput($event, 'realFreight')"
              :disabled="isCarRecord"
              style="width: 220px"
              ><template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-form-item>
      <div class="dispatch-base-confrim">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { http_request } from "../../../../api";
import { vehicleOwnershipObj } from "../order_config";
export default {
  name: "carSingle",
  data() {
    return {
      vehicleList: [], //车辆列表
      driverList: null, //司机列表
      vehicleOwnershipObj, //静态配置 自有 外援
      haveAppointCarRecord: false, //是否是已派车
      haveAppointCarRecordText: "", //已派车文字
      currVehicleInfo: {}, //当前选择的车辆信息
      isCarRecord: false, //是否不可修改应收价格
      form: {
        startDate: null,
        outCarTime: null,
        vehicleCode: null,
        driverCode: null,
        realFreight: null,
      },

      startPickerOptions: {
        //开始时间过滤
        disabledDate: (time) => {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      rules: {
        startDate: [
          { required: true, message: "请选择出车日期", trigger: "change" },
        ],
        outCarTime: [
          { required: true, message: "请选择出车时间", trigger: "change" },
        ],
        vehicleCode: [
          { required: true, message: "请选择车辆", trigger: "change" },
        ],
        driverCode: [
          { required: true, message: "请选择司机", trigger: "change" },
        ],
      },
    };
  },
  props: {
    dispatchOrderCode: {
      type: String,
      default: "",
    },
    carDrawer: {
      type: Boolean,
      default: false,
    },
    pageData: {
      type: Object,
      default: {},
    },
    isZj: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log("单次出现");
    this.initTimeDate();
    this.listVehicleSelect();
    this.getDriverList();
  },
  computed: {
    outCarMinTime() {
      const tmpTime = new Date();
      const result = this.parseTime(tmpTime, "{h}:{i}:{s}");
      console.log("result", result);
      return `${result} - 23:59:59`;
    },
  },
  methods: {
    dealvehicleListSubText(sub, type, w) {
      const obj = {
        text: () => {
          if (sub.authStatus == "0" || sub.authStatus == "1") {
            return "认证中";
          } else if (sub.authStatus == "2") {
            return "认证失败";
          } else {
            if (w === "d") {
              return sub.driverPhone;
            } else {
              return this.vehicleOwnershipObj[sub.vehicleOwnership];
            }
          }
        },
        color: () => {
          if (sub.authStatus == "0" || sub.authStatus == "1") {
            return "#FAAD14";
          } else if (sub.authStatus == "2") {
            return "#F56C6C";
          } else {
          }
        },
      };
      return obj[type]();
    },
    //强制限制
    imposeInput(e, value) {
      console.log("强制限制", e);
      const tmp = e.match(/^[0-9]+(\.[0-9]{0,2})?/g) ?? [""];
      console.log("tmp", tmp[0]);
      this.form[value] = tmp[0];
    },
    //   司机改变
    driverChange(e) {
      if (!e) {
        this.haveAppointCarRecord = false;
        this.haveAppointCarRecordText = "";
        this.isCarRecord = false;
        this.form.realFreight = null;
        return;
      }
      this.haveAppointCarRecordHttp();
    },
    // 判断是否派车过
    haveAppointCarRecordHttp() {
      if (
        this.form.vehicleCode &&
        this.form.driverCode &&
        this.form.startDate &&
        this.dispatchOrderCode
      ) {
        console.log("给我查");
        const params = {
          dispatchOrderCode: this.dispatchOrderCode,
          appointCarDate: this.form.startDate,
          vehicleCode: this.form.vehicleCode,
          driverCode: this.form.driverCode,
        };
        const obj = {
          moduleName: "http_dispatch",
          method: "get",
          url_alias: "haveAppointCarRecord",
          data: params,
        };
        http_request(obj).then((res) => {
          console.log("res", res);
          this.haveAppointCarRecord =
            res.data.haveAppointCarRecord === 0 ? false : true;
          this.haveAppointCarRecordText = res.data.msg;
          this.form.realFreight = res.data.realFreight;

          if (this.haveAppointCarRecord === true && this.form.realFreight) {
            this.isCarRecord = true;
          } else {
            this.isCarRecord = false;
          }
        });
      } else {
        console.log("你来这拉？");
        this.haveAppointCarRecordText = "";
        this.haveAppointCarRecord = false;
        this.form.realFreight = null;
        this.isCarRecord = false;
      }
    },
    //获取派车的车辆Select
    async listVehicleSelect() {
      const me = this;
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listVehicleSelect",
      };
      const res = await http_request(obj);
      console.log("获取派车的车辆Select", res);
      me.vehicleList = res.data;
    },
    //  车辆变化
    vehicleChange(e) {
      const me = this;
      if (!e) {
        me.form.driverCode = null;
        this.currVehicleInfo = {};
        this.haveAppointCarRecord = null;
        this.isCarRecord = false;
        this.form.realFreight = null;
        return;
      }
      for (const item of me.vehicleList) {
        if (item.vehicleCode === me.form.vehicleCode) {
          this.currVehicleInfo = item;
          console.log("this.currVehicleInfo", this.currVehicleInfo);
          me.form.driverCode = item.driverCode;
          if (item.driverCode) {
            this.haveAppointCarRecordHttp();
          }
        }
      }
    },
    getDriverList() {
      const me = this;
      const obj1 = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listTeamDrivers",
      };
      http_request(obj1).then((res) => {
        me.driverList = res.data;
      });
    },
    //初始时间
    initTimeDate() {
      console.log("初始时间");
      this.form.startDate = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.form.outCarTime = this.parseTime(new Date(), "{h}:{i}");
    },
    // 提交
    submitForm(formName) {
      console.log("提交表单", this.form);
      const me = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const bodyData = {
            startDate: me.form.startDate,
            endDate: me.form.startDate,
            outCarTime: me.form.outCarTime,
            dispatchOrderCode: me.dispatchOrderCode,
            vehicleDrivers: [
              {
                realFreight: me.form.realFreight,
                vehicleCode: me.form.vehicleCode,
                driverCode: me.form.driverCode,
              },
            ],
          };
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "appoint_car",
            data: bodyData,
          };
          http_request(obj).then((res) => {
            if (res.code == 200) {
              this.$confirm(res.msg, "提示", {
                confirmButtonText: "确定",
                type: "success",
              }).then(() => {
                console.log("1111。跳不跳");
                me.$emit("handleClose");
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.vehicle-item-sub-right {
  float: right;
  display: inline-block;
  //   color: ;
  font-size: 13px;
  border-radius: 30px;
  background: #f5f5f5;
  width: 45px;
  height: 20px;
  line-height: 20px;
  padding-left: 8px;
  margin-top: 7px;
}
.vehicle-item-sub-unright {
  float: right;
  display: inline-block;
  font-size: 13px;
}
.warning-text {
  width: 100%;
  display: inline-block;
  margin: 5px 40px;
}
</style>
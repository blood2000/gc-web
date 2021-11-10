<template>
  <!-- 派车填写表单 -->
  <div class="carMany">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="90px"
      label-position="left"
    >
      <el-row class="dispatch-base-contents-big">
        <el-col :span="8">
          <el-form-item label="开始日期:" prop="startDate">
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

      <div class="carMany-list">
        <div class="title">
          <div class="title-left">
            <span>已选择车辆：</span>
            <span class="title-left-number">{{ checkedVehicle }} 辆</span>
          </div>
          <div class="title-right">
            <span>已分配司机：</span>
            <span class="title-left-number">{{ allocationDriver }} 人</span>
          </div>
        </div>
        <div class="carMany-list-search">
          <el-input
            placeholder="请输入车牌号"
            v-model="listSearch"
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="listVehicleSelect"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </div>
        <ul class="carMany-list-bottom">
          <!--             @click.stop="selectVehicle(item)" -->
          <li
            class="carMany-list-bottom-item"
            :key="index"
            v-for="(item, index) in vehicleList"
            @click.stop="checkChanges(item, index)"
          >
            <!-- 提示框 -->
            <div
              class="carMany-list-bottom-item-tip"
              v-show="item.haveAppointCarRecord"
            >
              <span>{{ item.haveAppointCarRecordText }}</span>
              <span>应付金额 {{ item.realFreight }}</span>
            </div>
            <!--  @change="checkChange" -->
            <div style="position: relative">
              <div class="carMany-list-bottom-item-checked-modal"></div>
              <el-checkbox
                class="carMany-list-bottom-item-checked"
                v-model="item.checked"
              />
            </div>

            <div class="carMany-list-bottom-item-vehicleNumber">
              {{ item.vehicleNumber }}
            </div>
            <div>
              <span class="self" v-if="isZj || item.authStatus === '3'">{{
                vehicleOwnershipObj[item.vehicleOwnership]
              }}</span>
              <span
                class="self"
                v-else
                :style="{
                  background: dealvehicleListSubText(item, 'color', 'v'),
                  color: item.authStatus === '3' ? '#212121' : '#fff',
                }"
                >{{ dealvehicleListSubText(item, "text", "v") }}</span
              >
            </div>
            <div class="carMany-list-bottom-item-userinfo" @click.stop>
              <el-dropdown
                trigger="click"
                placement="bottom"
                @command="handleCommand"
              >
                <div>
                  <span v-show="item.driverName" class="name">{{
                    item.driverName
                  }}</span>
                  <span v-show="item.driverName" class="name">{{
                    item.driverPhone
                  }}</span>
                  <span v-show="!item.driverName" class="name">请选择司机</span>
                </div>
                <el-dropdown-menu style="width: 220px" slot="dropdown">
                  <el-dropdown-item
                    class="driver-list"
                    v-for="(sub, i) in driverList"
                    :key="i"
                    :disabled="!isZj && sub.authStatus != '3'"
                    :command="`${sub.driverCode}-${i}-${index}`"
                  >
                    <!-- sub.driverCode+'-'+i+ -->
                    <span>{{ sub.driverName }}</span>
                    <span v-if="isZj">{{ sub.driverPhone }}</span>
                    <span
                      v-else
                      :style="{
                        color: dealvehicleListSubText(sub, 'color', 'd'),
                      }"
                      >{{ dealvehicleListSubText(sub, "text", "d") }}</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </li>
        </ul>
        <el-form-item prop="realFreight">
          <div v-if="isZj && pageData.settlementWay == 1">
            <el-input
              type="number"
              @input="imposeInput($event, 'realFreight')"
              placeholder="请输入内容"
              v-model="form.realFreight"
            >
              <template slot="prepend">应付金额</template>
              <template slot="append">元</template>
            </el-input>
          </div>
          <div v-if="isZj && pageData.settlementWay != 1">
            <el-input
              type="number"
              @input="imposeInput($event, 'realFreight')"
              placeholder="请输入内容"
              v-model="form.realFreight"
            >
              <template slot="prepend">应付单价</template>
              <template slot="append">元 / 吨</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="dispatch-base-confrim">
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { http_request } from "../../../../api";
import { vehicleOwnershipObj } from "../order_config";
export default {
  name: "carMany",
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
  data() {
    return {
      listSearch: null, //搜索值
      vehicleList: [], //车辆列表
      driverList: null, //司机列表
      vehicleOwnershipObj, //静态配置 自有 外援
      haveAppointCarRecordText: "", //已派车文字
      submitData: [],
      form: {
        startDate: null,
        outCarTime: null,
        realFreight: null,
      },
      rules: {
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        outCarTime: [
          { required: true, message: "请选择出车日期", trigger: "change" },
        ],
        realFreight: [
          { required: true, message: "应付金额不能为空", trigger: "blur" },
          { validator: this.plateNo, trigger: "blur" },
        ],
      },
      startPickerOptions: {
        //开始时间过滤
        disabledDate: (time) => {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  computed: {
    outCarMinTime() {
      const tmpTime = new Date();
      const result = this.parseTime(tmpTime, "{h}:{i}:{s}");
      console.log("result", result);
      return `${result} - 23:59:59`;
    },
    checkedVehicle() {
      let result = 0;
      for (const item of this.vehicleList) {
        if (item.checked) {
          result++;
        }
      }
      return result;
    },
    allocationDriver() {
      let result = 0;
      for (const item of this.vehicleList) {
        if (item.driverName) {
          result++;
        }
      }
      return result;
    },
  },
  mounted() {
    console.log("批量出现", this.pageData, this.isZj);
    this.initTimeDate();
    this.listVehicleSelect();
    this.getDriverList();
  },
  methods: {
    //强制限制
    imposeInput(e, value) {
      console.log("强制限制", e);
      const tmp = e.match(/^[0-9]+(\.[0-9]{0,2})?/g) ?? [""];
      console.log("tmp", tmp[0]);
      this.form[value] = tmp[0];
    },
    // 运单校验
    plateNo(rule, value, callback) {
      console.log("打法");
      if (value === undefined || value === null || value === "") {
        callback();
      }
      console.log(
        "Number(value) >= Number(this.pageData.freight)",
        Number(value),
        parseInt(this.pageData.freight)
      );
      if (Number(value) >= parseInt(this.pageData.freight)) {
        let str = "";
        if (this.pageData.settlementWay == 1) {
          str = "应付单价不能超过货物单价";
        } else {
          str = "应付金额不能超过运费总额";
        }
        callback(new Error(str));
      } else {
        callback();
      }
    },
    // 司机下拉菜单
    handleCommand(code) {
      console.log("司机下拉菜单 code", code);
      const key = code.split("-")[0];
      const dirverIndex = Number(code.split("-")[1]);
      const index = Number(code.split("-")[2]);
      console.log("this.driverList[dirverIndex]", this.driverList[dirverIndex]);
      console.log(" this.vehicleList[index]", this.vehicleList[index]);
      this.vehicleList[index].driverName =
        this.driverList[dirverIndex].driverName;
      this.vehicleList[index].driverPhone =
        this.driverList[dirverIndex].driverPhone;
      this.vehicleList[index].driverCode =
        this.driverList[dirverIndex].driverCode;
      this.haveAppointCarRecordHttp(
        this.vehicleList[index].driverCode,
        this.vehicleList[index].vehicleCode,
        index
      );
    },
    // 判断是否派车过
    async haveAppointCarRecordHttp(driverCode, vehicleCode, index) {
      // if (!driverCode) {
      //   this.msgWarning("请选择司机");
      //   this.vehicleList[index].checked = this.$set(vehicleList, index, {
      //   ...this.vehicleList[index],checked: false
      // });
      //   return;
      // }
      if (!this.form.startDate) {
        this.msgWarning("请先选择出车日期");
        return;
      }
      if (vehicleCode && this.dispatchOrderCode) {
        console.log("给我查");
        const params = {
          dispatchOrderCode: this.dispatchOrderCode,
          appointCarDate: this.form.startDate,
          vehicleCode: vehicleCode,
          driverCode: driverCode,
        };
        const obj = {
          moduleName: "http_dispatch",
          method: "get",
          url_alias: "haveAppointCarRecord",
          data: params,
        };
        const res = await http_request(obj);
        console.log("res", res);
        this.vehicleList[index].haveAppointCarRecord =
          res.data.haveAppointCarRecord === 0 ? false : true;
        this.vehicleList[index].haveAppointCarRecordText = res.data.msg;
        this.vehicleList[index].realFreight = res.data.realFreight;
      } else {
        console.log("你来这拉？");
      }
    },
    // 处理认证啥的
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
    // 选择车辆
    checkChanges(val, index) {
      if (val.authStatus != "3") {
        return;
      }
      console.log("checked", val, index);
      const tmp = { ...val };
      const oldTmpCheck = tmp.checked;
      delete tmp.checked;
      console.log("tmp", tmp, oldTmpCheck);
      const vehicleList = this.vehicleList;
      vehicleList[index].checked = this.$set(vehicleList, index, {
        ...tmp,
        checked: !oldTmpCheck,
      });
      console.log("vehicleList", vehicleList);
      if (vehicleList[index].checked && !vehicleList[index].driverCode) {
        // 提醒选司机
        this.msgWarning("请选择司机");
        this.vehicleList[index].checked = this.$set(vehicleList, index, {
          ...tmp,
          checked: false,
        });
        return;
      } else if (vehicleList[index].checked && vehicleList[index].driverCode) {
        this.haveAppointCarRecordHttp(
          vehicleList[index].driverCode,
          vehicleList[index].vehicleCode,
          index
        );
      }
    },

    //初始时间
    initTimeDate() {
      console.log("初始时间");
      this.form.startDate = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.form.outCarTime = this.parseTime(new Date(), "{h}:{i}");
    },
    //获取派车的车辆Select
    async listVehicleSelect() {
      const me = this;
      me.vehicleList = [];
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listVehicleSelect",
        data: { vehicleNumber: this.listSearch },
      };
      const res = await http_request(obj);
      res.data.forEach((el) => {
        const obj = {
          ...el,
          checked: false,
        };
        me.vehicleList.push(obj);
      });
      console.log("车辆列表", me.vehicleList);
    },
    // 司机列表
    getDriverList() {
      const me = this;
      const obj1 = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listTeamDrivers",
      };
      http_request(obj1).then((res) => {
        me.driverList = res.data;
        console.log("司机列表", me.driverList);
      });
    },
    // 提交
    submitForm(formName) {
      console.log("提交表单", this.form);
      const me = this;
      me.$refs[formName].validate((valid) => {
        if (valid) {
          const result = { ...this.form };
          const vehicleDrivers = [];
          for (const item of me.vehicleList) {
            if (item.checked) {
              const obj = {};
              console.log("result item", item);
              obj.vehicleCode = item.vehicleCode;
              obj.driverCode = item.driverCode;
              vehicleDrivers.push(obj);
            }
          }
          result.vehicleDrivers = vehicleDrivers;
          result.dispatchOrderCode = me.dispatchOrderCode;
          result.endDate = me.form.startDate;
          console.log("result", result);
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "appoint_car",
            data: result,
          };
          http_request(obj).then((res) => {
            console.log("res", res.data);
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
  },
};
</script>

<style lang="scss" scoped>
.carMany {
  width: 100%;
  padding: 0px 40px;
}
.carMany-list {
  width: 700px;
  padding: 16px;
  .title {
    display: flex;
    justify-content: space-around;

    font-size: 14px;
    font-family: PingFang SC;
    padding-bottom: 20px;
    &-left {
      &-number {
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
  &-bottom {
    height: 500px;
    overflow: auto;
    padding: 16px;
    position: relative;
    .carMany-list-bottom-item:hover {
      background: #ebeef5;
    }
    &-item {
      position: relative;
      &-tip {
        width: 100%;
        height: 25px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 150;
        background: #fff1e5;
      }
      background: #ffffff;
      padding: 16px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 90px;
      border: 1px solid #e4e7ed;
      border-radius: 5px;
      margin-bottom: 30px;
      // line-height: 50px;
      &-checked {
        display: inline-block;
        padding-right: 20px !important;
      }
      &-vehicleNumber {
        width: 130px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
      }
      .self {
        display: inline-block;
        margin-left: 10px;
        padding: 5px 18px;
        height: 35px;
        min-width: 70px;
        line-height: 25px;
        font-size: 16px;
        color: #212121;
        // line-height: 25px;
        background: #e4e7ed;
        border-radius: 5px;
        font-weight: 700;
      }
      &-userinfo {
        position: absolute;
        right: 40px;
        line-height: 45px;
        height: 45px;
        width: 220px;
        border-radius: 5px;
        background: #f3f6ff;
        text-align: center;
        cursor: pointer;
        -webkit-touch-callout: none;

        -webkit-user-select: none;

        -khtml-user-select: none;

        -moz-user-select: none;

        -ms-user-select: none;

        user-select: none;
        .name {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #3a65ff;
          margin-right: 10px;
        }
      }
    }
    ::v-deep .el-checkbox__inner {
      border-radius: 50%;
      width: 20px;
      height: 20px;
    }
    ::v-deep .el-checkbox__inner::after {
      height: 11px;
      left: 5px;
      width: 5px;
      border: 2px solid #ffffff;
      border-left: 0;
      border-top: 0;
    }
  }
}
.driver-list {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: PingFang SC;
}
.carMany-list-bottom-item-checked-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  height: 25px;
  z-index: 120;
  background: transparent;
}
.carMany-list-bottom-item-tip {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  line-height: 25px;
  color: #ff8422;
  font-family: PingFang SC;
  font-size: 14px;
}
</style>
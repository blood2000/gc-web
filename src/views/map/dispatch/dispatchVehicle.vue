<!-- 派车 -->
<template>
  <div>
    <el-dialog
      class="DispathcVehicle"
      :visible.sync="showDispatchVehicle"
      width="780px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="colse"
    >
      <template slot="title">
        <div>
          <span class="title-label">派车</span>
        </div>
      </template>
      <div class="content-title">
        <titleSideBlueTip />
        <span>运单信息</span>
      </div>
      <div class="content-info">
        <el-row>
          <el-col :span="8">
            <div class="content-info-label">用车企业：</div>
            <div class="content-info-value">建平县融信矿业有限公司</div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">调度单来源：</div>
            <div class="content-info-value">超好运</div>
          </el-col>

          <el-col :span="8">
            <div class="content-info-label">货物类型：</div>
            <div class="content-info-value">金属矿石</div>
          </el-col>
        </el-row>
        <div class="addr">
          <div class="addr-box">
            <div class="addr-icon start">起</div>
            <div>{{ 111 }}</div>
          </div>
          <div class="addr-box">
            <div class="addr-icon end">终</div>
            <div>{{ 222 }}</div>
          </div>
        </div>
      </div>
      <div class="content-title">
        <titleSideBlueTip />
        <span>承运车辆</span>
      </div>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="carForm"
        label-position="top"
      >
        <el-row class="dispatch-base-contents-box" style="padding-top: 20px">
          <el-col :span="8">
            <el-form-item label="开始日期:" prop="startDate">
              <el-date-picker
                v-model="carForm.startDate"
                type="date"
                :picker-options="startPickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期:" prop="endDate">
              <el-date-picker
                v-model="carForm.endDate"
                type="date"
                :picker-options="endPickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="选择结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="出车时间:" prop="outCarTime">
              <el-time-picker
                v-model="carForm.outCarTime"
                value-format="HH:mm"
                placeholder="选择出车时间"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          class="vehicleDrivers-content"
          v-for="(item, index) in carForm.vehicleDrivers"
          :key="item.key"
        >
          <el-form-item
            label="承运车辆:"
            :prop="'vehicleDrivers.' + index + '.vehicleCode'"
            :rules="{
              required: true,
              message: '承运车辆为空',
              trigger: 'change',
            }"
          >
            <el-select
              v-model="item.vehicleCode"
              clearable
              filterable
              @change="vehicleChange($event, index)"
              placeholder="请选择承运车辆"
            >
              <el-option
                v-for="(sub, i) in vehicleList"
                :key="i"
                :label="sub.vehicleNumber"
                :value="sub.vehicleCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="承运司机:"
            :prop="`vehicleDrivers[${index}].driverCode`"
            style="padding-left: 20px"
            :rules="{
              required: true,
              message: '承运司机为空',
              trigger: 'change',
            }"
          >
            <el-select
              v-model="item.driverCode"
              clearable
              filterable
              @change="driverChange($event, index)"
              placeholder="请选择承运司机"
            >
              <el-option
                v-for="(sub, i) in driverList[index]"
                :key="i"
                :label="sub.value"
                :value="sub.key"
              />
            </el-select>
          </el-form-item>
          <div class="edit-icon">
            <el-button
              class="edicon"
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addItem(item, index)"
            ></el-button>
            <el-button
              class="edicon"
              v-show="index !== 0"
              type="danger"
              icon="el-icon-minus"
              circle
              @click="delItem(item, index)"
            ></el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="colse"> 取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http_request } from "@/api";

export default {
  name: "DispathcVehicle",
  data() {
    return {
      vehicleList: [],
      oldkey: [],
      driverList: [],
      carForm: {
        //填写的表单
        startDate: null,
        endDate: null,
        outCarTime: null,
        dispatchOrderCode: null,
        vehicleDrivers: [
          {
            vehicleCode: null,
            driverCode: null,
          },
        ],
      },
      rules: {
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        outCarTime: [
          { required: true, message: "请选择出车日期", trigger: "change" },
        ],
      },
      startPickerOptions: {
        //开始时间过滤
        disabledDate: (time) => {
          if (this.carForm.endDate) {
            return (
              time.getTime() > new Date(this.carForm.endDate).getTime() ||
              time.getTime() <= Date.now() - 24 * 60 * 60 * 1000
            );
          }
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      endPickerOptions: {
        //结束时间过滤
        disabledDate: (time) => {
          if (this.carForm.startDate) {
            console.log(" time.getTime()", time.getTime());
            console.log(
              "  orm.startDate",
              new Date(this.carForm.startDate).getTime()
            );
            return (
              time.getTime() <
              new Date(this.carForm.startDate).getTime() - 24 * 60 * 60 * 1000
            );
          }
        },
      },
    };
  },

  components: {},

  computed: {
    showDispatchVehicle() {
      return this.$store.getters.showDispatchVehicle;
    },
  },

  mounted() {
    console.log("派车");
    this.listVehicleSelect();
  },

  methods: {
    //获取派车的车辆Select
    async listVehicleSelect() {
      const me = this;
      me.driverList = [];
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "list_vehicle_select",
      };
      const res = await http_request(obj);
      console.log("获取派车的车辆Select", res);
      me.vehicleList = res.data;
    },
    //查找车辆默认司机
    searchDefaultDriverCode(vkey, index) {
      const me = this;
      let Dcode = null;
      //找到
      for (const item of me.vehicleList) {
        if (item.vehicleCode == vkey) {
          Dcode = item.driverCode;
        }
      }
      //排重
      this.driverChange(Dcode, index);
      console.log("Dcode", Dcode);
      return Dcode;
    },
    // 车辆变化
    vehicleChange(e, index) {
      const me = this;
      console.log("e=%s,index=%d", e, index);
      if (me.oldkey[index] !== e || !e) {
        console.log("车辆选择发生变化", me.vehicleList[index]);
        me.driverList[index] = [];
        me.carForm.vehicleDrivers[index].driverCode = null;
      }
      //获取司机列表
      if (e && me.oldkey[index] !== e) {
        console.log("车辆选择发生变化,而后开始获取数据");
        const obj1 = {
          moduleName: "http_dispatch",
          method: "get",
          url_alias: "by_vehicle_code",
          url_code: [e],
        };
        http_request(obj1).then((res) => {
          console.log("获取司机列表 res", res.data);
          me.$set(me.driverList, index, res.data);
          me.carForm.vehicleDrivers[index].driverCode = me.searchDefaultDriverCode(
            e,
            index
          );
          console.log(
            me.driverList,
            me.carForm.vehicleDrivers[index].driverCode
          );
          me.oldkey[index] = e;
        });
      }
      //检查是否重复
      const checkList = me.carForm.vehicleDrivers;
      let resultIndex = -1;
      for (let i = 0; i < me.carForm.vehicleDrivers.length; i++) {
        const item = checkList[i];
        if (item.vehicleCode === e && index !== i) resultIndex = i;
      }
      if (resultIndex > -1) {
        //互拆清空
        me.carForm.vehicleDrivers[resultIndex].vehicleCode = null;
        me.carForm.vehicleDrivers[resultIndex].driverCode = null;
        me.$set(me.driverList, resultIndex, []);
        me.oldkey[resultIndex] = "";
        console.log(
          "检查是否重复  me.driverList=",
          me.driverList,
          "me.oldkey=",
          me.oldkey,
          "resultIndex=",
          resultIndex
        );
      }
    },
    //司机排重
    driverChange(e, index) {
      const me = this;
      let resultIndex = -1;
      const checkList = me.carForm.vehicleDrivers;
      for (let i = 0; i < me.carForm.vehicleDrivers.length; i++) {
        const item = checkList[i];
        if (item.driverCode === e && index !== i) resultIndex = i;
      }
      if (resultIndex > -1) {
        me.carForm.vehicleDrivers[resultIndex].driverCode = null;
      }
    },
    //添加
    addItem(item, index) {
      this.carForm.vehicleDrivers.splice(index + 1, 0, {
        vehicleCode: null,
        driverCode: null,
      });
    },
    //删除
    delItem(item, index) {
      this.$set(this.driverList, index, []);
      var index = this.carForm.vehicleDrivers.indexOf(item);
      if (index !== -1) {
        this.carForm.vehicleDrivers.splice(index, 1);
      }
    },
    //提交表单
    submitForm() {
      console.log("提交表单", this.carForm);
      const me = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "appoint_car",
            data: me.carForm,
          };
          http_request(obj).then((res) => {
            if (res.code == 200) {
                this.$router.push("/dispatch/order");
                this.$store.commit('set_isFresh', true);
                this.colse();
            }
          });
        } else {
          return false;
        }
      });
    },
    colse() {
      //重置
      this.$refs["ruleForm"].resetFields();
      this.$store.commit('set_isFresh', true);
      this.$store.commit("set_dispatchVehicle", false);
    },
  },
};
</script>
<style lang='scss' scoped>
.title-label {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #3d4050;
}

.DispathcVehicle /deep/ .el-dialog__header {
  padding: 20px 20px 0 20px !important;
  border-bottom: none !important;
  background-image: none !important;
}
.content-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  line-height: 40px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}
.content-info {
  padding: 20px;
}
.content-info-label {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #a1a1a1;
}
.content-info-value {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #3d4050;
}
.info-header {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.addr {
  padding-top: 20px;
}

.addr-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .addr-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    border-radius: 3px;
    text-align: center;
    line-height: 18px;
    color: #fff;
    font-size: 12px;
  }
  .start {
    position: relative;
    background: #ffbc00;
  }
  .start::after {
    content: "";
    position: absolute;
    top: 19px;
    left: 8px;
    width: 0px;
    height: 14px;
    border: 1px solid #c7cbd2;
  }
  .end {
    background: #4682fa;
  }
}
.vehicleDrivers-content {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
}
.edit-icon {
  padding-left: 20px;
  .edicon {
    position: relative;
    top: 45px;
  }
}
.edit-icon i {
  padding-right: 20px;
}
.title-item {
  font-size: 18px;
  font-weight: 700;
  margin: 10px;
}
</style>
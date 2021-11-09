<template>
  <!-- 派车填写表单 -->
  <el-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    label-width="90px"
    label-position="top"
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
        <el-form-item label="结束日期:" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
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
            v-model="form.outCarTime"
            value-format="HH:mm"
            placeholder="选择出车时间"
          >
          </el-time-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="10" style="padding-left: 20px">
          <el-col :span="8">
            <el-form-item label="承运数量:" prop="companyName">
              <el-input
                v-model="pageData.companyName"
                clearable
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
    <div
      class="dispatch-base-contents-big vehicleDrivers-content"
      v-for="(item, index) in form.vehicleDrivers"
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
          style="width: 240px"
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
        style="padding-left: 20px; position: relative"
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
          style="width: 240px"
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
        <div v-if="isMutual(index)" class="ab-mutual">
          {{ `${driverMutual} 已经被分配到【${vehicleMutual}】车辆中` }}
        </div>
      </el-form-item>
      <div class="edit-icon">
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
          @click="addItem(item, index)"
        ></el-button>
        <el-button
          v-show="index !== 0"
          type="danger"
          icon="el-icon-minus"
          circle
          @click="delItem(item, index)"
        ></el-button>
      </div>
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
  },
  watch: {
    carDrawer() {
      if (this.carDrawer) {
        console.log("批次派车究竟是");
        this.form.dispatchOrderCode = this.dispatchOrderCode;
        this.initTimeDate();
        this.listVehicleSelect();
      }
    },
  },
  data() {
    return {
      vehicleList: [],
      driverList: [],
      vehicleMutual: null,
      oldkey: [],
      driverMutual: null,
      indexMutual: -1,
      form: {
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
          if (this.form.endDate) {
            return (
              time.getTime() > new Date(this.form.endDate).getTime() ||
              time.getTime() <= Date.now() - 24 * 60 * 60 * 1000
            );
          }
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      endPickerOptions: {
        //结束时间过滤
        disabledDate: (time) => {
          if (this.form.startDate) {
            console.log(" time.getTime()", time.getTime());
            console.log(
              "  orm.startDate",
              new Date(this.form.startDate).getTime()
            );
            return (
              time.getTime() <
              new Date(this.form.startDate).getTime() - 24 * 60 * 60 * 1000
            );
          }
        },
      },
    };
  },
  methods: {
    //添加
    addItem(item, index) {
      this.form.vehicleDrivers.splice(index + 1, 0, {
        vehicleCode: null,
        driverCode: null,
      });
    },
    //删除
    delItem(item, index) {
      this.$set(this.driverList, index, []);
      var index = this.form.vehicleDrivers.indexOf(item);
      if (index !== -1) {
        this.form.vehicleDrivers.splice(index, 1);
      }
    },
    // 车辆变化
    vehicleChange(e, index) {
      const me = this;
      console.log("e=%s,index=%d", e, index);
      if (me.oldkey[index] !== e || !e) {
        console.log("车辆选择发生变化", me.vehicleList[index]);
        me.driverList[index] = [];
        me.form.vehicleDrivers[index].driverCode = null;
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
          console.log("赋值结束 me.driverList", me.driverList);
          me.form.vehicleDrivers[index].driverCode = me.searchDefaultDriverCode(
            e,
            index
          );
          console.log(me.driverList, me.form.vehicleDrivers[index].driverCode);
          me.oldkey[index] = e;
        });
      }
      //检查车辆是否重复
      const checkList = me.form.vehicleDrivers;
      let resultIndex = -1;
      for (let i = 0; i < me.form.vehicleDrivers.length; i++) {
        const item = checkList[i];
        if (item.vehicleCode === e && index !== i) resultIndex = i;
      }
      if (resultIndex > -1) {
        //互拆清空
        me.form.vehicleDrivers[resultIndex].vehicleCode = null;
        me.form.vehicleDrivers[resultIndex].driverCode = null;
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
      const checkList = me.form.vehicleDrivers;
      for (let i = 0; i < me.form.vehicleDrivers.length; i++) {
        const item = checkList[i];
        if (item.driverCode === e && index !== i) resultIndex = i;
      }
      if (resultIndex > -1) {
        this.driverList[index].forEach((el) => {
          console.log("el===>", el.key);
          if (me.form.vehicleDrivers[resultIndex].driverCode == el.key) {
            this.driverMutual = el.value;
          }
        });
        this.vehicleList.forEach((el) => {
          if (me.form.vehicleDrivers[index].vehicleCode == el.vehicleCode) {
            this.vehicleMutual = el.vehicleNumber;
          }
        });
        console.log(
          "resultIndex",
          resultIndex,
          this.driverMutual,
          this.vehicleMutual
        );
        this.indexMutual = resultIndex;
        me.form.vehicleDrivers[resultIndex].driverCode = null;
      }
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
    initTimeDate() {
      this.form.startDate = this.form.endDate = this.parseTime(
        new Date(),
        "{y}-{m}-{d}"
      );
      this.form.outCarTime = this.parseTime(new Date(), "{h}:{i}");
    },
    isMutual(index) {
      if (!this.driverMutual || !this.vehicleMutual) return false;
      if (index != this.indexMutual) return false;
      if (this.form.vehicleDrivers[index].driverCode) return false;
      return true;
    },
    //提交表单
    submitForm(formName) {
      console.log("提交表单", this.form);
      const me = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "appoint_car",
            data: me.form,
          };
          http_request(obj).then((res) => {
            if (res.code == 200) {
              this.$confirm(res.msg, "提示", {
                confirmButtonText: "确定",
                type: "success",
              }).then(() => {
                this.$router.push("/dispatch/order");
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
.vehicleDrivers-content {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
}
.edit-icon {
  padding-left: 20px;
  line-height: 125px;
}
.edit-icon i {
  padding-right: 20px;
}
.ab-mutual {
  position: absolute;
  top: 46px;
  left: 0;
  font-size: 12px;
  color: #ff4949;
  font-family: PingFang SC;
}
</style>
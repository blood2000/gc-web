 <template>
  <div class="app-container">
    <div class="dispatch-order-info">
      <TitleSideBlueTip title="订单信息" />
      <div class="dispatch-order-content">
        <el-form
          :disabled="true"
          ref="pageData"
          :model="pageData"
          label-width="120px"
          label-position="left"
        >
          <el-row :gutter="10" class="dispatch-base-contents-box">
            <el-col :span="8">
              <el-form-item label="用车企业:" prop="companyName">
                <el-input
                  v-model="pageData.companyName"
                  clearable
                  style="width: 220px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单客户姓名:" prop="shipmentName">
                <el-input
                  v-model="pageData.shipmentName"
                  clearable
                  style="width: 220px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单客户电话:" prop="shipmentPhone ">
                <el-input
                  v-model="pageData.shipmentPhone"
                  clearable
                  style="width: 220px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="dispatch-base-contents-box">
            <el-col :span="8">
              <el-form-item label="货物类型:" prop="goodsTypeName">
                <el-input
                  v-model="pageData.goodsTypeName"
                  clearable
                  style="width: 220px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费单价:" prop="freightStr">
                <el-input
                  v-model="pageData.freightStr"
                  clearable
                  style="width: 220px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <div class="dispatch-title-item">出发地信息</div>

            <div class="dispatch-info-content">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="省 / 市 / 区:" prop="loadAddress">
                    <el-input
                      v-model="pageData.loadAddress"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="详细地址:" prop="loadDetail">
                    <el-input
                      v-model="pageData.loadDetail"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="地址别名:" prop="loadAlias">
                    <el-input
                      v-model="pageData.loadAlias"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="联系人:" prop="loadLinkManName">
                    <el-input
                      v-model="pageData.loadLinkManName"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系人电话:" prop="loadLinkManPhone">
                    <el-input
                      v-model="pageData.loadLinkManPhone"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div>
            <div class="title-item">目的地信息</div>

            <div class="dispatch-info-content">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="省 / 市 / 区:" prop="unloadAddress">
                    <el-input
                      v-model="pageData.unloadAddress"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="详细地址:" prop="unloadDetail">
                    <el-input
                      v-model="pageData.unloadDetail"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="地址别名:" prop="unloadAlias">
                    <el-input
                      v-model="pageData.unloadAlias"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="联系人:" prop="unloadLinkManName">
                    <el-input
                      v-model="pageData.unloadLinkManName"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系人电话:" prop="unloadLinkManPhone">
                    <el-input
                      v-model="pageData.unloadLinkManPhone"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="dispatch-order-info">
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="form"
        label-width="90px"
        label-position="left"
      >
        <el-row class="dispatch-base-contents-box" style="padding-top: 20px">
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
        </el-row>
        <el-row class="dispatch-base-contents-box">
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
        <TitleSideBlueTip title="承运车辆" />
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
          class="vehicleDrivers-content"
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
              @change="vehicleChange($event, index, 0)"
              placeholder="请选择承运车辆"
            >
              <el-option
                v-for="(sub, i) in vehicleList"
                :key="i"
                :label="sub.value"
                :value="sub.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="承运司机:"
            :prop="'vehicleDrivers.' + index + '.driverCode'"
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
              @change="vehicleChange($event, index, 1)"
              placeholder="请选择承运司机"
            >
              <el-option
                v-for="(sub, i) in driverList"
                :key="i"
                :label="sub.value"
                :value="sub.key"
              />
            </el-select>
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
              @click="delItem(item)"
            ></el-button>
          </div>
        </div>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { http_request } from "../../../api";

export default {
  name: "car",
  components: {},
  data() {
    return {
      pageData: {
        companyName: null,
        shipmentName: null,
        shipmentPhone: null,
        goodsTypeName: null,
        freightStr: null,
        loadAddress: null, //装货省	  装货市	  装货区
        loadDetail: null, //装货地址详情
        loadAlias: null, //装货地址别名
        loadLinkManName: null, //装货联系人
        loadLinkManPhone: null, //装货联系人电话
        unloadAddress: null, //卸货省	 卸货市	 卸货区
        unloadDetail: null, //卸货详细地址
        unloadAlias: null, //卸货别名
        unloadLinkManName: null, //卸货联系人
        unloadLinkManPhone: null, //卸货联系人电话
      },
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
      vehicleList: [],
      driverList: [],
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
            return time.getTime() <= new Date(this.form.startDate).getTime();
          }
        },
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
    };
  },
  created() {},
  mounted() {
    if (document.location.search.includes("code")) {
      this.form.dispatchOrderCode = document.location.search.split("=")[1];
    }
    this.getDetail();
    this.listVehicleSelect();
  },
  methods: {
    // 车辆变化
    vehicleChange(e, index, type) {
      //检查是否重复
      const checkList = this.form.vehicleDrivers;
      let resultIndex = -1;
      for (let i = 0; i < index; i++) {
        const item = checkList[i];
        if (type == 0) {
          if (item.vehicleCode === e) resultIndex = i;
        } else {
          if (item.driverCode === e) resultIndex = i;
        }
      }
      if (resultIndex > -1) {
        if (type == 0) this.form.vehicleDrivers[resultIndex].vehicleCode = null;
        if (type == 1) this.form.vehicleDrivers[resultIndex].driverCode = null;
      }
    },
    //添加
    addItem(item, index) {
      this.form.vehicleDrivers.splice(index + 1, 0, {
        vehicleCode: null,
        vehicleLabel: null,
        driverCode: null,
        driverLabel: null,
      });
    },
    //删除
    delItem(item) {
      var index = this.form.vehicleDrivers.indexOf(item);
      if (index !== -1) {
        this.form.vehicleDrivers.splice(index, 1);
      }
    },
    //获取派车的车辆Select
    async listVehicleSelect() {
      const me = this;
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "list_vehicle_select",
      };
      const res = await http_request(obj);
      me.vehicleList = res.data;
      const list = await Promise.all(
        me.vehicleList.map((val) => {
          const obj1 = {
            moduleName: "http_dispatch",
            method: "get",
            url_alias: "by_vehicle_code",
            url_code: [val.key],
          };
          return http_request(obj1);
        })
      );
      for (const item of list) {
        if (item.code == "200" && item.data.length > 0) {
          me.driverList.push(...item.data);
        }
      }
    },
    //获取详情
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_dispatch",
        url_code: [this.form.dispatchOrderCode],
      };
      const res = await http_request(obj);
      // this.pageData = res.data;
      this.DetailToPageData(res.data);
    },
    submitForm(formName) {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //详情绑定页面
    DetailToPageData(data) {
      this.pageData = {
        companyName: data.companyName,
        shipmentName: data.shipmentName,
        shipmentPhone: data.shipmentPhone,
        goodsTypeName: data.goodsTypeName,
        freightStr: data.orderGoodses[0].freightStr,
        loadAddress: `${data.orderAddress.loadProvince}${data.orderAddress.loadCity}${data.orderAddress.loadDistrict}`,
        loadDetail: data.orderAddress.loadDetail,
        loadAlias: data.orderAddress.loadAlias,
        loadLinkManName: data.orderAddress.loadLinkManName,
        loadLinkManPhone: data.orderAddress.loadLinkManPhone,
        unloadAddress: `${data.orderAddress.unloadProvince}${data.orderAddress.unloadCity}${data.orderAddress.unloadDistrict}`,
        unloadDetail: data.orderAddress.unloadDetail,
        unloadAlias: data.orderAddress.unloadAlias,
        unloadLinkManName: data.orderAddress.unloadLinkManName,
        unloadLinkManPhone: data.orderAddress.unloadLinkManPhone,
      };
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
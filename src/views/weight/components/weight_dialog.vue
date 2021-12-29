<template>
  <el-dialog
    :title="options.title"
    :visible.sync="open"
    width="688px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      ref="form"
      :rules="formRules"
      :model="form"
      label-width="120px"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="磅单日期：" prop="recordDate">
            <el-date-picker
              v-model="form.recordDate"
              clearable
              type="date"
              size="small"
              style="width: 297px"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              @change="changeDatePicker"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button-group class="btn-date-group">
            <el-button type="text" class="btn-date" @click="handleBtn(0)"
              >前日</el-button
            >
            <el-button type="text" class="btn-date" @click="handleBtn(1)"
              >今日</el-button
            >
            <el-button type="text" class="btn-date" @click="handleBtn(2)"
              >昨日</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-form-item label="车牌号码：" prop="vehicleCode">
            <el-select
              v-model="form.vehicleCode"
              clearable
              filterable
              @change="change($event, 'vehicleCode')"
              style="width: 204px"
              placeholder="请选择车辆"
            >
              <el-option
                v-for="(sub, i) in vehicleList"
                :key="i"
                :label="sub.vehicleNumber"
                :value="sub.vehicleCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机：" prop="driverCode">
            <el-select
              v-model="form.driverCode"
              clearable
              filterable
              @change="change($event, 'driverCode')"
              style="width: 204px"
              placeholder="请选择司机"
            >
              <el-option
                v-for="(sub, i) in driverList"
                :key="i"
                :label="sub.driverName"
                :value="sub.driverCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div
        class="weight"
        v-for="(item, index) in form.recordForms"
        :key="index"
      >
        <div class="weight-header">
          <div class="weight-number">{{ index + 1 }}</div>
          <div class="weight-text">磅单信息</div>
          <img
            @click="handleFold(index)"
            class="fold"
            :class="item.fold ? 'fold-up' : 'fold-down'"
            src="../../../assets/images/bang/up.png"
            alt=""
          />
        </div>
        <div class="weight-info" :class="item.fold ? 'fold-hidden' : ''">
          <el-form-item
            class="info-routeLoad"
            label="用车企业及路线："
            :prop="'recordForms.' + index + '.routeCode'"
          >
            <div class="route" v-if="!item.routeCode" @click="openRoute(index)">
              <img src="../../../assets/images/bang/routerLoad.png" alt="" />
              <span class="route-text">点击选择</span>
            </div>
            <div v-else class="routeBg">
              <div>
                <img
                  class="address-img"
                  src="../../../assets/images/bang/address.png"
                  alt=""
                />
                <span class="shipmentName">
                  {{ routeData && routeData.companyName }}
                </span>
              </div>
              <div>
                <div class="icon-base icon-base-start">起</div>
                <div class="address-title">
                  {{ routeData && routeData.startRoute }}
                </div>
                <img
                  class="to-img"
                  src="../../../assets/images/bang/to.png"
                  alt=""
                />
                <div class="icon-base icon-base-end">终</div>
                <div class="address-title">
                  {{ routeData && routeData.endRoute }}
                </div>
              </div>
              <div class="x" @click="delXRouteData(index)">
                <img src="../../../assets/images/bang/x.png" alt="" />
              </div>
            </div>
            <div
              class="img-error-red"
              v-if="!form.recordForms[index].routeCode && hasUpRoute[index]"
            >
              请选择路线
            </div>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="货品类型："
                :prop="'recordForms.' + index + '.goodsCode'"
                :rules="{
                  required: true,
                  message: '货品类型不能为空',
                  trigger: 'change',
                }"
              >
                <el-cascader
                  clearable
                  filterable
                  v-model="item.goodsCode"
                  @change="cascaderChange($event, index)"
                  :options="goodsList"
                  style="width: 256px"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="运费单价："
                :prop="'recordForms.' + index + '.goodsFreightPrice'"
                :rules="{
                  required: true,
                  message: '运费单价不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  style="width: 256px"
                  v-model="item.goodsFreightPrice"
                  placeholder="请输入"
                  clearable
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="司机运费："
                :prop="'recordForms.' + index + '.driverFreightPrice'"
                :rules="{
                  required: true,
                  message: '司机运费不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.driverFreightPrice"
                  style="width: 256px"
                  placeholder="请输入"
                  clearable
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="司机附加费："
                :prop="'recordForms.' + index + '.driverSurchargePrice'"
                :rules="{
                  required: true,
                  message: '司机附加费不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.driverSurchargePrice"
                  style="width: 256px"
                  placeholder="请输入运费单价"
                  clearable
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="结算总额：">
                <el-input
                  :disabled="true"
                  :value="dealPrice(index)"
                  style="width: 256px"
                  placeholder="0.0"
                  clearable
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div class="price">结算总额 = 司机运费 + 司机附加费</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="装货点净重："
                :prop="'recordForms.' + index + '.loadingNetWeight'"
                :rules="{
                  required: true,
                  message: '装货点净重不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.loadingNetWeight"
                  style="width: 256px"
                  placeholder="请输入"
                  clearable
                >
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="卸货点净重："
                :prop="'recordForms.' + index + '.unloadingNetWeight'"
                :rules="{
                  required: true,
                  message: '卸货点净重不能为空',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.unloadingNetWeight"
                  style="width: 256px"
                  placeholder="请输入"
                  clearable
                >
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="voucher-box">
            <el-form-item
              label="凭证信息："
              :prop="'recordForms.' + index + '.voucherImageUrls'"
            >
              <div class="img-box">
                <template
                  v-if="form.recordForms[index].voucherImageUrls.length !== 0"
                >
                  <div
                    class="img-list"
                    v-for="item in form.recordForms[index].voucherImageUrls"
                    :key="item.name"
                  >
                    <img :src="item.url" alt="" />
                    <div class="x" @click="delImage(index)">
                      <img src="../../../assets/images/bang/x.png" alt="" />
                    </div>
                  </div>
                </template>

                <VoucherImageUpload
                  :class="voucherImgList(index)"
                  v-model="form.recordForms[index].voucherImageUrls"
                  :limit="9"
                ></VoucherImageUpload>
              </div>
              <div
                class="img-error-red"
                v-if="
                  form.recordForms[index].voucherImageUrls.length === 0 &&
                  hasUpImage[index]
                "
              >
                请上传图片
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div
      slot="footer"
      style="height: 64px"
      class="dialog-footer flex-end-layout"
    >
      <div class="weight-edit" v-if="options && !options.editType">
        <div
          @click="addWeight"
          class="weight-edit-item"
          style="margin-right: 32px"
        >
        <!-- cursor: pointer; -->
          <img src="../../../assets/images/bang/add.png" alt="" />

          <span> 新增一单</span>
        </div>
        <div @click="againWeight" class="weight-edit-item">
          <img src="../../../assets/images/bang/copy.png" alt="" />

          <span>相同路线再来一单</span>
        </div>
      </div>
      <div class="group-btn">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">
          确 定
        </el-button>
      </div>
    </div>
    <RouteDialog
      :routeShow="routeShow"
      @closeRoutersDialog="closeRoutersDialog"
      @getRouteLineData="getRouteLineData"
    />
  </el-dialog>
</template>

<script>
import { http_request } from "../../../api";
import VoucherImageUpload from "../../../components/ImageUpload/voucherUpload.vue";
import RouteDialog from "./route_dialog.vue";
export default {
  components: { VoucherImageUpload, RouteDialog },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: {},
    },
  },
  watch: {
    open: {
      handler() {
        if (this.open) {
          console.log("ckc open", this.options);
          if (this.options.editType) {
            this.getDetail();
          }
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      driverList: [], //司机列表
      vehicleList: [], //车辆列表
      hasUpImage: [false],
      hasUpRoute: [false],
      routeShow: false,
      routeData: null,
      currIndex: null,
      form: {
        recordDate: null, //磅单日期
        vehicleCode: null, //车辆Code
        driverCode: null, //司机Code
        recordForms: [
          {
            fold: false,
            goodsCode: null, //货品Code
            shipmentCode: null, //企业Code
            routeCode: null, //路线Code
            goodsFreightPrice: null, //货品运费单价
            driverFreightPrice: null, //司机运费
            driverSurchargePrice: null, //司机额外收取
            loadingNetWeight: null, //装货净重
            unloadingNetWeight: null, //卸货净重
            voucherImageUrls: [], //凭证
          },
        ],
      },
      formRules: {
        recordDate: [
          {
            required: true,
            message: "磅单日期不能为空",
            trigger: "change",
          },
        ],
        vehicleCode: [
          {
            required: true,
            message: "车牌号不能为空",
            trigger: "change",
          },
        ],
        driverCode: [
          {
            required: true,
            message: "司机不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getDriverList();
    this.getVehicleList();
  },
  computed: {
    goodsList() {
      return this.$store.state.dict.goodsTypeList;
    },
  },
  methods: {
    init() {
      this.loading = false;
      this.hasUpImage = [false];
      this.hasUpRoute = [false];
      this.routeShow = false;
      (this.routeData = null), (this.currIndex = null);
      this.form = {
        recordDate: null, //磅单日期
        vehicleCode: null, //车辆Code
        driverCode: null, //司机Code
        recordForms: [
          {
            fold: false,
            goodsCode: null, //货品Code
            shipmentCode: null, //企业Code
            routeCode: null, //路线Code
            goodsFreightPrice: null, //货品运费单价
            driverFreightPrice: null, //司机运费
            driverSurchargePrice: null, //司机额外收取
            loadingNetWeight: null, //装货净重
            unloadingNetWeight: null, //卸货净重
            voucherImageUrls: [], //凭证
          },
        ],
      };
      this.resetForm("form");
    },
    async getDetail() {
      const obj = {
        moduleName: "http_weight",
        method: "get",
        url_alias: "detailWeighbridge",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail res", res);
      this.detailToForm(res.data);
    },
    detailToForm(data) {
      console.log("data===", data);
      this.routeData = {
        endRoute: data.endRoute,
        startRoute: data.startRoute,
        companyName: data.companyName,
      };
      this.form = {
        recordDate: data.recordDate, //磅单日期
        vehicleCode: data.vehicleCode, //车辆Code
        driverCode: data.driverCode, //司机Code
        recordForms: [
          {
            fold: false,
            goodsCode: data.goodsCode, //货品Code
            shipmentCode: data.shipmentCode, //企业Code
            routeCode: data.routeCode, //路线Code
            goodsFreightPrice: data.goodsFreightPrice, //货品运费单价
            driverFreightPrice: data.driverFreightPrice, //司机运费
            driverSurchargePrice: data.driverSurchargePrice, //司机额外收取
            loadingNetWeight: data.loadingNetWeight, //装货净重
            unloadingNetWeight: data.unloadingNetWeight, //卸货净重
            voucherImageUrls: this.getImageUrl(data.voucherImageUrls), //凭证
          },
        ],
      };
    },
    getImageUrl(str) {
      console.log("str", str);
      const tmp = str.split(",");
      console.log("tmp", tmp);
      const result = [];
      for (const item of tmp) {
        const obj = {
          url: item,
          name: item,
        };
        result.push(obj);
      }

      return result;
    },
    voucherImgList(index) {
      console.log(
        "this.form.recordForms[index].voucherImageUrls.length",
        this.form.recordForms[index].voucherImageUrls.length
      );
      if (this.form.recordForms[index].voucherImageUrls.length > 0) {
        this.hasUpImage[index] = true;
      }
    },
    delXRouteData(index) {
      this.routeData = null;
      this.currIndex = null;
      this.form.recordForms[index].routeCode = null;
      this.form.recordForms[index].shipmentCode = null;
    },
    openRoute(index) {
      this.routeShow = true;
      this.currIndex = index;
    },
    getRouteLineData(obj) {
      console.log("obj", obj);
      this.form.recordForms[this.currIndex].shipmentCode =
        obj.routeData.shipmentCode;
      this.form.recordForms[this.currIndex].routeCode = obj.lineData.routeCode;
      this.routeData = { ...obj.routeData, ...obj.lineData };
      this.hasUpRoute[this.currIndex] = true;
      console.log("routeData", this.routeData);
    },
    addWeight() {
      this.form.recordForms.push({
        goodsCode: null, //货品Code
        shipmentCode: null, //企业Code
        routeCode: null, //路线Code
        goodsFreightPrice: null, //货品运费单价
        driverFreightPrice: null, //司机运费
        driverSurchargePrice: null, //司机额外收取
        loadingNetWeight: null, //装货净重
        unloadingNetWeight: null, //卸货净重
        voucherImageUrls: [], //凭证
        fold: false,
      });
      this.hasUpImage.push(false);
      this.hasUpRoute.push(false);
    },
    againWeight() {
      console.log(this.form.recordForms[this.form.recordForms.length - 1]);
      this.hasUpImage.push(false);
      this.hasUpRoute.push(false);
      this.form.recordForms.push({
        ...this.form.recordForms[this.form.recordForms.length - 1],
      });
    },
    handleFold(index) {
      console.log("index", index);
      this.form.recordForms[index].fold = !this.form.recordForms[index].fold;
      console.log("this.form.recordForms[index].fold", this.form.recordForms);
    },
    delImage(index) {
      const tmp = this.form.recordForms[index].voucherImageUrls.splice(
        index,
        1
      );
      console.log("index", index, tmp);
    },
    dealPrice(index) {
      if (
        this.form.recordForms[index].driverSurchargePrice &&
        this.form.recordForms[index].driverFreightPrice
      ) {
        const val1 = parseFloat(
          this.form.recordForms[index].driverSurchargePrice
        );
        const val2 = parseFloat(
          this.form.recordForms[index].driverFreightPrice
        );
        return val1 + val2;
      } else {
        return "";
      }
    },
    cascaderChange(e, index) {
      console.log("index", index, e, this.form.recordForms);
      if (!e) {
        this.form.recordForms[index].goodsCode = null;
        return;
      }
      this.form.recordForms[index].goodsCode =
        this.form.recordForms[index].goodsCode[1];
    },
    getDriverList() {
      const me = this;
      const obj1 = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listTeamDrivers",
      };
      http_request(obj1).then((res) => {
        console.log("getDriverList res", res);
        me.driverList = res.data;
      });
    },
    getVehicleList() {
      const me = this;
      me.vehicleList = [];
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listVehicleSelect",
        data: {},
      };
      http_request(obj).then((res) => {
        console.log("getVehicleList res", res);
        me.vehicleList = res.data;
      });
    },
    change(e, key) {
      console.log(e, key);
    },

    changeDatePicker() {},
    handleBtn(index) {
      const obj = {
        0: () => {
          console.log(0);
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
          this.form.recordDate = start;
        },
        1: () => {
          const start = new Date();
          start.setTime(start.getTime());
          this.form.recordDate = start;
        },
        2: () => {
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
          this.form.recordDate = start;
        },
      };
      obj[index]();
    },
    checkForm() {
      for (let i = 0; i < this.hasUpImage.length; i++) {
        this.$set(this.hasUpImage, i, true);
      }
      for (let i = 0; i < this.hasUpRoute.length; i++) {
        this.$set(this.hasUpRoute, i, true);
      }
      console.log(
        "this.hasUpImage:",
        this.hasUpImage,
        "this.hasUpRoute",
        this.hasUpRoute
      );

      // 转化
      const body = JSON.parse(JSON.stringify(this.form));
      body.recordForms.forEach((element) => {
        console.log("element", element);
        delete element.fold;
        if (element.voucherImageUrls.length > 0) {
          let temp = "";
          element.voucherImageUrls.forEach((el) => {
            temp += el.url + ",";
          });
          temp = temp.substr(0, temp.length - 1);
          console.log("temp", temp);
          element.voucherImageUrls = temp;
        }
      });
      return body;
    },
    arrToStr(body) {},
    submitForm() {
      const me = this;
      const bodys = this.checkForm();
      me.$refs["form"].validate((valid) => {
        if (valid) {
          me.loading = true;
          console.log("bodys 参数", bodys);
          if (this.options.editType) {
            bodys.code = this.code
               const obj = {
              moduleName: "http_weight",
              method: "post",
              url_alias: "updateWeighBridgeRecord",
              data: bodys,
            };
             http_request(obj)
              .then((res) => {
              console.log("编辑返回", res);
                me.loading = false;
                if (res.code != 200) {
                  return this.msgError("编辑失败");
                } else {
                  this.$emit("closeDialog", "ok");
                }
              })
              .catch(() => {
                me.loading = false;
              });
          } else {
            const obj = {
              moduleName: "http_weight",
              method: "post",
              url_alias: "addWeighBridgeRecord",
              data: bodys,
            };
            http_request(obj)
              .then((res) => {
                console.log("添加返回", res);
                me.loading = false;
                if (res.code != 200) {
                  return this.msgError("添加失败");
                } else {
                  this.$emit("closeDialog", "ok");
                }
              })
              .catch(() => {
                me.loading = false;
              });
          }
        }
      });
    },
    cancel() {
      this.init();
      this.$emit("closeDialog", "no");
    },
    closeRoutersDialog() {
      this.routeShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  min-height: calc(90vh - 62px - 66px);
  padding-right: 10px;
}
// ::v-deep .el-dialog__body::-webkit-scrollbar {
//   width: 0 !important;
// }
.btn-date-group {
  padding-top: 35px;
  .btn-date {
    color: rgba(70, 130, 250, 1) !important;
    margin-right: 22px;
    
  }
}
.weight-header {
  display: flex;
  align-items: center;
  position: relative;
  .weight-number {
    width: 18px;
    height: 18px;
    background: rgba(70, 130, 250, 0.36);
    border-radius: 50%;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #4682fa;
    text-align: center;
    line-height: 18px;
    margin-right: 12px;
  }
  .weight-text {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3d4050;
  }
}
.weight-info {
  margin-top: 6px;
  width: 100%;
  background: #f8f8f8;
  opacity: 1;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 28px 20px 28px 19px;
  height: 690px;
  transition: all 0.5s;
  overflow: hidden;
  position: relative;
  .info-routeLoad {
    position: relative;
    /deep/.el-form-item__label:before {
      content: "*";
      color: #ff4949;
      margin-right: 4px;
    }
  }
}
.fold-hidden {
  height: 0;
  padding: 0 28px 0 28px;
}
.route {
  width: 131px;
  height: 67px;
  border: 1px dashed #bebebe;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > img {
    width: 30px;
    height: 30px;
  }
  &-text {
    margin-top: -10px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #bebebe;
  }
}

.voucher-box {
  position: relative;
  /deep/.el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}

.price {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #959aa4;
  opacity: 1;
  position: relative;
  top: 45px;
}
.img-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.img-list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin: 0 19px 19px 0;
  & > img {
    width: 131px;
    height: 88px;
  }
  & > .x {
    position: absolute;
    right: -17px;
    top: -11px;
    width: 35px;
    height: 35px;
    line-height: 25px;
    text-align: center;
    & > img {
      width: 25px;
      height: 25px;
    }
  }
}
.weight {
  margin-bottom: 15px;
}
.fold {
  position: absolute;
  right: 0px;
  transition: transform 0.5s;
}
.fold-up {
  transform: rotate(180deg);
}
.fold-down {
  transform: rotate(0);
}

.weight-edit {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 30px;
  left: 36px;
  &-item {
    display: flex;
    align-items: center;
    & > img {
      width: 20px;
      height: 20px;
    }
    & > span {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #4682fa !important;
    }
  }
}

.flex-end-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.route-dialog {
  /deep/ .el-dialog:not(.is-fullscreen) {
    margin-top: 16vh !important;
    height: 638px;
  }
}

.img-error-red {
  color: #ff4949;
  font-size: 12px;
  position: absolute;
  bottom: -30px;
  left: 4px;
}
/deep/ .el-input-group__append,
.el-input-group__prepend {
  background-color: #ffffff;
}
.routeBg {
  width: 348px;
  height: 68px;
  background: url("../../../assets/images/bang/route-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 8px 16px;
  position: relative;
  & > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
.address-img {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.shipmentName {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #3d4050;
  line-height: 0;
}
.icon-base {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
  margin-right: 7px;
  line-height: 15px;
  text-align: center;
}
.icon-base-start {
  background: #ffbc00;
}
.icon-base-end {
  background: #4682fa;
}
.address-title {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 0;
  color: #3d4050;
}
.to-img {
  margin: 0 30px;
}
.x {
  width: 30px;
  height: 30px;
  position: absolute;
  top: -5px;
  right: -15px;
}
.group-btn {
  position: absolute;
  bottom: 15px;
  right: 19px;
}
.weight-edit-item{
cursor: pointer;
}
</style>
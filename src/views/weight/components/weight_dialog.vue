<template>
  <el-dialog
    :title="options.title"
    :visible.sync="open"
    width="684px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="form" :model="form" label-width="120px" label-position="top">
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
      <div v-for="(item, index) in form.recordForms" :key="item.key">
        <div class="weight-header">
          <div class="weight-number">{{ index + 1 }}</div>
          <div class="weight-text">磅单信息</div>
          <!-- <img src="" alt=""> -->
        </div>
        <div class="weight-info">
          <el-form-item
            label="用车企业及路线："
            :prop="'recordForms.' + index + '.routeCode'"
          >
            <div class="route" v-if="!item.routeCode">
              <img src="../../../assets/images/bang/routerLoad.png" alt="" />
              <span class="route-text">点击选择</span>
            </div>
            <div v-else></div>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="货品类型："
                :prop="'recordForms.' + index + '.goodsCode'"
              >
                <el-cascader
                  clearable
                  filterable
                  v-model="item.goodsCode"
                  @change="cascaderChange($event, index)"
                  :options="goodsList"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="运费单价："
                :prop="'recordForms.' + index + '.goodsFreightPrice'"
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
          <el-form-item
            label="凭证信息："
            :prop="'recordForms.' + index + '.voucherImageUrls'"
          >
            <div class="img-box">
              <template v-if="voucherImgList.length !== 0">
                <div
                  class="img-list"
                  v-for="item in voucherImgList"
                  :key="item.name"
                >
                  <img :src="item.url" alt="" />
                  <div class="x" @click="delImage(index)">
                    <img src="../../../assets/images/bang/x.png" alt="" />
                  </div>
                </div>
              </template>

              <VoucherImageUpload
                v-model="voucherImgList"
                :limit="9"
              ></VoucherImageUpload>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer flex-end-layout">
      <div class="weight-edit">
        <div class="weight-edit-item" style="margin-right: 32px">
        
            <img src="../../../assets/images/bang/add.png" alt="" />
         
          <span> 新增一单</span>
        </div>
        <div class="weight-edit-item">
     
            <img src="../../../assets/images/bang/copy.png" alt="" />
      
          <span>相同路线再来一单</span>
        </div>
      </div>
      <div>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from "../../../api";
import VoucherImageUpload from "../../../components/ImageUpload/voucherUpload.vue";
export default {
  components: { VoucherImageUpload },
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
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      driverList: [], //司机列表
      vehicleList: [], //车辆列表
      voucherImgList: [], //凭证
      form: {
        recordDate: null, //磅单日期
        vehicleCode: null, //车辆Code
        driverCode: null, //司机Code
        recordForms: [
          {
            goodsCode: null, //货品Code
            shipmentCode: null, //企业Code
            routeCode: null, //路线Code
            goodsFreightPrice: null, //货品运费单价
            driverFreightPrice: null, //司机运费
            driverSurchargePrice: null, //司机额外收取
            loadingNetWeight: null, //装货净重
            unloadingNetWeight: null, //卸货净重
            voucherImageUrls: null, //凭证
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
    delImage(index) {
      const tmp = this.voucherImgList.splice(index, 1);
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
    submitForm() {
      console.log("sssss", this.voucherImgList);
    },
    cancel() {
      this.$emit("closeDialog", "no");
    },
  },
};
</script>

<style lang="scss" scoped>
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
    line-height: 17px;
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
  margin-top: 14px;
  width: 100%;
  background: #f8f8f8;
  opacity: 1;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 28px 20px 28px 19px;
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
.weight-edit {
  display: flex;
  align-items: center;
  &-item {
    display: flex;
    align-items: center;
    &>img {
      width: 20px;
      height: 20px;
    }
    &>span {
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
</style>
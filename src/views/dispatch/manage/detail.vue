 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="45%"
    :append-to-body="true"
  >
    <TitleSideBlueTip title="订单信息" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">用车企业:</span>
          <span class="dispatch-dispatch-base-text">
            {{ baseData.companyName }}</span
          >
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">货物类型:</span>
          <span class="dispatch-dispatch-base-text">
            {{ baseData.goodsSmallTypeName }}</span
          >
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label" style="padding-bottom: 16px"
            >下单客户姓名:</span
          >
          <span class="dispatch-dispatch-base-text">
            {{ baseData.shipmentName }}</span
          >
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label" style="padding-bottom: 16px"
            >下单客户电话:</span
          >
          <span class="dispatch-dispatch-base-text">
            {{ baseData.shipmentPhone }}</span
          >
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label" 
            >备注:</span
          >
          <span class="dispatch-dispatch-base-text">
            {{ baseData.shipmentName }}</span
          >
        </el-col>
      </el-row>
      <el-form
        :disabled="true"
        ref="form"
        :model="addressInfo"
        label-width="100px"
        label-position="top"
      >
        <div class="dispatch-title-item start_address">出发地信息</div>
        <div class="dispatch-info-content">
          <!-- <TitleSideBlueTip title="出发地信息" /> -->
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="省 / 市 / 区:" prop="loadFormattedAddress">
                  <el-input
                    v-model="addressInfo.loadFormattedAddress"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址:" prop="loadAddressDetail">
                  <el-input
                    v-model="addressInfo.loadAddressDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="地址别名:" prop="loadAddressAlias">
                  <el-input
                    v-model="addressInfo.loadAddressAlias"
                    clearable
                    style="width: 90%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人电话:" prop="loadLinkManPhone">
                  <el-input
                    v-model="addressInfo.loadLinkManPhone"
                    clearable
                    style="width: 156px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人:" prop="loadLinkManName">
                  <el-input
                    v-model="addressInfo.loadLinkManName"
                    clearable
                    style="width: 112px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="dispatch-title-item end_address">目的地信息</div>
        <div class="dispatch-info-content">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="省 / 市 / 区:"
                  prop="unloadFormattedAddress"
                >
                  <el-input
                    v-model="addressInfo.unloadFormattedAddress"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="详细地址:" prop="unloadAddressDetail">
                  <el-input
                    v-model="addressInfo.unloadAddressDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="地址别名:" prop="unloadAddressAlias">
                  <el-input
                    v-model="addressInfo.unloadAddressAlias"
                    clearable
                    style="width: 90%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人电话:" prop="unloadLinkManPhone">
                  <el-input
                    v-model="addressInfo.unloadLinkManPhone"
                    clearable
                    style="width: 156px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人:" prop="unloadLinkManName">
                  <el-input
                    v-model="addressInfo.unloadLinkManName"
                    clearable
                    style="width: 112px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
        </div>
      </el-form>
    </div>
    <TitleSideBlueTip title="承运信息" />
    <div class="dispatch-base-contents-box">
      <el-row >
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">承运车辆:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.vehicleNumber }}</span
          >
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">运单状态:</span>
          <span class="dispatch-base-text">
            {{ waybillInfoStatusDeal(waybillInfo.status) }}</span
          >
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">承运司机:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.driverName }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">接单时间:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.receviceTime }}</span
          >
        </el-col>

        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">司机电话:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.driverPhone }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">出车时间:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.loadTime }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">装货数量:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.loadWeight }}</span>
        </el-col>

        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">承运组织:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.teamName }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">回车时间:</span>
          <span class="dispatch-base-text"> {{ waybillInfo.unloadTime }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">卸货数量:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.unloadWeight }}</span
          >
        </el-col>

        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">调度者:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.teamLeaderName }}</span
          >
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">运单是否异常:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.isException == 0 ? "否" : "是" }}</span
          >
        </el-col>

        <el-col :span="12" >
          <span class="dispatch-base-label">调度者电话:</span>
          <span class="dispatch-base-text">
            {{ waybillInfo.teamLeaderPhone }}</span
          >
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="费用信息" />
    <div class="dispatch-base-contents-box" style="padding-bottom:114px">
      <template v-if="waybillInfo.status === 10">
        <div style="padding-bottom: 16px">
          <span class="dispatch-base-label">运费单价:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.unitPrice }}</span
          >
        </div>
        <div  style="padding-bottom: 16px">
          <span class="dispatch-base-label">计费重量:</span>
          <span class="dispatch-base-text"> {{ settlementInfo.weight }}</span>
        </div>
        <div  style="padding-bottom: 16px">
          <span class="dispatch-base-label">货物单价:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.goodsPrice }}</span
          >
        </div>
      </template>
      <template v-else>
        <div style="padding-bottom: 16px" >
          <span class="dispatch-base-label">司机应收:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.driverFreight }}</span
          >
        </div>
        <el-row style="padding-bottom: 16px" >
          <el-col :span="8">
            <span class="dispatch-base-label">路耗扣费:</span>
            <span class="dispatch-base-text">
              {{ settlementInfo.lossPrice }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">增项:</span>
            <span class="dispatch-base-text">
              {{ settlementInfo.subsidyPrice }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">减项:</span>
            <span class="dispatch-base-text">
              {{ settlementInfo.deductionPrice }}</span
            >
          </el-col>
        </el-row>
        <div  style="padding-bottom: 16px">
          <span class="dispatch-base-label">司机实收:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.driverRealFreight }}</span
          >
        </div>
        <div style="padding-bottom: 16px">
          <span class="dispatch-base-label">纳税金额:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.servicePrice }}</span
          >
        </div>
        <div  style="padding-bottom: 16px">
          <span class="dispatch-base-label">货主实付:</span>
          <span class="dispatch-base-text">
            {{ settlementInfo.shipmentPrice }}</span
          >
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
import { statusList } from "./manage_config";
export default {
  name: "detail",
  components: {},
  props: {
    code: {
      type: String,
      default: "",
    },
    detailDrawer: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      baseData: {},
      addressInfo: {},
      waybillInfo: {},
      settlementInfo: {},
    };
  },
  created() {},
  // mounted() {
  //   if (document.location.search.includes("code")) {
  //     this.codes = document.location.search.split("=")[1];
  //     console.log("code", this.codes);
  //   }
  //   this.getDetail();
  // },
  watch: {
    detailDrawer() {
      console.log("我在监听");
      if (this.detailDrawer) {
        console.log("他变成true");
        this.getDetail();
      }
    },
  },
  methods: {
    waybillInfoStatusDeal(status) {
      let result = "";
      for (const item of statusList) {
        if (item.value == status) {
          result = item.label;
        }
      }
      return result;
    },
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_manage",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail res", res);
      this.baseData = res.data;
      this.addressInfo = res.data && res.data.addressInfo;
      this.waybillInfo = res.data && res.data.waybillInfo;
      this.settlementInfo = res.data && res.data.settlementInfo;
    },
    handleClose() {
      this.$emit("colseDetailDrawer");
    },
  },
};
</script>

<style lang="scss" scoped>
.title-item {
  font-size: 18px;
  font-weight: 700;
  margin: 10px;
}
.base-label {
  font-size: 14px;
  color: #606266;
}

.dispatch-base-text {
  margin-left: 20px;
}
.info-content {
  min-height: 200px;
  width: 100%;
  background: rgba(176, 224, 230, 0.5);
  border-radius: 10px;
  padding: 20px 20px;
}
</style>
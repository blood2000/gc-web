 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="carDrawer"
    direction="rtl"
    :before-close="handleClose"
    size="45%"
  >
    <TitleSideBlueTip title="订单信息" />
    <div class="dispatch-contents-box">
      <el-form
        :disabled="true"
        ref="pageData"
        :model="pageData"
        label-width="120px"
        label-position="top"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="用车企业:" prop="companyName">
              <el-tooltip
                class="item"
                effect="dark"
                :content="pageData.companyName"
                placement="top"
              >
                <el-input
                  v-model="pageData.companyName"
                  clearable
                  style="width: 95%"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单客户姓名:" prop="shipmentName">
              <el-input
                v-model="pageData.shipmentName"
                clearable
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单客户电话:" prop="shipmentPhone ">
              <el-input
                v-model="pageData.shipmentPhone"
                clearable
                style="width: 156px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货物类型:" prop="goodsTypeName">
              <el-tooltip
                class="item"
                effect="dark"
                :content="pageData.goodsTypeName"
                placement="top"
              >
                <el-input
                  v-model="pageData.goodsTypeName"
                  clearable
                  style="width: 95%"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="!isZj">
            <el-form-item label="运费单价:" prop="freightStr">
              <el-input
                v-model="pageData.freightStr"
                clearable
                style="width: 156px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="isZj">
            <el-form-item label="结算方式:" prop="settlementWayStr">
              <el-tooltip
                class="item"
                effect="dark"
                :content="pageData.settlementWayStr"
                placement="top"
              >
                <el-input
                  v-model="pageData.settlementWayStr"
                  clearable
                  style="width: 70%"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="isZj">
            <el-form-item
              :label="pageData.settlementWay == 1 ? '运费总额' : '货物单价'"
              prop="freight"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="pageData.freight"
                placement="top"
              >
                <el-input
                  v-model="pageData.freight"
                  clearable
                  style="width: 156px"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dispatch-title-item start_address">出发地信息</div>
        <div class="dispatch-info-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="省 / 市 / 区:" prop="loadAddress">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="pageData.loadAddress"
                  placement="top"
                >
                  <el-input
                    v-model="pageData.loadAddress"
                    clearable
                    style="width: 220px"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址:" prop="loadDetail">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="pageData.loadDetail"
                  placement="top"
                >
                  <el-input
                    v-model="pageData.loadDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址别名:" prop="loadAlias">
                <el-input
                  v-model="pageData.loadAlias"
                  clearable
                  style="width: 90%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="联系人电话:" prop="loadLinkManPhone">
                <el-input
                  v-model="pageData.loadLinkManPhone"
                  clearable
                  style="width: 168px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人:" prop="loadLinkManName">
                <el-input
                  v-model="pageData.loadLinkManName"
                  clearable
                  style="width: 112px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dispatch-title-item end_address">目的地信息</div>
        <div class="dispatch-info-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="省 / 市 / 区:" prop="unloadAddress">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="pageData.unloadAddress"
                  placement="top"
                >
                  <el-input
                    v-model="pageData.unloadAddress"
                    clearable
                    style="width: 220px"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址:" prop="unloadDetail">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="pageData.unloadDetail"
                  placement="top"
                >
                  <el-input
                    v-model="pageData.unloadDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址别名:" prop="unloadAlias">
                <el-input
                  v-model="pageData.unloadAlias"
                  clearable
                  style="width: 90%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="联系人电话:" prop="unloadLinkManPhone">
                <el-input
                  v-model="pageData.unloadLinkManPhone"
                  clearable
                  style="width: 168px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人:" prop="unloadLinkManName">
                <el-input
                  v-model="pageData.unloadLinkManName"
                  clearable
                  style="width: 112px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <TitleSideBlueTip title="承运车辆" />
    <CarMany
      v-if="isMany&&closeItem"
      :pageData="pageData"
      :dispatchOrderCode="code"
      :carDrawer="carDrawer"
      :isZj="isZj"
      @handleClose="handleClose"
    />
    <CarSingle
      v-if="!isMany&&closeItem"
      :pageData="pageData"
      :dispatchOrderCode="code"
      :carDrawer="carDrawer"
      :isZj="isZj"
      @handleClose="handleClose"
    />
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
import CarMany from "./components/carMany.vue";
import CarSingle from "./components/carSingle.vue";
export default {
  name: "car",
  components: { CarMany, CarSingle },
  props: {
    code: {
      type: String,
      default: "",
    },
    carDrawer: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
    source: {
      type: String,
      default: "",
    },
    isMany: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      closeItem:true, //是否关闭子页面
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
        settlementWayStr: null, //结算方式中文
        freight: null, //单价、总价
        settlementWay: null, //结算方式
      },
    };
  },
  watch: {
    carDrawer() {
      console.log("我在监听", this.isMany);
      if (this.carDrawer) {
        this.closeItem = true
        console.log("他变成true", this.code);
        this.getDetail();
      }
    },
  },
  computed: {
    isZj() {
      let result = null;
      if (this.source === "zj") {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
  },
  methods: {
    // 关闭
    handleClose() {
      console.log('我关闭了')
      this.closeItem = false
      this.$emit("colseCarDrawer");
    },
    //获取详情
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_dispatch",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      this.DetailToPageData(res.data);
    },

    //详情绑定页面数据填写
    DetailToPageData(data) {
      this.pageData = {
        companyName: data.companyName,
        shipmentName: data.shipmentName,
        shipmentPhone: data.shipmentPhone,
        goodsTypeName: data.goodsTypeName,
        freightStr:
          (data.orderGoodses && data.orderGoodses[0].freightStr) || null,
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
        settlementWayStr: data.expenseInfoVO&& data.expenseInfoVO.settlementWayStr,
        freight:data.expenseInfoVO&& data.expenseInfoVO.freight,
        settlementWay:data.expenseInfoVO&& data.expenseInfoVO.settlementWay,
      };
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
</style>
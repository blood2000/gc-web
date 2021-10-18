 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index:2200"
    :before-close="handleClose"
    size="45%"
    :append-to-body="true"
  >
    <TitleSideBlueTip title="基本信息" />
    <el-row >
      <el-col :span="12">
        <el-row class="dispatch-contents-box">
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">调度单号:</span>
            <span class="dispatch-base-text">
              {{ pageData.dispatchOrderNo }}</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">所属项目:</span>
            <span class="dispatch-base-text"> {{ pageData.projectName }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">货源大类:</span>
            <span class="dispatch-base-text">
              {{ pageData.goodsBigTypeName }}</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">用车企业:</span>
            <span class="dispatch-base-text"> {{ pageData.companyName }}</span>
          </el-col>
          <el-col :span="24" >
            <span class="dispatch-base-label">下单客户电话:</span>
            <span class="dispatch-base-text">
              {{ pageData.shipmentPhone }}</span
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="dispatch-contents-box">
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">关联平台货源单号:</span>
            <span class="dispatch-base-text"> {{ pageData.orderNo }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">调度单来源:</span>
            <span class="dispatch-base-text"> {{ pageData.source }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">货源小类:</span>
            <span class="dispatch-base-text">
              {{ pageData.goodsTypeName }}</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">下单客户姓名:</span>
            <span class="dispatch-base-text">{{ pageData.shipmentName }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <TitleSideBlueTip title="地址信息" />
    <div class="dispatch-contents-box" >
      <div class="dispatch-title-item start_address" style="margin-top:0">出发地信息</div>
      <div class="dispatch-info-content" >
        <el-row  style="padding-bottom:16px" >
          <el-col :span="8">
            <span class="dispatch-base-label">省:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadProvince") }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">市:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadCity") }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">县/区:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadDistrict") }}</span
            >
          </el-col>
        </el-row>
        <el-row  style="padding-bottom:16px">
          <el-col :span="8">
            <span class="dispatch-base-label">详细地址:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadDetail") }}</span
            >
          </el-col>
          <el-col :span="8" :offset="8">
            <span class="dispatch-base-label">地址别名:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadAlias") }}</span
            >
          </el-col>
        </el-row>
        <el-row style="padding-bottom:16px">
          <el-col :span="8">
            <span class="dispatch-base-label">联系人 :</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadLinkManName") }}</span
            >
          </el-col>
          <el-col :span="8" :offset="8">
            <span class="dispatch-base-label">联系电话:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "loadLinkManPhone") }}</span
            >
          </el-col>
        </el-row>
      </div>
      <div class="dispatch-title-item end_address">目的地信息</div>
      <div class="dispatch-info-content" >
        <el-row  style="padding-bottom:16px">
          <el-col :span="8">
            <span class="dispatch-base-label">省:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadProvince") }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">市:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadCity") }}</span
            >
          </el-col>
          <el-col :span="8">
            <span class="dispatch-base-label">县/区:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadDistrict") }}</span
            >
          </el-col>
        </el-row>
        <el-row style="padding-bottom:16px">
          <el-col :span="8">
            <span class="dispatch-base-label">详细地址:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadDetail") }}</span
            >
          </el-col>
          <el-col :span="8" :offset="8">
            <span class="dispatch-base-label">地址别名:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadAlias") }}</span
            >
          </el-col>
        </el-row>
        <el-row style="padding-bottom:16px" >
          <el-col :span="8">
            <span class="dispatch-base-label">联系人 :</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadLinkManName") }}</span
            >
          </el-col>
          <el-col :span="8" :offset="8">
            <span class="dispatch-base-label">联系电话:</span>
            <span class="dispatch-base-text">
              {{ isPageShow("orderAddress", "unloadLinkManPhone") }}</span
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <TitleSideBlueTip title="货源信息" />
    <el-row class="dispatch-contents-box" >
      <el-col :span="12">
        <el-row >
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">配载方式:</span>
            <span class="dispatch-base-text">
              <!-- stowageStatusLabel -->
              {{ pageData.stowageStatusLabel }}数配载</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">车型:</span>
            <span class="dispatch-base-text">
              {{ isOrderGoodses("vehicleType") }}</span
            >
          </el-col>

          <el-col :span="24">
            <span class="dispatch-base-label">最高配载:</span>
            <span class="dispatch-base-text">
              {{ isOrderGoodses("vehicleMaxWeight") }}</span
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="dispatch-contents-box">
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">重量/体积:</span>
            <span class="dispatch-base-text">
              {{ isOrderGoodses("goodsWeight") }}</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">车长:</span>
            <span class="dispatch-base-text">
              {{ isOrderGoodses("vehicleLenght") }}</span
            >
          </el-col>

          <el-col :span="24" >
            <span class="dispatch-base-label">货源备注:</span>
            <span class="dispatch-base-text">{{ pageData.remark }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <p class="dispatch-contents-box"></p>
    <TitleSideBlueTip title="费用信息" />
    <div class="dispatch-base-contents-box">
    <el-row style="margin-bottom:114px">
      <el-col :span="12">
        <span class="dispatch-base-label">司机应收运费:</span>
        <span class="dispatch-base-text">
          {{ isOrderGoodses("driverFreightStr") || '-' }}</span
        >
      </el-col>
      <el-col :span="12" >
        <span class="dispatch-base-label">运费单价:</span>
        <span class="dispatch-base-text">
          {{ isOrderGoodses("freightStr")|| '-' }}</span
        >
      </el-col>
    </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
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
      pageData: {},
    };
  },
  created() {},
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
    isOrderGoodses(val) {
      return this.pageData.orderGoodses && this.pageData.orderGoodses[0][val];
    },
    isPageShow(info, val) {
      return this.pageData && this.pageData[info] && this.pageData[info][val];
    },
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_dispatch",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail res", res);
      this.pageData = res.data;
    },
    handleClose() {
      this.$emit("colseDetailDrawer");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
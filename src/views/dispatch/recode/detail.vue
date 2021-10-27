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
    <div>
      <TitleSideBlueTip title="订单信息" />
      <el-row class="dispatch-contents-box">
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">用车企业:</span>
          <span class="dispatch-base-text"> {{ pageData.companyName }}</span>
        </el-col>
        <el-col :span="12" style="padding-bottom: 16px">
          <span class="dispatch-base-label">下单客户姓名:</span>
          <span class="dispatch-base-text"> {{ pageData.shipmentName }}</span>
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label">下单客户电话:</span>
          <span class="dispatch-base-text"> {{ pageData.shipmentPhone }}</span>
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label">货物类型:</span>
          <span class="dispatch-base-text">
            {{ isOrderGoodses("goodsName") }}</span
          >
        </el-col>
      </el-row>
    </div>
    <div>
      <el-form
        :disabled="true"
        ref="form"
        :model="form"
        label-width="90px"
        label-position="top"
      >
        <div class="dispatch-contents-box">
          <div class="dispatch-title-item start_address">出发地信息</div>
          <div class="dispatch-info-content" style="padding-left: 0">
            <div class="dispatch-contents-box">
              <el-row :gutter="15">
                <el-col :span="12">
                  <el-form-item label="省 / 市 / 区:" prop="loadAddress">
                    <el-input
                      v-model="form.loadAddress"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
               
                  <el-form-item label="详细地址:" prop="loadDetail">
                          <el-tooltip
                class="item"
                effect="dark"
                :content="form.loadDetail"
                placement="top"
              >
                    <el-input
                      v-model="form.loadDetail"
                      clearable
                      style="width: 220px"
                    />
                          </el-tooltip> 
                  </el-form-item>
                  
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="地址别名:" prop="loadAlias">
                    <el-input
                      v-model="form.loadAlias"
                      clearable
                      style="width: 90%"
                    />
                  </el-form-item>
                </el-col>
             
                <el-col :span="8">
                  <el-form-item label="联系人电话:" prop="loadLinkManPhone">
                    <el-input
                      v-model="form.loadLinkManPhone"
                      clearable
                      style="width: 156px"
                    />
                  </el-form-item>
                </el-col>
                   <el-col :span="8">
                  <el-form-item label="联系人:" prop="loadLinkManName">
                    <el-input
                      v-model="form.loadLinkManName"
                      clearable
                      style="width: 112px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="dispatch-title-item end_address">目的地信息</div>
          <div class="dispatch-info-content" style="padding-left: 0">
            <div class="dispatch-contents-box">
              <el-row :gutter="15">
                <el-col :span="12">
                  <el-form-item label="省 / 市 / 区:" prop="unloadAddress">
                    <el-input
                      v-model="form.unloadAddress"
                      clearable
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-col>
                 <el-col :span="12">
                  <el-form-item label="详细地址:" prop="unloadDetail">
                     <el-tooltip
                class="item"
                effect="dark"
                :content="form.unloadDetail"
                placement="top"
              >
                    <el-input
                      v-model="form.unloadDetail"
                      clearable
                      style="width: 220px"
                    />
                     </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-form-item label="地址别名:" prop="unloadAlias">
                    <el-input
                      v-model="form.unloadAlias"
                      clearable
                      style="width: 90%"
                    />
                  </el-form-item>
                </el-col>
                  <el-col :span="8">
                  <el-form-item label="联系人电话:" prop="unloadLinkManPhone">
                    <el-input
                      v-model="form.unloadLinkManPhone"
                      clearable
                      style="width: 156px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系人:" prop="unloadLinkManName">
                    <el-input
                      v-model="form.unloadLinkManName"
                      clearable
                      style="width: 112px"
                    />
                  </el-form-item>
                </el-col>
              
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div>
      <div>
        <TitleSideBlueTip title="派车信息" />
        <el-row class="dispatch-contents-box" style="padding-bottom:114px">
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">派车时间:</span>
            <span class="dispatch-base-text">
              {{ pageData.appointCarTime }}</span
            >
          </el-col>
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">出车时间:</span>
            <span class="dispatch-base-text"> {{ pageData.outCarTime }}</span>
          </el-col>
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">开始日期:</span>
            <span class="dispatch-base-text"> {{ pageData.startDate }}</span>
          </el-col>
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">结束日期:</span>
            <span class="dispatch-base-text"> {{ pageData.endDate }}</span>
          </el-col>
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">承运车辆:</span>
            <span class="dispatch-base-text">
              {{ pageData.vehicleNumber }}</span
            >
          </el-col>
          <el-col :span="12" style="padding-bottom: 16px">
            <span class="dispatch-base-label">承运司机:</span>
            <span class="dispatch-base-text"> {{ pageData.driverName }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";

export default {
  name: "detail",
  components: {},
  data() {
    return {
      codes: null,
      pageData: {},
      form: {
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
    };
  },
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
  created() {},
  mounted() {
    // if (document.location.search.includes("code")) {
    //   this.codes = document.location.search.split("=")[1];
    //   console.log("code", this.codes);
    // }
    // this.getDetail();
  },
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
    async getDetail() {
      //detail_dispatch
      console.log("this.code", this.code);
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_record",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail res", res);
      this.pageData = res.data;
      this.DetailToPageData(res.data);
    },
    //详情绑定页面
    DetailToPageData(data) {
      this.form = {
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
    handleClose() {
      this.$emit("colseDetailDrawer");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
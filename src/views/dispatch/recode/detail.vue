 <template>
  <div class="app-container">
    <div>
      <TitleSideBlueTip title="订单信息" />
      <el-row class="dispatch-contents-box">
        <el-col :span="6">
          <span class="dispatch-base-label">用车企业:</span>
          <span> {{ pageData.companyName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="dispatch-base-label">下单客户姓名:</span>
          <span> {{ pageData.shipmentName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="dispatch-base-label">下单客户电话:</span>
          <span> {{ pageData.shipmentPhone }}</span>
        </el-col>
      </el-row>
      <el-row class="dispatch-contents-box">
        <el-col :span="18">
          <span class="dispatch-base-label">货物类型:</span>
          <span> {{ isOrderGoodses("goodsName") }}</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-form
        :disabled="true"
        ref="form"
        :model="form"
        label-width="120px"
        label-position="left"
      >
          <div class="dispatch-contents-box">

        <div class="dispatch-title-item">出发地信息</div>
        <div class="dispatch-info-content">
          <div class="dispatch-contents-box">
            <el-row>
              <el-col :span="12">
                <el-form-item label="省 / 市 / 区:" prop="loadAddress">
                  <el-input
                    v-model="form.loadAddress"
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
                    v-model="form.loadDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址别名:" prop="loadAlias">
                  <el-input
                    v-model="form.loadAlias"
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
                    v-model="form.loadLinkManName"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人电话:" prop="loadLinkManPhone">
                  <el-input
                    v-model="form.loadLinkManPhone"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <div class="dispatch-title-item">目的地信息</div>
        <div class="dispatch-info-content">
          <div class="dispatch-contents-box">
            <el-row>
              <el-col :span="12">
                <el-form-item label="省 / 市 / 区:" prop="unloadAddress">
                  <el-input
                    v-model="form.unloadAddress"
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
                    v-model="form.unloadDetail"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址别名:" prop="unloadAlias">
                  <el-input
                    v-model="form.unloadAlias"
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
                    v-model="form.unloadLinkManName"
                    clearable
                    style="width: 220px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人电话:" prop="unloadLinkManPhone">
                  <el-input
                    v-model="form.unloadLinkManPhone"
                    clearable
                    style="width: 220px"
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
        <el-row class="dispatch-contents-box">
          <el-col :span="6">
            <span class="dispatch-base-label">派车时间:</span>
            <span> {{ pageData.appointCarTime }}</span>
          </el-col>
          <el-col :span="6">
            <span class="dispatch-base-label">出车时间:</span>
            <span> {{ pageData.outCarTime }}</span>
          </el-col>
        </el-row>
        <el-row class="dispatch-contents-box">
          <el-col :span="6">
            <span class="dispatch-base-label">开始日期:</span>
            <span> {{ pageData.startDate }}</span>
          </el-col>
          <el-col :span="6">
            <span class="dispatch-base-label">结束日期:</span>
            <span> {{ pageData.endDate }}</span>
          </el-col>
        </el-row>
        <el-row class="dispatch-contents-box">
          <el-col :span="6">
            <span class="dispatch-base-label">承运车辆:</span>
            <span> {{ pageData.vehicleNumber }}</span>
          </el-col>
          <el-col :span="6">
            <span class="dispatch-base-label">承运司机:</span>
            <span> {{ pageData.driverName }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
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
  created() {},
  mounted() {
    if (document.location.search.includes("code")) {
      this.codes = document.location.search.split("=")[1];
      console.log("code", this.codes);
    }
    this.getDetail();
  },
  methods: {
    isOrderGoodses(val) {
      return this.pageData.orderGoodses && this.pageData.orderGoodses[0][val];
    },
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_record",
        url_code: [this.codes],
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
  },
};
</script>

<style lang="scss" scoped>

</style>
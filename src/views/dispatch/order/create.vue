 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="createDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="clearAll"
    size="45%"
    :append-to-body="true"
    :wrapperClosable="false"
  >
    <el-form
      ref="form"
      :model="queryParams"
      label-width="90px"
      :rules="rules"
      label-position="top"
    >
      <TitleSideBlueTip title="企业信息" />
      <el-row class="dispatch-contents-box">
        <el-col :span="6">
          <el-form-item label="用车企业：" prop="companyName">
            <el-input
              v-model="queryParams.companyName"
              clearable
              placeholder="请输入用车企业"
              style="width: 185px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="common_company" @click="hanleCompanyOpen()">常用企业</div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="下单客户姓名：" prop="shipmentName">
            <el-input
              v-model="queryParams.shipmentName"
              clearable
              placeholder="请输入姓名"
              style="width: 185px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下单客户电话：" prop="shipmentPhone">
            <el-input
              v-model="queryParams.shipmentPhone"
              clearable
              placeholder="请输入电话"
              style="width: 185px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算方式：" prop="settlementWay">
            <el-select
              v-model="queryParams.settlementWay"
              clearable
              filterable
              style="width: 185px"
              placeholder="请选择结算方式"
              @change="settlementWayChange"
            >
              <el-option
                v-for="(item, index) in settlementWayConfig"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="changePriceText" prop="freight">
            <el-input
              @input="imposeInput"
              type="number"
              style="width: 192px"
              placeholder="请输入运费"
              v-model="queryParams.freight"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dispatch-contents-box">
        <el-col :span="8">
          <el-form-item label="货物大类：" prop="goodsBigTypeName">
            <el-select
              v-model="queryParams.goodsBigTypeName"
              clearable
              filterable
              style="width: 188px"
              placeholder="请选择货物大类"
              @change="goodsBigTypeChange"
            >
              <el-option
                class="test"
                v-for="(item, index) in goodsBigTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictLabel"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="queryParams.goodsBigTypeName" :span="8">
          <el-form-item label="货物类型：" prop="goodsTypeCode">
            <el-select
              v-model="queryParams.goodsTypeCode"
              clearable
              filterable
              style="width: 188px"
              placeholder="请选择货物类型"
              @change="goodsTypeChange"
            >
              <el-option
                class="test"
                v-for="(item, index) in goodsTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dispatch-title-item start_address" style="margin-left: 24px">
      <span> 出发地信息</span>
      <div class="common_address" @click="hanleAddressOpen(1)">常用地址</div>
    </div>
    <div class="dispatch-base-contents-box">
      <el-form
        ref="loadForm"
        :model="loadAddressParams"
        label-width="90px"
        :rules="loadRules"
        label-position="top"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="省" prop="provinceCode">
              <el-select
                v-model="loadAddressParams.provinceCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择省份"
                @change="provinceChange($event, loadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in loadList.provinceList"
                  :key="index"
                  :label="item.provinceName"
                  :value="item.provinceCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="市" prop="cityCode">
              <el-select
                v-model="loadAddressParams.cityCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择城市"
                @change="cityChange($event, loadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in loadList.cityList"
                  :key="index"
                  :label="item.cityName"
                  :value="item.cityCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="县/区" prop="districtCode">
              <el-select
                v-model="loadAddressParams.districtCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择县/区"
                @change="districtChange($event, loadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in loadList.districtList"
                  :key="index"
                  :label="item.countyName"
                  :value="item.countyCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailAddress">
              <el-select
                v-model="loadAddressParams.detailAddress"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remote1Method"
                :loading="loadList.loading"
                :style="{ width: '252px' }"
                @change="
                  (value) => {
                    handlechengDetail(value, this.loadAddressParams.type);
                  }
                "
              >
                <el-option
                  v-for="(dict, index) in loadList.detailOptin"
                  :key="dict.dictValue + '' + index"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                  <div class="option-item">
                    <div class="option-item_name">{{ dict.dictLabel }}</div>
                    <div class="option-item_address">{{ dict.address }}</div>
                  </div>
                </el-option>
              </el-select>
              <el-amap-search-box
                v-show="false"
                :ref="`amap1`"
                class="search-box"
                :search-option="searchOption"
                :on-search-result="onSearchResult"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址别名：" prop="addressAlias">
              <el-input
                v-model="loadAddressParams.addressAlias"
                placeholder="请输入地址别名"
                clearable
                style="width: 252px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkManName">
              <el-input
                v-model="loadAddressParams.linkManName"
                clearable
                placeholder="请输入联系人"
                style="width: 185px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话：" prop="linkManPhone">
              <el-input
                v-model="loadAddressParams.linkManPhone"
                clearable
                placeholder="请输入联系人电话"
                style="width: 185px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dispatch-title-item end_address" style="margin-left: 24px">
      <span>目的地信息</span>
      <div class="common_address" @click="hanleAddressOpen(2)">常用地址</div>
    </div>
    <div class="dispatch-base-contents-box" style="margin-bottom: 120px">
      <el-form
        ref="unloadForm"
        :model="unloadAddressParams"
        label-width="90px"
        :rules="loadRules"
        label-position="top"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="省" prop="provinceCode">
              <el-select
                v-model="unloadAddressParams.provinceCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择省份"
                @change="provinceChange($event, unloadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in unLoadList.provinceList"
                  :key="index"
                  :label="item.provinceName"
                  :value="item.provinceCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="市" prop="cityCode">
              <el-select
                v-model="unloadAddressParams.cityCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择城市"
                @change="cityChange($event, unloadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in unLoadList.cityList"
                  :key="index"
                  :label="item.cityName"
                  :value="item.cityCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="县/区" prop="districtCode">
              <el-select
                v-model="unloadAddressParams.districtCode"
                clearable
                filterable
                style="width: 156px"
                placeholder="请选择县/区"
                @change="districtChange($event, unloadAddressParams.type)"
              >
                <el-option
                  v-for="(item, index) in unLoadList.districtList"
                  :key="index"
                  :label="item.countyName"
                  :value="item.countyCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="详细地址" prop="detailAddress">
              <el-select
                v-model="unloadAddressParams.detailAddress"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remote2Method"
                :loading="unLoadList.loading"
                :style="{ width: '252px' }"
                @change="
                  (value) => {
                    handlechengDetail(value, this.unloadAddressParams.type);
                  }
                "
              >
                <el-option
                  v-for="(dict, index) in unLoadList.detailOptin"
                  :key="dict.dictValue + '' + index"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                  <div class="option-item">
                    <div class="option-item_name">{{ dict.dictLabel }}</div>
                    <div class="option-item_address">
                      111 {{ dict.address }}
                    </div>
                  </div>
                </el-option>
              </el-select>
              <el-amap-search-box
                v-show="false"
                :ref="`amap2`"
                class="search-box"
                :search-option="searchOption1"
                :on-search-result="onUnSearchResult"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址别名：" prop="addressAlias">
              <el-input
                v-model="unloadAddressParams.addressAlias"
                placeholder="请输入地址别名"
                clearable
                style="width: 252px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="linkManName">
              <el-input
                v-model="unloadAddressParams.linkManName"
                clearable
                placeholder="请输入联系人"
                style="width: 185px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话：" prop="linkManPhone">
              <el-input
                v-model="unloadAddressParams.linkManPhone"
                clearable
                placeholder="请输入联系人电话"
                style="width: 185px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <div><span class="remark">备注：</span></div>
        <div>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="remark"
          >
          </el-input>
        </div>
      </div>
    </div>
    <div class="create-btn">
      <div>
        <el-button type="text"
          ><span style="color: #8592ad" @click="clearAll">取消</span></el-button
        >
        <el-button type="primary" @click="confrims">提交</el-button>
      </div>
    </div>
    <!-- 打开弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="常用地址"
      :visible.sync="addressOpen"
      append-to-body
    >
      <div v-if="addressOpen">
        <AddressDialog
          :opaddresstype="currAddressType"
          @radioSelection="radioSelection"
        />
      </div>
    </el-dialog>
    <!-- 企业抽屉 -->
    <el-drawer
      :append-to-body="true"
      title="选择常用企业"
      :before-close="handleInnerClose"
      size="35%"
      :visible.sync="innerDrawer"
    >
      <!-- <div slot="title">
       <span>选择常用企业</span>
       <img src="" alt="">
     </div> -->
      <CompanyItem
        v-if="innerDrawer"
        @companySelection="companySelection"
        @handleInnerClose="handleInnerClose"
      />
    </el-drawer>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
import AddressDialog from "./components/address_dialog.vue";
import formValidate from "../../../utils/formValidate";
import CompanyItem from "./components/companyItem.vue";
import { settlementWayConfig } from "./order_config";
export default {
  name: "detail",
  components: { AddressDialog, CompanyItem },
  props: {
    createDrawer: {
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
      geocoder: null,
      pageData: {},
      innerDrawer: false,
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      searchOption1: {
        city: "全国",
        citylimit: true,
      },
      selected: null,
      isrules: true,
      queryParams: {
        companyName: null, //下单企业
        shipmentName: null, //下单人
        shipmentPhone: null, //下单人电话
        title: null, //货品小类
        goodsBigTypeName: null, //货品大类
        goodsTypeCode: null, //货品小类Code
        settlementWay: null, //结算方式
        freight: null, //运费单价
      },
      loadAddressParams: {
        province: null, //省
        city: null, //市
        district: null, //区
        provinceCode: null, //省Code
        cityCode: null, //市Code
        districtCode: null, //区Code
        detailAddress: null, //详细地址
        addressAlias: null, //地址别名
        linkManName: null, //联系人
        linkManPhone: null, //联系人电话
        type: "1", //1 装货  2 卸货
        locations: [], //坐标
      },
      unloadAddressParams: {
        province: null, //省
        city: null, //市
        district: null, //区
        provinceCode: null, //省Code
        cityCode: null, //市Code
        districtCode: null, //区Code
        detailAddress: null, //详细地址
        addressAlias: null, //地址别名
        linkManName: null, //联系人
        linkManPhone: null, //联系人电话
        type: "2", //1 装货  2 卸货
        locations: [], //坐标
      },
      remark: null,
      goodsBigTypeList: [],
      goodsBigTypeConfig: {
        status: "0",
        dictPid: "0",
        dictType: "goodsType",
      },
      goodsTypeList: [],
      goodsTypeConfig: {
        status: "0",
        dictPid: "",
        dictType: "goodsType",
      },
      companyList: [],
      loadList: {
        provinceList: [],
        cityList: [],
        districtList: [],
        detailOptin: [],
        loading: false,
      },
      unLoadList: {
        provinceList: [],
        cityList: [],
        districtList: [],
        detailOptin: [],
        loading: false,
      },
      changePriceText: "运费总价：",
      settlementWayConfig: [],
      rules: {
        companyName: [
          {
            required: true,
            message: "用车企业不能为空",
            trigger: "blur",
          },
          {
            required: true,
            message: "用车企业不能为空",
            trigger: "change",
          },
        ],
        shipmentName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { required: true, message: "姓名不能为空", trigger: "change" },
        ],
        shipmentPhone: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { validator: formValidate.telphone, trigger: "blur" },
          { required: true, message: "手机不能为空", trigger: "change" },
          { validator: formValidate.telphone, trigger: "change" },
        ],
        settlementWay: [
          { required: true, message: "请选择结算方式", trigger: "change" },
        ],
        goodsBigTypeName: [
          { required: true, message: "请选择货物大类", trigger: "change" },
        ],
        goodsTypeCode: [
          { required: true, message: "请选择货物类型", trigger: "change" },
        ],
        freight: [{ required: true, message: "运费不能为空", trigger: "blur" }],
      },
      loadRules: {
        provinceCode: [
          { required: true, message: "请选择省", trigger: "change" },
        ],
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" },
        ],
        districtCode: [
          { required: true, message: "请选择县/区", trigger: "change" },
        ],
        detailAddress: [
          { required: true, message: "请选择详细地址", trigger: "change" },
        ],
        linkManName: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          { required: true, message: "请输入联系人", trigger: "change" },
        ],
        linkManPhone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          { validator: formValidate.telphone, trigger: "blur" },
        ],
      },
      addressOpen: false,
      currAddressType: 0,
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    createDrawer() {
      if (this.createDrawer) {
        console.log("他变成true");
        this.getInitList();
        this.settlementWayConfig = settlementWayConfig;
      }
    },
    "searchOption.city"(val, oldval) {
      console.log("searchOption.city oldval", oldval);
      if (oldval !== "全国" && this.loadAddressParams.detailAddress) {
        this.loadAddressParams.detailAddress = "";
      }
    },
    "searchOption1.city"(val, oldval) {
      console.log("searchOption1.city oldval", oldval);
      if (oldval !== "全国" && this.unloadAddressParams.detailAddress) {
        this.unloadAddressParams.detailAddress = "";
      }
    },
  },
  methods: {
    initMap() {
      setTimeout(() => {
        this.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all",
        });
      }, 1000);
    },
    // 选择常用企业
    hanleCompanyOpen() {
      console.log("选择常用企业");
      this.innerDrawer = true;
    },
    //金额输入强制限制小数点
    imposeInput(e) {
      console.log("强制限制", e);
      const tmp = e.match(/^[0-9]+(\.[0-9]{0,2})?/g) ?? [""];
      console.log("tmp", tmp[0]);
      this.queryParams.freight = tmp[0];
    },
    // 常用企业
    hanleAddressOpen(type) {
      this.addressOpen = true;
      this.currAddressType = type;
    },

    // 结算更变
    settlementWayChange(value) {
      if (value != "2") {
        this.changePriceText = "运费总价：";
      } else {
        this.changePriceText = "运费单价：";
      }
    },
    //获取省
    getProvinceList() {
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "provinceList",
      };
      http_request(obj).then((res) => {
        console.log("获取省", res);
        this.loadList.provinceList = res.data;
        this.unLoadList.provinceList = res.data;
      });
    },
    // 获取市
    getCityListFun(code, type, callBack) {
      if (code == null || code === "") {
        return;
      }
      console.log("");
      const me = this;
      const obj = {
        moduleName: "http_purse",
        method: "get",
        url_alias: "cityList",
        data: { provinceCode: code },
      };
      http_request(obj).then((res) => {
        console.log("获取市", res);
        if (type == "1") {
          me.loadList.cityList = res.data;
          console.log("出发地", me.loadList.cityList);
        } else if (type == "2") {
          console.log("你还能进来？", type);
          me.unLoadList.cityList = res.data;
        }
        callBack();
      });
    },
    //获取区
    getDistrictFun(code, type, callBack) {
      if (code == null || code === "") {
        return;
      }
      const me = this;
      const obj = {
        moduleName: "http_purse",
        method: "get",
        url_alias: "districtList",
        url_code: [code],
      };
      http_request(obj).then((res) => {
        console.log("获取区", res);
        if (type == "1") {
          me.loadList.districtList = res.data;
          console.log("出发地 区", me.loadList.districtList);
        } else if (type == "2") {
          me.unLoadList.districtList = res.data;
        }
        callBack();
      });
    },
    //省更变
    provinceChange(e, type) {
      console.log("省更变 e", e);
      console.log("省更变 type", type);
      if (!type) return;
      if (type == "1") {
        this.loadAddressParams.cityCode = null;
        this.loadAddressParams.districtCode = null;
        this.loadList.cityList = [];
        this.loadList.districtList = [];
      } else if (type == "2") {
        this.unloadAddressParams.cityCode = null;
        this.unloadAddressParams.districtCode = null;
        this.unLoadList.cityList = [];
        this.unLoadList.districtList = [];
      }
      if (e !== null && e !== undefined && e !== "") {
        this.addressSearchLimitByCode(e, type);
      } else {
        this.addressReset(type);
      }
      this.getCityListFun(e, type, () => {});
    },
    // 市更新
    cityChange(e, type) {
      console.log("cityChange e", e);
      console.log("cityChange type", type);
      if (type == "1") {
        this.loadAddressParams.districtCode = null;
        this.loadList.districtList = [];
      } else if (type == "2") {
        this.unloadAddressParams.districtCode = null;
        this.unLoadList.districtList = [];
      }
      if (e !== null && e !== undefined && e !== "") {
        this.addressSearchLimitByCode(e, type);
      } else {
        this.addressReset(type);
      }
      this.getDistrictFun(e, type, () => {});
    },
    // 区更变
    districtChange(e, type) {
      console.log("districtChange e", e);
      console.log("districtChange type", type);
      if (e !== null && e !== undefined && e !== "") {
        this.addressSearchLimitByCode(e, type);
      } else {
        this.addressReset(type);
      }
    },
    // 选择完省/市/区以后,限定地址搜索只能在这个范围里面选
    addressSearchLimitByCode(code, type) {
      if (type == "1") {
        this.searchOption.city = code;
      } else if (type == "2") {
        this.searchOption1.city = code;
      }
    },
    // 重置搜索地址
    addressReset(type) {
      console.log("重置搜索地址", type);
      if (type == "1") {
        this.searchOption.city = "全国";
        this.loadAddressParams.detailAddress = null;
      } else if (type == "2") {
        this.searchOption1.city = "全国";
        this.unloadAddressParams.detailAddress = null;
      }
    },

    //用车企业列表
    shipmentChange(value) {
      console.log("用车企业列表 value", value);
      const commodity = this.companyList.filter((item) => {
        console.log("item.companyName", item.companyName);
        return item.companyName === value;
      });
      console.log("commodity ==>", commodity);
      if (commodity.length == 0) return;
      this.queryParams.shipmentName = commodity[0].contactName;
      this.queryParams.shipmentPhone = commodity[0].contactPhone;
    },
    //货物大类选择
    goodsBigTypeChange(value) {
      if (!value) return;
      const commodity = this.goodsBigTypeList.filter((item) => {
        return item.dictLabel === value;
      });
      console.log("goodsBigTypeChange", commodity);
      this.goodsTypeConfig.dictPid = commodity[0].dictCode;
      this.queryParams.goodsTypeCode = null;
      this.getDicts(null, this.goodsTypeConfig).then((response) => {
        this.goodsTypeList = response.data;
      });
    },
    //货物小类选择
    goodsTypeChange(value) {
      console.log("value", value);
      if (!value) return;
      const commodity = this.goodsTypeList.filter((item) => {
        return item.dictValue === value;
      });
      console.log("goodsTypeChange", commodity);
      if (commodity.length == 0) return;
      this.queryParams.title = commodity[0].dictLabel;
      console.log("commodity[0].dictLabel;", commodity[0].dictLabel);
    },
    // 初始化数据
    getInitList() {
      this.getProvinceList();
      this.getDicts(null, this.goodsBigTypeConfig).then((response) => {
        this.goodsBigTypeList = response.data;
      });
    },
    // 监听详情地址输入框 1
    remote1Method(que) {
      if (!que) return;
      const vdom = this.$refs.amap1;
      vdom.keyword = que;
      vdom.search();
    },
    // 监听详情地址输入框 2
    remote2Method(que) {
      if (!que) return;
      const vdom = this.$refs.amap2;
      vdom.keyword = que;
      vdom.search();
    },
    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      console.log("arr", arr);
      if (!arr) return;
      return arr.map((e) => {
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel],
        };
      });
    },
    // 1. 搜索地址回调
    onSearchResult(res) {
      console.log("搜索地址回调 11111 res ->", res);
      if (!res) return;
      this.loadList.detailOptin = [];
      this.loadList.detailOptin = this._baozhuan(res, "id", "name");
      console.log("type == 1", this.loadList.detailOptin);
      this.loadList.loading = false;

      console.log("搜索地址回调 end");
    },
    // 2. 搜索地址回调
    onUnSearchResult(res) {
      console.log("un 搜索地址回调 22222 res ->", res);
      if (!res) return;
      this.unLoadList.detailOptin = [];
      this.unLoadList.detailOptin = this._baozhuan(res, "id", "name");
      console.log("type == 2", this.unLoadList.detailOptin);
      this.unLoadList.loading = false;
    },
    // 详情更变
    handlechengDetail(value, type) {
      console.log("详情更变", value, type);
      if (!value) {
        this.selected = null;
        this.pccCode = null;
        if (type == "1") {
          this.searchOption.city = "全国";
        } else {
          this.searchOption1.city = "全国";
        }
        return;
      }
      console.log("handlechengDetail ", value, type);
      if (type == "1") {
        this.selected = this._zhaovalue(this.loadList.detailOptin, value);
      }
      if (type == "2") {
        this.selected = this._zhaovalue(this.unLoadList.detailOptin, value);
      }
      console.log("this.selected  ", this.selected);
      if (!this.selected) return;
      if (type == "1") {
        this.loadAddressParams.addressAlias = this.selected.address;
        this.loadAddressParams.detailAddress = this.selected.address;
        this.loadAddressParams.locations[0] = this.selected.lng;
        this.loadAddressParams.locations[1] = this.selected.lat;
      }
      if (type == "2") {
        this.unloadAddressParams.addressAlias = this.selected.address;
        this.unloadAddressParams.detailAddress = this.selected.address;
        this.unloadAddressParams.locations[0] = this.selected.lng;
        this.unloadAddressParams.locations[1] = this.selected.lat;
      }
      const lnglat = [this.selected.lng, this.selected.lat];
      this.getaddress(lnglat, type);
    },
    // 逆解码函数
    getaddress(lnglat, type) {
      const _this = this;
      this.geocoder.getAddress(lnglat, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          // 通过经纬度找出详细的地址
          const {
            adcode,
            province,
            city,
            district,
            township,
            street,
            streetNumber,
          } = result.regeocode.addressComponent;

          if (type == "1" && _this.loadAddressParams.detailAddress)
            _this.loadAddressParams.detailAddress =
              district + township + street + streetNumber;
          if (type == "2" && _this.unloadAddressParams.detailAddress)
            _this.unloadAddressParams.detailAddress =
              district + township + street + streetNumber;
          console.log(
            "adcode, province, city, district",
            adcode,
            province,
            city,
            district
          );
          _this.getAreaCode(adcode, province, city, district, type);
        }
      });
    },
    //赋值
    getAreaCode(code, province, city, district, type) {
      const provinceCode = code.slice(0, 2);
      const cityCode = code.slice(0, 4);
      const districtCode = code.slice(0, 6);
      if (type == "1") {
        this.getCityListFun(provinceCode, "1", () => {
          this.getDistrictFun(cityCode, "1", () => {
            console.log("loadAddressParams 出发地", this.loadList.cityList);
            this.loadAddressParams.provinceCode = provinceCode;
            this.loadAddressParams.cityCode = cityCode;
            this.loadAddressParams.districtCode = districtCode;
            this.loadAddressParams.province = province;
            this.loadAddressParams.city = city;
            this.loadAddressParams.district = district;
            console.log("this.loadAddressParams", this.loadAddressParams);
          });
        });
      } else if (type == "2") {
        this.getCityListFun(provinceCode, "2", () => {
          this.getDistrictFun(cityCode, "2", () => {
            this.unloadAddressParams.provinceCode = provinceCode;
            this.unloadAddressParams.cityCode = cityCode;
            this.unloadAddressParams.districtCode = districtCode;
            this.unloadAddressParams.province = province;
            this.unloadAddressParams.city = city;
            this.unloadAddressParams.district = district;
            console.log("this.unloadAddressParams", this.unloadAddressParams);
          });
        });
      }
    },
    //关闭抽屉
    handleClose() {
      this.queryParams = {
        companyName: null, //下单企业
        shipmentName: null, //下单人
        shipmentPhone: null, //下单人电话
        title: null, //货品小类
        goodsBigTypeName: null, //货品大类
        goodsTypeCode: null, //货品小类Code
        settlementWay: null, //结算方式
        freight: null, //运费单价
      };
      this.loadAddressParams = {
        province: null, //省
        city: null, //市
        district: null, //区
        provinceCode: null, //省Code
        cityCode: null, //市Code
        districtCode: null, //区Code
        detailAddress: null, //详细地址
        addressAlias: null, //地址别名
        linkManName: null, //联系人
        linkManPhone: null, //联系人电话
        type: "1", //1 装货  2 卸货
        locations: [], //坐标
      };
      this.unloadAddressParams = {
        province: null, //省
        city: null, //市
        district: null, //区
        provinceCode: null, //省Code
        cityCode: null, //市Code
        districtCode: null, //区Code
        detailAddress: null, //详细地址
        addressAlias: null, //地址别名
        linkManName: null, //联系人
        linkManPhone: null, //联系人电话
        type: "2", //1 装货  2 卸货
        locations: [], //坐标
      };
      this.remark = null;
      this.resetForm("form");
      this.resetForm("loadForm");
      this.resetForm("unloadForm");
    },
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      console.log("_zhaovalue arr", arr);
      if (!arr) return;
      return arr.filter((e) => {
        return e.dictValue === value;
      })[0];
    },
    // 提交
    confrims() {
      const me = this;
      me.$refs.form.validate((valid) => {
        if (valid) {
          const bodyData = me.formToPaging();
          console.log("bodyData", bodyData);
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "addDispatchOrder",
            data: bodyData,
          };
          http_request(obj).then((res) => {
            console.log("confrims res", res);
            if (res.code != "200") {
              this.msgError("订单建立失败");
            } else {
              this.msgSuccess("订单建立成功");
            }
            this.handleClose();
            this.$emit("colseCreateDrawer", "ok");
          });
        }
      });
    },
    // 表单到分页
    formToPaging() {
      let obj = {};
      obj = Object.assign(obj, this.queryParams);
      obj.addresses = [];
      obj.addresses.push(this.loadAddressParams);
      obj.addresses.push(this.unloadAddressParams);
      obj.remark = this.remark;
      return obj;
    },
    // 清除全部
    clearAll() {
      this.handleClose();
      this.$emit("colseCreateDrawer");
    },
    //常用地址选择
    radioSelection(data) {
      if (!data || !this.currAddressType) return;
      console.log("选择返回的数据", data, this.currAddressType);
      this.getCityListFun(data.provinceCode, this.currAddressType + "", () => {
        this.getDistrictFun(data.cityCode, this.currAddressType + "", () => {
          const objName =
            this.currAddressType === 1
              ? "loadAddressParams"
              : "unloadAddressParams";
          console.log("objName", objName);
          this[objName] = {
            province: data.province, //省
            city: data.city, //市
            district: data.district, //区
            provinceCode: data.provinceCode, //省Code
            cityCode: data.cityCode, //市Code
            districtCode: data.districtCode, //区Code
            detailAddress: data.detail, //详细地址
            addressAlias: data.addressAlias, //地址别名
            linkManName: data.contact, //联系人
            linkManPhone: data.contactPhone, //联系人电话
            type: this[objName].type, //1 装货  2 卸货
            locations: [Number(data.longitude), Number(data.latitude)], //坐标
          };

          this.currAddressType = null;
          this.addressOpen = false;
          console.log("this[objName]", this[objName]);
        });
      });
    },
    // 常用企业选择
    companySelection(data) {
      if (!data) return;
      console.log("companySelection", data);
      this.queryParams.companyName = data.companyName;
      this.queryParams.shipmentName = data.contactName;
      this.queryParams.shipmentPhone = data.contactPhone;
    },
    // 常用企业抽屉关闭
    handleInnerClose() {
      this.innerDrawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.create-btn {
  padding: 20px 28px;
  display: flex;
  justify-content: flex-end;
}
.common_address {
  display: inline-block;
  padding-left: 26px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABQpJREFUWEfFVnuIVFUY/33nzr2j66Pa6EGtFYUZIfaHpWGm+5oppQdSCpZSST7CHhqCpO69Z2bTDYtKDEtRM0yQ0siCxHt3bcwHPRB6ECoo9odkEC6Zq7Nz78z94j7GbrOzM7MaeP6695zv932/73kO4QovusL2MSACjZKHxkRhKrE7iQj3A7g2dOAMM74FeB+d074y36LztTpWE4GxkuvqRX45AS8CPLyScgbOwuU1DrSOjKTeakSqEmhJOw8KuFsJdGs1ZSXnJ8jFU3uk9n0lXEUCiXR2MqDsJmBwUQkD+4jxYV5RO7Nn0H11Hq5TjxtIcZoJeBpAa8Tg+QJoSpeu7u+PRL8Emtp7R6msHAK4PgT/xMgvtPS6g5U8apbOBIV4ExHu8uUY3Y5wJ3zdNuhYOVxZAndL1m4m+xciujMEddquOi0jqaeWNCSX/DGEh12zk4geCkkcPXOjOubwfHJK8WUJtKbtRQJ4J3CAj1zo0cYfXE3najFelEku4SEY5hwCYUxI4mXT0NZWJzCdleRo53cQrmeAXWB8l679UApsbuc7Yq4z0dvPC/XA3jY6USrTkrbvU+C1JwRAp0031gBJblSuTwQSqWwLkdIZCNHnpq5OiwIaJcdU4bxPwPPRfQa2OK46NyMpH91PpHJfENGj3l4BNKm0IPsQSKZzbwK0JAgbzzKN+Lb/KEzbnvEF5dLBwEZL1+ZGz1pT9nOCsDlQxx2WEV9WJQLOZ0Tse227+REZWXeqCGiU2ds0oZwMagM9IHo9JLqCgKEBxh2ZkYOOFzFNK3pHqZo4GmK2W7o2syKBZMr+DoRxgTJVjYY0IXOzSNDWIDu0wmxTV3qfiXZnKTG/4RtxebYl4x8XjXgd1SCcXEAU35iGNrlyBNL2AQIe8Aqw+5QaP7zh39aJEnCZZKehpjxlyXbHALMsR2CK5OEF4ZwNjXaaupaoQsDZReDHwgiMyEiKpOBCgypiJwmIMaOHmN/1jRItIsJQBvKOWxiZkYN/u5gCf6ANIAUJmVtJgvxCKTDP6upbhGuDS6nvYuA9S9deKinCuYKwIUgBLTMNtaNyDUhnEgTv8+WZ91hG/OEoIGxDb0gt8CIRFpfXeh84rrq4tA2TaXsvgKZQx72mrh2uSCA0cIyA2wPl+Ynl5n+jvNCgQfEHkY3CgWi3FA20yN5WRQgr+OdfTT0+ujRu5UextOcIgU1BFHA8xurY3ZL+Lhf2/vZal/JVVGf/TES3hNGcYRnxT2siMP0TVv464mSI4HvIYLP7lPZItCMqkRk7j9X6hvyXBPYvI2ayLENNlsP0ex0nJN9EwvkRwHUhiR1WmzYDRFwxEsyUaLe3E2hGIEens9nee/Z3DPtzQAQ84WZpj1MEuopTDsAGU9fmVyKQTNvrAcwLi7On4KJlb4VXUfUnWSrbpJCyG0A8UEqrLF1dXo5EIpVbRUSvhWc5uDTVlKrXBf2uqgQ8ZGsq/7ggdweKbcdYZBnamqjWZMpeDMLb4V7BZfFEpxHbVa1wayLgKUmk7NkgfESAVwQMxjOWofn3QiKdfxZwN188g5hj6bEt1Yz7FVKLUFEmkbJfIYI/fr13iMv8JKBAkLsT3keQo1dNQ/NfU7WsARHwvY2M6lID7PJqS8aX1mK4KDNgAh4wmbLXgfBC1BCzu94yBpV9qFx2EZZTkEjZCwHM9PIOwjZT19YNxPPLisClGOoPc0kp+D8J/ANN7wU/Z8/VEQAAAABJRU5ErkJggg==)
    no-repeat;
  background-size: 16px 16px;
  background-position-y: 4px;
  background-position-x: 6px;
  color: #4682fa;
  cursor: pointer;
}
.common_company {
  position: relative;
  top: 35px;
  height: 20px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  display: inline-block;
  padding-left: 26px;
  background: url("~@/assets/images/icon/common_company.png") no-repeat;
  background-size: 16px 16px;
  background-position-y: 4px;
  background-position-x: 6px;
  color: #4682fa;
  cursor: pointer;
}
.remark {
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12 px 0 0;
  box-sizing: border-box;
  font-weight: bold;
}
.option-item {
  display: flex;
}
.option-item .option-item_name {
  margin-right: 10px;
}
.option-item .option-item_address {
  font-size: 12px;
  color: #ccc;
}
</style>
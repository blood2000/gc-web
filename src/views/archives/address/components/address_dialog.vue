<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
    :destroy-on-close="true"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      size="small"
      label-position="top"
    >
      <!-- 省市区 -->
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="省" prop="provinceCode">
            <el-select
              v-model="form.provinceCode"
              clearable
              filterable
              style="width: 156px"
              placeholder="请选择省份"
              @change="provinceChange"
            >
              <el-option
                v-for="(item, index) in provinceList"
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
              v-model="form.cityCode"
              clearable
              filterable
              style="width: 156px"
              placeholder="请选择城市"
              @change="cityChange"
            >
              <el-option
                v-for="(item, index) in cityList"
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
              v-model="form.districtCode"
              clearable
              filterable
              style="width: 156px"
              placeholder="请选择县/区"
              @change="districtChange"
            >
              <el-option
                v-for="(item, index) in districtList"
                :key="index"
                :label="item.countyName"
                :value="item.countyCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="详细地址" prop="detail">
            <el-select
              v-model="form.detail"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remote2Method"
              :loading="detailLoading"
              :style="{ width: '650px' }"
              @change="handlechengDetail"
            >
              <el-option
                v-for="(dict, index) in detailOptin"
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
              :ref="`amap2`"
              class="search-box"
              :search-option="searchOption"
              :on-search-result="onSearchResult"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址别名：" prop="addressAlias">
            <el-input
              v-model="form.addressAlias"
              placeholder="请输入地址别名"
              clearable
              style="width: 252px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址类型" prop="addressType">
            <el-select
              v-model="form.addressType"
              clearable
              filterable
              placeholder="请选择地址类型"
            >
              <el-option
                v-for="(item, index) in addressTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人：" prop="contact">
            <el-input
              v-model="form.contact"
              clearable
              placeholder="请输入联系人"
              style="width: 255px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话：" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              clearable
              placeholder="请输入联系人电话"
              style="width: 255px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading"
        >保存</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { http_request } from "../../../../api";
import formValidate from "../../../../utils/formValidate";
import { addressTypeList } from "../config";
const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: "all",
});
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      detailLoading: false,
      provinceList: [],
      cityList: [],
      districtList: [],
      isCreateCity: true,
      isDistrictCity: true,
      form: {
        addressAlias: null, //地址别名
        latitude: null, //经度
        longitude: null, //维度
        detail: null, //地址详情
        contact: null, //联系人
        contactPhone: null, //手机号码
        provinceCode: null, //省份编码
        cityCode: null, //城市编码
        districtCode: null, //区县编码
        countryCode: null, //国家编码
        addressName: null, //地址名称(高德手选的)
        province: null, //省份
        city: null, //市份
        district: null, //区份
        addressType: null, //1装货 2卸货
        id: null,
      },
      rules: {
        detail: [
          { required: true, message: "详细地址不能为空", trigger: "change" },
        ],
        provinceCode: [
          { required: true, message: "省份不能为空", trigger: "change" },
        ],
        cityCode: [
          { required: true, message: "城市不能为空", trigger: "change" },
        ],
        districtCode: [
          { required: true, message: "区/县不能为空", trigger: "change" },
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" },
          { validator: formValidate.telphone, trigger: "blur" },
        ],
      },
      isDetail: false,
      addressTypeList,
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      selected: null,
      detailOptin: [],
    };
  },
  watch: {
    open() {
      console.log(" this.options.editType", this.options.editType);
      if (!this.open) return;
      this.getProvinceList();
      if (this.options.editType == "update") {
        console.log("this.options", this.options, this.open);
        //请求
        this.requsetDetail();
      }
    },
    "form.provinceCode"() {
      console.log("watch form.provinceCode", this.form.provinceCode);
      if (
        this.open &&
        this.options.editType == "update" &&
        this.form.provinceCode &&
        this.isCreateCity
      ) {
        console.log("我不该触发的provinceCode");
        this.getCityListFun(this.form.provinceCode);
        this.isCreateCity = false;
      }
    },
    "form.cityCode"() {
      console.log("watch form.cityCode", this.form.cityCode);
      if (
        this.open &&
        this.options.editType == "update" &&
        this.form.cityCode &&
        this.isDistrictCity
      ) {
        console.log("我不该触发的 cityCode");
        this.getDistrictFun(this.form.cityCode);
        this.isDistrictCity = false;
      }
    },
  },
  methods: {
    //请求详情
    requsetDetail() {
      const tmp = {
        moduleName: "http_address",
        method: "get",
        url_alias: "address_get_id",
        url_code: [this.options.code],
      };
      console.log("tmp", tmp);
      http_request(tmp)
        .then((res) => {
          if (!res.data) return this.msgError("暂无数据");
          console.log("driver_detail res", res);
          this.detailToForm(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    //上数据
    detailToForm(data) {
      (this.form = {
        addressAlias: data.addressAlias, //地址别名
        latitude: data.latitude, //经度
        longitude: data.longitude, //维度
        detail: data.detail, //地址详情
        contact: data.contact, //联系人
        contactPhone: data.contactPhone, //手机号码
        provinceCode: data.provinceCode, //省份编码
        cityCode: data.cityCode, //城市编码
        districtCode: data.districtCode, //区县编码
        countryCode: data.countryCode, //国家编码
        addressName: data.addressName, //地址名称(高德手选的)
        province: data.provinceName, //省份
        city: data.cityName, //市份
        district: data.districtName, //区份
        addressType: data.addressType, //1装货 2卸货
        id: this.options.code,
      }),
        console.log("this.form", this.form);
    },
    //重置
    reset() {
      (this.form = {
        addressAlias: null, //地址别名
        latitude: null, //经度
        longitude: null, //维度
        detail: null, //地址详情
        contact: null, //联系人
        contactPhone: null, //手机号码
        provinceCode: null, //省份编码
        cityCode: null, //城市编码
        districtCode: null, //区县编码
        countryCode: null, //国家编码
        addressName: null, //地址名称(高德手选的)
        province: null, //省份
        city: null, //市份
        district: null, //区份
        addressType: null, //1装货 2卸货
        id: null,
      }),
        this.resetForm("form");
      this.isCreateCity = true;
      this.isDistrictCity = true;
    },
    //关闭
    cancel() {
      this.reset();
      this.$emit("colseDialog", "no");
    },
    //提交
    async submitForm() {
      const me = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("sssss======> form", this.form);
          this.loading = true;
          if (this.options.editType == "update") {
            me.form.id = me.options.code;
            const obj = {
              data: me.form,
              moduleName: "http_address",
              method: "put",
              url_alias: "address_update",
            };
            http_request(obj)
              .then((updateres) => {
                console.log("updateres", updateres);
                this.loading = false;
                this.reset()
                this.$emit("colseDialog", "ok");
              })
              .catch((e) => {
                this.loading = false;
              });
          } else {
            const obj = {
              data: me.form,
              moduleName: "http_address",
              method: "post",
              url_alias: "address_add",
            };
            http_request(obj)
              .then((addres) => {
                console.log("addres", addres);
                this.loading = false;
                 this.reset()
                this.$emit("colseDialog", "ok");
              })
              .catch((e) => {
                this.loading = false;
              });
          }
        }
      });
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
        this.provinceList = res.data;
      });
    },
    // 获取市
    getCityListFun(code) {
      if (code == null || code === "") {
        return;
      }
      const me = this;
      const obj = {
        moduleName: "http_purse",
        method: "get",
        url_alias: "cityList",
        data: { provinceCode: code },
      };
      http_request(obj).then((res) => {
        console.log("获取市", res);

        me.cityList = res.data;
        console.log("出发地", me.cityList);
      });
    },
    //获取区
    getDistrictFun(code) {
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
        me.districtList = res.data;
        console.log("出发地 区", me.districtList);
      });
    },
    //省改变
    provinceChange(e) {
      console.log("省改变", e);
      this.form.cityCode = null;
      this.form.districtCode = null;
      this.cityList = [];
      this.districtList = [];
      this.getCityListFun(e);
    },
    // 市更新
    cityChange(e) {
      this.form.districtCode = null;
      this.districtList = [];
      this.getDistrictFun(e);
    },
    //区更新
    districtChange(e) {},
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
      this.detailLoading = true;
      console.log("搜索地址回调 11111 res ->", res);
      if (!res) return;
      this.detailOptin = [];
      this.detailOptin = this._baozhuan(res, "id", "name");
      console.log("type == 1", this.detailOptin);
      this.detailLoading = false;

      console.log("搜索地址回调 end");
    },
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      console.log("_zhaovalue arr", arr);
      if (!arr) return;
      return arr.filter((e) => {
        return e.dictValue === value;
      })[0];
    },
    // 详情更变
    handlechengDetail(value) {
      console.log("详情更变", value);
      if (!value) {
        this.selected = null;
        this.searchOption.city = "全国";
        return;
      }
      console.log("handlechengDetail ", value);
      this.selected = this._zhaovalue(this.detailOptin, value);
      console.log("this.selected =====> ", this.selected);
      if (!this.selected) return;
      this.form.addressName = this.selected.address;
      this.form.longitude = this.selected.lng;
      this.form.latitude = this.selected.lat;
      const lnglat = [this.selected.lng, this.selected.lat];
      this.getaddress(lnglat);
    },
    // 逆解码函数
    getaddress(lnglat) {
      const _this = this;
      geocoder.getAddress(lnglat, function (status, result) {
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
          console.log(
            "result.regeocode.addressComponent",
            result.regeocode.addressComponent
          );
          if (_this.form.addressName)
            _this.form.detail = district + township + street + streetNumber;
          console.log(
            "adcode, province, city, district",
            adcode,
            province,
            city,
            district
          );
          _this.getAreaCode(adcode, province, city, district);
        }
      });
    },
    //赋值
    getAreaCode(code, province, city, district) {
      const provinceCode = code.slice(0, 2);
      const cityCode = code.slice(0, 4);
      const districtCode = code.slice(0, 6);
      this.getCityListFun(provinceCode);
      this.getDistrictFun(cityCode);
      this.form.provinceCode = provinceCode;
      this.form.cityCode = cityCode;
      this.form.districtCode = districtCode;
      this.form.province = province;
      this.form.city = city;
      this.form.district = district;
      console.log("this.form", this.form);
    },
  },
};
</script>
<style lang="scss" scoped>
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
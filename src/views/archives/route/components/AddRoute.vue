<template>
  <div class="addRoute">
    <el-dialog title="新增路线" :visible.sync="visible" width="700px" :before-close="onClose">
      <el-form ref="form" :model="data" label-width="90px" :rules="rules" label-position="top">
        <el-form-item label="路线名称" prop="routeName">
          <el-input v-model="data.routeName" placeholder="请输入路线名称" />
        </el-form-item>
        <div class="dispatch-title-item start_address">
          <span> 出发地信息</span>
          <div class="common_address" @click="hanleAddressOpen(1)">常用地址</div>
        </div>
        <!-- 出发地信息 -->
        <div class="info-wrapper">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="省" prop="loadingAddressProvinceCode">
                <el-select
                  v-model="data.loadingAddressProvinceCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择省份"
                  @change="provinceChange($event, data.loadingAddressType)"
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
              <el-form-item label="市" prop="loadingAddressCityCode">
                <el-select
                  v-model="data.loadingAddressCityCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择城市"
                  @change="cityChange($event, data.loadingAddressType)"
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
              <el-form-item label="县/区" prop="loadingAddressDistrictCode">
                <el-select
                  v-model="data.loadingAddressDistrictCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择县/区"
                  @change="districtChange($event, data.loadingAddressType)"
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
          </el-row>
          <el-form-item label="详细地址" prop="loadingAddressDetail">
            <el-select
              v-model="data.loadingAddressDetail"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remote1Method"
              :loading="loadList.loading"
              :style="{ width: '350px' }"
              @change="
                (value) => {
                  handlechengDetail(value, data.loadingAddressType)
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
          <el-form-item label="地址别名" prop="loadingAddressAlias">
            <el-input
              v-model="data.loadingAddressAlias"
              placeholder="请输入地址别名"
              clearable
              style="width: 350px"
            />
          </el-form-item>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="联系人" prop="loadingAddressContact">
                <el-input
                  v-model="data.loadingAddressContact"
                  clearable
                  placeholder="请输入联系人"
                  style="width: 180px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人电话" prop="loadingAddressContactPhone">
                <el-input
                  v-model="data.loadingAddressContactPhone"
                  clearable
                  placeholder="请输入联系人电话"
                  style="width: 260px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-checkbox v-model="data.loadingWhetherToAdd" :true-label="1" :false-label="0">
              添加到常用地址
            </el-checkbox>
          </el-form-item>
        </div>

        <div class="dispatch-title-item end_address">
          <span>目的地信息</span>
          <div class="common_address" @click="hanleAddressOpen(2)">常用地址</div>
        </div>
        <div class="info-wrapper">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item label="省" prop="unloadingAddressProvinceCode">
                <el-select
                  v-model="data.unloadingAddressProvinceCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择省份"
                  @change="provinceChange($event, data.unloadingAddressType)"
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
              <el-form-item label="市" prop="unloadingAddressCityCode">
                <el-select
                  v-model="data.unloadingAddressCityCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择城市"
                  @change="cityChange($event, data.unloadingAddressType)"
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
              <el-form-item label="县/区" prop="unloadingAddressDistrictCode">
                <el-select
                  v-model="data.unloadingAddressDistrictCode"
                  clearable
                  filterable
                  style="width: 156px"
                  placeholder="请选择县/区"
                  @change="districtChange($event, data.unloadingAddressType)"
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
          <el-form-item label="详细地址" prop="unloadingAddressDetail">
            <el-select
              v-model="data.unloadingAddressDetail"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remote1Method"
              :loading="unLoadList.loading"
              :style="{ width: '350px' }"
              @change="
                (value) => {
                  handlechengDetail(value, data.unloadingAddressType)
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
          <el-form-item label="地址别名" prop="unloadingAddressAlias">
            <el-input
              v-model="data.unloadingAddressAlias"
              placeholder="请输入地址别名"
              clearable
              style="width: 350px"
            />
          </el-form-item>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="联系人" prop="unloadingAddressContact">
                <el-input
                  v-model="data.unloadingAddressContact"
                  clearable
                  placeholder="请输入联系人"
                  style="width: 180px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人电话" prop="unloadingAddressContactPhone">
                <el-input
                  v-model="data.unloadingAddressContactPhone"
                  clearable
                  placeholder="请输入联系人电话"
                  style="width: 260px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-checkbox v-model="data.unloadingWhetherToAdd" :true-label="1" :false-label="0">
              添加到常用地址
            </el-checkbox>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button v-show="whichType === 'add'" type="primary" @click="onSave"> 保 存 </el-button>
        <el-button v-show="whichType === 'update'" type="primary" @click="onUpdate"
          >修 改</el-button
        >
      </span>
    </el-dialog>

    <!-- 打开弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="常用地址"
      :visible.sync="addressOpen"
      append-to-body
    >
      <div v-if="addressOpen">
        <AddressDialog :opaddresstype="currAddressType" @radioSelection="radioSelection" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http_request } from '@/api'
import AddressDialog from '@/views/dispatch/order/components/address_dialog.vue'
import RouteDefaultData from '../route_config'

const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all',
})

export default {
  name: 'AddRoute',
  components: {
    AddressDialog,
  },
  data() {
    return {
      visible: false,
      whichType: '',
      data: { ...RouteDefaultData },
      rules: {
        routeName: [
          {
            required: true,
            message: '路线名称不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressProvinceCode: [
          {
            required: true,
            message: '请选择省',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressCityCode: [
          {
            required: true,
            message: '请选择市',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressDistrictCode: [
          {
            required: true,
            message: '请选择县/区',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressDetail: [
          {
            required: true,
            message: '详细地址不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressContact: [
          {
            required: true,
            message: '联系人不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        loadingAddressContactPhone: [
          {
            required: true,
            message: '联系人电话不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressProvinceCode: [
          {
            required: true,
            message: '请选择省',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressCityCode: [
          {
            required: true,
            message: '请选择市',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressDistrictCode: [
          {
            required: true,
            message: '请选择县/区',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressDetail: [
          {
            required: true,
            message: '详细地址不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressContact: [
          {
            required: true,
            message: '联系人不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        unloadingAddressContactPhone: [
          {
            required: true,
            message: '联系人电话不能为空',
            trigger: ['blur', 'change'],
          },
        ],
      },
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
      searchOption: {
        city: '全国',
        citylimit: true,
      },
      searchOption1: {
        city: '全国',
        citylimit: true,
      },
      selected: null,
      addressOpen: false,
      currAddressType: 0,
    }
  },
  created() {
    this.getInitList()
  },
  methods: {
    open() {
      this.whichType = 'add'
      this.visible = true
    },
    onClose() {
      this.resetForm('form')
      this.$emit('onEvent')
      this.visible = false
    },
    // 初始化数据
    getInitList() {
      this.getProvinceList()
      this.getDicts(null, this.goodsBigTypeConfig).then((response) => {
        this.goodsBigTypeList = response.data
      })
    },
    setRouteDetail(id) {
      this.whichType = 'update'
      this.visible = true
      const obj = {
        moduleName: 'http_route',
        method: 'get',
        url_alias: 'route_detail',
        url_code: [id],
      }
      http_request(obj).then((res) => {
        this.data = res.data
        this.data.loadingAddressType = '1'
        this.data.unloadingAddressType = '2'
        this.getCityListFun(this.data.loadingAddressProvinceCode, '1', () => {
          this.getDistrictFun(this.data.loadingAddressCityCode, '1', () => {})
        })
        this.getCityListFun(this.data.unloadingAddressProvinceCode, '2', () => {
          this.getDistrictFun(this.data.unloadingAddressCityCode, '2', () => {})
        })
      })
    },
    // 常用地址
    hanleAddressOpen(type) {
      this.addressOpen = true
      this.currAddressType = type
    },
    //常用地址选择
    radioSelection(data) {
      if (!data || !this.currAddressType) return
      if (data.code === this.data.loadingCode || data.code === this.data.unloadingCode) {
        this.$message.error('请勿选择重复地址')
        return
      }
      console.log('选择返回的数据', data, this.currAddressType)
      this.getCityListFun(data.provinceCode, this.currAddressType + '', () => {
        this.getDistrictFun(data.cityCode, this.currAddressType + '', () => {
          const objName = this.currAddressType === 1 ? 'loading' : 'unloading'
          this.data[`${objName}AddressProvince`] = data.province //省
          this.data[`${objName}AddressCity`] = data.city //市
          this.data[`${objName}AddressDistrict`] = data.district //区
          this.data[`${objName}AddressProvinceCode`] = data.provinceCode //省Code
          this.data[`${objName}AddressCityCode`] = data.cityCode //市Code
          this.data[`${objName}AddressDistrictCode`] = data.districtCode //区Code
          this.data[`${objName}AddressDetail`] = data.detail //详细地址
          this.data[`${objName}AddressAlias`] = data.addressAlias //地址别名
          this.data[`${objName}AddressContact`] = data.contact //联系人
          this.data[`${objName}AddressContactPhone`] = data.contactPhone //联系人电话
          this.data[`${objName}AddressLng`] = Number(data.longitude) //经度
          this.data[`${objName}AddressLat`] = Number(data.latitude) //纬度
          this.data[`${objName}WhetherToAdd`] = 0 // 是否添加到常用地址：0否1是
          this.data[`${objName}Code`] = data.code // 是否添加到常用地址：0否1是
          this.currAddressType = null
          this.addressOpen = false
        })
      })
    },
    //获取省
    getProvinceList() {
      const obj = {
        moduleName: 'http_purse',
        method: 'post',
        url_alias: 'provinceList',
      }
      http_request(obj).then((res) => {
        this.loadList.provinceList = res.data
        this.unLoadList.provinceList = res.data
      })
    },
    // 获取市
    getCityListFun(code, type, callBack) {
      if (code == null || code === '') {
        return
      }
      const that = this
      const obj = {
        moduleName: 'http_purse',
        method: 'get',
        url_alias: 'cityList',
        data: { provinceCode: code },
      }
      http_request(obj).then((res) => {
        if (type == '1') {
          that.loadList.cityList = res.data
        } else if (type == '2') {
          that.unLoadList.cityList = res.data
        }
        callBack()
      })
    },
    //获取区
    getDistrictFun(code, type, callBack) {
      if (code == null || code === '') {
        return
      }
      const that = this
      const obj = {
        moduleName: 'http_purse',
        method: 'get',
        url_alias: 'districtList',
        url_code: [code],
      }
      http_request(obj).then((res) => {
        console.log('获取区', res)
        if (type == '1') {
          that.loadList.districtList = res.data
          console.log('出发地 区', that.loadList.districtList)
        } else if (type == '2') {
          that.unLoadList.districtList = res.data
        }
        callBack()
      })
    },
    //省更变
    provinceChange(e, type) {
      console.log('123123', e, type)
      if (!type) return
      if (type == '1') {
        this.data.loadingAddressCityCode = null
        this.data.loadingAddressDistrictCode = null
        this.loadList.cityList = []
        this.loadList.districtList = []
      } else if (type == '2') {
        this.data.unloadingAddressCityCode = null
        this.data.unloadingAddressDistrictCode = null
        this.unLoadList.cityList = []
        this.unLoadList.districtList = []
      }
      if (e !== null && e !== undefined && e !== '') {
        this.addressSearchLimitByCode(e, type)
      } else {
        this.addressReset(type)
      }
      this.getCityListFun(e, type, () => {})
    },
    // 市更新
    cityChange(e, type) {
      console.log('cityChange e', e)
      console.log('cityChange type', type)
      if (type == '1') {
        this.data.loadingAddressDistrictCode = null
        this.loadList.districtList = []
      } else if (type == '2') {
        this.data.unloadingAddressDistrictCode = null
        this.unLoadList.districtList = []
      }
      if (e !== null && e !== undefined && e !== '') {
        this.addressSearchLimitByCode(e, type)
      } else {
        this.addressReset(type)
      }
      this.getDistrictFun(e, type, () => {})
    },
    // 区更变
    districtChange(e, type) {
      console.log('districtChange e', e)
      console.log('districtChange type', type)
      if (e !== null && e !== undefined && e !== '') {
        this.addressSearchLimitByCode(e, type)
      } else {
        this.addressReset(type)
      }
    },
    // 选择完省/市/区以后,限定地址搜索只能在这个范围里面选
    addressSearchLimitByCode(code, type) {
      if (type == '1') {
        this.searchOption.city = code
      } else if (type == '2') {
        this.searchOption1.city = code
      }
    },
    // 重置搜索地址
    addressReset(type) {
      console.log('重置搜索地址', type)
      if (type == '1') {
        this.searchOption.city = '全国'
        this.data.loadingAddressDetail = null
      } else if (type == '2') {
        this.searchOption1.city = '全国'
        this.data.unloadingAddressDetail = null
      }
    },
    // 监听详情地址输入框 1
    remote1Method(que) {
      if (!que) return
      const vdom = this.$refs.amap1
      vdom.keyword = que
      vdom.search()
    },
    // 监听详情地址输入框 2
    remote2Method(que) {
      if (!que) return
      const vdom = this.$refs.amap2
      vdom.keyword = que
      vdom.search()
    },
    // 详情更变
    handlechengDetail(value, type) {
      console.log('详情更变', value, type)
      if (!value) {
        this.selected = null
        this.pccCode = null
        if (type == '1') {
          this.searchOption.city = '全国'
        } else {
          this.searchOption1.city = '全国'
        }
        return
      }
      console.log('handlechengDetail ', value, type)
      if (type == '1') {
        this.selected = this._zhaovalue(this.loadList.detailOptin, value)
      }
      if (type == '2') {
        this.selected = this._zhaovalue(this.unLoadList.detailOptin, value)
      }
      console.log('this.selected  ', this.selected)
      if (!this.selected) return
      if (type == '1') {
        this.data.loadingAddressDetail = this.selected.address
        this.data.loadingAddressLng = this.selected.lng
        this.data.loadingAddressLat = this.selected.lat
      }

      if (type == '2') {
        this.data.unloadingAddressDetail = this.selected.address
        this.data.unloadingAddressLng = this.selected.lng
        this.data.unloadingAddressLat = this.selected.lat
      }
      const lnglat = [this.selected.lng, this.selected.lat]
      this.getaddress(lnglat, type)
    },
    // 逆解码函数
    getaddress(lnglat, type) {
      const _this = this
      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // 通过经纬度找出详细的地址
          const { adcode, province, city, district, township, street, streetNumber } =
            result.regeocode.addressComponent

          if (type == '1' && _this.data.loadingAddressDetail)
            _this.data.loadingAddressDetail = district + township + street + streetNumber
          if (type == '2' && _this.data.unloadingAddressDetail)
            _this.data.unloadingAddressDetail = district + township + street + streetNumber
          console.log('adcode, province, city, district', adcode, province, city, district)
          _this.getAreaCode(adcode, province, city, district, type)
        }
      })
    },
    //赋值
    getAreaCode(code, province, city, district, type) {
      const provinceCode = code.slice(0, 2)
      const cityCode = code.slice(0, 4)
      const districtCode = code.slice(0, 6)
      if (type == '1') {
        this.getCityListFun(provinceCode, '1', () => {
          this.getDistrictFun(cityCode, '1', () => {
            console.log('loadAddressParams 出发地', this.loadList.cityList)
            this.data.loadingAddressProvinceCode = provinceCode
            this.data.loadingAddressCityCode = cityCode
            this.data.loadingAddressDistrictCode = districtCode
            this.data.loadingAddressProvince = province
            this.data.loadingAddressCity = city
            this.data.loadingAddressDistrict = district
            console.log('this.loadAddressParams', this.loadAddressParams)
          })
        })
      } else if (type == '2') {
        this.getCityListFun(provinceCode, '2', () => {
          this.getDistrictFun(cityCode, '2', () => {
            this.data.unloadingAddressProvinceCode = provinceCode
            this.data.unloadingAddressCityCode = cityCode
            this.data.unloadingAddressDistrictCode = districtCode
            this.data.unloadingAddressProvince = province
            this.data.unloadingAddressCity = city
            this.data.unloadingAddressDistrict = district
            console.log('this.unloadAddressParams', this.unloadAddressParams)
          })
        })
      }
    },
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      console.log('_zhaovalue arr', arr)
      if (!arr) return
      return arr.filter((e) => {
        return e.dictValue === value
      })[0]
    },
    // 1. 搜索地址回调
    onSearchResult(res) {
      console.log('搜索地址回调 11111 res ->', res)
      if (!res) return
      this.loadList.detailOptin = []
      this.loadList.detailOptin = this._baozhuan(res, 'id', 'name')
      console.log('type == 1', this.loadList.detailOptin)
      this.loadList.loading = false
      console.log('搜索地址回调 end')
    },
    // 2. 搜索地址回调
    onUnSearchResult(res) {
      console.log('un 搜索地址回调 22222 res ->', res)
      if (!res) return
      this.unLoadList.detailOptin = []
      this.unLoadList.detailOptin = this._baozhuan(res, 'id', 'name')
      console.log('type == 2', this.unLoadList.detailOptin)
      this.unLoadList.loading = false
    },
    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      console.log('arr', arr)
      if (!arr) return
      return arr.map((e) => {
        console.log('e====>', e)
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel],
        }
      })
    },
    // 保存
    onSave() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验成功
          const obj = {
            moduleName: 'http_route',
            method: 'post',
            url_alias: 'route_add',
            data: this.data,
          }
          http_request(obj).then((res) => {
            console.log('看看', res)
            if (res.code != '200') {
              this.msgError('常用路线新增失败')
            } else {
              this.msgSuccess('常用路线新增成功')
            }
            this.onClose()
          })
        }
      })
    },
    // 修改
    onUpdate() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验成功
          const obj = {
            moduleName: 'http_route',
            method: 'put',
            url_alias: 'route_update',
            data: this.data,
          }
          http_request(obj).then((res) => {
            console.log('看看', res)
            if (res.code != '200') {
              this.msgError('常用路线修改失败')
            } else {
              this.msgSuccess('常用路线修改成功')
            }
            this.onClose()
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background: none !important;
  padding: 20px 20px 10px !important;
  border-bottom: none !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  border-top: none !important;
}
::v-deep .el-form-item__label {
  line-height: normal;
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
.info-wrapper {
  padding: 0 8px;
}
</style>

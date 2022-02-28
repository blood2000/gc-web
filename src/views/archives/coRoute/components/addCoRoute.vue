<template>
  <div class="addCoRoute">
    <el-dialog
      title="新增路线"
      :visible.sync="visible"
      width="700px"
      :before-close="onClose"
    >
      <div class="addCoRoute__title">
        企业信息
        <div
          v-show="companyInfo.code && whichType === 'add'"
          class="addCoRoute__replace"
        >
          <img src="@/assets/images/icon/icon-replace.png" alt="" />
          <el-button type="text" @click="companyDialog = true">
            更换企业
          </el-button>
        </div>
      </div>
      <div
        v-show="!companyInfo.code && whichType === 'add'"
        class="addCoRoute__add"
        @click="companyDialog = true"
      >
        <img src="@/assets/images/icon/icon-add.png" alt="" />
        选择企业
      </div>
      <div v-show="companyInfo.code" class="addCoRoute__company">
        <p>{{ companyInfo.shipmentName }}</p>
        <div class="userInfo">
          <img src="@/assets/images/icon/icon-user-gray.png" alt="" />
          <span class="username">{{ companyInfo.contactName }}</span>
          <span>{{ companyInfo.contactPhone }}</span>
        </div>
      </div>
      <div class="addCoRoute__title">
        路线信息
        <div
          v-show="routeInfo.code && whichType === 'add'"
          class="addCoRoute__replace"
        >
          <img src="@/assets/images/icon/icon-replace.png" alt="" />
          <el-button type="text" @click="openRouteDialog"> 更换路线 </el-button>
        </div>
      </div>
      <div
        v-show="!routeInfo.code && whichType === 'add'"
        class="addCoRoute__add"
        @click="openRouteDialog"
      >
        <img src="@/assets/images/icon/icon-add.png" alt="" />
        选择路线
      </div>
      <div v-show="routeInfo.code" class="addCoRoute__route">
        <div class="loading">
          <img
            class="icon"
            src="@/assets/images/icon/icon-address-start.png"
            alt=""
          />
          <div class="address-info">
            <div class="address-detail">
              {{ routeInfo.loadingAddressFormatted }}
            </div>
            <div class="address-alias">
              {{ routeInfo.loadingAddressAlias }}
            </div>
            <div class="address-user">
              <span>{{ routeInfo.loadingAddressContact }}</span>
              <span>{{ routeInfo.loadingAddressContactPhone }}</span>
            </div>
          </div>
        </div>
        <div class="unloading">
          <img
            class="icon"
            src="@/assets/images/icon/icon-address-end.png"
            alt=""
          />
          <div class="address-info">
            <div class="address-detail">
              {{ routeInfo.unloadingAddressFormatted }}
            </div>
            <div class="address-alias">
              {{ routeInfo.unloadingAddressAlias }}
            </div>
            <div class="address-user">
              <span>{{ routeInfo.unloadingAddressContact }}</span>
              <span>{{ routeInfo.unloadingAddressContactPhone }}</span>
            </div>
          </div>
        </div>
      </div>
      <el-form
        ref="form"
        :model="rules"
        label-width="90px"
        :rules="rules"
        label-position="top"
      >
        <div class="addCoRoute__title">费用信息</div>
        <div
          class="addCoRoute__wrapper"
          v-for="(item, index) in goodsInfoList"
          :key="index"
        >
          <div class="addCoRoute__bar" @click="item.show = !item.show">
            <div class="barBox">
              <div class="num">{{ index + 1 }}</div>
              <span class="type">货品类型</span>
            </div>
            <div class="barBox">
              <span
                v-show="whichType !== 'detail'"
                class="del"
                @click.stop="onDelGoods(index)"
              >
                删除
              </span>
              <img
                v-show="item.show"
                src="@/assets/images/icon/icon-arrow-up.png"
                alt=""
              />
              <img
                v-show="!item.show"
                src="@/assets/images/icon/icon-arrow-down.png"
                alt=""
              />
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="item.show">
              <div class="addCoRoute__box">
                <el-form-item label="货品类型" prop="goodsCode">
                  <el-select
                    class="w256"
                    v-model="item.goodsCode"
                    filterable
                     clearable
                    placeholder="请选择"
                    :disabled="whichType === 'detail'"
                  >
                    <el-option
                      v-for="item in goodsList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item label="运费单价" prop="goodsFreightPrice">
                      <el-input
                        class="w256"
                        v-model="item.goodsFreightPrice"
                        placeholder="请输入"
                         clearable
                        :disabled="whichType === 'detail'"
                      >
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="司机运费" prop="driverFreightPrice">
                      <el-input
                        class="w256"
                         clearable
                        v-model="item.driverFreightPrice"
                        placeholder="请输入"
                        :disabled="whichType === 'detail'"
                      >
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div
          v-show="whichType !== 'detail'"
          class="addCoRoute__addBar"
          @click="onAddGoods"
        >
          <img src="@/assets/images/icon/icon-add1.png" alt="" />
          其他货品，再来一条
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button v-show="whichType === 'add'" type="primary" @click="onSave">
          保 存
        </el-button>
        <el-button
          v-show="whichType === 'update'"
          type="primary"
          @click="onUpdate"
        >
          修 改
        </el-button>
        <el-button
          v-show="whichType === 'detail'"
          type="primary"
          @click="onClose"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 选择企业弹窗 -->
    <el-dialog
      title="选择企业"
      :visible.sync="companyDialog"
      width="400px"
      :before-close="closeCompanyDialog"
    >
      <!-- <div slot="title">
       <span>选择常用企业</span>
       <img src="" alt="">
     </div> -->
      <CompanyItem
        v-if="companyDialog"
        @companySelection="companySelection"
        @handleInnerClose="closeCompanyDialog"
      />
    </el-dialog>

    <ChooseRoute ref="chooseRoute" @onSelectRoute="onSelectRoute" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import CompanyItem from '../../../dispatch/order/components/companyItem.vue'
import ChooseRoute from './chooseRoute.vue'

export default {
  name: 'AddCoRoute',
  components: {
    CompanyItem,
    ChooseRoute
  },
  data() {
    return {
      visible: false,
      companyDialog: false,
      routeDialig: false,
      whichType: '',
      companyInfo: {},
      routeInfo: {},
      goodsList: [],
      goodsInfoList: [
        {
          show: true,
          goodsCode: '',
          goodsFreightPrice: '', // 货品运费单价
          driverFreightPrice: '' // 司机运费价格
        }
      ],
      delCode: [],
      rules: {
        // goodsCode: [
        //   {
        //     required: true,
        //     message: '请选择货品类型',
        //     trigger: ['blur', 'change']
        //   }
        // ],
        // goodsFreightPrice: [
        //   {
        //     required: true,
        //     message: '运费单价不能为空',
        //     trigger: ['blur', 'change']
        //   }
        // ],
        // driverFreightPrice: [
        //   {
        //     required: true,
        //     message: '司机运费不能为空',
        //     trigger: ['blur', 'change']
        //   }
        // ]
      }
    }
  },
  created() {},
  methods: {
    open() {
      this.whichType = 'add'
      this.visible = true
      this.queryGoods()
    },
    onClose() {
      this.resetForm('form')
      this.onReset()
      this.$emit('onEvent')
      this.visible = false
    },
    onReset() {
      this.companyInfo = {}
      this.routeInfo = {}
      this.goodsInfoList = [
        {
          show: true,
          goodsCode: '',
          goodsFreightPrice: '', // 货品运费单价
          driverFreightPrice: '' // 司机运费价格
        }
      ]
    },
    getDetailInfo(routeCode, shipmentCode, whichType) {
      this.whichType = whichType
      this.visible = true
      this.queryGoods()
      const params = {
        moduleName: 'http_coRoute',
        method: 'get',
        url_alias: 'coRoute_get',
        data: {
          routeCode,
          shipmentCode
        }
      }
      http_request(params).then((res) => {
        console.log('dasdasd', res)
        if (res.data) {
          this.companyInfo = res.data.commonShipment || {}
          this.routeInfo = res.data.transitRouteInfo || {}
          let goodsInfoList = res.data.companyTransitRouteGoodsPriceInfo || []
          goodsInfoList.forEach((item, index) => {
            item.show = index === 0
          })
          this.goodsInfoList = goodsInfoList
        }
      })
    },
    // 选择企业
    companySelection(data) {
      this.companyInfo = data
    },
    // 关闭选择企业弹窗
    closeCompanyDialog() {
      this.companyDialog = false
    },
    // 打开路线弹窗
    openRouteDialog() {
      this.$refs.chooseRoute.open()
    },
    onSelectRoute(data) {
      console.log('123', data)
      this.routeInfo = data
    },
    // 查询商品列表
    queryGoods() {
      const params = {
        moduleName: 'http_coRoute',
        method: 'get',
        url_alias: 'coRoute_goods'
      }
      http_request(params).then((res) => {
        this.goodsList = res.data || []
      })
    },
    // 点击删除货品
    onDelGoods(index) {
      this.delCode.push(this.goodsInfoList[index].code)
      this.goodsInfoList.splice(index, 1)
    },
    // 点击增加货品
    onAddGoods() {
      this.goodsInfoList.push({
        show: true,
        goodsCode: '',
        goodsFreightPrice: '',
        driverFreightPrice: ''
      })
    },
    // 点击保存
    onSave() {
      if (this.checkSave()) {
        // 校验成功
        const obj = {
          moduleName: 'http_coRoute',
          method: 'post',
          url_alias: 'coRoute_add',
          data: {
            companyTransitRouteInfo: {
              routeCode: this.routeInfo.code,
              shipmentCode: this.companyInfo.code
            },
            companyTransitRouteGoodsPriceInfo: this.goodsInfoList
          }
        }
        http_request(obj).then((res) => {
          if (res.code != '200') {
            this.msgError('企业路线新增失败')
          } else {
            this.msgSuccess('企业路线新增成功')
          }
          this.onClose()
        })
      }
    },
    // 点击修改
    onUpdate() {
      if (this.checkSave()) {
        let companyTransitRouteGoodsPriceInfo = []
        this.goodsInfoList.forEach((item) => {
          companyTransitRouteGoodsPriceInfo.push({
            ...item,
            routeCode: this.routeInfo.code,
            shipmentCode: this.companyInfo.code
          })
        })
        // 校验成功
        const obj = {
          moduleName: 'http_coRoute',
          method: 'put',
          url_alias: 'coRoute_update',
          data: {
            companyTransitRouteGoodsPriceInfo,
            delCode: this.delCode
          }
        }
        http_request(obj).then((res) => {
          if (res.code != '200') {
            this.msgError('企业路线更新失败')
          } else {
            this.msgSuccess('企业路线更新成功')
          }
          this.onClose()
        })
      }
    },
    // 校验保存
    checkSave() {
      if (!this.companyInfo || !this.companyInfo.code) {
        this.$message.error('请选择企业')
        return false
      }
      if (!this.routeInfo || !this.routeInfo.code) {
        this.$message.error('请选择路线')
        return false
      }
      let length = this.goodsInfoList.length
      for (let i = 0; i < length; i++) {
        let data = this.goodsInfoList[i]
        if (
          !data.goodsCode ||
          !data.goodsFreightPrice ||
          !data.driverFreightPrice
        ) {
          this.$message.error('请完善货品信息')
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.addCoRoute {
  &__title {
    font-size: 14px;
    font-weight: bold;
    color: #262626;
    border-left: 4px solid #4682fa;
    padding-left: 8px;
    margin: 15px 0;
    position: relative;
  }
  &__replace {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    img {
      width: 20px;
      height: 20px;
    }
  }
  &__add {
    width: 100%;
    height: 95px;
    border: 1px dashed #e3e3e3;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    color: #4682fa;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }
  &__company {
    width: 408px;
    height: 70px;
    padding: 10px 15px;
    background: linear-gradient(
      89deg,
      rgba(139, 162, 208, 0.2) 0%,
      rgba(177, 195, 230, 0.2) 100%
    );
    border-radius: 6px;
    p {
      font-size: 16px;
      font-weight: bold;
      color: #3d4050;
      margin-bottom: 5px;
    }
    .userInfo {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #999999;
      img {
        width: 18px;
        height: 18px;
      }
      .username {
        margin: 0 10px;
      }
    }
  }
  &__route {
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 7px;
    }
    .address-info {
      width: 100%;
      height: 105px;
      padding: 15px 20px;
      background: #f8f8f8;
      border-radius: 4px;
    }
    .address-detail {
      font-size: 14px;
      font-family: PingFang SC;
      color: #3d4050;
    }
    .address-alias {
      font-size: 16px;
      font-weight: bold;
      color: #3d4050;
      margin-top: 6px;
    }
    .address-user {
      font-size: 14px;
      color: #999999;
      margin-top: 6px;
      span:first-child {
        margin-right: 5px;
      }
    }
    .loading,
    .unloading {
      display: flex;
    }
    .loading {
      margin-bottom: 18px;
    }
  }
  &__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
    .barBox {
      display: flex;
      align-items: center;
    }
    .num {
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: rgba(70, 130, 250, 0.36);
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
      color: #4682fa;
      margin-right: 8px;
    }
    .type {
      font-size: 14px;
      font-weight: bold;
      color: #3d4050;
    }
    .del {
      font-size: 14px;
      font-weight: bold;
      color: #ef6969;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  &__box {
    padding: 10px 20px;
    background: #f8f8f8;
    border-radius: 5px;
  }
  &__addBar {
    font-size: 14px;
    font-weight: bold;
    color: #4682fa;
    margin: 12px 0;
    display: flex;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
}
.w256 {
  width: 256px;
}
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
</style>

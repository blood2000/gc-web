<template>
  <!-- 企业路线 -->
  <div class="pages-info">
    <div class="pages-info-left">
      <div class="coRoute-left__title">用车企业</div>
      <div class="coRoute-left__wrapper">
        <div
          class="coRoute-left__box"
          :class="{ 'coRoute-left__box-show': item.code === currentCompany }"
          @click="onClickCompany(item.code)"
          v-for="item in companyList"
          :key="item.id"
        >
          <img class="normal" src="@/assets/images/icon/company_normal.png" alt="" />
          <img class="active" src="@/assets/images/icon/company_active.png" alt="" />
          <span class="g-double-row">{{ item.shipmentName }}</span>
        </div>
      </div>
    </div>
    <div class="pages-info-right">
      <el-button type="primary" size="small" @click="onAddCoRoute">添加企业路线</el-button>
      <div class="coRoute-right__wrapper">
        <div class="coRoute-right__box" v-for="(item, index) in coRouteList" :key="index">
          <div class="coRoute-right__box-top">
            <div class="coRoute-right__box-bar">
              <img src="@/assets/images/icon/icon-route.png" alt="" />
              <span class="g-single-row">{{ item.routeName }}</span>
              <el-dropdown class="coRoute-right__box-more">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="onClickChange(item)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="onClickDel(item)">删除</el-dropdown-item>
                  <el-dropdown-item @click.native="onClickDetail(item)">详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="coRoute-right__box-mid">
            <div class="coRoute-right__box-address">
              <div class="left">
                <div class="round"></div>
                <div class="line"></div>
              </div>
              <div class="right">
                <div class="address g-double-row">
                  {{ item.loadingAddressAlias || item.loadingAddressFormatted }}
                </div>
                <div class="user">
                  <span>{{ item.loadingAddressContact }}</span>
                  <span>{{ item.loadingAddressContactPhone }}</span>
                </div>
              </div>
            </div>
            <div class="coRoute-right__box-address coRoute-right__box-address2">
              <div class="left">
                <div class="round"></div>
              </div>
              <div class="right">
                <div class="address g-double-row">
                  {{ item.unloadingAddressAlias || item.unloadingAddressFormatted }}
                </div>
                <div class="user">
                  <span>{{ item.unloadingAddressContact }}</span>
                  <span>{{ item.unloadingAddressContactPhone }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-show="!item.goodsCode" class="coRoute-right__box-bottom-none">
            <div class="bar">
              <img src="@/assets/images/icon/icon-warn-gray.png" alt="" />
              <span class="more">暂未录入货品信息</span>
            </div>
          </div>
          <div v-show="item.goodsCode" class="coRoute-right__box-bottom">
            <div class="bar">
              <div class="left">
                <img src="@/assets/images/icon/icon-goods.png" alt="" />
                <span class="goodsName">{{ item.goodsName }}</span>
              </div>
              <div class="right">
                <img src="@/assets/images/icon/icon-warn.png" alt="" />
                <span class="more">更多货品，请进入详情查看</span>
              </div>
            </div>
            <div class="bar">
              <div class="price">
                运费单价：<span>{{ item.goodsFreightPrice }}</span>
              </div>
              <div class="price">
                司机运费：<span>{{ item.driverFreightPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <pagination
        :total="total"
      v-show="total>0"
        layout="prev, pager, next,jumper, total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="onChangePage"
      />
    </div>

    <AddCoRoute ref="addCoRoute" @onEvent="queryCoRoutePage" />
  </div>
</template>

<script>
import { http_request } from '@/api'
import AddCoRoute from './components/addCoRoute.vue'

export default {
  name: 'CoRoute',
  components: {
    AddCoRoute,
  },
  data() {
    return {
      companyList: [],
      currentCompany: null,
      coRouteList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.queryShipmentAlllist()
  },
  methods: {
    queryShipmentAlllist() {
      const params = {
        moduleName: 'http_company',
        method: 'get',
        url_alias: 'shipment_Alllist',
      }
      http_request(params).then((res) => {
        this.companyList = res.data || []
        if (this.companyList.length > 0) {
          this.currentCompany = this.companyList[0].code
          this.queryCoRoutePage()
        }
      })
    },
    queryCoRoutePage() {
      const params = {
        moduleName: 'http_coRoute',
        method: 'post',
        url_alias: 'coRoute_page',
        data: {
          shipmentCode: this.currentCompany,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      }
      http_request(params).then((res) => {
        const data = res.data
        if (data) {
          this.coRouteList = data.rows || []
          this.pageNum = data.pageNum
          this.total = data.total
        }
      })
    },
    onAddCoRoute() {
      this.$refs.addCoRoute.open()
    },
    // 点击了修改
    onClickChange(coRoute) {
      this.$refs.addCoRoute.getDetailInfo(coRoute.routeCode, coRoute.shipmentCode, 'update')
    },
    // 点击了详情
    onClickDetail(coRoute) {
      this.$refs.addCoRoute.getDetailInfo(coRoute.routeCode, coRoute.shipmentCode, 'detail')
    },
    // 点击了删除
    onClickDel(coRoute) {
      this.$confirm('删除操作不可恢复，确认要删除该企业路线吗？', '确认要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._delRoute(coRoute)
        })
        .catch(() => {})
    },
    _delRoute(coRoute) {
      const obj = {
        moduleName: 'http_coRoute',
        method: 'delete',
        url_alias: 'coRoute_del',
        data: {
          companyCode: coRoute.companyCode,
          routeCode: coRoute.routeCode,
          shipmentCode: coRoute.shipmentCode,
        },
        query: true,
      }
      http_request(obj).then((res) => {
        this.$message.success(res.msg)
        this.pageNum = 1
        this.queryCoRoutePage()
      })
    },
    onChangePage() {
      this.queryCoRoutePage()
    },
    onClickCompany(code) {
      this.currentCompany = code
      this.pageNum = 1
      this.queryCoRoutePage()
    },
  },
}
</script>

<style lang="scss" scoped>
    .coRoute-left__wrapper {
      background: #fff;
      height: calc(100vh - 200px);
    overflow: auto;
    }
    .coRoute-left__title {
      height: 55px;
      line-height: 55px;
      padding-left: 16px;
      font-size: 18px;
      font-weight: bold;
      color: #3d4050;
    }
    .coRoute-left__box {
      margin: 10px 0;
      padding: 10px 16px;
      display: flex;
      cursor: pointer;


      img {
        width: 14px;
        height: 14px;
        margin: 3px 10px 0 0;
      }
      .normal {
        display: block;
      }
      .active {
        display: none;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        color: #3d4050;
      }
      &:hover {
        border-right: 2px solid #4682fa;
        background: rgba(70, 130, 250, 0.08);
        span {
          color: #4682fa;
          font-weight: bold;
        }
        .normal {
          display: none;
        }
        .active {
          display: block;
        }
      }
    }
    .coRoute-left__box-show {
      border-right: 2px solid #4682fa;
      background: rgba(70, 130, 250, 0.08);
      span {
        color: #4682fa;
        font-weight: bold;
      }
      .normal {
        display: none;
      }
      .active {
        display: block;
      }
    }

    .coRoute-right__wrapper {
      margin-left: -10px;
      padding-top: 20px;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      height: calc(100vh - 250px)
    }
    .coRoute-right__box {
      width: 32%;
      height: 296px;
      background: #ffffff;
      border-radius: 6px;
      margin: 0 1.3% 20px 0;
              box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
      &-top {
        height: 56px;
        padding: 0 5px;
      }
      &-bar {
        height: 100%;
        padding: 0 45px 0 8px;
        position: relative;
        border-bottom: 1px dashed #e0e0e0;
        font-size: 18px;
        font-weight: bold;
        color: #3d4050;
        display: flex;
        align-items: center;
        img {
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }
      }
      &-more {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
      }
      &-mid {
        z-index: 1;
        padding-top: 13px;
        background: #fff;
        position: relative;
        border-radius: 0 0 6px 6px;
      }
      &-address {
        display: flex;
        padding-right: 37px;
        .left {
          width: 37px;
          height: 78px;
          position: relative;
          div {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }
          .round {
            width: 6px;
            height: 6px;
            top: 8px;
            border-radius: 100%;
            background: #ffbc00;
          }
          .line {
            width: 1px;
            height: 64px;
            top: 18px;
            background: #ddd;
          }
        }
        .right {
          width: 0;
          flex: 1 1 auto;
          .address {
            font-size: 14px;
            font-weight: bold;
            color: #3d4050;
          }
          .user {
            font-size: 14px;
            color: #7e7f81;
            margin-top: 5px;
            span:first-child {
              margin-right: 5px;
            }
          }
        }
      }
      &-address2 {
        .round {
          background: #4682fa !important;
        }
      }
      &-bottom-none {
        width: 100%;
        height: 92px;
        position: relative;
        border-radius: 6px;
        background: linear-gradient(93deg, #ebebeb 0%, #f0f0f0 100%);
        margin-top: -20px;
        padding: 0 14px;
        overflow: hidden;
        .bar {
          font-size: 16px;
          color: #a3a3a3;
          margin-top: 45px;
          display: flex;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }
        }
      }
      &-bottom {
        width: 100%;
        height: 92px;
        position: relative;
        border-radius: 6px;
        background: url('~@/assets/images/index/company_card_bg.png') no-repeat,
          linear-gradient(89deg, #8ba2d0 0%, #b1c3e6 100%);
        margin-top: -20px;
        padding: 30px 14px 0 14px;
        .bar {
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 3px;
        }
        .left {
          display: flex;
          align-items: center;
          img {
            width: 19px;
            height: 19px;
          }
          .goodsName {
            font-size: 18px;
            font-weight: bold;
          }
          .more {
            font-size: 14px;
          }
        }
        .right {
          display: flex;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }
        }
        .price {
          font-size: 14px;
          span {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  .pages-info-right{
    padding: 20px;
  }
  .pages-info-left{
    padding: 0;
  }
  .pagination-container {
    background: none;
  }
</style>

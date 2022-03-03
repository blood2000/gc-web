<template>
  <!-- 常用路线 -->
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <!-- 搜索区域 -->
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="68px"
        @submit.native.prevent
        class="ddc-queryParams"
        label-position="top"
      >
        <div class="ddc-queryParams-left">
          <div class="up">
            <el-form-item label="路线名称" prop="routeName">
              <el-input
                v-model="queryParams.routeName"
                placeholder="请输入路线名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
            <el-form-item label="联系人姓名" prop="contact">
              <el-input
                v-model="queryParams.contact"
                placeholder="请输入联系人姓名"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
            <el-form-item label="联系人电话" prop="contactPhone">
              <el-input
                v-model="queryParams.contactPhone"
                placeholder="请输入联系人电话"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </div>
        </div>
        <div class="ddc-queryParams-right">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="onSearch"
            >
              搜索
            </el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              size="mini"
              class="ddc-queryParams-right-reset"
              @click="onReset"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 分页查询区域 -->
      <div class="route-container">
        <el-button type="primary" size="small" @click="openAddRoute">
          添加路线
        </el-button>
        <div class="route-wrapper">
          <div class="route-box" v-for="item in routeList" :key="item.id">
            <div class="route-box__top">
              <div class="route-box__bar">
                <img src="@/assets/images/icon/icon-route.png" alt="" />
                <span class="g-single-row">{{ item.routeName }}</span>
                <el-dropdown class="route-box__more">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="onClickChange(item.id)">
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="onClickDel(item.id)">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="route-box__bottom">
              <div class="route-box__address">
                <div class="left">
                  <div class="round"></div>
                  <div class="line"></div>
                </div>
                <div class="right">
                  <div class="address g-double-row">
                    {{ item.loadingAddressAlias }}
                  </div>
                  <div class="user">
                    <span>{{ item.loadingAddressContact }}</span>
                    <span>{{ item.loadingAddressContactPhone }}</span>
                  </div>
                </div>
              </div>
              <div class="route-box__address route-box__address2">
                <div class="left">
                  <div class="round"></div>
                </div>
                <div class="right">
                  <div class="address g-double-row">
                    {{ item.unloadingAddressAlias }}
                  </div>
                  <div class="user">
                    <span>{{ item.unloadingAddressContact }}</span>
                    <span>{{ item.unloadingAddressContactPhone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <pagination
          :total="total"
          layout="prev, pager, next,jumper, total"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="onChangePage"
        />
      </div>
    </div>
    <!-- 新增路线 -->
    <AddRoute ref="addRoute" @onEvent="getRoutePage" />
  </div>
</template>

<script>
import { http_request } from "@/api";
import AddRoute from "./components/AddRoute.vue";

export default {
  name: "Route",
  components: {
    AddRoute,
  },
  data() {
    return {
      queryParams: {
        routeName: "", // 路线名称
        contact: "", // 联系人姓名
        contactPhone: "", // 联系人电话
      },
      routeList: [], // 路线列表
      pageNum: 1,
      pageSize: 12,
      total: 0,
    };
  },
  created() {
    this.getRoutePage();
  },
  methods: {
    // 点击搜索
    onSearch() {
      this.pageNum = 1;
      this.getRoutePage();
    },
    // 点重置
    onReset() {
      this.pageNum = 1;
      this.resetForm("queryForm");
      this.getRoutePage();
    },
    // 点击添加路径
    openAddRoute() {
      this.$refs.addRoute.open();
    },
    // 点页面
    onChangePage() {
      this.getRoutePage();
    },
    getRoutePage() {
      const obj = {
        moduleName: "http_route",
        method: "post",
        url_alias: "route_page",
        data: {
          ...this.queryParams,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
      };
      http_request(obj).then((res) => {
        if (res.data) {
          this.routeList = res.data.rows || [];
          this.total = res.data.total;
        }
      });
    },
    // 点击修改
    onClickChange(id) {
      this.$refs.addRoute.setRouteDetail(id);
    },
    // 点击删除
    onClickDel(id) {
      this.$confirm(
        "删除操作不可恢复，确认要删除该路线吗？",
        "确认要删除吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this._delRoute(id);
        })
        .catch(() => {});
    },
    _delRoute(id) {
      const obj = {
        moduleName: "http_route",
        method: "delete",
        url_alias: "route_del",
        url_code: [id],
      };
      http_request(obj).then((res) => {
        this.$message.success(res.msg);
        this.getRoutePage();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ddc-queryParams {
  padding: 0 20px;
  border-bottom: 1px solid #dce3e9;
}
.route-container {
  padding: 20px;
  .route-wrapper {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: calc(100vh - 360px);
  }
  .route-box {
    width: 24%;
    height: 224px;
    background: #ffffff;
    border-radius: 6px;
    margin: 0 1% 20px 0;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    border-radius: 3px;

    &__top {
      height: 56px;
      padding: 0 5px;
    }
    &__bar {
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
    &__more {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
    &__bottom {
      padding-top: 13px;
    }
    &__address {
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
    &__address2 {
      .round {
        background: #4682fa !important;
      }
    }
  }
}
.pagination-container {
  background: none;
}
</style>

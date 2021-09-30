<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :dispatch-order-status-list="dispatchOrderStatusList"
        :goods-type-list="goodsTypeList"
        @handleQuery="searchQuery"
      />
    </div>
    <div class="app-container">
      <!-- 操作栏 -->
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="searchQuery"
        style="margin-bottom: 10px"
      />
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        row-key="id"
        highlight-current-row
        border
        default-expand-all
        :data="tableData"
      >
        <template v-for="(item, index) in tableColumnsConfig">
          <el-table-column
            v-if="item.prop == 'edit'"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="item.tooltip"
            :width="item.width || '180'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleDispatch(scope.row)"
                >派车</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-position"
                @click="handleCarlog(scope.row)"
                >派车记录</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'dispatchOrderStatus'"
            v-show="item.isShow"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="item.tooltip"
            :width="item.width || '180'"
          >
            <template slot-scope="scope">
              <span
                :style="{
                  color: dealDispatchOrderStatus(
                    scope.row.dispatchOrderStatus,
                    'color'
                  ),
                }"
                >{{
                  dealDispatchOrderStatus(scope.row.dispatchOrderStatus, "text")
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            v-else
            v-show="item.isShow"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="item.tooltip"
            :width="item.width || '180'"
          >
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->

      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { dispatchOrderStatusList, tableColumnsConfig } from "./order_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
import { listByDict } from "../../../api/system/dict/data.js";
export default {
  name: "order",
  components: { QueryForm },
  data() {
    return {
      showSearch: true,
      loading: false,
      queryParams: {
        pageNum: 1, //页码
        pageSize: 10, //每页显示条数
        shipmentNameOrCompanyName: null, //下单用户
        loadFormattedAddress: null, //装货地址
        unloadFormattedAddress: null, //卸货地址
        dispatchOrderNo: null, //调度单号
        goodsType: null, //货品类型
        source: null, //来源
        dateRange: [],
        // startDate: "", //创建开始时间 yyyy-MM-dd
        // endDate: "", //创建结束时间 yyyy-MM-dd
        remark: null, //备注
        dispatchOrderStatus: null,
      },
      total: 0,
      dispatchOrderStatusList,
      tableColumnsConfig,
      tableData: [],
      goodsTypeList: [],
    };
  },
  created() {
    const me = this;
    console.log("tableColumnsConfig", tableColumnsConfig);
    listByDict({
      // dictPid: "344",
      dictType: "goodsType",
    }).then((res) => {
      console.log("res", res);
      me.$store.commit("set_goodsTypeList", res.data);
      console.log(111, me.$store.state.dict.goodsTypeList);
      me.goodsTypeList = me.$store.state.dict.goodsTypeList;
    });
  },
  mounted() {
    this.searchQuery();
  },
  methods: {
    dealDispatchOrderStatus(val, type) {
      let result = "";
      for (const item of dispatchOrderStatusList) {
        if (item.value == val) {
          type === "text" ? (result = item.label) : (result = item.color);
        }
      }
      return result;
    },
    handleCarlog(data) {
      const code = data.dispatchOrderCode;
      console.log(this.$router);
      this.$router.push("/dispatch/recode?code=" + code);
    },
    handleDetail(data) {
      const code = data.dispatchOrderCode;
      this.$router.push("order/detail?code=" + code);
    },
    handleDispatch(data) {
      //dispatch/order/car
      console.log("data", data);
      const code = data.dispatchOrderCode;
      this.$router.push("order/car?code=" + code);
    },
    formToPaging() {
      const tmp = { ...this.queryParams };
      if (tmp.dispatchOrderStatus != null) {
        const statusList = [];
        statusList.push(tmp.dispatchOrderStatus);
        tmp.dispatchOrderStatus = statusList;
      }
      if (tmp.dateRange) {
        tmp.startDate = tmp.dateRange[0];
        tmp.endDate = tmp.dateRange[1];
        delete tmp.dateRange;
      }
      if (
        tmp.dispatchOrderStatus &&
        tmp.dispatchOrderStatus.length == 1 &&
        !tmp.dispatchOrderStatus[0]
      ) {
        delete tmp.dispatchOrderStatus;
      }

      for (const item in tmp) {
        if (!tmp[item]) {
          delete tmp[item];
        }
      }
      console.log("tmp", tmp);
      return tmp;
    },
    async getList() {
      this.loading = true;
      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "paging_dispatch",
        data: this.formToPaging(),
      };
      const res = await http_request(obj);
      console.log("geatlist ===>", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.device-info {
  margin: 0 15px;
  @mixin box-shadow {
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left {
    @include box-shadow;
    min-height: calc(100vh - 146px);
  }

  .device-info-right {
    .device-info-right-top {
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom {
      @include box-shadow;
    }
  }
}
.table-colunm {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
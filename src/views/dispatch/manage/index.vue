<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :status-list="statusList"
        @handleQuery="searchQuery"
      />
    </div>
    <div class="app-container">
      <!-- 操作栏 -->
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="searchQuery"
        style="marginbottom: 10px"
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
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'status'"
            v-show="item.isShow"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="item.tooltip"
            :width="item.width || '180'"
          >
            <template slot-scope="scope">
              <span>{{ dealSattus(scope.row.status) }}</span>
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
import { statusList, tableColumnsConfig } from "./manage_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
export default {
  name: "manage",
  components: { QueryForm },
  data() {
    return {
      showSearch: true,
      loading: false,
      queryParams: {
        pageNum: 1, //页码
        pageSize: 10, //每页显示条数
        appointCarRecordCode: null, //派单记录Code
        appointCarOrderNo: null, //派单号
        shipmentName: null, //下单客户
        companyName: null, //用车企业
        loadAddress: null, //装货地址
        unloadAddress: null, //卸货地址
        vehicleNumber: null, //车牌
        status: null, //状态
        driverName: null, //司机名称
        driverPhone: null, //司机电话
        // orderNo: null, //货源单号
        // waybillNo: null, //运单号
        // source: null, //来源 chy
      },
      total: 0,
      tableColumnsConfig,
      tableData: [],
      statusList,
    };
  },
  created() {
    console.log("tableColumnsConfig", this.tableColumnsConfig);
  },
  mounted() {
    console.log("document.location.search", document.location.search);
    if (document.location.search.includes("code")) {
      this.queryParams.appointCarRecordCode =
        document.location.search.split("=")[1];
      console.log("code", this.queryParams.appointCarRecordCode);
    }
    this.searchQuery();
  },
  methods: {
    dealSattus(val) {
      let result = "";
      for (const item of statusList) {
        if (item.value == val) {
          result = item.label;
        }
      }
      return result;
    },
    handleDetail(data) {
      console.log("manage data", data);
      const code = data.appointCarOrderCode;
      this.$router.push("manage/detail?code=" + code);
    },

    async getList() {
      this.loading = true
      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "car_order",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      console.log("geatlist ===>", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      this.loading = false
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
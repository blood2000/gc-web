<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :goods-type-list="goodsTypeList"
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
                icon="el-icon-position"
                @click="handleCarlog(scope.row)"
                >查看派车单</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDetail(scope.row)"
                >详情</el-button
              >
              <el-button size="mini" type="text" @click="handleDel(scope.row)"
                >删除</el-button
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
import { tableColumnsConfig } from "./recode_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
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
        dispatchOrderCode: null, //调度单编号
        dispatchOrderNo: null, //调度单号
        loadAddress: null, //装货地址
        unloadAddress: null, //卸货地址
        driverNameOrPhone: null, //司机姓名或电话
        vehicleNumber: null, //车牌
        goodsType: null, //货品类型
        appointCarDate: null, //派车时间 yyyy-MM-dd
      },
      total: 0,
      tableColumnsConfig,
      tableData: [],
      goodsTypeList: [],
    };
  },
  created() {
    console.log("tableColumnsConfig", tableColumnsConfig);
  },
  mounted() {
    console.log("document.location.search", document.location.search);
    if (document.location.search.includes("code")) {
      this.queryParams.dispatchOrderCode =
        document.location.search.split("=")[1];
      console.log("code", this.queryParams.dispatchOrderCode);
    }
    this.searchQuery();
  },
  methods: {
    handleDel(data) {
      console.log("data", data);
      const codes = data.appointCarOrderCode;

      this.$confirm("是否确认删除此项数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const obj = {
            moduleName: "http_dispatch",
            method: "delete",
            url_alias: "del_by_codes",
            url_code: [codes],
          };
          return http_request(obj);
        })
        .then(() => {
          this.searchQuery();
          this.msgSuccess("删除成功");
        });
    },
    handleCarlog(data) {
      console.log("data", data);
      const code = data.appointCarRecordCode;
      this.$router.push("/dispatch/manage?code=" + code);
    },
    handleDetail(data) {
      const code = data.appointCarRecordCode;
      console.log('????',code)
      this.$router.push("recode/detail?code=" + code);
    },
    async getList() {
      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "paging_appoint_car_record",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      console.log("geatlist ===>", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
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
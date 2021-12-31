<template>
  <div class="monitor-pages-info">
    <div class="monitor-pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm v-model="queryParams" @handleQuery="searchQuery" />
      <el-tabs
        class="monitor-pages-info-right-tab"
        v-model="queryParams.isDel"
        @tab-click="handleTab"
      >
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane label="删除" name="1"></el-tab-pane>
      </el-tabs>
      <div class="monitor-pages-info-right-content">
        <div>
          <el-button type="primary" @click="handleAdd">添加磅单</el-button>
        </div>
        <div class="page-table-layout-set">
          <div
            class="page-table-layout-set-item"
            :key="index"
            v-for="(item, index) in list"
          >
            <ItemCard
              :data="item"
              @handleDetail="handleDetail(item.code)"
              @handleUpdate="handleUpdate(item.code)"
              @handleDelete="handleDelete(item.code)"
            />
          </div>
        </div>

        <pagination
          v-show="total > 12"
          :total="total"
          layout="prev, pager, next,jumper, total,sizes"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[12, 24, 36, 60]"
          @pagination="getList"
        />
      </div>
    </div>
    <Detail
      :detailDrawer="detailDrawer"
      @closeDetail="closeDetail"
      :code="currCode"
      :options="{}"
    />
    <WeightDialog
      :options="options"
      :code="currCode"
      :open="open"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { http_request } from "../../api";
import QueryForm from "./components/queryForm.vue";
import ItemCard from "./components/itemCard.vue";
import Detail from "./components/detail.vue";
import WeightDialog from "./components/weight_dialog.vue";
export default {
  name: "weight",
  components: { QueryForm, ItemCard, Detail, WeightDialog },
  data() {
    return {
      loading: false, //分页请求加载
      currCode: "", //当前code
      list: [], //分页数据
      total: 0, //总条数
      open: false,
      options: {
        title: "添加磅单",
        editType: false,
      },
      activeName: "first", //标签tab选中
      detailDrawer: false, //详情抽屉
      queryParams: {
        //分页搜索数据
        pageNum: 1,
        pageSize: 12,
        vehicleNumber: null,
        driverNameOrPhone: null,
        dateRange: [],
        companyName:null,
        routeCode: null,
        goodsCode: null,
        isDel: "-1",
      },
    };
  },
  mounted() {
    this.searchQuery();
  },
  methods: {
    handleAdd() {
      this.options.title = "添加磅单";
      this.options.editType = false;
      this.currCode = null;
      this.open = true;
    },
    handleUpdate(code) {
      this.options.title = "修改磅单";
      this.options.editType = true;
      this.currCode = code;
      this.open = true;
      console.log("code", code);
    },
    handleDelete(code) {
      console.log("del code", code);
      //deleteWeighbridgeRecord
      this.$confirm("删除操作不可恢复，确认要删除该磅单吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const obj = {
          moduleName: "http_weight",
          method: "delete",
          url_alias: "deleteWeighbridgeRecord",
          url_code: [code],
        };
        http_request(obj).then((res) => {
          if (res && res.code == "200") {
            this.msgSuccess("删除成功");
          }
          this.searchQuery();
        });
      });
    },
    handleDetail(code) {
      console.log("123123");
      this.currCode = code;
      this.detailDrawer = true;
    },
    closeDialog(val) {
      this.open = false;
      if (val !== "no") {
        this.searchQuery();
      }
    },
    closeDetail() {
      this.detailDrawer = false;
    },
    handleTab(tab, event) {
      console.log("handleTab", event);
      this.searchQuery();
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_weight",
        method: "post",
        url_alias: "pagingWeighbridgeRecord",
        data: this.queryParamsToBody(),
      };
      const res = await http_request(obj);
      console.log("pagingWeighbridgeRecord", res);
      this.list = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    queryParamsToBody() {
      const tmp = { ...this.queryParams };
      if (tmp.isDel === "-1") {
        tmp.isDel = null;
      }
      if (tmp.dateRange) {
        tmp.startDate = tmp.dateRange[0];
        tmp.endDate = tmp.dateRange[1];
        delete tmp.dateRange;
        console.log("queryParamsToBody 参数", tmp);
        return tmp;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-pages-info {
  margin: 0 24px;
  display: flex;
  height: calc(100vh - 146px);
  margin: 0 20px 0 20px;
  &-tab {
    margin: 0 21px;
  }
  &-right {
    flex: 1 !important;
    overflow: auto;
    width: 0;
    background: #f0f2f5;
    box-sizing: border-box !important;
    ::v-deep .el-tabs__header {
      margin: 0 0 16px;
    }
  }
}
.page-table-layout-set {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  &-item {
    margin-right: 20px;
    margin-bottom: 20px;
  }
  //  &-item:nth-child(4n) {
  //   margin-right:0px;
  //   margin-bottom: 20px;
  // }
}
.menu-item {
  padding-right: 10px;
  color: #4682fa;
}
/deep/ .pagination-container {
  background: transparent;
  padding: 0;
}
</style>
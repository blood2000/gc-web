<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :status-list="statusList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <!-- 操作栏 -->
        <!-- <div class="toolsbar"></div> -->
        <!-- 表格 -->

        <RefactorTable
          is-show-index
          :loading="loading"
          :data="tableData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
          :height="getTableHeight"
        >
          <template #vehicleNumber="{ row }">
            {{
              row.vehicleAlias
                ? `(${row.vehicleAlias})  ${row.vehicleNumber}`
                : row.vehicleNumber
            }}
          </template>
          <template #edit="{ row }">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(row)"
              v-hasPermi="['transport:manage:detail']"
              >详情</el-button
            >
          </template>
          <!-- status -->
          <template #status="{ row }">
            <span>{{ dealSattus(row.status) }}</span>
          </template>
        </RefactorTable>
      </div>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <Detail
      :code="currCode"
      :detailDrawer="detailDrawer"
      :options="{ title: '派车单详情' }"
      @colseDetailDrawer="colseDetailDrawer"
    />
    <MyselfDetail
      :code="currCode"
      :detailDrawer="myselfdetailDrawer"
      :options="{ title: '派车单详情' }"
      @colseMyselfDetailDrawer="colseMyselfDetailDrawer"
    />
  </div>
</template>

<script>
import { statusList, tableColumnsConfig } from "./manage_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
import Detail from "./detail.vue";
import MyselfDetail from "./msselfDetail.vue";

export default {
  name: "manage",
  components: { QueryForm, Detail, MyselfDetail },
  data() {
    return {
      showSearch: true,
      loading: false,
      queryParams: {
        pageNum: 1, //页码
        pageSize: 10, //每页显示条数
        appointCarRecordCode: null, //派单记录Code
        appointCarRecordNo: null, //派单记录号
        appointCarOrderNo: null, //派单号
        shipmentName: null, //下单客户
        companyName: null, //用车企业
        loadAddress: null, //装货地址
        unloadAddress: null, //卸货地址
        vehicleNumber: null, //车牌
        status: null, //状态
        driverName: null, //司机名称
        driverPhone: null, //司机电话
        receiveTime: [],
        loadTime: [],
        unloadTime: [],
        // orderNo: null, //货源单号
        // waybillNo: null, //运单号
        // source: null, //来源 chy
      },
      total: 0,
      tableColumnsConfig,
      tableData: [],
      statusList,
      currCode: null,
      detailDrawer: false,
      myselfdetailDrawer: false,
    };
  },
  created() {
    console.log("tableColumnsConfig", this.tableColumnsConfig);
  },
  computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 250 - 222;
    },
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
      this.currCode = data.appointCarOrderCode;
      if (data.source === "chy") {
        this.detailDrawer = true;
      } else {
        this.myselfdetailDrawer = true;
      }
      console.log("manage data", data);
      // const code = data.appointCarOrderCode;
      // this.$router.push("manage/detail?code=" + code);
    },
    dealForm() {
      console.log('this.queryParams',this.queryParams)
        if (this.queryParams.receiveTime.length > 0) {
          this.queryParams.startReceiveTime = this.queryParams.receiveTime[0];
          this.queryParams.endReceiveTime = this.queryParams.receiveTime[1];
        } else {
          if (this.queryParams.startReceiveTime)
            delete this.queryParams.startReceiveTime;

          if (this.queryParams.endReceiveTime)
            delete this.queryParams.endReceiveTime;
        }
        if (this.queryParams.loadTime.length > 0) {
          this.queryParams.startLoadTime = this.queryParams.loadTime[0];
          this.queryParams.endLoadTime = this.queryParams.loadTime[1];
        } else {
          if (this.queryParams.startLoadTime)
            delete this.queryParams.startLoadTime;

          if (this.queryParams.endLoadTime) delete this.queryParams.endLoadTime;
        }
        if (this.queryParams.unloadTime.length > 0) {
          this.queryParams.startUnloadTime = this.queryParams.unloadTime[0];
          this.queryParams.endUnloadTime = this.queryParams.unloadTime[1];
        } else {
          if (this.queryParams.startUnloadTime)
            delete this.queryParams.startUnloadTime;

          if (this.queryParams.endUnloadTime)
            delete this.queryParams.endUnloadTime;
        }
 

      return this.queryParams
    },
    async getList() {
      this.loading = true;
      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "car_order",
        data: this.dealForm(),
      };
      const res = await http_request(obj);
      // console.log("geatlist ===>", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    colseDetailDrawer() {
      this.detailDrawer = false;
    },
    colseMyselfDetailDrawer() {
      this.myselfdetailDrawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
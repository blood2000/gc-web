<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :status-list="statusList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <!-- 操作栏 -->
      <div class="toolsbar"></div>
      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="tableData"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        :border="false"
        :stripe="true"
      >
        <template #edit="{ row }">
          <el-button size="mini" type="text" @click="handleDetail(row)"
            >详情</el-button
          >
        </template>
        <!-- status -->
        <template #status="{ row }">
          <span>{{ dealSattus(row.status) }}</span>
        </template>
      </RefactorTable>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next, sizes, total,  jumper"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
        <Detail :code="currCode" :detailDrawer="detailDrawer" :options="{title:'派车单详情'}" @colseDetailDrawer='colseDetailDrawer' />
  </div>
</template>

<script>
import { statusList, tableColumnsConfig } from "./manage_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
import Detail from './detail.vue'

export default {
  name: "manage",
  components: { QueryForm,Detail },
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
      currCode:null,
      detailDrawer:false
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
       this.currCode = data.appointCarOrderCode;
      this.detailDrawer = true
      console.log("manage data", data);
      // const code = data.appointCarOrderCode;
      // this.$router.push("manage/detail?code=" + code);
    },

    async getList() {
      this.loading = true;
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
      this.loading = false;
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
     colseDetailDrawer(){
      this.detailDrawer = false
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
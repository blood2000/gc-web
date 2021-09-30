<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <QueryForm
        v-model="queryParams"
        @handleQuery="searchQuery"
        :bank-name-list="bankNameList"
        :bank-number-list="bankNumberList"
      />
    </div>
    <div class="app-container">
      <div class="purse-tool-bar">
        <div class="apply">
          <div style="margin-right: 40px">
            <div class="number">{{ dealApplyData.successfulTransfer }}</div>
            <div class="titleStr">已打款金额</div>
          </div>
          <div>
            <div class="number">{{ dealApplyData.applying }}</div>
            <div class="titleStr">处理中金额</div>
          </div>
        </div>
        <div class="status">
          <span style="padding-right: 20px">提现状态:</span>
          <el-checkbox @change="changeCheck" v-model="statusing"
            >处理中</el-checkbox
          >
          <el-checkbox @change="changeCheck" v-model="statused">
            已打款</el-checkbox
          >
          <el-checkbox @change="changeCheck" v-model="statusErr"
            >申请失败</el-checkbox
          >
        </div>
      </div>
      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="tableData"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
      >
        <template #status="{ row }">
          <span :style="{color:dealStatusColor(row.status)}">{{ dealStatusText(row.status) }}</span>
        </template>
      </RefactorTable>
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
import { http_request } from "../../../api";
import QueryForm from "./components/queryForm.vue";
import config from "./config";

export default {
  name: "caseReport",
  components: { QueryForm },
  data() {
    return {
      code: "",
      statusing: false,
      statused: false,
      statusErr: false,
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bankUserPhone: null, //银行预留手机
        bankUserName: null, //开户姓名
        bankName: null, //开户银行姓名
        bankNumber: null, //银行卡号
        dateRange: [],
      },
      total: 0,
      tableData: [],
      tableColumnsConfig: [],
      showSearch: true,
      bankNameList: [],
      bankNumberList: [],
      dealApplyData: {
        applying: null,
        successfulTransfer: null,
      },
    };
  },
  mounted() {
    this.getDicts("bank").then((response) => {
      this.$store.commit("set_bank", response.data);
      console.log("this.$store.state.dict.bank", this.$store.state.dict.bank);
      this.bankNameList = this.$store.state.dict.bank;
    });
    this.searchQuery();
    this.dealApply();
  },
  created() {
    this.tableColumnsConfig = config.caseTableColumnsConfig;
    console.log("this.userinfo", this.$store.state.user);
  },
  computed: {},
  methods: {
    dealStatusText(status) {
      return config.statusConfig[status] && config.statusConfig[status].text;
    },
    dealStatusColor(status) {
      return config.statusConfig[status] && config.statusConfig[status].color;
    },
    dealApply() {
      const obj = {
        //dealApply
        moduleName: "http_purse",
        method: "get",
        url_alias: "dealApply",
      };
      http_request(obj).then((res) => {
        console.log("11", res);
        this.dealApplyData = res.data;
      });
    },
    changeCheck(e) {
      this.getList();
      console.log("e", e);
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "transferApplyList",
        data: this.formToList(),
      };
      const res = await http_request(obj);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      console.log("res", res);
      this.loading = false;
    },
    formToList() {
      const obj = {
        applyTimeBegin:
          (this.queryParams &&
            this.queryParams.dateRange &&
            this.queryParams.dateRange[0]) ||
          null,
        applyTimeEnd:
          (this.queryParams &&
            this.queryParams.dateRange &&
            this.queryParams.dateRange[1]) ||
          null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        bankNumber: this.queryParams.bankNumber,
        bankName: this.queryParams.bankName,
        bankUserName: this.queryParams.bankUserName,
        bankUserPhone: this.queryParams.bankUserPhone,
      };
      obj.status = [];
      if (this.statusing) obj.status.push("0");
      if (this.statused) obj.status.push("2");
      if (this.statusErr) obj.status.push("3");

      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
.purse-tool-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .status {
    // height: 100%;
    position: relative;
    // top: 25px;
  }
  .apply {
    display: flex;
    flex-direction: row;
    .number {
      font-size: 16px;
      font-weight: bold;
    }
    .titleStr {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
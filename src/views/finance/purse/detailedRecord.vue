<template>
  <!-- 账户明细 -->
  <div class="pages-info">
    <div class="pages-info-right">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="80px"
         class="ddc-queryParams"
    label-position="top"
      >
       <div class="ddc-queryParams-left">
      <div class="up">
        <el-form-item label="交易日期">
          <el-date-picker
            v-model="queryParams.updateTimeBegin"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
          />
          至
          <el-date-picker
            v-model="queryParams.updateTimeEnd"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
            :picker-options="endPickerOptions"
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
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" class="ddc-queryParams-right-reset" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
              </div>
      </el-form>
      <!-- 分割线 -->
      <div class="divier"></div>
      <!-- 按钮组 -->
      <div class="toolsbar">
        <el-radio-group v-model="activeName" size="small" @change="handleClick">
          <el-radio-button label="近一月" />
          <el-radio-button label="近三月" />
          <el-radio-button label="近半年" />
          <el-radio-button label="近一年" />
        </el-radio-group>
      </div>
      <!-- 表格层 -->
      <Tabs :tablist="tablist" @getActiveName="getActiveName" />
        <RefactorTable
        v-show="activeTab === '收款记录'"
          is-show-index
          :loading="loading"
          :data="tableData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
        >
        </RefactorTable>
        <RefactorTable
        v-show="activeTab !== '收款记录'"
          is-show-index
          :loading="loading"
          :data="tableData"
          row-key="id"
          :table-columns-config="tableColumnsConfig1"
          :border="false"
          :stripe="true"
        >
          <template #paidItem="{ row }">
            <span>{{ dealPaidItem(row.paidItem) }}</span>
          </template>
        </RefactorTable>

      <pagination
        v-show="total > 0"
        :total="total"
        layout="prev, pager, next, sizes, total,  jumper"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { http_request } from "../../../api";
import Tabs from "@/components/Tabs/index";
import config from "./config";
export default {
  name: "detailedRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paidFeeType: 0, //收入(0) or 支出(1)
        selectDateType: null, //查询时间范围(1-近3个月 2-近6个月 3-近一年)
        updateTimeBegin: null,
        updateTimeEnd: null,
      },
      activeName: "近一月",
      // timeBegin: null,
      // timeEnd: null,
      tableData: [],
      activeTab: "收款记录",
      endPickerOptions: {
        //结束时间过滤
        disabledDate: (time) => {
          if (this.queryParams.updateTimeBegin) {
            return (
              time.getTime() <=
              new Date(this.queryParams.updateTimeBegin).getTime()
            );
          }
        },
      },
    };
  },
  components: { Tabs },
  created() {
    this.changeTimeFormate();
    this.getList();
    this.tablist = config.tablist;
    this.tableColumnsConfig = config.DetailTableColumnsConfig;
    this.tableColumnsConfig1 = config.DetailTableColumnsConfig1;
    this.init();
  },
  methods: {
    dealPaidItem(paidItem) {
      return config.paidItem[paidItem] && config.paidItem[paidItem].text;
    },
    init() {
      this.activeTab = "收款记录";
      this.activeName = "近一月";
    },
    getActiveName(val) {
      this.activeTab = val;
      this.handleTabClick();
    },
    handleTabClick() {
      if (this.activeTab === "收款记录") {
        this.queryParams.paidFeeType = 0;
      } else {
        this.queryParams.paidFeeType = 1;
      }
      this.getList();
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "listForTeam",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      console.log("form", this.queryParams);
      console.log("查询列表 res:", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.changeTimeFormate();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleClick(e) {
      console.log("e", e);
      this.queryParams.pageNum = 1;
      this.changeTimeFormate();
      this.resetForm("queryForm");
      this.getList();
    },
    changeTimeFormate() {
      if (this.activeName === "") this.activeName = "近一月";
      const obj = {
        近一月: 1,
        近三月: 2,
        近半年: 3,
        近一年: 4,
      };
      this.queryParams.selectDateType = obj[this.activeName];
    },
    changeDatePicker() {
      this.activeName = "";
      this.queryParams.selectDateType = null;
    },
  },
};
</script>

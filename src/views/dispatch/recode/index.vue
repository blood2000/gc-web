<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :goods-type-list="goodsTypeList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">

      <!-- 操作栏 -->
      <div class="toolsbar">
        <el-button
          :disabled="multiple"
          type="primary"
          size="mini"
          :loading="recLoading"
          @click="handleInfo"
          >生成调度信息</el-button
        >
        <!-- <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="searchQuery"
        /> -->
      </div>

      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="tableData"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        @selection-change="handleSelectionChange"
        :border="false"
        :stripe="true"
      >
      <template #driverName ="{row}">
        <span>{{`${row.driverName}[${row.driverPhone}]`}}</span>
      </template>
        <template #edit="{ row }">
          <el-button
            size="mini"
            type="text"
            @click="handleCarlog(row)"
            >{{`查看派车单(${row.appointCarOrderCount})`}}</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(row)"
            >详情</el-button
          >
          <el-button size="mini" type="text" @click="handleDel(row)"
            >删除</el-button
          >
        </template>
      </RefactorTable>
      </div>
      <!-- 分页 -->

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        layout="prev, pager, next,jumper, total,sizes"
        @pagination="getList"
      />
    </div>
    <el-dialog
      title="分享调度信息"
      :visible.sync="open"
      width="800px"
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div style="white-space: pre-line">{{ shareText }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <Detail
      :code="currCode"
      :detailDrawer="detailDrawer"
      :options="{ title: '派车记录' }"
      @colseDetailDrawer="colseDetailDrawer"
    />
  </div>
</template>

<script>
import { tableColumnsConfig } from "./recode_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
import Detail from "./detail.vue";

export default {
  name: "order",
  components: { QueryForm, Detail },
  data() {
    return {
      showSearch: true,
      loading: false,
      recLoading: false,
      multiple: true,
      open: false,
      ids: [],
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
      shareText: "",
      currCode: null,
      detailDrawer: false, //详情抽屉
    };
  },
  created() {
    const me = this;
    console.log("tableColumnsConfig", tableColumnsConfig);
   this.getDicts('goodsType').then((res) => {
      console.log("res", res);
      me.$store.commit("set_goodsTypeList", res.data);
      console.log(111, me.$store.state.dict.goodsTypeList);
      me.goodsTypeList = me.$store.state.dict.goodsTypeList;
    });
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => item.appointCarRecordCode);
      this.multiple = !selection.length;
    },
    handleDel(data) {
      console.log("data", data);
      const codes = data.appointCarRecordCode;
      this.$confirm("删除操作不可恢复，确认要删除该调度信息吗？", "警告", {
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
    async handleInfo() {
      console.log("handleInfo", this.ids);
      this.recLoading = true;
      const obj = {
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "dispatch_order_info",
        data: { appointCarRecordCodes: this.ids },
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.shareText = res.data.msg;
      this.open = true;
      this.recLoading = false;
    },
    handleCarlog(data) {
      console.log("data", data);
      const code = data.appointCarRecordCode;
      this.$router.push("/dispatch/manage?code=" + code);
    },
    handleDetail(data) {
      console.log('data.appointCarRecordCode',data.appointCarRecordCode)
      this.currCode = data.appointCarRecordCode;
      this.detailDrawer = true;
      // const code = data.appointCarRecordCode;
      // console.log("????", code);
      // this.$router.push("recode/detail?code=" + code);
    },
    formToPaging() {
      const tmp = JSON.parse(JSON.stringify(this.queryParams));
      for (const item in tmp) {
        if (!tmp[item]) {
          delete tmp[item];
        }
      }
      return tmp;
    },
    async getList() {
      this.loading = true;

      const obj = {
        //paging_dispatch
        moduleName: "http_dispatch",
        method: "post",
        url_alias: "paging_appoint_car_record",
        data: this.formToPaging(),
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
    cancel() {
      this.open = false;
      this.shareText = "";
    },
    colseDetailDrawer() {
      this.detailDrawer = false;
    },
    ok() {
      this.cancel();
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
.recode-tool-bar {
  padding: 0 0 20px 20px;
}
</style>
<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :dispatch-order-status-list="dispatchOrderStatusList"
        :goods-type-list="goodsTypeList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(row)"
          >
            详情
          </el-button>
          <el-button size="mini" type="text" @click="handleDispatch(row)">
            派车
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-position"
            @click="handleCarlog(row)"
          >
            派车记录
          </el-button>
        </template>
      </RefactorTable>
      <!-- 分页 -->
      <pagination
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

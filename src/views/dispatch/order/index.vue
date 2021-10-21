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

      <div class="page-table-layout-set">
        <!-- 操作栏 -->
        <div class="toolsbar">
          <el-button type="primary" size="mini" @click="createDispatchOrder"
            >创建调度单</el-button
          >
        </div>
        <RefactorTable
          is-show-index
          :loading="loading"
          :data="tableData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
        >
          <template #dispatchOrderStatus="{ row }">
            <span
              :style="{
                color: dealDispatchOrderStatus(
                  row.dispatchOrderStatus,
                  'color'
                ),
              }"
              >{{
                dealDispatchOrderStatus(row.dispatchOrderStatus, "text")
              }}</span
            >
          </template>
          <template #source="{ row }">
            <span>{{ sourceConfig[row.source] }}</span>
          </template>
          <template #edit="{ row }">
            <el-button size="mini" type="text" @click="handleDetail(row)">
              详情
            </el-button>
            <el-button size="mini" type="text" @click="handleDispatch(row)">
              派车
            </el-button>
            <el-button size="mini" type="text" @click="handleCarlog(row)">
              派车记录
            </el-button>
          </template>
        </RefactorTable>
      </div>
      <!-- 分页 -->
      <pagination
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
      :options="{ title: '调度单详情' }"
      @colseDetailDrawer="colseDetailDrawer"
    />
    <Car
      :code="currCode"
      :carDrawer="carDrawer"
      :options="{ title: '调度单派车' }"
      @colseCarDrawer="colseCarDrawer"
    />
    <CreateD
      :createDrawer="createDrawer"
      :options="{ title: '自建订单' }"
      @colseCreateDrawer="colseCreateDrawer"
    />
  </div>
</template>

<script>
import {
  dispatchOrderStatusList,
  tableColumnsConfig,
  sourceConfig,
} from "./order_config";
import QueryForm from "./components/queryForm.vue";
import { http_request } from "../../../api";
import Detail from "./detail.vue";
import Car from "./car.vue";
import CreateD from "./create.vue";
export default {
  name: "order",
  components: { QueryForm, Detail, Car, CreateD },
  data() {
    return {
      showSearch: true,
      loading: false,
      detailDrawer: false, //详情抽屉
      carDrawer: false, // 派车抽屉
      currCode: null,
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
      dispatchOrderStatusList, // 调度单状态列表
      tableColumnsConfig,
      sourceConfig,
      tableData: [], //表格数据
      goodsTypeList: [],
      createDrawer: false, //创建调度单
    };
  },
  created() {
    const me = this;
    const formData = new FormData();
    formData.append("dictType", "goodsType");
    this.getDicts("goodsType").then((res) => {
      me.$store.commit("set_goodsTypeList", res.data);
      me.goodsTypeList = me.$store.state.dict.goodsTypeList;
    });
  },
  mounted() {
    this.searchQuery();
  },
  methods: {
    // 创建调度单
    createDispatchOrder() {
      this.createDrawer = true;
    },
    //处理调度单状态
    dealDispatchOrderStatus(val, type) {
      let result = "";
      for (const item of dispatchOrderStatusList) {
        if (item.value == val) {
          type === "text" ? (result = item.label) : (result = item.color);
        }
      }
      return result;
    },
    //派车记录
    handleCarlog(data) {
      const code = data.dispatchOrderCode;
      console.log(this.$router);
      this.$router.push("/dispatch/recode?code=" + code);
    },
    //详情
    handleDetail(data) {
      this.currCode = data.dispatchOrderCode;
      this.detailDrawer = true;
      // this.$router.push("order/detail?code=" + code);
    },
    //派车
    handleDispatch(data) {
      //dispatch/order/car
      console.log("data", data);
      this.carDrawer = true;
      this.currCode = data.dispatchOrderCode;
      // this.$router.push("order/car?code=" + code);
    },
    // 表单到分页请求参数
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
      return tmp;
    },
    // 请求列表
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
    // 搜索
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 关闭详情弹窗
    colseDetailDrawer() {
      this.detailDrawer = false;
    },
    // 关闭车辆弹窗
    colseCarDrawer() {
      this.carDrawer = false;
    },
    colseCreateDrawer() {
      this.createDrawer = false;
    },
  },
};
</script>

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
            :height="getTableHeight"
        >
          <template #shipmentName="{ row }">
            <span>{{ `${row.shipmentName}[${row.shipmentPhone}]` }}</span>
          </template>
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
            <el-button
              size="mini"
              type="text"
              style="color: red"
              v-show="row.source == 'zj' && row.dispatchOrderStatus !== 0"
              @click="handleStatusClose(row)"
            >
              关闭
            </el-button>
            <el-button size="mini" type="text" @click="handleDetail(row)">
              详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDispatch(row, true)"
              v-show="row.dispatchOrderStatus !== 0"
            >
              批量派车
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDispatch(row, false)"
              v-show="row.dispatchOrderStatus !== 0"
            >
              单次派车
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
    <CreatedDetail
      :code="currCode"
      :detailDrawer="createDetailDrawer"
      :options="{ title: '调度单详情' }"
      @colsecreateDetailDrawer="colsecreateDetailDrawer"
    />
    <Car
      :code="currCode"
      :carDrawer="carDrawer"
      :options="{ title: '调度单派车' }"
      :source="currSource"
      :isMany="currIsMany"
      @colseCarDrawer="colseCarDrawer"
    />
    <!-- <CreateCar
      :code="currCode"
      :carDrawer="createCarDrawer"
      :options="{ title: '调度单派车' }"
      @colseCreateCarDrawer="colseCreateCarDrawer"
    /> -->
    <CreateD
      :createDrawer="createDrawer"
      :options="{ title: '创建调度单' }"
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
import CreatedDetail from "./createdDetail.vue";
import Car from "./car.vue";
import CreateCar from "./createCar.vue";
import CreateD from "./create.vue";
export default {
  name: "order",
  components: { QueryForm, Detail, CreatedDetail, Car, CreateD, CreateCar },
  data() {
    return {
      showSearch: true,
      loading: false,
      detailDrawer: false, //详情抽屉
      createDetailDrawer: false, // 自建详情
      carDrawer: false, // 派车抽屉
      createCarDrawer: false, // 自建派车抽屉
      currCode: null,
      currSource: null,
      currIsMany: null,
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
      goodsBigTypeConfig: {
        status: "0",
        dictPid: "0",
        dictType: "goodsType",
      },
      goodsTypeConfig: {
        status: "0",
        dictPid: "",
        dictType: "goodsType",
      },
      goodsTypeList: [],
      createDrawer: false, //创建调度单
    };
  },
  created() {
    this.getGoodsTypeList();
  },
    computed: {
    getTableHeight() {
      console.log('================>')
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      return windowHeight - 290 -152;
    },
  },
  mounted() {
    this.searchQuery();
  },
  methods: {
    //获取级联形式大类小类
    async getGoodsTypeList() {
      const resBig = await this.getDicts(null, this.goodsBigTypeConfig);
      // console.log("resBig", resBig);
      if (resBig.code != "200") return;
      const bigList = resBig.data;
      const result = [];
      for (const item of bigList) {
        const bigObj = {};
        if (item.dictCode && item.dictLabel) {
          bigObj.value = item.dictCode;
          bigObj.label = item.dictLabel;
          bigObj.children = [];
          this.goodsTypeConfig.dictPid = item.dictCode;
          const res = await this.getDicts(null, this.goodsTypeConfig);
          // console.log("ressmall", res);
          if (res.code != "200") return;
          for (const el of res.data) {
            const obj = {};
            obj.value = el.dictValue;
            obj.label = el.dictLabel;
            bigObj.children.push(obj);
          }
          result.push(bigObj);
        }
      }
      this.goodsTypeList = result;
      //  .then((response) => {
      //         this.goodsBigTypeList = response.data;
      //       });
    },
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
      this.$router.push("/transport/recode?code=" + code);
    },
    //详情
    handleDetail(data) {
      console.log("data", data);
      this.currCode = data.dispatchOrderCode;
      if (data.source === "zj") {
        this.createDetailDrawer = true;
      } else {
        this.detailDrawer = true;
      }
      // this.$router.push("order/detail?code=" + code);
    },
    // 关闭
    handleStatusClose(data) {
      console.log("data 关闭", data);
      this.$confirm("关闭操作不可恢复，确认要关闭该调度吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //editUpOrDownShelfDispatchOrder status,code
        const obj = {
          moduleName: "http_dispatch",
          method: "put",
          url_alias: "editUpOrDownShelfDispatchOrder",
          url_code: [40, data.dispatchOrderCode],
        };
        http_request(obj).then(() => {
          this.searchQuery();
          this.msgSuccess("关闭成功");
        });
      });
    },
    //派车
    handleDispatch(data, types) {
      if (data.dispatchOrderStatus === 0) {
        return this.msgWarning("该调度状态已经关闭，无法进行派车");
      }
      this.currIsMany = types
      this.carDrawer = true;
      this.currSource = data.source;
      this.currCode = data.dispatchOrderCode;
      console.log('this.currIsMany,this.currSource',this.currIsMany,this.currSource)
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
      if (tmp.dispatchOrderStatus && tmp.dispatchOrderStatus.length == 1) {
        if (!tmp.dispatchOrderStatus[0] && tmp.dispatchOrderStatus[0] !== 0)
          delete tmp.dispatchOrderStatus;
      }

      for (const item in tmp) {
        if(tmp[item] == 0){
          console.log('tmp[item]',tmp[item])
        }
        if (!tmp[item] && tmp[item] !== 0) {
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
      // console.log("geatlist ===>", res);
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
    colsecreateDetailDrawer() {
      this.createDetailDrawer = false;
    },
    // 关闭派车弹窗
    colseCarDrawer() {
      this.carDrawer = false;
    },
    // 关闭自建派车弹窗
    colseCreateCarDrawer() {
      console.log("关闭自建派车弹窗");
      this.createCarDrawer = false;
    },
    colseCreateDrawer(e) {
      if (e == "ok") {
        this.searchQuery();
      }
      this.createDrawer = false;
    },
  },
};
</script>

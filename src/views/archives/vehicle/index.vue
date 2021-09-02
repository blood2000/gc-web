<template>
  <div>
    <div>
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :vehicle-status-list="vehicleStatusList"
        :group-List="groupList"
        :data-status-list="dataStatusList"
        @handleQuery="searchQuery"
        
      />
    </div>
    <!-- 下 -->
    <div class="app-container">
      <!-- 操作栏 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="handleImport"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            >导出</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="handleGroup"
            >车辆分组管理</el-button
          >
        </el-col>
        <el-col :span="1.5"><a> 下载导入模板</a> </el-col>
      </el-row>
      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="vehicleList"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        @selection-change="handleSelectionChange"
      >
        <template #ticket="{ row }">
          <span>{{ selectDictLabel(assetsTicketType, row.ticket) }}</span>
        </template>
        <template #edit="{ row }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            style="color: red"
            @click="handleDelete(row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-position"
            @click="handlePosition(row)"
            >定位</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleDetail(row)"
            >详情</el-button
          >
        </template>
      </RefactorTable>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="vehicleHttpReq"
      />
    </div>
    <VehicleDialog :open="open" :title="title" @colseDialog ="colseDialog"></VehicleDialog>
  </div>
</template>

<script>
import vehicleConfig from "./vehicle_config";
import QueryForm from "./components/queryForm.vue";
import VehicleDialog from './components/vehicle_dialog.vue'
import { http_request } from "@/api";

export default {
  name: "vehicle", // 车辆管理
  components: { QueryForm ,VehicleDialog},
  data() {
    return {
      showSearch: true, //搜索显隐
      loading: false, //表格load
      exportLoading: false, //到处load
      total: 0, //总条数
      multiple: true, //是否激活多选删除按钮
      open:false, //dialog show
      title:"", //dialog titile
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        licenseNumber: "", //车牌号
        vehicleStatus: "", //车辆状态
        group: "", //分组
        dateRange: [], //日期范围
        dataStatus: "", //是否停用
      },
      vehicleStatusList: [], //车辆状态
      dataStatusList: [], //是否停用列表
      groupList: [], //分组列表
      tableColumnsConfig: [], //配置表头数据
      vehicleList: [], //表格数据
      selection: [], // 被勾选表格数据
      codes: [], //删除选择的codes
    };
  },
  created() {
    this.vehicleStatusList = vehicleConfig.vehicleStatusList;
    this.dataStatusList = vehicleConfig.dataStatusList;
    this.tableColumnsConfig = vehicleConfig.tableColumnsConfig;
    //缺少请求 待修改
    //this.group =
  },
  mounted() {
    this.searchQuery();
  },
  methods: {
    //发送搜索请求
    searchQuery() {
      this.pageNum = 1;
      this.vehicleHttpReq();
    },
    //请求分页数据
    async vehicleHttpReq() {
      this.loading = true;
      console.log(this.queryParams);
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "vehicle_list_page",
        data: {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          licenseNumber: this.queryParams.licenseNumber||null, //车牌号
          vehicleStatus: this.queryParams.vehicleStatus||null, //车辆状态
          group: this.queryParams.group||null, //分组
          dataStatus: this.queryParams.dataStatus, //是否停用
          createBeginTime: this.queryParams.dateRange[0]||null,
          createEndTime: this.queryParams.dateRange[1] ||null,
        },
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      console.log("res", res);
      this.vehicleList = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    //新增
    handleAdd() {
        this.title = '新增车辆弹窗'
        this.open = true
    },
    //导入
    handleImport() {},
    //导出
    handleExport() {},
    //分组管理
    handleGroup() {},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    //删除
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      const ids = obj.code || this.ids;
      console.log("this.ids", ids);
      console.log("暂未开通, 等待接口");
      return;
      this.$confirm("是否确认删除此项数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const tmp = {
            moduleName: "http_vehicle",
            method: "delete",
            url_alias: "vehicle_del",
            url_code: ids,
          };
          http_request(tmp);
        })
        .then(() => {
          this.vehicleHttpReq();
          this.msgSuccess("删除成功");
        });
    },
    handleUpdate(obj) {
        this.title = '修改车辆弹窗'
        this.open = true
    },
    handlePosition(obj) {},
    handleDetail(obj) {},
    colseDialog(){
        console.log('关闭。。。')
        this.open = false
    }
  },
};
</script>

<style lang="scss" scoped></style>

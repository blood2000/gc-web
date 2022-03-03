<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :modelNameList="modelNameList"
        :seriesNameList="seriesNameList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <!-- 表格 -->
        <RefactorTable
          is-show-index
          :loading="loading"
          :data="deviceList"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          :border="false"
          :stripe="true"
            :height="getTableHeight"
        >
          <template #status="{ row }">
            <div :style="{ color: statusObj[row.status].color }">
              <span>{{ statusObj[row.status].label }}</span>
            </div>
          </template>
          <template #activationFlagValue="{ row }">
            <div
              :style="{
                color:
                  row.activationFlagValue === '未激活' ? '#B3B3B3' : '#43B91E',
              }"
            >
              <span>● {{ row.activationFlagValue }}</span>
            </div>
          </template>

          <template #vehicleInfo="{ row }">
            <div v-if="row.vehicleInfo">
              {{
                row.vehicleInfo.vehicleAlias
                  ? `(${row.vehicleInfo.vehicleAlias})  ${row.vehicleInfo.licenseNumber}`
                  : row.vehicleInfo.licenseNumber
              }}
            </div>
          </template>
          <template #edit="{ row }" width="200">
            <el-button
              size="mini"
              style="color: red"
              v-if="row.vehicleInfo"
              type="text"
              @click="handleUnbind(row)"
              >解绑车辆</el-button
            >
            <el-button size="mini" v-else type="text" @click="handleBind(row)"
              >绑定车辆</el-button
            >

            <el-button size="mini" type="text" @click="handleDetail(row)"
              >详情</el-button
            >
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
    <el-dialog
      :visible.sync="open"
      width="500px"
      append-to-body
      title="绑定车辆"
      :close-on-click-modal="false"
      :before-close="cancelDialog"
      :destroy-on-close="true"
    >
      <BindVehicle
        :list="vehicleList"
        :currIndex="currIndex"
        @currIndexChange="currIndexChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okVehicle">保存</el-button>
      </div>
    </el-dialog>
    <Detail
      :detailDrawer="detailDrawer"
      :detailObj="detailObj"
      @colseDetailDrawer="colseDetailDrawer"
      @searchQuery="searchQuery"
    />
  </div>
</template>

<script>
import { http_request } from "../../../api";
import QueryForm from "./components/queryForm.vue";
import Detail from "./components/detail.vue";
import { tableColumnsConfig, statusObj } from "./config";
import BindVehicle from "./components/bindVehicle.vue";
export default {
  components: { QueryForm, Detail, BindVehicle },
  data() {
    return {
      loading: false, //表格load
      total: 0, //总条数
      tableColumnsConfig,
      statusObj,
      deviceList: [],
      modelNameList: [],
      seriesNameList: [],
      vehicleList: [],
      currVehicle:null,
      currIndex: -1,
      detailObj: {},
      detailDrawer: false,
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryOnlyCode: null, //sn
        seriesName: null, //设备系列
        modelName: null, //设备型号
        activationFlag: null, //激活状态0未激活1激活
        status: null, //设备状态0离线1在线
        licenseNumber: null, //车牌号
      },
    };
  },
  mounted() {
    this.searchQuery();
    this.getModuleName();
    this.getSeriesName();
  },
   computed: {
    getTableHeight() {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(windowHeight);
      return windowHeight - 340;
    },
  },
  methods: {
    okVehicle() {
      if (this.currIndex === - 1) {
        this.msgWarning("请选择车辆");
        return;
      }
      const vehicleInfo = this.vehicleList[this.currIndex];
      console.log("vehicleInfo", vehicleInfo);
      //boundVehicle
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "boundVehicle",
        data: {
          vehicleCode: vehicleInfo.vehicleCode,
          factoryOnlyCode: this.currVehicle.factoryOnlyCode,
          deviceCode: this.currVehicle.deviceCode,
        },
      };
      console.log("obj", obj);
      http_request(obj).then((res) => {
        this.currIndex = -1
        this.currVehicle = null
        console.log("boundVehicle res", res);
        this.open = false
        if (res.code === 200) {
          this.msgSuccess("绑定成功！");
                  this.searchQuery()

        } else {
          this.msgError("绑定错误");
        }
      });
    },
    currIndexChange(index) {
      console.log("index", index);
      this.currIndex = index;
    },
    async getModuleName() {
      const obj = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "moduleName",
      };
      const res = await http_request(obj);
      console.log("getModuleName", res);
      this.modelNameList = res.data;
    },
    async getSeriesName() {
      const obj = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "seriesName",
      };
      const res = await http_request(obj);
      console.log("getSeriesName", res);
      this.seriesNameList = res.data;
    },
    //初始页数请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "listByDeviceInfo",
        data: this.formTopagging(),
      };
      const res = await http_request(obj);
      console.log("res", res);
      if (res.code == "200") {
        this.deviceList = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
      } else {
        console.log("error", res);
        this.loading = false;
      }
    },
    formTopagging() {
      //    Object.values(this.queryParams).filter((item)=> item)
      const result = {};
      for (const item in this.queryParams) {
        if (this.queryParams[item] || this.queryParams[item] === 0) {
          result[item] = this.queryParams[item];
        }
      }

      return result;
    },
    async handleBind(row) {
      console.log("handleBind", row);
      this.open = true;
      this.currVehicle  = row;
      const obj = {
        //getVehicleList
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "getVehicleList",
      };
      const res = await http_request(obj);
      console.log("http_request res", res);
      this.vehicleList = res.data;
    },
    handleUnbind(row) {
      this.$confirm(
        `确认将设备与车辆【${
          row.vehicleInfo && row.vehicleInfo.licenseNumber
        }】解绑？`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const tmp = {
            moduleName: "http_vehicle",
            method: "put",
            url_alias: "untieTheVehicle",
            data: {
              vehicleCode: row.vehicleInfo.vehicleCode,
              factoryOnlyCode: row.factoryOnlyCode,
              deviceCode: row.deviceCode,
            },
          };
          http_request(tmp).then(() => {
            this.searchQuery();
            this.msgSuccess("解绑成功");
          });
        })
        .catch((res) => {
          console.log("res error", res);
          this.msgError("解绑失败");
        });
    },
    async handleDetail(row) {
      console.log("row", row.deviceCode);
      const obj = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "device_detail",
        url_code: [row.deviceCode],
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.detailObj = res.data;
      this.detailDrawer = true;
    },
    colseDetailDrawer(e) {
      if (e == "ok") {
        this.searchQuery();
      }
      this.detailDrawer = false;
    },
    cancelDialog() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
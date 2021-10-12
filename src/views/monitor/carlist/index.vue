<template>
  <div class="pages-info">
    <div class="pages-info-left">
      <div class="head-container">
        <el-input
          v-model="orgName"
          placeholder="请输入组织名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          class="mb20"
        />
      </div>
      <div class="head-container el-tree-scroll-container">
        <el-tree
          ref="tree"
          :data="orgTreeData"
          :props="defaultTreeProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :indent="0"
          :highlight-current="true"
          node-key="code"
          :current-node-key="queryParams.orgCode"
          default-expand-all
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }">
            <span class="node-label">
              <i class="tree-node-icon" :class="data.icon" />
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :sn-list="snList"
        @handleQuery="searchQuery"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <el-row :gutter="10" class="toolsbar"> </el-row>
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="list"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        :border="false"
        :stripe="true"
      >
        <template #edit="{ row }">
          <!--   -->
          <el-button
            v-show="row.vehicle_status == 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="lookCarOrder(row)"
            >查看派车单</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="mapSearch(row)"
            >地图查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="travelSeach(row)"
            >轨迹查看</el-button
          >
        </template>
        <!-- <template #attribute="{ row }">
                <span>{{ getDetailAddress(row) }}</span>
              </template> -->
        <template #vehicle_status="{ row }">
          <span>{{ dealVehicleStatus(row.vehicle_status) }}</span>
        </template>
        <!-- model_name -->
        <template #model_name="{ row }">
          <span>{{
            row.model_name ? `${row.model_name}(${row.series_name})` : null
          }}</span>
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
  </div>
</template>
<script>
import { http_request } from "../../../api";
import { tableColumnsConfig, vehicleStatusList } from "./config";
import QueryForm from "./components/queryForm.vue";
export default {
  name: "carlist",
  components: { QueryForm },
  data() {
    return {
      loading: false,
      showSearch: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        onlineStatus: null, //在线状态 0,离线; 1,在线
        sn: null, //对外序列号，等同于 imei
        plateNumber: null,
        vehicleStatus: null,
        orgCode: null,
      },
      total: 0,
      list: [],
      tableColumnsConfig,
      orgName: "", //组织查询
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      snList: [],
      geocoder: null,
    };
  },
  mounted() {
    this.getOrgHttp();
    this.geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all",
    });
  },
  methods: {
    async lookCarOrder(obj) {
      console.log("obj", obj);
      const tmp = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "CarOrderIng_ByVehicleCode",
        url_code: [obj.vehicle_code],
      };
      const res = await http_request(tmp);
      console.log("res", res);
      if (res.data == null) return this.msgError("没有派车单");
      const code = res.data.appointCarOrderCode;
      this.$router.push("/dispatch/manage/detail?code=" + code);
    },
    /**
     * 通过经纬度获取详细点位信息
     * @param {Array} position 经纬度必传
     *  */
    getAddressBylnglat(position) {
      const _this = this;
      return new Promise((resolve, reject) => {
        let address;
        _this.geocoder.getAddress(position, function (status, result) {
          if (status === "complete" && result.info === "OK") {
            if (result && result.regeocode) {
              const { formattedAddress } = result.regeocode;
              address = formattedAddress;
            }
            console.log("111address", address);
            resolve(address);
          }
        });
      });
    },

    //处理车辆状态
    dealVehicleStatus(status) {
      let result = "";
      vehicleStatusList.forEach((element) => {
        if (element.value == status) {
          result = element.label;
        }
      });
      return result;
    },
    mapSearch(obj) {
      console.log("obj", obj);
      const vehicleCode = obj.vehicle_code;
      const trackType = 1;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    travelSeach(obj) {
      console.log("obj", obj);
      const vehicleCode = obj.vehicle_code;
      const trackType = 3;
      this.$router.push(
        `/map/mapInfo?vehicleCode=${vehicleCode}&trackType=${trackType}`
      );
    },
    //获取组织树
    async getOrgHttp() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      if (this.orgName) obj.data = { orgName: this.orgName };
      const orgRes = await http_request(obj);
      console.log("orgRes res", orgRes);
      this.orgTreeData = orgRes.data.length > 0 ? orgRes.data : [];
      console.log("orgRes.data[0]", orgRes.data);
      this.queryParams.orgCode = this.orgTreeData[0].code;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.queryParams.orgCode);
      });
      console.log("当前code", this.queryParams.orgCode);
      this.searchQuery();
    },
    //组织树节点过滤
    filterNode(value, data) {
      if (!value) return true;
      console.log(
        "data.orgName.indexOf(value) !== -1",
        data.orgName.indexOf(value) !== -1
      );
      return data.orgName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("data", data);
      this.queryParams.orgCode = data.code;
      this.queryParams.pageNum = 1;
      this.getList();
    }, //发送搜索请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      this.list = [];
      const obj = {
        //http_monitor
        moduleName: "http_monitor",
        method: "post",
        url_alias: "carlist",
        data: this.formToList(),
      };
      const res = await http_request(obj);
      console.log("res getList", res);
      res.data.rows.forEach((el) => {
        console.log("el", el.attribute);
        if (
          el.attribute &&
          el.attribute.coordinate &&
          el.attribute.coordinate.value.length > 1
        ) {
          this.getAddressBylnglat(el.attribute.coordinate.value).then((val) => {
            el.attribute = val;
            console.log(val);
            this.list.push(el);
          });
        } else {
          el.attribute = "";
          this.list.push(el);
        }
      });
      console.log("this.list", this.list);
      this.total = res.data.total;
      this.loading = false;
    },
    formToList() {
      const obj = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        onlineStatus: this.queryParams.onlineStatus,
        sn: this.queryParams.sn,
        plateNumber: this.queryParams.plateNumber,
        // telephone:,
        vehicleStatus: this.queryParams.vehicleStatus,
        driverName: this.queryParams.driverName,
        orgCode: this.queryParams.orgCode,
      };
      for (const item in obj) {
        if (!obj[item]) {
          delete obj[item];
        }
      }
      return obj;
    },
  },
};
</script>


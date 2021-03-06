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
              <span class="tree-node-title"> {{ node.label }} </span>
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
      <div class="page-table-layout-set">
        <div
          class="page-table-layout-set-item"
          :key="index"
          v-for="(item, index) in list"
        >
          <ItemCard :data="item" />
        </div>
      </div>
      <pagination
        v-show="total > queryParams.pageSize"
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
      :options="{ title: '派车单详情' }"
      @colseDetailDrawer="colseDetailDrawer"
    />
  </div>
</template>
<script>
import { http_request } from "../../../api";
import QueryForm from "./components/queryForm.vue";
import Detail from "../../dispatch/manage/detail.vue";
import ItemCard from "./components/itemCard.vue";

export default {
  name: "carlist",
  components: { QueryForm, Detail, ItemCard },
  data() {
    return {
      loading: false,
      showSearch: true,
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        driverName: null,
        onlineStatus: null, //在线状态 0,离线; 1,在线
        sn: null, //对外序列号，等同于 imei
        plateNumber: null,
        vehicleStatus: null,
        orgCode: null,
      },
      total: 0,
      list: [],
      orgName: "", //组织查询
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      snList: [],
      geocoder: null,
      currCode: null,
      detailDrawer: false,
    };
  },
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getOrgHttp();
    this.geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all",
    });
  },
  methods: {
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
      return data.orgName.indexOf(value) !== -1;
    },
    // 点击组织树
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
        if (
          el.attribute &&
          el.attribute.coordinate &&
          el.attribute.coordinate.value.length > 1
        ) {
          this.getAddressBylnglat(el.attribute.coordinate.value).then((val) => {
            el.attribute = val;
            console.log("获取详情地址", val);
            this.list.push(el);
          });
        } else {
          el.attribute = "";
          this.list.push(el);
        }
      });
      this.total = res.data.total;
      // alert(this.total)
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
    colseDetailDrawer() {
      this.detailDrawer = false;
    },
  },
};
</script>


<style lang="scss" scoped>
.el-tree > .el-tree-node {
  width: 100% !important;
}
.el-tree-node__content > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.pages-info-right-top {
  padding-bottom: 8px;
}
.divier {
  height: 1px;
  border-bottom: 1px solid #dce3e9;
}
.page-table-layout-set {
  padding: 16px 8px 0 16px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: calc(100vh - 260px);
  align-content: flex-start;
  &-item {
    width: 24%;
    margin-right: 1%;
    margin-bottom: 20px;
  }
}
.toolsbar {
  display: flex;
  flex-direction: row;
  margin-bottom: 17px;
}
::v-deep .pagination-container {
   background: #ffffff;
  margin-top: 23px;
}
</style>


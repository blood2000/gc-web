<!-- 告警 -->
<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="5" :lg="6" :md="8" :sm="9" :xs="24">
        <div class="device-info-left">
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
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              :indent="0"
              :highlight-current="true"
              node-key="code"
              :current-node-key="orgCode"
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
      </el-col>
      <el-col :xl="19" :lg="18" :md="16" :sm="15" :xs="24">
        <div class="device-info-right">
          <div class="device-info-right-top" v-show="showSearch">
            <!-- 上：搜索 -->
            <QueryForm
              v-model="queryParams"
              :warningTypeList="warningTypeList"
              :device-type-list="deviceTypeList"
              :warning-tab="tabIndex"
              @handleQuery="searchQuery"
              @updateWarningTypeList="updateWarningTypeList"
            />
          </div>
          <div class="device-info-right-bottom">
            <el-tabs
              type="border-card"
              v-model="tabIndex"
              @tab-click="tabClick"
            >
              <el-tab-pane
                v-for="item in warningTabs"
                :key="item.value"
                :name="item.value"
                :label="item.label"
              >
                <!-- 表格 -->
                <RefactorTable
                  :loading="loading"
                  :data="warningData"
                  row-key="id"
                  :table-columns-config="tableColumnsConfig"
                >
                  <template #warinigType="{ row }">
                    {{ getWarinigTypeName(row.warinigType) }}
                  </template>
                  <template #deviceType="{ row }">
                    {{ getDeviceTypeName(row.deviceType) }}
                  </template>
                </RefactorTable>
                <!-- 分页 -->
                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="warningDataReq"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { http_request } from "@/api";
import QueryForm from "./components/queryForm.vue";
import warningConfig from "./config";
import store from "@/store";
export default {
  name: "warning", // 告警管理
  components: { QueryForm },
  data() {
    return {
      orgName: "", //组织查询
      orgCode: null, // 当前选中的类型
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName",
      },
      orgTreeData: [],
      showSearch: true, //搜索显隐
      loading: false, //表格load
      warningData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vehicleCode: "",
        driver: "",
        deviceType: null,
        dateRange: [],
        warningTypes: [],
      },
      deviceTypeList: [],
      warningTypeList: [],
      tabIndex: "1",
      warningTabs: [],
      tableColumnsConfig: [], //配置表头数据
      total: 0,
    };
  },

  computed: {},

  created() {
    this.deviceTypeList = warningConfig.deviceTypeList;
    this.warningTypeList = warningConfig.warningTypeList;

    this.tableColumnsConfig = [
      ...warningConfig.vehicleColumn,
      ...warningConfig.tableColumnsConfig,
    ];
    this.warningTabs = warningConfig.warningTabs;
    this.warningDataReq();
  },

  mounted() {
    this.getOrgHttp();
    
  },

  methods: {
    //请求组织树数据
    async getOrgHttp() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      if (this.orgName) obj.data = { orgName: this.orgName };
      const orgRes = await http_request(obj);
      console.log("orgRes res", orgRes);
      this.orgTreeData =
        orgRes.data.length > 0 ? orgRes.data[0].childrenOrgList : [];
      if (!this.orgTreeData.length > 0) return;
      this.currCode = this.orgTreeData[0].code;
      console.log("当前code", this.currCode);
      //     this.searchQuery();
    },
    //过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    //点击组织树节点
    handleNodeClick(data) {
      console.log("data", data);
      this.orgCode = data.code;
      this.queryParams.pageNum = 1;
      this.warningDataReq();
    },
    updateWarningTypeList(list) {
      console.log("update==>", list);
      this.warningTypeList = list;
      let warningTypes = [];
      this.warningTypeList.map((item) => {
        if (item.isChoose) {
          warningTypes.push(item.warningType);
        }
      });
      this.queryParams.warningTypes = warningTypes;
    },
    //初始页数请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      // this.queryParams.deviceType = this.queryParams.deviceType ? this.queryParams.deviceType : 0;
      if (this.tabIndex === "1") {
        this.queryParams.driver = "";
      } else {
        this.queryParams.vehicleCode = "";
      }
      
      this.warningDataReq();
      // this.vehicleHttpReq();
    },
    warningDataReq() {
      let curPageNum = this.queryParams.pageNum;
      let endIndex = this.queryParams.pageSize * curPageNum;
      let startIndex = this.queryParams.pageSize * (curPageNum - 1);
      this.total = warningConfig.mockData.length;
      console.log(curPageNum)
      this.warningData = warningConfig.mockData.slice(startIndex, endIndex);
      
      
      console.log(this.warningData);
    },
    //告警类型表格项
    getWarinigTypeName(warningType) {
      let warningName = "";
      this.warningTypeList.map((item) => {
        if (item.warningType === warningType) {
          warningName = item.warningName;
        }
      });
      return warningName;
    },
    //告警类型
    getDeviceTypeName(deviceType) {
      let name = "";
      this.deviceTypeList.map((item) => {
        if (item.value === deviceType) {
          name = item.label;
        }
      });
      return name;
    },
    //选项卡切换
    tabClick() {
      if (this.tabIndex === "1") {
        this.tableColumnsConfig = [
          ...warningConfig.vehicleColumn,
          ...warningConfig.tableColumnsConfig,
        ];
      } else {
        this.tableColumnsConfig = [
          ...warningConfig.driverColumn,
          ...warningConfig.tableColumnsConfig,
        ];
      }
      this.searchQuery();
      console.log(this.tableColumnsConfig);
    },
  },
};
</script>
<style lang='scss' scoped>
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
    margin-bottom: 0;
    min-height: calc(100vh - 192px);
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
.deviceInf-cion {
  display: flex;
  flex-direction: row;
  width: 20xp;
  height: 20px;
}
.loadTemplate {
  padding-left: 15px;
  padding-right: 5px;
  padding-top: 3px !important;
  color: #409eff;
  font-size: 14px;
}
</style>
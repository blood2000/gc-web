<!-- 告警 -->
<template>
  <div class="pages-info">
    <!-- <div class="pages-info-left"> 
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
        </div> -->
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm
        v-model="queryParams"
        :warningTypeList="warningTypeList"
        :device-type-list="deviceTypeList"
        :warning-tab="tabIndex"
        @handleQuery="searchQuery"
        @updateWarningTypeList="updateWarningTypeList"
      />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="device-info-right-bottom">
        <el-tabs v-model="tabIndex" @tab-click="tabClick">
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
              :border="false"
              :stripe="true"
            >
              <!-- <template #warinigType="{ row }">
                    {{ getWarinigTypeName(row.warinigType) }}
                  </template>
                  <template #warningLevel="{ row }">
                    {{ getWarningLevelName(row.warningLevel) }}
                  </template> -->
              <template #deviceType="{ row }">
                {{ getDeviceTypeName(row.deviceType) }}
              </template>
              <!-- <template #alarmValue="{ row }">
                    {{ row.alarmValue || '-' }}
                  </template> -->
              <template #handle="{ row }">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  @click="toDetail(row)"
                  >详情
                </el-button>
              </template>
            </RefactorTable>
            <!-- 分页 -->
            <pagination
              v-show="total > 0"
              :total="total"
              layout="prev, pager, next, sizes, total,  jumper"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="warningDataReq"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { http_request } from "@/api";
import QueryForm from "./components/queryForm.vue";
import warningConfig from "./config";
// import store from "@/store";
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
      warningLevelList: [],
      tabIndex: "1",
      warningTabs: [],
      tableColumnsConfig: [], //配置表头数据
      total: 0,
    };
  },

  computed: {},
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
  },

  created() {
    this.deviceTypeList = warningConfig.deviceTypeList;
    // this.warningTypeList = warningConfig.warningTypeList;
    this.warningLevelList = warningConfig.warningLevelList;
    this.getWarningTypes();
    this.getDeviceTypes();
    this.tableColumnsConfig = [
      ...warningConfig.vehicleColumn,
      ...warningConfig.tableColumnsConfig,
    ];
    this.warningTabs = warningConfig.warningTabs;
    // this.warningDataReq();
  },

  mounted() {
    // this.getOrgHttp();
    this.searchQuery();
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
      this.orgCode = this.orgTreeData[0].code;
      console.log("当前code", this.orgCode);

      this.searchQuery();
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
        item.alarmTypeInfoList.map((cItem) => {
          if (cItem.isChoose) {
            warningTypes.push(cItem.id);
          }
        });
      });
      this.queryParams.warningTypes = warningTypes;
      this.searchQuery();
    },
    //设备类型获取
    async getDeviceTypes() {
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "deviceType_list",
      };
      const res = await http_request(obj);
      console.log("设备类型列表", res);
      if (res.code === 200) {
        this.deviceTypeList = res.data;
      }
    },
    //告警类型获取
    async getWarningTypes() {
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warningType_list",
      };
      const res = await http_request(obj);
      console.log("告警类型列表", res);
      let warningTypeList = [];
      if (res.code === 200) {
        warningTypeList = res.data;
        warningTypeList.map((item) => {
          item.alarmTypeInfoList.map((aItem) => {
            aItem.isChoose = true;
          });
        });
        // let list = res.data.device;
        // list = list.concat(res.data.vehicle);
        // console.log(list);
        // let obj = {};
        // list.map(item => {
        //   obj = item;
        //   obj.isChoose = true;
        //   warningTypeList.push(obj);
        // });
        this.warningTypeList = warningTypeList;
        console.log(this.warningTypeList);
      }
    },
    //初始页数请求
    searchQuery() {
      console.log(this.queryParams);
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
    async warningDataReq() {
      this.loading = true;
      const tmp = {
        start: this.queryParams.pageNum,
        limit: this.queryParams.pageSize,
        bigAlarmTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[0]) || null,
        endAlarmTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[1]) || null,
        alarmTypeInfoId: this.queryParams.warningTypes.join(","),
        deviceSeriesModelInfoCode: this.queryParams.deviceType,
      };
      if (this.tabIndex === "1") {
        tmp.dimensionType = "vehicle";
        tmp.licenseNumber = this.queryParams.vehicleCode || null; //车牌号
      } else {
        tmp.dimensionType = "driver";
        tmp.nickName = this.queryParams.driver; //司机姓名
      }
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_list",
        data: tmp,
      };
      console.log("告警参数", obj);
      const res = await http_request(obj);
      this.loading = false;
      console.log("告警列表==>", res);
      if (res.code === 200) {
        this.total = res.data.total;
        this.warningData = res.data.rows;
        console.log(this.warningData);
      }
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
    //设备类型
    getDeviceTypeName(deviceType) {
      let name = "";
      this.deviceTypeList.map((item) => {
        if (item.value === deviceType) {
          name = item.label;
        }
      });
      return name;
    },
    // 告警级别
    getWarningLevelName(level) {
      let levelName = "";
      this.warningLevelList.map((item) => {
        if (item.level === level) {
          levelName = item.name;
        }
      });
      return levelName;
    },
    // 详情
    toDetail(obj) {
      this.$router.push("warningDetail?id=" + obj.id);
      // this.$router.push("/warning/warning/warningDetail/" + obj.driver);
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

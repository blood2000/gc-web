<!-- 告警 -->
<template>
  <div class="pages-info" >
    <div class="pages-info-right" >
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
      <div class="page-table-layout-set" >
        <el-tabs v-model="tabIndex" @tab-click="tabClick">
          <el-tab-pane
            v-for="item in warningTabs"
            :key="item.value"
            :name="item.value"
            :label="item.label"
          >
            <div class="warn-card-box" v-loading="loading">
              <!-- 告警卡片组件 -->
              <template v-if="tabIndex === '1' || tabIndex === '2'">
                <warn-card
                  v-for="(item, index) in warningData"
                  :key="index"
                  :cardInfo="item"
                  :tabIndex="tabIndex"
                  :level="(index % 3) + 1"
                  @openList="openList"
                ></warn-card>
              </template>
              <template v-else>
                <stealing-coal-warn-card v-for="(item, index) in warningData"
                                         :key="index"
                                         :level="(index % 3) + 1"
                                         :cardInfo="item"
                                         @click="showStealingCoalDetail(item)"/>
              </template>
            </div>
            <el-empty v-show="!warningData || warningData.length === 0"></el-empty>
            <!-- 表格 -->
            <!-- <RefactorTable
              :loading="loading"
              :data="warningData"
              row-key="id"
              :table-columns-config="tableColumnsConfig"
              :border="false"
              :stripe="true"
            >
              <template #deviceType="{ row }">
                {{ getDeviceTypeName(row.deviceType) }}
              </template>
              <template #handle="{ row }">
                <el-button size="mini" type="text" @click="toDetail(row)"
                  >详情
                </el-button>
              </template>
            </RefactorTable> -->
            <!-- 分页 -->
            <pagination
              v-show="total > queryParams.pageSize"
              :total="total"
              layout="prev, pager, next,jumper, total,sizes"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="warningDataReq"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <warning-list
      :id="currId"
      :listDrawer="listDrawer"
      :options="{ title: '告警明细'}"
      :drawerQuerys="drawerQuerys"

      @colseListDrawer="colseListDrawer"
    />
    <el-drawer
      v-loading="isLoadingStealingWarnDetail"
      :visible.sync="isShowStealingCoalDetailDrawer"
      :with-header="false"
      direction="rtl"
      style="z-index: 2000"
      size="70%">
      <stealing-coal-warn-detail
        v-if="stealingGoodsWarnDetail"
        @showWarnDetail="showStealingCoalDetail"
        :warn-detail="stealingGoodsWarnDetail"/>
    </el-drawer>
  </div>
</template>

<script>
import { http_request } from "@/api";
import QueryForm from "./components/queryForm.vue";
import WarnCard from "./components/WarnCard.vue";
import warningConfig from "./config";
import WarningList from "./warningList.vue";
import StealingCoalWarnCard from "./components/StealingCoalWarnCard";
import StealingCoalWarnDetail from "./components/StealingCoalWarnDetail";
// import store from "@/store";

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export default {
  name: "warning", // 告警管理
  components: {StealingCoalWarnDetail, StealingCoalWarnCard, QueryForm, WarningList, WarnCard },
  data() {
    return {
      stealingGoodsWarnDetail: null,
      isLoadingStealingWarnDetail: false,
      stealingGoodsWarnList: null,
      isShowStealingCoalDetailDrawer: false,
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
      testData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        vehicleCode: "",
        driver: "",
        deviceType: null,
        dateRange: [],
        warningTypes: [],
      },
      deviceTypeList: [],
      warningTypeList: [],
      subWarningTypeList: [],  //传到告警明细抽屉页面所需的告警类型列表
      warningLevelList: [],
      tabIndex: "1",
      warningTabs: [],
      tableColumnsConfig: [], //配置表头数据
      total: 0,
      total1: 10,
      listDrawer: false,
      currId: null,
      drawerQuerys: {}
    };
  },

  computed: {},
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
    },
    drawerQuerys(val) {
      console.log('drawerQuerys-->', val)
    }
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
    // this.testData = warningConfig.mockData;
  },

  methods: {
    showStealingCoalDetail (item) {
      console.log('showStealingCoalDetail', item)
      this.isShowStealingCoalDetailDrawer = true
      this.isLoadingStealingWarnDetail = true
      http_request({
        moduleName: "http_stealingCoal",
        method: "get",
        url_alias: "detailStealGoodsAlarm",
        url_code: [item.id]
      }).then(res => {
        this.stealingGoodsWarnDetail = res.data
        this.isLoadingStealingWarnDetail = false
      }).catch(error => {
        this.isShowStealingCoalDetailDrawer = false
        this.isLoadingStealingWarnDetail = false
      })
    },
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
            warningTypes.push(cItem.idAndAlarmObject);
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
        url_alias: "selectUserAlarmTypeInfoList",
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
      } else if (this.tabIndex === '2') {
        this.queryParams.vehicleCode = "";
      }
      if (this.tabIndex === '1' || this.tabIndex === '2') {
        this.warningDataReq();
      } else {
        this.stealingGoodsReq()
      }
      // this.vehicleHttpReq();
    },
    async stealingGoodsReq () {
      this.loading = true
      if (this.queryParams.pageNum === 1) {
        this.warningData = []
      }
      const params = {
        typeId: 8001,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        vehicleCode: this.queryParams.vehicleCode
      }
      if (this.queryParams.dateRange && this.queryParams.dateRange[0]) {
        params.startAlarmDate =  this.queryParams.dateRange[0] + ' 00:00:00'
      }
      if (this.queryParams.dateRange && this.queryParams.dateRange[1]) {
        params.endAlarmDate = this.queryParams.dateRange[1] + ' 23:59:59'
      }
      const obj = {
        moduleName: "http_stealingCoal",
        method: "post",
        url_alias: "pagingStealGoodsAlarm",
        data: params,
      };
      console.log("告警参数", obj);
      const res = await http_request(obj);
      this.warningData = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    async warningDataReq() {
      if (this.queryParams.pageNum === 1) {
        this.warningData = []
      }
      if (this.tabIndex === '3') {
        this.stealingGoodsReq()
        return
      }
      this.loading = true;
      const tmp = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        bigAlarmTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[0]) || null,
        endAlarmTime:
          (this.queryParams.dateRange && this.queryParams.dateRange[1]) || null,
        alarmTypeInfoId: this.queryParams.warningTypes.join(","),
        // idAndAlarmObject: this.queryParams.warningTypes.join(","),
        deviceSeriesModelInfoCode: this.queryParams.deviceType,
      };
      this.drawerQuerys.dateRange = this.queryParams.dateRange;
      // this.drawerQuerys.alarmTypeInfoId = this.queryParams.dateRange;
      if (this.tabIndex === "1") {
        tmp.dimensionType = "vehicle";
        tmp.licenseNumber = this.queryParams.vehicleCode || null; //车牌号
        this.drawerQuerys.dimensionType = "vehicle";
      } else {
        tmp.dimensionType = "driver";
        tmp.nickName = this.queryParams.driver; //司机姓名
        this.drawerQuerys.dimensionType = "driver";
      }

      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_notice_list",
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
      console.log("详情", obj);
      this.currId = obj.id;
      this.listDrawer = true;
      // this.$router.push("warningDetail?id=" + obj.id);
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
    //打开详情明细
    openList(params) {
      console.log(params);
      this.listDrawer = true;
      this.drawerQuerys = {...this.drawerQuerys,...params.item};
      this.drawerQuerys.subWarningTypeList = [];

      if (params.type === 'vehicle' || params.type === 'device' || params.type === 'driver') {
        console.log('========>>', params.type)
        this.warningTypeList.map(item => {
          if (item.alarmObject === params.type) {
            this.drawerQuerys.subWarningTypeList[0] = item;
          }
        })
      } else {
        this.drawerQuerys.subWarningTypeList = this.warningTypeList;
      }

    },
    colseListDrawer() {
      this.listDrawer = false;
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
      margin-top: 28px;
    }
  }
}
// .device-info-right-bottom {
//       margin-top: 28px;
//     }
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

.warn-card-box {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 4px 0 0;
  //min-height: 200px;
}
</style>

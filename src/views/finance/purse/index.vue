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
        <div class="device-info-right ">
          <!-- <div class="device-info-right-top" v-show="showSearch">
            <div class="top-title">我的账户</div>
          </div> -->
          <div class="device-info-right-bottom main-box">
            <div class="card-title">我的账户</div>
            <div class="overview-box">
              <div>
                <div>{{ overviewData.rest | priceFormat }} <span>元</span></div>
                <div class="overview-value">余额</div>
              </div>

              <div>
                <div>{{ overviewData.handle | priceFormat }} <span>元</span></div>
                <div class="overview-value">提现处理中金额</div>
              </div>
            </div>
            <div class="btn-box">
              <div class="as-btn" @click="applyCash">提现</div>
              <div @click="toReport(0)">提现记录</div>
              <div>运费记录</div>
              <div>银行卡</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <Apply-Dialog
      :open="open"
      :cardTypeList="cardTypeList"
      :overviewData="overviewData"
      @colseDialog="colseDialog"
    >
    </Apply-Dialog>
  </div>
</template>

<script>
import { http_request } from "@/api";
import QueryForm from "./components/queryForm.vue";
import ApplyDialog from "./components/ApplyDialog.vue";
import purseConfig from "./config";
import format from "../../../utils/format";
// import store from "@/store";
export default {
  name: "purse", // 钱包
  components: { QueryForm, ApplyDialog },
  data() {
    return {
      orgName: "", //组织查询
      orgCode: null, // 当前选中的类型
      defaultTreeProps: {
        children: "childrenOrgList",
        label: "orgName"
      },
      orgTreeData: [],
      showSearch: true, //搜索显隐
      loading: false, //表格load
      overviewData: {},
      cardTypeList: [],
      open: false
    };
  },

  filters: {
    priceFormat: val => {
      return format.priceFormat(val, 2);
    }
  },

  computed: {},

  created() {
    this.overviewData = purseConfig.overviewMock;
    this.cardTypeList = purseConfig.cardTypeList;
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
        url_alias: "orgTree"
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
    //提现申请弹窗
    applyCash() {
      this.open = true;
    },

    //关闭弹窗
    colseDialog() {
      this.open = false;
    },

    // 跳转页面
    toReport(type) {
      if (type === 0) {
        this.$router.push("caseReport?code=13293134f07c4865abd846cdddd40d77");
        console.log(123);
      }
    }
  }
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
    .main-box {
      padding: 10px 20px;
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

.card-title {
  position: relative;
  font-size: 14px;
  font-weight: bold;
  height: 30px;
}

.card-title::before {
  position: absolute;
  content: "";
  top: 2px;
  left: -10px;
  background: #1890ff;
  width: 2px;
  height: 16px;
  border-radius: 2px;
}

.card-title::after {
    content: '';
    height: 1px;
    position: absolute;
    left: -20px;
    right: -20px;
    bottom: 0;
    background: #F3F3F3;
}

.overview-box {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.overview-box > div {
  margin-right: 200px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.overview-box .overview-value,
.overview-box span {
  font-size: 14px;
  font-weight: normal;
}

.btn-box {
  padding: 20px 20px 10px;
  display: flex;
  align-items: center;
}

.btn-box > div {
  font-size: 14px;
  color: #169bd5;
  cursor: pointer;
  margin-right: 30px;
}

.btn-box .as-btn {
  width: 110px;
  height: 36px;
  margin-right: 40px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  background: #169bd5;
  color: #fff;
  font-size: 14px;
}
</style>

<template>
  <el-dialog
    width="688px"
    class="routers"
    title="选择用车企业及路线"
    :visible.sync="routeShow"
    append-to-body
    :before-close="cancel"
  >
    <div class="routers-body">
      <div class="routers-left">
        <div class="routers-title">用车企业</div>
        <div class="routers-center">
          <el-input
            placeholder="请输入企业名称"
            v-model="routeSearch"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>
          <el-radio-group
            v-model="radioValue"
            @change="radioGroupChange"
            class="routers-list"
          >
            <div
              class="routers-list-item"
              v-for="item in routeList"
              :key="item && item.shipmentCode"
            >
              <!-- <div class="routers-list-item-se"> -->
              <!-- <el-checkbox v-model="item.checked" /> -->
              <el-radio :label="item && item.shipmentCode">
                <!-- </div> -->
                <div class="routers-list-item-content">
                  <div class="content-title">
                    {{ item && item.companyName }}
                  </div>
                  <div class="content-info">
                    <img src="../../../assets/images/bang/person.png" alt="" />
                    <div>{{ item && item.linkManName }}</div>
                    <div class="line">|</div>
                    <div>{{ item && item.linkManPhone }}</div>
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
      <div class="routers-right">
        <div class="routers-title">承运路线</div>
        <div class="routers-center">
          <el-input
            placeholder="请输入路线名称"
            v-model="lineSearch"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleLineSearch"
            ></el-button>
          </el-input>
          <el-radio-group
            v-if="lineList.length > 0"
            v-model="radioValue1"
            class="routers-list"
          >
            <div
              class="routers-list-item"
              v-for="item in lineList"
              :key="item.routeCode"
            >
              <el-radio :label="item.routeCode">
                <div class="routers-list-item-content routers-flex">
                  <div class="content-left">
                    <div class="icon-base icon-base-start">起</div>
                    <div class="icon-line"></div>
                    <div class="icon-base icon-base-end">终</div>
                  </div>
                  <div class="content-right">
                    <div class="content-title offset">
                      {{ item.startRoute }}
                    </div>
                    <div class="content-title">{{ item.endRoute }}</div>
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
          <el-empty v-else description="暂无数据"></el-empty>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from "../../../api";
export default {
  props: {
    routeShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    routeShow: {
      handler() {
        if (this.routeShow) {
          console.log("ckc open");
          this.getRouteList();
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      routeSearch: "",
      lineSearch: "",
      routeList: [],
      radioValue: null,
      radioValue1: null,
      lineList: [],
    };
  },
  mounted() {},
  methods: {
    radioGroupChange(e) {
      console.log("e", e);
      this.radioValue1 = null;
      this.getLineList(e, null);
    },
    async getLineList(code, query) {
      this.lineList = [];
      const obj = {
        moduleName: "http_weight",
        method: "get",
        url_alias: "listCompanyRoute",
        url_code: [code],
      };
      if (query) {
        obj.data = { routeName: query };
      }
      console.log("参数", obj);
      const res = await http_request(obj);
      this.lineList = res.data;
      console.log("res", res);
    },
    handleSearch() {
      this.getRouteList();
    },
    handleLineSearch() {
      if (!this.lineSearch) {
        this.getLineList(this.radioValue, this.lineSearch);
        return;
      }
      const lineList = this.lineList;
      if (lineList.length === 0) return;
      const tmp = [];
      for (const item of lineList) {
        console.log("item", item);
        if (
          item.endRoute.includes(this.lineSearch) ||
          item.startRoute.includes(this.lineSearch)
        ) {
          tmp.push(item);
        }
      }
      this.lineList = tmp;
    },
    submitForm() {
      if (!this.radioValue) {
        this.msgWarning("请选择企业");
        return;
      }
      if (!this.radioValue1) {
        this.msgWarning("请选择路线");
        return;
      }
      console.log("radioValue", this.radioValue);
      console.log("radioValue1", this.radioValue1);
      const obj = {
        routeData: {},
        lineData: {},
      };
      for (const item of this.routeList) {
        if (item.shipmentCode === this.radioValue) {
          obj.routeData = { ...item };
        }
      }
      for (const item of this.lineList) {
        if (item.routeCode === this.radioValue1) {
          obj.lineData = { ...item };
        }
      }
      this.$emit("getRouteLineData", obj);
      this.cancel();
    },
    init() {
      this.routeSearch = "";
      this.lineSearch = "";
      this.routeList = [];
      this.radioValue = null;
      this.radioValue1 = null;
      this.lineList = [];
    },
    cancel() {
      this.init();
      this.$emit("closeRoutersDialog", "no");
    },
    async getRouteList() {
      this.routeList = [];
      const obj = {
        moduleName: "http_weight",
        method: "get",
        url_alias: "listCompany",
        data: { companyName: this.routeSearch },
      };
      const res = await http_request(obj);
      if (res.code != 200) return;
      this.routeList = res.data.filter((item) => item);
      console.log("res", res);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body::-webkit-scrollbar {
  width: 0 !important;
}
.routers {
  /deep/ .el-dialog:not(.is-fullscreen) {
    margin-top: 10vh !important;
    height: 638px;
  }
  /deep/ .el-dialog__body {
    padding: 19px 10px;
    padding-top: 0;
  }
  /deep/ .el-dialog__header {
    padding: 19px 10px;
    border-bottom: none;
  }
  /deep/ .el-input-group__append,
  .el-input-group__prepend {
    height: 32px;
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
}
.routers-body {
  display: flex;
  height: 490px;
}
.routers-left {
  margin-right: 28px;
  /deep/ .el-radio__input {
    bottom: 35px;
  }
}
.routers-title {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
  margin-bottom: 8px;
}
.routers-center {
  width: 316px;
  height: 460px;
  background: #f8f8f8;
  box-sizing: border-box;
  border-radius: 2px;
  box-sizing: border-box;

  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}
// .footers {
//   margin-top: 30px;
//   float: right;
// }
.input-with-select {
  margin-bottom: 16px;
  padding: 12px;
  padding-bottom: 0;
}
.routers-list {
  flex: 1;
  overflow: scroll;
  padding: 0;
  padding-left: 10px;
  &-item {
    padding: 10px 12px;
    padding-right: 0;
    height: 64px;
    margin-bottom: 16px;
    display: flex;
    box-sizing: border-box;
    background: #ffffff;
    &-content {
      flex: 1;
    }
    &-se {
      width: 36px;
      height: 100%;
      text-align: center;
    }
  }
}
/deep/ .el-radio__label {
  display: inline-block;
}

.content-title {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
  margin-bottom: 15px;
}
.content-right {
  flex: 1;
}
.offset {
  margin-bottom: 9px;
}
.icon-base {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
  margin-right: 7px;
  line-height: 15px;
  text-align: center;
}
.icon-base-start {
  background: #ffbc00;
}
.icon-line {
  margin: 1px 0;
  width: 0px;
  height: 4px;
  border: 1px solid #dcdcdc;
  opacity: 1;
  margin-left: 7px;
}
.icon-base-end {
  background: #4682fa;
}
.routers-flex {
  display: flex;
}
.content-info {
  display: flex;
  align-items: center;
  & > img {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-right: 4px;
  }
  & > div {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
  }
  & > .line {
    margin: 0 5px;
  }
}
</style>

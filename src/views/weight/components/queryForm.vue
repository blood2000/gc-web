<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
    class="ddc-monitor-queryParams"
    label-position="top"
  >
    <div class="ddc-monitor-queryParams-left">
      <div class="up">
        <el-form-item label="车牌号：" prop="vehicleNumber">
          <el-input
            v-model="queryParams.vehicleNumber"
            placeholder=" 请输入车牌号"
            clearable
            style="width: 204px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="司机：" prop="driverNameOrPhone">
          <el-input
            v-model="queryParams.driverNameOrPhone"
            placeholder=" 请输入司机姓名"
            clearable
            style="width: 164px"
            @keyup.enter.native="$emit('handleQuery')"
          />
        </el-form-item>
        <el-form-item label="磅单日期：">
          <el-date-picker
            v-model="queryParams.dateRange"
            unlink-panels
            :picker-options="pickerOptions"
            size="small"
            style="width: 376px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="用车企业及路线：" prop="routeCode">
          <!-- <el-select
            v-model="queryParams.routeCode"
            clearable
            filterable
            style="width: 331px"
            placeholder="请选择用车企业及路线"
            @change="$emit('handleQuery')"
          >
            <el-option
              v-for="(item, index) in listCompany"
              :key="index"
              :label="item.companyName"
              :value="item.shipmentCode"
            />
          </el-select> -->
          <el-cascader
            style="width: 300px"
            v-model="cascaderVal"
            @change="companyRouteChange"
            :props="companyRouteProps"
            clearable
          ></el-cascader>
          <!-- <el-cascader
          @change="companyRouteChange"
          :options="listCompany"
            :props="companyRouteProps"
          ></el-cascader> -->
        </el-form-item>

        <el-form-item label="货品类型：" prop="goodsCode">
          <el-cascader
            clearable
            filterable
            v-model="queryParams.goodsCode"
            @change="cascaderChange"
            :options="goodsTypeList"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </div>
    </div>
    <div class="ddc-monitor-queryParams-right">
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('handleQuery')"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          class="ddc-queryParams-right-reset"
          plain
          icon="el-icon-refresh"
          style="margin-left: 16px"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { pickerOptions } from "@/utils/dateRange";
import { http_request } from "../../../api";

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    snList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      listCompany: [],
      isShow: false,
      pickerOptions,
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
      cascaderVal: null,
      companyRouteProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          console.log("node", node);
          const { level } = node;
          setTimeout(() => {
            // if (node && node.value) {

            //             const obj = {
            //               moduleName: "http_weight",
            //               method: "get",
            //               url_alias: "listCompanyRoute",
            //               url_code: [node.value],
            //             };
            //             http_request(obj).then((res) => {
            //               const nodes = res.data.map((item) => {
            //                 console.log('item',item)
            //                 return {
            //                   value: item.routeCode,
            //                   label: `${item.startRoute} -> ${item.endRoute}`,
            //                   leaf:2
            //                 };
            //               });
            //               console.log('nodes',nodes)
            //               resolve(nodes);
            //             });
            //             // listCompanyRoute
            //           } else {
            //             console.log('你不会进来了吧')
            //             resolve();
            //           }
            if (node.level == 0) {
              const obj = {
                moduleName: "http_weight",
                method: "get",
                url_alias: "listCompany",
              };
              http_request(obj).then((res) => {
                const nodes0 = res.data.map((item) => ({
                  value: item.shipmentCode,
                  label: item.companyName,
                  leaf: node.level >= 2,
                }));
                console.log("nodes 0", nodes0);
                resolve(nodes0);
              });
            }
            if (node.level == 1) {
              console.log("node.level", node.level);
              const obj = {
                moduleName: "http_weight",
                method: "get",
                url_alias: "listCompanyRoute",
                url_code: [node.value],
              };
              console.log("obj", obj);
              http_request(obj).then((res) => {
                console.log("res", res.data);
                const nodes = res.data.map((item) => {
                  console.log("item", item);
                  return {
                    value: item.routeCode,
                    label: `${item.startRoute} -> ${item.endRoute}`,
                    leaf: node.level == 1,
                  };
                });
                console.log("nodes", nodes);
                resolve(nodes);
              });
            }
          }, 100);
        },
        // value: "shipmentCode",
        // label: "companyName",
        // leaf: "leaf",
      },
    };
  },
  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    goodsTypeList() {
      return this.$store.state.dict.goodsTypeList;
    },
  },

  mounted() {
    this.getListCompany();
  },
  methods: {
    companyRouteChange(e) {
      console.log("companyRouteChange e", e);
      if (e.length === 0) {
        this.queryParams.companyName = null;
        this.queryParams.routeCode = null;
      } else {
        this.queryParams.companyName = e[0];
        this.queryParams.routeCode = e[1];
      }
    },
    cascaderChange(e) {
      if (!e || e.length < 2) return;
      this.queryParams.goodsCode = e[1];
      this.$emit("handleQuery");
    },

    async getListCompany() {
      const obj = {
        moduleName: "http_weight",
        method: "get",
        url_alias: "listCompany",
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.listCompany = res.data.filter((item) => item);
    },
    reset() {
      this.queryParams.pageNum = 1;
      this.queryParams.dateRange = []
      this.queryParams.companyName = null
      this.queryParams.routeCode = null
      this.cascaderVal = null
      // this.resetForm('queryForm');
      console.log("qqq", this.$refs["queryForm"]);
      this.$refs["queryForm"].resetFields();
      this.$emit("handleQuery");
    },
    hanleIsShow() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="scss" scoped>
.ddc-monitor-queryParams {
  display: flex;
  padding: 0 24px;
  // background: #f0f2f5;
  .ddc-monitor-queryParams-left {
    flex: 1;
    .down {
      margin-bottom: 16px;
    }
    // background: brown;
  }
  .ddc-monitor-queryParams-right {
    width: 310px;
    box-sizing: border-box;
    padding-top: 30px;
    padding-bottom: 7px;
    display: flex;
    justify-content: flex-end;
    & > div {
      cursor: pointer;
      color: #409eff;
      font-size: 14px;
      margin-right: 20px;
      line-height: 30px;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }
    &-reset {
      background-color: transparent !important;
    }
    &-reset:hover {
      background-color: #409eff !important;
    }
    &-reset:focus,
    &-reset:active {
      background-color: transparent !important;
      color: #1890ff;
    }
  }
}
</style>

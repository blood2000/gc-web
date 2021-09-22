<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :span="9">
        <el-card class="box-card detail-left">
          <h2>车辆信息</h2>
          <div class="info">
            <div class="info-title">
              <span>基础信息</span>
              <el-divider></el-divider>
            </div>
            <div class="base-info">
              <div>
                <span> 车牌号： </span>
                <span>{{
                  isPageShow("vehicleLicenseInf", "licenseNumber")
                }}</span>
              </div>
              <div>
                <span> 归属组织： </span>
                <span> {{ orgName }}</span>
              </div>
              <div>
                <span> 车辆分组： </span>
                <span>{{ isPageShow("vehicleInf", "group") }} </span>
              </div>

              <div>
                <span> 车辆识别代号： </span>
                <span
                  >{{ isPageShow("vehicleLicenseInf", "chassisNumber") }}
                </span>
              </div>
              <div>
                <span> 发动机号： </span>
                <span>
                  {{ isPageShow("vehicleLicenseInf", "engineNumber") }}</span
                >
              </div>

              <div>
                <span> 车辆类型： </span>
                <span> {{ isPageShow("vehicleInf", "vehicleTypeValue") }}</span>
              </div>
              <div>
                <span> 车辆承运类型： </span>
                <span>
                  {{ isPageShow("vehicleInf", "carrierTypeValue") }}
                </span>
              </div>
              <div>
                <span> 车牌类型： </span>
                <span
                  >{{ isPageShow("vehicleInf", "vehicleLicenseColorValue") }}
                </span>
              </div>

              <div>
                <span> 车辆能源类型： </span>
                <span
                  >{{ isPageShow("vehicleInf", "vehicleEnergyTypeValue") }}
                </span>
              </div>
              <div>
                <span> 车辆总重量： </span>
                <span
                  >{{ isPageShow("vehicleInf", "vehicleTotalWeight") }} 吨
                </span>
              </div>
              <div>
                <span> 车辆可载重量： </span>
                <span
                  >{{ isPageShow("vehicleInf", "vehicleLoadWeight") }} 吨
                </span>
              </div>

              <div>
                <span> 备注信息： </span>
                <span>{{ vehicleInfo.remark }} </span>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info-title">
              <span>状态信息</span>
              <el-divider></el-divider>
            </div>
            <el-row>
              <el-col :span="12">
                <span>车辆状态：</span>
                <span>{{ vehicleInfo.enabledValue }}</span>
              </el-col>
              <el-col :span="12">
                <span>停用状态：</span>
                <span>{{ vehicleInfo.vehicleStatusValue }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="info">
            <div class="info-title">
              <span>默认司机</span>
              <el-divider></el-divider>
            </div>
            <el-row>
              <el-col :span="12">
                <span>司机姓名：</span>
                <span></span>
              </el-col>
              <el-col :span="12">
                <span>司机电话：</span>
                <span></span>
              </el-col>
            </el-row>
          </div>
          <div class="info">
            <div class="info-title">
              <span>证件资料</span>
              <el-divider></el-divider>
            </div>
            <el-row :gutter="10">
              <el-col :span="8">
                <div>
                  <img
                    width="100%"
                    :src="isPageShow('vehicleLicenseInf', 'vehicleLicenseImg')"
                    alt=""
                  />
                </div>
                <div><span>驾驶证主页</span></div>
              </el-col>
              <el-col :span="8">
                <div>
                  <img
                    width="100%"
                    :src="
                      isPageShow('vehicleLicenseInf', 'vehicleLicenseSecondImg')
                    "
                    alt=""
                  />
                </div>
                <div><span>驾驶证副页</span></div>
              </el-col>
              <el-col :span="8">
                <div>
                  <img
                    width="100%"
                    :src="vehicleInfo.roadTransportCertificateImg"
                    alt=""
                  />
                </div>
                <div><span>道路运输许可证</span></div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <p>注册时间：</p>
                <span>{{
                  parseTime(
                    isPageShow("vehicleLicenseInf", "registerDate"),
                    "{y}-{m}-{d}"
                  )
                }}</span>
              </el-col>
              <el-col :span="8">
                <p>发证日期：</p>
                <span>{{
                  parseTime(
                    isPageShow("vehicleLicenseInf", "issueDate"),
                    "{y}-{m}-{d}"
                  )
                }}</span>
              </el-col>
              <el-col :span="8">
                <p>发证机关：</p>
                <span>{{
                  isPageShow("vehicleLicenseInf", "issuingOrganizations")
                }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="info">
            <div class="info-title">
              <span>设备信息</span>
              <el-divider></el-divider>
            </div>
            <el-row :gutter="10">
              <el-col :span="8">
                <span>设备编号：</span>
                <span>{{ vehicleInfo.defaultDriverCode }} </span>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-card class="box-card detail-right">
          <div class="maps"></div>
          <div class="tables">
            <div class="table-title">
              告警信息
              {{ warningInfo.length ? "(" + warningInfo.length + ")" : "" }}
            </div>
            <RefactorTable
              :loading="loading"
              :data="warningInfo"
              row-key="id"
              :table-columns-config="warningInfoTableColumnsConfig"
            >
              <!-- <template #warinigType="{ row }">
                    {{ getWarinigTypeName(row.warinigType) }}
                  </template>
                  <template #warningLevel="{ row }">
                    {{ getWarningLevelName(row.warningLevel) }}
                  </template> -->
              <template #handle="{ row }">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-tickets"
                  @click="toWarningDetail(row)"
                  >详情
                </el-button>
              </template>
            </RefactorTable>
            <!-- 分页 -->
            <pagination
              v-show="warningTotal > 0"
              :total="warningTotal"
              :page.sync="warningQuerys.pageNum"
              :limit.sync="warningQuerys.pageSize"
              @pagination="warningDataReq"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { http_request } from "../../../api";
import vehicleConfig from "./vehicle_config";
export default {
  name: "vehicleDetail",
  components: {},
  data() {
    return {
      code: "",
      vehicleInfo: {},
      orgName: "",
      warningInfo: [],  //告警列表信息
      warningTotal: 0,
      warningQuerys: {   //告警查询参数
        pageNum: 1,
        pageSize: 10,
      },
      warningInfoTableColumnsConfig: [],
      loading: false
    };
  },
  mounted() {
    this.getVehicleDetailHttp();

    this.warningInfoTableColumnsConfig =
      vehicleConfig.warningInfoTableColumnsConfig;
  },
  created() {},
  computed: {},
  methods: {
    isPageShow(info, val) {
      return (
        this.vehicleInfo &&
        this.vehicleInfo[info] &&
        this.vehicleInfo[info][val]
      );
    },
    async returnOrgcode(val) {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "infoOrg",
        url_code: [val]
      };
      const res = await http_request(obj);
      return res.data.orgName;
    },
    getVehicleDetailHttp() {
      const me = this;
      me.code = document.location.search.split("=")[1];
      console.log("code", me.code);
      const obj = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "vehicle_detail",
        url_code: [me.code]
      };
      http_request(obj).then(res => {
        console.log("getVehicleDetailHttp res", res);
        me.vehicleInfo = res.data;
        me.returnOrgcode(me.vehicleInfo.orgCode).then(name => {
          console.log("name", name);
          me.orgName = name;
        });
        console.log("vehicleInfo----", me.vehicleInfo);
        this.getWarningInfo();
      });
    },

    getWarningInfo() {
      this.warningQuerys.pageNum = 1;
      this.warningDataReq();
    },
    async warningDataReq() {
      this.loading = true;
      let tmp = {
        start: this.warningQuerys.pageNum,
        limit: this.warningQuerys.pageSize,
        licenseNumber: this.vehicleInfo.vehicleLicenseInf.licenseNumber,
        // licenseNumber: "闽A124QW",
        dimensionType: 'vehicle'
      };
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_list",
        data: tmp
      };
      const res = await http_request(obj);
      this.loading = false;
      console.log("告警列表==>", res);
      // warningTotal
      if (res.code === 200) {
        this.warningTotal = res.data.total;
        this.warningInfo = res.data.rows;
        console.log(this.warningInfo);
      }
    },

    // 详情
    toWarningDetail(obj) {
      this.$router.push("../../warning/warningDetail?id=" + obj.id);
      // this.$router.push({name: "warningDetail", params: {driver: obj.driver}});
    }
  }
};
</script>

<style lang="scss" scoped>
.base-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  div {
    width: 50%;
    min-width: 80px;
    // margin-right: 20px;
    margin-bottom: 20px;
  }
}
.device-info {
  margin: 0 15px;
  @mixin box-shadow {
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }
}
.detail-left {
  min-height: 700px;
  // background: red;
  h2 {
    color: #262626;
    font-weight: bold;
  }
  .info-title {
    display: flex;
    flex-direction: row;
    span {
      width: 80px;
      line-height: 49px;
    }
  }
  .mar-bottom {
    margin-bottom: 20px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .info-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    span {
      // margin-right: 10px;
    }
  }
}
.detail-right {
  min-height: 700px;
  .maps {
    height: 450px;
  }
}
// 告警信息表格标题
.table-title {
  font-weight: bold;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
</style>

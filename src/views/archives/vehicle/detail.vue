 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="50%"
    :append-to-body="true"
  >
  <div>


    <TitleSideBlueTip title="基础信息" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车牌号:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.vehicleAlias?`(${vehicleInfo.vehicleAlias})  ${isPageShow("vehicleLicenseInf", "licenseNumber")}`:isPageShow("vehicleLicenseInf", "licenseNumber")}}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">归属组织:</span>
          <span class="dispatch-base-text"> {{ orgName }}</span>
        </el-col>
        <!-- <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车辆分组:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "group") }}</span
          >
        </el-col> -->
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车辆识别代号:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleLicenseInf", "chassisNumber") }}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">发动机号:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleLicenseInf", "engineNumber") }}</span
          >
        </el-col>
      </el-row>
      <el-row class="contents-box">
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车辆类型:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "vehicleTypeValue") }}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车辆承运类型:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.carrierTypeValue }}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">车牌类型:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "vehicleLicenseColorValue") }}</span
          >
        </el-col>
        <el-col :span="8" >
          <span class="dispatch-base-label">车辆能源类型:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "vehicleEnergyTypeValue") }}</span
          >
        </el-col>
        <el-col :span="8" >
          <span class="dispatch-base-label">车辆总重量:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "vehicleTotalWeight") }}</span
          >
        </el-col>

        <el-col :span="8" >
          <span class="dispatch-base-label">车辆可载重量:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleInf", "vehicleLoadWeight") }}</span
          >
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="状态信息" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <el-col :span="8" >
          <span class="dispatch-base-label">车辆状态:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.vehicleStatusValue }}</span
          >
        </el-col>

        <el-col :span="8" >
          <span class="dispatch-base-label">停用状态:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.enabledValue }}</span
          >
        </el-col>

        <el-col :span="8">
          <span class="dispatch-base-label">认证状态:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.authStatusValue }}</span
          >
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="默认司机" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <el-col :span="8" >
          <span class="dispatch-base-label">司机姓名:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.defaultDriverName }}</span
          >
        </el-col>
        <el-col :span="8" >
          <span class="dispatch-base-label">司机电话:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.defaultDriverTelphone }}</span
          >
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="证件资料" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">注册时间:</span>
          <span class="dispatch-base-text">
            {{
              parseTime(
                isPageShow("vehicleLicenseInf", "registerDate"),
                "{y}-{m}-{d}"
              )
            }}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">发证日期:</span>
          <span class="dispatch-base-text">
            {{
              parseTime(
                isPageShow("vehicleLicenseInf", "issueDate"),
                "{y}-{m}-{d}"
              )
            }}</span
          >
        </el-col>
        <el-col :span="8" style="padding-bottom: 16px">
          <span class="dispatch-base-label">发证机关:</span>
          <span class="dispatch-base-text">
            {{ isPageShow("vehicleLicenseInf", "issuingOrganizations") }}</span
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="dispatch-base-label">驾驶证主页:</span>
          <div class="img-box">
            <img
              :src="isPageShow('vehicleLicenseInf', 'vehicleLicenseImg')"
              alt=""
            />
          </div>
        </el-col>
        <el-col :span="8">
          <span class="dispatch-base-label">驾驶证副页:</span>
          <div class="img-box">
            <img
              :src="isPageShow('vehicleLicenseInf', 'vehicleLicenseSecondImg')"
              alt=""
            />
          </div>
        </el-col>
        <el-col :span="8">
          <span class="dispatch-base-label">道路运输许可证:</span>
          <div class="img-box">
            <img :src="vehicleInfo.roadTransportCertificateImg" alt="" />
          </div>
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="设备信息" />
    <div class="dispatch-base-contents-box">
      <el-row class="contents-box">
        <!-- device -->
         <el-col :span="12">
          <span class="dispatch-base-label">设备名称:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.deviceName }}</span
          >
        </el-col>
        <el-col :span="12">
          <span class="dispatch-base-label">设备编号:</span>
          <span class="dispatch-base-text">
            {{ vehicleInfo.deviceNumber }}</span
          >
        </el-col>
      </el-row>
    </div>
    <TitleSideBlueTip title="位置信息" />
    <div class="dispatch-base-contents-box" style="height: 400px;">
      <!-- 地图 -->
      <div id="device-map-container" style="height: 400px" />
    </div>
    <TitleSideBlueTip title="告警信息">
      {{ warningInfo.length ? "(" + warningInfo.length + ")" : "" }}
    </TitleSideBlueTip>

    <div class="dispatch-base-contents-box" style="padding-bottom: 114px">
      <!-- <div > -->
      <RefactorTable
        :loading="loading"
        :data="warningInfo"
        row-key="id"
        :table-columns-config="warningInfoTableColumnsConfig"
        :isShowIndex="true"
        :border="false"
        :stripe="true"
      >
        <template #handle="{ row }">
          <el-button size="mini" type="text" @click="toWarningDetail(row)"
            >详情
          </el-button>
        </template>
      </RefactorTable>
      <!-- </div> -->

      <!-- 分页 -->
      <pagination
        v-show="warningTotal > 0"
        :total="warningTotal"
        :page.sync="warningQuerys.pageNum"
        :limit.sync="warningQuerys.pageSize"
        @pagination="warningDataReq"
      />
    </div>
      </div>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
import vehicleConfig from "./vehicle_config";
export default {
  name: "vehicleDetail",
  components: {},
  data() {
    return {
      // 地图
      map: null,
      geocoder: null,
      marker: null,
      vehicleInfo: {},
      orgName: "",
      warningInfo: [], //告警列表信息
      warningTotal: 0,
      warningQuerys: {
        //告警查询参数
        pageNum: 1,
        pageSize: 10,
      },
      warningInfoTableColumnsConfig: [],
      loading: false,
      offsetList: null,
    };
  },
  props: {
    code: {
      type: String,
      default: "",
    },
    detailDrawer: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  watch: {
    detailDrawer() {
      console.log("我在监听");
      if (this.detailDrawer) {
        console.log("他变成true", this.code);
        // 地图
        this.$nextTick(() => {
          this.initMap();
        });
        this.getVehicleDetailHttp();
      }
    },
  },
  computed: {},
  mounted() {
    this.offsetList = vehicleConfig.offsetList;
    this.warningInfoTableColumnsConfig =
      vehicleConfig.warningInfoTableColumnsConfig;
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      console.log("AMap", AMap);
      if (!AMap) {
        this.msgWarning("地图加载失败，请刷新页面重试");
        return;
      }
      this.map = new AMap.Map("device-map-container", {
        mapStyle: "amap://styles/2fe468ae95b55caa76404a537353e63a", //设置地图的显示样式
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11,
      });
      console.log(
        "==========>",
        new AMap.Geocoder({
          radius: 1000,
          extensions: "all",
        })
      );
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all",
      });
    },
    // 获取车辆定位列表
    async getVehicleLoLocations() {
      const me = this;
      console.log("me.vehicleInfo", me.vehicleInfo);
      const params = {
        orgCode: me.vehicleInfo.orgCode,
        groupCode: me.vehicleInfo.vehicleInf.group,
        plateNumber: me.vehicleInfo.vehicleInf.licenseNumber,
      };
      const obj = {
        moduleName: "http_map",
        method: "post",
        url_alias: "getVehicleLoLocations",
        data: params,
      };
      const res = await http_request(obj);
      console.log("获取车辆定位列表   res", res);
      if (res.data.total !== 1) return ;
      const attribute = res.data.rows[0].attribute;
      if (
        attribute &&
        attribute.coordinate &&
        attribute.coordinate.value &&
        attribute.coordinate.value.length === 2 &&
        attribute.coordinate.value[0] &&
        attribute.coordinate.value[1]
      ) {
        console.log("res.data.rows[0]", res.data.rows[0]);
        this.drawVehicleMarker(res.data.rows[0]);
        this.$nextTick(() => {
          this.map.setFitView();
        });
      }
    },
    drawVehicleMarker(row) {
      const me = this;
      const { carrier_type, plate_number, attribute } = row;
      const direction = attribute.direction || {};
      const onlineStatus = attribute.onlineStatus || {};
      const speed = attribute.speed || {};
      const position = attribute.coordinate.value;
      const statusColor = onlineStatus === 1 ? "green" : "gray"; // 设备状态 0离线 1在线
      const contentValue = [];
      if (speed.text) contentValue.push(`${speed.text}km/h`);
      if (direction.text) contentValue.push(`${direction.text}°`);
      // 绘制标记
      const styleObjContent = `<div style="transform:rotate(${
        direction.value || -30
      }deg)" class="own-device-marker-car ${carrier_type || "qt"}"></div>`;
      const styleObj = {
        content: styleObjContent,
        offset: this.offsetList[carrier_type || "qt"],
        angle: 0,
      };
      const marker = this.drawMarker(position, styleObj);
      // 绘制文本框
      const info = [];
      info.push("<div class='own-map-vehicle-marker-label'>");
      info.push("<h5>" + plate_number);
      if (onlineStatus.text)
        info.push(
          "<span class='status " +
            statusColor +
            "'><strong class='mr5'>· </strong>" +
            onlineStatus.text +
            "</span>"
        );
      info.push("</h5>");
      if (contentValue.length > 0)
        info.push(
          "<p class='input-item'>" + contentValue.join("  |  ") + "</p>"
        );
      info.push("</div>");
      const content = this.setLabelContent(info, { offset: [0, -10] });
      this.setLabel(marker, content);
      // 单击
      marker.on("click", function (e) {
        if (JSON.stringify(marker.getLabel()) === "{}") {
          me.setLabel(marker, content);
        } else {
          me.setLabel(marker, {});
        }
      });
    },
    /** 设置点标记的文本标签
     * @param {Object} marker 标记点对象
     * @param {Object} content 文本内容,没有就不传
     */
    setLabel(marker, content = {}) {
      if (!marker) return;
      marker.setLabel(content);
    },
    /** 生成文本标签内容
     * @param {string} info 文本标签内容,没有就不传
     * @param {Array} offset 文本标签偏移量
     * @param {string} direction 文本标签出现位置 top'|'right'|'bottom'|'left'|'center
     */
    setLabelContent(info = [], { offset = [0, -8], direction = "top" }) {
      const option =
        info.length > 0
          ? {
              offset: new AMap.Pixel(offset[0], offset[1]),
              content: info.join(""),
              direction,
            }
          : {};
      return option;
    },
    /** 绘制标记
     * @param {Array} position 经纬度必传
     * @param {Object} labelText 信息窗内容,没有就不传
     * @param {string} content 图标
     * @param {Array} offset 图标偏移量
     * @param {number} angle 旋转角度
     */
    drawMarker(
      position,
      {
        clickable = true,
        content = '<div class="own-device-marker-car qt"></div>',
        offset = [0, 0],
        angle = 0,
      }
    ) {
      const marker = new AMap.Marker({
        map: this.map,
        position,
        content,
        autoFitView: true,
        autoRotation: true,
        offset: new AMap.Pixel(offset[0], offset[1]),
        angle,
        clickable,
        topWhenClick: true, // 鼠标点击时marker置顶
      });
      return marker;
    },
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
        url_code: [val],
      };
      const res = await http_request(obj);
      return res.data.orgName;
    },
    getVehicleDetailHttp() {
      const me = this;
      console.log("code", me.code);
      const obj = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "vehicle_detail",
        url_code: [me.code],
      };
      http_request(obj).then((res) => {
        console.log("getVehicleDetailHttp res", res);
        me.vehicleInfo = res.data;
        me.returnOrgcode(me.vehicleInfo.orgCode).then((name) => {
          console.log("name", name);
          me.orgName = name;
        });
        console.log("vehicleInfo----", me.vehicleInfo);
        this.getWarningInfo();
        this.getVehicleLoLocations();
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
        dimensionType: "vehicle",
      };
      const obj = {
        moduleName: "http_warning",
        method: "get",
        url_alias: "warning_list",
        data: tmp,
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
       this.$store.commit("SET_SIDE_SECOND_ROUTERS", []);
      this.$store.commit("app/SET_RECORDMODULENAME", "warning");
      // this.$router.push({name: "warningDetail", params: {driver: obj.driver}});
    },
    handleClose() {
      this.$emit("colseDetailDrawer");
    },
  },
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
      flex-shrink: 0;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 47px;
      color: #262626;
      opacity: 1;
      display: inline-block;
      margin-right: 12px;
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
.dispatch-base-contents-box {
    // 地图
    > #device-map-container {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      // 地图信息窗体样式-覆盖
      ::v-deep.amap-info-sharp {
        display: none;
      }
      ::v-deep.amap-info-content {
        background: transparent;
        box-shadow: 0px 3px 5px rgba(206, 206, 206, 0.7);
        padding: 0;
        .amap-info-close {
          top: 6px;
          right: 6px !important;
        }
      }
      // 地图标记label样式-覆盖
      ::v-deep.amap-marker-label {
        border: none;
        font-size: 12px;
        line-height: 14px;
        background: transparent;
        color: #262626;
        box-shadow: none;
        padding: 0;
        // &::after{
        //   content: '';
        //   position: absolute;
        //   bottom: -6px;
        //   left: 50%;
        //   transform: translateX(-50%);
        //   border-left: 6px solid transparent;
        //   border-top: 6px solid #fff;
        //   border-right: 6px solid transparent;
        // }
      }
      // 车标记的信息样式
      ::v-deep.own-map-vehicle-marker-label {
        min-width: 218px;
        min-height: 40px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 3px 5px rgba(206, 206, 206, 0.7);
        border-radius: 4px;
        padding: 8px 12px;
        > h5 {
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 24px;
          color: #3d4050;
          > .status {
            float: right;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            &.blue {
              color: #4682fa;
            }
            &.green {
              color: rgba(67, 185, 30, 1);
            }
            &.red {
              color: rgba(239, 105, 105, 1);
            }
            &.gray {
              color: rgba(173, 181, 189, 1);
            }
          }
        }
        > .input-item {
          height: 26px;
          line-height: 26px;
          background: #e4ecf4;
          opacity: 1;
          border-radius: 5px;
          margin-top: 8px;
          padding: 0 8px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 600;
          color: #3d4050;
        }
      }
      // 巡航信息窗体样式
      ::v-deep.own-map-navgtr-info-window {
        min-width: 216px;
        max-width: 246px;
        min-height: 68px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
        padding: 10px 18px 10px 14px;
        .input-item {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 24px;
          color: #3d4050;
          > span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 24px;
            color: #a6a8ad;
            margin-right: 2px;
            padding-left: 22px;
            &.speed {
              background: url("~@/assets/images/device/icon_speed.png")
                no-repeat 0px 1px;
              background-size: 16px 16px;
            }
            &.time {
              background: url("~@/assets/images/device/icon_time.png") no-repeat
                0px 2px;
              background-size: 16px 16px;
            }
          }
        }
      }
      // 轨迹起点终点样式
      ::v-deep.own-device-line-icon {
        width: 118px;
        height: 118px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 50%;
        padding: 31px;
        position: relative;
        > div {
          width: 24px;
          height: 24px;
          line-height: 24px;
          border-radius: 50%;
          margin: 16px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #ffffff;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        &::after {
          content: "";
          position: absolute;
          width: 56px;
          height: 56px;
          top: 31px;
          left: 31px;
          background: rgba(255, 255, 255, 0.72);
          border-radius: 50%;
          z-index: 0;
        }
        &.start {
          > div {
            background: linear-gradient(180deg, #ffbc00 0%, #ff9405 100%);
            box-shadow: 0px 0px 6px rgba(241, 184, 25, 0.35);
          }
        }
        &.end {
          > div {
            background: linear-gradient(180deg, #4682fa 0%, #1359e6 100%);
            box-shadow: 0px 0px 6px rgba(70, 130, 250, 0.49);
          }
        }
      }
      // 标记物车样式
      ::v-deep.own-device-marker-car {
        transform-origin: center center;
        &.ztc {
          width: 34px;
          height: 76px;
          background: url("~@/assets/images/device/map_car_ztc.png") no-repeat;
          background-size: 100% 100%;
        }
        &.jbc {
          width: 34px;
          height: 80px;
          background: url("~@/assets/images/device/map_car_jbc.png") no-repeat;
          background-size: 100% 100%;
        }
        &.llc {
          width: 28px;
          height: 62px;
          background: url("~@/assets/images/device/map_car_llc.png") no-repeat;
          background-size: 100% 100%;
        }
        &.phc {
          width: 31px;
          height: 79px;
          background: url("~@/assets/images/device/map_car_phc.png") no-repeat;
          background-size: 100% 100%;
        }
        &.qt {
          width: 31px;
          height: 79px;
          background: url("~@/assets/images/device/map_car_qt.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      // 巡航装卸货停车点样式
      ::v-deep.own-navgtr-marker {
        width: 30px;
        height: 48px;
        animation: show-marker 3s;
        @keyframes show-marker {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        &.loading {
          background: url("~@/assets/images/device/map_icon_loading.png")
            no-repeat;
          background-size: 100% 100%;
        }
        &.unloading {
          background: url("~@/assets/images/device/map_icon_unloading.png")
            no-repeat;
          background-size: 100% 100%;
        }
        &.vehicle-stop {
          background: url("~@/assets/images/device/map_icon_vehicle-stop.png")
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
}
// 告警信息表格标题
.table-title {
  font-weight: bold;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
.img-box {
  padding-top:12px;
  background: url("../../../assets/images/certificate/none_data.png") no-repeat
    center;
  width: 90%;
  height: 132px;
  border-radius: 10px;
  & > img {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div class="device-info">
  
  </div>
</template>

<script>
import { http_request } from "../../../api";
export default {
  name: "caseReport",
  components: {},
  data() {
    return {
      code: "",
      vehicleInfo: {},
      orgName: "",
    };
  },
  mounted() {
    this.getVehicleDetailHttp();
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
        url_code: [val],
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
        url_code: [me.code],
      };
      http_request(obj).then((res) => {
        console.log("getVehicleDetailHttp res", res);
        me.vehicleInfo = res.data;
        me.returnOrgcode(me.vehicleInfo.orgCode).then((name) => {
          console.log("name", name);
          me.orgName = name;
        });
      });
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
    min-width: 80px;
    margin-right: 20px;
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
</style>
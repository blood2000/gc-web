<template>
  <el-dialog
    :title="options.title"
    :visible.sync="open"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="addOk"
  >
    <div class="device-content">
      <el-row v-if="isbang" class="device-content-header">
        <el-col :span="5" class="device-content-header-image">
          <img
            class="device-image"
            :src="dealDeviceImage(deviceInfo.modelImageUrl)"
            alt=""
          />
        </el-col>
        <el-col :span="18" class="device-content-header-right">
          <div class="device-content-header-right-title">
            <span>{{ deviceInfo.seriesName }}</span>
            <el-button
              type="danger"
              style="float: right"
              @click="del(deviceInfo)"
              >解 绑</el-button
            >
          </div>
          <div class="device-content-header-right-title">
            {{ deviceInfo.modelName }}
          </div>
          <div class="device-content-header-right-sub">
            {{ deviceInfo.deviceSN }}
          </div>
          <div>绑定时间：{{ deviceInfo.deviceBindingTime }}</div>
        </el-col>
      </el-row>
      <div v-else class="device-content-header unbind-to-bind">
        <span> 暂未绑定</span>
        <NoImageUpload
          class="uploiad-to-bind"
          v-model="uploadImage"
          @input="chooseImg"
        >
          <img src="@/assets/images/uploadImage/upload_icon.png" alt="" />
        </NoImageUpload>
      </div>
      <div class="device-content-content" :style="{ height: '465px' }">
        <div>剩余{{ total }}台未绑定设备</div>
        <el-input
          style="margin-bottom: 10px"
          placeholder="请输入内容"
          @input="flterDevice"
          v-model="searchValue"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="device-content-content-box">
          <el-row
            class="device-content-header"
            v-for="item in unList"
            :key="item.sn + item.device_code"
          >
            <el-col :span="5" class="device-content-header-image">
              <img
                class="device-image"
                :src="dealDeviceImage(item.model_image_url)"
                alt=""
              />
            </el-col>
            <el-col :span="18" class="device-content-header-right">
              <div class="device-content-header-right-title">
                <span>{{ item.series_name }}</span>
                <el-button
                  type="primary"
                  style="float: right"
                  @click="add(item)"
                  >绑 定</el-button
                >
              </div>
              <div class="device-content-header-right-title">
                {{ item.model_name }}
              </div>
              <div class="device-content-header-right-sub">
                {{ item.sn }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import NoImageUpload from "@/components/ImageUpload/noImage.vue";
import { http_request } from "../../../../api";

export default {
  components: { NoImageUpload },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  watch: {
    open: {
      handler() {
        if (this.open) {
          console.log("ckc open", this.options);
          this.isbang = this.options.isbang;
          this.getBindInfo().then(() => {
            this.getUnbindList();
          });
        }
      },
    },
  },
  data() {
    return {
      isbang: false,
      uploadImage: "",
      searchValue: "",
      unList: [],
      targetList: [],
      deviceInfo: {},
      total: 0,
      snNumber: "",
      delLoading: false,
    };
  },

  methods: {
    flterDevice(e) {
      console.log("e", e);
      this.unList = [];
      this.targetList.forEach((el) => {
        const name = el.series_name;
        if (name && name.includes(e)) {
          this.unList.push(el);
        }
      });
      console.log("this.unList", this.unList);
    },
    dealDeviceImage(path) {
      return path ? path.replace("{tag}", "icon") : "";
    },
    async getBindInfo() {
      this.deviceInfo = {};
      const obj = {
        moduleName: "http_monitor",
        method: "get",
        url_alias: "device_detail",
        url_code: [this.options.vehicleCode, "device"],
      };
      const result = await http_request(obj);
      console.log("ckc result bind", result);
      if (result.code != 200) return;
      result.data.device.deviceSN
        ? (this.isbang = true)
        : (this.isbang = false);
      this.$nextTick(() => {
        this.deviceInfo = Object.assign(this.deviceInfo, result.data.device);
      });

      console.log("this.isbang ", this.isbang);
    },
    async getUnbindList() {
      this.searchValue = "";
      this.unList = [];
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "device_list",
        data: { isBind: 0 },
      };
      const result = await http_request(obj);
      console.log("ckc result unbind", result);
      this.unList = result.data.rows;
      this.targetList = result.data.rows;
      this.total = result.data.total;
    },
    init() {},
    addOk() {
      this.init();
      this.$emit("colseDeviceDialog");
    },
    async del(item) {
      console.log(" this.options", this.options);
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "device_unbind",
        data: { sn: item.deviceSN, vehicleCode: this.options.vehicleCode },
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.getBindInfo();
      this.getUnbindList();
    },
    async add(item) {
      console.log("item", item, this.deviceInfo.deviceSN);
      if (this.deviceInfo.deviceSN) return this.msgWarning("请先解绑当前设备");
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "device_bind",
        data: { sn: item.sn, vehicleCode: this.options.vehicleCode },
      };
      const res = await http_request(obj);
      console.log("res===>", res);
      //刷新
      this.getBindInfo();
      this.getUnbindList();
    },
    chooseImg(e) {},
  },
};
</script>

<style lang="scss" scoped>
.device-content {
  height: 700px;
//   flex-direction: column;
//   display: flex;
}
.unbind-to-bind {
  text-align: center;
  display: flex;
  flex-direction: row;
  font-size: 24px;
  line-height: 70px;
  justify-content: center;
}
.unbind-to-bind span {
  margin-right: 30px;
}
.device-content-header {
  // margin: 20px;
  border-radius: 5px;
  height: 140px !important;
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  padding: 20px;
  &-image {
    border: 2px solid #dddddd;
    height: 100%;
    border-radius: 3px;
    margin-right: 20px;
  }
  &-right {
    // border: 2px solid #dddddd;
    height: 100%;
    border-radius: 3px;
    &-title {
      font-size: 16px;
      font-weight: 800;
    }
    &-sub {
      margin-bottom: 10px;
      line-height: 8px;
    }
  }
}
.device-content-content {
  height: 450px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  &-box {
    overflow: scroll;
    flex: 1;
  }
}
.search-sn {
  margin-bottom: 10px;
}
.device-image {
  width: 100%;
  height: 100%;
}
/deep/ .el-dialog .el-dialog__body {
  overflow: hidden !important;
}
/deep/ .el-upload--picture-card {
  width: 50px !important;
  height: 50px !important;
}
</style>
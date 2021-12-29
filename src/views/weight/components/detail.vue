<template>
  <el-drawer
    title="磅单详情"
    :visible.sync="detailDrawer"
    direction="rtl"
    style="z-index: 2000"
    :before-close="handleClose"
    size="60%"
    :append-to-body="true"
  >
    <TitleSideBlueTip title="基本信息" />
    <el-row>
      <el-col :span="12">
        <el-row class="dispatch-contents-box">
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">磅单日期:</span>
            <span class="dispatch-base-text"> {{ pageData.recordDate }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">车牌号码:</span>
            <span class="dispatch-base-text">
              {{ pageData.vehicleNumber }}</span
            >
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">联系人:</span>
            <span class="dispatch-base-text"> {{ pageData.linkManName }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">货品类型:</span>
            <span class="dispatch-base-text"> {{ pageData.goodsName }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">路线:</span>
            <span class="dispatch-base-text"> {{ pageData.routeName }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">用车企业:</span>
            <span class="dispatch-base-text"> {{ pageData.companyName }}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="dispatch-contents-box">
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">创建时间:</span>
            <span class="dispatch-base-text"> {{ pageData.createTime }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">司机:</span>
            <span class="dispatch-base-text"> {{ pageData.driverName }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">联系电话:</span>
            <span class="dispatch-base-text"> {{ pageData.linkManPhone }}</span>
          </el-col>
          <el-col :span="24" style="padding-bottom: 16px">
            <span class="dispatch-base-label">运费总额:</span>
            <span class="dispatch-base-text">{{
              pageData.sumFreightPrice
            }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="middle">
      <div class="middle-content">
        <img src="../../../assets/images/bang/qian.png" />
        <div class="one">
          <div class="price g-single-row">
            {{ pageData.driverFreightPrice }}
          </div>
          <div class="tipText">司机运费</div>
        </div>
        <div class="two">
          <div class="price g-single-row">
            {{ pageData.driverSurchargePrice }}
          </div>
          <div class="tipText">司机附加费</div>
        </div>
        <div class="three">
          <div class="price g-single-row">{{ pageData.goodsFreightPrice }}</div>
          <div class="tipText">运费单价</div>
        </div>
      </div>
      <div class="middle-content2">
        <img src="../../../assets/images/bang/dun.png" />
        <div class="one">
          <div class="price g-single-row">{{ pageData.loadingNetWeight }}</div>
          <div class="tipText">装货点净重量</div>
        </div>
        <div class="two">
          <div class="price g-single-row">
            {{ pageData.unloadingNetWeight }}
          </div>
          <div class="tipText">卸货净重量</div>
        </div>
      </div>
    </div>
    <TitleSideBlueTip title="凭证信息" />

    <viewer class="img-list" :images="imageList">
      <div class="img-list-item" v-for="src in imageList" :key="src">
        <img :src="src" />
        <div @click="show"></div>
      </div>
    </viewer>

    <TitleSideBlueTip title="修改记录" />
    <div v-if="pageData.logs" style="margin-bottom: 30px">
      <div class="record" v-for="item in pageData.logs" :key="item.updateTime">
        <div class="record-left">
          <div class="record-left-label">
            <div>修改时间</div>
            <div>操作人</div>
          </div>
          <div class="record-left-title">
            <div>{{ item.updateTime }}</div>
            <div>{{ item.updateName }}</div>
          </div>
        </div>
        <div class="record-right">
          <div class="triangle"></div>
          <div class="record-right-label">修改项</div>
          <div class="record-right-title">
            <div
              v-for="sub in item.updateData"
              :key="sub.fieldName + sub.beforeValue"
            >
              <div style="width: 100px" :class="dealData(sub)">
                {{ sub.chFieldName }}:
              </div>
              <div
                v-if="
                  typeof sub.beforeValue != 'string' ||
                  !sub.beforeValue.includes('http')
                "
              >
                {{ sub.beforeValue }}
              </div>
              <div v-else-if="splitArr(sub.beforeValue).length > 0">
                <div v-for="lest in splitArr(sub.beforeValue)" :key="lest">
                  <img class="image-style" :src="lest" alt="" />
                </div>
              </div>
              <div class="gengXin">修改为</div>
              <div
                v-if="
                  typeof sub.beforeValue != 'string' ||
                  !sub.afterValue.includes('http')
                "
              >
                {{ sub.afterValue }}
              </div>
              <div v-else-if="splitArr(sub.afterValue).length > 0">
                <div v-for="lest in splitArr(sub.afterValue)" :key="lest">
                  <img class="image-style" :src="lest" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
export default {
  name: "detail",
  data() {
    return {
      pageData: {},
    };
  },
  watch: {
    detailDrawer() {
      console.log("我在监听");
      if (this.detailDrawer) {
        console.log("他变成true");
        this.getList();
      }
    },
  },

  computed: {
    imageList() {
      if (this.pageData.voucherImageUrls) {
        const tmp = this.pageData.voucherImageUrls.split(",");
        console.log("tmp", tmp);
        return tmp;
      } else {
        return [];
      }
    },
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
  methods: {
    splitArr(str) {
      if (!str) return [];
      const result = str.split(",");
      console.log("splitArr result", result);
      return result;
    },
    dealData(data) {
      console.log("sub data", data);
    },
    show() {
      this.$viewerApi({
        images: this.imageList,
      });
    },
    handleClose() {
      this.$emit("closeDetail");
    },
    async getList() {
      const obj = {
        moduleName: "http_weight",
        method: "get",
        url_alias: "detailWeighbridge",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail res", res);
      this.pageData = res.data;
      if (!this.pageData.logs) return;
      this.pageData.logs.push({
        updateData: [
          {
            afterValue: this.pageData.voucherImageUrls,
            beforeValue: this.pageData.voucherImageUrls,
            chFieldName: "磅单日期",
            fieldName: "recordDate",
          },
          {
            afterValue: this.pageData.voucherImageUrls,
            beforeValue: this.pageData.voucherImageUrls,
            chFieldName: "磅单日期1",
            fieldName: "recordDate1",
          },
        ],
        updateName: "钓鱼台1",
        updateTime: "2021-12-13 17:11:19",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.middle {
  margin: 25px 32px 0 32px;
  &-content,
  &-content2 {
    height: 44px;
    background: #f6f6f6;
    border-radius: 2px;
    display: flex;
    padding-left: 12px;
    align-items: center;
    & > img {
      width: 22px;
      height: 22px;
      margin-right: 34px;
    }
  }
  &-content {
    margin-bottom: 8px;
  }
}
.price {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}
.one {
  width: 142px;
}
.two {
  width: 163px;
}
.three {
  width: 144px;
}
.img-list {
  display: flex;
  margin-left: 44px;
  flex-wrap: wrap;
}
.img-list-item {
  position: relative;
  width: 131px;
  height: 88px;
  margin-right: 14px;
  margin-bottom: 14px;
  border-radius: 2px;
  min-width: 0;
  & > img {
    width: 131px;
    height: 88px;
    border-radius: 2px;
  }
  & > div {
    width: 18px;
    height: 18px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: url(../../../assets/images/detail/video-bottom-right.png)
      no-repeat;
  }
}
.record {
  display: flex;
  padding-left: 44px;
  padding-right: 33px;
  &-left {
    width: 240px;
    padding-right: 16px;
    box-sizing: border-box;
    &-label {
      display: flex;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #adb5bd;
      justify-content: space-between;
      margin-bottom: 1px;
    }
    &-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #3d4050;
      align-items: center;
    }
  }
  &-right {
    flex: 1;
    position: relative;
    padding-left: 16px;
    .triangle {
      position: absolute;
      top: 24px;
      left: 3px;
      border: 8px solid #f6f6f6;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-left: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }
    &-label {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #adb5bd;
      margin-bottom: 2px;
    }
    &-title {
      padding: 10px 11px;
      background: #f6f6f6;
      border-radius: 2px;
      margin-bottom: 15px;
      min-height: 20px;
      & > div {
        display: flex;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #3d4050;
        margin-bottom: 10px;
        // align-items: center;
      }
    }
  }
  &-right::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0px;
    width: 0;
    height: 100%;
    border-left: 1px dashed rgba(218, 211, 211, 1);
  }
  &-right::after {
    content: "";
    position: absolute;
    top: 30px;
    left: -2px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #3d4050;
  }

  .gengXin {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #4682fa;
    padding: 0 19px;
  }
  .image-style {
    width: 131px;
    height: 88px;
    border-radius: 5px;
  }
}
.record:last-child {
  .record-right::before {
    content: "";
    height: 0;
  }
}
</style>
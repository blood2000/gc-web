<template>
  <div class="itemCard">
    <el-dropdown v-if="!data.isDel" class="itemCard-menu-ab" trigger="click">
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span class="menu-item" @click.stop="edit()">修改</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span class="menu-item" @click.stop="del"  v-if="!data.isDel">删除</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div @click="handleDetail">
    <div class="isDel" v-if="data.isDel">
      <img src="../../../assets/images/bang/isdel.png" alt="" />
    </div>
    <div class="top"  @click="handleDetail">
      <div class="top-title">
        <div class="top-title-title">{{ data.vehicleNumber }}</div>
        <div class="top-title-label" v-if="data.vehicleAlias">
          {{ data.vehicleAlias }}
        </div>
      </div>
      <div class="top-user">
        <img
          class="mini-image"
          src="../../../assets/images/bang/person.png"
          alt=""
        />
        <span class="top-text">{{ data.driverName }}</span>
        <span style="padding: 0 4px"> | </span>
        <span class="top-text">{{ data.driverPhone }}</span>
      </div>
      <div class="top-address">
        <img
          class="mini-image"
          src="../../../assets/images/bang/address.png"
          alt=""
        />
        <span class="top-text">{{ data.routeName }}</span>
      </div>
    </div>
    <div class="middle">
      <div class="middle-header">
        <div class="g-single-row" style="width: 230px">
          <span class="middle-header-label" style="margin-right: 5px"
            >货品类型</span
          >
          <span class="middle-header-text">{{ data.goodsName }}</span>
        </div>
        <div class="g-single-row">
          <span class="middle-header-label" style="margin-right: 10px"
            >结算总额</span
          >
          <span class="middle-header-text">{{ data.sumFreightPrice }}</span>
        </div>
      </div>
      <div class="middle-content">
        <img src="../../../assets/images/bang/qian.png" />
        <div class="one">
          <div class="price g-single-row">{{ data.driverFreightPrice }}</div>
          <div class="tipText">司机运费</div>
        </div>
        <div class="two">
          <div class="price g-single-row">
            {{ data.driverSurchargePrice }}
          </div>
          <div class="tipText">司机附加费</div>
        </div>
        <div class="three">
          <div class="price g-single-row">{{ data.goodsFreightPrice }}</div>
          <div class="tipText">运费单价</div>
        </div>
      </div>
      <div class="middle-content2">
        <img src="../../../assets/images/bang/dun.png" />
        <div class="one">
          <div class="price g-single-row">{{ data.loadingNetWeight }}</div>
          <div class="tipText">装货点净重量</div>
        </div>
        <div class="two">
          <div class="price g-single-row">{{ data.unloadingNetWeight }}</div>
          <div class="tipText">卸货净重量</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-content" style="margin-bottom: 4px">
        <div style="margin-right: 8px; margin-top: 8px">
          <div class="dot-y"></div>
          <div class="line"></div>
          <div class="dot-x"></div>
        </div>
        <div>
          <div class="footer-address g-single-row" style="margin-bottom: 4px">
            {{ data.startRoute }}
          </div>
          <div class="footer-address g-single-row">{{ data.endRoute }}</div>
        </div>
      </div>
      <div class="date">{{ data.recordDate }}</div>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "itemCard",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    console.log("卡片数据", this.data);
  },
  methods: {
    edit() {
      this.$emit('handleUpdate')
    },
    del() {
      this.$emit('handleDelete')
    },
    handleDetail(){
        this.$emit('handleDetail')
    }
  },
};
</script>
<style lang="scss" scoped>
.itemCard {
  width: 100%;
  height: 348px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    border-radius: 3px;

  position: relative;
  &-menu-ab {
    width: 32px;
    height: 20px;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    top: 10px;
    & > div {
      width: 32px;
      height: 20px;
      & > div {
        width: 4px;
        height: 4px;
        background: #3d4050;
        border-radius: 50%;
        display: inline-block;
        margin-right: 4px;
      }
    }
  }
}
.top {
  height: 104px;
  width: 100%;
  padding: 16px 15px 10px 15px;
  box-sizing: border-box;
  border-bottom: 1px dashed rgba(224, 224, 224, 1);
  &-title,
  &-user,
  &-address {
    display: flex;
    align-items: center;
  }
  &-title {
    margin-bottom: 6px;
    &-title {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: #3d4050;
      margin-right: 9px;
    }
    &-label {
      padding: 3px 10px;
      background: #ebf2ff;
      border-radius: 2px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #4682fa;
      text-align: center;
    }
  }
  &-user {
    margin-bottom: 6px;
  }
  &-text {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
.middle {
  height: 148px;
  width: 100%;
  padding: 8px 15px;
  box-sizing: border-box;
  border-bottom: 1px dashed rgba(224, 224, 224, 1);
  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    &-label {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    &-text {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #3d4050;
    }
  }
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
      margin-right: 26px;
    }
  }
  &-content {
    margin-bottom: 8px;
  }
}
.footer {
  padding: 12px 18px;
  box-sizing: border-box;
  &-content {
    display: flex;
  }
}

.mini-image {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.price {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
}
.tipText {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
}
.one {
  width: 122px;
}
.two {
  width: 143px;
}
.three {
  width: 80px;
}
.dot-y {
  width: 6px;
  height: 6px;
  background: #ffbc00;
  border-radius: 4px;
}
.line {
  width: 0px;
  height: 16px;
  border: 1px solid #dddddd;
  margin: 2px;
}
.dot-x {
  width: 6px;
  height: 6px;
  background: #4682fa;
  opacity: 1;
  border-radius: 3px;
}
.footer-address {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #3d4050;
  width: 385px;
}
.date {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
}
.isDel {
  position: absolute;
  width: 96px;
  height: 96px;
  top: 14px;
  right: 32px;
}
</style>
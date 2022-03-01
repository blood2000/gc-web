<template>
  <div class="list">
    <div class="list-item" 
    v-for="sub in appList" 
    :key="sub.code"
    @click="jumpClick(sub)"
    >
      <div class="list-content">
        <div class="list-content-img">
          <img :src="sub.iconUrl" alt="" />
        </div>
        <div class="list-content-info">
          <div class="list-content-info-title">
            <div class="list-content-info-title-left">
              {{ sub.appName }}
            </div>
            <div
              class="list-content-info-title-right"
              v-show="sub.chargeType && sub.allowTrialFlag"
            >
              试用
            </div>
          </div>
          <div class="list-content-info-tag">
            <div class="list-content-info-tag-error" v-show="sub.chargeType">
              收费应用
            </div>
            <div class="list-content-info-tag-info">实用工具</div>
          </div>
        </div>
      </div>
      <div class="list-text g-double-row">
        {{ sub.overview ? sub.overview : "暂无概述" }}
      </div>
      <div class="list-footer">
        <div class="list-footer-open">已被开通{{ sub.usingCompanyNum }}次</div>
        <div
          class="list-footer-open-btn"
          v-if="!sub.openFlag"
          @click="handleClick(sub.code)"
        >
          立即开通
        </div>
        <div class="list-footer-colose-btn" v-else>已开通</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    appList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    handleClick(code) {
      console.log("code", code);
      this.$router.push("detail?code=" + code);
    },
    jumpClick(sub){
      console.log('sub',sub.code)
      this.$router.push("detail?code=" + sub.code);
    }
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.list-item {
  width: 380px;
  border: 1px solid transparent;
  height: 183px;
  padding: 15px;
  margin-right: 3%;
  margin-bottom: 15px;
  &:hover{
     border: 1px solid rgba(70, 130, 250, 0.2784313725490196);
  box-shadow: 0px 3px 13px rgba(70, 130, 250, 0.21);
  }
  .list-content {
    height: 55px;
    width: 100%;
    display: flex;
    margin-bottom: 16px;
    &-img {
      height: 100%;
      width: 55px;
      background: #4682fa;
      border-radius: 7px;
      margin-right: 17px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    &-info {
      flex: 1;
      height: 100%;
      &-title {
        display: flex;
        margin-bottom: 7px;
        align-items: center;
        &-left {
          font-size: 16px;
          font-family: PingFang BOLD;
          color: #3d4050;
          margin-right: 8px;
        }
        &-right {
          width: 38px;
          height: 18px;
          background: #fff5e2;
          border-radius: 0px 20px 20px 20px;
          font-size: 12px;
          font-family: PingFang BOLD;
          color: #faad14;
          text-align: center;
        }
      }
      &-tag {
        display: flex;
        &-error {
          width: 72px;
          height: 25px;
          background: rgba(255, 233, 233, 0.41);
          border: 1px solid #ef6969;
          color: rgba(239, 105, 105, 0.87);
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFang BOLD;
          text-align: center;
          padding-top: 3px;
          margin-right: 8px;
        }
        &-info {
          width: 72px;
          height: 25px;
          background: rgba(214, 214, 218, 0.18);
          border: 1px solid #d6d6da;
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFang BOLD;
          color: rgba(61, 64, 80, 0.87);
          text-align: center;
          padding-top: 3px;
          margin-right: 8px;
        }
      }
    }
  }
  .list-text {
    width: 100%;
    height: 42px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #3d4050;
    margin-bottom: 10px;
  }
  .list-footer {
    width: 100%;
    height: 29px;
    display: flex;
    justify-content: space-between;
    .list-footer-open {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #959aa4;
      line-height: 29px;
    }
    .list-footer-open-btn {
      width: 86px;
      height: 29px;
      border: 1px solid #4682fa;
      border-radius: 2px;
      text-align: center;
      font-size: 12px;
      font-family: PingFang BOLD;
      color: #1271fc;
      padding-top: 4px;
      cursor: pointer;
    }
    .list-footer-colose-btn {
      width: 86px;
      height: 29px;
      border: 1px solid #959aa4;
      border-radius: 2px;
      text-align: center;
      font-size: 12px;
      font-family: PingFang BOLD;
      color: #959aa4;
      padding-top: 4px;
    }
  }
}
</style>
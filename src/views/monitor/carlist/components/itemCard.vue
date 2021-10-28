<template>
  <div class="monitor-card">
    <el-dropdown class="monitor-card-menu-ab" trigger="click">
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span class="menu-item">查看派车单</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span class="menu-item">地图查看</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span class="menu-item">轨迹查看</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span class="menu-item">视频监控</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="monitor-card-title"><span>闽A54772</span></div>
    <div class="monitor-card-location">
      <span>当前位置 |</span>
      <span>东滨路1号富邦总部大楼大楼</span>
    </div>
    <div class="monitor-card-driver">
      <span>最新告警</span>
      <img src="@/assets/images/monitor-line.png" alt="" />
    </div>
    <div class="monitor-card-content">
      <img src="@/assets/images/tmpImage/monitor-tmp.png" alt="" />
      <div class="monitor-card-content-right">
        <div class="monitor-card-content-right-title">
          <div class="monitor-card-content-right-title-warn">
            <img
              src="../../../../assets/images/detail/warn_lelve_3.png"
              alt=""
            />
            <span>一级告警</span>
          </div>
          <div class="monitor-card-content-right-title-anomaly">
            <img src="../../../../assets/images/detail/fms-yczd.png" alt="" />
            <span>异常震动</span>
          </div>
        </div>
        <div class="monitor-card-content-right-address">
          东滨路1号富邦总部大楼大楼大楼大楼大大楼大大楼大大楼大大楼大大楼大大楼大大楼大大楼大
        </div>
        <div class="monitor-card-content-right-date">2021-10-16 16:26:56</div>
      </div>
    </div>
    <div class="monitor-card-footer">
      <div class="monitor-card-footer-left">
        <img src="../../../../assets/images/detail/monitor-phone.png" alt="" />
        <span>超好运小黑盒便携款</span>
      </div>
      <div class="monitor-card-footer-middle">
        <img src="../../../../assets/images/detail/monitor-people.png" alt="" />
        <span>小阳洋</span>
      </div>
      <div class="monitor-card-footer-right">
        <span style="font-size: 16px">• </span>
        <span>任务中</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "itemCard",
  data() {
    return {
      open: false,
    };
  },
  methods: {
    handleMenuItem() {
      this.open = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-card {
  position: relative;
  width: 376px;
  height: 228px;
  background: #ffffff;
  border-radius: 6px;
  padding-top: 16px;
  box-sizing: border-box;
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
  &-title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #3d4050;
    padding-left: 16px;
    padding-right: 16px;
  }
  &-location {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #3d4050;
    padding-left: 16px;
    padding-right: 16px;
  }
  &-driver {
    height: 17px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #adb5bd;
    margin-top: 10px;
    margin-bottom: 15px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    align-items: center;
    & > span {
      padding-right: 2px;
    }
    & > img {
      width: 294px;
      height: 9px;
      vertical-align: middle;
      // padding-left: 2px;
    }
  }
  &-content {
    height: 68px;
    display: flex;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
    & > img {
      width: 68px;
      height: 68px;
    }
    &-right {
      padding-left: 12px;

      &-title {
        display: flex;
        align-items: center;
        height: 24px;
        &-warn {
          display: flex;

          height: 24px;
          padding-right: 28px;
          & > img {
            width: 24px;
            height: 24px;
          }
          & > span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
          }
        }
        &-anomaly {
          display: flex;
          height: 24px;
          & > img {
            width: 48px;
            height: 24px;
          }
          & > span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 24px;
            color: #3d4050;
          }
        }
      }
      &-address {
        width: 270px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #3d4050;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 1px 0;
      }
      &-date {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 22px;
        color: #adb5bd;
      }
    }
  }
  &-footer {
    border-top: 1px solid #f3f4f5;
    display: flex;
    &-left {
      width: 180px;
      padding: 10px 38px 12px 19px;
      border-right: 1px solid #f3f4f5;
      display: flex;
      align-items: center;
      & > img {
        width: 12.5px;
        height: 12px;
        padding-right: 2px;
      }
      & > span {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #3d4050;
      }
    }
    &-middle {
      padding: 10px 23px 12px 19px;
      width: 96px;
      border-right: 1px solid #f3f4f5;
      display: flex;
      align-items: center;
      & > img {
        width: 14px;
        height: 14px;
        display: inline-block;
        margin-right: 2px;
      }
      & > span {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #3d4050;
      }
    }
    &-right {
      padding: 10px 26px 12px 25px;
      & > span {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 22px;
        color: #43b91e;
      }
    }
  }
}
.menu-item {
  padding-right: 10px;
  color: #4682fa;
}
</style>
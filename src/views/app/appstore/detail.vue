<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <div class="top">
        <div class="top-left">
          <el-carousel
            indicator-position="none"
            ref="carousel"
            style="margin-bottom: 12px"
            @change="carouselChange"
          >
            <el-carousel-item
              v-for="(item, index) in detailData.imageUrlList"
              :key="item + index"
            >
              <img class="banner-image" :src="item" alt="" />
            </el-carousel-item>
          </el-carousel>
          <div class="carousel-list">
            <div class="carousel-list-left">
              <span
                class="el-icon-arrow-left"
                @click="updetestep(currIndex - 1)"
              ></span>
            </div>
            <div class="carousel-list-content">
              <img
                :src="item"
                alt=""
                @click="showstep(index)"
                v-for="(item, index) in detailData.imageUrlList"
                :key="item + index"
                :class="currIndex === index ? 'ac' : ''"
              />
            </div>
            <div class="carousel-list-right" @click="updetestep(currIndex + 1)">
              <span class="el-icon-arrow-right"></span>
            </div>
          </div>
        </div>
        <div class="top-right">
          <div class="right-top">
            <div class="right-header">
              <div class="right-header-img">
                  <img :src="detailData.iconUrl" alt="">
              </div>
              <div class="right-header-info">
                <div class="right-header-info-header">
                  {{ detailData.appName }}
                </div>
                <div class="right-header-info-tag">
                  <div>{{ detailData.categoryName }}</div>
                  <!-- <div>实用工具</div> -->
                </div>
                <div class="right-header-info-label">
                  <div>版本：{{ detailData.version }}</div>
                  <div>更新：{{ detailData.releaseDate }}</div>
                </div>
              </div>
            </div>
            <div class="right-content">
              <div class="right-content-header">
                {{ detailData.chargeType ? "收费" : "免费" }}
              </div>
              <div
                class="right-content-btn"
                v-if="!detailData.openFlag"
                @click="handleDredge(detailData.code,detailData.chargeType)"
              >
                立即开通
              </div>
              <div class="right-content-btn-colse" v-else>已开通</div>

              <div class="right-content-count">
                已被开通{{ detailData.usingCompanyNum }}次
              </div>
            </div>
          </div>
          <div class="right-bottom">
            <!-- <div class="right-bottom-guide">
                <img src="../../../assets/images/app/guide.png"/>
                操作指南</div> -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="详情" name="detail">
                <div class="right-bottom-detail">
                  {{ detailData.remark }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="硬件要求" name="hardware">
                <div class="right-bottom-detail">
                  {{ detailData.hardwareRequirement }}
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="store-list">
          <div class="title">
            关联应用({{
              detailData.associationAppList &&
              detailData.associationAppList.length
            }})
          </div>
          <StoreList :appList="detailData.associationAppList" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { http_request } from "../../../api";
import StoreList from "../components/storeList.vue";

export default {
  components: { StoreList },
  data() {
    return {
      detailData: {},
      code: null,
      currIndex: 0,
      activeName: "detail",
    };
  },
  mounted() {
    console.log("this.$route", this.$route);
    if (this.$route.query && this.$route.query.code) {
      this.code = this.$route.query.code;
      this.getList();
    }
  },

  methods: {
      carouselChange(e){
          // console.log('carouselChange',e)
          this.currIndex = e
      },
    async getList() {
      this.detailData = {};
      const obj = {
        moduleName: "http_app",
        method: "get",
        url_alias: "detail",
        url_code: [this.code],
      };
      const res = await http_request(obj);
      console.log("detail", res.data);
      this.detailData = res.data;
    },
    showstep(ind) {
      this.currIndex = ind;
      console.log("ind", ind);
      this.$refs.carousel.setActiveItem(ind);
    },
    updetestep(ind) {
      if (ind === -1) return;
      if (ind === this.detailData.imageUrlList.length) return;
      this.currIndex = ind;
      this.$refs.carousel.setActiveItem(ind);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleDredge(code, chargeType) {
      console.log("code", code);
      const obj = {
        //subscribe
        moduleName: "http_app",
        method: "post",
        url_alias: "subscribe",
        url_code: [code],
      };
      let texts = "";
      if (chargeType) {
        texts = "当前应用为付费应用，请联系客服进行开通咨询！";
      } else {
        texts = "当前应用为免费应用，请确认是否确认开通？";
      }
      this.$confirm(texts, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if(chargeType) return
        http_request(obj).then((res) => {
          console.log("res", res);
          if (res.data) {
            this.$confirm(
              "应用开通成功！请进入角色管理，对使用该应用的角色进行授权！",
              "系统提示",
              {
                showCancelButton:false,
                confirmButtonText: "知道了",
                // cancelButtonText: "取消",
                type: "warning",
              }
            ).then(()=>{
              this.getList()
            });
          }
        });
      });
    },
    // 未完善
    changeList(arr) {
      if (!arr) return [];
      const list = [];
      arr.forEach((el) => {
        const obj = {};
        list.push(obj);
      });
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.pages-info-right {
  padding: 0;
}
.top {
  display: flex;
  border-bottom: 1px solid #efefef;
  &-left {
    width: 556px;
    height: 489px;
    padding-top: 30px;
    padding-left: 24px;
    margin-right: 33px;
    padding-bottom: 25px;
  }
  &-right {
    flex: 1;
  }
}
.banner-image {
  width: 100%;
  height: 370px;
  border-radius: 5px;
}
.carousel-list {
  width: 100%;
  height: 70px;
  display: flex;
  &-left,
  &-right {
    // width: 24px;
    // height: 12px;
    padding-top: 23px;
    > span {
      font-size: 24px;
      line-height: 24px;
    }
  }
  &-right {
    margin-left: 8px;
  }
  &-left {
    margin-right: 8px;
  }
  &-content {
    display: flex;
    overflow-x: auto;
    align-items: center;
    flex: 1;
    height: 70px;
    & > img {
      border-radius: 2px;
      margin-right: 8px;
      height: 56px;
      width: 92px;
      border: 2px solid transparent;
    }
    & > img:hover {
      border: 2px solid #e0e0e0;
    }
  }

  .ac {
    border: 2px solid #4682fa;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  }
}
.right-top {
  padding-right: 78px;
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
}
.right-header {
  width: 100%;
  height: 84px;
  display: flex;
  &-img {
    width: 84px;
    height: 84px;
  
    opacity: 1;
    border-radius: 10px;
    margin-right: 26px;
    &>img{
        height: 100%;
        width: 100%;
         border-radius: 10px;
    }
  }
  &-info {
    width: 260px;
    height: 84px;
    &-header {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #3d4050;
      margin-bottom: 7px;
    }
    &-tag {
      display: flex;
      margin-bottom: 9px;
      width: 100%;
      & > div {
        width: 96px;
        height: 25px;
        background: rgba(214, 214, 218, 0.18);
        border: 1px solid #d6d6da;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(61, 64, 80, 0.87);
        margin-right: 12px;
        text-align: center;
        line-height: 22px;
      }
    }
    &-label {
      width: 100%;
      display: flex;
          font-size: 12px;
    color: #515a6e;
      & > div {
        margin-right: 39px;
      }
    }
  }
}
.right-content {
  height: 84px;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 5px;
  &-header {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3d4050;
    margin-bottom: 5px;
  }
  &-btn {
    width: 86px;
    height: 29px;
    background: #4682fa;
    border: 1px solid #4682fa;
    border-radius: 2px;
    text-align: center;
    line-height: 26px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 5px;
    cursor: pointer;
  }
  &-btn-colse {
    width: 86px;
    height: 29px;
    background: #e0e0e0;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    text-align: center;
    line-height: 26px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3d4050;
    margin-bottom: 5px;
    cursor: pointer;
  }

  &-count {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: #959aa4;
  }
}
.right-bottom {
  position: relative;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0;
}
.right-bottom-detail {
  width: 100%;
  height: 182px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  color: #3d4050;
  padding-right: 74px;
}

.title {
  font-size: 16px;
  font-family: PingFang BOLD;
  color: #3d4050;
  margin-bottom: 24px;
}
.right-bottom-guide {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #4682fa;
  position: absolute;
  right: 0;
  right: 78px;
  top: 18px;
  display: flex;
  align-items: center;
  &>img{
      width: 16px;
      height: 16px;
  }
}
.bottom {
  padding-top: 26px;
  padding-left: 24px;
}
::v-deep .el-carousel__container {
  height: 370px;
}
</style>
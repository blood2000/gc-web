<template>
  <div class="app-container">
    <el-row :gutter="20" class="home-row-1">
      <el-col :span="5" :xs="24" class="home-col">
        <div class="box-card">
          <keep-alive>
            <!-- 个人中心 -->
            <PersonalCenter />
          </keep-alive>
          <!-- <div class="clearfix home-title">个人资料</div>
          <div>
            <div class="info-box">
              <div class="info-left">
                <div class="info-name">Hi，辛弃疾</div>
                <div class="info-other">研发部 | <span>工程师</span></div>
              </div>
              <div class="info-right">
                <div><img src="../assets/images/profile.jpg" alt="" /></div>
              </div>
            </div>
          </div> -->
        </div>
      </el-col>
      <el-col :span="13" :xs="24" class="home-col">
        <div class="box-card">
          <CapitalDispatch />
        </div>
        <!-- <div class="home-card">
          
        </div> -->
      </el-col>
      <el-col :span="6" :xs="24" class="home-col">
        <div class="box-card">
          <div class="home-title">
            <div>系统公告</div>
            <div class="show-more">查看更多</div>
          </div>
          <div class="home-main">
            <div class="home-title">关于至简管车试运行通知</div>
            <div class="home-content">
              <span></span>
              至简管车内测运行啦！我们会随机在提出建议的用户中抽选3名幸运用户进行赠送一年车队服务！
            </div>
            <div class="public-date">2021-10-19</div>
          </div>
          <div class="public-img">
            <img src="../assets/images/home/public.png" alt="">
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PersonalCenter from "./components/index/PersonalCenter";
import CapitalDispatch from "./components/index/CapitalDispatch";
export default {
  name: "Index",
  components: {
    PersonalCenter,
    CapitalDispatch,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.app-container {
  background: #f2f5f8;
  box-shadow: none;
  height: 100%;
  margin-bottom: 0;
}

.home-row-1 {
  height: 55%;
}

.home-col {
  height: 100%;
}

.box-card {
  position: relative;
  height: 100%;
  background-color: #fff;
  padding: 15px;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  border-radius: 4px;
}

.home-title {
  color: #3d4050;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 20px;
  // padding: 0;
  // height: 56px;
  // line-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.show-more {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 20px;
  color: #3d4050;
  cursor: pointer;
}

.home-main {
  max-height: 200px;
  overflow-y: auto;
}

.home-content {
  font-size: 14px;
  span {
    padding: 0 14px;
  }
}

.public-date {
  padding: 10px 0;
  font-size: 14px;
  font-family: PingFang SC;
  line-height: 17px;
  color: #d5d5d5;
  text-align: right;
}

.public-img {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.public-img > img {
  width: 396px;
  height: 160px;

}

.info-box {
  width: 297px;
  height: 80px;
  background: url("../assets/images/home/info-bg.png") center no-repeat;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 20px;
}

.info-name {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 5px;
}

.info-other {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 20px;
  color: #ffffff;
}

.info-right {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 50%;
}

.info-right > div {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
}

.info-right img {
  width: 100%;
  height: 100%;
}
</style>


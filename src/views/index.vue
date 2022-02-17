<template>
  <div class="app-container">
    <div class="app-container__left">
      <keep-alive>
        <!-- 个人中心 -->
        <PersonalCenter />
      </keep-alive>
    </div>
    <div class="app-container__right">
      <div class="app-container__right-top">
        <div class="transport-wrapper mr16">
          <Transport />
        </div>
        <div class="transport-wrapper">
          <List />
        </div>
      </div>
      <div class="app-container__right-bottom">
        <div class="app-container__right-bottom__left mr16">
          <AlarmTrend />
        </div>
        <div class="app-container__right-bottom__right">
          <AlarmInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalCenter from "./components/index/PersonalCenter";
import Transport from "./components/index/Transport";
import List from "./components/index/List";
import AlarmTrend from "./components/index/Alarm/AlarmTrend";
import AlarmInfo from "./components/index/Alarm/AlarmInfo";

export default {
  name: "Index",
  components: {
    PersonalCenter,
    Transport,
    List,
    AlarmTrend,
    AlarmInfo,
  },
  data() {
    return {};
  },
  created() {
    console.log("登录之后进来了");
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.app-container {
  background: #f2f5f8;
  box-shadow: none;
  margin: -19px 0 0 0;
  padding: 0px;
  display: flex;
  &__left {
    width: 320px;
    height: 100%;
    position: relative;
    background-color: #fff;
    padding: 1px 20px;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  }
  &__right {
    flex: 1 1 auto;
    width: 0;
    padding: 16px 0 0 16px;
    overflow: auto;
  }
  &__right-top {
    width: 1508px;
    display: flex;
  }
  &__right-bottom {
    width: 1508px;
    display: flex;
    margin-top: 16px;
  }
}

.transport-wrapper {
  width: 744px;
  height: 408px;
}

.mr16 {
  margin-right: 16px;
}
</style>

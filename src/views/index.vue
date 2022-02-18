<template>
  <div class="app-container-index">
    <div class="app-container-index__left">
      <keep-alive>
        <!-- 个人中心 -->
        <PersonalCenter />
      </keep-alive>
    </div>
    <div class="app-container-index__right">
      <div class="app-container-index__right-top">
        <div class="transport-wrapper mr16">
          <Transport />
        </div>
        <div class="transport-wrapper">
          <List />
        </div>
      </div>
      <div class="app-container-index__right-bottom">
        <div class="app-container-index__right-bottom__left mr16">
          <AlarmTrend />
        </div>
        <div class="app-container-index__right-bottom__right">
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
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.app-container-index {
  height: 100%;
  background: #f0f2f5;
  box-shadow: none;
  // margin: -19px 0 0 0;
  padding: 0px;
  border-radius: 4px;
  display: flex;
  &__left {
    width: 320px;
    height: 100%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    position: relative;
    background-color: #fff;
    padding: 1px 20px;
    border-right: 1px solid #f2f2f2;
    box-sizing: border-box;
  }
  &__right {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    flex: 1 1 auto;
    width: 0;
    overflow: auto;
    padding: 16px;
    background: #ffffff;
  }
  &__right-top {
    display: flex;
  }
  &__right-bottom {
    display: flex;
    margin-top: 16px;
    height: 338px;
  }
}

.transport-wrapper {
  width: 744px;
  height: 408px;
}

.mr16 {
  margin-right: 32px;
}
</style>

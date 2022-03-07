<template>
  <div>
    <div v-for="item in list" :key="item.code">
      <div class="title">{{ item.name }}（{{ item.items.length }}）</div>
      <div class="store-list">
        <div
          class="list-box list-box1"
          v-for="sub in item.items"
          :key="sub.code"
          @click="handleClick(sub)"
        >
          <div class="list">
            <div class="list-content">
              <div class="list-content-img">
                <img :src="sub.iconUrl" alt="" />
              </div>
              <div class="list-content-info">
                <div class="list-content-info-title">
                  <div class="list-content-info-title-left">{{ sub.name }}</div>
                  <div
                    class="list-content-info-title-right"
                    v-show="sub.usageStatus == 1"
                  >
                    试用
                  </div>
                </div>
                <div class="list-text g-single-row">
                  {{ sub.summary }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  methods: {
    handleClick(item) {
      console.log("item11", item, item.clickType);
      const me = this;
      const obj = {
        view: () => {
          console.log("view");
          me.$router.push(item.clickTypeData.path);
        },
        url: () => {
          console.log("url");
          window.open(item.clickTypeData.path, "_blank");
        },
      };
      obj[item.clickType]();
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-family: PingFang BOLD;
  color: #3d4050;
  margin-bottom: 11px;
}
.store-list {
  display: flex;
  flex-wrap: wrap;
}
.list-box1 {
  width: 15.1%;
  height: 75px;
  padding: 0 18px ;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f7f8f9;
  border: 1px solid transparent;
  margin-right: 20px;
  margin-bottom: 20px;
}
// .list-box:hover {
//   background: #ffffff;
//   border: 1px solid rgba(70, 130, 250, 0.2784313725490196);
//   box-shadow: 0px 3px 13px rgba(70, 130, 250, 0.21);
// }
.list {
  width: 100%;
  height: 69px;
  box-sizing: border-box;
  .list-content {
    height: 69px;
    width: 100%;
    display: flex;
    align-items: center;
    &-img {
      height: 55px;
      width: 55px;
      border-radius: 7px;
      margin-right: 17px;
      & > img {
        border-radius: 7px;
        width: 100%;
        height: 100%;
      }
    }
    &-info {
      width: 70%;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      &-title {
        display: flex;
        margin-bottom: 5px;
        align-items: center;
        &-left {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #3d4050;
          margin-right: 8px;
        }
        &-right {
          width: 38px;
          height: 18px;
          background: #fff5e2;
          border-radius: 0px 20px 20px 20px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #faad14;
          text-align: center;
        }
      }
    }
  }
  &-text {
    width: 100%;
    // height: 42px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #3d4050;
  }
}
</style>
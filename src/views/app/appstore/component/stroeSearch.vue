<template>
  <div class="search">
    <div class="search-box">
      <input
        class="search-box-input"
        placeholder="请输入应用名称"
        type="text"
        v-model="queryParams.appName"
      />
      <span class="search-box-search" @click="$emit('getList')" />
    </div>
    <div class="btn-group">
      <div
        class="btn-group-item"
        v-for="(item, index) in btnGroupOne"
        :class="currIndex1 == index ? 'ac' : ''"
        :key="item.value"
        @click="handleBtn(item, index, '1')"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="btn-group">
      <div
        class="btn-group-item"
        v-for="(item, index) in btnGroupTwo"
        :class="currIndex2 == index ? 'ac' : ''"
        :key="item.value"
        @click="handleBtn(item, index, '2')"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnGroupOne: [
        {
          title: "不限",
          value: null,
        },
        {
          title: "免费",
          value: 0,
        },
        {
          title: "付费",
          value: 1,
        },
      ],
      btnGroupTwo: [
        {
          title: "不限",
          value: null,
        },
        {
          title: "普通",
          value: 0,
        },
        {
          title: "推荐",
          value: 1,
        },
      ],
      currIndex1: 0,
      currIndex2: 0,
    };
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    handleBtn(item, index, type) {
      console.log("type", type);
      this[`currIndex${type}`] = index;
      if (type === "1") {
        this.queryParams.chargeType = item.value;
      } else {
        this.queryParams.recommendFlag = item.value;
      }
      this.$emit("getList");
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  height: 32px;
  margin-bottom: 22px;
  display: flex;
  &-box {
    width: 340px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    display: flex;
    margin-right: 28px;
    &-input {
      display: inline-block;
      width: 302px;
      height: 100%;
      border: none;
      outline: none;
      caret-color: rgba(204, 204, 204, 1);
      padding-left: 16px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
    }
    &-search {
      display: inline-block;
      border-left: 1px solid #e0e0e0;
      flex: 1;
      background: url("../../../../assets/images/app/input-search.png")
        no-repeat center;
      cursor: pointer;
    }
  }
}

input::-webkit-input-placeholder {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #cccccc;
}

.btn-group {
  width: 243;
  height: 32px;
  display: flex;
  margin-right: 28px;
  &-item {
    width: 80px;
    height: 32px;
    background: #ecf2ff;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 32px;
    color: #4682fa;
    margin-right: 1px;
    cursor: pointer;
    text-align: center;
  }
  .ac {
    background: #4682fa;
    border-radius: 2px 0px 0px 2px;
    font-size: 14px;
    font-family: PingFang BOLD;
    color: #ffffff;
  }
}
</style>
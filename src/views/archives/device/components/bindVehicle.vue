<template>
  <div>
    <div class="search">
      <el-input
        v-model="search"
        clearable
        style="width: 100%"
        placeholder="请输入车牌号"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </el-input>
    </div>
    <div class="list" v-if="getList.length > 0">
      <div
        class="list-item"
        :class="{'list-item__active': currIndex === index, 'list-item__disabled': item.status === '已绑定'}"
        v-for="(item, index) in getList"
        :key="item.vehicleCode"
        @click="handleVehicle(index)"
      >
        <div class="licenseNumber">{{ item.licenseNumber }}</div>
        <div class="vehicleType">{{ item.vehicleType }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    currIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      search: "",
      getList: [],
    };
  },
  watch: {
    list() {
      if (this.list.length > 0) {
        this.getList = this.list;
      }
    },
  },
  methods: {
    handleSearch() {
      if (!this.search) return (this.getList = this.list);
      this.getList = this.getList.filter((item) => {
        return item.licenseNumber.indexOf(this.search) != -1;
      });
      console.log("this.getList", this.getList);
    },
    handleVehicle(index) {
        console.log('handleVehicle',index)
      this.$emit("currIndexChange", index);
    },
  },
};
</script>

<style  lang="scss"  scoped>
.search {
  width: 100%;
  height: 40px;
}
.list {
  height: 400px;
  overflow: scroll;
  padding: 10px;
}
.list-item {
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 16px;
  cursor: pointer;
  .licenseNumber {
    font-family: PingFang SC;
    font-weight: bold;
    margin-right: 16px;
  }
}
.list-item__active {
  background: rgba(70, 130, 250, 0.3);
}
.list-item__disabled {
  background: #eaeaea;
  pointer-events: none;
}
</style>

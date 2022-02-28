<template>
  <ul class="app-tab">
    <li
      class="app-tab-item"
      v-for="(item, index) in tabData"
      :key="item.value"
      :class="index === currIndex ? 'app-tab-item-ac' : ''"
      @click="switchTab(item, index)"
    >
      <div v-show="index === currIndex" class="app-tab-item-triangle"></div>
      {{ item.title }}
    </li>
  </ul>
</template>
<script>
import { number } from "echarts";
export default {
  props: {
    initValue: {
      type: Number,
      default: 0,
    },
    tabData:{
        type:Array,
        default:()=>{
            return []
        }
    }
  },

  data() {
    return {
     
      currIndex: -1,
    };
  },
    mounted(){
        this.currIndex = this.initValue
  },
  methods: {
    switchTab(item, index) {
      this.currIndex = index;
      this.$emit("handleTab", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-tab {
  display: flex;
  &-item {
    width: 108px;
    height: 32px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #3d4050;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    position: relative;
    margin-bottom: 22px;
  }
  &-item-triangle {
    position: absolute;
    bottom: -8px;
    bottom: -6px;
    left: 50%;
    transform: translate(-50%, 0);
    border-top: 8px solid #1271fc;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  &-item-ac {
    background: linear-gradient(92deg, #4682fa 0%, #1271fc 100%);
    border-radius: 3px;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
<template>
  <!-- 地图组件 -->
  <div class="c-map-box">
    <div id="device-map-container" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /** 初始化地图 */
    initMap() {
      this.map = new AMap.Map('device-map-container', {
        resizeEnable: true,
        center: [119.358267, 26.04577],
        zoom: 11
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.c-map-box{
  height: 100%;
  position: relative;
  >#device-map-container{
    height: 100%;
  }
}
</style>
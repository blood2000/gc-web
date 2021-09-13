<template>
  <!-- 设备管理-电子围栏 -->
  <div class="map-container ly-flex">
    <div class="map-container__left">
        list
    </div>
    <div class="map-container__right">
      <!-- 地图 -->
      <MapBox ref="mapRef" class="map-box" />
    </div>
  </div>
</template>

<script>
import MapBox from './components/map.vue';
export default {
  name: 'MapInfo',
  components: {
    MapBox
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.map-container{
  margin: 0 15px 0;
  box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
  height: calc(100vh - 146px);
  min-width: 1320px;
  overflow-x: auto;
  
  &__left{
    width: 364px;
    height: 100%;
    padding: 0;
    background-color: #F8F8F8;
    border-radius: 4px;
    overflow: hidden;
  }

  &__right{
    width: calc(100% - 364px);
    height: 100%;
    padding: 16px 12px 12px;
    background: #fff;
    border-radius: 3px;
  }
}
</style>
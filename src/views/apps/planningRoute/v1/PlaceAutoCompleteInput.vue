<template>
  <el-autocomplete v-model="name" class="item-input" clearable
                   popper-class="route-planning-address-popper"
                   :fetch-suggestions="fetchSuggestion" @select="selectPlace">
    <template slot="prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="suffix" v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </template>
    <div slot-scope="{ item }">
      <div class="name">{{ item.value }}</div>
      <div class="address">{{ item.address }}</div>
    </div>
  </el-autocomplete>
</template>

<script>
export default {
  name: "PlaceAutoCompleteInput",
  props: {
    placeInfo: {
      type: Object
    },
    searchPlace: {
      type: Function
    }
  },
  watch: {
    name (newVal) {
      this.placeInfo && (this.placeInfo.name = newVal)
    },
    'placeInfo.name': function (newVal) {
      this.name = newVal
    }
    // placeInfo: {
    //   handler (newVal) {
    //     console.log('handler', newVal)
    //     this.name = newVal.name
    //   },
    //   deep: true,
    // }
  },
  data () {
    return {
      name: null,
    }
  },
  mounted() {
    this.name = this.placeInfo.name
  },
  methods: {
    fetchSuggestion (keyword, cb) {
      return this.searchPlace(keyword, cb)
    },
    selectPlace (item) {
      this.name = item.value
      this.placeInfo.name = item.value
      this.$emit('select-place', this.placeInfo, item)
    }
  }
}
</script>

<style scoped>

</style>

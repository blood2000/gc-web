<template>
  <div style="padding: 0 16px;" @click="toggleClick">
    <i :class="isActive? 'el-icon-s-fold' :'el-icon-s-unfold'" style="fontSize:26px;color:#FFF"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      console.log(this.isActive)
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}


</style>

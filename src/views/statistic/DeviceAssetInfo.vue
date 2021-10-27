<template>
  <div class="s-container">
    <ul class="s-container__list">

    </ul>
  </div>
</template>

<script>
import { http_request } from "@/api";
export default {
  props: {

  },
  data() {
    return {
      
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {

    }
  }
}
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  padding-top: 1rem;
  &__list{
    height: 100%;
  }
}
</style>
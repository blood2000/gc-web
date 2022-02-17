<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App',
    watch: {
    "$route.path"() {
      console.log("路由变化", this.$route.path);
    },
  },
    metaInfo() {
      console.log('this.$store.state.settings.title',this.$store.state.settings.title)
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
}
</script>

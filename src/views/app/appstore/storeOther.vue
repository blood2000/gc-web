<template>
  <div>
    <StoreList :appList="list"  />
  </div>
</template>
<script>
import { http_request } from '../../../api';
import StoreList from "../components/storeList.vue";

export default {
  components: { StoreList },
  data() {
    return {
      queryParams: {
        appName: null,
        categoryCode: null,
        recommendFlag: null,
        chargeType: null,
        pageNum: 1,
        pageSize: 1000,
      },
      list: [],
    };
  },
  mounted() {
      console.log('other')
      console.log('code',this.code)
      this.queryParams.categoryCode = this.code
    this.getList();
  },
  watch:{
     code(){
         console.log('code',this.code)
          this.queryParams.categoryCode = this.code
         this.getList()
     } 
  },
  props: {
    code: {
      type: String,
      default: '',
    },
  },

  methods: {
    async getList() {
      console.log("param", this.queryParams);
      this.list = []
      const obj = {
        moduleName: "http_app",
        method: "post",
        url_alias: "paging",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      console.log("res", res.data.rows);
      this.list = res.data.rows
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
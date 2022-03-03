<template>
  <div class="pages-info none-org-tree">
    <div class="pages-info-right">
      <StoreSimpleList :list="list"/>
    </div>
  </div>
</template>
<script>
import { http_request } from '../../../api';
import StoreSimpleList from "../components/storeSimpleList2.vue";
export default {
  components: { StoreSimpleList },
    data(){
    return {
      list : []
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
   async getList(){
     this.list = []
     const obj = {
        moduleName: "http_app",
        method: "get",
        url_alias: "companyList",
     }
    const res = await http_request(obj)
    console.log('userList',res)
    this.list = res.data
    }
  }
};
</script>

<style lang="scss" scoped>
.pages-info-right {
  padding: 43px 33px !important;
  overflow: auto;
}
</style>
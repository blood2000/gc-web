 <template>
  <div>order detail</div>
</template>

<script>
import { http_request } from "../../../api";
export default {
  name: "detail",
  components: {},
  data() {
    return {
      codes: null,
    };
  },
  created() {},
  mounted() {
    if (document.location.search.includes("code")) {
      this.codes = document.location.search.split("=")[1];
      console.log("code", this.codes);
    }
    this.getDetail();
  },
  methods: {
    async getDetail() {
      //detail_dispatch
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "detail_dispatch",
        url_code: [this.codes],
      };
      const res = await http_request(obj);
      console.log('detail res',res)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
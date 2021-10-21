 <template>
  <el-drawer
    :title="options.title"
    :visible.sync="createDrawer"
    direction="rtl"
    style="z-index:2000"
    :before-close="handleClose"
    size="45%"
    :append-to-body="true"
  >
   1231
    
  </el-drawer>
</template>

<script>
import { http_request } from "../../../api";
export default {
  name: "detail",
  components: {},
  props: {
    createDrawer: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      pageData: {},
    };
  },
  created() {},
  watch: {
    createDrawer() {
      console.log("我在监听");
      if (this.createDrawer) {
        console.log("他变成true");
        // this.getDetail();
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("colseCreateDrawer");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      const node = (
        <span class="svg-icon-box">
          <span class={"svg-icon iconfont icon-nav-system icon-" + icon} />
        </span>
      );
      vnodes.push(node);
    }
    if (title) {
      // console.log("ckc title", title);
      vnodes.push(
        <span  class="label">
          {title}
        </span>
      );
    }
    console.log('ckc vnodes',vnodes)
    return vnodes;
  },
};
</script>

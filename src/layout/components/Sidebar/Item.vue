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
      console.log("icon=======",icon)
      const node = (
        <span class="svg-icon-box" >
          <span class={"svg-icon iconfont icon-nav-system icon-" +'zjcd_home'} />
        </span>
        // <div>
        //   <img src= />
        // </div>
      );
      vnodes.push(node);
    }
    if (title) {
      vnodes.push(
        <span  class="label" >
          {title}
        </span>
      );
    }
    return vnodes;
  },
};
</script>



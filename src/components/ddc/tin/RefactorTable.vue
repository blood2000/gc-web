<template>
  <el-table
    :ref="refName"
    v-loading="loading"
    :show-summary="summary"
    :border="border"
    :data="data"
    :height="tableHeight"
    style="width: 100%"
    :fit="true"
    v-bind="$attrs"
    highlight-current-row
    @selection-change="handleSelectionChange"
    :stripe="stripe"
  >
    <el-table-column
      v-if="!!_events['selection-change']"
      type="selection"
      width="55"
      align="center"
      fixed
      :selectable="selectable"
      :reserve-selection="reserveSelection"
    />
    <el-table-column
      v-if="!isShowIndex"
      label="序号"
      align="center"
      fixed="left"
      type="index"
      width="50"
    />
    <template v-for="(th, key) in tableColumnsConfig">
      <el-table-column
        v-if="th.isShow"
        :key="th.prop + '' + key"
        :align="th.align || 'center'"
        :prop="th.prop"
        :label="th.label"
        :min-width="th.width"
        :fixed="th.fixed === '' ? null : th.fixed"
        :show-overflow-tooltip="th.tooltip || false"
        :sortable="th.sortable || false"
      >
        <!-- <template slot="header" slot-scope="scope" v-if="th.headerSlot">
          <slot>{{scope.row[th.prop]}}</slot>
        </template> -->
        <!-- :formatter="th.formatter" -->
        <template slot-scope="scope">
          <slot :name="th.prop" :row="scope.row">{{
            scope.row[th.prop] === 0 ? 0 : scope.row[th.prop] || ""
          }}</slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: "RefactorTable",
  props: {
    // 合计
    summary: {
      type: Boolean,
      default: false,
    },
    isShowIndex: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    height:{
      type:Number,
      default:0
    },
    /**
     * list  渲染所需数据
     * 如：[{infoId:1,ipaddr:'abc'},{infoId:2,ipaddr:'def'}]
     */
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    /** 设置table 加载icon */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * tableColumnsConfig  表头动态配置数据
     * 如：{
          prop: 'ipaddr',
          label: '地址',
          width: 130,
          tooltip: true  默认false
          align: 'center' 默认居中
          fixed:'right' 固定
        }
     */
    tableColumnsConfig: {
      type: Array,
      default: function () {
        return [];
      },
    },
    refName: {
      type: String,
      default: "multipleTable",
    },
    cbData: {
      type: Array,
      default: null,
    },
    // 数据回填, 添加根据其中一项值一样再回填
    cbDataByKeyword: {
      type: Object,
      default: () => {
        return {};
      },
    },
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Function,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      multipleSelection: [],
      time: null,
      getIndex: "",
      tableHeight:0
    };
  },
  created(){
    this.getTableHeight()
  },
  watch: {
    cbData: {
      // cbData数据结构是 [0,1,2 ]
      handler(value) {
        if (!value) return;

        this.m2ToggleSelection(value.length > 0 ? value : undefined);
      },
      immediate: true,
    },
    // 通过关键字回填 {id: [5151, 454646]}
    // cbDataByKeyword: {
    //   handler(value) {
    //     if (JSON.stringify(value) === '{}') return;
    //     if (!value && !this.data.length) return;
    //     const keyname = Object.keys(value)[0];
    //     // this.cbDataByKeywordToSelection(keyname, value[keyname]);
    //   },
    //   immediate: true
    // },

    data: {
      handler(vals) {
        if (vals && vals.length) {
          this.$_multipleToSelection(this.cbDataByKeyword);
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    clearTimeout(this.time);
  },
  methods: {
    getTableHeight(){
      if(this.height){
      this.tableHeight = this.height
      return
    }
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    console.log(windowHeight)
    this.tableHeight = (windowHeight - 380)+'';
    console.log('this.tableHeight',this.tableHeight+'')
    },
    // highlight({ row, rowIndex }) {
    //   if ((this.getIndex) === rowIndex) {
    //     return {
    //       'background-color': '#FFEEE8'
    //     };
    //   }
    // },
    // tableRowClassName({ row, rowIndex }) {
    //   if (rowIndex % 2 > 0 && this.getIndex !== rowIndex) {
    //     return 'bg-row';
    //   } else {
    //     return '';
    //   }
    // },
    // rowClick(row) {
    //   console.log('测试');
    //   this.getIndex = row.index;
    // },
    
    handleSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    m2ToggleSelection(rows) {
      if (rows) {
        this.$nextTick(() => {
          this.time = setTimeout(() => {
            rows.forEach((row) => {
              this.$refs[this.refName].toggleRowSelection(this.data[row], true);
            });
          }, 100);
        });
      } else {
        this.$nextTick(() => {
          this.$refs[this.refName].clearSelection();
        });
      }
    },

    $_multipleToSelection(cbDataByKeyword) {
      if (JSON.stringify(cbDataByKeyword) === "{}") return;

      const keyname = Object.keys(cbDataByKeyword)[0];
      const rows = cbDataByKeyword[keyname];
      if (rows && rows.length) {
        const selseceds = [];

        rows.forEach((e) => {
          this.data.forEach((ee) => {
            if (ee[keyname] === e) {
              selseceds.push(ee);
            }
          });
        });

        this.$nextTick(() => {
          this.time = setTimeout(() => {
            selseceds.forEach((e) => {
              this.$refs[this.refName].toggleRowSelection(e, true);
            });
          }, 100);
        });
      }
    },
  },
};
</script>

<style lang="scss">
.el-table__empty-block {
  text-align: left !important;
  margin-left: 50% !important;
  justify-content: left !important;
}
.el-table__empty-text {
  width: auto;
}
.el-table__footer-wrapper tbody td {
  background-color: #ebf4fd !important;
  color: #409eff !important;
  font-weight: bold;
}
</style>



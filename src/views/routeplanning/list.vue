<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <div class="page-table-layout-set">
        <el-row :gutter="10" class="toolsbar">
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleAdd">添加路径</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 分割线 -->
<!--      <div class="divier"></div>-->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="listData"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        :border="false"
        :stripe="true">
        <template #edit="{ row }" width="200">
          <el-button size="mini" type="text">编辑路径</el-button>
          <el-button size="mini" type="text">编辑车辆</el-button>
          <el-button size="mini" type="text">查看车辆</el-button>
          <el-button size="mini" type="text">删除路径</el-button>
        </template>
      </RefactorTable>
    </div>
  </div>
</template>

<script>
export default {
  name: "list",
  data () {
    return {
      loading: false,
      listData: [
        {
          name: '测试路线',
          warnType: '进入路径起点位置范围开始',
          start: '起点详细地址起点详细地址起点详细地址',
          end: '起点详细地址起点详细地址起点详细地址',
          warnTime: '06:30 - 22:30'
        },
        {
          name: '测试路线',
          warnType: '进入路径起点位置范围开始',
          start: '起点详细地址起点详细地址起点详细地址',
          end: '起点详细地址起点详细地址起点详细地址',
          warnTime: '06:30 - 22:30'
        }
      ],
      tableColumnsConfig: [
        {
          isShow: true,
          label: "路径名称",
          prop: "name",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "报警开关",
          prop: "warnType",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "起点",
          prop: "start",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "终点",
          prop: "end",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "报警时段",
          prop: "warnTime",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "操作",
          prop: "edit",
          sortNum: 1,
          tooltip: true,
        },
      ]
    }
  },
  methods: {
    handleAdd () {
      this.$router.push({path: '/routeplanning/map?type=add'})
    }
  }
}
</script>

<style scoped>

</style>

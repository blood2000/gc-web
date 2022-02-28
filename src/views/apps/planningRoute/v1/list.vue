<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <div style="padding: 0 20px 10px 20px;">
        <div style="font-weight: bold; font-size: 14px;">提示</div>
        <ul style="font-size: 12px;">
          <li style="margin-bottom: 3px;">1、新建路径时，先输入起点、终点，添加途经点，点击地图路线可以细调路线。点保存后，路径生成成功，算法根据录入值自动生成路径围栏。然后回到列表页，点击编辑车辆按钮，将需要监控的车辆添加到路径中即可。</li>
          <li>2、未安装定位器的车辆，也可以添加进路径中，等车载智能设备安装好之后，会自动生效。</li>
        </ul>
      </div>
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <el-row :gutter="10" class="toolsbar">
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleAdd">添加路径</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 分割线 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="listData"
        row-key="id"
        :table-columns-config="tableColumnsConfig"
        :border="false"
        :stripe="true">
        <template #edit="{ row }" width="200">
          <el-button size="mini" type="text" @click="editRoute(row)">编辑路径</el-button>
          <el-button size="mini" type="text" @click="editVehicle(row)">编辑车辆</el-button>
<!--          <el-button size="mini" type="text" @click="viewVehicle(row)">查看车辆</el-button>-->
          <el-button size="mini" type="text" @click="delRoute(row)">删除路径</el-button>
        </template>
      </RefactorTable>
      <pagination
        v-show="total > queryParams.pageSize"
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"/>
    </div>
    <el-drawer
      v-loading="isLoadingRouteVehicles"
      :visible.sync="isShowViewVehicleDialog"
      title="查看车辆"
      direction="rtl"
      style="z-index: 2000"
      size="40%">
      <div style="padding: 20px 15px">
        <RefactorTable
          :is-show-index="true"
          :loading="isLoadingRouteVehicles"
          :data="routeVehicles"
          height="700"
          row-key="vehicle_code"
          :table-columns-config="[
            {isShow: true, label: '车牌号码', prop: 'plate_number'},
            {isShow: true, label: '车辆别名', prop: 'plate_number2'},
            {isShow: true, label: '上次路线偏离告警时间', prop: 'create_time2'}
          ]"
          :border="false">
        </RefactorTable>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="isShowEditVehicleDialog" title="编辑车辆" width="635px" :close-on-click-modal="false">
      <el-transfer
        v-loading="isLoadingBindableVehicles"
        filterable
        :filter-method="filterMethod"
        :titles="['可选车辆', '已绑定车辆']"
        filter-placeholder="请输入车牌号"
        :props="{key: 'vehicle_code', label: 'plate_number'}"
        v-model="routeVehicles"
        :data="bindableVehicles">
      </el-transfer>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="saveEditVehicle">保存</el-button>
        <el-button @click="isShowEditVehicleDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {http_request} from "../../../../api";

export default {
  name: "list",
  data () {
    return {
      isLoadingRouteVehicles: false,
      routeVehicles: [],
      apiRouteVehicles: [],
      removeRouteVehicles: [],
      isShowViewVehicleDialog: false,
      isLoadingBindableVehicles: false,
      bindableVehicles: [],
      isShowEditVehicleDialog: false,
      editVehicleForm: {
        routeCode: null,
      },
      loading: false,
      queryParams: {
        routeNameLike: null,
        status: null,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listData: [],
      tableColumnsConfig: [
        {
          isShow: true,
          label: "路径名称",
          prop: "route_name",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "起点",
          prop: "start",
          align: "left",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "终点",
          prop: "end",
          align: "left",
          sortNum: 1,
          tooltip: true,
        },
        {
          isShow: true,
          label: "报警时段",
          prop: "warnTime",
          width: 50,
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
  created() {
    this.getList()
  },
  methods: {
    viewVehicle (row) {
      this.removeRouteVehicles = []
      // this.viewVehicleForm.routeCode = row.route_code
      this.isLoadingRouteVehicles = true
      this.isShowViewVehicleDialog = true
      http_request({
        moduleName: "http_planRoute",
        method: "get",
        url_alias: "routeBindableVehicles",
        url_code: [row.route_code]
      }).then(res => {
        this.routeVehicles = res.data.rows
        this.isLoadingRouteVehicles = false
      })
    },
    filterMethod (query, item) {
      return item.plate_number.indexOf(query) > -1
    },
    async saveEditVehicle () {
      let removeVehicles = []
      let addVehicles = []

      this.apiRouteVehicles.forEach(item => {
        if (this.routeVehicles.indexOf(item) === -1) {
          removeVehicles.push(item)
        }
      })
      this.routeVehicles.forEach(item => {
        if (this.apiRouteVehicles.indexOf(item) === -1) {
          addVehicles.push(item)
        }
      })
      console.log('add', addVehicles, 'remove', removeVehicles)
      if (addVehicles.length > 0) {
        await http_request({
          moduleName: "http_planRoute",
          method: "post",
          url_alias: "routeRelVehicle",
          data: {...this.editVehicleForm, vehicles: addVehicles},
        })
      }
      if (removeVehicles.length > 0) {
        await http_request({
          moduleName: "http_planRoute",
          method: "post",
          url_alias: "removeRouteVehicle",
          data: {...this.editVehicleForm, vehicles: removeVehicles},
        })
      }
      this.msgSuccess('保存成功')
      this.isShowEditVehicleDialog = false
    },
    editRoute(row) {
      this.$router.push({path: '/apps/planningroute/v1/map?type=edit&code=' + row.route_code})
    },
    editVehicle (row) {
      this.editVehicleForm.routeCode = row.route_code
      this.isLoadingBindableVehicles = true
      this.isShowEditVehicleDialog = true
      Promise.all([
        http_request({
          moduleName: "http_planRoute",
          method: "get",
          url_alias: "getBindableVehicles",
          data: {code: row.route_code}
        }),
        http_request({
          moduleName: "http_planRoute",
          method: "get",
          url_alias: "routeBindableVehicles",
          url_code: [row.route_code]
        })
      ]).then(res => {
        let bindableVehicles = res[0].data
        let routeVehicles = res[1].data.rows.map(item => {
          return {plate_number: item.plate_number, vehicle_code: item.vehicle_code}
        })
        bindableVehicles.push(...routeVehicles)
        this.bindableVehicles = bindableVehicles
        this.routeVehicles = res[1].data.rows.map(item => item.vehicle_code)
        this.apiRouteVehicles = []
        this.apiRouteVehicles.push(...this.routeVehicles)
        this.isLoadingBindableVehicles = false
      })
    },
    removeBindVehicle (row) {
      let idx = this.routeVehicles.indexOf(row)
      this.routeVehicles.splice(idx, 1)
      this.removeRouteVehicles.push(row)
    },
    async delRoute(row) {
      await this.$confirm(`确认删除 "${row.route_name}" 路径？`,'系统提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await http_request({
        moduleName: "http_planRoute",
        method: "delete",
        url_alias: "planRouteDelete",
        url_code: [row.route_code]
      })
      this.msgSuccess("删除成功")
      this.getList()
    },
    handleAdd () {
      this.$router.push({path: '/apps/planningroute/v1/map?type=add'})
    },
    async getList() {
      let res = await http_request({
        moduleName: "http_planRoute",
        method: "post",
        url_alias: "planRoutePage",
        data: this.queryParams,
      })
      res.data.rows.forEach(item => {
        item.start = item.points[0].point_name
        item.end = item.points[1].point_name
        item.warnTime = `${item.effective_time} - ${item.expires_time}`
      })
      this.listData = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style scoped>

</style>

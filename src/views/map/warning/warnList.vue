<template>
  <!-- 地图告警列表 -->
  <div class="map-warning-table">
    <el-tabs v-model="activeTab" class="own-map-panel-tab">
      <el-tab-pane label="实时报警" name="1"></el-tab-pane>
      <el-tab-pane label="ADAS报警" name="2"></el-tab-pane>
      <el-tab-pane label="异常驾驶报警" name="3"></el-tab-pane>
      <el-tab-pane label="特殊报警" name="4"></el-tab-pane>
    </el-tabs>
    
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
      <el-form-item label="报警时间">
        <el-date-picker
          v-model="queryParams.startTime"
          clearable
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.endTime"
          clearable
          type="date"
          size="small"
          value-format="yyyy-MM-dd"
          style="width: 140px"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="报警类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择报警类型" filterable clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" height="calc(100% - 140px)" highlight-current-row border :data="dataList">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="报警类型" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="车牌号" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="告警等级" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="告警次数" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="初次报警时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="末次报警时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警位置" align="center" prop="name" :show-overflow-tooltip="true" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.start"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { http_request } from '@/api';
export default {
  data() {
    return {
      // 当前选中tab
      activeTab: '1',
      // 查询参数
      queryParams: {
        start: 1,
        limit: 10,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 报警类型字典
      typeOptions: [],
      // 报警列表
      total: 0,
      loading: false,
      dataList: []
    }
  },
  mounted() {

  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.start = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.startTime = undefined;
      this.queryParams.endTime = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 获取告警列表 */
    getList() {

    }
  }
}
</script>

<style lang="scss" scoped>
.map-warning-table{
  height: 400px;
  background: #fff;
}
</style>
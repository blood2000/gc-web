<template>
  <div class="carCaptain">
    <div class="carCaptain-left">
      <el-input
        class="mtb15"
        v-model="filterText"
        placeholder="请输入搜索关键字"
        prefix-icon="el-icon-search"
      />
      <!-- <el-tree
        ref="tree"
        :data="alarmList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @check="buildSelectAlarmList"
      >
        <span slot-scope="{ node, data }">
          <span class="node-label">
            <i class="tree-node-icon" :class="data.icon" />
            {{ node.label }}
          </span>
        </span>
      </el-tree> -->
    </div>
    <div class="carCaptain-right"></div>
  </div>
</template>

<script>
import { http_request } from '@/api'

export default {
  name: 'carCaptain',
  components: {
    filterText: []
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.carCaptain {
  padding: 0 20px;
  &-left {
    width: 220px;
    background: #fff;
    padding: 12px;
  }
}
</style>

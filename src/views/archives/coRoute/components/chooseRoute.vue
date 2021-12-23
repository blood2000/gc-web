<template>
  <div class="ChooseRoute">
    <el-dialog
      title="选择路线"
      :visible.sync="visible"
      width="500px"
      :before-close="onClose"
    >
      <el-input
        class="w300"
        v-model="routeName"
        placeholder="请输入路线名称"
        suffix-icon="el-icon-search"
        @keyup.enter.native="queryRouteAll"
      >
      </el-input>
      <div class="wrapper">
        <div class="box" v-for="(item, index) in routeList" :key="index">
          <el-radio
            class="radio"
            v-model="currentIndex"
            :label="index"
          ></el-radio>
          <div class="routeInfo" @click="onClickRadio(index)">
            <div class="name">{{ item.routeName }}</div>
            <div class="loading">
              <div class="icon">起</div>
              <span class="alias">{{ item.loadingAddressAlias }}</span>
            </div>
            <div class="unloading">
              <div class="icon">终</div>
              <span class="alias">{{ item.unloadingAddressAlias }}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSelect">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http_request } from '@/api'

export default {
  name: 'ChooseRoute',
  data() {
    return {
      visible: false,
      routeName: '',
      currentIndex: -1,
      routeList: []
    }
  },
  created() {
    this.queryRouteAll()
  },
  methods: {
    open() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    onClickRadio(index) {
      this.currentIndex = index
    },
    queryRouteAll() {
      const params = {
        moduleName: 'http_route',
        method: 'post',
        url_alias: 'route_all',
        data: {
          routeName: this.routeName
        }
      }
      http_request(params).then((res) => {
        console.log('?????', res)
        this.routeList = res.data ? res.data.rows || [] : []
      })
    },
    onSelect() {
      if (this.currentIndex >= 0) {
        this.$emit('onSelectRoute', this.routeList[this.currentIndex])
        this.onClose()
      } else {
        this.$message.error('请选择路线')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 15px 0;
  display: flex;
  border-top: 1px solid #e4ecf4;
  &:first-child {
    border-top: none;
  }
  .radio {
    width: 20px;
    overflow: hidden;
    margin: 6px 5px 0 0;
  }
  .routeInfo {
    flex: 1 1 auto;
    cursor: pointer;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    color: #3d4050;
  }
  .icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    background: #ffbc00;
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    border-radius: 3px;
    display: inline-block;
    margin-right: 7px;
  }
  .alias {
    font-size: 14px;
    color: #3d4050;
  }
  .loading {
    margin: 8px 0 5px 0;
  }
  .unloading {
    .icon {
      background: #4682fa;
    }
  }
}
.w300 {
  width: 300px;
}
::v-deep .el-dialog__header {
  background: none !important;
  padding: 20px 20px 10px !important;
  border-bottom: none !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  border-top: none !important;
}
::v-deep .el-form-item__label {
  line-height: normal;
}
</style>

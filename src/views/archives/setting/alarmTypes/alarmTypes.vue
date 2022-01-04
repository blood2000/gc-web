<template>
  <div class="alarmTypes">
    <div class="alarmTypes__panel">
      <div class="alarmTypes__tips">
        <img src="@/assets/images/icon/icon-warning.png" alt="" />
        <span>勾选后，车辆将上报的相应的告警信息</span>
      </div>
      <div class="alarmTypes__wrapper">
        <div class="alarmTypes__box">
          <div class="alarmTypes__box-tips">
            <div class="title">
              全部告警类型
              <span class="selectNum">
                {{ num.selectAlarm }}/{{ num.allAlarm }}
              </span>
            </div>
            <el-checkbox v-model="checkedAll">全选</el-checkbox>
          </div>
          <el-input
            class="mtb15"
            v-model="filterText"
            placeholder="请输入关键字搜索"
            size="small"
            suffix-icon="el-icon-search"
          />
          <el-tree
            ref="tree"
            :data="alarmList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @check="buildSelectAlarmList"
          />
        </div>
        <div class="alarmTypes__box">
          <div class="alarmTypes__box-tips">
            <div class="title">
              已选告警类型
              <span class="selectNumed">（{{ num.selectAlarm }}）</span>
            </div>
          </div>
          <div class="alarmTypes__box-container">
            <el-input
              v-model="selectFilterText"
              placeholder="请输入关键字搜索"
              size="small"
              suffix-icon="el-icon-search"
            />
            <div class="alarmTypes__select">
              <div
                class="alarmTypes__select-wrapper"
                v-for="(alarm, index) in selectAlarmList"
                :key="'alarm' + index"
              >
                <div class="alarmTypes__select-title">
                  {{ alarm.alarmObjectName }}
                </div>
                <div class="alarmTypes__select-children">
                  <div
                    v-if="
                      !alarm.alarmTypeInfoList ||
                      alarm.alarmTypeInfoList.length <= 0
                    "
                    class="alarmTypes__select-none"
                  >
                    <img src="@/assets/images/icon/icon_null.png" alt="" />
                    <p>暂未选择</p>
                  </div>
                  <div
                    v-else
                    class="alarmTypes__select-bar"
                    v-for="item in alarm.alarmTypeInfoList"
                    :key="item.id"
                  >
                    <div class="alarmTypes__select-icon">
                      <div
                        class="icon"
                        v-for="item in 6"
                        :key="'icon' + item"
                      />
                    </div>
                    <span>{{ item.alarmTypeName }}</span>
                    <i
                      @click="onClickDel(item.id)"
                      class="el-icon-close alarmTypes__select-del"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alarmTypes__btn" v-show="isShowBtn">
      <el-button @click="onCancel" size="small">取 消</el-button>
      <el-button @click="onSave" size="small" type="primary">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'

export default {
  name: 'alarmTypes',
  components: {},
  data() {
    return {
      isShowBtn: false,
      checkedAll: false,
      num: {
        allAlarm: 0,
        selectAlarm: 0
      },
      defaultProps: {
        children: 'alarmTypeInfoList',
        label: 'alarmTypeName'
      },
      filterText: '',
      selectFilterText: '',
      alarmList: [],
      allAlarmIdList: [],
      selectAlarmList: [],
      origin: {
        selectAlarmList: [],
        selectIdList: []
      }
    }
  },
  async created() {
    this.getUserAlarmTypeInfoList()
    this.getSelectUserAlarmTypeInfoList()
  },
  methods: {
    getUserAlarmTypeInfoList() {
      const obj = {
        moduleName: 'http_setting',
        method: 'get',
        url_alias: 'userAlarmTypeInfoList'
      }
      http_request(obj).then((res) => {
        if (res.data) {
          let alarmList = res.data
          let allAlarm = 0
          let allAlarmIdList = []
          alarmList.forEach((alarm) => {
            alarm.alarmTypeName = alarm.alarmObjectName
            if (alarm.alarmTypeInfoList) {
              allAlarm += alarm.alarmTypeInfoList.length
            }
            let list = alarm.alarmTypeInfoList.map((item) => {
              return item.id
            })
            allAlarmIdList.push(...list)
            list = null
          })
          this.alarmList = alarmList
          this.num.allAlarm = allAlarm
          this.allAlarmIdList = allAlarmIdList
        }
      })
    },
    getSelectUserAlarmTypeInfoList() {
      const obj = {
        moduleName: 'http_setting',
        method: 'get',
        url_alias: 'selectUserAlarmTypeInfoList'
      }
      http_request(obj).then((res) => {
        if (res.data) {
          let selectIdList = []
          res.data.forEach((alarm) => {
            if (alarm.alarmTypeInfoList) {
              let list = alarm.alarmTypeInfoList.map((item) => {
                return item.id
              })
              selectIdList.push(...list)
              list = null
            }
          })
          this.selectAlarmList = res.data
          this.origin.selectAlarmList = res.data
          this.origin.selectIdList = selectIdList
          this.num.selectAlarm = this.origin.selectIdList.length
          this.$refs.tree.setCheckedKeys(this.origin.selectIdList)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.alarmTypeName.indexOf(value) !== -1
    },
    buildSelectAlarmList() {
      this.isShowBtn = true
      let selectAlarmList = []
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let selectAlarm = 0
      this.alarmList.forEach((alarm, index) => {
        let list = alarm.alarmTypeInfoList.filter((item) => {
          return (
            checkedKeys.includes(item.id) &&
            item.alarmTypeName.indexOf(this.selectFilterText) >= 0
          )
        })
        selectAlarm += list.length
        selectAlarmList[index] = {
          alarmObjectName: alarm.alarmObjectName,
          alarmTypeInfoList: list
        }
      })
      this.selectAlarmList = selectAlarmList
      this.num.selectAlarm = selectAlarm
    },
    onClickDel(id) {
      this.$refs.tree.setChecked(id, false)
      this.buildSelectAlarmList()
    },
    onCancel() {
      this.isShowBtn = false
      this.selectAlarmList = this.origin.selectAlarmList
      this.num.selectAlarm = this.origin.selectIdList.length
      this.$refs.tree.setCheckedKeys(this.origin.selectIdList)
    },
    onSave() {
      let alarmTypeIds = this.$refs.tree.getCheckedKeys().filter((item) => {
        return item
      })
      if (alarmTypeIds.length <= 0) {
        this.$message.error('请至少选择一个告警类型')
        return
      }
      const obj = {
        moduleName: 'http_setting',
        method: 'post',
        url_alias: 'addAlarmTypeUser',
        data: {
          alarmTypeIds
        }
      }
      http_request(obj).then((res) => {
        this.$message.success(res.msg)
      })
    }
  },
  watch: {
    checkedAll(val) {
      this.$refs.tree.setCheckedKeys(val ? this.allAlarmIdList : [])
      this.buildSelectAlarmList()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selectFilterText(val) {
      this.buildSelectAlarmList()
    }
  }
}
</script>

<style lang="scss" scoped>
.alarmTypes {
  background: #fff;
  width: 730px;
  height: 100%;
  position: relative;
  padding-bottom: 40px;
  overflow: hidden;
  .mtb15 {
    margin: 15px 0;
  }
  &__panel {
    height: 100%;
    padding-top: 80px;
    position: relative;
  }
  &__tips {
    width: 340px;
    background: #f5f8ff;
    border: 1px solid #95b7fa;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
  }
  &__box {
    width: 50%;
    height: 100%;
    padding: 0 20px;
    overflow: auto;
    &-tips {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #3d4050;
        .selectNum {
          font-size: 14px;
          font-weight: bold;
          color: #d6d6d6;
          margin-left: 5px;
        }
        .selectNumed {
          font-size: 18px;
          font-weight: bold;
          color: #3d4050;
        }
      }
    }
    &-container {
      background: #f8f8f8;
      border-radius: 2px;
      margin-top: 15px;
      padding: 12px;
    }
  }
  &__select {
    padding-bottom: 15px;
    &-title {
      font-size: 14px;
      font-weight: bold;
      color: #3d4050;
      margin-bottom: 10px;
      margin-top: 15px;
    }
    &-none {
      text-align: center;
      img {
        width: 40px;
        height: 40px;
      }
      p {
        font-size: 12px;
        color: #909398;
        margin-top: -10px;
      }
    }
    &-bar {
      position: relative;
      background: #fff;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      span {
        font-size: 14px;
        color: #3d4050;
      }
    }
    &-icon {
      width: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-right: 10px;
      .icon {
        width: 2px;
        height: 2px;
        background: #3d4050;
        border-radius: 50%;
        margin: 0 2px 3px 0;
      }
    }
    &-del {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
  }
  &__btn {
    width: 100%;
    height: 40px;
    background: #fff;
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding-right: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

::v-deep .el-tree-node:before {
  border-left: none;
}
::v-deep .el-tree-node:after {
  border-top: none;
}
</style>

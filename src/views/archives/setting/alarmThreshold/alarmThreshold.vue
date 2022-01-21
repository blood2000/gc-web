<template>
  <div class="alarmThreshold">
    <div class="alarmThreshold__wrapper">
      <el-form ref="form" label-width="90px" label-position="top">
        <el-row>
          <div class="alarmThreshold__box" v-for="(item, index) in alarmList" :key="index">
            <div class="alarmThreshold__title">{{ item.name }}</div>
            <template></template>
            <el-col
              :span="12"
              v-for="(alarm, index) in item.alarmCommandCompanyVos"
              :key="'alarm' + index"
            >
              <el-form-item :label="alarm.key">
                <el-time-picker
                  v-if="alarm.type === '1'"
                  is-range
                  class="w256"
                  v-model="rangeValue"
                  unlinkPanels
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="HH:mm:ss"
                  :placeholder="alarm.tips"
                  :disabled="alarm.isEdit === '1'">
                </el-time-picker>
                <el-select v-if="alarm.type === '2'" class="w256" v-model="alarm.value" :placeholder="alarm.tips" :disabled="alarm.isEdit === '1'">
                  <el-option v-for="optVal in alarm.options.split('、')" :key="optVal" :label="optVal" :value="optVal"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
    <div class="alarmThreshold__btn">
      <el-button @click="onCancel" size="small">取 消</el-button>
      <el-button @click="onSave" :loading="loading" size="small" type="primary">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import { deepClone } from '@/utils/index'

export default {
  name: 'alarmThreshold',
  components: {},
  data() {
    return {
      rangeValue: ['00:00:00', '23:59:59'],
      loading: false,
      alarmList: [],
      originAlarmList: [],
    }
  },
  created() {
    this.getCommandType()
  },
  methods: {
    getCommandType() {
      const params = {
        moduleName: 'http_setting',
        method: 'get',
        url_alias: 'getCommandType',
      }
      http_request(params).then((res) => {
        let list = res.data || []
        this.originAlarmList = deepClone(list)
        this.alarmList = list
        this.alarmList.forEach(row => {
          row.alarmCommandCompanyVos.forEach(item => {
            if (item.type === '1') { // 时间范围格式
              this.rangeValue = item.value ? item.value.split(',') : item.defaultValue.split(',')
            } else {
              this.value = item.value || item.defaultValue
            }
          })
        })
      })
    },
    onCancel() {
      this.alarmList = deepClone(this.originAlarmList)
    },
    onSave() {
      this.alarmList.forEach(row => {
        row.alarmCommandCompanyVos.forEach(item => {
          if (item.type === '1') { // 时间范围格式
            item.value = this.rangeValue.join(',')
          }
        })
      })
      const params = {
        moduleName: 'http_setting',
        method: 'post',
        url_alias: 'sendCommand',
        data: {
          commandVos: this.alarmList,
        },
      }
      this.loading = true
      http_request(params).then((res) => {
        this.$message.success(res.msg)
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.alarmThreshold {
  width: 730px;
  height: 100%;
  background: #fff;
  padding: 25px 30px 50px 30px;
  position: relative;
  .w256 {
    width: 256px;
  }
  &__wrapper {
    height: 100%;
    overflow: auto;
  }
  &__title {
    font-size: 14px;
    font-weight: bold;
    color: #3d4050;
  }
  &__box {
    overflow: hidden;
  }
  &__btn {
    position: absolute;
    bottom: 10px;
    right: 0px;
    padding-right: 30px;
  }
}
::v-deep .numInput input::-webkit-outer-spin-button,
::v-deep .numInput input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>

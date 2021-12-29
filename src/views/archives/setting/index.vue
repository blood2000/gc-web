<template>
  <div class="setting">
    <div class="setting-left">
      <div
        class="setting-left__box"
        :class="{ 'setting-left__box-show': current === tabs.alarmTypes }"
        @click="onClickTabs(tabs.alarmTypes)"
      >
        <span class="g-double-row">告警类型设置</span>
      </div>
      <div
        class="setting-left__box"
        :class="{ 'setting-left__box-show': current === tabs.alarmThreshold }"
        @click="onClickTabs(tabs.alarmThreshold)"
      >
        <span class="g-double-row">告警阈值设置</span>
      </div>
    </div>
    <div class="setting-right">
      <AlarmTypes v-show="current === tabs.alarmTypes" />
      <AlarmThreshold v-show="current === tabs.alarmThreshold" />
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import AlarmTypes from './alarmTypes/alarmTypes.vue'
import AlarmThreshold from './alarmThreshold/alarmThreshold.vue'

export default {
  name: 'setting',
  components: {
    AlarmTypes,
    AlarmThreshold
  },
  data() {
    return {
      tabs: {
        alarmTypes: '1', // 告警类型设置
        alarmThreshold: '2' // 告警阈值设置
      },
      current: '1' // 1:告警类型设置；2:告警阀值设置
    }
  },
  created() {},
  methods: {
    onClickTabs(tab) {
      this.current = tab
    },
    queryShipmentAlllist() {
      const params = {
        moduleName: 'http_company',
        method: 'get',
        url_alias: 'shipment_Alllist'
      }
      http_request(params).then((res) => {
        this.companyList = res.data || []
        if (this.companyList.length > 0) {
          this.currentCompany = this.companyList[0].code
          this.querysettingPage()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  height: 100%;
  margin-top: -20px;
  display: flex;
  .setting-left {
    width: 240px;
    min-height: 100%;
    background: #fff;
    padding: 10px 0;
    &__box {
      margin: 10px 0;
      padding: 10px 16px;
      display: flex;
      cursor: pointer;
      span {
        font-size: 14px;
        font-weight: bold;
        color: #3d4050;
      }
      &:hover {
        border-right: 2px solid #4682fa;
        background: rgba(70, 130, 250, 0.08);
        span {
          color: #4682fa;
          font-weight: bold;
        }
      }
    }
    &__box-show {
      border-right: 2px solid #4682fa;
      background: rgba(70, 130, 250, 0.08);
      span {
        color: #4682fa;
        font-weight: bold;
      }
    }
  }
  .setting-right {
    flex: 1 1 auto;
    width: 0;
    padding: 20px;
  }
}
</style>

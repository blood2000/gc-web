<template>
  <div class="videoChannel">
    <div class="videoChannel-title">视频通道别名设置</div>
    <div class="videoChannel-wrapper">
      <div class="videoChannel-box" v-for="item in channelDataList" :key="item.channel">
        <div class="videoChannel-box__flex">
          <img class="icon-camera" src="@/assets/images/icon/icon-camera.png" alt="" />
          <span>{{ item.channel }}</span>
        </div>
        <div class="videoChannel-box__flex">
          <span v-show="item.dictValue" class="channelAlias">{{ item.channelAlias }}</span>
          <span v-show="!item.dictValue" class="channel">默认显示{{ item.channel }}</span>
          <el-popover
            placement="bottom-end"
            width="370"
            trigger="hover"
            @show="onPopoverShow(item)"
          >
            <div class="videoChannel-radio">
              <div
                class="label"
                :class="{
                  'label-disabled':
                    selectChannel.has(channel.dictValue) && item.dictValue !== channel.dictValue,
                  'label-active': current.dictValue === channel.dictValue,
                }"
                v-for="channel in channelPageList"
                :key="channel.dictValue"
                @click="onClickChannel(channel, item.dictValue)"
              >
                <span>{{ channel.dictLabel }}</span>
                <img
                  v-show="current.dictValue === channel.dictValue"
                  src="@/assets/images/icon/icon-camera-active.png"
                  alt=""
                />
              </div>
            </div>
            <div class="videoChannel-btn">
              <el-button type="primary" @click="onConfirm(item)">确认</el-button>
            </div>
            <i class="el-icon-caret-bottom arrow-bottom" slot="reference" />
          </el-popover>
        </div>
      </div>
    </div>
    <div class="videoChannel-btnBox" v-show="isShowBtn">
      <el-button @click="onCancel" size="small" :loading="loading">取 消</el-button>
      <el-button @click="onSave" size="small" type="primary" :loading="loading">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { http_request } from '@/api'
import { deepClone } from '@/utils/index'

export default {
  name: 'videoChannel',
  components: {},
  data() {
    return {
      loading: false,
      isShowBtn: false,
      current: {},
      selectChannel: new Map(),
      channelPageList: [],
      channelDataList: [],
      origin: {
        channelDataList: [],
      },
    }
  },
  created() {
    this.getChannelPage()
    this.getChannelData()
  },
  methods: {
    getChannelPage() {
      const params = {
        moduleName: 'http_setting',
        method: 'get',
        url_alias: 'channelPage',
      }
      http_request(params).then((res) => {
        if (res.data) {
          this.channelPageList = res.data
        }
      })
    },
    getChannelData() {
      const params = {
        moduleName: 'http_setting',
        method: 'get',
        url_alias: 'channelData',
      }
      http_request(params).then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            if (!item.channelAlias) {
              item.channelAlias = ''
            }
            if (item.dictValue) {
              this.selectChannel.set(item.dictValue, true)
            }
          })
          this.origin.channelDataList = deepClone(res.data)
          console.log('dddd', this.selectChannel)
          this.channelDataList = res.data
        }
      })
    },
    // 显示别名的时候
    onPopoverShow(channel) {
      this.current = channel
      this.current.dictLabel = channel.channelAlias
    },
    // 点击了别名
    onClickChannel(channel, dictValue) {
      if (this.selectChannel.has(channel.dictValue) && channel.dictValue !== dictValue) {
        this.$message.error('该别名已被其他通道选择！')
        return
      }
      this.selectChannel.delete(dictValue)
      this.current = this.current.dictValue === channel.dictValue ? {} : channel
    },
    // 点击了确认
    onConfirm(item) {
      this.isShowBtn = true
      item.channelAlias = this.current.dictLabel
      item.dictValue = this.current.dictValue
      if (this.current.dictValue) {
        this.selectChannel.set(this.current.dictValue, true)
      }
      this.$message.success('修改成功，若想生效请保存')
    },
    // 点击了保存
    onSave() {
      this.loading = true
      const params = {
        moduleName: 'http_setting',
        method: 'post',
        url_alias: 'updateChannel',
        data: {
          param: this.channelDataList,
        },
      }
      http_request(params)
        .then((res) => {
          this.$message.success('修改成功！')
          this.origin.channelDataList = deepClone(this.channelDataList)
          this.isShowBtn = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击了取消
    onCancel() {
      this.channelDataList = deepClone(this.origin.channelDataList)
      this.selectChannel.clear()
      this.channelDataList.forEach((item) => {
        if (item.dictValue) {
          this.selectChannel.set(item.dictValue, true)
        }
      })
      this.isShowBtn = false
    },
  },
}
</script>

<style lang="scss" scoped>
.videoChannel {
  // width: 460px;
  height: 100%;
  padding: 15px;
  background: #fff;
  position: relative;
  overflow: auto;
  border-bottom-right-radius: 5px;
  &-title {
    font-size: 14px;
    font-weight: bold;
    color: #3d4050;
  }
  &-wrapper {
    margin-top: 20px;
  }
  &-box {
    width: 100%;
    height: 36px;
    background: #f7f7f7;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    &__flex {
      display: flex;
      align-items: center;
      .channelAlias {
        font-size: 14px;
        color: #4682fa;
      }
      .channel {
        font-size: 14px;
        color: #bebebe;
      }
      .arrow-bottom {
        color: #4682fa;
        margin: 0 10px;
      }
      span {
        font-size: 14px;
        color: #3d4050;
      }
    }
    .icon-camera {
      width: 16px;
      height: 16px;
      margin: 0 8px;
    }
  }
  &-radio {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;
    .label {
      width: 168px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border: 1px solid #e4ecf4;
      border-radius: 4px;
      font-size: 14px;
      color: #3d4050;
      position: relative;
      margin-bottom: 12px;
      cursor: pointer;
      &-disabled {
        background: #eaeaea;
        cursor: not-allowed;
      }
      &-active {
        color: #4682fa;
        font-weight: bold;
        border-color: #4682fa;
        background: #fff;
      }
      img {
        width: 16px;
        height: 16px;
        position: absolute;
        bottom: -1px;
        right: -1px;
      }
    }
  }
  &-btn {
    display: flex;
    justify-content: flex-end;
  }
  &-btnBox {
    width: 100%;
    height: 40px;
    position: absolute;
    left: 0px;
    bottom: 10px;
    padding-right: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>

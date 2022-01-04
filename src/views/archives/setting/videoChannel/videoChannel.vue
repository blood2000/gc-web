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
                :class="{ 'label-active': current.dictValue === channel.dictValue }"
                v-for="channel in channelPageList"
                :key="channel.dictValue"
                @click="onClickChannel(channel)"
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
      <el-button @click="onCancel" size="small">取 消</el-button>
      <el-button @click="onSave" size="small" type="primary">保 存</el-button>
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
      isShowBtn: false,
      current: {},
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
          this.origin.channelDataList = deepClone(res.data)
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
    onClickChannel(channel) {
      this.current = this.current.dictValue === channel.dictValue ? {} : channel
    },
    // 点击了确认
    onConfirm(item) {
      this.isShowBtn = true
      item.channelAlias = this.current.dictLabel
      item.dictValue = this.current.dictValue
      this.$message.success('修改成功，若想生效请保存')
    },
    // 点击了保存
    onSave() {
      const params = {
        moduleName: 'http_setting',
        method: 'post',
        url_alias: 'updateChannel',
        data: {
          param: this.channelDataList
        },
      }
      http_request(params).then((res) => {
        this.$message.success('修改成功！')
      })
    },
    // 点击了取消
    onCancel() {
      this.channelDataList = deepClone(this.origin.channelDataList)
      this.isShowBtn = false
    },
  },
}
</script>

<style lang="scss" scoped>
.videoChannel {
  width: 460px;
  height: 100%;
  padding: 15px;
  background: #fff;
  position: relative;
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
      &-active {
        color: #4682fa;
        font-weight: bold;
        border-color: #4682fa;
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

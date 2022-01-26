<template>
  <div class="stealing-coal-main">
    <div class="stealing-coal-main-title">偷换煤预警设置</div>
    <div class="stealing-coal-main-sub-title">预警触发条件</div>
    <div class="stealing-coal-main-sub-title">
      <img class="stealing-coal-main-waring-icon" src="@/assets/images/stealingcoal/warning1.png"/>
      一级预警
      <span class="stealing-coal-main-sub-title-tip">一级预警为最高级别预警</span>
    </div>
    <div class="waring-desc-content">
      <span class="waring-type-name">超时停留</span>
      <img src="@/assets/images/stealingcoal/plus.png"/>
      <span class="waring-type-name">路线偏离</span>
      <img src="@/assets/images/stealingcoal/plus.png"/>
      <span class="waring-type-name">载重异常</span>
    </div>
    <div class="stealing-coal-main-sub-title">
      <img class="stealing-coal-main-waring-icon" src="@/assets/images/stealingcoal/warning2.png"/>
      二级预警
    </div>
    <div class="waring-desc-content">
      <span style="margin-right: 20px">
        <span class="waring-type-name">超时停留</span>
        <img src="@/assets/images/stealingcoal/plus.png"/>
        <span class="waring-type-name">路线偏离</span>
      </span>
      <span style="margin-right: 20px">
        <span class="waring-type-name">超时停留</span>
        <img src="@/assets/images/stealingcoal/plus.png"/>
        <span class="waring-type-name">载重异常</span>
      </span>
      <span style="margin-right: 20px; display: inline-block; margin-top: 10px;">
        <span class="waring-type-name">路线偏离</span>
        <img src="@/assets/images/stealingcoal/plus.png"/>
        <span class="waring-type-name">载重异常</span>
      </span>
    </div>
    <div class="stealing-coal-main-sub-title">
      <img class="stealing-coal-main-waring-icon" src="@/assets/images/stealingcoal/warning3.png"/>
      三级预警
    </div>
    <div class="waring-desc-content">
      <span class="waring-type-name">超时停留</span>
      <span class="waring-type-name">路线偏离</span>
      <span class="waring-type-name">载重异常</span>
    </div>
    <div class="stealing-coal-main-sub-title">预警触发设置</div>
    <el-row>
      <el-col :span="12" style="position: relative; padding-right: 60px;">
        <span style="font-size: 14px; color: #3D4050;">触发条件联动响应间隔时间：</span>
        <el-input style="margin-right: 40px;" placeholder="请输入">
          <span slot="append">分钟</span>
        </el-input>
        <img @click="isShowTipDialog = true" style="position: absolute; right: 34px; top: 32px" src="@/assets/images/stealingcoal/question.png">
      </el-col>
      <el-col :span="12" style="position: relative; padding-right: 60px;">
        <span style="font-size: 14px; color: #3D4050;">车辆响应路线偏离算法时机：</span>
<!--        <el-input style="margin-right: 40px;" placeholder="进入路径起点位置范围开始"></el-input>-->
        <el-select style="margin-right: 40px; width: 100%">
          <el-option label="进入路径起点位置范围开始" value="1"/>
          <el-option label="进入路径任意位置范围开始" value="2"/>
        </el-select>
        <img @click="isShowTip2Dialog = true" style="position: absolute; right: 34px; top: 32px" src="@/assets/images/stealingcoal/question.png">
      </el-col>
    </el-row>
    <div class="action-container">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button @click="save" :loading="loading" size="small" type="primary">保 存</el-button>
    </div>
    <el-dialog :visible.sync="isShowTipDialog" title="触发条件联动响应间隔时间" width="800px" :close-on-click-modal="false">
      <div style="font-size: 14px; line-height: 40px;">该时效的设置将影响预警算法。</div>
      <div style="font-size: 14px;color: #A6A6A6;">例： 间隔时间为：10分钟；</div>
      <img style="width: 100%" src="@/assets/images/stealingcoal/warning-info.png">
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="isShowTipDialog = false">知道了</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowTip2Dialog" title="报警开关" width="500px" :close-on-click-modal="false">
      <div style="font-size: 14px; line-height: 40px;">【 进入路径起点位置范围开始】：</div>
      <div style="font-size: 14px;color: #A6A6A6; text-indent: 20px;">当车辆进入路径起点范围后，车辆开始响应路径偏离报警算法。</div>
      <div style="font-size: 14px; line-height: 40px;">【 进入路径任意位置范围开始】：</div>
      <div style="font-size: 14px;color: #A6A6A6; text-indent: 20px;">当车辆进入路径上任意一个位置点的范围后，车辆开始响应路径偏离报警算法。</div>
      <div style="font-size: 14px; margin-top: 20px;">以上的【范围】是指用户设置的【路径偏离报警距离最大值】</div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="isShowTip2Dialog = false">知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {http_request} from "../../../../api";

export default {
  name: "index",
  data () {
    return {
      isShowTipDialog: false,
      isShowTip2Dialog: false,
      loading: false,
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig () {
      let res = await http_request({
        moduleName: "http_stealingCoal",
        method: "get",
        url_alias: "getCommandType",
      })
    },
    cancel () {

    },
    save() {

    }
  }
}
</script>

<style scoped lang="scss">
.stealing-coal-main {
  width: 730px;
  height: 100%;
  background: #fff;
  padding: 25px 30px 20px 20px;
  position: relative;
  &-title {
   font-size: 14px;
   font-weight: bold;
   color: #3d4050;
    line-height: 50px;
  }
  &-sub-title {
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    color: #3d4050;
    vertical-align: bottom;
    &-tip {
      font-weight: 400;
      font-size: 12px;
      color: #A6A6A6;
    }
  }
  &-waring-icon {
    margin: -7px 5px -7px 0;
    width: 24px;
    height: 24px;
    //background: url('~/src/assets/images/stealingcoal/warning1.png') no-repeat;
  }
  .waring-type-name {
    background-color: #F5F5F5;
    padding: 10px 15px;
    border-radius: 30px;
    margin: 0 10px;
    font-size: 14px;
  }
  .waring-desc-content {
    line-height: 40px;
    margin-bottom: 15px;
    margin-left: 10px;
  }
  .action-container {
    position: absolute;
    bottom: 10px;
    right: 0px;
    padding-right: 30px;
  }
}
</style>

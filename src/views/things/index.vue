<template>
  <div class="g-statistic">
    <!-- title -->
    <div class="header-box ly-flex ly-flex-align-center">
      <img class="header-logo" src="~@/assets/images/things/header_logo.png" />
      <img class="header-text" src="~@/assets/images/things/header_text.png" />
    </div>

    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top ly-border">
        <Title>运行概况</Title>
        <div class="content-box ly-border">
          <OperationOverview />
        </div>
      </div>
      <div class="ly-left-center ly-border">
        <Title>服务器性能</Title>
        <div class="content-box ly-border">
          <ServerPerformance ref="ServerPerformanceRef" />
        </div>
      </div>
      <div class="ly-left-bottom ly-border">
        <Title>设备类型占比</Title>
        <div class="content-box ly-border">
          <DeviceType ref="DeviceTypeRef" />
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border ly-flex-v ly-flex-pack-justify">
      <CenterData ref="CenterDataRef" />
    </div>

    <!-- right -->
    <div class="ly-right ly-border">
      <div class="ly-right-top ly-border">
        <Title>接口性能分析</Title>
        <div class="content-box ly-border">
          <PerformanceAnalysis ref="PerformanceAnalysisRef" />
        </div>
      </div>
      <div class="ly-right-center ly-border">
        <Title>上报数据占比</Title>
        <div class="content-box ly-border">
          <ReportData ref="ReportDataRef" />
        </div>
      </div>
      <div class="ly-right-bottom ly-border">
        <Title>最新上报消息</Title>
        <div class="content-box ly-border">
          <ReportMessage ref="ReportMessageRef" />
        </div>
      </div>
    </div>

    <!-- gif -->
    <img class="center-img center-1" src="~@/assets/images/things/center_1.gif" />
    <img class="center-img center-2" src="~@/assets/images/things/center_2.gif" />
    <img class="center-img center-3" src="~@/assets/images/things/center_3.gif" />
  </div>
</template>

<script>
import { ThrottleFun } from '@/utils/index.js';
import Title from './components/title';
import OperationOverview from './OperationOverview.vue'; // 运行概况
import ServerPerformance from './ServerPerformance.vue'; // 服务器性能
import DeviceType from './DeviceType.vue'; // 设备类型占比
import PerformanceAnalysis from './PerformanceAnalysis.vue'; // 接口性能分析
import ReportData from './ReportData.vue'; // 上报数据占比
import ReportMessage from './ReportMessage.vue'; // 最新上报消息
import CenterData from './CenterData.vue';
// 设备类型、告警类型数据
import { deviceTypeList, warnTypeList } from './test.js';
export default {
  name: 'Statistic',
  components: {
    Title,
    OperationOverview,
    ServerPerformance,
    DeviceType,
    PerformanceAnalysis,
    ReportData,
    ReportMessage,
    CenterData
  },
  data() {
    return {
      wsurl: '/fmsweb/tempAlarm',
      websock: null,
      lockReconnect: false,
      timerReconnect: null,
      heartTimeout: null,
      serverTimeout: null,
      // 每分钟刷新一次数据
      timer: null,
      curHour: 0,
      dataList: [],
      isAdd: true
    };
  },
  mounted() {
    this.getData();
    this.curHour = new Date().getHours();
    this.setTimer();
    this.setHtmlFontSize();
    window.addEventListener('resize', this.resizeFun);
    this.createWebSocket();
  },
  beforeDestroy() {
    this.clearTimer();
    window.removeEventListener('resize', this.resizeFun);
  },
  methods: {
    getData() {
      this.dataList = [{
        title: '轨迹查询',
        count: 347812,
        time: 2.14
      },{
        title: '位置查询',
        count: 359112,
        time: 7.51
      },{
        title: '视频调阅',
        count: 321200,
        time: 12.41
      },{
        title: '告警查询',
        count: 371512,
        time: 0.68
      },{
        title: '指令下发',
        count: 251589,
        time: 12.76
      }];
      this.$refs.PerformanceAnalysisRef.setData(this.dataList);
      this.$refs.CenterDataRef.setData(this.dataList);
    },
    resizeFun() {
      const throttle = ThrottleFun(this.refreshChart, 300);
      throttle();
    },
    // 图表自适应
    refreshChart() {
      this.setHtmlFontSize();
      this.$refs.DeviceTypeRef.refreshChart();
      this.$refs.ReportDataRef.refreshChart();
      this.$refs.ServerPerformanceRef.refreshChart();
    },
    // 计算根节点fontsize
    setHtmlFontSize() {
      // 设1rem = 40px
      // 192 = 3840 / 20
      // 96 = 1920 / 20
      // font-size: calc(100vw / 96);
      const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (!clientWidth) return;
      let size = clientWidth / 40;
      if (size < 96) size = 96;
      if (size > 192) size = 192;
      // console.log('clientWidth: ', clientWidth);
      // console.log('size: ', size);
      document.getElementsByTagName('html')[0].style.fontSize = `calc(100vw / ${size})`;
    },
    // 创建websocket
    createWebSocket() {
      try {
        this.websock = new WebSocket(process.env.VUE_APP_WS_PROTOCOL + process.env.VUE_APP_BASE_HOST + this.wsurl);
        // this.websock = new WebSocket('ws://192.168.1.18:8080/fmsweb/tempAlarm');
        this.initWebSocket();
      } catch (e) {
        console.log('catch', e);
        this.reconnect();
      }
    },
    initWebSocket() {
      this.websock.onmessage = (e) => {
        // 拿到pong说明当前连接是正常的
        if (e.data === 'pong') {
          // console.log('pong');
          this.heartCheck();
        } else if (e.data && e.data.length > 10) {
          this.setData(JSON.parse(e.data));
        }
      };
      this.websock.onopen = () => {
        console.log('连接成功', this.websock);
        this.heartCheck();
      };
      this.websock.onerror = () => {
        console.log('连接失败');
        this.reconnect();
      };
      this.websock.onclose = (e) => {
        console.log('断开连接', e);
        this.reconnect();
      };
    },
    // 重连
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      console.log('发起重连');
      this.lockReconnect = true;
      // 没连接上会一直重连，设置延迟
      this.timerReconnect && clearTimeout(this.timerReconnect);
      this.timerReconnect = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 3 * 1000);
    },
    // 心跳检测
    heartCheck() {
      this.heartTimeout && clearTimeout(this.heartTimeout);
      this.serverTimeout && clearTimeout(this.serverTimeout);
      this.heartTimeout = setTimeout(() => {
        // 发送一个心跳包
        // console.log('ping');
        this.websock.send('ping');
        // 计算答复的超时时间
        this.serverTimeout = setTimeout(() => {
          if (this.websock) this.websock.close();
          console.log('答复超时');
        }, 5 * 1000);
      }, 4 * 1000);
    },
    // 处理实时数据
    setData(dJson) {
      console.log('实时Json：', dJson);
      // 假数据
      dJson.time = this.parseTime(new Date());
      dJson.name = deviceTypeList[this.getRadom(0, deviceTypeList.length-1)];
      dJson.type = warnTypeList[this.getRadom(0, warnTypeList.length-1)];
      dJson.device = '868120274638466';
      // 刷新
      this.$refs.ReportMessageRef.setData(dJson);
      this.$refs.ReportDataRef.refreshData();
    },
    // 每分钟更新跑一次定时器
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        // 实时调用量随机增加
        this.dataList.forEach(el => {
          el.count += Math.round(Math.random()*10);
          if (this.isAdd) {
            el.time += (Math.random()*0.1);
          } else {
            el.time -= (Math.random()*0.1);
          }
        });
        this.isAdd = !this.isAdd;
        this.$refs.PerformanceAnalysisRef.setData(this.dataList);
        this.$refs.CenterDataRef.setData(this.dataList);
        this.$refs.CenterDataRef.refreshData();
        // 如果是新的小时，刷新接口
        if (this.curHour !== new Date().getHours()) {
          this.curHour = new Date().getHours();
          this.$refs.ServerPerformanceRef.getData();
        }
      }, 60 * 1000)
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    // 随机获取 x~y 之间的一个整数
    getRadom(x, y) {
      return Math.round(Math.random()*(y-x)+x);
    }
  }
}
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  // border: 0.05rem dashed rgba(255, 255, 255, 0.2);
}

// 设计稿大小：1920*1080
// 1rem = 40px;
.g-statistic {
  $width: 96rem;
  $width_left: 22.46rem;
  $width_right: 22.46rem;

  //base
  position: relative;
  color: #fff;
  font-size: 0.7rem;
  background-color: #111111;
  box-sizing: border-box;

  //unSelect
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  //layout
  width: $width;
  height: 100%;
  overflow: hidden;
  padding: 4rem 1rem 1rem;
  .ly-left{
    width: $width_left;
    height: 100%;
    float: left;
    position: relative;
    z-index: 9;
    background: rgba(34, 34, 34, 0.6);
    padding: 1.5rem;
    .ly-left-top{
      height: 38.4%;
    }
    .ly-left-center{
      height: 44.6%;
    }
    .ly-left-bottom{
      height: 17%;
    }
  }
  .ly-center{
    position: relative;
    width: calc(100% - #{$width_left} - #{$width_right});
    height: 100%;
    float: left;
    position: relative;
    z-index: 9;
  }
  .ly-right{
    width: $width_right;
    height: 100%;
    float: right;
    position: relative;
    z-index: 9;
    background: rgba(34, 34, 34, 0.6);
    padding: 1.5rem;
    .ly-right-top{
      height: 40.1%;
    }
    .ly-right-center{
      height: 28.6%;
    }
    .ly-right-bottom{
      height: 31.3%;
    }
  }


  // gif
  .center-img{
    width: 95%;
    height: 95%;
    position: absolute;
    left: 2.5%;
    top: 2.5%;
    &.center-1{
      z-index: 8;
    }
    &.center-2{
      z-index: 7;
    }
    &.center-3{
      z-index: 6;
    }
  }

  // style
  .content-box{
    height: calc(100% - 1rem);
  }
  .header-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    width: 100%;
    height: 3rem;
    background: #222222;
    >.header-logo{
      width: 2rem;
      height: 1.5rem;
      margin: 0 0.75rem 0 2rem;
    }
    >.header-text{
      width: 12.5rem;
      height: 1.45rem;
    }
  }
}
</style>

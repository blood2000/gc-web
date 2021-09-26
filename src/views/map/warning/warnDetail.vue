<template>
  <!-- 地图告警明细 -->
  <el-drawer
    size="844px"
    title="告警明细"
    :wrapper-closable="true"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    :close="cancel"
    class="map-warning-detail-dialog"
  >
    <div class="map-warning-detail">
      <ul class="block-list ly-flex ly-flex-pack-start">
        <li class="ly-flex-v ly-flex-align-center ly-flex-pack-center">
          <img src="~@/assets/images/device/warn_icon_1.png">
          <p class="g-single-row text">车道偏离</p>
        </li>
        <li class="ly-flex-v ly-flex-align-center ly-flex-pack-center">
          <img src="~@/assets/images/device/warn_label_3.png">
          <p class="g-single-row text">三级告警</p>
        </li>
        <li class="ly-flex-v ly-flex-align-center ly-flex-pack-center">
          <p class="g-single-row count">53</p>
          <p class="g-single-row text">告警次数</p>
        </li>
      </ul>

      <el-table 
        v-loading="loading" 
        height="calc(100% - 142px)" 
        stripe 
        :data="dataList"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @row-click="clickRowHandle"
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="告警时间" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="驾驶司机" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="告警时速(km/h)" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="告警位置" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="告警图片/视频" prop="name" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img class="mr5" src="~@/assets/images/device/warn_detail_image.png">
            <img src="~@/assets/images/device/warn_detail_camera_d.png">
          </template>
        </el-table-column>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ul class="table-images-list ly-flex ly-flex-pack-start">
              <li>
                image1
              </li>
              <li>
                image2
              </li>
              <li>
                image3
              </li>
              <li>
                <video-player 
                  class="vjs-custom-skin videoPlayer" 
                  :playsinline="true"
                  :options="playerOptions"
                  width="100%"
                />
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.start"
        :limit.sync="queryParams.limit"
        @pagination="getList"
      />
    </div>
  </el-drawer>
</template>

<script>
import { http_request } from '@/api';
export default {
  props: {
    open: Boolean
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        start: 1,
        limit: 10
      },
      // 报警列表
      total: 0,
      loading: false,
      dataList: [{id: 1, name: 123}, {id: 2, name: 123}, {id: 3, name: 123}, {id: 4, name: 123}, {id: 5, name: 123}],
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      // 视频配置
      playerOptions: {
        height: "118", // 播放器高度
        sources: [
          {
            type: "rtmp/mp4", // 视频流协议，如果是hls，需要后端开启跨域
            // 内测地址
            src: "rtmp://live.hkstv.hk.lxdns.com/live/hks"
          }
        ],
        techOrder: ["flash"],
        autoplay: true, // 自动播放
        controls: true // 编辑器控件
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        console.log('open');
      }
    }
  },
  mounted() {

  },
  methods: {
    getList() {

    },
    // 点击行事件
    clickRowHandle(row, column, event) {
      if (this.expands.includes(row.id)) {
        this.expands = this.expands.filter(val => val !== row.id);
      } else {
        this.expands = [];
        this.expands.push(row.id);
      }
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.map-warning-detail{
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 24px 20px 12px;
  .block-list{
    padding-bottom: 16px;
    >li{
      cursor: default;
      width: 76px;
      height: 76px;
      border: 1px solid rgba(112, 112, 112, 0.15);
      border-radius: 6px;
      margin-right: 30px;
      .text{
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3D4050;
      }
      .count{
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 30px;
        color: #3D4050;
      }
    }
  }

  .table-images-list{
    background: #EFF4F7;
    padding: 22px 0 22px 12px;
    >li{
      width: 186px;
      height: 118px;
      background: #FFFFFF;
      border: 1px solid #707070;
      opacity: 1;
      border-radius: 4px;
      margin-right: 12px;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss">
.map-warning-detail-dialog{
  .el-drawer__header{
    padding: 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #E4ECF4;
  }
  // 表格样式
  .el-table .el-table__header-wrapper th,
  .el-table .el-table__fixed-header-wrapper th,
  .el-table--striped .el-table__body tr.el-table__row--striped td{
    background: #F8FCFF !important;
  }
  .el-table td, .el-table th.is-leaf{
    border-bottom: 1px solid #E4ECF4;
  }
  .el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th{
    color: #3D4050;
  }
  .el-table td{
    color: #3D4050;
  }
  .el-table__expand-icon{
    display: none;
  }
  .el-table__expanded-cell{
    padding: 0;
  }
}
</style>
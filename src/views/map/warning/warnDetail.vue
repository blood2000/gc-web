<template>
  <!-- 地图告警明细 -->
  <div class="map-warning-detail">
    <div>
      <span class="mr20">报警类型：车道偏离</span>
      <span>报警等级：一级告警</span>
    </div>

    <el-table v-loading="loading" height="50%" highlight-current-row border :data="dataList">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="驾驶司机" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="报警时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时速(km/h)" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="报警位置" align="center" prop="name" :show-overflow-tooltip="true" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.start"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <el-row :gutter="10" class="image-list">
      <el-col :span="12">
        <div class="image-box">image1</div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">image2</div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">image3</div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">
          <video-player 
            class="vjs-custom-skin videoPlayer" 
            :playsinline="true"
            :options="playerOptions"
            width="100%"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { http_request } from '@/api';
export default {
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
      dataList: [],
      // 视频配置
      playerOptions: {
        height: "150", // 播放器高度
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
  mounted() {

  },
  methods: {
    getList() {

    }
  }
}
</script>

<style lang="scss" scoped>
.map-warning-detail{
  width: 500px;
  background: #fff;
  padding: 10px;
  .image-list{
    margin-top: 10px;
  }
  .image-box{
    height: 150px;
    background: #ccc;
    margin-bottom: 10px;
  }
}
</style>
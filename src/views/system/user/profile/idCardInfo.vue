<!-- 身份信息组件 -->
<template>
  <div class="info-box" v-loading="loading">
    <div class="img-title">
      <div>身份证人像面</div>
      <div>身份证国徽面</div>
    </div>
    <div class="img-box">
      <div class="img face-img">
        <img
          v-if="idCardInfo.identificationImage"
          :src="idCardInfo.identificationImage"
          alt=""
        />
      </div>
      <div class="img emblem-img">
        <img
          v-if="idCardInfo.identificationBackImage"
          :src="idCardInfo.identificationBackImage"
          alt=""
        />
      </div>
    </div>
    <!--  -->
    <el-form ref="form" :model="idCardInfo" label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="idCardInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="idCardInfo.identificationNumber" disabled></el-input>
      </el-form-item>
      <el-form-item label="有效期">
        <div class="date-box">
          <el-input
            v-model="idCardInfo.identificationBeginTime"
            disabled
          ></el-input>
          <span class="date-link">-</span>
          <el-input
            v-model="idCardInfo.identificationEndTime"
            disabled
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { http_request } from "../../../../api";
export default {
  data() {
    return {
      idCardInfo: {},
      loading: false,
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getIdentityAuth();
  },

  methods: {
    //获取车队长信息
    getIdentityAuth() {
      this.loading = true;
      const obj = {
        moduleName: "http_login",
        method: "get",
        url_alias: "getTeamInfo",
      };
      http_request(obj)
        .then((res) => {
          console.log("车队长信息", res);
          this.loading = false;
          // this.teamInfo.companyName = res.data.orgName || "";
          this.idCardInfo = res.data.identificationInf;
          console.log(this.idCardInfo);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang='scss' scoped>
.info-box {
  padding: 10px;
  width: 520px;
}

.img-box,
.img-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.img-title {
  margin-bottom: 10px;
  > div {
    width: 48%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    font-weight: bold;
  }
}

.img {
  width: 48%;
  height: 130px;
  border-radius: 8px;
  background: #f5f5f5;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}

.date-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date-link {
    padding: 0 10px;
  }
}

// .face-img {
//   background: url("../../../../assets/images/login/face.png") no-repeat center;
//   background-size: contain;
// }

// .emblem-img {
//   background: url("../../../../assets/images/login/back.png") no-repeat center;
//   background-size: contain;
// }
</style>
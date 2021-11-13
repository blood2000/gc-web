<template>
  <el-form
    class="center-form"
    ref="form"
    :model="teamInfo"
    :rules="rules"
    label-width="0"
    v-loading="loading"
  >
    <div class="area-title">公司名称</div>
    <el-form-item prop="companyName">
      <el-input
        v-model="teamInfo.companyName"
        placeholder="请输入公司名称"
        type="text"
        :disabled="!canEdit"
      />
    </el-form-item>
    <div class="area-title">所在地区</div>
    <div class="area-box">
      <el-form-item prop="provinceCode">
        <el-select
          v-model="teamInfo.provinceCode"
          clearable
          filterable
          style="width: 96%"
          placeholder="请选择省份"
          :disabled="!canEdit"
          @change="provinceChange($event)"
        >
          <el-option
            v-for="(name, code) in companyAddr.provinceList"
            :key="code"
            :label="name"
            :value="code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="cityCode">
        <el-select
          v-model="teamInfo.cityCode"
          clearable
          filterable
          style="width: 96%"
          placeholder="请选择市"
          :disabled="!canEdit"
          @change="cityChange($event)"
        >
          <el-option
            v-for="(name, code) in companyAddr.cityList"
            :key="code"
            :label="name"
            :value="code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="areaCode">
        <el-select
          v-model="teamInfo.areaCode"
          clearable
          filterable
          style="width: 100%"
          placeholder="请选择区县"
          :disabled="!canEdit"
          @change="areaChange($event)"
        >
          <el-option
            v-for="(name, code) in companyAddr.areaList"
            :key="code"
            :label="name"
            :value="code"
          />
        </el-select>
      </el-form-item>
    </div>
    <el-form-item v-if="canEdit">
      <el-button type="primary" size="mini" @click="submit">更新信息</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import { http_request } from "../../../../api";
import regionData from "@/assets/json/city.json";
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      teamInfo: {
        companyName: "",
        provinceCode: null,
        province: "",
        cityCode: null,
        city: "",
        areaCode: null,
        area: "",
      },
      canEdit: false,
      companyAddr: {
        provinceList: {},
        cityList: {},
        areaList: {},
      },
      loading: false,
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    team: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    // this.teamInfo.companyName = this.team.companyName;
    this.canEdit = this.team.teamLeader === this.team.code;
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
          this.teamInfo.companyName = res.data.orgName || this.team.companyName;
          let idCardInfo = res.data.identificationInf;
          this.teamInfo.idCardFaceImageUrl = idCardInfo.identificationImage;
          this.teamInfo.idCardNationalEmblemImageUrl =
            idCardInfo.identificationBackImage;
          this.teamInfo.name = idCardInfo.name;
          this.teamInfo.validFrom = idCardInfo.identificationBeginTime;
          this.teamInfo.validTo = idCardInfo.identificationEndTime;
          this.teamInfo.number = idCardInfo.identificationNumber;
          this.teamInfo.province = res.data.province || "";
          this.teamInfo.city = res.data.city || "";
          this.teamInfo.area = res.data.area || "";
          this.getCityOptions();
          // this.teamInfo.dateRange = [];
          // this.teamInfo.dateRange[0] = idCardInfo.identificationBeginTime;
          // this.teamInfo.dateRange[1] = idCardInfo.identificationEndTime;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //匹配省市区
    getCityOptions() {
      this.companyAddr.provinceList = regionData["0"];
      for (let key in regionData["0"]) {
        if (regionData["0"][key] === this.teamInfo.province) {
          console.log(key);
          this.teamInfo.provinceCode = key;
          let provinceKey = `0,${key}`;
          this.companyAddr.cityList = regionData[provinceKey];
          // this.teamInfo.province = regionData['0'][e];
          for (let cityKey in this.companyAddr.cityList) {
            if (this.companyAddr.cityList[cityKey] === this.teamInfo.city) {
              this.teamInfo.cityCode = cityKey;
              let cKey = `0,${this.teamInfo.provinceCode},${cityKey}`;
              this.companyAddr.areaList = regionData[cKey];
            }
            for (let areaKey in this.companyAddr.areaList) {
              if (this.companyAddr.areaList[areaKey] === this.teamInfo.area) {
                this.teamInfo.areaCode = areaKey;
              }
            }
          }
        }
      }
    },

    provinceChange(e) {
      let cityKey = `0,${e}`;
      this.companyAddr.cityList = null;
      this.teamInfo.cityCode = "";
      this.companyAddr.areaList = null;
      this.teamInfo.areaCode = "";
      this.companyAddr.cityList = regionData[cityKey];
      this.teamInfo.province = regionData["0"][e];
    },

    cityChange(e) {
      let provinceCode = this.teamInfo.provinceCode;
      let areaKey = `0,${provinceCode},${e}`;
      console.log(areaKey);
      this.companyAddr.areaList = null;
      this.teamInfo.areaCode = "";
      this.companyAddr.areaList = regionData[areaKey];
      this.teamInfo.city = this.companyAddr.cityList[e];
    },

    areaChange(e) {
      this.teamInfo.areaCode = e;
      this.teamInfo.area = this.companyAddr.areaList[e];
    },

    submit() {
      if (!this.teamInfo.companyName) {
        this.$message.error("请输入企业或车队全称");
        return;
      }
      if (!this.teamInfo.province) {
        this.$message.error("请选择省份");
        return;
      }
      if (!this.teamInfo.city) {
        this.$message.error("请选择市");
        return;
      }
      if (!this.teamInfo.area) {
        this.$message.error("请选择区县");
        return;
      }
      let data = {
        orgName: this.teamInfo.companyName,
        identificationInf: {
          identificationBeginTime: this.teamInfo.validFrom,
          identificationEndTime: this.teamInfo.validTo,
          name: this.teamInfo.name,
          identificationImage: this.teamInfo.idCardFaceImageUrl,
          identificationBackImage: this.teamInfo.idCardNationalEmblemImageUrl,
          identificationNumber: this.teamInfo.number,
        },
        province: this.teamInfo.province,
        city: this.teamInfo.city,
        area: this.teamInfo.area,
      };
      // console.log(data, this.teamInfo);
      this.loading = true;
      const obj = {
        moduleName: "http_login",
        method: "put",
        url_alias: "updateTeamInfo",
        data: data,
        // Headers: { isToken: false },
      };
      http_request(obj).then((res) => {
        console.log("更新车队信息", res);
        this.loading = false;
        this.$alert("更新成功", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            //TODO...
          },
        });
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    },
  },
};
</script>
<style lang="scss" scoped>
.center-form {
  width: 480px;
}

.area-title {
  width: 80px;
  padding: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  // text-align: right;
}

.area-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <el-form ref="form" :model="user" :rules="rules">
    <div class="input-label">邮箱</div>
    <el-form-item prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>

    <div class="input-label">国家地区</div>
    <el-form-item prop="country">
      <el-select v-model="user.country" placeholder="请选择">
        <el-option
          v-for="item in country"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <province-city-county
        ref="ChooseArea"
        
        :prop-province-code="user.province"
        :prop-city-code="user.city"
        @refresh="
          (data) => {
            user.province = data.provinceCode;
            user.city = data.cityCode;
          }
        "
      />
    <!-- <div class="input-label">所在省市</div>
    <div class="profile-area-box">
      <el-form-item :label="labelName" prop="provinceCode">
        <el-select
          v-model="user.provinceCode"
          clearable
          filterable
          class="input-width"
          placeholder="请选择省"
          @change="changeProvince"
        >
          <el-option
            v-for="dict in provinceCodeOptions"
            :key="dict.provinceCode"
            :label="dict.provinceName"
            :value="dict.provinceCode"
          />
        </el-select>
      </el-form-item>
    </div> -->

    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";
import { http_request } from "../../../../api";
import ProvinceCityCounty from "@/components/ProvinceCityCounty";
export default {
  components: { ProvinceCityCounty },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      country: [{ label: "中国", value: "China" }],

      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典翻译
      cityCodeOptions: [],
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateUserProfile(this.user).then((response) => {
            this.msgSuccess("修改成功");
          });
        }
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
.input-label {
  padding: 10px 0;
}

.el-input {
  width: 500px;
}
</style>

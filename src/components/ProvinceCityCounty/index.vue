<template>
  <el-form
    ref="form"
    :model="form"
    :rules="required ? rules : {}"
    :label-width="labelWidth"
    label-position="top"
  >
    <el-row class="component-change-area">
      <el-col :span="12">
        <el-form-item :label="labelName" prop="provinceCode">
          <el-select
            v-model="form.provinceCode"
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
      </el-col>
      <el-col :span="12">
        <div class="full"></div>
        <el-form-item class="no-label" prop="cityCode">
          <el-select
            v-model="form.cityCode"
            clearable
            filterable
            class="input-width"
            placeholder="请选择市"
            @change="changeCity"
          >
            <el-option
              v-for="dict in cityCodeOptions"
              :key="dict.cityCode"
              :label="dict.cityName"
              :value="dict.cityCode"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
/*
  使用示例:
    <province-city-county
      ref="ChooseArea"
      :label-name="'所在地区'"
      :label-width="'140px'"
      :visible="visible"
      :required="true"
      :disabled="false"
      :prop-province-code="form.provinceCode"
      :prop-city-code="form.cityCode"
      :prop-county-code="form.countyCode"
      @refresh="(data) => {
        form.provinceCode = data.provinceCode;
        form.cityCode = data.cityCode;
        form.countyCode = data.countyCode;
      }"
    />

  表单验证：this.$refs.ChooseArea.submit();

*/
import { http_request } from "../../api";
export default {
  props: {
    labelName: {
      type: String,
      default: "所在地区",
    },
    labelWidth: {
      type: String,
      default: "140px",
    },
   
    required: {
      type: Boolean,
      default: true,
    },
    propProvinceCode: {
      type: String,
      default: null,
    },
    propCityCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        provinceCode: this.propProvinceCode,
        cityCode: this.propCityCode,
      },
      // 表单校验
      rules: {
        provinceCode: [
          { required: true, trigger: "change", message: "请选择省" },
        ],
        cityCode: [{ required: true, trigger: "change", message: "请选择市" }],
      },
      // 省编码字典
      provinceCodeOptions: [],
      // 市编码字典翻译
      cityCodeOptions: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.reset();
        this.setForm();
      }
    },
  },
  created() {
    this.reset();
    this.setForm();
    this.getProvinceList();
  },
  methods: {
    //获取省
    getProvinceList() {
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "provinceList",
      };
      http_request(obj).then((res) => {
        console.log("获取省", res);
        this.provinceCodeOptions = res.data;
      });
    },
    // 选中省
    changeProvince(code) {
      this.form.cityCode = null;
      this.cityCodeOptions = [];
      this.getCityListFun(code);
      this.$emit("refresh", this.form);
    },
    // 选中市
    changeCity(code) {
      this.$emit("refresh", this.form);
    },

    // 获取市
    getCityListFun(code) {
      if (code == null || code === "") {
        return;
      }
      const obj = {
        moduleName: "http_purse",
        method: "get",
        url_alias: "cityList",
        data: { provinceCode: code },
      };
      http_request(obj).then((res) => {
        console.log("获取市", res);
        this.cityCodeOptions = res.data;
      });
    },

    // 重置表单
    reset() {
      this.form = {
        provinceCode: null,
        cityCode: null,
      };
      this.resetForm("form");
      this.cityCodeOptions = [];
    },
    // 表单赋值
    setForm() {
      this.form = {
        provinceCode: this.propProvinceCode,
        cityCode: this.propCityCode,
      };
      // 市
      this.getCityListFun(this.form.provinceCode);
    },
    submit() {
      let flag;
      this.$refs["form"].validate((valid) => {
        flag = valid;
      });
      return flag;
    },
  },
};
</script>

<style lang="scss" scoped>
.component-change-area {
  margin-right: -8px;
}
.input-width {
  width: 97%;
}
.full{
  height: 36px;
}
.no-label {
  .el-form-item__label {
    width: 0;
  }
  ::v-deep.el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>

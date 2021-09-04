<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
    :destroy-on-close="true"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="org">
            <treeselect
              v-model="form.org"
              :options="deptOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择所属组织"
              @select="selectOrgCode"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              clearable
            />
            <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 图片上传类 -->
      <el-row>
        <el-col :span="8">
          <el-form-item ref="identificationImageRef" prop="identificationImage">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证正面照:
            </p>
            <ImageUploadSimple
              v-model="form.identificationImage"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="identificationBackImageRef"
            label=""
            prop="identificationBackImage"
          >
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证背面照:
            </p>
            <ImageUploadSimple
              v-model="form.identificationBackImage"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="司机姓名">
            <el-input
              v-model="form.name"
              placeholder="请输入司机姓名"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="telphone">
            <el-input
              v-model="form.telphone"
              placeholder=" 请输入手机号码"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span style="color: red">*</span>
          <el-form-item
            style="display: inline-block"
            label="身份证号"
            prop="identificationNumber"
          >
            <el-input
              v-model="form.identificationNumber"
              placeholder="支持自动识别"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="身份证有效期:" prop="idDateRange">
            <el-date-picker
              v-model="form.idDateRange"
              unlink-panels
              :picker-options="pickerOptions"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="支持自动识别"
              end-placeholder="支持自动识别"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="identificationEffective">
            <el-checkbox v-model="form.identificationEffective"
              >是否长期有效</el-checkbox
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="driverLicenseImage">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              驾驶证:
            </p>
            <ImageUploadSimple
              v-model="form.driverLicenseImage"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="驾驶证有效期:" prop="driverDateRange">
            <el-date-picker
              v-model="form.driverDateRange"
              unlink-panels
              :picker-options="pickerOptions"
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="支持自动识别"
              end-placeholder="支持自动识别"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="validPeriodAlways">
            <el-checkbox v-model="form.validPeriodAlways"
              >是否长期有效</el-checkbox
            >
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="发证机关:" prop="issuingOrganizations">
            <el-input
              v-model="form.issuingOrganizations"
              placeholder="支持自动识别"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-remarks">
        <span>备注:</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.remarks"
        >
        </el-input>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUploadSimple from "@/components/ImageUpload/simple.vue";
import { http_request } from "../../../../api";
import { pickerOptions } from "@/utils/dateRange";

export default {
  name: "vehicleDialog",
  components: { ImageUploadSimple },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: {},
    },
    orgList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      pickerOptions,
      form: {
        org: "", //所属组织
        password: "", //用户密码
        identificationImage: "", //身份证正面
        identificationBackImage: "", //身份证背面照
        name: "", //司机姓名
        telphone: "", //手机号码
        identificationNumber: "", //身份证号
        idDateRange: [], //身份证有效期
        identificationEffective: "",
        driverLicenseImage: "", //驾驶证
        driverDateRange: [], //驾驶证有效期
        validPeriodAlways: "", // 是否长期有效
        issuingOrganizations: "", //发证机关
        remarks: "", //备注
      },
      rules: {
        org: [
          {
            required: true,
            message: "所属组织不能为空",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: this.formValidate.password, trigger: "blur" },
        ],
        identificationImage: [
          { required: true, message: "请上传身份证正面照", trigger: "change" },
        ],
        identificationBackImage: [
          { required: true, message: "请上传身份证背面照", trigger: "change" },
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { validator: this.formValidate.name, trigger: "blur" },
        ],
        telphone: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { validator: this.formValidate.telphone, trigger: "blur" },
        ],
        identificationNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          { validator: this.formValidate.idCard, trigger: "blur" },
        ],
        driverLicenseImage: [
          { required: true, message: "请上传驾驶证照", trigger: "change" },
        ],
      },
      // 初始密码
      initialPassword: "abcd1234@",
      // 部门树选项
      deptOptions: [],
      // 部门树键值转换
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.orgName,
          children: node.childrenOrgList,
        };
      },
    };
  },
  created() {
    //   this.vehicleTypeCodeList =
  },
  watch: {
    options() {
      console.log("this.options", this.options);
      if (this.open) return;
      if (
        this.options.editType == "update" ||
        this.options.editType == "detail"
      ) {
        this.requsetDetail();
      }
    },
  },
  mounted() {
    this.getTree();
  },
  methods: {
    /** 获取组织树 */
    getTree() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      http_request(obj).then((res) => {
        this.deptOptions = res.data;
      });
    },
    requsetDetail() {
      const tmp = {
        moduleName: "http_driver",
        method: "get",
        url_alias: "driver_detail",
        url_code: [this.options.code],
      };
      console.log("tmp", tmp);
      http_request(tmp)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    async submitForm() {
      console.log("queren");
      this.$emit("colseDialog");
    },
    cancel() {
      this.$emit("colseDialog");
    },
    chooseImg(e) {
      console.log("chooseImg", chooseImg);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item__label {
  width: 120px !important;
}
.form-remarks {
  display: flex;
}
.form-remarks span {
  display: inline-block;
  width: 58px;
}
.upload-image-label {
  margin: 0;
  line-height: 24px;
}
</style>
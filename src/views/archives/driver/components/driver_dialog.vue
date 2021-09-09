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
      :disabled="isDetail"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="orgCode">
            <treeselect
              v-model="form.orgCode"
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
              :disabled="form.identificationEffective"
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
              @input="driverChooseImg"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="驾驶证有效期:" prop="driverDateRange">
            <el-date-picker
              :disabled="form.validPeriodAlways"
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
      <div class="form-remark">
        <span>备注:</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.remark"
        >
        </el-input>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUploadSimple from "@/components/ImageUpload/simple.vue";
import { http_request } from "../../../../api";
import { pickerOptions } from "@/utils/dateRange";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "vehicleDialog",
  components: { ImageUploadSimple, Treeselect },
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
      loading:false,
      pickerOptions,
      form: {
        orgCode: null, //所属组织
        password: null, //用户密码
        identificationImage: null, //身份证正面
        identificationBackImage: null, //身份证背面照
        name: null, //司机姓名
        telphone: null, //手机号码
        identificationNumber: null, //身份证号
        idDateRange: [], //身份证有效期
        identificationEffective: null, //身份证是否长期有效（0否,1是）
        driverLicenseImage: null, //驾驶证
        driverDateRange: [], //驾驶证有效期
        validPeriodAlways: null, // 是否长期有效
        issuingOrganizations: null, //发证机关
        driverLicense: null, //驾驶证号
        remark: null, //备注
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
      isDetail: false,
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
  watch: {
    options() {
      if (
        (this.options.editType == "update" ||
          this.options.editType == "detail") &&
        this.open
      ) {
        console.log("this.options", this.options, this.open);
        //请求
        this.requsetDetail();
        this.options.editType == "detail"
          ? (this.isDetail = true)
          : (this.isDetail = false);
      }
    },
  },
  created() {},
  watch: {
    options() {
      console.log("this.options", this.options);
      if (!this.open) return;
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
    //请求详情
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
          console.log("driver_detail res", res);
          this.detailToForm(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    //提交
    async submitForm() {
      const me = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (me.options.editType == "update") {
            const obj = {
              moduleName: "http_driver",
              method: "put",
              url_alias: "driver_edit",
              data: me.FormToUpdate(),
            };
            console.log('obj',obj)
            http_request(obj).then((updateRes) => {
              console.log("updateRes", updateRes);
              this.$emit("colseDialog", "ok");
              this.loading = false;
            });
          } else {
            console.log("添加请求");
            const obj = {
              moduleName: "http_driver",
              method: "post",
              url_alias: "driver_add",
              data: me.FormToAdd(),
            };
            http_request(obj).then((addRes) => {
              console.log("addRes", addRes);
              this.$emit("colseDialog", "ok");
              this.loading = false;
            });
          }
        }
      });
    },
    // 手动刷新校验
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField("orgCode");
      });
    },
    //关闭
    cancel() {
      this.reset();
      this.$emit("colseDialog", "no");
    },
    reset(orgCode = null) {
      this.form = {
        orgCode: orgCode, //所属组织
        password: null, //用户密码
        identificationImage: null, //身份证正面
        identificationBackImage: null, //身份证背面照
        name: null, //司机姓名
        telphone: null, //手机号码
        identificationNumber: null, //身份证号
        idDateRange: [], //身份证有效期
        identificationEffective: null,
        driverLicenseImage: null, //驾驶证
        driverDateRange: [], //驾驶证有效期
        validPeriodAlways: null, // 是否长期有效
        issuingOrganizations: null, //发证机关
        remark: null, //备注
      };
      this.resetForm("form");
    },
    //身份证正面照/身份证反面照 上传结束后回调
    chooseImg(e) {
      console.log("chooseImg", e);
      this.ocrHttp(e, 0);
    },
    //驾驶证照 上传结束后回调
    driverChooseImg(e) {
      console.log("driverChooseImg", e);
      this.ocrHttp(e, 2);
    },
    //ocr请求
    async ocrHttp(imgPath, type) {
      const obj = {
        moduleName: "http_common",
        method: "post",
        url_alias: "ocr",
        data: {
          imgPath,
          type,
        },
      };
      const res = await http_request(obj);
      console.log("ocr请求", res);
      this.ocrDataToForm(res.data.result, type);
    },
    //ocr数据渲染页面
    ocrDataToForm(data, type) {
      const me = this;
      const tmp = {
        0: () => {
          //身份证
          if (data.number) me.form.identificationNumber = data.number;
          if (data.name) me.form.name = data.name;
          if (data.valid_from && data.valid_to) {
            console.log("ocrDataToForm");
            me.form.idDateRange = [data.valid_from, data.valid_to];
          }
        },
        2: () => {
          console.log("ocrDataToForm 2");
          if (data.issuing_authority)
            me.form.issuingOrganizations = data.issuing_authority;
          me.form.driverDateRange = [data.valid_from, data.valid_to];
        },
      };
      tmp[type]();
    },
    //详情渲染页面
    detailToForm(data) {
      this.form = {
        orgCode: data.orgCode, //所属组织
        password: data.password, //用户密码
        identificationImage: data.identificationInf.identificationImage, //身份证正面
        identificationBackImage: data.identificationInf.identificationBackImage, //身份证背面照
        name: data.identificationInf.name, //司机姓名
        telphone: data.telphone, //手机号码
        identificationNumber: data.identificationInf.identificationNumber, //身份证号
        idDateRange: [
          data.identificationInf.identificationBeginTime || "",
          data.identificationInf.identificationEndTime || "",
        ], //身份证有效期
        identificationEffective: data.identificationInf.identificationEffective =="1"?true:false,
        driverLicenseImage: data.driverLicenseInf.driverLicenseImage, //驾驶证
        driverDateRange: [
          data.driverLicenseInf.validPeriodTo || "",
          data.driverLicenseInf.validPeriodFrom || "",
        ], //驾驶证有效期
        driverLicense:data.driverLicenseInf.driverLicense,
        validPeriodAlways: data.driverLicenseInf.validPeriodAlways =="1"?true:false, // 是否长期有效
        issuingOrganizations: data.driverLicenseInf.issuingOrganizations, //发证机关
        remark: data.remark, //备注
      };
    },
    FormToUpdate() {
      const form = this.form;
      const obj = {
        telphone: form.telphone,
        // userCode: form.userCode, //????用户编码
        code: this.options.code, //司机编码
        password: form.password, //用户密码
        orgCode: form.orgCode, //归属组织
        // name: form.name, //司机姓名
        remark: form.remark, //备注
        driverLicenseInf: {
          validPeriodFrom: form.driverDateRange[0], //驾驶证有效期自
          driverLicense: form.driverLicense, //?????  驾驶证号
          // driverLicenseType:form.,   //驾驶证类型	???
          issuingOrganizations: form.issuingOrganizations, //驾驶证发证机关
          validPeriodTo: form.driverDateRange[1], //驾驶证有效期至
          driverLicenseImage: form.driverLicenseImage, //驾驶证照
          validPeriodAlways: form.validPeriodAlways?"1":"0", //驾驶证是否长期有效
        },
        identificationInf: {
          identificationImage: form.identificationImage, //身份证正面照
          identificationEndTime: form.idDateRange[1], //身份证有效期结束
          name: form.name, //名字???
          identificationBeginTime: form.idDateRange[0], //身份证有效期开始
          identificationBackImage: form.identificationBackImage, //身份证反面照
          identificationNumber: form.identificationNumber, //身份证号
          identificationEffective: form.identificationEffective?"1":"0", //身份证是否长期有效（0否,1是）
        },
      };
      return obj;
    },
    FormToAdd() {
      const form = this.form;
      const obj = {
        driverLicenseInf: {
          driverLicense: form.identificationNumber,
          driverLicenseImage: form.driverLicenseImage,
          validPeriodTo: form.driverDateRange[1] || null,
          issuingOrganizations: form.issuingOrganizations,
          validPeriodFrom: form.driverDateRange[0] || null,
          validPeriodAlways: form.validPeriodAlways?"1":"0" ,
        },
        identificationInf: {
          name: form.name,
          identificationEndTime: form.idDateRange[1] || null,
          identificationBeginTime: form.idDateRange[0] || null,
          identificationBackImage: form.identificationBackImage,
          identificationImage: form.identificationImage,
          identificationNumber: form.identificationNumber,
          identificationEffective: form.identificationEffective ?"1":"0",
        },
        telphone: form.telphone,
        password: form.password, //用户密码
        orgCode: form.orgCode, //归属组织
        remark: form.remark, //备注
      };
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item__label {
  width: 120px !important;
}
.form-remark {
  display: flex;
}
.form-remark span {
  display: inline-block;
  width: 58px;
}
.upload-image-label {
  margin: 0;
  line-height: 24px;
}
</style>
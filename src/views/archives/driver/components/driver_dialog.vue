<template>
  <el-dialog
    :visible.sync="open"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
    :destroy-on-close="true"
  >
    <template slot="title">
      <span class="dialog-header-title">{{ title }}</span>
      <el-tag
        v-if="
          open && options && options.editType != 'add' && form.authStatusValue
        "
        :type="selectTipColor()"
        >{{ selectTipText() }}</el-tag
      >
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      size="small"
      :disabled="isDisabled()"
      label-position="top"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属组织" prop="orgCode">
            <treeselect
              v-model="form.orgCode"
              :options="deptOptions"
              :disabled="isDetail"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择所属组织"
              no-results-text="无匹配数据"
              @select="selectOrgCode"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              clearable
            />
            <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- 图片上传类 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            ref="identificationImageRef"
            label="身份证人像面:"
            prop="identificationImage"
          >
            <!-- <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证正面照:
            </p> -->
            <ImageUploadSimple
              v-model="form.identificationImage"
              @input="chooseImg"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-id_front">
                  <img
                    src="../../../../assets/images/certificate/photograph.png"
                    alt=""
                  />
                </div>
              </template>
            </ImageUploadSimple>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            ref="identificationBackImageRef"
            label=" 身份证国徽面:"
            prop="identificationBackImage"
          >
            <!-- <p class="upload-image-label">
              <span class="g-color-require">* </span>
              身份证背面照:
            </p> -->
            <ImageUploadSimple
              v-model="form.identificationBackImage"
              @input="chooseImgBack"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-id_back">
                  <img
                    src="../../../../assets/images/certificate/photograph.png"
                    alt=""
                  />
                </div>
              </template>
            </ImageUploadSimple>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item prop="name" label="司机姓名">
            <el-input
              v-model="form.name"
              placeholder="请输入司机姓名"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="telphone">
            <el-input
              v-model="form.telphone"
              placeholder=" 请输入手机号码"
              clearable
              :disabled="telDisabled()"
              @blur="changeBlurTel"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <span style="color: red">*</span> -->
          <el-form-item
            style="display: inline-block"
            label="身份证号"
            prop="identificationNumber"
          >
            <el-input
              v-model="form.identificationNumber"
              placeholder="支持自动识别"
              clearable
              @blur="changeBlurId"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row> </el-row>
      <el-row>
        <el-col :span="16" v-if="isIdDateValid">
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
        <el-col :span="10" v-if="!isIdDateValid">
          <!-- <el-date-picker
            v-model="form.idDateRange[0]"
            align="right"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker> -->
          <el-date-picker
            popper-class="idcard-date"
            v-model="form.idDateRange[0]"
            type="date"
            align="right"
            placeholder="有效起始日期"
            value-format="yyyy-MM-dd"
          >
            <svg-icon
              slot="prefix"
              icon-class="date"
              class="el-input__icon input-icon"
            />
          </el-date-picker>
        </el-col>
        <el-col :span="6" v-if="!isIdDateValid">
          <el-input v-model="form.idDateRange[1]" disabled />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label=" 驾驶证:" prop="driverLicenseImage">
            <!-- <p class="upload-image-label">
              <span class="g-color-require">* </span>
             
            </p> -->
            <ImageUploadSimple
              v-model="form.driverLicenseImage"
              @input="driverChooseImg"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-driving_front">
                  <img
                    src="../../../../assets/images/certificate/photograph.png"
                    alt=""
                  />
                </div>
              </template>
            </ImageUploadSimple>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- driverLicense -->
      <el-row>
        <el-col :span="10">
          <el-form-item label="驾驶证号:" prop="driverLicense">
            <el-input
              v-model="form.driverLicense"
              placeholder="支持自动识别"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="18" v-if="isDriverDateValid">
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
        <el-col :span="18" v-if="!isDriverDateValid">
          <el-form-item label="驾驶证有效期:" prop="driverDateRange">
            <el-col :span="10" >
              <el-date-picker
                v-model="form.driverDateRange[0]"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-col>
            <el-col :span="10">
              <el-input v-model="form.driverDateRange[1]" disabled />
            </el-col>
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
      <el-row class="form-remark">
        <!-- <span>备注:</span> -->
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="form.remark"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading"
        >确 定</el-button
      >
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
import formValidate from "../../../../utils/formValidate";

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
      loading: false,
      pickerOptions,
      isDriverDateValid: true,
      isIdDateValid: true,
      oldIdentificationNumber: "",
      oldTelphone: "",
      form: {
        orgCode: null, //所属组织
        // password: null, //用户密码
        identificationImage: null, //身份证正面
        identificationBackImage: null, //身份证背面照
        name: null, //司机姓名
        telphone: null, //手机号码
        identificationNumber: null, //身份证号
        idDateRange: [], //身份证有效期
        driverLicenseImage: null, //驾驶证
        driverDateRange: [], //驾驶证有效期
        issuingOrganizations: null, //发证机关
        driverLicense: null, //驾驶证号
        remark: null, //备注
        authInf: null,
        authStatus: null,
        authStatusValue: null,
      },
      rules: {
        org: [
          {
            required: true,
            message: "所属组织不能为空",
            trigger: ["change", "blur"],
          },
        ],
        // password: [
        //   { required: true, message: "密码不能为空", trigger: "blur" },
        //   { validator: formValidate.password, trigger: "blur" },
        // ],
        identificationImage: [
          { required: true, message: "请上传身份证正面照", trigger: "change" },
        ],
        identificationBackImage: [
          { required: true, message: "请上传身份证背面照", trigger: "change" },
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { validator: formValidate.name, trigger: "blur" },
        ],
        driverLicense: [
          { required: true, message: "驾驶证号不能为空", trigger: "blur" },
        ],
        telphone: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { validator: formValidate.telphone, trigger: "blur" },
        ],
        identificationNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          { validator: formValidate.idCard, trigger: "blur" },
        ],
        driverLicenseImage: [
          { required: true, message: "请上传驾驶证照", trigger: "change" },
        ],
      },
      // 初始密码
      // initialPassword: "abcd1234@",
      // 部门树选项
      deptOptions: [],
      isDetail: false,
      // 部门树键值转换
      normalizer(node) {
        if (node.children == null || node.children == "null") {
          delete node.children;
        }
        const obj = {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.orgName,
          // children: node.childrenOrgList,
        };
        if (node.childrenOrgList && node.childrenOrgList.length > 0) {
          obj.children = node.childrenOrgList;
        }
        return obj;
      },
    };
  },
  watch: {
    open() {
      console.log(" this.options.editType", this.options.editType);
      if (!this.open) return;
      if (
        this.options.editType == "update" ||
        this.options.editType == "detail"
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
  mounted() {
    this.getTree();
  },
  methods: {
    selectTipColor() {
      const objColor = {
        0: "info",
        1: "info",
        2: "danger",
        3: "success",
      };
      return objColor[this.form.authStatus];
    },
    selectTipText() {
      return `${this.form.authStatusValue}:${this.form.authInf}`;
    },
    //日期校验
    dateChange(e) {
      console.log("日期哦", e);
    },
    telDisabled() {
      if (this.isDetail) return true;
      if (this.options && this.options.editType == "update") return true;
      return false;
    },
    isDisabled() {
      let result = false;
      if (this.isDetail) result = true;
      if (this.options && this.options.editType == "update") {
        if (this.form.authStatus == 3) result = true;
      }
      return result;
    },
    changeBlurTel(e) {
      if (
        this.options.editType == "update" &&
        this.oldTelphone != this.form.telphone
      ) {
        this.checkIdOrphone("0", this.form.telphone);
        this.oldTelphone = this.form.telphone;
      }
      if (this.options.editType != "update")
        this.checkIdOrphone("0", this.form.telphone);
    },
    changeBlurId(e) {
      console.log("changeBlurId", this.oldIdentificationNumber);
      if (
        this.options.editType == "update" &&
        this.oldIdentificationNumber != this.form.identificationNumber
      ) {
        this.checkIdOrphone("1", this.form.identificationNumber);
        this.oldIdentificationNumber = this.form.identificationNumber;
      }
      if (this.options.editType != "update")
        this.checkIdOrphone("1", this.form.identificationNumber);
    },
    //校验
    async checkIdOrphone(type, value) {
      if (!value) return;
      const me = this;
      const obj = {
        moduleName: "http_driver",
        method: "get",
        url_alias: "driver_check",
        data: { type, value },
      };
      const res = await http_request(obj);
      console.log("司机校验", res);
      if (res.code != "200") return;
      const msgData = res.data;
      console.log("msgData", msgData);
      if (!msgData) return;
      if (msgData.type != "2") {
        console.log("0000000");
        me.$confirm(`${msgData.value}`, "系统提示", {
          confirmButtonText: "确认",
          showCancelButton: false,
          type: "warning",
        })
          .then(() => {
            // if (type == "0") {
            //   me.form.telphone = null;
            // } else {
            //   me.form.identificationNumber = null;
            // }
            this.reset();
          })
          .catch(() => {
            console.log("xxxxxxxxxxxx");
            this.reset();
          });
      } else {
        me.$confirm(`${msgData.value}`, "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const bindObj = {
              moduleName: "http_driver",
              method: "get",
              url_alias: "driver_bind",
              data: { value },
            };
            console.log("2222222", bindObj);

            http_request(bindObj).then((rsp) => {
              console.log("111111", rsp);
              me.reset();
              this.isDetail = false;

              me.$emit("colseDialog", "ok");
              me.msgSuccess("添加成功");
            });
          })
          .catch(() => {
            console.log("catch");
            if (type == "0") {
              me.form.telphone = null;
            } else {
              me.form.identificationNumber = null;
              // me.form.name = null;
              me.form.identificationImage = null;
            }
          });
      }
    },
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
            // userCode
            console.log("obj", obj);
            http_request(obj)
              .then((updateRes) => {
                console.log("updateRes", updateRes);
                this.$emit("colseDialog", "ok");
                this.loading = false;
              })
              .catch(() => {
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
            http_request(obj)
              .then((addRes) => {
                console.log("addRes", addRes);
                this.reset();
                this.$emit("colseDialog", "ok");
                this.loading = false;
              })
              .catch(() => {
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
      this.isDetail = false;
      this.isDriverDateValid = true;
      this.$emit("colseDialog", "no");
    },
    reset(orgCode = null) {
      this.form = {
        orgCode: orgCode, //所属组织
        // password: null, //用户密码
        identificationImage: null, //身份证正面
        identificationBackImage: null, //身份证背面照
        name: null, //司机姓名
        telphone: null, //手机号码
        identificationNumber: null, //身份证号
        idDateRange: [], //身份证有效期
        driverLicenseImage: null, //驾驶证
        driverDateRange: [], //驾驶证有效期
        issuingOrganizations: null, //发证机关
        remark: null, //备注
        authInf: null,
        authStatus: null,
        authStatusValue: null,
      };
      this.resetForm("form");
      this.isIdDateValid = true;
      this.oldIdentificationNumber = "";
      this.oldTelphone = "";
    },
    //身份证正面照/身份证反面照 上传结束后回调
    chooseImg(e) {
      console.log("chooseImg", e);
      this.ocrHttp(e, 0, "front");
    },
    chooseImgBack(e) {
      console.log("chooseImg", e);
      this.ocrHttp(e, 0, "back");
    },
    //驾驶证照 上传结束后回调
    driverChooseImg(e) {
      console.log("driverChooseImg", e);
      this.ocrHttp(e, 2);
    },
    //ocr请求
    async ocrHttp(imgPath, type, side) {
      const obj = {
        moduleName: "http_common",
        method: "post",
        url_alias: "ocr",
        data: {
          imgPath,
          type,
          side,
        },
      };
      if (type === 2) {
        obj.data.return_issuing_authority = true;
      }
      const res = await http_request(obj);
      console.log("ocr请求", res);
      if (res.data && res.data.error_msg) {
        const msgType = {
          0:'身份证',
          2:'驾驶证'
        }
        this.msgError(`该照片非${msgType[type]}类型，请重新上传`);
        if (type === 0) {
          if (side === "front") {
            this.identificationImage = null;
          } else {
            this.identificationBackImage = null;
          }
        } else {
          this.driverLicenseImage = null;
        }
        return;
      }
      this.ocrDataToForm(res.data.result, type);
    },
    // 身份证日期判定
    checkOcrForm(dates) {
      const reg = /^(\d{1,4})(-)(\d{1,2})\2(\d{1,2})$/;
      var r = dates.match(reg);
      if (r == null) {
        return false;
      }
      return true;
    },
    //ocr数据渲染页面
    ocrDataToForm(data, type) {
      console.log('ocr数据渲染页面',data, type)
      const me = this;
      const tmp = {
        0: () => {
          //身份证
          if (data.number) {
            me.form.identificationNumber = data.number;
            me.checkIdOrphone("1", data.number);
          }
          if (data.name) me.form.name = data.name;
          let formTime = data.valid_from;
          let toTime = data.valid_to;
          if (formTime && toTime) {
            console.log("ocrDataToForm data", data);
            if (toTime == "长期") {
              this.isIdDateValid = false;
            } else {
              this.isIdDateValid = true;
              const checkToValue = me.checkOcrForm(toTime);
              if (!checkToValue) {
                toTime = null;
              }
            }
            if (formTime) {
              const checkValue = me.checkOcrForm(formTime);
              if (!checkValue) {
                formTime = null;
              }
              // var reg = /^(\d{1,4})(-)(\d{1,2})\2(\d{1,2})$/;
              // var r = data.valid_from.match(reg);
              // console.log('对不对',r)
              // if (r == null) {
              //   formTime = null
              // }
            } else {
              formTime = null;
            }

            me.form.idDateRange = [formTime, toTime];
          }
        },
        2: () => {
          console.log("ocrDataToForm 2");
          me.form.driverLicense = data.number
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
        // password: data.password, //用户密码
        identificationImage: data.identificationInf.identificationImage, //身份证正面
        identificationBackImage: data.identificationInf.identificationBackImage, //身份证背面照
        name: data.identificationInf.name, //司机姓名
        telphone: data.telphone, //手机号码
        identificationNumber: data.identificationInf.identificationNumber, //身份证号
        idDateRange: [
          data.identificationInf.identificationBeginTime || "",
          data.identificationInf.identificationEndTime || "",
        ], //身份证有效期
        driverLicenseImage: data.driverLicenseInf.driverLicenseImage, //驾驶证
        driverDateRange: [
          data.driverLicenseInf.validPeriodFrom || "",
          data.driverLicenseInf.validPeriodTo || "",
        ], //驾驶证有效期
        driverLicense: data.driverLicenseInf.driverLicense,
        issuingOrganizations: data.driverLicenseInf.issuingOrganizations, //发证机关
        remark: data.remark, //备注
        authInf: data.authInf,
        authStatus: data.authStatus,
        authStatusValue: data.authStatusValue,
      };
      console.log(
        "data.driverLicenseInf.validPeriodTo",
        data.driverLicenseInf.validPeriodTo
      );
      if (data.driverLicenseInf.validPeriodTo === "长期") {
        this.isDriverDateValid = false;
      }
      this.oldIdentificationNumber = this.form.identificationNumber;
      this.oldTelphone = this.form.telphone;
    },
    FormToUpdate() {
      const form = this.form;
      if (!form.driverDateRange) {
        form.driverDateRange = []
      }
      const obj = {
        telphone: form.telphone,
        // userCode: form.userCode, //????用户编码
        code: this.options.code, //司机编码
        // password: form.password, //用户密码
        orgCode: form.orgCode, //归属组织
        // name: form.name, //司机姓名
        remark: form.remark, //备注
        authInf: form.authInf,
        authStatus: form.authStatus,
        authStatusValue: form.authStatusValue,
        driverLicenseInf: {
          validPeriodFrom: form.driverDateRange[0], //驾驶证有效期自
          driverLicense: form.driverLicense, //?????  驾驶证号
          // driverLicenseType:form.,   //驾驶证类型	???
          issuingOrganizations: form.issuingOrganizations, //驾驶证发证机关
          validPeriodTo: form.driverDateRange[1], //驾驶证有效期至
          driverLicenseImage: form.driverLicenseImage, //驾驶证照
        },
        identificationInf: {
          identificationImage: form.identificationImage, //身份证正面照
          identificationEndTime: form.idDateRange[1], //身份证有效期结束
          name: form.name, //名字???
          identificationBeginTime: form.idDateRange[0], //身份证有效期开始
          identificationBackImage: form.identificationBackImage, //身份证反面照
          identificationNumber: form.identificationNumber, //身份证号
        },
      };
      obj.userCode = this.options.userCode;
      return obj;
    },
    FormToAdd() {
      const form = this.form;
      if (!form.driverDateRange) {
        form.driverDateRange = []
      }
      const obj = {
        driverLicenseInf: {
          driverLicense: form.identificationNumber,
          driverLicenseImage: form.driverLicenseImage,
          validPeriodTo: form.driverDateRange[1] || null,
          issuingOrganizations: form.issuingOrganizations,
          validPeriodFrom: form.driverDateRange[0] || null,
        },
        identificationInf: {
          name: form.name,
          identificationEndTime: form.idDateRange[1] || null,
          identificationBeginTime: form.idDateRange[0] || null,
          identificationBackImage: form.identificationBackImage,
          identificationImage: form.identificationImage,
          identificationNumber: form.identificationNumber,
        },
        authInf: form.authInf,
        authStatus: form.authStatus,
        authStatusValue: form.authStatusValue,
        telphone: form.telphone,
        // password: form.password, //用户密码
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
  // width: 58px;
}
.upload-image-label {
  margin: 0;
  line-height: 24px;
}
.dialog-header-title {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #3d4050;
  opacity: 1;
  margin-right: 20px;
}
</style>

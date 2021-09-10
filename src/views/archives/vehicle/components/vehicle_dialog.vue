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
      label-width="110px"
      size="small"
    >
      <!-- 图片上传类 -->
      <el-row>
        <el-col :span="8">
          <el-form-item ref="vehicleLicenseImgRef" prop="vehicleLicenseImg">
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              行驶证正面:
            </p>
            <ImageUploadSimple
              v-model="form.vehicleLicenseImg"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="vehicleLicenseSecondImgRef"
            prop="vehicleLicenseSecondImg"
          >
            <p class="upload-image-label">
              <span class="g-color-require">* </span>
              行驶证背面:
            </p>
            <ImageUploadSimple
              v-model="form.vehicleLicenseSecondImg"
              @input="chooseImgBack"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="roadTransportCertificateImgRef"
            prop="roadTransportCertificateImg"
          >
            <p class="upload-image-label">道路运输证:</p>
            <ImageUploadSimple
              v-model="form.roadTransportCertificateImg"
              @input="LoadChooseImg"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 车辆信息 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="车牌号" prop="licenseNumber">
            <el-input
              v-model="form.licenseNumber"
              placeholder="请输入车牌号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="vehicleTypeCode">
            <el-select
              v-model="form.vehicleTypeCode"
              clearable
              filterable
              placeholder="请选择车辆类型"
            >
              <el-option
                v-for="(item, index) in vehicleTypeCodeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="engineNumber" label="发动机号">
            <el-input
              v-model="form.engineNumber"
              placeholder="请输入发动机号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="车辆识别代号" prop="chassisNumber">
            <el-input
              v-model="form.chassisNumber"
              placeholder="请输入车辆识别代号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="归属组织"
            prop="orgCode"
          >
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
          <el-form-item
            style="display: inline-block"
            label="默认司机"
            prop="defaultDriverCode"
          >
            <el-select
              v-model="form.defaultDriverCode"
              clearable
              filterable
              placeholder="请选择车辆类型"
            >
              <el-option
                v-for="(item, index) in options.defaultDriverList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆可载重量:" prop="vehicleLoadWeight">
            <el-input
              v-model="form.vehicleLoadWeight"
              placeholder="请输入可载重量"
              clearable
            >
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆总重量:" prop="vehicleTotalWeight">
            <el-input
              v-model="form.vehicleTotalWeight"
              placeholder="请输入总重量"
              clearable
            >
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="车辆承运类型"
            prop="carrierType"
          >
            <el-select
              v-model="form.carrierType"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in carrierTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="车牌类型"
            prop="vehicleLicenseColorCode"
          >
            <el-select
              v-model="form.vehicleLicenseColorCode"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in vehicleLicenseColorCodeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="注册时间"
            prop="registerDate"
          >
            <el-date-picker
              v-model="form.registerDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="发证日期"
            prop="issueDate"
          >
            <el-date-picker
              v-model="form.issueDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
            <el-select
              v-model="form.vehicleEnergyType"
              clearable
              filterable
              placeholder="请选择车辆能源类型"
            >
              <el-option
                v-for="(item, index) in vehicleEnergyTypeList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绑定设备编号" prop="deviceNumber	">
            <el-input
              v-model="form.deviceNumber"
              placeholder="请输入设备编号"
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
  },
  data() {
    return {
      loading: false,
      code: null,
      id: null,
      form: {
        //行驶证信息
        vehicleLicenseImg: null, //行驶证照
        vehicleLicenseSecondImg: null, //行驶证副业照
        registerDate: null, // 注册日期
        issueDate: null, //发证日期
        vehicleLoadWeight: null, // 可载重量
        vehicleTypeCode: null, //  车辆类型
        engineNumber: null, //发动机号
        chassisNumber: null, //车辆识别号码
        licenseNumber: null, //车牌号
        vehicleTotalWeight: null, //车辆总重量
        vehicleLicenseColorCode: null, //车牌类型
        vehicleEnergyType: null, //能源类型
        roadTransportCertificateImg: null, //道路运输证
        orgCode: null, //归属组织编码
        carrierType: null, //车辆承运类型
        deviceNumber: null, //绑定设备的编号
        remark: null, //备注
        defaultDriverCode: null, //默认司机
      },
      rules: {
        vehicleLicenseImg: [
          { required: true, message: "请上传行驶证照", trigger: "change" },
        ],
        vehicleLicenseSecondImg: [
          { required: true, message: "请上传行驶证副业照", trigger: "change" },
        ],
        licenseNumber: [
          { required: true, message: "车牌号不能为空", trigger: "blur" },
          { validator: this.formValidate.plateNo, trigger: "blur" },
        ],
        vehicleTypeCode: [
          {
            required: true,
            message: "车牌类型不能为空",
            trigger: ["change", "blur"],
          },
        ],
        engineNumber: [
          { required: true, message: "发动机号不能为空", trigger: "blur" },
        ],
        chassisNumber: [
          { required: true, message: "车辆识别号码不能为空", trigger: "blur" },
        ],
        orgCode: [
          {
            required: true,
            message: "所属组织不能为空",
            trigger: ["change", "blur"],
          },
        ],
        vehicleLoadWeight: [
          { required: true, message: "可载重量不能为空", trigger: "blur" },
        ],
        vehicleTotalWeight: [
          { required: true, message: "车辆总重量不能为空", trigger: "blur" },
        ],
      },
      vehicleTypeCodeList: [], //车辆类型列表
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
      vehicleLicenseColorCodeList: [], //车牌类型
      carrierTypeList: [], //车辆承运类型list
      vehicleEnergyTypeList: [], //车辆能源类型list
    };
  },
  created() {},
  watch: {
    options() {
      console.log("this.$store.getters", this.$store.getters);
      this.vehicleEnergyTypeList = this.$store.getters.vehicleEnergyTypeList;
      this.vehicleTypeCodeList = this.$store.getters.vehicleTypeCodeList;
      this.carrierTypeList = this.$store.getters.carrierTypeList;
      this.vehicleLicenseColorCodeList =
        this.$store.getters.vehicleLicenseColorCodeList;
      if (this.options.editType == "update" && this.open) {
        console.log("this.options", this.options, this.open);
        //请求
        this.requsetDetail();
      }
    },
  },
  mounted() {
    this.getOrgTree();
  },
  methods: {
    //获取组织树
    getOrgTree() {
      const obj = {
        moduleName: "http_org",
        method: "get",
        url_alias: "orgTree",
      };
      http_request(obj).then((res) => {
        console.log("http_org res", res);
        this.deptOptions = res.data;
      });
    },
    // 手动刷新校验
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField("orgCode");
      });
    },
    //获取详情
    requsetDetail() {
      const tmp = {
        moduleName: "http_vehicle",
        method: "get",
        url_alias: "vehicle_detail",
        url_code: [this.options.code],
      };
      console.log("tmp", tmp);
      http_request(tmp)
        .then((res) => {
          console.log("requsetDetail res", res);

          this.getDetailToForm(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    //提交表单
    submitForm() {
      if (
        isNaN(this.form.vehicleLoadWeight) ||
        isNaN(this.form.vehicleTotalWeight)
      ) {
        this.msgError("请选择正确图片上传");
        return;
      }
      const me = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.options.editType == "update") {
            //修改请求
            const obj = {
              data: me.getFormToUpdateData(),
              moduleName: "http_vehicle",
              method: "put",
              url_alias: "vehicle_edit",
            };
            http_request(obj)
              .then((updateres) => {
                console.log("updateres", updateres);
                this.loading = false;
                this.$emit("colseDialog", "ok");
              })
              .catch((e) => {
                this.loading = false;
              });
          } else {
            const obj = {
              data: me.getFormToAddData(),
              moduleName: "http_vehicle",
              method: "post",
              url_alias: "vehicle_add",
            };
            http_request(obj)
              .then((addres) => {
                console.log("addres", addres);
                this.loading = false;
                this.$emit("colseDialog", "ok");
              })
              .catch((e) => {
                this.loading = false;
              });
          }
        }
      });
    },
    //关闭弹窗
    cancel() {
      this.$emit("colseDialog", "no");
      this.reset();
    },
    //重置
    reset(orgCode = null) {
      this.form = {
        vehicleLicenseImg: null, //行驶证照
        vehicleLicenseSecondImg: null, //行驶证副业照
        registerDate: null, // 注册日期
        issueDate: null, //发证日期
        vehicleLoadWeight: null, // 可载重量
        vehicleTypeCode: null, //  车辆类型
        engineNumber: null, //发动机号
        chassisNumber: null, //车辆识别号码
        licenseNumber: null, //车牌号
        vehicleTotalWeight: null, //车辆总重量
        vehicleLicenseColorCode: null, //车牌类型
        vehicleEnergyType: null, //
        roadTransportCertificateImg: null, //道路运输证
        orgCode: orgCode, //组织
        carrierType: null, //车辆承运类型
        deviceNumber: null, //绑定设备的编号
        remark: null, //备注
        defaultDriverCode: null,
      };
      this.resetForm("form");
    },
    //选择照片
    chooseImgBack(e) {
      this.ocrHttp(e, "1", "back");
    },
    chooseImg(e) {
      this.ocrHttp(e, "1", "front");
    },
    LoadChooseImg(e) {
      console.log("LoadChooseImg", e);
    },
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
      console.log("ocr请求 参数", obj);
      const res = await http_request(obj);
      console.log("ocr请求", res);
      const result = res.data.result;
      this.form.licenseNumber = result.number;
      console.log("side", side);
      const sideFn = {
        front: () => {
          this.form.engineNumber = result.engine_no;
          this.form.chassisNumber = result.vin;
          this.form.issueDate = result.issue_date;
          this.form.registerDate = result.register_date;
          if (result.vehicle_type) {
            let typeValue = "X99";
            this.vehicleTypeCodeList.forEach((el) => {
              if (result.vehicle_type === el.dictLabel) {
                typeValue = el.dictValue;
              }
            });
            this.form.vehicleTypeCode = typeValue;
          }
        },
        back: () => {
          if (result.gross_mass) {
            const mass = parseInt(result.gross_mass.replace("kg", "")) / 1000;
            this.form.vehicleTotalWeight = mass;
          }
          if (result.approved_load) {
            const load =
              parseInt(result.approved_load.replace("kg", "")) / 1000;
            this.form.vehicleLoadWeight = load;
          }
          if (
            isNaN(this.form.vehicleLoadWeight) ||
            isNaN(this.form.vehicleTotalWeight)
          ) {
            this.msgError("请选择正确图片上传");
          }
        },
      };
      sideFn[side]();
    },
    //表单信息赋值
    getDetailToForm(data) {
      this.id = data.id;
      this.code = data.code; // 关键code
      this.form.vehicleLicenseImg = data.vehicleLicenseInf.vehicleLicenseImg;
      this.form.vehicleLicenseSecondImg =
        data.vehicleLicenseInf.vehicleLicenseSecondImg; //行驶证副业照
      this.form.registerDate = data.vehicleLicenseInf.registerDate; // 注册日期
      this.form.issueDate = data.vehicleLicenseInf.issueDate; //发证日期
      this.form.vehicleLoadWeight = data.vehicleInf.vehicleLoadWeight; // 可载重量
      this.form.vehicleTypeCode = data.vehicleLicenseInf.vehicleTypeCode; //  车辆类型*
      this.form.engineNumber = data.vehicleLicenseInf.engineNumber; //发动机号
      this.form.chassisNumber = data.vehicleInf.chassisNumber; //车辆识别号码
      this.form.licenseNumber = data.vehicleLicenseInf.licenseNumber; //车牌号
      this.form.vehicleTotalWeight = data.vehicleInf.vehicleTotalWeight; //车辆总重量
      this.form.vehicleLicenseColorCode =
        data.vehicleInf.vehicleLicenseColorCode; //车牌类型*
      this.form.vehicleEnergyType = data.vehicleInf.vehicleEnergyType; //车辆能源类型*
      this.form.roadTransportCertificateImg = data.roadTransportCertificateImg; //道路运输证
      this.form.orgCode = data.orgCode; //组织
      this.form.carrierType = data.carrierType; //车辆承运类型*
      this.form.deviceNumber = data.deviceNumber; //绑定设备的编号
      this.form.remark = data.remark; //备注
      this.form.defaultDriverCode = data.defaultDriverCode;
    },
    //表单给提交修改数据
    getFormToUpdateData() {
      const me = this;
      console.log("me.form", me.form);
      const obj = {
        vehicleEnergyType: me.form.vehicleEnergyType,
        roadTransportCertificateImg: me.form.roadTransportCertificateImg,
        vehicleLicenseColorCode: me.form.vehicleLicenseColorCode,
        carrierType: me.form.carrierType,
        vehicleLicenseInf: {
          engineNumber: me.form.engineNumber,
          vehicleLicenseSecondImg: me.form.vehicleLicenseSecondImg,
          issueDate: me.form.issueDate,
          registerDate: me.form.registerDate,
          chassisNumber: me.form.chassisNumber,
          licenseNumber: me.form.licenseNumber,
          vehicleTypeCode: me.form.vehicleTypeCode,
          vehicleLoadWeight: me.form.vehicleLoadWeight,
          vehicleTotalWeight: me.form.vehicleTotalWeight,
          vehicleLicenseImg: me.form.vehicleLicenseImg,
        },
        deviceNumber: me.form.deviceNumber,
        orgCode: me.form.orgCode,
        code: me.code,
        id: me.id,
        remark: me.form.remark,
        defaultDriverCode: me.form.defaultDriverCode,
      };

      return obj;
    },
    //表单给提交新增数据
    getFormToAddData() {
      const me = this;
      const obj = {
        vehicleLicenseInf: {
          vehicleLicenseColorCode: me.form.vehicleLicenseColorCode,
          registerDate: me.form.registerDate,
          vehicleLicenseImg: me.form.vehicleLicenseImg,
          vehicleLicenseSecondImg: me.form.vehicleLicenseSecondImg,
          issueDate: me.form.issueDate,
          vehicleLoadWeight: me.form.vehicleLoadWeight,
          vehicleTotalWeight: me.form.vehicleTotalWeight,
          vehicleTypeCode: me.form.vehicleTypeCode,
          engineNumber: me.form.engineNumber,
          chassisNumber: me.form.chassisNumber,
          licenseNumber: me.form.licenseNumber,
        },
        carrierType: me.form.carrierType,
        roadTransportCertificateImg: me.form.roadTransportCertificateImg,
        vehicleEnergyType: me.form.vehicleEnergyType,
        // driverCode: me.form.driverCode,
        deviceNumber: me.form.deviceNumber,
        orgCode: me.form.orgCode,
        remark: me.form.remark,
        defaultDriverCode: me.form.defaultDriverCode,
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
</style>
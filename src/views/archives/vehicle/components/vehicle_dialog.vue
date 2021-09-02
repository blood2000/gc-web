<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="small"
    >
      <!-- 图片上传类 -->
      <el-row>
        <el-col :span="8">
          <el-form-item ref="vehicleLicenseImgRef" prop="vehicleLicenseImg">
            <div><span style="color: red">*</span>行驶证正面:</div>
            <ImageUploadSimple
              v-model="form.vehicleLicenseImg"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="vehicleLicenseSecondImgRef"
            label=""
            prop="vehicleLicenseSecondImg"
          >
            <div><span style="color: red">*</span>行驶证背面:</div>
            <ImageUploadSimple
              v-model="form.vehicleLicenseSecondImg"
              @input="chooseImg"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="roadTransportCertificateImgRef"
            prop="roadTransportCertificateImg"
          >
            <div>道路运输证:</div>
            <ImageUploadSimple
              v-model="form.roadTransportCertificateImg"
              @input="chooseImg"
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
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUploadSimple from "@/components/ImageUpload/simple.vue";

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
  },
  data() {
    return {
      form: {
        vehicleLicenseInf: {
          //行驶证信息
          vehicleLicenseImg: "", //行驶证照
          vehicleLicenseSecondImg: "", //行驶证副业照
          registerDate: "", // 注册日期
          issueDate: "", //发证日期
          vehicleLoadWeight: "", // 可载重量
          vehicleTypeCode: "", //  车辆类型
          engineNumber: "", //发动机号
          chassisNumber: "", //车辆识别号码
          licenseNumber: "", //车牌号
          vehicleTotalWeight: "", //车辆总重量
        },
        roadTransportCertificateImg: "", //道路运输证
        org: "", //组织
        vehicleCarryType: "", //车辆承运类型
        deviceCode: "", //绑定设备的编号
        remarks: "", //备注
      },
      rules: {
        vehicleLicenseImg: [
          { required: true, message: "请上传行驶证照", trigger: "change" },
        ],
        vehicleLicenseSecondImg: [
          { required: true, message: "请上传行驶证副业照", trigger: "change" },
        ],
      },
      vehicleTypeCodeList:[], //车辆类型列表
    };
  },
  created(){
      this.vehicleTypeCodeList = 'ss'
  },
  methods: {
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
</style>
<template>
  <el-dialog
    :visible.sync="open"
    width="660px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="cancel"
    :destroy-on-close="true"
  >
    <el-dialog width="460px" :visible.sync="checkVhicleShow" append-to-body>
      <template slot="title">
        <div class="checkVehicle-title">
          <img src="../../../../assets/images/dialog/icon-warn.png" alt="" />
          <span>提示</span>
        </div>
      </template>
      <div class="checkVehicle-content">
        {{ checkVhicleTitle }}
      </div>
      <div class="checkVehicle-label">请设置车辆归属！</div>
      <el-radio v-model="radio" :label="0">自有车辆</el-radio>
      <el-radio v-model="radio" :label="1">外援车辆</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkVehicleOk">确 定</el-button>
        <el-button @click="checkVehicleCancel">取 消</el-button>
      </div>
    </el-dialog>
    <template slot="title">
      <span class="dialog-header-title">{{ title }}</span>
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      size="small"
      label-position="top"
    >
      <!-- 图片上传类 -->
      <el-tag
        class="tag-info"
        v-if="
          open &&
          options &&
          options.editType == 'update' &&
          this.authStatusValue
        "
        :type="selectTipColor()"
      >
        <img
          :src="
            require(`../../../../assets/images/dialog/${selectIconColor()}.png`)
          "
          alt=""
        />
        {{ selectTipText() }}</el-tag
      >
      <el-row>
        <el-col :span="8">
          <el-form-item
            ref="vehicleLicenseImgRef"
            label="行驶证正面:"
            prop="vehicleLicenseImg"
          >
            <ImageUploadSimple
              v-model="form.vehicleLicenseImg"
              @input="chooseImg"
              :disabled="disabledDeal()"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-travel_front">
                  <img
                    src="../../../../assets/images/certificate/photograph.png"
                    alt=""
                  />
                </div>
              </template>
            </ImageUploadSimple>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            ref="vehicleLicenseSecondImgRef"
            prop="vehicleLicenseSecondImg"
            label="行驶证背面:"
          >
            <!-- <p class="upload-image-label">
              <span class="g-color-require">* </span>
              行驶证背面:
            </p> -->
            <ImageUploadSimple
              v-model="form.vehicleLicenseSecondImg"
              @input="chooseImgBack"
              :disabled="disabledDeal()"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-travel_back">
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
      <!-- 车辆信息 -->
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="车牌号" prop="licenseNumber">
            <el-input
              @blur="blurChange"
              v-model="form.licenseNumber"
              style="width: 256px"
              placeholder="请输入车牌号"
              clearable
              :disabled="disabledDeal()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="vehicleTypeCode">
            <el-select
              v-model="form.vehicleTypeCode"
              clearable
              style="width: 256px"
              filterable
              placeholder="请选择车辆类型"
              :disabled="disabledDeal()"
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
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="车辆能源类型" prop="vehicleEnergyType">
            <el-select
              v-model="form.vehicleEnergyType"
              clearable
              filterable
              style="width: 256px"
              placeholder="请选择车辆能源类型"
              :disabled="disabledDeal()"
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
          <el-form-item
            style="display: inline-block"
            label="车牌颜色"
            prop="vehicleLicenseColorCode"
          >
            <el-select
              v-model="form.vehicleLicenseColorCode"
              clearable
              filterable
              style="width: 256px"
              placeholder="请选择"
              :disabled="disabledDeal()"
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
        <el-col :span="12">
          <el-form-item label="车辆识别代号" prop="chassisNumber">
            <el-input
              v-model="form.chassisNumber"
              placeholder="请输入车辆识别代号"
              clearable
              style="width: 256px"
              :disabled="disabledDeal()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="engineNumber" label="发动机号">
            <el-input
              v-model="form.engineNumber"
              placeholder="请输入发动机号"
              clearable
              style="width: 256px"
              :disabled="disabledDeal()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="车辆可载重量:" prop="vehicleLoadWeight">
            <el-input
              v-model="form.vehicleLoadWeight"
              placeholder="请输入可载重量"
              clearable
              style="width: 256px"
              type="number"
              @input="imposeInput($event, 'vehicleLoadWeight')"
              :disabled="disabledDeal()"
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
              style="width: 256px"
              type="number"
              @input="imposeInput($event, 'vehicleTotalWeight')"
              :disabled="disabledDeal()"
            >
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="注册时间"
            prop="registerDate"
          >
            <el-date-picker
              v-model="form.registerDate"
              type="date"
              style="width: 256px"
              placeholder="选择日期"
              :disabled="disabledDeal()"
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
              style="width: 256px"
              placeholder="选择日期"
              :disabled="disabledDeal()"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!-- issuingOrganizations -->
        <el-col :span="12">
          <el-form-item label="发证机关:" prop="issuingOrganizations">
            <el-input
              v-model="form.issuingOrganizations"
              placeholder="请输入发证机关"
              clearable
              style="width: 256px"
              @input="imposeInput($event, 'issuingOrganizations')"
              :disabled="disabledDeal()"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="车辆归属" prop="vehicleOwnership">
            <el-select
              v-model="form.vehicleOwnership"
              clearable
              filterable
              style="width: 256px"
              placeholder="请选择车辆归属"
            >
              <el-option
                v-for="(item, index) in vehicleOwnershipList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
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
              style="width: 256px"
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
      </el-row>

      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            style="display: inline-block"
            label="归属组织"
            prop="orgCode"
          >
            <treeselect
              v-model="form.orgCode"
              :options="deptOptions"
              style="width: 256px"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择所属组织"
              noResultsText="无匹配数据"
              @select="selectOrgCode"
              @input="treeselectchange"
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
              style="width: 256px"
              placeholder="请选择司机"
            >
              <el-option
                v-for="(item, index) in defaultDriverList"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item prop="vehicleAlias" label="车辆别名">
            <el-input
              v-model="form.vehicleAlias"
              placeholder="请输入车辆别名"
              clearable
              style="width: 256px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- vehicleOwnership -->

        <el-col :span="8">
          <el-form-item
            ref="roadTransportCertificateImgRef"
            prop="roadTransportCertificateImg"
            label="道路运输证:"
          >
            <!-- <p class="upload-image-label">道路运输证:</p> -->
            <ImageUploadSimple
              v-model="form.roadTransportCertificateImg"
              @input="LoadChooseImg"
            >
              <template slot="initImage">
                <div class="dispatch-bg-upload dispatch-load">
                  <img
                    src="../../../../assets/images/certificate/photograph.png"
                    alt=""
                  />
                </div>
              </template>
            </ImageUploadSimple>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="绑定设备编号" prop="deviceNumber	">
            <el-input
              v-model="form.deviceNumber"
              placeholder="请输入设备编号"
              clearable
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="form.remark"
              :disabled="disabledDeal()"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
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
import formValidate from "../../../../utils/formValidate";
import { number } from "echarts";
import vehicleConfig from "../vehicle_config";

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
      authInf: null,
      authStatusValue: null,
      authStatus: null,
      checkVhicleShow: false,
      checkVhicleCode: null,
      checkVhicleTitle: "",
      radio: 0,
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
        // deviceNumber: null, //绑定设备的编号
        // remark: null, //备注
        defaultDriverCode: null, //默认司机
        vehicleOwnership: null, // 车辆归属 自有0 1外部
        issuingOrganizations: null, //发证机关
        vehicleAlias: null, //车辆别名
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
          { validator: formValidate.plateNo, trigger: "blur" },
        ],
        vehicleTypeCode: [
          {
            required: true,
            message: "车牌类型不能为空",
            trigger: ["change", "blur"],
          },
        ],
        chassisNumber: [
          { required: true, message: "车辆识别号码不能为空", trigger: "blur" },
        ],
        carrierType: [
          {
            required: true,
            message: "车辆承运类型不能为空",
            trigger: "change",
          },
        ],

        vehicleOwnership: [
          {
            required: true,
            message: "请选择车辆归属",
            trigger: "change",
          },
        ],
        issuingOrganizations: [
          { required: true, message: "发证机关不能为空", trigger: "blur" },
        ],
        vehicleEnergyType: [
          {
            required: true,
            message: "车辆能源类型不能为空",
            trigger: "change",
          },
        ],
        vehicleLicenseColorCode: [
          { required: true, message: "车牌类型不能为空", trigger: "change" },
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
        console.log("obj", obj);
        return obj;
      },
      vehicleLicenseColorCodeList: [], //车牌类型
      carrierTypeList: [], //车辆承运类型list
      vehicleOwnershipList: [],
      vehicleEnergyTypeList: [], //车辆能源类型list
      defaultDriverList: [], //
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
      //请求
      this.defaultDriverList = this.options.defaultDriverList;
      this.vehicleOwnershipList = vehicleConfig.vehicleOwnershipList;
      console.log(" this.defaultDriverList", this.defaultDriverList);
      if (this.options.editType == "update" && this.open) {
        console.log("this.options", this.options, this.open);

        this.requsetDetail();
      }
    },
  },
  mounted() {
    this.getOrgTree();
  },
  methods: {
    checkVehicleCancel() {
      this.checkVhicleShow = false;
    },
    checkVehicleOk() {
      const me = this;
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "confirmAdd",
        data: {
          orgCode: me.options.orgCode,
          code: me.checkVhicleCode,
          vehicleOwnership: me.radio,
        },
      };
      http_request(obj).then((res) => {
        console.log("111111", res);
        me.reset();
        me.$emit("colseDialog", "ok");
        me.msgSuccess("添加成功");
        me.checkVhicleShow = false;
      });
    },
    selectTipColor() {
      const objColor = {
        0: "warning",
        1: "warning",
        2: "danger",
        3: "success",
      };
      return objColor[this.authStatus];
    },
    selectIconColor() {
      const objColor = {
        0: "icon-warn",
        1: "icon-warn",
        2: "icon-error",
        3: "icon-success",
      };
      return objColor[this.authStatus];
    },
    selectTipText() {
      return `${this.authStatusValue}:${this.authInf}`;
    },
    disabledDealLicenseNumber() {
      if (this.options && this.options.editType == "update") return true;
    },
    disabledDeal() {
      if (this.options && this.options.editType != "update") return false;
      if (this.options && this.options.currAuthStatus === 0) return false;
      if (this.options && this.options.currAuthStatus == 1) return false;
      if (this.options && this.options.currAuthStatus == 2) return false;
      return true;
    },
    //强制限制
    imposeInput(e, value) {
      console.log("强制限制", e);
      const tmp = e.match(/^[0-9]+(\.[0-9]{0,3})?/g) ?? [""];
      console.log("tmp", tmp[0]);
      this.form[value] = tmp[0];
    },
    //失去焦点
    blurChange(e) {
      //toUpperCase
      console.log("eee", e, this.form.licenseNumber);
      if (!this.form.licenseNumber) return;
      const tmp = this.form.licenseNumber.toUpperCase();
      console.log("result", tmp);
      this.form.licenseNumber = tmp;
      this.checkVhicle();
    },
    //车辆校验
    async checkVhicle(result = null) {
      const me = this;
      console.log("result", result);
      let licenseNumber = "";
      if (result && result.number) {
        licenseNumber = result.number;
        console.log("ckc------", result.number, me.form.licenseNumber);
      } else {
        licenseNumber = me.form.licenseNumber;
      }
      console.log("licenseNumber", licenseNumber);
      const orgCode = me.options.orgCode;
      if (!licenseNumber) return;
      console.log("orgCode", orgCode);
      const obj = {
        moduleName: "http_vehicle",
        method: "post",
        url_alias: "checkAdd",
        data: {
          vehicleLicenseInf: { licenseNumber },
        },
      };
      const res = await http_request(obj);
      console.log("车辆校验", res);
      if (res.code != "200") return;
      const msgData = res.data;
      const selectObj = {
        //0:车辆已存在,请勿重复添加! 1:车辆已注册,是否确认进行添加至本车队 2:车辆为新车,可进行添加!
        0: () => {
          me.$confirm(`${msgData.msg}`, "系统提示", {
            confirmButtonText: "确认",
            showCancelButton: false,
            type: "warning",
          }).then(() => {
            me.form.licenseNumber = null;
          });
        },
        1: () => {
          console.log("111111");
          me.checkVhicleShow = true;
          me.checkVhicleTitle = msgData.msg;
          me.checkVhicleCode = msgData.code;
          // me.$confirm(`${msgData.msg}`, "提示", {
          //   confirmButtonText: "确认",
          //   cancelButtonText: "取消",
          //   type: "warning",
          // })
          //   .then(() => {
          //     const obj = {
          //       moduleName: "http_vehicle",
          //       method: "post",
          //       url_alias: "confirmAdd",
          //       data: {
          //         orgCode,
          //         code: msgData.code,
          //         vehicleOwnership:me.radio
          //       },
          //     };
          //     http_request(obj).then((res) => {
          //       console.log("111111", res);
          //       me.reset();
          //       me.$emit("colseDialog", "ok");
          //       me.msgSuccess("添加成功");
          //     });
          //   })
          //   .catch(() => {
          //     me.form.licenseNumber = null;
          //     // if (this.form.vehicleLicenseImg) {
          //     //   this.form.vehicleLicenseImg = null;
          //     // }
          //   });
        },
        2: () => {
          if (!result) return;
          me.ocrToform(result);
          // console.log("22222");
          // me.$confirm(`${msgData.msg}`, "系统提示", {
          //   confirmButtonText: "确认",
          //   type: "info",
          //   showCancelButton: false,
          // });
        },
      };
      selectObj[msgData.type]();
    },
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
    treeselectchange(e) {
      console.log("树e", e);
      if (this.options.editType == "update") {
        console.log("deptOptions", this.deptOptions);
        const result = {
          result: null,
        };
        this.recursionorgTree(this.deptOptions, e, result);
        console.log("result", result);
        if (!result.result) {
          this.form.orgCode = null;
        }
      }
    },
    recursionorgTree(data, e, result) {
      const me = this;
      for (const el of data) {
        console.log(el);
        if (el.code == e) {
          result.result = el.orgName;
          break;
        } else {
          if (el.childrenOrgList) {
            me.recursionorgTree(el.childrenOrgList, e, result);
          }
        }
      }
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
      // if (
      //   isNaN(this.form.vehicleLoadWeight) ||
      //   isNaN(this.form.vehicleTotalWeight)
      // ) {
      //   this.msgError("请选择正确图片上传");
      //   return;
      // }
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
                this.reset();
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
        vehicleAlias: null, //车辆别名
        chassisNumber: null, //车辆识别号码
        licenseNumber: null, //车牌号
        vehicleTotalWeight: null, //车辆总重量
        vehicleLicenseColorCode: null, //车牌类型
        vehicleEnergyType: null, //
        roadTransportCertificateImg: null, //道路运输证
        orgCode: orgCode, //组织
        carrierType: null, //车辆承运类型
        vehicleOwnership: null,
        issuingOrganizations: null,
        // deviceNumber: null, //绑定设备的编号
        // remark: null, //备注
        defaultDriverCode: null,
      };
      this.resetForm("form");
      this.authInf = null;
      this.authStatusValue = null;
      this.authStatus = null;
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
    ocrToform(result) {
      console.log("ocrToform", result);
      this.form.licenseNumber = result.number;
      this.form.engineNumber = result.engine_no;
      this.form.issuingOrganizations = result.issuing_authority;
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
    async ocrHttp(imgPath, type, side) {
      const params =  {
          imgPath,
          type,
          side,
        }
        if(side =="front"){
          // params.returnIssuingAuthority = true
        }
      const obj = {
        moduleName: "http_common",
        method: "post",
        url_alias: "ocr",
        data:params
      };
      console.log("ocr请求 参数", obj);
      const res = await http_request(obj);
      console.log("ocr请求", res);
      const result = res.data.result;
      console.log("side", side);
      const sideFn = {
        front: () => {
          if (result.number) {
            console.log("ocr识别到车牌了", result.number);
            this.checkVhicle(result);
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
      this.form.vehicleAlias = data.vehicleAlias; //车辆别名
      this.form.issuingOrganizations =
        data.vehicleLicenseInf.issuingOrganizations;
      this.form.chassisNumber = data.vehicleInf.chassisNumber; //车辆识别号码
      this.form.licenseNumber = data.vehicleLicenseInf.licenseNumber; //车牌号
      this.form.vehicleTotalWeight = data.vehicleInf.vehicleTotalWeight; //车辆总重量
      this.form.vehicleLicenseColorCode =
        data.vehicleInf.vehicleLicenseColorCode; //车牌类型*
      this.form.vehicleEnergyType = data.vehicleInf.vehicleEnergyType; //车辆能源类型*
      this.form.roadTransportCertificateImg = data.roadTransportCertificateImg; //道路运输证
      this.form.orgCode = data.orgCode; //组织
      this.form.carrierType = data.carrierType; //车辆承运类型*
      this.form.vehicleOwnership = data.vehicleOwnership;
      // this.form.deviceNumber = data.deviceNumber; //绑定设备的编号
      // this.form.remark = data.remark; //备注
      this.form.defaultDriverCode = data.defaultDriverCode;

      // other
      if (this.options.editType == "update" && this.open) {
        this.authInf = data.authInf;
        this.authStatusValue = data.authStatusValue;
        this.authStatus = data.authStatus;
      }
    },
    //表单给提交修改数据
    getFormToUpdateData() {
      const me = this;
      console.log("me.form", me.form);
      const obj = {
        vehicleEnergyType: me.form.vehicleEnergyType,
        roadTransportCertificateImg: me.form.roadTransportCertificateImg,
        carrierType: me.form.carrierType,
        vehicleOwnership: me.form.vehicleOwnership,
        vehicleAlias: me.form.vehicleAlias,
        vehicleLicenseInf: {
          engineNumber: me.form.engineNumber,
          issuingOrganizations: me.issuingOrganizations,
          vehicleLicenseSecondImg: me.form.vehicleLicenseSecondImg,
          issueDate: me.form.issueDate,
          registerDate: me.form.registerDate,
          chassisNumber: me.form.chassisNumber,
          licenseNumber: me.form.licenseNumber,
          vehicleTypeCode: me.form.vehicleTypeCode,
          vehicleLoadWeight: me.form.vehicleLoadWeight,
          vehicleTotalWeight: me.form.vehicleTotalWeight,
          vehicleLicenseImg: me.form.vehicleLicenseImg,
          vehicleLicenseColorCode: me.form.vehicleLicenseColorCode,
        },
        // deviceNumber: me.form.deviceNumber,
        orgCode: me.form.orgCode,
        code: me.code,
        id: me.id,
        // remark: me.form.remark,
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
          issuingOrganizations: me.form.issuingOrganizations,
          chassisNumber: me.form.chassisNumber,
          licenseNumber: me.form.licenseNumber,
        },
        vehicleAlias: me.form.vehicleAlias,
        carrierType: me.form.carrierType,
        vehicleOwnership: me.form.vehicleOwnership,
        roadTransportCertificateImg: me.form.roadTransportCertificateImg,
        vehicleEnergyType: me.form.vehicleEnergyType,
        // driverCode: me.form.driverCode,
        // deviceNumber: me.form.deviceNumber,
        orgCode: me.form.orgCode,
        // remark: me.form.remark,
        defaultDriverCode: me.form.defaultDriverCode,
      };
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0 !important;
}
/deep/.el-dialog__header {
  border-bottom: none !important;
}
.tag-info {
  width: 100%;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  margin-bottom: 18px;
  & > img {
    width: 16px;
    height: 16px;
    vertical-align: text-top;
  }
}

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
.dialog-header-title {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #3d4050;
  opacity: 1;
  margin-right: 20px;
}
.checkVehicle-title {
  display: flex;
  align-items: center;
  & > img {
    width: 21px;
    height: 21px;
    margin-right: 13px;
  }
  & > span {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #3d4050;
  }
}
.checkVehicle-content {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #3d4050;
  margin-bottom: 10px;
}
.checkVehicle-label {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
  margin-bottom: 10px;
}
</style>
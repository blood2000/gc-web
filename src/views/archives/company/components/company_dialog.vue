<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="600px"
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
        <el-col :span="16">
          <el-form-item label="用车企业名称:" prop="shipmentName">
            <el-input
              v-model="form.shipmentName"
              placeholder="请输入用车企业名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="联系人:" prop="contactName">
            <el-input
              v-model="form.contactName"
              placeholder="请输入联系人姓名"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="联系人电话:" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系人电话"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading"
        >保存</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { http_request } from "../../../../api";
import formValidate from "../../../../utils/formValidate";

export default {
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
      form: {
        shipmentName: null, //货主名称
        contactName: null, //联系人姓名
        contactPhone: null, //联系人电话
        id: null,
      },
      rules: {
        shipmentName: [
          { required: true, message: "用车企业不能为空", trigger: "blur" },
        ],
        contactName: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" },
          { validator: formValidate.telphone, trigger: "blur" },
        ],
      },
      isDetail: false,
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
  methods: {
    //请求详情
    requsetDetail() {
      const tmp = {
        moduleName: "http_company",
        method: "get",
        url_alias: "shipment_get_id",
        url_code: [this.options.code],
      };
      console.log("tmp", tmp);
      http_request(tmp)
        .then((res) => {
          if (!res.data) return this.msgError("暂无数据");
          console.log("driver_detail res", res);
          this.detailToForm(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    detailToForm(data) {
      this.form.shipmentName = data.shipmentName;
      this.form.contactName = data.contactName;
      this.form.contactPhone = data.contactPhone;
      this.form.id = this.options.code;
      console.log("this.form", this.form);
    },
    reset() {
      this.form.shipmentName = null;
      this.form.contactName = null;
      this.form.contactPhone = null;
      this.resetForm("form");
      this.isDetail = false;
    },
    //关闭
    cancel() {
      this.reset();
      this.$emit("colseDialog", "no");
    },
    //提交
    async submitForm() {
      const me = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (me.options.editType == "update") {
            const obj = {
              moduleName: "http_company",
              method: "put",
              url_alias: "shipment_update",
              data: me.form,
            };
            console.log("obj", obj);
            http_request(obj).then((updateRes) => {
              console.log("updateRes", updateRes);
              this.$emit("colseDialog", "ok");
              this.loading = false;
            });
          } else {
            console.log("添加请求");
            const obj = {
              moduleName: "http_company",
              method: "post",
              url_alias: "shipment_add",
              data: me.form,
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
  },
};
</script>

<style lang="scss" scoped>
</style>
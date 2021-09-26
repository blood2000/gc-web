<!-- 添加银行卡 -->
<template>
  <el-dialog
    title="添加银行卡"
    :visible.sync="addOpen"
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
      size="small"
      label-position="top"
    >
      <el-form-item label="银行卡号" prop="account">
        <el-input v-model="form.account" placeholder="请输入本人的储蓄卡卡号">
          <NoImageUpload slot="suffix" v-model="uploadImage" @input="chooseImg">
            <img src="@/assets/images/uploadImage/upload_icon.png" alt="" />
          </NoImageUpload>
        </el-input>
      </el-form-item>
      <el-form-item label="所属银行" prop="bankName">
        <!-- <el-input v-model="form.bankName" placeholder="支持OCR识别" clearable /> -->
        <el-select
          v-model="form.bankName"
          clearable
          filterable
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in bankList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开户人姓名" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入开户人姓名"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预留手机号" prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入预留手机号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <province-city-county
        ref="ChooseArea"
        :label-name="'开户城市'"
        :prop-province-code="form.province"
        :prop-city-code="form.city"
        @refresh="
          (data) => {
            form.province = data.provinceCode;
            form.city = data.cityCode;
          }
        "
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading">
        确 定
      </el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from "../../../../api";
import NoImageUpload from "@/components/ImageUpload/noImage.vue";
import ProvinceCityCounty from "@/components/ProvinceCityCounty";

export default {
  components: { NoImageUpload, ProvinceCityCounty },
  data() {
    return {
      loading: false,
      uploadImage: null,
      form: {
        account: null, //银行卡号
        bankCode: null, //开户银行code
        bankName: null, //开户银行姓名
        mobile: null, //银行预留手机
        name: null, //开户姓名
        province: null, //开户省份
        city: null, //开户行城市
      },
      rules: {
        account: [
          { required: true, message: "银行卡不能为空", trigger: "blur" },
          { validator: this.formValidate.bankCard, trigger: "blur" },
        ],
        bankName: [
          { required: true, message: "开户银行姓名不能为空", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "开户银行手机不能为空", trigger: "blur" },
        ],
      },
      bankList: [],
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit("update:open", v);
      },
    },
  },
  props: {
    addOpen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    addOpen() {
      console.log("is open");
      if (this.$store.state.dict.bank.length > 0) {
        this.bankList = this.$store.state.dict.bank;
      }
    },
  },
  mounted() {
    console.log("this.bankCode", this.$store.state.dict);
    this.bankList = this.$store.state.dict.bank;
  },
  methods: {
    chooseImg(e) {
      const me = this;
      console.log("e", e);
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "certificates",
        data: {
          imgPath: e,
          type: 3,
          // side: "front",
        },
      };
      http_request(obj).then((res) => {
        console.log("res ocr", res);
        if (res.data.error_code) return this.msgError("证件识别失败");
        const result = res.data.result;
        if (result.bank_name) me.form.bankName = result.bank_name;
        if (result.card_number) me.form.account = result.card_number;
      });
    },
    cancel() {
      this.$emit("colseDialog", "no");
    },
    async submitForm() {
      this.dealBankData();
      console.log("this.form", this.form);
      this.loading = true;
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "rel_car",
        data: this.form,
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.loading = false;
      this.$emit("colseDialog", "ok");
    },
    dealBankData() {
      const me = this;
      console.log("2222", me.bankList);

      for (const item of me.bankList) {
        console.log("111", item.dictLabel, me.form.bankName);
        if (item.dictLabel.indexOf(me.form.bankName)) {
          me.form.bankCode = item.dictValue;
          console.log("item", item);
        }
      }
    },
  },
};
</script>
<!-- 提现申请弹窗 -->
<template>
  <el-dialog
    title="提现申请"
    :visible.sync="open"
    width="400px"
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
      <el-form-item label="银行卡" prop="bankNumber">
        <el-select
          v-model="form.bankNumber"
          clearable
          filterable
          @change="bankChange"
          placeholder="请选择银行卡"
        >
          <el-option
            v-for="(item, index) in cardTypeList"
            :key="index"
            :label="item.bankName"
            :value="item.account"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提现到" prop="caseIn" v-if="form.bankNumber">
        <el-input
          type="textarea"
          v-model="caseIn"
          :readonly="true"
          :autosize="{ minRows: 3, maxRows: 4 }"
        />
      </el-form-item>
      <el-form-item label="可用余额" prop="amount">
        <el-input disabled v-model="form.amount" />
      </el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input v-model="form.money" />
      </el-form-item>
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
export default {
  data() {
    return {
      form: {
        bankMobile: null, //银行预留手机号
        bankAcountName: null, //姓名
        bankName: null, //所属银行
        bankNumber: null, //银行卡号
        money: null, //转账金额
        amount: null, //可用金额
      },
      loading: false,
      rules: {
        money: [
          { required: true, message: "提现金额不能为空", trigger: "blur" },
        ],
        bankNumber: [
          {
            required: true,
            message: "请选择银行卡",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    cardTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    amount: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  watch: {
    open() {
      if (this.open) {
        this.form.amount = this.amount;
        console.log(this.cardTypeList);
      }
    },
  },
  mounted() {},
  components: {},
  computed: {
    caseIn() {
      if (this.form.bankNumber === "") {
        return "";
      }
      console.log("this.form", this.form);
      let msg = "";
      msg += `账户名: ${this.form.bankAcountName}\n开户行: ${this.form.bankName}\n账号: ${this.form.bankNumber}`;
      return msg;
    },
  },
  methods: {
    bankChange(e) {
      console.log(e);
      const me = this;
      this.cardTypeList.forEach((el) => {
        console.log("el.account == e", el.account, e);
        if (el.account == e) {
          console.log("el", el);
          me.form.bankName = el.bankName;
          me.form.bankAcountName = el.name;
          me.form.bankMobile = el.phonenumber;
        }
      });
    },
    //提交
    submitForm() {
      const me = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          console.log(this.form);
          const body = {
            bankMobile: me.form.bankMobile,
            bankAcountName: me.form.bankAcountName,
            bankName: me.form.bankName,
            bankNumber: me.form.bankNumber,
            money: me.form.money,
          };
          const obj = {
            moduleName: "http_purse",
            method: "post",
            url_alias: "transferApply",
            data: body,
          };
          http_request(obj)
            .then((res) => {
              if(res.code == 200)
              this.msgSuccess(res.msg)
              console.log("transferApply", res);
              this.loading = false;
              this.$emit("colseDialog", "ok");
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    //关闭弹窗
    cancel() {
      this.$emit("colseDialog", "no");
    },
    initForm() {
      this.form = {
        bankMobile: null, //银行预留手机号
        bankAcountName: null, //姓名
        bankName: null, //所属银行
        bankNumber: null, //银行卡号
        money: null, //转账金额
        amount: null, //可用金额
      };
    },
  },
};
</script>
<style lang='scss' scoped>
/deep/ .el-input--small .el-input__inner {
  width: 230px;
}
/deep/ .el-textarea__inner {
  width: 230px;
  background: #f2f2f2;
}
/deep/ .el-dialog__body {
  padding: 15px 10px;
}
</style>
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
      <el-form-item label="银行卡" prop="cardId">
        <el-select
          v-model="form.cardId"
          clearable
          filterable
          placeholder="请选择银行卡"
        >
          <el-option
            v-for="(item, index) in cardTypeList"
            :key="index"
            :label="item.cardType"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提现到" prop="caseIn" v-if="form.cardId !== ''">
        <el-input
          type="textarea"
          v-model="caseIn"
          :readonly="true"
          :autosize="{ minRows: 3, maxRows: 4 }"
        />
      </el-form-item>
      <el-form-item label="可用余额" prop="rest">
        <el-input v-model="form.rest" :readonly="true" />
      </el-form-item>
      <el-form-item label="提现金额" prop="caseOut">
        <el-input v-model="form.caseOut"/>
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
export default {
  data() {
    return {
      form: {
        cardId: "",
        cardType: '',
        userName: '',
        acct: '',
        rest: "",
        caseOut: "",
      },
      loading: false,
      rules: {
        caseOut: [
          { required: true, message: "提现金额不能为空", trigger: "blur" },
        ],
        cardId: [{
            required: true,
            message: "请选择银行卡",
            trigger: ["change", "blur"],
          },]
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
    overviewData: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  components: {},

  computed: {
    caseIn() {
      if (this.form.cardId === "") {
        return "";
      }
      let msg = "";
      let cardInfo = this.cardTypeList[this.form.cardId];
      msg += `账户名: ${cardInfo.userName}\n开户行: ${cardInfo.cardType}\n账号: ${cardInfo.acct}`;
      return msg;
    },
  },

  mounted() {
    this.form.rest = this.overviewData.rest;
  },

  methods: {
    submitForm() {
      this.$refs["form"].validate((valid) => {
        this.cardTypeList.map(item => {
          if (item.id === this.form.cardId) {
            this.form.userName = item.userName;
            this.form.acct = item.acct;
            this.form.cardType = item.cardType;
          }
        })
        console.log(this.form)
      })
      // if (this.form.cardId === '') {
      //   return;
      // }
      // if (this.form.caseOut === '') {
      //   return;
      // }
      
      // this.cancel();
    },
    //关闭弹窗
    cancel() {
      this.form.cardId = '';
      this.form.caseOut = '';
      this.form.cardType = '';
      this.form.userName = '';
      this.form.acct = '';
      this.$emit("colseDialog", false);
      // this.reset();
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
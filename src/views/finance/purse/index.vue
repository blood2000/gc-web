<!-- 钱包 -->
<template>
  <div class="device-info">
    <div class="device-info-right">
      <div class="device-info-right-bottom main-box">
        <div class="card-title">我的账户</div>
        <div class="overview-box">
          <div>
            <div>{{ dealAmount | priceFormat }} <span>元</span></div>
            <div class="overview-value">可用余额</div>
          </div>

          <div>
            <div>{{ pageData.isWithdrawing | priceFormat }} <span>元</span></div>
            <div class="overview-value">提现处理中金额</div>
          </div>
        </div>
        <div class="btn-box">
          <div class="as-btn" @click="applyCash">提现</div>
          <div @click="toReport(1)">交易明细</div>
          <div @click="toReport(0)">提现记录</div>
          <div @click="toReport(2)">银行卡</div>
        </div>
      </div>
    </div>
    <Apply-Dialog
      :open="open"
      :cardTypeList="cardTypeList"
      :amount="dealAmount"
      @colseDialog="colseDialog"
    >
    </Apply-Dialog>
  </div>
</template>

<script>
import { http_request } from "@/api";
import QueryForm from "./components/queryForm.vue";
import ApplyDialog from "./components/ApplyDialog.vue";
import format from "../../../utils/format";
// import store from "@/store";
export default {
  name: "purse", // 钱包
  components: { QueryForm, ApplyDialog },
  data() {
    return {
      showSearch: true, //搜索显隐
      loading: false, //表格load
      cardTypeList: [],
      open: false,
      pageData: {},
    };
  },

  filters: {
    priceFormat: val => {
      return format.priceFormat(val, 2);
    }
  },

  computed: {
    dealAmount(){
      return  this.pageData.amount -  this.pageData.freezeAmount
    }
     
  },

  created() {},
  mounted() {
    this.getPurseInfo();
    this.getBankCardList();
  },

  methods: {
    async getBankCardList() {
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "carList",
        data: { pageNum: 1, pageSize: 1000 },
      };
      const res = await http_request(obj);
      console.log("getBankCardList res", res);
      this.cardTypeList = res.data.rows;
    },
    //获取钱包信息
    async getPurseInfo() {
      const obj = {
        moduleName: "http_purse",
        method: "get",
        url_alias: "getInfoPersonWallet",
      };
      const res = await http_request(obj);
      console.log("获取钱包信息 res", res);
      this.pageData = res.data;
    },
    //提现申请弹窗
    applyCash() {
      this.open = true;
    },

    //关闭弹窗
    colseDialog(e) {
      console.log('e',e)
      if(e == 'ok'){
        this.getPurseInfo()
      }
      this.open = false;
    },

    // 跳转页面
    toReport(type) {
      const obj = {
        0: "caseReport",
        1: "detailedRecord",
        2: "bankCard",
      };
      const paths = obj[type];
      this.$router.push(paths);
    },
  },
};
</script>
<style lang="scss" scoped>
.device-info {
  margin: 0 15px;
  @mixin box-shadow {
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left {
    @include box-shadow;
    margin-bottom: 0;
    min-height: calc(100vh - 192px);
  }

  .device-info-right {
    .device-info-right-top {
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom {
      @include box-shadow;
    }
    .main-box {
      padding: 10px 20px;
    }
  }
}
.deviceInf-cion {
  display: flex;
  flex-direction: row;
  width: 20xp;
  height: 20px;
}
.loadTemplate {
  padding-left: 15px;
  padding-right: 5px;
  padding-top: 3px !important;
  color: #409eff;
  font-size: 14px;
}

.card-title {
  position: relative;
  font-size: 14px;
  font-weight: bold;
  height: 30px;
}

.card-title::before {
  position: absolute;
  content: "";
  top: 2px;
  left: -10px;
  background: #1890ff;
  width: 2px;
  height: 16px;
  border-radius: 2px;
}

.card-title::after {
    content: '';
    height: 1px;
    position: absolute;
    left: -20px;
    right: -20px;
    bottom: 0;
    background: #F3F3F3;
}

.overview-box {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.overview-box > div {
  margin-right: 200px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.overview-box .overview-value,
.overview-box span {
  font-size: 14px;
  font-weight: normal;
}

.btn-box {
  padding: 20px 20px 10px;
  display: flex;
  align-items: center;
}

.btn-box > div {
  font-size: 14px;
  color: #169bd5;
  cursor: pointer;
  margin-right: 30px;
}

.btn-box .as-btn {
  width: 80px;
  height: 36px;
  margin-right: 40px;
  line-height: 36px;
  text-align: center;
  border-radius: 6px;
  background: #169bd5;
  color: #fff;
  font-size: 14px;
}
</style>

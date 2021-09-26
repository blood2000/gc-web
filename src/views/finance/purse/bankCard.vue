<template>
  <div>
    <div class="app-container app-container--search">
      <QueryForm
        v-model="queryParams"
        @handleQuery="searchQuery"
        :bank-name-list="bankNameList"
      />
    </div>
    <div class="app-container">
      <div class="tools">
        <el-button type="primary" :loading="btnLoading" @click="handleExport"
          >导出</el-button
        >
      </div>
      <div class="card-list">
        <div
          class="card-list-item"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <el-button
            round
            size="mini"
            class="card-list-item-del"
            @click="handleDelBankCard(item)"
            >解绑</el-button
          >
          <div class="card-list-item-bank">{{ item.bankName }}</div>
          <div>
            <span class="card-list-item-name">{{ item.name }}</span
            ><span>{{ item.mobile }}</span>
          </div>
          <div class="card-list-item-number">
            {{ showBankCard(item.account) }}
          </div>
        </div>
        <div class="card-list-item card_add_text" @click="handleAdd">
          添加银行卡
        </div>
      </div>
    </div>
    <!-- 添加弹窗 -->
    <AddCardBank :add-open="addOpen" @colseDialog="colseDialog" />
  </div>
</template>
<script>
import { http_request } from "../../../api";
import QueryForm from "./components/cardQueryForm.vue";
import AddCardBank from "./components/addBankCard.vue";

export default {
  name: "caseReport",
  components: { QueryForm, AddCardBank },
  data() {
    return {
      btnLoading: false,
      total: 0,
      tableData: [],
      queryParams: {
        //搜索栏
        mobile: null, //银行预留手机
        name: null, //开户姓名
        pageNum: 1,
        pageSize: 1000,
        bankName: null,
        account: null,
        mobile: null,
        userName: null,
      },
      tableColumnsConfig: [],
      bankNameList: [],
      addOpen: false,
    };
  },
  computed: {},
  mounted() {
    this.getDicts("bank").then((response) => {
      this.$store.commit("set_bank", response.data);
      console.log("this.$store.state.dict.bank", this.$store.state.dict.bank);
      this.bankNameList = this.$store.state.dict.bank;
    });
    this.searchQuery();
  },
  created() {},
  computed: {},
  methods: {
    handleDelBankCard(item) {
      console.log("item", item);
      this.$confirm("是否确认删除此银行卡?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const id = item.id;
          const obj = {
            moduleName: "http_purse",
            method: "delete",
            url_alias: "delList",
            url_code: [id],
          };
          return http_request(obj);
        })
        .then(() => {
          this.searchQuery();
          this.msgSuccess("删除成功");
        });
    },
    handleAdd() {
      this.addOpen = true;
    },
    showBankCard(val) {
      let result = "";
      if (val) {
        result = val.replace(/(\d{4})(?=\d\d)/g, "$1 ");
      } else {
        result = val;
      }
      return result;
    },
    handleExport() {},
    changeCheck(e) {
      this.getList();
      console.log("e", e);
    },
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_purse",
        method: "post",
        url_alias: "carList",
        data: this.formToList(),
      };
      const res = await http_request(obj);
      console.log("res", res);
      this.tableData = res.data.rows;
      this.loading = false;
    },

    formToList() {
      console.log('this.queryParams',this.queryParams)
      return {
        mobile: this.queryParams.mobile, //银行预留手机
        name: this.queryParams.name, //开户姓名
        pageNum: 1,
        pageSize: 1000,
        bankName: this.queryParams.bankName,
        account: this.queryParams.account,
        mobile: this.queryParams.mobile,
        userName: this.queryParams.userName,
      };
    },
    colseDialog(e) {
      console.log("关闭。。。", e);
      this.addOpen = false;
      if (e == "ok") this.searchQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  .card_add_text {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
  .bank-card-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 30px;
  }
  .card-list-item {
    position: relative;
    width: 343px;
    height: 121px;
    background-image: url("../../../assets/images/device/card_bg.png");
    background-size: 343px 121px;
    background-repeat: no-repeat;
    padding: 10px 50px;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    justify-content: space-around;
    margin-right: 20px;
    &-del {
      position: absolute;
      right: 10px;
      top: 10px;
      color: red;
    }
    &-number {
      background: #ffffff;
      color: #131313;
      text-align: center;
      padding: 5px 0;
    }
    &-name {
      margin-right: 40px;
    }
    &-bank {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
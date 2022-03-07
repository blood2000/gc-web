<template>
  <div class="companyItem">
    <div class="search">
      <el-input
        class="search-input"
        placeholder="请输入企业名称/联系人/电话号码搜索"
        prefix-icon="el-icon-search"
        v-model="keyword"
        clearable
      >
      </el-input>
      <el-button @click="search" type="primary" class="search-btn"
        >搜索</el-button
      >
    </div>
    <el-radio-group v-model="radioValue" class="company-list">
      <el-radio
        class="company-list-item"
        :label="index"
        :key="index"
        :style="{ background: index == radioValue ? '#F5F9FB' : '#fff' }"
        v-for="(item, index) in companyList"
      >
        <div class="company-list-item-content">
          <div class="address">{{ item.shipmentName }}</div>
          <div class="userInfo">
            <div class="userInfo-name">{{ item.contactName }}</div>
            <div class="userInfo-telphone">{{ item.contactPhone }}</div>
          </div>
        </div>
      </el-radio>
    </el-radio-group>
    <div class="btn-group">
      <el-button
        type="text"
        style="color: #8592ad"
        class="search-btn"
        @click="$emit('handleInnerClose')"
        >取消</el-button
      >
      <el-button type="primary" @click="comform" class="search-btn"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script>
import { http_request } from "../../../../api";
export default {
  data() {
    return {
      keyword: null,
      radioValue: 0,
      companyList: [],
    };
  },
  props: {},
  mounted() {
    this.getCompanyList();
  },
  methods: {
    comform() {
      console.log(this.radioValue);
      const data = this.companyList[this.radioValue]
      console.log('data',data)
      this.$emit('companySelection',data)
      this.$emit('handleInnerClose')
      
    },
    search() {
      console.log("this.keyword", this.keyword);
      this.getCompanyList();
    },
    getCompanyList() {
      const params = {
        pageSize: 1000,
        pageNum: 1,
      };
      const obj = {
        moduleName: "http_common",
        method: "post",
        url_alias: "shipment_llist",
        data: params,
      };
      if (this.keyword) {
        params.keyWords = this.keyword;
      } else {
        delete params.keyWords;
      }
      http_request(obj).then((res) => {
        console.log("shipment_all res", res);
        this.companyList = res.data.rows;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.companyItem {
  padding: 23px 22px 28px 28px;
}
.search {
  display: flex;
  align-items: center;
  &-input {
    width: 312px;
    margin-right: 16px;
  }
  &-btn {
    width: 80px;
    height: 36px;
  }
}
.company-list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.company-list {
  margin-top: 16px;
  height: calc(100% - 108px);
  overflow: auto;
  width: 100%;
  &-item:nth-child(1) {
    border-top: 1px solid #e4ecf4;
  }
  &-item {
    border-bottom: 1px solid #e4ecf4;
    height: 72px;
    box-sizing: border-box;
    padding: 15px 0;
    display: flex;
    &-content {
      flex: 1;
      height: 100%;
      padding-left: 6px;
      .address {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;
        color: #3d4050;
      }
      .userInfo {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #3d4050;
        display: flex;
        &-name {
          margin-right: 23px;
        }
      }
    }
  }
}
.btn-group {
  margin:20px 0;
      padding-bottom: 20px;
  float: right;
}
::v-deep .el-radio__input {
  line-height: 32px !important;
  padding-left: 5px;
}
::v-deep .el-radio {
  margin-right: 0;
}
</style>
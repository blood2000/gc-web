<template>
  <div class="pages-info">
    <div class="pages-info-right">
      <!-- 上：搜索 -->
      <QueryForm v-model="queryParams" @handleQuery="searchQuery" />
      <!-- 分割线 -->
      <div class="divier"></div>
      <div class="page-table-layout-set">
        <!-- 操作栏 -->
        <div class="toolsbar">
          <el-button type="primary" size="mini" @click="addCompany"
            >添加用车企业</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="multiple"
            @click="handleDelete"
          >
            删除
          </el-button>
        </div>
        <RefactorTable
          :is-show-index="false"
          :loading="loading"
          :data="tableData"
          row-key="id"
          :table-columns-config="tableColumnsConfig"
          @selection-change="handleSelectionChange"
          :border="false"
          :stripe="true"
        >
          <template #source="{ row }">
            <span>{{ sourceConfig[row.source] }}</span>
          </template>
          <template #edit="{ row }">
            <el-button size="mini" type="text" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </RefactorTable>
      </div>
      <!-- 分页 -->
      <pagination
        :total="total"
        layout="prev, pager, next,jumper, total,sizes"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <AddCompany
      :options="{ editType: editType, code: dialogCode }"
      :open="open"
      :title="title"
      @colseDialog="colseDialog"
    />
  </div>
</template>

<script>
import QueryForm from "./components/queryForm.vue";
import AddCompany from "./components/company_dialog.vue";
import { tableColumnsConfig } from "./config";
import { http_request } from "../../../api";
export default {
  name: "company",
  components: { QueryForm, AddCompany },
  data() {
    return {
      loading: false,
      tableData: [],
      tableColumnsConfig: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentName: null, //企业名称
        contactName: null, //联系人
        contactPhone: null, //联系人电话
      },
      total: 0,
      multiple: true,
      ids: [],
      selection: [], // 被勾选表格数据

      open: false,
      title: "",
      editType: "",
      dialogCode: null,
    };
  },
  mounted() {
    this.tableColumnsConfig = tableColumnsConfig;
    this.searchQuery();
  },
  methods: {
    handleUpdate(obj) {
      this.title = "修改企业弹窗";
      this.editType = "update";
      this.open = true;
      console.log("修改企业弹窗 ckc obj ", obj.id);
      this.dialogCode = obj.id;
    },
    async handleDelete(obj = {}) {
      console.log("obj", obj);
      const ids = obj.id ? [Number(obj.id)] : this.ids;
      this.$confirm("删除操作不可恢复，确认要删除该常用企业吗？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log("开始删了 ids", ids);
        const tmp = {
          moduleName: "http_company",
          method: "post",
          url_alias: "shipment_common_del",
          data: { ids },
        };
        http_request(tmp).then(() => {
          this.searchQuery();
          this.msgSuccess("删除成功");
        });
      });
    },
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_company",
        method: "post",
        url_alias: "shipment_list",
        data: this.pagingToFrom(),
      };
      console.log("所有参数列表", obj);
      const res = await http_request(obj);
      if (res.code == "200") {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
      } else {
        console.log("error", res);
        this.loading = false;
      }
    },
    pagingToFrom() {
      const tmp = JSON.parse(JSON.stringify(this.queryParams));
      for (const item in tmp) {
        if (!tmp[item]) {
          delete tmp[item];
        }
      }
      return tmp;
    },
    addCompany() {
      this.title = "新增企业弹窗";
      this.editType = "add";
      this.open = true;
    },
    //发送搜索请求
    searchQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    colseDialog(e) {
      console.log("关闭。。。", e);
      this.open = false;
      if (e == "ok") this.searchQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selection = selection;
      this.ids = selection.map((item) => Number(item.id));
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
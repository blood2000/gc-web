<template>
  <div>
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="地址" prop="addressName">
        <el-input
          v-model="queryParams.addressName"
          placeholder="请输入地址名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="地址别名" prop="addressAlias">
        <el-input
          v-model="queryParams.addressAlias"
          placeholder="请输入地址别名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="地址类型" prop="addressType">
        <el-select
          v-model="queryParams.addressType"
          placeholder="请选择地址类型"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="(dict, index) in addressTypeOptions"
            :key="dict.dictValue + index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-radio-group v-model="radio" style="width: 100%" @change="handlerChange">
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="addressList"
        border
      >
        <el-table-column
          show-overflow-tooltip
          label=""
          align="center"
          width="50"
        >
          <template slot-scope="scope">
            <el-radio :label="scope.row.id">
              <div v-show="false" />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          align="center"
          prop="addressType"
          width="50"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.addressType == '1'"
              ><el-tag style="margin-right: 10px; padding: 0 8px"
                >装</el-tag
              ></template
            >
            <template v-else-if="scope.row.addressType == '2'"
              ><el-tag style="margin-right: 10px; padding: 0 8px" type="success"
                >卸</el-tag
              ></template
            >
            <template v-else>-</template>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          label="地址"
          align="center"
          prop="addressName"
        >
          <template slot-scope="scope">
            {{ handlerAddressName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="详情地址"
          align="center"
          prop="detail"
        />
        <el-table-column
          show-overflow-tooltip
          label="地址别名"
          align="center"
          prop="addressAlias"
        />
        <el-table-column
          show-overflow-tooltip
          label="联系人"
          align="center"
          prop="contact"
        />
        <el-table-column
          show-overflow-tooltip
          label="联系电话"
          align="center"
          prop="contactPhone"
        />
        <el-table-column
          show-overflow-tooltip
          label="状态"
          align="center"
          prop="status"
          :formatter="statusFormat"
        />
      </el-table>
    </el-radio-group>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div class="ly-t-right mt20">
      <el-button type="primary" @click="handlerClick">确定</el-button>
    </div>
  </div>
</template>

<script>
import { http_request } from "../../../../api";

export default {
  props: {
    opaddresstype: { type: Number, default: 1 },
  },
  data() {
    return {
      radio: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      addressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 地址类型字典
      addressTypeOptions: [
        { dictLabel: "装货地址", dictValue: 1 },
        { dictLabel: "卸货地址", dictValue: 2 },
      ],
      // 状态字典
      statusOptions: [
        { dictLabel: "启用", dictValue: 1 },
        { dictLabel: "禁用", dictValue: 2 },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1, //
        pageSize: 10, //
        addressType: null, //
        addressName: null, //
        addressAlias: null, //
        contact: null, //
        contactPhone: null, //
      },

      isSelected: {},
    };
  },

  computed: {},
  created() {
    this.queryParams.addressType = this.opaddresstype;
    this.getList();
  },
  methods: {
    /** 查询常用地址列表 */
    async getList() {
      this.loading = true;
      const obj = {
        moduleName: "http_common",
        method: "post",
        url_alias: "address_list",
        data: this.queryParams,
      };
      const res = await http_request(obj);
      this.addressList = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
    },
    // 地址类型字典翻译
    addressTypeFormat(row, column) {
      return this.selectDictLabel(this.addressTypeOptions, row.addressType);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    handlerChange(value) {
      const arr = this.addressList.filter((e) => {
        return e.id - 0 === value - 0;
      });
      this.isSelected = arr[0];
    },

    handlerClick() {
      this.$emit("radioSelection", this.isSelected);
    },

    handlerAddressName(row) {
      const { provinceName, cityName, districtName } = row;
      if (provinceName || cityName || districtName) {
        return provinceName + cityName + districtName;
      } else {
        return row.province + row.city + row.district;
      }
    },
  },
};
</script>

<template>
  <!-- 设置职员 -->
  <el-dialog :title="title" :visible="visible" width="700px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <div style="text-align: center;">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="value"
        filterable
        :titles="['未分配', '已分配']"
        :filter-method="filterMethod"
        :props="{
          key: 'employeeCode',
          label: 'nickName'
        }"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :data="data">
        <span slot-scope="{ option }">{{ option.nickName }}</span>
      </el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from '@/api';
export default {
  name: 'SettingEmployee',
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      loading: false,
      // 当前角色code
      roleCode: null,
      // 全部职员
      data: [],
      // 选中的职员
      value: []
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
  },
  methods: {
    filterMethod(query, item) {
      return item.nickName.indexOf(query) > -1;
    },
    /** 根据角色编号获取角色分配职员信息（含未分配） */
    roleAssignEmployeeInfo(code) {
      this.roleCode = code;
      const obj = {
        moduleName: 'http_role',
        method: 'get',
        url_alias: 'roleAssignEmployeeInfo',
        url_code: [code]
      }
      http_request(obj).then(response => {
        const { allEmployeeList, assignedEmployeeList } = response.data;
        this.data = allEmployeeList || [];
        // 构造value值
        if (assignedEmployeeList && assignedEmployeeList.length > 0) {
          this.value = allEmployeeList.reduce((total, cur) => {
            assignedEmployeeList.forEach(el => {
              if (el.employeeCode === cur.employeeCode) {
                total.push(el.employeeCode);
              }
            });
            return total;
          }, []);
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      const obj = {
        moduleName: 'http_role',
        method: 'post',
        url_alias: 'roleAssignEmployee',
        data: {
          roleCode: this.roleCode,
          employeeCodeList: this.value
        }
      }
      http_request(obj).then(response => {
        this.loading = false;
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 重置
    reset() {
      this.loading = false;
      this.data = [];
      this.value = [];
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

<template>
  <!-- 功能分配 -->
  <el-dialog :title="title" :visible="visible" width="600px" class="own-setting-resourse-dialog" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="菜单权限">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.menuCheckStrictlyFlag" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
        <el-tree
          ref="menu"
          class="tree-border own-version-menu-tree"
          :data="menuOptions"
          show-checkbox
          node-key="code"
          :check-strictly="!form.menuCheckStrictlyFlag"
          :indent="0"
          empty-text="暂无数据"
          :props="defaultProps"
          :default-expanded-keys="defaultExpandedKeys"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from '@/api';
export default {
  name: 'SettingResource',
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
      // 菜单列表
      menuOptions: [],
      menuAllKeys: [],
      // 全选/全不选
      menuNodeAll: false,
      // 菜单默认展开
      menuExpand: false,
      defaultExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      form: {}
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
    setRoleMenuTreeselect(code) {
      this.roleCode = code;
      const roleMenu = this.getRoleMenuTreeselect(code);
      roleMenu.then(res => {
        this.$refs.menu.setCheckedKeys(res.data.checkedKeys);
      });
    },
    /** 根据角色code查询菜单树结构 */
    getRoleMenuTreeselect(code) {
      const obj = {
        moduleName: 'http_role',
        method: 'get',
        url_alias: 'roleMenuTree',
        url_code: [code]
      }
      return http_request(obj).then(response => {
        this.menuOptions = response.data.menus;
        this.defaultExpandedKeys = response.data.expandKeys;
        this.menuAllKeys = response.data.allKeys;
        this.form.menuCheckStrictlyFlag = response.data.menuCheckStrictlyFlag;
        return response;
      });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      const treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].code].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedKeys(value ? this.menuAllKeys : []);
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.menuCheckStrictlyFlag = !!value;
    },
    // 获取选中的菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      const obj = {
        moduleName: 'http_role',
        method: 'post',
        url_alias: 'roleAssignMenu',
        data: {
          roleCode: this.roleCode,
          menuCodeList: this.getMenuAllCheckedKeys(),
          menuCheckStrictlyFlag: this.form.menuCheckStrictlyFlag
        }
      }
      http_request(obj).then(response => {
        this.loading = false;
        this.msgSuccess('操作成功');
        this.close();
        this.$emit('refresh');
      }).catch(e => {
        this.loading = false;
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
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.form = {
        menuCheckStrictlyFlag: true
      };
      this.resetForm('form');
    }
  }
};
</script>

<style lang="scss">
.own-setting-resourse-dialog{
  .el-dialog__body{
    padding-top: 10px;
  }
}
.own-version-menu-tree{
  .el-tree-node__content{
    .el-checkbox{
      &.is-disabled{
        display: none;
      }
    }
  }
}
</style>

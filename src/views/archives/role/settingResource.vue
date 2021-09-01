<template>
  <!-- 设置资源 -->
  <el-dialog :title="title" :visible="visible" width="600px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-tree
      :data="menuOptions"
      show-checkbox
      ref="menu"
      node-key="id"
      empty-text="加载中，请稍后"
      :props="defaultProps"
    ></el-tree>
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
      // 菜单列表
      menuOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
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
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      // openInvoice(this.form).then(response => {
      //   this.loading = false;
      //   this.msgSuccess('操作成功');
      //   this.close();
      //   this.$emit('refresh');
      // });
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
    },
    // 赋值
    setForm(data) {
      
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

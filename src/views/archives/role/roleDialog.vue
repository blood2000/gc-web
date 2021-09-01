<template>
  <!-- 新增/修改角色信息 -->
  <el-dialog :title="title" :visible="visible" width="600px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" class="width90" placeholder="请输入备注" clearable />
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
  name: 'RoleDialog',
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
      // 表单参数
      form: {
        roleName: null,
        remark: null
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          // openInvoice(this.form).then(response => {
          //   this.loading = false;
          //   this.msgSuccess('操作成功');
          //   this.close();
          //   this.$emit('refresh');
          // });
        }
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
    // 表单重置
    reset() {
      this.form = {
        roleName: null,
        remark: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

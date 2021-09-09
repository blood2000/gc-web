<template>
  <!-- 重置密码 -->
  <el-dialog :title="title" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="0px">
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { http_request } from '@/api';
import { sha1 } from '@/utils/sha1';
export default {
  props: {
    open: Boolean,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userCode: null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { validator: this.formValidate.passWord, trigger: 'blur' }
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
  methods: {
    // 提交按钮
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 修改密码
          const obj = {
            moduleName: 'http_driver',
            method: 'post',
            url_alias: 'driver_reset_pwd',
            data: {
              userCode: this.userCode,
              password: this.form.password
            }
          }
          http_request(obj).then(() => {
            this.msgSuccess('设置成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset(userCode) {
      this.userCode = userCode;
      this.form = {
        password: null
      };
      this.resetForm('form');
    }
  }
};
</script>

<template>
  <!-- 设置职员 -->
  <el-dialog :title="title" :visible="visible" width="700px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <div style="text-align: center;">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="value"
        filterable
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="data">
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
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
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${ i }`
        });
      }
      return data;
    };
    return {
      loading: false,
      data: generateData(),
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
      
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

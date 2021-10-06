<template>
  <!-- 新增/修改职员信息 -->
  <el-dialog :title="title" :visible="visible" width="600px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="上级组织" prop="parentId">
        <treeselect
          v-model="form.parentId"
          :options="deptOptions"
          :normalizer="normalizer"
          :show-count="true"
          placeholder="请选择上级组织"
          @select="selectOrgCode"
        />
      </el-form-item>
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model="form.orgName" placeholder="请输入组织名称" clearable />
      </el-form-item>
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="form.orderNum" controls-position="right" :precision="0" :min="0" style="width:100%"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { http_request } from '@/api';
export default {
  name: 'OrgDialog',
  components: {
    Treeselect
  },
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
        parentId: null,
        orgName: null,
        orderNum: null,
        code: null
      },
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级组织不能为空', trigger: ['change', 'blur'] }
        ],
        orgName: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '显示排序不能为空', trigger: 'blur' }
        ]
      },
      // 部门树选项
      deptOptions: [],
      // 部门树键值转换
      normalizer(node) {
        if (node.children == null || node.children == "null") {
          delete node.children;
        }
        const obj = {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.orgName,
          // children: node.childrenOrgList,
        };
        if (node.childrenOrgList && node.childrenOrgList.length > 0) {
          obj.children = node.childrenOrgList;
        }
        return obj;
      },
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
    this.getTree();
  },
  methods: {
    /** 获取组织树 */
    getTree() {
      const obj = {
        moduleName: 'http_org',
        method: 'get',
        url_alias: 'orgTree'
      }
      http_request(obj).then(res => {
        this.deptOptions = res.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.form.code) {
            // 编辑
            const obj = {
              moduleName: 'http_org',
              method: 'put',
              url_alias: 'editOrg',
              data: this.form
            }
            http_request(obj).then(res => {
              this.loading = false;
              this.msgSuccess('操作成功');
              this.close();
              this.$emit('refresh');
              this.getTree();
            }).catch(e => {
              this.loading = false;
            });
          } else {
            // 新增
            const obj = {
              moduleName: 'http_org',
              method: 'post',
              url_alias: 'addOrg',
              data: this.form
            }
            http_request(obj).then(res => {
              this.loading = false;
              this.msgSuccess('操作成功');
              this.close();
              this.$emit('refresh');
              this.getTree();
            }).catch(e => {
              this.loading = false;
            });
          }
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    /** 关闭弹窗 */
    close() {
      this.$emit('update:open', false);
    },
    /** 表单重置 */
    reset(id) {
      this.form = {
        parentId: id || null,
        orgName: null,
        orderNum: null,
        code: null
      };
      this.resetForm('form');
    },
    /** 表单赋值 */
    setForm(data) {
      this.form = {
        parentId: data.parentId,
        orgName: data.orgName,
        orderNum: data.orderNum,
        code: data.code
      };
    },
    /** 手动刷新校验 */
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField('parentId');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
</style>

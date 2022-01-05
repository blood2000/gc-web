<template>
  <!-- 新增/修改职员信息 -->
  <el-dialog :title="title" :visible="visible" width="600px" append-to-body destroy-on-close :close-on-click-modal="false" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="用户姓名" prop="nickName" >
        <el-input v-model="form.nickName" placeholder="请输入用户姓名" clearable  :disabled="options&&options.editType && form.nickNameModifiable !== 1"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="form.phonenumber" placeholder="请输入手机号码" clearable :disabled="!!form.employeeCode" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入登录密码" clearable style="width: 60%" class="mr10" />
        <span class="g-color-blue">(初始密码为{{ initialPassword }})</span>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgCode">
        <treeselect
          v-model="form.orgCode"
          :options="deptOptions"
          :normalizer="normalizer"
          :show-count="true"
          placeholder="请选择所属组织"
          no-results-text="无匹配数据"
          :append-to-body="true"
          zIndex="2050"
          @select="selectOrgCode"
        />
      </el-form-item>
      <el-form-item label="所属角色" prop="roleCodeList">
        <el-select v-model="form.roleCodeList" multiple placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in roleOptions"
            :key="item.code"
            :label="item.roleName"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" maxlength="20" show-word-limit placeholder="请输入备注" clearable />
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
const Base64 = require('js-base64').Base64;
export default {
  name: 'EmployeeDialog',
  components: {
    Treeselect
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    options:{
      type:Object,
      default:{}
    },
    open: Boolean
  },
  data() {
    return {
      loading: false,
      // 表单参数
      form: {
        phonenumber: null,
        nickName: null,
        password: null,
        orgCode: null,
        roleCodeList: null,
        remark: null
      },
      // 表单校验
      rules: {
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { validator: this.formValidate.name, trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '所属组织不能为空', trigger: ['change', 'blur'] }
        ],
        roleCodeList: [
          { required: true, message: '所属角色不能为空', trigger: ['change', 'blur'] }
        ],
        password: [
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ]
      },
      // 初始密码
      initialPassword: 'abcd1234@',
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
      // 角色树选项
      roleOptions: []
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
    this.getRoleList();
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
    /** 获取角色列表 */
    getRoleList() {
      const obj = {
        moduleName: 'http_role',
        method: 'get',
        url_alias: 'roleList'
      }
      http_request(obj).then(res => {
        this.roleOptions = res.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      const _this = this;
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          // 判断手机号是否存在
          // 宇宏说先注释掉
          // const { data } = await http_request({
          //   moduleName: 'http_employee',
          //   method: 'get',
          //   url_alias: 'checkPhoneExist',
          //   data: {
          //     phonenumber: this.form.phonenumber
          //   }
          // })
          this.loading = true;
          // 密码加密
          if (this.form.password && this.form.password !== '') {
            this.form.password = Base64.encode(this.form.password);
          }
          if (this.form.employeeCode) {
            // 编辑
            const obj = {
              moduleName: 'http_employee',
              method: 'put',
              url_alias: 'editEmployee',
              data: this.form
            }
            http_request(obj).then(res => {
              this.loading = false;
              this.msgSuccess('操作成功');
              this.close();
              this.$emit('refresh');
            }).catch(e => {
              this.loading = false;
            });
          } else {
            // 新增
            const obj = {
              moduleName: 'http_employee',
              method: 'post',
              url_alias: 'addEmployee',
              data: this.form
            }
            // 手机号已存在
            if (data.phoneExist) {
              // 允许绑定
              if (data.allowBind) {
                this.$confirm('手机号已存在，是否绑定该手机号?', '警告', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(function() {
                  // 绑定
                  return http_request({
                    moduleName: 'http_employee',
                    method: 'post',
                    url_alias: 'bindByphoneNumber',
                    data: _this.form
                  })
                }).then(() => {
                  this.loading = false;
                  this.msgSuccess('操作成功');
                  this.close();
                  this.$emit('refresh');
                }).catch(() => {
                  this.loading = false;
                });
              } else {
                // 不允许绑定
                this.msgWarning('该手机号已被使用');
                this.loading = false;
              }
            } else {
              // 手机号不存在, 新增
              http_request(obj).then(res => {
                this.loading = false;
                this.msgSuccess('操作成功');
                this.close();
                this.$emit('refresh');
              }).catch(e => {
                this.loading = false;
              });
            }
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
    reset(orgCode) {
      this.form = {
        employeeCode: null,
        phonenumber: null,
        nickName: null,
        password: null,
        orgCode: orgCode || null,
        roleCodeList: null,
        remark: null
      };
      this.resetForm('form');
    },
    /** 表单赋值 */
    setForm(data) {
      this.form = data;
    },
    /** 手动刷新校验 */
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField('orgCode');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-textarea .el-input__count{
  line-height: 20px;
}
</style>

<template>
  <el-dialog
    :visible.sync="visible"
    width="680px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="onClose"
    :destroy-on-close="true"
  >
    <template slot="title">
      <span class="dialog-header-title">{{ whichDialog ? titleOptions[whichDialog] : '' }}</span>
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      size="small"
      :disabled="whichDialog === 'detail' || whichDialog === 'viewWallet'"
      label-position="top"
    >
      <el-row>
        <el-col :span="24" v-show="whichDialog !== 'update' && !isWallet">
          <div class="addCaptain-moneyBar" v-show="whichDialog !== 'detail'">
            <span>是否开通个人钱包</span>
            <el-switch v-model="form.openPersonalWalletFlag" :disabled="whichDialog === 'detail'" />
          </div>
          <div class="addCaptain-moneyBar" v-show="whichDialog === 'detail'">
            <span>是否开通个人钱包</span>
            <div class="addCaptain-icon">
              <div class="icon" :class="'icon' + form.authStatus" />
              <span :class="'label' + form.authStatus">
                {{ authStatusLabel[form.authStatus] }}
              </span>
            </div>
          </div>
        </el-col>
        <div
          class="addCaptain-tips"
          v-show="whichDialog === 'update' && (form.authStatus === 1 || form.authStatus === 3)"
        >
          <i class="el-icon-warning" />
          <span>已{{ form.authStatus === 1 ? '申请' : '' }}开通钱包，姓名不可修改</span>
        </div>
        <div class="addCaptain-tips normal" v-show="whichDialog === 'openWallet'">
          <i class="el-icon-warning" />
          <span>补充身份证信息以申请开通个人钱包</span>
        </div>
        <div class="addCaptain-tips error" v-show="whichDialog === 'changeWallet'">
          <i class="el-icon-warning" />
          <span>审核失败，请完善身份证信息以重新开通个人钱包。</span>
        </div>
        <el-col :span="isWallet ? 24 : 12">
          <el-form-item
            label="手机号码"
            prop="phonenumber"
            v-if="(whichDialog === 'add' || whichDialog === 'detail') && !isWallet"
          >
            <el-input
              class="w256"
              v-model="form.phonenumber"
              placeholder=" 请输入手机号码"
              clearable
              size="medium"
              :disabled="whichDialog === 'detail'"
            />
          </el-form-item>
          <el-form-item prop="nickName" label="姓名">
            <el-input
              class="w256"
              v-model="form.nickName"
              placeholder="请输入姓名"
              clearable
              :disabled="whichDialog === 'detail' || form.authStatus === 1 || form.authStatus === 3"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isWallet">
          <el-form-item label="所属组织" prop="orgCode">
            <treeselect
              v-model="form.orgCode"
              :options="deptOptions"
              :disabled="whichDialog === 'detail'"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="请选择所属组织"
              no-results-text="无匹配数据"
              @select="selectOrgCode"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.openPersonalWalletFlag || isWallet">
          <el-col :span="12">
            <el-form-item label="身份证人像面:" prop="idCardFaceImageUrl">
              <ImageUploadSimple v-model="form.idCardFaceImageUrl" @input="chooseImg">
                <template slot="initImage">
                  <div class="dispatch-bg-upload dispatch-id_front">
                    <img src="../../../../assets/images/certificate/photograph.png" alt="" />
                  </div>
                </template>
              </ImageUploadSimple>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" 身份证国徽面:" prop="idCardEmblemImageUrl">
              <ImageUploadSimple v-model="form.idCardEmblemImageUrl" @input="chooseImgBack">
                <template slot="initImage">
                  <div class="dispatch-bg-upload dispatch-id_back">
                    <img src="../../../../assets/images/certificate/photograph.png" alt="" />
                  </div>
                </template>
              </ImageUploadSimple>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24" v-if="form.openPersonalWalletFlag || isWallet">
          <el-form-item style="display: inline-block" label="身份证号" prop="idNumber">
            <el-input class="w256" v-model="form.idNumber" placeholder="支持自动识别" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.openPersonalWalletFlag || isWallet">
          <el-form-item label="身份证有效日期" prop="idDateRange">
            <el-date-picker
              v-model="form.idDateRange"
              unlink-panels
              size="small"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="支持自动识别"
              end-placeholder="支持自动识别"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isWallet">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-show="whichDialog !== 'detail' && whichDialog !== 'viewWallet'" @click="onClose">
        取 消
      </el-button>
      <el-button
        v-show="
          whichDialog === 'add' ||
          whichDialog === 'update' ||
          whichDialog === 'openWallet' ||
          whichDialog === 'changeWallet'
        "
        type="primary"
        @click="onConfirm"
        :loading="loading"
      >
        确 认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImageUploadSimple from '@/components/ImageUpload/simple.vue'
import { http_request } from '../../../../api'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import formValidate from '../../../../utils/formValidate'

export default {
  name: 'vehicleDialog',
  components: { ImageUploadSimple, Treeselect },
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      whichDialog: '',
      isWallet: false,
      authStatusLabel: ['未开通', '审核中', '审核失败', '已开通'],
      titleOptions: {
        add: '添加车队长',
        detail: '车队长详情',
        update: '编辑车队长',
        openWallet: '申请开通钱包',
        changeWallet: '申请开通钱包',
        viewWallet: '申请开通钱包',
      },
      // 部门树选项
      deptOptions: [],
      form: {
        orgCode: null, //所属组织
        openPersonalWalletFlag: false, // 是否开通个人钱包v
        phonenumber: '', // 手机号
        nickName: '', // 姓名
        idCardFaceImageUrl: '', // 身份证人像面
        idCardEmblemImageUrl: '', // 身份证国徽面
        idNumber: '', // 身份证号
        idDateRange: [],
        validFromDate: '', // 身份证生效日期
        validToDate: '', // 身份证失效日期
        remark: '', // 备注
      },
      rules: {
        orgCode: [
          {
            required: true,
            message: '所属组织不能为空',
            trigger: ['change', 'blur'],
          },
        ],
        idCardFaceImageUrl: [{ required: true, message: '请上传身份证正面照', trigger: 'change' }],
        idCardEmblemImageUrl: [
          { required: true, message: '请上传身份证背面照', trigger: 'change' },
        ],
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { validator: formValidate.name, trigger: 'blur' },
        ],
        phonenumber: [
          { required: true, message: '手机不能为空', trigger: 'blur' },
          { validator: formValidate.telphone, trigger: 'blur' },
        ],
        idNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: formValidate.idCard, trigger: 'blur' },
        ],
        idDateRange: [{ required: true, message: '身份证有效日期不能为空', trigger: 'blur' }],
      },
      isDetail: false,
      // 部门树键值转换
      normalizer(node) {
        if (node.children == null || node.children == 'null') {
          delete node.children
        }
        const obj = {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.orgName,
          // children: node.childrenOrgList,
        }
        if (node.childrenOrgList && node.childrenOrgList.length > 0) {
          obj.children = node.childrenOrgList
        }
        return obj
      },
    }
  },
  created() {},
  mounted() {
    this.getTree()
  },
  methods: {
    open(whichDialog, teamLeaderCode) {
      this.isWallet = whichDialog.indexOf('Wallet') >= 0
      if (whichDialog !== 'add') {
        this.getDetail(teamLeaderCode)
      }
      this.visible = true
      this.whichDialog = whichDialog
    },
    onClose(which) {
      if (which === 'emit') {
        this.$emit('onEvent')
      }
      this.$refs.form.clearValidate()
      this.form = {
        orgCode: null, //所属组织
        openPersonalWalletFlag: false, // 是否开通个人钱包v
        phonenumber: '', // 手机号
        nickName: '', // 姓名
        idCardFaceImageUrl: '', // 身份证人像面
        idCardEmblemImageUrl: '', // 身份证国徽面
        idNumber: '',
        idDateRange: [],
        validFromDate: '', // 身份证生效日期
        validToDate: '', // 身份证失效日期
        remark: '', // 备注
      }
      this.loading = false
      this.visible = false
    },
    getDetail(teamLeaderCode) {
      const obj = {
        moduleName: 'http_carCaptain',
        method: 'get',
        url_alias: 'getDetail',
        url_code: [teamLeaderCode],
      }
      http_request(obj).then((res) => {
        if (res.data) {
          let data = res.data
          data.idDateRange =
            data.validFromDate && data.validToDate ? [data.validFromDate, data.validToDate] : []
          if (this.whichDialog === 'update') {
            data.openPersonalWalletFlag = false
          }
          this.form = data
        }
      })
    },
    // 获取组织树
    getTree() {
      const obj = {
        moduleName: 'http_org',
        method: 'get',
        url_alias: 'orgTree',
      }
      http_request(obj).then((res) => {
        this.deptOptions = res.data
      })
    },
    // 手动刷新校验
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField('orgCode')
      })
    },
    //身份证正面照/身份证反面照 上传结束后回调
    chooseImg(e) {
      console.log('chooseImg', e)
      this.ocrHttp(e, 0, 'front')
    },
    chooseImgBack(e) {
      console.log('chooseImg', e)
      this.ocrHttp(e, 0, 'back')
    },
    //ocr请求
    async ocrHttp(imgPath, type, side) {
      const obj = {
        moduleName: 'http_common',
        method: 'post',
        url_alias: 'ocr',
        data: {
          imgPath,
          type,
          side,
        },
      }
      if (type === 2) {
        obj.data.return_issuing_authority = true
      }
      const res = await http_request(obj)
      console.log('ocr请求', res)
      if (res.data && res.data.error_msg) {
        this.msgError('该照片非身份证类型，请重新上传')
        if (type === 0) {
          if (side === 'front') {
            this.idCardFaceImageUrl = null
          } else {
            this.idCardEmblemImageUrl = null
          }
        }
        return
      }
      this.ocrDataToForm(res.data.result, type)
      this.$refs.form.validateField([
        'nickName',
        'idCardFaceImageUrl',
        'idCardEmblemImageUrl',
        'idDateRange',
      ])
    },
    //ocr数据渲染页面
    ocrDataToForm(data, type) {
      const me = this
      const tmp = {
        0: () => {
          //身份证
          if (data.number) {
            me.form.idNumber = data.number
          }
          if (data.name) me.form.nickName = data.name
          let formTime = data.valid_from
          let toTime = data.valid_to
          if (formTime && toTime) {
            console.log('ocrDataToForm data', data)
            if (toTime == '长期') {
              this.isIdDateValid = false
            } else {
              this.isIdDateValid = true
              const checkToValue = me.checkOcrForm(toTime)
              if (!checkToValue) {
                toTime = null
              }
            }
            if (formTime) {
              const checkValue = me.checkOcrForm(formTime)
              if (!checkValue) {
                formTime = null
              }
            } else {
              formTime = null
            }
            me.form.idDateRange = [formTime, toTime]
          }
        },
        2: () => {
          console.log('ocrDataToForm 2')
          if (data.issuing_authority) me.form.issuingOrganizations = data.issuing_authority
          me.form.driverDateRange = [data.valid_from, data.valid_to]
        },
      }
      tmp[type]()
    },
    // 身份证日期判定
    checkOcrForm(dates) {
      const reg = /^(\d{1,4})(-)(\d{1,2})\2(\d{1,2})$/
      var r = dates.match(reg)
      if (r == null) {
        return false
      }
      return true
    },
    onConfirm() {
      if (this.whichDialog === 'add') {
        this.onSave()
      } else if (this.whichDialog === 'update') {
        this.onUpdate
      } else if (this.whichDialog === 'openWallet' || this.whichDialog === 'changeWallet') {
        this.onOpenWallet()
      }
    },
    // 保存
    onSave() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验成功
          const params = {
            moduleName: 'http_carCaptain',
            method: 'post',
            url_alias: 'addCaptain',
            data: {
              ...this.form,
              validFromDate: this.form.idDateRange[0],
              validToDate: this.form.idDateRange[1],
            },
          }
          this.loading = true
          http_request(params)
            .then((res) => {
              if (res.code != '200') {
                this.msgError('车队长添加失败')
              } else {
                this.msgSuccess('车队长添加成功')
              }
              this.loading = false
              this.onClose('emit')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 编辑
    onUpdate() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验成功
          const params = {
            moduleName: 'http_carCaptain',
            method: 'put',
            url_alias: 'updateCaptain',
            data: {
              teamLeaderCode: this.form.teamLeaderCode,
              nickName: this.form.nickName,
              orgCode: this.form.orgCode,
              remark: this.form.remark,
            },
          }
          this.loading = true
          http_request(params)
            .then((res) => {
              if (res.code != '200') {
                this.msgError('车队长编辑失败')
              } else {
                this.msgSuccess('车队长编辑成功')
              }
              this.loading = false
              this.onClose('emit')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    onOpenWallet() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验成功
          const params = {
            moduleName: 'http_carCaptain',
            method: 'put',
            url_alias: 'openWallet',
            data: {
              teamLeaderCode: this.form.teamLeaderCode,
              nickName: this.form.nickName,
              idCardFaceImageUrl: this.form.idCardFaceImageUrl,
              idCardEmblemImageUrl: this.form.idCardEmblemImageUrl,
              idNumber: this.form.idNumber,
              validFromDate: this.form.idDateRange[0],
              validToDate: this.form.idDateRange[1],
            },
          }
          this.loading = true
          http_request(params)
            .then((res) => {
              this.msgSuccess(res.msg)
              this.loading = false
              this.onClose('emit')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.w256 {
  width: 256px;
}
.mtb10 {
  margin: 10px 0;
}
.addCaptain {
  &-moneyBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  &-icon {
    display: flex;
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      background-size: 100% 100%;
      background-repeat: repeat;
      margin: 2px 5px 0 0;
      &.icon0 {
        background-image: url('~@/assets/images/icon/icon-captain-auth0.png');
      }
      &.icon1 {
        background-image: url('~@/assets/images/icon/icon-captain-auth1.png');
      }
      &.icon2 {
        background-image: url('~@/assets/images/icon/icon-captain-auth2.png');
      }
      &.icon3 {
        background-image: url('~@/assets/images/icon/icon-captain-auth3.png');
      }
    }
    .label0 {
      color: #b3b3b3;
    }
    .label1 {
      color: #ffbc00;
    }
    .label2 {
      color: #ef6969;
    }
    .label3 {
      color: #43b91e;
    }
  }
  &-tips {
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-radius: 2px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    margin: 5px 0 15px 0;
    i {
      margin-right: 8px;
      font-size: 18px;
      margin-top: -2px;
    }
    &.normal {
      background: #f5f8ff;
      border: 1px solid #95b7fa;
      i {
        color: #4682fa;
      }
    }
    &.error {
      background: #fff9f9;
      border: 1px solid #f1bbbb;
      i {
        color: #ef6969;
      }
    }
  }
}

.el-form-item__label {
  width: 120px !important;
}
.form-remark {
  display: flex;
}
.form-remark span {
  display: inline-block;
}
.upload-image-label {
  margin: 0;
  line-height: 24px;
}
.dialog-header-title {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #3d4050;
  opacity: 1;
  margin-right: 20px;
}

::v-deep .el-dialog__header {
  background: none !important;
  padding: 20px 20px 10px !important;
  border-bottom: none !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
::v-deep .el-dialog__footer {
  border-top: none !important;
}
::v-deep .el-form-item__label {
  line-height: normal;
}
</style>

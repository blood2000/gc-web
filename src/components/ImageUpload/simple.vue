<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      :data="uploadData"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      :disabled="disabled"
      accept=".jpg,.png,.jpeg"
      style="display: inline-block; vertical-align: top"
      class="upload-image"
    >

      <img v-if="value && !disabled" :src="attachUrl" class="avatar">
      <!-- <div v-if="value && !disabled && attachUrl && attachUrl !== ''" class="avatar-box" :style="{background: `url('${attachUrl}') center center /contain no-repeat`}" /> -->
      <div v-else-if="value && disabled" class="avatar-box">
        <!-- 只有这里能放img标签，只有控件被禁用才能查看图片大图 -->
        <img :src="attachUrl" class="avatar">
      </div>
      <template v-else>
        <!-- <i class="el-icon-plus"></i> -->
        <slot name="initImage"></slot>
        <!-- <div class="avatar-box icon-type-img" :class="iconType" />
        <div :class="disabled ? 'filter' : ''" class="avatar-uploader-icon" /> -->
      </template>

    </el-upload>
  </div>
</template>

<script>
import { uploadImgApi, getFile, uploadOcr } from '@/api/system/image.js';
import { getToken } from '@/utils/auth';
import {defaultH} from '@/api'
export default {
  name:'ImageUploadSimple',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片类型
    imageType: {
      type: String,
      default: null
    },
    // 图片正反面
    side: {
      type: String,
      default: null
    },
    // 图标类型
    iconType: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + uploadImgApi, // 上传的图片服务器地址
      headers: {
        'Authorization': getToken(),
        'Produce-Code': defaultH['Produce-Code'],
        'App-Code': defaultH['App-Code'],
        'App-Version':defaultH['App-Version'],
        'Terminal-Type': defaultH['Terminal-Type']
      },
      uploadData: {},
      attachUrl: '',
      flag: false
    };
  },
  watch: {
    value(val) {
      if (val) {
        if (this.flag) return;
        this.handleGetFile(val);
      }
    }
  },
  mounted() {
    if (this.value) {
      this.handleGetFile(this.value);
    }
  },
  methods: {
    handleBeforeUpload(file) {
      console.log('handleBeforeUpload',file)
      // const arrName = file.name &&file.name.split('.')
      // console.log('arrName',arrName)
      // file.name = escape(arrName[0]) +'.' + arrName[1]
      //  console.log('handleBeforeUpload  name',file.name)

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt1M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.msgWarning('请上传png/jpg/jpeg格式的图片');
        return false;
      }
      if (!isLt1M) {
        this.msgWarning('上传文件大小不能超过5MB');
        return false;
      }
      this.loading = this.$loading({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    handleUploadSuccess(res) {
      if (this.loading) this.loading.close();
      if (res.code === 200) {
        this.$emit('input', res.data.code);
        console.log('上传成功')
        this.handleGetFile(res.data.code, true);
      }
    },
    // 根据code获取url
    handleGetFile(code, flag) {
      this.flag = true;
      if (code) {
        if (code.startsWith('https://') || code.startsWith('http://')) {
          this.attachUrl = code;
          this.flag = false;
        } else {
          return
          console.log('222 code',code)
          getFile(code).then(response => {
            console.log('response',response)
            this.flag = false;
            if (response.data && response.data.length > 0) {
              this.attachUrl = response.data[0].attachUrl;
              if (!flag) return;
              this.handleOrc(this.attachUrl);
            } else {
              this.attachUrl = '';
            }
          });
        }
      }
    },
    // 图片识别
    handleOrc(url) {
      const formData = new FormData();
      if (this.imageType) {
        formData.append('type', this.imageType);
      } else {
        return;
      }
      if (url) {
        formData.append('url', url);
      } else {
        return;
      }
      if (this.side) {
        formData.append('side', this.side);
      }
      uploadOcr(formData).then(response => {
        if (response.data) {
          if (this.side) {
            this.$emit('fillForm', this.imageType, response.data, this.side);
          } else {
            this.$emit('fillForm', this.imageType, response.data);
          }
        }
      });
    },
    handleUploadError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      });
      this.loading.close();
    }
  }
};
</script>

<style scoped lang="scss">
.avatar-box{
  width: 100%;
  height: 100%;

}
 ::v-deep .el-upload--picture-card{
line-height: 15px !important;
 }
::v-deep .el-upload--picture-card, .avatar-box{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F9F9F9;
  width: 127px;
  height: 87px;
  overflow: hidden;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
}
// 上传按钮
.upload-image{
  position: relative;
  .avatar-uploader-icon{
    width: 58px;
    height: 58px;
    position: absolute;
    background: url('~@/assets/images/uploadImage/upload_icon.png') no-repeat;
    background-size: 100% 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &.filter{
      filter: grayscale(100%);
      opacity: 0.6;
    }
  }
}
// 背景图样式
.icon-type-img{
  &.default{
    background: url('~@/assets/images/uploadImage/default.png') no-repeat center center;
    background-size: auto;
  }
  &.driver{
    background: url('~@/assets/images/uploadImage/driver.png') no-repeat center center;
    background-size: auto;
  }
  &.driver_head{
    background: url('~@/assets/images/uploadImage/driver_head.png') no-repeat center center;
    background-size: auto;
  }
  &.idcard{
    background: url('~@/assets/images/uploadImage/idcard.png') no-repeat center center;
    background-size: auto;
  }
  &.idcard_back{
    background: url('~@/assets/images/uploadImage/idcard_back.png') no-repeat center center;
    background-size: auto;
  }
  &.idcard_hand{
    background: url('~@/assets/images/uploadImage/idcard_hand.png') no-repeat center center;
    background-size: auto;
  }
  &.organization{
    background: url('~@/assets/images/uploadImage/organization.png') no-repeat center center;
    background-size: auto;
  }
  &.transport{
    background: url('~@/assets/images/uploadImage/transport.png') no-repeat center center;
    background-size: auto;
  }
  &.vehicle{
    background: url('~@/assets/images/uploadImage/vehicle.png') no-repeat center center;
    background-size: auto;
  }
  &.vehicle_back{
    background: url('~@/assets/images/uploadImage/vehicle_back.png') no-repeat center center;
    background-size: auto;
  }
  &.vehicle_head{
    background: url('~@/assets/images/uploadImage/vehicle_head.png') no-repeat center center;
    background-size: auto;
  }
  &.work{
    background: url('~@/assets/images/uploadImage/work.png') no-repeat center center;
    background-size: auto;
  }
}
</style>

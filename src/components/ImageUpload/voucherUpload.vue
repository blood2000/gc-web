<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      name="file"
      drag
      :on-remove="handleRemove"
      :show-file-list="false"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: this.fileList.length >= this.limit }"
    >
  
      <div class="img-layout">
        <img src="../../assets/images/bang/voucherImg.png" alt="" />
        <span>将文件拖到此处，或<em>点击上传</em></span>
      </div>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { uploadImgApi } from "@/api/system/image.js";
import { defaultH } from "@/api";

export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + uploadImgApi, // 上传的图片服务器地址
      headers: {
        Authorization: getToken(),
        "Produce-Code": defaultH["Produce-Code"],
        "App-Code": defaultH["App-Code"],
        "App-Version": defaultH["App-Version"],
        "Terminal-Type": defaultH["Terminal-Type"],
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(",");
          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: item, url: item };
              } else {
                item = { name: item, url: item };
              }
            }
            console.log("item", item);
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name);
      this.fileList.splice(findex, 1);
      this.$emit("input", this.fileList);
    //   this.$emit("input", this.listToString(this.fileList));
    },
    // 上传成功回调
    handleUploadSuccess(res) {
      console.log("上传成功回调 res", res);
        if(res.code == 500) return
      this.fileList.push({ name: res.data.code, url: res.data.code });
      console.log("fileList", this.fileList);
      this.$emit("input", this.fileList);

    //   this.$emit("input", this.listToString(this.fileList));
      this.loading.close();
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      console.log("上传前loading加载", file);
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }

      if (!isImg) {
        this.$message.error(
          `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`
        );
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      console.log("list", list);

      for (let i in list) {
        // strs += list[i].url.replace(this.baseUrl, "") + separator;
        strs += list[i].url.replace(this.baseUrl, "") + separator;
        console.log("list[i].url", list[i].url, this.baseUrl);
      }
      console.log("strs", strs);
      return strs != "" ? strs.substr(0, strs.length - 1) : "";
    },
  },
};
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
::v-deep .el-upload-dragger {
  width: 220px;
  height: 88px;
}
::v-deep .el-upload--picture-card {
  width: 220px;
  height: 88px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 131px !important;
  height: 88px !important;
  margin: 0 19px 19px 0;
}
.img-layout {
  width: 220px;
  height: 88px;
  display: flex;
  flex-direction: column;
  line-height: 30px;
  justify-content: center;
  align-items: center;
  & > img {
    width: 24px;
  }
}
.img-item {
  width: 131px;
  height: 88px;
}
</style>


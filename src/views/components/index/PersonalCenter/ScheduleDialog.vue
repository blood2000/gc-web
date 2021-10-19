<template>
  <!-- 添加或修改行程对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="行程" name="trip">
        <el-form v-if="activeName === 'trip'" ref="form" :model="form" :rules="rules" label-width="130px">
          <!-- <el-form-item label="日期" prop="scheduleTime">
            <el-input v-model="form.scheduleTime" class="width90" disabled />
          </el-form-item> -->
          <el-form-item label="行程标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入行程标题" class="width90" />
          </el-form-item>
          <el-form-item label="行程内容" prop="content">
            <el-input
              v-model="form.content"
              class="width90"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 12}"
              placeholder="请输入行程内容"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="日报" name="daily">
        <el-form v-if="activeName === 'daily'" ref="dailyform" :model="dailyform" :rules="dailyrules" label-width="130px">
          <!-- <el-form-item label="日期" prop="dailyTime">
            <el-input v-model="dailyform.dailyTime" class="width90" disabled />
          </el-form-item> -->
          <el-form-item v-if="new Date() > new Date(dailyform.dailyTime).getTime()" label="日报内容" prop="content">
            <el-input
              v-model="dailyform.content"
              class="width90"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 12}"
              placeholder="请输入日报内容"
            />
          </el-form-item>
          <div v-else>日子还没到，别急哟~</div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="activeName === 'daily' && new Date(dailyform.dailyTime).getTime() < new Date() " type="primary" @click="submitForm('daily')">立即提交</el-button>
      <el-button v-if="activeName === 'trip'" type="primary" @click="submitForm('trip')">立即提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addSchedule, updateSchedule } from '@/api/workbench/workbench';

export default {
  name: 'ScheduleDialog',
  components: {
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
      // 表单参数
      form: {
      },
      dailyform: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '请输入行程标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入行程内容', trigger: 'blur' }
        ]
      },
      dailyrules: {
        content: [
          { required: true, message: '请输入日报内容', trigger: 'blur' }
        ]
      },
      activeName: 'trip'
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 提交按钮 */
    submitForm(e) {
      if (e === 'daily') {
        this.$refs['dailyform'].validate(valid => {
          if (valid) {
            if (this.dailyform.code) {
              updateSchedule(this.dailyform).then(response => {
                this.msgSuccess('编辑日报成功');
                this.close();
                this.$emit('refresh');
              });
            } else {
              addSchedule(this.dailyform).then(response => {
                this.msgSuccess('编辑日报成功');
                this.close();
                this.$emit('refresh');
              });
            }
          }
        });
      } else if (e === 'trip') {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.code) {
              updateSchedule(this.form).then(response => {
                this.msgSuccess('编辑行程成功');
                this.close();
                this.$emit('refresh');
              });
            } else {
              addSchedule(this.form).then(response => {
                this.msgSuccess('编辑行程成功');
                this.close();
                this.$emit('refresh');
              });
            }
          }
        });
      }
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
        scheduleTime: null,
        code: null,
        content: null,
        title: null
      };
      this.dailyform = {
        dailyTime: null,
        code: null,
        content: null,
        title: null
      };
      this.resetForm('form');
      this.resetForm('dailyform');
    },
    // 表单赋值
    setForm(data, schedule, daily) {
      this.form = {
        ...this.form,
        ...schedule
      };
      this.dailyform = {
        ...this.dailyform,
        ...daily
      };
      this.form.scheduleTime = data.day;
      this.dailyform.dailyTime = data.day;
      // console.log(schedule);
      // console.log(this.form);
    }

    // 图片上传成功会掉
    // handleUploadSuccess() {
    // }
  }
};
</script>

<style scoped>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
::v-deep .el-dialog__body{
  padding: 10px 20px;
}
</style>


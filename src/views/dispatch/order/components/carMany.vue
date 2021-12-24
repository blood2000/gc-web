<template>
  <!-- 派车填写表单 -->
  <el-form
    ref="ruleForm"
    class="carMany"
    :rules="rules"
    :model="form"
    label-width="90px"
    label-position="top"
  >
    <el-tag class="warning-text" type="danger" v-show="!isZj"
      >超好运货源，仅认证通过的车辆与司机可以进行运输</el-tag
    >
    <div class="carMany-content">
      <div class="carMany-content-left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="开始日期:" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                :picker-options="startPickerOptions"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出车时间:" prop="outCarTime">
              <el-time-picker
                :picker-options="{
                  selectableRange: outCarMinTime,
                }"
                style="width: 100%"
                v-model="form.outCarTime"
                value-format="HH:mm"
                placeholder="选择出车时间"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="carMany-content-right">
        <div class="carMany-content-search">
          <el-input
            placeholder="请输入车牌号"
            v-model="listSearch"
            class="input-with-select"
          >
            <el-button
              slot="append"
              :loading="loadSearching"
              @click="listVehicleSelect"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </div>
        <div class="title">
          <div class="title-left" style="margin-right: 20px">
            <span>已选择车辆：</span>
            <span class="title-number">{{ checkedVehicle }} </span>
            <span>辆</span>
          </div>
          <div class="title-right">
            <span>已分配司机：</span>
            <span class="title-number">{{ allocationDriver }} </span>
            <span>人</span>
          </div>
        </div>
        <ul
          class="carMany-list-bottom"
          @dragstart="onDragStart"
          @dragover="onDragOver"
          @dragend="onDragEnd"
          ref="parentNode"
        >
          <li
            :key="item.vehicleCode"
            class="carMany-list-bottom-item"
            v-for="(item, index) in vehicleList"
            @click.stop="checkChanges($event, item, index)"
            draggable="true"
          >
            <!-- 主题 -->
            <div class="carMany-list-bottom-item-body">
              <!-- 勾选 -->
              <div style="position: relative">
                <div class="carMany-list-bottom-item-checked-modal"></div>
                <el-checkbox
                  class="carMany-list-bottom-item-body-checked"
                  v-model="item.checked"
                />
              </div>
              <!-- 车牌 -->
              <div class="carMany-list-bottom-item-body-vehicleNumber">
                {{item.vehicleAlias?`(${item.vehicleAlias})  ${item.vehicleNumber}`: item.vehicleNumber }}
              </div>
              <!-- 是否外援 -->
              <div>
                <span
                  class="self"
                  :style="{
                    color: item.vehicleOwnership === 0 ? '#4682FA' : '#7E7F81',
                    'border-color':
                      item.vehicleOwnership === 0 ? '#4682FA' : '#7E7F81',
                  }"
                >
                  {{ vehicleOwnershipObj[item.vehicleOwnership] }}
                </span>
                <!-- <span
                  class="self"
                  v-else
                  :style="{
                    background: dealvehicleListSubText(item, 'color', 'v'),
                    color: item.authStatus === '3' ? '#212121' : '#fff',
                  }"
                  >{{ dealvehicleListSubText(item, "text", "v") }}</span
                > -->
              </div>
              <!-- 应付 -->
              <div
                class="carMany-list-bottom-item-footer"
                v-if="
                  isZj &&
                  item.vehicleOwnership == 1 &&
                  item.haveAppointCarRecord === false
                "
                @click.stop=""
              >
                <div
                  class="carMany-list-bottom-item-price"
                  v-if="pageData.settlementWay == 1"
                >
                  <i class="el-icon-warning-outline"></i>
                  <span style="margin-right: 7px"> 应付金额:</span>
                  <el-input
                    type="number"
                    style="width: 192px"
                    @input="imposeInput($event, 'realFreight', index)"
                    placeholder="请输入内容"
                    v-model="item.realFreight"
                  >
                    <span slot="append">元</span>
                  </el-input>
                </div>
                <div v-if="pageData.settlementWay != 1">
                  <el-input
                    type="number"
                    @input="imposeInput($event, 'realFreight', index)"
                    placeholder="请输入内容"
                    v-model="item.realFreight"
                  >
                    <template slot="prepend">应付单价</template>
                    <template slot="append">元 / 吨</template>
                  </el-input>
                </div>
              </div>
              <!-- 是否已派车  -->
              <div
                class="carMany-list-bottom-item-tip"
                v-show="item.haveAppointCarRecord"
              >
                <i
                  style="color: rgba(250, 173, 20, 1)"
                  class="el-icon-warning-outline"
                ></i>
                <span
                  :style="{
                    'margin-right':
                      isZj && item.vehicleOwnership == 1 && item.realFreight
                        ? '60px'
                        : '0px',
                  }"
                  >{{ item.haveAppointCarRecordText }}</span
                >
                <span
                  v-if="isZj && item.vehicleOwnership == 1 && item.realFreight"
                  >应付金额 {{ item.realFreight }} 元</span
                >
              </div>
            </div>
            <!-- 选择司机 -->
            <div
              v-if="isZj || item.authStatus === '3'"
              class="carMany-list-bottom-item-body-userinfo"
              @click.stop
            >
              <el-dropdown
                trigger="click"
                placement="bottom"
                @command="handleCommand"
              >
                <div class="carMany-list-bottom-item-body-all">
                  <img
                    v-show="item.driverName"
                    style="margin-right: 8px"
                    class="carMany-list-bottom-item-body-a"
                    src="@/assets/images/profile.png"
                  />
                  <span
                    v-show="item.driverName"
                    style="margin-right: 8px"
                    class="name"
                    >{{ item.driverName }}</span
                  >
                  <span
                    style="margin-right: 16px"
                    v-show="item.driverName"
                    class="name"
                    >{{ item.driverPhone }}</span
                  >
                  <div style="margin-right: 16px">
                    <span v-show="!item.driverName" class="cheange-name"
                      >选择司机</span
                    >
                    <span v-show="item.driverName" class="cheange-name"
                      >更换司机</span
                    >
                  </div>
                </div>

                <el-dropdown-menu style="width: 220px" slot="dropdown">
                  <el-dropdown-item
                    class="driver-list"
                    v-for="(sub, i) in driverList"
                    :key="i"
                    :disabled="!isZj && sub.authStatus != '3'"
                    :command="`${sub.driverCode}-${i}-${index}`"
                  >
                    <!-- sub.driverCode+'-'+i+ -->
                    <span>{{ sub.driverName }}</span>
                    <span v-if="isZj">{{ sub.driverPhone }}</span>
                    <span
                      v-else
                      :style="{
                        color: dealvehicleListSubText(sub, 'color', 'd'),
                      }"
                      >{{ dealvehicleListSubText(sub, "text", "d") }}</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              v-else
              :style="{
                background: dealvehicleListSubText(item, 'color', 'v'),
                color: item.authStatus === '3' ? '#212121' : '#fff',
              }"
              class="fail"
            >
              <span>{{ dealvehicleListSubText(item, "text", "v") }}</span>
            </div>
          </li>
        </ul>
        <el-form-item>
          <div class="confrim">
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import { http_request } from "../../../../api";
import { vehicleOwnershipObj } from "../order_config";
export default {
  name: "carMany",
  props: {
    dispatchOrderCode: {
      type: String,
      default: "",
    },
    carDrawer: {
      type: Boolean,
      default: false,
    },
    pageData: {
      type: Object,
      default: {},
    },
    isZj: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listSearch: null, //搜索值
      vehicleList: [], //车辆列表
      driverList: null, //司机列表
      vehicleOwnershipObj, //静态配置 自有 外援
      haveAppointCarRecordText: "", //已派车文字
      loadSearching: false,
      draging: null, //被拖拽的对象
      target: null, //目标对象
      currCheckel: null,
      form: {
        startDate: null,
        outCarTime: null,
      },
      rules: {
        startDate: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        outCarTime: [
          { required: true, message: "请选择出车日期", trigger: "change" },
        ],
      },
      startPickerOptions: {
        //开始时间过滤
        disabledDate: (time) => {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  computed: {
    outCarMinTime() {
      const tmpTime = new Date();
      const result = this.parseTime(tmpTime, "{h}:{i}:{s}");
      console.log("result", result);
      return `${result} - 23:59:59`;
    },
    checkedVehicle() {
      let result = 0;
      for (const item of this.vehicleList) {
        if (item.checked) {
          result++;
        }
      }
      return result;
    },
    allocationDriver() {
      let result = 0;
      for (const item of this.vehicleList) {
        if (item.driverName && item.checked) {
          result++;
        }
      }
      return result;
    },
  },
  mounted() {
    console.log("批量出现", this.pageData, this.isZj);
    this.initTimeDate();
    this.listVehicleSelect();
    this.getDriverList();
  },
  methods: {
    // 拖拽开始
    onDragStart(e) {
      console.log("drag start", e);
      this.draging = e.target;
    },
    _index(el) {
      let domData = Array.from(this.$refs.parentNode.childNodes);
      return domData.findIndex((i) => i.innerText == el.innerText);
    },

    // 拖拽中
    onDragOver(e) {
      this.target = e.target;
      let targetTop = this.target.getBoundingClientRect().top;
      let dragingTop = this.draging.getBoundingClientRect().top;
      console.log("this.target.nodeName", this.target.nodeName);
      if (this.target.nodeName !== "LI") return;
      if (this.target.nodeName === "LI" && this.target !== this.draging) {
        if (this.target) {
          if (this.target.animated) {
            return;
          }
        }
      }
      // console.log('this._index(this.draging)',this._index(this.draging))
      // console.log('this._index(this.target)',this._index(this.target))
      if (this._index(this.draging) < this._index(this.target)) {
        this.target.parentNode.insertBefore(
          this.draging,
          this.target.nextSibling
        );
      } else {
        this.target.parentNode.insertBefore(this.draging, this.target);
      }
      this._anim(targetTop, this.target);
      this._anim(dragingTop, this.draging);
    },
    _anim(startPos, dom) {
      let offset = startPos - dom.getBoundingClientRect().top;
      console.log("offset", offset);
      dom.style.transition = "none";
      dom.style.transform = `translateY(${offset}px)`;
      dom.style.borderBottomColor = "#409EFF";
      //触发重绘
      dom.offsetWidth;
      dom.style.transition = "transform .3s";
      dom.style.transform = ``;
      clearTimeout(dom.animated);
      dom.animated = setTimeout(() => {
        dom.style.transition = "";
        dom.style.transform = ``;
        dom.style.borderBottomColor = "#e4ecf4";
        dom.animated = false;
      }, 200);
    },
    _animMove(startPos, dom) {
      console.log(' dom.getBoundingClientRect().top', dom.getBoundingClientRect().top)
      console.log('startPos',startPos)
      let offset = startPos - dom.getBoundingClientRect().top;
      console.log("offset", offset);
      dom.style.transition = "none";
      dom.style.transform = `translateY(${offset}px)`;
      //触发重绘
      dom.offsetWidth;
      dom.style.transition = "transform .3s";
      dom.style.transform = ``;
      clearTimeout(dom.animated);
      dom.animated = setTimeout(() => {
        dom.style.transition = "";
        dom.style.transform = ``;
        dom.animated = false;
      }, 1200);
    },
    // 拖拽完
    onDragEnd(e) {
      console.log("drag end", e);
      let currentNodes = Array.from(this.$refs.parentNode.childNodes);
      // console.log("currentNodes", currentNodes);
      let data = currentNodes.map((i, index) => {
        // console.log("i", i.innerText);
        let item = this.vehicleList.find((c) => {
          // console.log("c", c);
          if (i.innerText.includes(c.vehicleNumber)) return c;
        });
        return item;
      });
      console.log(data);
    },
    // 选择车辆向上平移
    vehicleOffset(targetEvent) {
      console.log("targetEvent", targetEvent);
      // 获取平移的目标位置
      const vehicleList = this.vehicleList;
      let sourceIndex = 0;
      const currentNodes = Array.from(this.$refs.parentNode.childNodes);
      for (let i = vehicleList.length - 1; i >= 0; i--) {
        const item = vehicleList[i];
        console.log("i", i);
        if (item.checked && targetEvent !== currentNodes[i]) {
          sourceIndex = i;
          break;
        }
      }
      console.log("sourceIndex", sourceIndex);
      const sourceItem1 = currentNodes[sourceIndex];
      console.log("currentNodes", currentNodes, targetEvent);
      console.log("targetEvent.parentNode", targetEvent.parentNode);
      if (this._index(targetEvent) < this._index(sourceItem1)) {
        sourceItem1.parentNode.insertBefore(
          targetEvent,
          sourceItem1.nextSibling
        );
      } else {
        sourceItem1.parentNode.insertBefore(targetEvent, sourceItem1);
      }
      let targetTop = sourceItem1.getBoundingClientRect().top;
      console.log('targetTop',targetTop)
      let dragingTop = targetEvent.getBoundingClientRect().top;
      console.log('dragingTop',dragingTop)
      this._animMove(targetTop, targetEvent);
      this._animMove(dragingTop, sourceItem1);
    },
    //强制限制
    imposeInput(e, value, index) {
      console.log("强制限制", e);
      const tmp = e.match(/^[0-9]+(\.[0-9]{0,2})?/g) ?? [""];
      console.log("tmp", tmp[0]);
      this.vehicleList[index][value] = tmp[0];
      if (Number(e) > parseInt(this.pageData.freight)) {
        console.log("this.pageData.settlementWay", this.pageData.settlementWay);
        const tmp1 = this.pageData.settlementWay == 1 ? "应付金额" : "应付单价";
        const tmp2 = this.pageData.settlementWay == 1 ? "应收金额" : "运费单价";
        const msg = `${tmp2}不能高于${tmp1}`;
        this.$confirm(msg, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning",
        }).then(() => {
          this.vehicleList[index][value] = "";
        });
      }
    },
    // 运单校验
    plateNo(rule, value, callback) {
      console.log("打法");
      if (value === undefined || value === null || value === "") {
        callback();
      }
      if (Number(value) >= parseInt(this.pageData.freight)) {
        let str = "";
        if (this.pageData.settlementWay == 1) {
          str = "应付单价不能超过运费单价";
        } else {
          str = "应付金额不能超过运费总额";
        }
        callback(new Error(str));
      } else {
        callback();
      }
    },
    // 司机下拉菜单
    handleCommand(code) {
      console.log("司机下拉菜单 code", code);
      const key = code.split("-")[0];
      const dirverIndex = Number(code.split("-")[1]);
      const index = Number(code.split("-")[2]);

      this.vehicleList[index].driverName =
        this.driverList[dirverIndex].driverName;
      this.vehicleList[index].driverPhone =
        this.driverList[dirverIndex].driverPhone;
      this.vehicleList[index].driverCode =
        this.driverList[dirverIndex].driverCode;
      console.log("this.driverList[dirverIndex]", this.driverList[dirverIndex]);
      console.log(" this.vehicleList[index]", this.vehicleList[index]);
      this.haveAppointCarRecordHttp(
        this.vehicleList[index].driverCode,
        this.vehicleList[index].vehicleCode,
        index
      );
    },
    // 判断是否派车过
    async haveAppointCarRecordHttp(driverCode, vehicleCode, index) {
      if (!this.form.startDate) {
        this.msgWarning("请先选择出车日期");
        return;
      }
      if (vehicleCode && this.dispatchOrderCode) {
        console.log("给我查");
        const params = {
          dispatchOrderCode: this.dispatchOrderCode,
          appointCarDate: this.form.startDate,
          vehicleCode: vehicleCode,
          driverCode: driverCode,
        };
        const obj = {
          moduleName: "http_dispatch",
          method: "get",
          url_alias: "haveAppointCarRecord",
          data: params,
        };
        const res = await http_request(obj);
        console.log("res", res);
        this.vehicleList[index].haveAppointCarRecord =
          res.data.haveAppointCarRecord === 0 ? false : true;
        this.vehicleList[index].haveAppointCarRecordText = res.data.msg;
        this.vehicleList[index].realFreight = res.data.realFreight;
      } else {
        console.log("你来这拉？");
      }
    },
    // 处理认证啥的
    dealvehicleListSubText(sub, type, w) {
      const obj = {
        text: () => {
          if (sub.authStatus == "0" || sub.authStatus == "1") {
            return "认证中";
          } else if (sub.authStatus == "2") {
            return "认证失败";
          } else {
            if (w === "d") {
              return sub.driverPhone;
            } else {
              return this.vehicleOwnershipObj[sub.vehicleOwnership];
            }
          }
        },
        color: () => {
          if (sub.authStatus == "0" || sub.authStatus == "1") {
            return "#FAAD14";
          } else if (sub.authStatus == "2") {
            return "#F56C6C";
          } else {
          }
        },
      };
      return obj[type]();
    },

    // 选择车辆
    checkChanges(e, val, index) {
      console.log("val", val);
      if (!this.isZj && val.authStatus != "3") {
        this.msgWarning("未认证不可选择");
        return;
      }
      if (!this.vehicleList[index].driverCode) {
        this.msgWarning("请选择司机");
        return;
      }
      const vehicleList = this.vehicleList;
      // 拷贝
      const tmp = { ...val };
      // 当前index下的checked状态
      const oldTmpCheck = tmp.checked;
      delete tmp.checked;
      console.log("tmp", tmp, oldTmpCheck);
      // 改成true
      vehicleList[index].checked = this.$set(vehicleList, index, {
        ...tmp,
        checked: !oldTmpCheck,
      });
      console.log("vehicleList", vehicleList);
      this.vehicleOffset(e.target);
      if (vehicleList[index].checked) {
        this.haveAppointCarRecordHttp(
          vehicleList[index].driverCode,
          vehicleList[index].vehicleCode,
          index
        );
      }
    },

    //初始时间
    initTimeDate() {
      console.log("初始时间");
      this.form.startDate = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.form.outCarTime = this.parseTime(new Date(), "{h}:{i}");
    },
    //获取派车的车辆Select
    async listVehicleSelect() {
      this.loadSearching = true;
      const me = this;
      me.vehicleList = [];
      const obj = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listVehicleSelect",
        data: { vehicleNumber: this.listSearch },
      };
      await http_request(obj)
        .then((res) => {
          res.data.forEach((el) => {
            const obj = {
              ...el,
              checked: false,
            };
            me.vehicleList.push(obj);
          });
          this.loadSearching = false;
          console.log("车辆列表", me.vehicleList);
        })
        .catch(() => {
          this.loadSearching = false;
        });
    },
    // 司机列表
    getDriverList() {
      const me = this;
      const obj1 = {
        moduleName: "http_dispatch",
        method: "get",
        url_alias: "listTeamDrivers",
      };
      http_request(obj1).then((res) => {
        me.driverList = res.data;
        console.log("司机列表", me.driverList);
      });
    },
    // 提交
    submitForm(formName) {
      console.log("提交表单", this.form);
      const me = this;
      me.$refs[formName].validate((valid) => {
        if (valid) {
          const result = { ...this.form };
          const vehicleDrivers = [];
          for (const item of me.vehicleList) {
            if (item.checked) {
              const obj = {};
              console.log("result item", item);
              obj.vehicleCode = item.vehicleCode;
              obj.driverCode = item.driverCode;
              obj.realFreight = item.realFreight;
              if (
                this.isZj &&
                item.vehicleOwnership == 1 &&
                item.haveAppointCarRecord === false &&
                !obj.realFreight
              ) {
                return this.msgWarning(
                  `请填写车辆【${item.vehicleNumber}】的${
                    this.pageData.settlementWay == 1 ? "应付金额" : "应付单价"
                  }`
                );
              }
              vehicleDrivers.push(obj);
            }
          }
          result.vehicleDrivers = vehicleDrivers;
          result.dispatchOrderCode = me.dispatchOrderCode;
          result.endDate = me.form.startDate;
          console.log("result", result);
          const obj = {
            moduleName: "http_dispatch",
            method: "post",
            url_alias: "appoint_car",
            data: result,
          };
          http_request(obj).then((res) => {
            console.log("res", res.data);
            if (res.code == 200) {
              this.$confirm(res.msg, "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                showClose: false,
                type: "success",
              }).then(() => {
                console.log("1111。跳不跳");
                me.$emit("handleClose");
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.listSearch = null;
      this.initTimeDate();
      this.listVehicleSelect();
    },
  },
};
</script>

<style lang="scss" scoped>
.carMany {
  width: 100%;
  padding: 0px 40px;
}
.warning-text {
  margin-bottom: 10px;
  display: block;
  background: transparent;
  border-color: transparent;
  padding-left: 0;
}
.carMany-content {
  display: flex;
  height: 300px;

  &-left {
    height: 100%;
    width: 220px;
    // padding: 10px 0;
    padding-right: 35px;
    border-right: 1px solid #e4ecf4;
  }
  &-right {
    padding-left: 30px;
    flex: 1;
  }
}
.carMany-content-search {
  width: 196px;
  margin-bottom: 12px;
}
.title {
  display: flex;
  justify-content: space-between;
  width: 220px;
  margin-bottom: 22px;
}

.title-left,
.title-right {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #262626;
}
.title-number {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #262626;
}
.carMany-list-bottom {
  height: 200px;
  overflow: auto;
  margin-bottom: 50px;
}
.carMany-list-bottom-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e4ecf4;
  align-items: center;
  height: 44px;
}
.carMany-list-bottom-item-footer{
  margin-left: 20px;
}
.carMany-list-bottom-item-body {
  display: flex;
  align-items: center;
}
.carMany-list-bottom-item-body-userinfo {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.carMany-list-bottom-item-checked-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  height: 25px;
  z-index: 120;
  background: transparent;
}
.carMany-list-bottom-item-body-checked {
  display: inline-block;
  padding-right: 15px !important;
}
::v-deep .el-checkbox__inner {
  // border-radius: 50%;
  width: 16px;
  height: 16px;
}
::v-deep .el-checkbox__inner::after {
  height: 9px;
  left: 4px;
  width: 4px;
  border: 2px solid #ffffff;
  border-left: 0;
  border-top: 0;
}
.carMany-list-bottom-item-body-vehicleNumber {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3d4050;
  margin-right: 15px;
  width: 160px;
}
.self {
  display: inline-block;
  text-align: center;
  width: 40px;
  height: 20px;
  border: 1px solid #4682fa;
  border-radius: 2px;
  line-height: 20px;
}
.carMany-list-bottom-item-price {
  margin-left: 20px;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 24px;
  color: #3d4050;
  align-items: center;
}
.el-icon-warning-outline {
  margin-right: 7px;
}

::v-deep .el-input--medium .el-input__inner {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-input-group__append,
.el-input-group__prepend {
  background: transparent;
}
.carMany-list-bottom-item-body-all {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #262626;
  cursor: pointer;
  -webkit-touch-callout: none;

  -webkit-user-select: none;

  -khtml-user-select: none;

  -moz-user-select: none;

  -ms-user-select: none;

  user-select: none;
}
.carMany-list-bottom-item-body-a {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #e0e5ed;
}
.cheange-name {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #4682fa;
}
.driver-list {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
  font-family: PingFang SC;
}
.fail {
  width: 70px;
  height: 24px;
  background: #fff8f8;
  border-radius: 12px;
  text-align: center;
  line-height: 24px;
  margin-right: 12px;
  font-size: 12px;
  font-family: PingFang SC;
}
.carMany-list-bottom-item-tip {
  margin-left: 15px;
  padding: 4px 12px 0 8px;
  height: 24px;
  background: rgba(250, 173, 20, 0.1);
  border-radius: 2px;
  line-height: 16px;
  color: rgba(61, 64, 80, 1);
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
}
.confrim {
  float: right;
  margin-bottom: 50px;
}
</style>
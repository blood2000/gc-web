const map = {
  state: {
    showDispatchVehicle: false,  //显示派车弹窗
    showVehicleDetail: false,  //显示车辆详情
    isFresh: false,  //刷新
    vehicleInfo: {},  //车辆信息
    dispatchInfo: {},   //调度信息
    isClose:false //展开收起面板
  },
  mutations: {
    set_dispatchVehicle: (state, leap) => {
      state.showDispatchVehicle = leap
    },
    set_showVehicleDetail: (state, leap) => {
      state.showVehicleDetail = leap
    },
    set_vehicleInfo: (state, info) => {
      state.vehicleInfo = info;
    },
    set_dispatchInfo: (state, info) => {
      state.dispatchInfo = info;
    },
    set_isFresh: (state, leap) => {
      state.isFresh = leap;
    },
    set_isClose: (state, data) => {
      state.isClose = data;
    },
  },
  actions: {
    setShowDispatchVehicle({
      commit
    }, leap) {
      commit('set_dispatchVehicle', leap)
    },
    setShowVehicleDetail({
      commit
    }, leap) {
      commit('set_vehicleDetail', leap)
    },
    setVehicleInfo({
      commit
    }, info) {
      commit('set_vehicleInfo', info)
    },
  }

}



export default map

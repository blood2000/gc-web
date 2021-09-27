const map = {
  state: {
    showDispatchVehicle: false,  //显示派车弹窗
    showVehicleDetail: false,  //显示车辆详情
    vehicleInfo: {},  //车辆信息
    dispatchInfo: {},   //
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

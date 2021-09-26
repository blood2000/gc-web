const map = {
  state: {
    showDispatchVehicle: false,  //显示车辆详情
    vehicleInfo: {},  //车辆信息
    dispatchInfo: {},   //
  },
  mutations: {
    set_dispatchVehicle: (state, leap) => {
      state.showDispatchVehicle = leap
    },
    
  },
  actions: {
    setShowDetail({
      commit
    }, leap) {
      commit('set_dispatchVehicle', leap)
    },
    
  }

}



export default map

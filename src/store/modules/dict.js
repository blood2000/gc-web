
const dict = {
  state: {
    vehicleTypeCodeList: [],//车辆类型列表
    vehicleEnergyTypeList: [], //车辆能源类型list
    carrierTypeList: [],//车辆承运类型list
    vehicleLicenseColorCodeList: [] //车牌类型
  },
  mutations: {
    set_vehicleTypeCodeList: (state, list) => {
      state.vehicleTypeCodeList = list
    },
    SET_vehicleEnergyTypeList: (state, list) => {
      console.log('list====>', list)
      state.vehicleEnergyTypeList = list
    },
    set_carrierTypeList: (state, list) => {
      state.carrierTypeList = list
    },
    set_vehicleLicenseColorCodeList: (state, list) => {
      state.vehicleLicenseColorCodeList = list
    }
  },
  actions: {
    setVehicleTypeCodeList({ commit }, list) {
      commit('set_vehicleTypeCodeList', list)
    },
    setVehicleEnergyTypeList({ commit }, list) {
      commit('SET_vehicleEnergyTypeList', list)
    },
    setCarrierTypeList({ commit }, list) {
      commit('set_carrierTypeList', list)
    },
    setVehicleLicenseColorCodeList({ commit }, list) {
      commit('set_vehicleLicenseColorCodeList', list)
    }
  }

}



export default dict
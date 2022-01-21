export default {
  pagingStealGoodsAlarm: '/fmsweb/stealGoodsAlarm/v1/pagingStealGoodsAlarm',
  detailStealGoodsAlarm: id => `/fmsweb/stealGoodsAlarm/v1/detailStealGoodsAlarm/${id}`,

  getCommandType: '/fmsweb/alarm/threshold/v1/getCommandType',
  sendCommand: '/fmsweb/alarm/threshold/v1/sendCommand'
}

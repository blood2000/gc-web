const dispatchList = [{
    dispatchType: '渣土',
    price: 800,
    unit: '吨',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A112233'
  },
  {
    dispatchType: '钢铁',
    price: 800,
    unit: '吨',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A212233'
  },
  {
    dispatchType: '商品用车',
    price: 800,
    unit: '车',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A312233'
  },
  {
    dispatchType: '渣土',
    price: 800,
    unit: '吨',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A112233'
  },
  {
    dispatchType: '渣土',
    price: 800,
    unit: '吨',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A112233'
  },
  {
    dispatchType: '渣土',
    price: 800,
    unit: '吨',
    company: '唐山曹妃甸应链管首理有限公司',
    start: '福建省福州市台江区东滨路1号富邦总部大楼',
    end: '福州鼓楼区',
    vehicleCode: '闽A112233'
  },
];

const vehicleInfo = {
  vehicleCode: '闽A112233',
  driver: '杜工部',
  machineType: '渣土车',
  team: '车队1',
  vehicleType: '重型自卸卡车',
  addr: '福建省福州市台江区东滨路1号富邦总部大楼',
  curDate: '2021-06-01 13:13:13',
  status: 2
};

//调度单来源
 const sourceConfig = {
  'chy': "超好运",
  'zj': '自建'
}

export const vehicleOwnershipObj = {
  0: "自有",
  1: "外援",
}

const travelStatus = [
  {id: 0, status: '空闲中'},
  {id: 1, status: '装货中'},
  {id: 2, status: '行驶中'},
  {id: 3, status: '卸货中'},
  {id: 4, status: '停用'},
];
export default {
  dispatchList,
  vehicleInfo,
  travelStatus,
  sourceConfig
};

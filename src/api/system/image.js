import request from '@/utils/request';

// 上传图片api
export const uploadImgApi = '/fmsweb/system/common/v1/upload';
// 下载图片api
export const downImgApi = '/assets/upload/imageDown';

// 获取文件列表
export function getFile(code) {
  return request({
    url: `/assets/upload/getUrlByCode?code=${code}`,
    method: 'post'
  });
}

// 自动识别
export function uploadOcr(data) {
  return request({
    url: '/fmsweb/system/common/v1/certificates',
    method: 'post',
    data: data
  });
}

export function uploadImg(data) {
  console.log('uploadImg data',data)
  return request({
    url: uploadImgApi,
    method: 'post',
    data: data
  });
}

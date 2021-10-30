// 采用rem为单位，根据屏幕的宽度调整html的font-size，获取屏幕宽度并计算比例：
export function setfontSize(res) {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) return;
  let size = 1920;
  const fontSize = clientWidth / size; // 该数值为屏幕宽度
  return res * fontSize;
}

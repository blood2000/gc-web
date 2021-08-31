import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import dialogDrag from './dialog/drag'
import hasImage from './permission/hasImage'


const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('real-img', hasImage);
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['dialogDrag'] = dialogDrag
  Vue.use(install); // eslint-disable-line
}

export default install

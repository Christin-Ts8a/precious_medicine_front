import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

Vue.config.productionTip = false
// 全局修改默认配置，点击空白处不能关闭弹窗
ElementUI.Dialog.props.closeOnClickModal.default = false
// 全局修改默认配置，按下ESC不能关闭弹窗
ElementUI.Dialog.props.closeOnPressEscape.default = false
Vue.use(ElementUI);
Vue.use(VueRouter)

// axios.defaults.withCredentials = true

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

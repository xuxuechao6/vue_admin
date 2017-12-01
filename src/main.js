// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from 'axios';
import ElementUI from 'element-ui';
import md5 from 'js-md5';
import 'jquery/dist/jquery.min.js'
import '../static/css/theme-green/index.css';
import 'element-ui/lib/theme-default/index.css'
Vue.config.productionTip = false;

// // 创建基本的axios配置
Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.prototype.md5 = md5;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})

import Vue from 'vue';
import VueRouter from 'vue-router';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Buefy);

new Vue({
  render: (h) => h(App),
  router
}).$mount('#app');

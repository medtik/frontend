import Vue from 'vue';
import Vuetify from 'vuetify';
Vue.use(Vuetify);

import {ApiServicePlugin} from './service/api-service.plugin';
Vue.use(ApiServicePlugin);

import App from './App.vue';
import {router} from './router';
import {store} from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

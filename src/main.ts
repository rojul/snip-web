import Vue from 'vue';

import App from './App.vue';
import Toolbar from './components/Toolbar.vue';
import router from './router';

Vue.component('Toolbar', Toolbar);

Vue.config.productionTip = false;

/* tslint:disable:no-unused-expression */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});

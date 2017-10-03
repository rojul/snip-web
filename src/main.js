import Vue from 'vue';

import App from '@/App';
import router from '@/router';
import Toolbar from '@/components/Toolbar';

Vue.component('Toolbar', Toolbar);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});

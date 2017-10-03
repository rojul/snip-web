import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home';
import Run from '@/components/Run';
import PageNotFound from '@/components/PageNotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }, {
      path: '/languages/:id',
      name: 'LanguageRun',
      component: Run,
    }, {
      path: '/snippets/:id',
      name: 'SnippetRun',
      component: Run,
    }, {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
    },
  ],
  mode: 'history',
});

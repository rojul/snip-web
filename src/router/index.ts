import Vue from 'vue';
import Router from 'vue-router';

import About from '../components/About.vue';
import Home from '../components/Home.vue';
import PageNotFound from '../components/PageNotFound.vue';
import Run from '../components/Run.vue';

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
      path: '/about',
      name: 'About',
      component: About,
    }, {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
    },
  ],
  mode: 'history',
});

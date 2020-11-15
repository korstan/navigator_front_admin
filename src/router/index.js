import routes from './routes';
import VueRouter from 'vue-router';

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/navigator/admin/'
});

export default router;
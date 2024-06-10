import { createRouter, createWebHistory } from 'vue-router';
import AdminView from '../components/Admin/AdminView.vue';
import LoginView from '../components/Login/LoginView.vue';
import UserView from '../components/User/UserView.vue';
// import TestView from '../components/Test/TestView.vue';
import Quiz from '../components/Quiz/Quiz.vue';


const routes = [
  { path: '/', component: LoginView },
  { path: '/admin', component: AdminView },
  { name: 'UserView', path: '/user', component: UserView},
  {
    name: 'Quiz',
    path: '/quiz',
    component: Quiz,
    props: true,
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

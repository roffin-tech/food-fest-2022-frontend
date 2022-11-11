import { createWebHistory, createRouter } from "vue-router";
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Home from '../pages/Home.vue';
import CreateOrder from '../pages/CreateOrder.vue';
import ProductsList from '../pages/ProductList.vue';
import About from '../pages/About.vue';
import Table from '../pages/Table.vue';
import Admin from '../admin/Admin.vue';
import Dashboard from '../admin/AdminHome.vue';
import TableManagement from '../admin/TableManagement.vue';
import TableAddOrEdit from '../admin/TableAddOrEdit.vue';
import UserManagement from '../admin/UserManagement.vue';


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home, 
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/table",
    name: "Table",
    component: Table,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/create-order",
    name: "CreateOrder",
    component: CreateOrder,
  },
  {
    path: "/orders",
    name: "Products",
    component: ProductsList,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: Dashboard,
    children: [
      {
        path: "/admin/dashboard/table-management",
        name: "TableManagement",
        component: TableManagement,
      },
      {
        path: "/admin/dashboard/table-add-or-edit",
        name: "TableAddOrEdit",
        component: TableAddOrEdit,
      },
      {
        path: "/admin/dashboard/user-management",
        name: "UserManagement",
        component: UserManagement,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
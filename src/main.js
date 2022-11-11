import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/axios"

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};


createApp(App).use(router).use(store).use(Toast, options).mount('#app')

// npm install vue-router
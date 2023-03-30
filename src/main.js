import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {initializeApp} from 'firebase/app'
import 'bootstrap/dist/css/bootstrap.min.css'

import './assets/main.css'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
};

let app = initializeApp(firebaseConfig)
app = createApp(App).use(router).mount('#app')
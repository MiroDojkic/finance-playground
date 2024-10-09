import './assets/tailwind.css';
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import { createApp } from 'vue';
import App from '@/App';
import router from '@/router';

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: { preset: Lara }
});

app.mount('#app');

import { createApp } from 'vue';
import App from './App';
import './index.css';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.use(Antd);
app.mount('#app');

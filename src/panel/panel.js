import Vue from 'vue/dist/vue.runtime.esm';
import Vuetify from 'vuetify';
import App from './App';

import './panel.css';
import 'vuetify/dist/vuetify.css';
Vue.config.devtools = true;
Vue.use(Vuetify);

new Vue({
  el: '#app',
  render: h => h(App),
});

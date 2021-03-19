import Vue from 'vue'
import store from "./store.js"
import iview from "view-design"
import 'view-design/dist/styles/iview.css';
import App from './App.vue'
import router from './router'
import './style/style.less'
/* eslint-disable */
import $ from 'jquery'

//main.js
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Viewer.setDefaults({
  Options: {
      "inline": true,
      "button": true,
      "navbar": false,
      "title": true,
      "toolbar": true,
      "tooltip": true,
      "movable": true,
      "zoomable": true,
      "rotatable": true,
      "scalable": true,
      "transition": true,
      "fullscreen": true,
      "keyboard": true,
      "url": "data-source"
  }
});
Vue.use(Viewer);


Vue.config.productionTip = false
Vue.use(iview);
// Vue.use($);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// import 'core-js/es/promise'

import './css/index.css'
import './css/less.less'
import './css/sass.scss'
import './css/stylus.styl'
import './css/iconfont.css'

function MyIndex() {
  console.log(111);

}

const sum = () => 123

document.getElementById('btn').onclick= function() {
  import(/* webpackChunkName:'add' */  './a').then(res => {
    console.log(res);
    console.log(555,res.aa());
  })
}

var a = 1
console.log(555,888);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}


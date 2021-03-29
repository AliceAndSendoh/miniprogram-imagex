var fetchWechat = require('fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var webgl = require('@tensorflow/tfjs-backend-webgl');
var plugin = requirePlugin('tfjsPlugin');
// app.js
App({
  onLaunch() {
    // wx.cloud.init({
    //   traceUser: true,
    //   });
    plugin.configPlugin({
      // polyfill fetch function
      fetchFunc: fetchWechat.fetchFunc(),
      // inject tfjs runtime
      tf,
      // inject webgl backend
      webgl,
      // provide webgl canvas
      canvas: wx.createOffscreenCanvas()
    });
     tf.tensor([1,2,3,4]).print();
  }
})

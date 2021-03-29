//video.js
const regeneratorRuntime = require('regenerator-runtime');
const fetchWechat = require('fetch-wechat');
const tf = require('@tensorflow/tfjs-core');
var webgl = require('@tensorflow/tfjs-backend-webgl');
const tfl = require('@tensorflow/tfjs-layers');
var plugin = requirePlugin('tfjsPlugin');
const util = require('../../utils/util');
const MODELURL = 'http://ywjgmis-ywjgmis.stor.sinaapp.com/images_model/model.json';
const CLASSESURL = 'http://ywjgmis-ywjgmis.stor.sinaapp.com/images_model/classes.json';

Page({
  data: {
  },
  async onLoad(){
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
    const camera = wx.createCameraContext(this)
    const model = await this.loadModel();
    const CLASSES = await util.fetchJson(CLASSESURL).then((res) => res);
    let count = 0
    const listener = camera.onCameraFrame((frame) =>{
      count++
      if(count == 10){
        if(model){
          this.wasteSorting(frame,model,CLASSES);
          
        }
        count =0;
      }
    })
    listener.start();
    this.canves = wx.createCanvasContext('pose', this)
  },
  async loadModel(){
    const model = await tfl.loadLayersModel(MODELURL);
    return model;
  },
  
  async wasteSorting(frame,model,CLASSES){
    const imgData = {data:new Uint8Array(frame.data),width:frame.width,height:frame.height}
    const x = tf.tidy(() =>{
      const imgTensor = tf.browser.fromPixels(imgData)
      //图片大小调整
      const imgTsResized = tf.image.resizeBilinear(imgTensor,[224,224]);
      console.log("imgTsResized==="+imgTsResized);
      //归一化
       return imgTsResized.toFloat().sub(255/2).div(255/2).reshape([1,224,224,3]);
    })
    const pred = model.predict(x);
    const results = pred.arraySync()[0].map((score,i) => ({score,label:CLASSES[i]})).sort((a,b)=>b.score-a.score);
    console.log(results);
    this.setData({
      list: results,
      //res代表success函数的事件对，data是固定的，list是数组
     })
  }

})

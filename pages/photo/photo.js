// photo.js
// 获取应用实例
var util = require('../../utils/util.js');
const regeneratorRuntime = require('regenerator-runtime');
var fetchWechat = require('fetch-wechat');
const tf = require('@tensorflow/tfjs-core');
const tfl = require('@tensorflow/tfjs-layers');

var tempImagePath;

const app = getApp()
Page({
  onLoad() {
    
  },
  //拍照事件
  async record(){
    this.data.cameraContext = wx.createCameraContext()
    this.data.cameraContext.takePhoto({
      quality:"high", //高质量的图片
      success: res => {
        //res.tempImagePath照片文件在手机内的的临时路径
        tempImagePath = res.tempImagePath
        console.log("tempImagePath=="+tempImagePath);
        // wx.saveFile({
        //   tempFilePath: tempImagePath,
        //   success: function (res) {
        //     //返回保存时的临时路径 res.savedFilePath
        //     const savedFilePath = res.savedFilePath
        //     // 保存到本地相册
        //     wx.saveImageToPhotosAlbum({
        //       filePath: savedFilePath,
        //     })
        //   },
        //   //保存失败回调（比如内存不足）
        //   fail: console.log
        // })
      }
    })
    const model = await this.loadModel();
    //const img = await util.file2img(tempImagePath);
    const x = await this.imgToTensor(tempImagePath);
    //const img = await util.file2img(tempImagePath);

   // console.log("x==="+x);
  },
  async loadModel(){
    const model = await tfl.loadLayersModel('http://ywjgmis-ywjgmis.stor.sinaapp.com/images_model/model.json');
    return model;
  },

  async imgToTensor(imgPath){
    const imgbase64 = await util.file2img(imgPath);
    const buffer = wx.base64ToArrayBuffer(imgbase64);
    const imgData = {data: new Uint8Array(buffer)}
    console.log("imgData=="+imgData);
    //tidy优化性能
    return tf.tidy(() =>{
       const imgTensor = tf.browser.fromPixels(imgData, 4)
       console.log('imgTensor=='+imgTensor);
       // const imgTs = tf.node.decodeImage(new Uint8Array(buffer));
        //图片大小调整
        const imgTsResized = tf.image.resizeBilinear(imgTensor,[224,224]);
        //归一化
        return imgTsResized.toFloat().sub(255/2).div(255/2).reshape([1,224,224,3]);
    });
},

})

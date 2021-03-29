// index.js
// 获取应用实例
const app = getApp()

Page({
  onLoad() {
   
  },
  //拍照事件
  takePhoto(){
    wx.navigateTo({
      url: '/pages/video/video',	//跳转到自定义的一个拍照页面
    })
  }
})

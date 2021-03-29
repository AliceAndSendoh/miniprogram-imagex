function file2img(fileUrl){
  return new Promise((resolve,reject) => {
    const FileSystemManager = wx.getFileSystemManager();

    //  FileSystemManager.getFileInfo({
    //   filePath:fileUrl,
    //   success(res){
    //     console.log("res.size"+ res.size); 
    //   }
    //  });

    FileSystemManager.readFile({
      filePath:fileUrl,
      encoding:'base64',
      success(res){
        if(res.data){
          console.log("JSON.stringify(res.data)==="+res.data); 

          //let obj = JSON.parse(res.data);
          resolve(res.data);
        }
      },
        fail(err){
          console.log('图片加载失败',err);
          reject(err);
        }
    });
  });
};
//FileReader 方法微信不支持
function file2img2(fileUrl){
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(fileUrl);
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.width = 224;
      img.height =224;
      img.onload = () => resolve(img);
    };
  });
};

function fetchJson(url){
  return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      dataType:'json',
      method:"GET",
      header: {
       'content-type': 'application/json'
      },
      success(res){
       resolve(res.data);
      },
      fail(err){
        reject(err);
      }
     })
  });
  
}
module.exports = {
  file2img: file2img,
  fetchJson:fetchJson
  }
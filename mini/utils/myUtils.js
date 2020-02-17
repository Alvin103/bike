


//status 等等的信息
function get(key) { 
  var value = wx.getStorageSync(key)
  if (!value) {//没取到
    value = getApp().globalData[key];
  }
  return value;
}


module.exports.get = get;
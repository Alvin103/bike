// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["86", "80", "84", "87"],//国家代码 数组表示
    countryCodeIndex: 0,  //默认
    phoneNum: ""  //以后保存手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindCountryCodeChange: function (e) {
    //console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  inputPhoneNum: function (e) {
    //console.log(e)
    this.setData({
      phoneNum: e.detail.value
    })
  },

  genVerifyCode: function () {
    //获取国家代码的索引 
    var index = this.data.countryCodeIndex;
    //根据索引取值
    var countryCode = this.data.countryCodes[index];
    //获取输入的手机号
    var phoneNum = this.data.phoneNum;
    console.log(countryCode)
    console.log(phoneNum)
    //向后台发送请求
    wx.request({
      //小程序访问的网络请求协议必须是https，url里面不能有端口号
      url: "http://192.168.1.10:8080/user/genCode",
      //传递的参数
      data: {
        nationCode: countryCode,
        phoneNum: phoneNum,
        status: 1
      },
      //发送请求的方式
      method: 'GET',
      //成功的回调函数
      success: function (res) {
        //console.log(res)
         wx.showToast({
           title: '验证码已发送',
           icon: 'success'
         })
      }
    })
  },

  formSubmit: function (e) {
    //获取手机号
    var phoneNum = e.detail.value.phoneNum
    //获取验证码
    var verifyCode = e.detail.value.verifyCode
    //向后台发送手机号和验证码进行校验
    wx.request({
      url: "http://192.168.1.10:8080/user/verify",
      //POS的请求头是application/json,后台要的string，所以改变请求头
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { //数据
        phoneNum: phoneNum,
        verifyCode: verifyCode
      },
      method: "POST",
      success: function (res) {
        //校验成功，那么就
        if (res.data) {
          //将手机信息保存到mongo中
          wx.request({
            url: "http://192.168.1.10:8080/user/register",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            data: {
              phoneNum: phoneNum,
              regDate: new Date(),
              status: 1,
            },
            //信息保存成功，页面跳转（充值押金）
            success: function (res) {
              // //将手机号写入到手机的磁盘中
              // wx.setStorageSync("phoneNum", phoneNum)
              // //将手机号保存到到内存
              // var globalData = getApp().globalData
              // globalData.phoneNum = phoneNum
              // globalData.status = "deposit"
              // //手机信息保存到mongo后，然后跳转到交押金页面
              if(res.data) {
                wx.navigateTo({
                  url: '../deposite/deposite'
                })
                //记录用户的状态，0未注册，1绑定完了，2已实名
                //更新getApp().globalData中的数据，是更新内存中的数据
                getApp().globalData.status = 1
                getApp().globalData.phoneNum = phoneNum
                //保存到手机存储卡（磁盘）
                wx.setStorageSync("status", 1)
                wx.setStorageSync("phoneNum", phoneNum)
              } else {
                wx.showModal({
                  title: '提示',
                  content: '服务端错误，请稍后再试',
                })
              }
              
            }
          })
        } else { //失败
          wx.showModal({
            title: '提示',
            content: '您输入的验证码有误，请重新输入！',
            showCancel: false //取消“取消”按钮
          })
        }
      }
    })
  }



})
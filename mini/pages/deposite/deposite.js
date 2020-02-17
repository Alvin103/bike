// pages/deposit/deposit.js

var myUtils  = require("../../utils/myUtils.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  deposit: function() {
    var that = this;
    //获取用户的手机号
    var phoneNum = myUtils.get('phoneNum');
    wx.showModal({
      title: '提示',
      content: '是否要充值押金',
      confirmText: '确认',
      success: function(res) {
        if (res.confirm) {  //选择充值 
          wx.showLoading({  //提示框
            title: '充值中...',
            mask: true    //屏蔽其他按钮
          })
          // 先调用小程序的支付接口（模拟）
          // 如果成功，向后台发送请求，然后更新用户的押金
          wx.request({
            url: 'http://192.168.1.10:8080/user/deposite',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            data: {
              phoneNum: phoneNum,
              deposite: 299,
              status: 2
            },
            success: function (res) {
              // 关闭充值中的加载对话框
              wx.hideLoading();

              // 交过押金后，将用户status更新为2
              getApp().globalData.status = 2;
              wx.setStorageSync("status", 2);

              wx.navigateTo({
                url: '../identify/identify',
              })
            }
          })


        }

        

      }
    })
  }

})
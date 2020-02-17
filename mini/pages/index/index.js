//导包
var myUtils = require("../../utils/myUtils.js")


Page({
  
  data: {
    log: 0,
    lat: 0, 
    controls: [], //文档建议cover-view代替controls
    markers: [], //要往里面填json对象
  },
 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getLocation({  //获取坐标
      success: function(res) {  //经纬度赋值
        var log = res.longitude
        var lat = res.latitude
        that.setData({
          log : log,
          lat :lat
        })
        //查找单车
        findBikes(log, lat, that)
      },
    })

    wx.getSystemInfo({
      success: function(res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        
        that.setData({
          controls: [
            {//1.开锁按钮
              id: 1,
              //控件背景图片
              iconPath: '/images/unlock.png',
              //控件相对位置
              position: {
                width: 200,
                height: 90,
                left: windowWidth / 2 - 100,
                top: windowHeight - 120,
              },
              clickable: true //是否可点击 
            },
            {//2.定位按钮
              id: 2,
              iconPath: '/images/position.png',
              position: {
                width: 50,
                height: 50,
                left: 10,
                top: windowHeight - 100,
              },
              clickable: true
            },
            {//3.报修按钮
              id: 3, 
              iconPath: '/images/fix.png',
              position: {
                width: 50,
                height: 50,
                left: windowWidth - 65,
                top: windowHeight - 100,
              },
              clickable: true
            },
            {//4.充值按钮
              id: 4,
              iconPath: '/images/pay.png',
              position: {
                width: 60,
                height: 60,
                left: windowWidth - 73,
                top: windowHeight - 180,
              },
              clickable: true
            },
            {//5.中心点位置
              id: 5,
              iconPath: '/images/center.png',
              position: {
                width: 30,
                height: 30,
                left: windowWidth /2 - 15,
                top: windowHeight /2 - 35,
              },
              clickable: true
            },
            {//6.添加车辆
              id: 6,
              iconPath: '/images/add.png',
              position: {
                width: 35,
                height: 35,
              },
              clickable: true
            },
          ]
        })

      }
    })
  },
  /**
   * 控件被点击事件！
   */
  controltap: function(e) {
    var that = this;  //拷贝
    var cid = e.controlId; //记录返回的 id 执行不同的事件
    switch(cid) {
      case 1: { //扫码开锁
        //先从磁盘区 没有再从内存取默认值
        var status = myUtils.get("status")
        //console.log(status)
         //根据用户状态,跳转相应界面
        if (status == 0) {//如果是0，跳转到手机注册页面
          wx.navigateTo({
            url: '../register/register',
          })
        } else if(status == 1) {
          wx.navigateTo({
            url: '../deposite/deposite',
          })
        } else if(status == 2) {
          wx.navigateTo({
            url: '../identify/identify',
          })
        }
        break;
      }
      case 2: {//定位
        this.mapCtx.moveToLocation()
        break;
      }
      case 6: {//添加车辆
        //获取当前已有车辆
        //var bikes = that.data.markers;
        //临时坐标 其实试了一下也可以在case 6里修改data实现  但是不要在regionchange里去修改坐标 会导致自动重复触发！！电脑嗡嗡作响^_^  搜素了一下 大概了解了一下 问题就是 "regionchange重复调用事件"
        this.mapCtx.getCenterLocation({
          success: function (res) {
            var longitude = res.longitude;
            var latitude = res.latitude;
              //发送请求：将添加的单车数据发送到后台（SpringBoot）
              wx.request({
                url: 'http://192.168.1.10:8080//bike/add',//对应后端方法
                data: { 
                  location: [longitude, latitude],
                  status: 0
                },
                method: 'POST',
                success: function(res) {  
                  findBikes(longitude, latitude, that) 
                }
              })
          }
        })
        break;
      }
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
  */
    onReady: function() {
      //创建map上下文
      this.mapCtx = wx.createMapContext('myMap')
    },

  regionchange: function (e) {
    var that = this;
    // 获取移动后的位置
    var etype = e.type;
    if (e.type == 'end') {
      this.mapCtx.getCenterLocation({
        success: function (res) {
          var longitude = res.longitude;
          var latitude = res.latitude;
          findBikes(longitude, latitude, that);
        }
      })
    }
  }


})



function findBikes(longitude, latitude, that) {
  wx.request({
    url: 'http://192.168.1.10:8080/bike/findNear',
    method: "GET",
    data: {
      longitude: longitude,
      latitude: latitude
    },
    success: function(res) {
      //console.log(res)
      var bikes = res.data.map((geoResult) => {
        return {
          longitude: geoResult.content.location[0],
          latitude: geoResult.content.location[1],
          iconPath: "/images/bike.png",
          width: 35,
          height: 40,
          id: geoResult.content.id
        }
      })
      //将Bike的数组set到当前页面中的markers中
      that.setData({
        markers: bikes
      })
    }
  })
}
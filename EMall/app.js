
// app.js
App({
  onLaunch: function () {
    console.log('test');
    
    var that = this;
    //  获取商城名称
    wx.request({
      url: 'https://www.haiwar.com/' + that.globalData.subDomain + '/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        wx.setStorageSync('mallName', res.data.data.value);
      }
    })
    
    this.login();
  },
  login: function () {
    var that = this;
    var token = that.globalData.token;
    console.log("check-token:" + token);
    if (token) {
      wx.request({
        url: 'https://www.haiwar.com/' + that.globalData.subDomain + '/user/check-token',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.status != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
        
      })
     
      return;
    }
    
    wx.login({
      success: function (res) {
        console.log("res:"+res)
          wx.request({
          url: 'https://www.haiwar.com/'+ that.globalData.subDomain +'/user/wxapp/login',
          //url: that.globalData.mainDomain + '/user/wxapp/login',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: res.code
            //code: null
          },
          success: function (res) {
            console.log("status:" + res.data.status)
            console.log("msg" + res.data.msg)
            if (res.data.status == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.status != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试:'+res.data.msg,
                showCancel: false
              })
              return;
            }
            that.globalData.token = res.data.token;
          },
          fail: function () {
            console.log('系统错误')
          }
          
        })
      }
    })
  },
  registerUser: function () {
    console.log('registerUser')
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://www.haiwar.com/' + that.globalData.subDomain + '/user/wxapp/register/complex',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },
  globalData: {
    userInfo: null,
    mainDomain: "10.57.3.96:9000",
    subDomain: "mall",
    version: "1.4.0",
   // token: ""
  }
})

//wxc8dd653b3859285e
//39a204f8afd118df851ab276579917fb











import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


const router = new Router({
  routes: [

    {
      path: '/',
      redirect: '/login', //登录,
      hide: true
    },
    {
      path: '/404',
      component: resolve => require(['../views/common/404.vue'], resolve), //404
      name: '',
      hidden: true
    }, {
      path: '/forgetPwd',
      component: resolve => require(['../views/user/ForgetPwd.vue'], resolve) //忘记密码
    }, {
      path: '/register',
      component: resolve => require(['../views/user/Register.vue'], resolve) //注册
    },

    {
      path: '/homePage',
      component: resolve => require(['../views/common/Home.vue'], resolve), //主页面
      children: [ //主页面上加载分页面
        {
          path: '/',
          component: resolve => require(['../views/HomePage.vue'], resolve) //设置默认页面
        },
        //产品管理相关的页面
        {
          path: '/addProduct',
          component: resolve => require(['../views/product/AddProduct.vue'], resolve) //新建产品
        }, {
          name: 'productDetail',
          path: '/product/:productName/productDetail',
          component: resolve => require(['../views/product/ProductDetail.vue'], resolve) //产品信息
        }, {
          name: 'productEdit',
          path: '/productEdit',
          component: resolve => require(['../views/product/ProductEdit.vue'], resolve) //产品编辑
        },
        //设备管理相关的页面
        {
          name: 'deviceList',
          path: '/product/:productName/deviceList',
          component: resolve => require(['../views/device/DeviceList.vue'], resolve) //设备信息
        }, {
          name: 'deviceDetail',
          path: '/deviceDetail',
          component: resolve => require(['../views/device/DeviceDetail.vue'], resolve) //设备信息
        }, {
          name: 'deviceLog',
          path: '/deviceLog',
          component: resolve => require(['../views/device/DeviceLog.vue'], resolve) //设备信息
        }, {
          name: 'deviceShell',
          path: '/deviceShell',
          component: resolve => require(['../views/device/DeviceShell.vue'], resolve) //设备信息
        },

        //固件管理相关的页面
        {
          name: 'firmwareList',
          path: '/product/:productName/firmwareList',
          component: resolve => require(['../views/firmware/FirmwareList.vue'], resolve) //管理固件
        }, {
          name: 'firmwareEdit',
          path: '/firmwareEdit',
          component: resolve => require(['../views/firmware/FirmwareEdit.vue'], resolve) //升级固件
        }, {
          name: 'addFirmware',
          path: '/addFirmware',
          component: resolve => require(['../views/firmware/AddFirmware.vue'], resolve) //升级固件
        },
        //固件升级相关的页面
        {
          name: 'addUpgraded',
          path: '/addUpgraded',
          component: resolve => require(['../views/upgraded/AddUpgraded.vue'], resolve) //升级固件
        }, {
          name: 'upgradedList',
          path: '/product/:productName/upgradedList',
          component: resolve => require(['../views/upgraded/UpgradedList.vue'], resolve) //升级固件
        }, {
          name: 'isUpgradedList',
          path: '/isUpgradedList',
          component: resolve => require(['../views/upgraded/IsUpgradedList.vue'], resolve) //升级固件
        }, {
          name: 'upgradedEdit',
          path: '/upgradedEdit',
          component: resolve => require(['../views/upgraded/UpgradedEdit.vue'], resolve) //升级固件
        },
        //信息设置相关的页面
        {
          name: 'accountInfo',
          path: '/accountInfo',
          component: resolve => require(['../views/account/AccountInfo.vue'], resolve) //升级固件
        }, {
          name: 'accountInfoEdit',
          path: '/accountInfoEdit',
          component: resolve => require(['../views/account/AccountInfoEdit.vue'], resolve) //升级固件
        }, {
          name: 'companyInfo',
          path: '/companyInfo',
          component: resolve => require(['../views/account/CompanyInfo.vue'], resolve) //升级固件
        }, {
          name: 'memberInfo',
          path: '/memberInfo',
          component: resolve => require(['../views/account/MemberInfo.vue'], resolve) //升级固件
        }, {
          name: 'safeInfo',
          path: '/safeInfo',
          component: resolve => require(['../views/account/SafeInfo.vue'], resolve) //升级固件
        },
      ]
    }, {
      path: '/login',
      component: resolve => require(['../views/user/Login.vue'], resolve)
    },
  ]
});

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  // alert(sessionStorage.getItem('accessToken'))
  //    console.log(to);
  if ((to.path != '/login') && (!sessionStorage.getItem('showName') || sessionStorage.getItem('showName') == 'undefined')) {
    if ((to.path != '/forgetPwd') && (!sessionStorage.getItem('showName') || sessionStorage.getItem('showName') == 'undefined')) {
      if ((to.path != '/register') && (!sessionStorage.getItem('showName') || sessionStorage.getItem('showName') == 'undefined')) {
        next({
          path: '/login',
          // query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next()
    }

  } else {
    next()
  }
})

export default router

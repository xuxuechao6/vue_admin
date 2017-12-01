<template>
  <div class="sidebar">
    <el-menu default-active="/homePage" class="el-menu-vertical-demo" unique-opened>
      <el-menu-item index="/homePage" @click="$router.push('/homePage');">首页</el-menu-item>
      <el-menu-item index="/addProduct" @click="$router.push('/addProduct');">新建产品</el-menu-item>
      <el-submenu v-if="productNum" index="3">
        <template slot="title">产品管理</template>
        <el-submenu :index="item.Name" v-for="(item,i) in Results" :key="item.ProductId">
          <template slot="title">
            {{item.Name}}
          </template>
          <el-menu-item :index="item.Name+'1'" @click="productDetail(item.ProductId,item.Name)">
            产品信息
          </el-menu-item>
          <el-menu-item :index="item.Name+'2'" @click="deviceList(item.ProductId,item.Name)">
            设备信息
          </el-menu-item>
          <el-menu-item :index="item.Name+'3'" @click="firmwareList(item.ProductId,item.Name)">
            模块管理
          </el-menu-item>
          <el-menu-item :index="item.Name+'4'" @click="upgradedList(item.ProductId,item.Name)">
            固件升级
          </el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">设置</template>
        <el-menu-item index="/accountInfo" @click="$router.push('/accountInfo');">
          账户信息
        </el-menu-item>
        <el-menu-item index="/memberInfo" @click="$router.push('/memberInfo');">成员管理
        </el-menu-item>
        <el-menu-item index="/safeInfo" @click="$router.push('/safeInfo');">安全审计
        </el-menu-item>
      </el-submenu>

    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        activeIndex: 1,
        productNum: true,
        Results: [],
      }
    },

    mounted: function () {
      this.$nextTick(function () {
        this.cardView();
      })
    },

    methods: {
      cardView: function () {

        var sign1 = sessionStorage.getItem('login_TokenId') + "/products" + "GET"
        var sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        this.$http({
          url: "/iotadmin/products",
          method: 'get',
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          if (res.data.Results == null) {
            this.productNum = false
          } else {
            this.productNum = true
            this.Results = res.data.Results;

          }
          this.information = res.data;
        }).catch(function (error) {
          if (error.response) {
            if (error.response.data.ErrCode = "40000004") {
            } else {
              return false
            }
          } else {
            return false
          }
          ;
        });
      },
      productDetail(val, name) {
        let newId = val,
          newName = name;
        sessionStorage.setItem('productId', newId),
          sessionStorage.setItem('productName', newName),
        console.log('productId:' + newId)
        console.log('productName:' + newName)
        this.$router.push({
          name: 'productDetail',
          params: {
            productId: newId,
            productName: newName
          }
        })
      },
      deviceList(val, name) {
        let newId = val,
          newName = name;
        sessionStorage.setItem('productId', newId),
          sessionStorage.setItem('productName', newName),
        console.log('productId:' + newId)
        console.log('productName:' + newName)
        this.$router.push({
          name: 'deviceList',
          params: {
            productId: newId,
            productName: newName
          }
        })
      },
      firmwareList(val, name) {
        let newId = val,
          newName = name;
        sessionStorage.setItem('productId', newId),
          sessionStorage.setItem('productName', newName),
        console.log('productId:' + newId)
        console.log('productName:' + newName)
        this.$router.push({
          name: 'firmwareList',
          params: {
            productId: newId,
            productName: newName
          }
        })
      },
      upgradedList(val, name) {
        let newId = val,
          newName = name;
        sessionStorage.setItem('productId', newId),
          sessionStorage.setItem('productName', newName),
        console.log('productId:' + newId)
        console.log('productName:' + newName)
        this.$router.push({
          name: 'upgradedList',
          params: {
            productId: newId,
            productName: newName
          }
        })
      },
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
  }

  .sidebar > ul {
    height: 100%;
  }

  .sidebar > ul > li {
    text-indent: 15px;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>

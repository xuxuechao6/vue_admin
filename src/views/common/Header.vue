<template>
    <div class="header">
        <div class="logo" @click="handleIndex">
            <img class="logo_img" src="../../../static/img/logo.png">
           <span>IOT管理系统</span>
        </div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{showName}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        computed:{
            showName(){
                let DisplayName = sessionStorage.getItem('DisplayName');
                return DisplayName ? DisplayName : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                  sessionStorage.removeItem('DisplayName'),
                  sessionStorage.removeItem('login_TokenId')
                    this.$router.push('/login');
                }
            },
            handleIndex(){
                this.$router.push('/homepage');
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:300px;
        text-align: center;
        cursor: pointer;
    }
    .header .logo .logo_img{
        display: block;
        width:120px;
        margin-top: 20px;
        margin-left: 20px;
    }
    .header .logo span{
        display: block;
float: left;
        margin: -48px 0 0 155px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>

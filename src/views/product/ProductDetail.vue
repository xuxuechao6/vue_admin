<template>
    <div>
    
        <div class="ms-doc">
            <h3 class="clearfix header">
                <span class="btn_back" @click="handleBack">产品列表</span>/产品信息
                <el-button style="float: right;margin: 0 10px;" type="danger" icon="delete" @click="handleDelete"></el-button>
                <el-button style="float: right;margin: 0 10px;" type="info" icon="edit" @click="handleEdit"></el-button>
            </h3>
            <article>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">产品名称：</el-col>
                    <el-col :span="16" class="span_r">{{item.Name}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">产品类型：</el-col>
                    <el-col :span="16" class="span_r">{{item.Type | formatType(item.Type)}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">产品型号：</el-col>
                    <el-col :span="16" class="span_r">{{item.Model}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">设备链接类型：</el-col>
                    <el-col :span="16" class="span_r">{{item.LinkType | formatLinkType(item.LinkType)}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">设备数：</el-col>
                    <el-col :span="16" class="span_r">{{item.DeviceQuota}}</el-col>
                </el-row>
    
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">创建时间：</el-col>
                    <el-col :span="16" class="span_r">{{item.CreatedTime | formatDate(item.CreatedTime)}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">更新时间：</el-col>
                    <el-col :span="16" class="span_r">{{item.UpdatedTime | formatDate(item.UpdatedTime)}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">ProductId：</el-col>
                    <el-col :span="16" class="span_r">{{item.ProductId}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">产品密钥：</el-col>
                    <el-col :span="16" v-if="!productKey" class="span_r">
                        <span style="color: #00b89d;font-size: 16px;cursor: pointer" type="text" @click="handleKey">查看密钥</span>
                    </el-col>
                    <el-col :span="16" v-if="productKey" class="span_r">{{item.productKey.Key }}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">产品描述：</el-col>
                    <el-col :span="16" class="span_r">{{item.Description }}</el-col>
                </el-row>
    
                <el-row :gutter="20">
                    <el-col :span="6" class="span_l">是否发布：</el-col>
                    <el-col :span="16" class="span_r">{{item.IsRelease | formatIsRelease(item.IsRelease)}}</el-col>
                </el-row>
                <el-row :gutter="20" class="publish">
                    <el-col :span="12" :offset="6">
                        <el-button type="primary">发布</el-button>
                    </el-col>
                </el-row>
            </article>
        </div>
    
    </div>
</template>

<script>
import md5 from 'js-md5';
import { formatDate } from './../format/data';
export default {
    data: function () {
        return {
            productKey: false,
            item: {
                productKey: '',
            }
        }
    },
    watch: {
        '$route': 'detailView'
    },
    mounted: function () {
        this.$nextTick(function () {
            this.detailView();
        })
    },



    filters: {
        formatLinkType(val, column) {
            return val == "1" ? 'Wi-Fi设备' : val == "2" ? 'Zigbee网关' : val == "3" ? '蓝牙设备' : val == "4" ? '蓝牙Mesh设备' : val == "5" ? 'PC设备' : '未知';
        },

        formatType(val, column) {
            return val == "1" ? '智能家居' : val == "1" ? '安防，监控' : val == "2" ? '影音娱乐' : val == "3" ? '交通设备' : val == "4" ? '可穿戴设备' : val == "5" ? '工业设备' : val == "6" ? '智慧医疗' : val == "5" ? '儿童玩具' : '其它';
        },
        formatIsRelease(val, column) {
            return val == 0 ? '未发布' : val == 1 ? '已发布' : '未知';
        },
        formatDate(val) {
            var date = new Date(val * 1000);
            return formatDate(date, "yyyy-MM-dd hh:mm");
        }
    },
    methods: {
        handleBack() {
				  this.$router.push("/homePage")
			},
        handleEdit() {
            this.$router.replace('/productEdit');
        },
        detailView: function () {
            console.log(this.$route.params.productId)
            let self = this,
                productId = sessionStorage.getItem('productId'),
                _url = "/products/" + productId,
                _method = "GET",
                sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
                sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
            //将对象转为字符串
            //签名的 定义过程
            this.$http({
                url: "/iotadmin" + _url,
                method: _method,
                headers: {
                    'content-type': 'application/json',
                    'Rtt-Sign': sign
                },
            }).then((res) => {
                console.log(res.data)
                if (res.data == "") {
                    console.log(2222)
                    this.productNum = false
                } else {
                    this.productNum = true
                    this.item = res.data
                    console.log(this.item)
                }
                this.information = res.data;
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log("222:" + error.response.status);
                    console.log("333:" + error.response.header);
                    //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                    if (error.response.data.ErrCode = "40000004") {
                        self.$message.error('网络错误，请稍后再试');
                    } else {
                        self.$message.error('网络错误，请稍后再试');
                        return false
                    }
                } else {
                    console.log(error);
                    //一些错误是在设置请求的时候触发
                    console.log('Error', error.message);
                    return false
                };
            });
        },
        handleKey: function () {
            console.log(this.$route.params.productId)
            let self = this,
                productId = sessionStorage.getItem('productId'),
                _url = "/products/" + productId + "/key",
                _method = "GET",
                sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
                sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
            //将对象转为字符串
            //签名的 定义过程
            this.$http({
                url: "/iotadmin" + _url,
                method: _method,
                headers: {
                    'content-type': 'application/json',
                    'Rtt-Sign': sign
                },
            }).then((res) => {
                console.log(res.data)
                if (res.data == "") {
                    this.productKey = false
                } else {
                    this.productKey = true
                    this.item.productKey = res.data
                    console.log(this.item)
                }
                this.information = res.data;
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log("222:" + error.response.status);
                    console.log("333:" + error.response.header);
                    //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                    if (error.response.data.ErrCode = "40000004") {
                        self.$message.error('网络错误，请稍后再试');
                    } else {
                        self.$message.error('网络错误，请稍后再试');
                        return false
                    }
                } else {
                    console.log(error);
                    //一些错误是在设置请求的时候触发
                    console.log('Error', error.message);
                    return false
                };
            });
        },




        handleDelete() {
            this.$confirm('此操作将永久删除该产品信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let self = this
                let productId = sessionStorage.getItem('productId');
                var _url = "/products/" + productId;
                var _method = "DELETE"
                var sign1 = sessionStorage.getItem('login_TokenId') + _url + _method
                var sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
                console.log(sign1)
                console.log(sign)
                this.$http({
                    url: "/iotadmin" + _url,
                    method: _method,
                    headers: {
                        'content-type': 'application/json',
                        'Rtt-Sign': sign
                    },
                }).then((res) => {
                    console.log(res.data)
                    if (res.data == "") {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                        this.$router.push('/homePage'),
                            this.$router.go(0)
                    } else {
                        this.$message({
                            type: 'info',
                            message: '删除失败'
                        });
                    }
                    this.information = res.data;
                }).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log("222:" + error.response.status);
                        console.log("333:" + error.response.header);
                        //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                        if (error.response.data.ErrCode = "40000004") {
                            self.$message.error('网络错误，请稍后再试');
                        } else {
                            self.$message.error('网络错误，请稍后再试');
                            return false
                        }
                    } else {
                        console.log(error);
                        //一些错误是在设置请求的时候触发
                        console.log('Error', error.message);
                        return false
                    };
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    }
}
</script>

<style scoped>
.ms-doc {
    width: 100%;
    max-width: 980px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.ms-doc h3 {
    padding: 9px 10px 10px;
    margin: 0;
    font-size: 14px;
    line-height: 25px;
    background-color: #f5f5f5;
    border: 1px solid #d8d8d8;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
}

.ms-doc article {
    padding: 45px;
    word-wrap: break-word;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}

.ms-doc article>div {
    padding: 10px 0;
}

.span_l {
    text-align: right;
    color: #999;
}

.publish {
    margin-top: 20px;
}
</style>

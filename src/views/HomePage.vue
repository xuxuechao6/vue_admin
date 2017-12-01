<template>
    <div>
        <div class="ms-doc">
            <h3>产品列表</h3>
            <article class="clearfix">
                <span v-if="!showList" style="color: #999">暂无设备</span>
                <el-card v-loading="listLoading"  class="box-card" v-for="item of Results" :key="item.ProductId">
                    <div v-if="showList">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;" v-text="item.Name"> </span>
                        <el-button style="float: right;margin-left: 20px" type="info" @click="handleDetail(item.ProductId,item.Name)">详情
                        </el-button>
                        <el-button style="float: right;" type="primary" @click="handleEdit(item.ProductId,item.Name)">编辑
                        </el-button>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="6" class="span_l">产品类型：</el-col>
                        <el-col :span="16" class="span_r">{{item.Type | formatType}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6" class="span_l">设备配额总数：</el-col>
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
                        <el-col :span="6" class="span_l">产品描述：</el-col>
                        <el-col :span="16" class="span_r">{{item.Description}}</el-col>
                    </el-row>
                    </div>
                </el-card>
            </article>
        </div>

    </div>
</template>

<script>

import { requestProductList } from './api/api';
import { formatDate } from './format/data';
export default {
    data() {
        return {
            listLoading: false,
            showList: true,
            Results: {
            },
            newResults: {
            }
        }
    },
    mounted: function () {     //页面加载时先进行加载的函数
        this.$nextTick(function () {
            this.listView();
        })
    },
    methods: {
        listView: function () {
            let productListParams = {
                _url: "/products",
                _method: "GET",
                body: ""
            };
            this.listLoading = true;
            requestProductList(productListParams).then((res) => {
                //console.log(res.data)
                if (res.data.Results == null) {
                    this.showList = false
                } else {
                    this.showList = true
                    this.Results = res.data.Results;
                    this.listLoading = false;
                    //console.log(this.Results)
                }
                this.information = res.data;
            }).catch(function (error) {
                if (error.response) {
//                    console.log(error.response.data);
//                    console.log("222:" + error.response.status);
//                    console.log("333:" + error.response.header);
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
        handleEdit(val, name) {
            let newId = val,
                newName = name;
            console.log(name)
            console.log(val)
            sessionStorage.setItem('productId', newId),
                sessionStorage.setItem('productName', newName),
                this.$router.push({
                    name: 'productEdit',
                    params: {
                        productId: newId,
                        productName: newName
                    }
                })
        },
        handleDetail(val, name) {
            let newId = val,
                newName = name;
            sessionStorage.setItem('productId', newId),
                sessionStorage.setItem('productName', newName),
                this.$router.push({

                    name: 'productDetail',
                    params: {
                        productId: newId,
                        productName: newName
                    }
                })
        },
        handleAdd() {
            this.$router.push('/addProduct');
        },

    },

    filters: { //数据过滤器
        formatDate(val) {
            if (val == undefined || val == "") {
                return "无"
            } else {
                let date = new Date(val * 1000);
                return formatDate(date, "yyyy-MM-dd hh:mm");
            }

        },
        formatType(val, column) {
            return val == "0" ? '智能家居' : val == "1" ? '安防，监控' : val == "2" ? '影音娱乐' : val == "3" ? '交通设备' : val == "4" ? '可穿戴设备' : val == "5" ? '工业设备' : val == "6" ? '智慧医疗' : val == "7" ? '儿童玩具' : '其它';
        },

    }

}
</script>

<style scoped>
.ms-doc {
    width: 100%;
    max-width: 980px;
    min-width: 450px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.ms-doc h3 {
    padding: 9px 10px 10px;
    margin: 0;
    font-size: 14px;
    line-height: 17px;
    background-color: #f5f5f5;
    border: 1px solid #d8d8d8;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
}

.ms-doc article {
    padding: 40px;
    word-wrap: break-word;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}

.ms-doc article>div {
    margin-bottom: 40px;
    min-width: 300px;
}

.el-row {
    height: 35px;
    line-height: 35px;
}

.span_l {
    text-align: right;
    color: #999;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>

webpackJsonp([12],{120:function(e,r,t){function o(e){t(277)}var i=t(41)(t(233),t(305),o,"data-v-4d5ed514",null);e.exports=i.exports},132:function(e,r){var t=e.exports={version:"2.5.0"};"number"==typeof __e&&(__e=t)},137:function(e,r,t){e.exports={default:t(138),__esModule:!0}},138:function(e,r,t){var o=t(132),i=o.JSON||(o.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},233:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o=t(137),i=t.n(o);r.default={data:function(){return{restaurants:[],fileList:[],ruleForm:{FileUrl:"",FileSize:"",FileMd5:"",FileName:"",Type:"",Version:"",Description:""},rules:{Type:[{}],Version:[{required:!0,message:"请输入固件版本号",trigger:"blur"}]}}},mounted:function(){this.$nextTick(function(){this.detailView()}),this.restaurants=this.loadAll()},methods:{handleBack:function(){this.$router.go(-1)},loadAll:function(){return[{value:"firmware"},{value:"filesystem"}]},querySearch:function(e,r){var t=this.restaurants;r(e?t.filter(this.createFilter(e)):t)},createFilter:function(e){return function(r){return 0===r.value.indexOf(e.toLowerCase())}},detailView:function(){var e=this,r=this,t=sessionStorage.getItem("productId"),o=sessionStorage.getItem("FirmwareId"),i="/products/"+t+"/firmware/"+o,s=sessionStorage.getItem("login_TokenId")+i+"GET",n=this.md5(s)+","+sessionStorage.getItem("login_Signature");this.$http({url:"/iotadmin"+i,method:"GET",headers:{"content-type":"application/json","Rtt-Sign":n}}).then(function(r){console.log(r.data),""==r.data?e.productNum=!1:(e.productNum=!0,e.ruleForm=r.data,e.fileList.push({name:r.data.Name6,url:"res.data.FileUrl"}),console.log(e.ruleForm)),e.information=r.data}).catch(function(e){return e.response?(console.log(e),console.log(e.response.data),console.log(e.response.data.ErrCode),(e.response.data.ErrCode="40000303")?void r.$message.error("已发布版本的固件无法被修改"):(r.$message.error("网络错误，请稍后再试"),!1)):(console.log(e),console.log("Error",e.message),!1)})},handleRemove:function(e,r){},handleChange:function(e,r){this.fileList=r.slice(-1),this.ruleForm.FileName=e.name},handleSuccess:function(e){this.ruleForm.FileUrl=e.FileUrl,this.ruleForm.FileSize=e.FileSize,this.ruleForm.FileMd5=e.FileMd5},handleError:function(e,r,t){console.log(e.response)},submitForm:function(e){var r=this,t=this,o=sessionStorage.getItem("productId"),s=sessionStorage.getItem("FirmwareId"),n="/products/"+o+"/firmware/"+s,a={Model:t.ruleForm.Description,Version:t.ruleForm.Version,Description:t.ruleForm.Description,FileSize:t.ruleForm.FileSize,FileMd5:t.ruleForm.FileMd5,FileUrl:t.ruleForm.FileUrl,Name:t.ruleForm.FileName},l=i()(a),d=sessionStorage.getItem("login_TokenId")+n+"PUT"+l,u=this.md5(d)+","+sessionStorage.getItem("login_Signature");t.$refs[e].validate(function(e){if(!e)return!1;r.$http({url:"/iotadmin"+n,method:"PUT",headers:{"content-type":"application/json","Rtt-Sign":u},data:l}).then(function(e){r.add_suc(e)}).catch(function(e){r.add_err(e)})})},add_suc:function(e){if(200==e.status){this.$notify({title:"GOOD",message:"修改固件成功",type:"success"});var r=sessionStorage.getItem("productId"),t=sessionStorage.getItem("productName");console.log("newId:"+r),this.$router.push({path:"/firmwareList/:productId",name:"firmwareList",params:{productId:r,productName:t}})}else this.$message.error("修改固件失败")},add_err:function(e){var r=this;return e.response?(console.log(e.response.data),console.log(e.response.data.ErrCode),40000101!=e.response.data.ErrCode?(r.$message.error("添加新固件失败，请稍候再试"),!1):void r.$message.error("该固件已存在，请添加新固件")):(console.log("Error",e.message),r.$message.error("网络错误，请稍候再试"),!1)},escForm:function(e){this.$router.go(-1)}}}},253:function(e,r,t){r=e.exports=t(105)(!0),r.push([e.i,".ms-doc[data-v-4d5ed514]{width:100%;max-width:980px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}.ms-doc h3[data-v-4d5ed514]{padding:9px 10px 10px;margin:0;font-size:14px;line-height:17px;background-color:#f5f5f5;border:1px solid #d8d8d8;border-bottom:0;border-radius:3px 3px 0 0}.ms-doc article[data-v-4d5ed514]{padding:45px;word-wrap:break-word;background-color:#fff;border:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.ms-doc article .el-input[data-v-4d5ed514]{width:300px}","",{version:3,sources:["C:/Users/Administrator/Desktop/realthread_IoT/vue_admin/src/views/firmware/FirmwareEdit.vue"],names:[],mappings:"AACA,yBACE,WAAY,AACZ,gBAAiB,AACjB,gFAAyF,CAC1F,AACD,4BACE,sBAAuB,AACvB,SAAU,AACV,eAAgB,AAChB,iBAAkB,AAClB,yBAA0B,AAC1B,yBAA0B,AAC1B,gBAAiB,AACjB,yBAA2B,CAC5B,AACD,iCACE,aAAc,AACd,qBAAsB,AACtB,sBAAuB,AACvB,sBAAuB,AACvB,+BAAgC,AAChC,6BAA+B,CAChC,AACD,2CACE,WAAa,CACd",file:"FirmwareEdit.vue",sourcesContent:['\n.ms-doc[data-v-4d5ed514] {\n  width: 100%;\n  max-width: 980px;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;\n}\n.ms-doc h3[data-v-4d5ed514] {\n  padding: 9px 10px 10px;\n  margin: 0;\n  font-size: 14px;\n  line-height: 17px;\n  background-color: #f5f5f5;\n  border: 1px solid #d8d8d8;\n  border-bottom: 0;\n  border-radius: 3px 3px 0 0;\n}\n.ms-doc article[data-v-4d5ed514] {\n  padding: 45px;\n  word-wrap: break-word;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n}\n.ms-doc article .el-input[data-v-4d5ed514] {\n  width: 300px;\n}\n'],sourceRoot:""}])},277:function(e,r,t){var o=t(253);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);t(106)("05405d3c",o,!0)},305:function(e,r){e.exports={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",[t("div",{staticClass:"ms-doc"},[t("h3",[t("span",{staticClass:"btn_back",on:{click:e.handleBack}},[e._v("模块管理")]),e._v("/编辑固件信息")]),e._v(" "),t("article",[t("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"140px"}},[t("el-form-item",{attrs:{label:"固件类型：",prop:"Type"}},[t("el-autocomplete",{staticClass:"inline-input",attrs:{"fetch-suggestions":e.querySearch,placeholder:"请输入固件类型"},model:{value:e.ruleForm.Type,callback:function(r){e.ruleForm.Type=r},expression:"ruleForm.Type"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"固件版本号：",prop:"Version"}},[t("el-input",{model:{value:e.ruleForm.Version,callback:function(r){e.ruleForm.Version=r},expression:"ruleForm.Version"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"上传固件文件："}},[t("el-upload",{staticClass:"upload-demo",attrs:{action:"iotadmin/firmwares/file","on-change":e.handleChange,"file-list":e.fileList,multiple:!1,"on-error":e.handleError,"on-success":e.handleSuccess,"on-remove":e.handleRemove,"auto-upload":!0}},[t("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")]),e._v(" "),t("div",{staticClass:"el-upload__tip",slot:"tip"},[e._v("请上传类型匹配的固件")])],1)],1),e._v(" "),t("el-form-item",{attrs:{label:"版本说明：",prop:"Description"}},[t("el-input",{attrs:{type:"textarea"},model:{value:e.ruleForm.Description,callback:function(r){e.ruleForm.Description=r},expression:"ruleForm.Description"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(r){e.submitForm("ruleForm")}}},[e._v("确认修改")]),e._v(" "),t("el-button",{on:{click:e.escForm}},[e._v("取消")])],1)],1)],1)])])},staticRenderFns:[]}}});
//# sourceMappingURL=12.4d7058a990ed9f0b2b33.js.map
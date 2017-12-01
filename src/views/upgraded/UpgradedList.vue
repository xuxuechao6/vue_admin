<template>
	<div>

		<div class="ms-doc">
			<h3 class="clearfix header">
				版本列表
				<el-button style="float: right;" type="primary"  @click="handleAdd('upgraded')">+ 新建OTA版本</el-button>
			</h3>
			<article>
        <span v-if="!showList" style="color: #999">暂无升级任务</span>

        <el-table v-if="showList"  :data="Results" border class="table" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column prop="Version" label="版本号" sortable  align="center" width="110">
					</el-table-column>
          <el-table-column prop="CreatedTime" label="创建时间" sortable align="center" :formatter="formatDate" width="150">
					</el-table-column>
					<el-table-column prop="DeviceList" label="允许升级的设备列表" align="center" width="180">
					<template scope="scope">
							<el-button type="text" @click="handleDeviceList(scope.row)">查看列表</el-button>
						</template>
					</el-table-column>
          <el-table-column prop="FirmwareList" align="center" label="固件列表" width="140">
            <template scope="scope">
              <el-button type="text" @click="handleFirmwareList(scope.row)">查看列表</el-button>
            </template>
          </el-table-column>
					<el-table-column label="备注"prop="Description" >
					</el-table-column>
				</el-table>
			</article>


			<el-dialog title="固件列表"  size="small"  :visible.sync="dialogTableVisible">
  <el-table :data="Firmwares" border max-height="520px" style="width: 100%" >
    <el-table-column prop="Index" label="升级序号" align="center" width="100"></el-table-column>
    <el-table-column prop="UpgradeMode" :formatter="formatNum" align="center" width="100" label="升级方式"></el-table-column>
    <el-table-column prop="Type" label="固件型号" align="center" width="100"></el-table-column>
		<el-table-column prop="Version" label="固件版本号" align="center" width="130"></el-table-column>
		<el-table-column prop="Name" label="文件名字" align="center" width="150"></el-table-column>
		<el-table-column prop="FileSize" label="文件大小" align="center" width="120"></el-table-column>
		<el-table-column prop="Description" label="描述" align="center" width="171"></el-table-column>
    </el-table>
</el-dialog>

		</div>

	</div>
</template>
<script>
  import {formatDate} from './../format/data';
  import {requestUpgradeList} from './../api/api';
	export default {
		data: function() {
			return {
				dialogTableVisible: false,
        showList: true,
				Results: [],
				Firmwares:[],
			}
		},
    watch:{
      '$route': 'detailView'
    },
    mounted: function() {     //页面加载时先进行加载的函数
      this.$nextTick(function() {
        this.listView();
      })
    },
		methods: {
			    //显示转换
        formatNum: function (val, column) {
            return val.UpgradeMode == 1 ? '可选升级' : val.UpgradeMode == 2 ? '强制升级' : val.UpgradeMode == 3 ? '静默升级': '未知';
        },
      listView: function() {
        let productId=sessionStorage.getItem("productId"),
          upgradeListParams = {
          _url:"/products/"+productId+"/upgrade",
          _method:"GET",
          body:""
        };
        this.listLoading = true;
        requestUpgradeList(upgradeListParams).then((res) => {
          console.log(res.data)
          if(res.data.Results == null) {
            console.log(2222)
            this.showList = false
          } else {
            this.showList = true
            this.Results = res.data.Results;
            this.listLoading = false;
            console.log(this.Results)
          }
          this.information = res.data;
        }).catch(function(error) {
          if(error.response) {
            console.log(error.response.data);
            console.log("222:" + error.response.status);
            console.log("333:" + error.response.header);
            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
            if(error.response.data.ErrCode = "40000004") {
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
			handleAdd(upgraded){
				this.$router.push('/addUpgraded');
			},
      formatDate(val) {
        let _val=val.CreatedTime
        if(_val==undefined||_val==""){
          return "无"
        }else {
          let date = new Date(_val*1000);
          return formatDate(date, "yyyy-MM-dd hh:mm");
        }

      },
			handleEdit(index, row) {
				console.log(index, row);
				this.$router.push('/upgradedEdit');
			},
      handleDeviceList(val){
				sessionStorage.setItem("AllowDevices",JSON.stringify(val.AllowDevices))
        this.$router.push('/isUpgradedList');
      },
      handleFirmwareList(val){
				this.dialogTableVisible=true
				this.Firmwares=val.Firmwares;
        console.log(this.Firmwares)
      },
			handleDelete(index, row) {
				console.log(index, row);
				this.$confirm('此操作将永久删除该设备信息, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
							type: 'success',
							message: '删除成功!',

						},
						this.$router.push('/deviceList'));

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

	.ms-doc article th {
		min-width: 120px;
		display: block;
		text-align: center !important;
	}
</style>

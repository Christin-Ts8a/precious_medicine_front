<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-button
          class="search_model"
          type="primary"
          style="width: 160px;"
          @click="centerDialogVisible = true">请求模型</el-button>
<!--      <el-button class="start_train" type="primary" @click="startTrain">发起训练</el-button>-->
      <!--      <el-button class="model_upload" type="primary" @click="centerDialogVisible = true">上传模型</el-button>-->
      <el-dialog
          title="上传"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
        <upload @uploadFinish="uploadFinish"></upload>
      </el-dialog>
    </div>
    <div>
      <p>训练历史</p>
    </div>
    <div class="btn-list">
<!--      <el-button type="primary" @click="shareModel">-->
<!--        <i class="el-icon-upload"></i>-->
<!--        共享-->
<!--      </el-button>-->
<!--      <el-button type="primary" @click="centerDialogVisible = true">-->
<!--        <i class="el-icon-plus"></i>-->
<!--        上传-->
<!--      </el-button>-->
<!--      <el-dialog-->
<!--          title="上传"-->
<!--          :visible.sync="centerDialogVisible"-->
<!--          width="30%"-->
<!--          center>-->
<!--        <upload :upload-url=this.uploadUrl @uploadFinishFile="uploadFinishFile" @uploadFinish="uploadFinish"></upload>-->
<!--      </el-dialog>-->
<!--      <el-button type="danger">-->
<!--        <i class="el-icon-delete"></i>-->
<!--        删除-->
<!--      </el-button>-->
<!--      <span class="selected-txt">-->
<!--      已选中{{ selectedNum }}个-->
<!--      </span>-->
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="60">
      </el-table-column>
      <el-table-column
          prop="id"
          label="ID"
          width="60">
      </el-table-column>
      <el-table-column
          prop="modelName"
          label="模型名称"
          width="140">
      </el-table-column>
      <el-table-column
          prop="dataName"
          label="数据集名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="训练时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="orgName"
          label="请求人"
          width="180">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="status"-->
<!--          label="模型状态"-->
<!--          width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="tableData[scope.$index].status === 1" size="medium">共享</el-tag>-->
<!--          <el-tag v-if="tableData[scope.$index].status === 0" size="medium">本地</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes=this.pageSizes
        :page-size=this.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
    </el-pagination>
  </div>
</template>

<script>
import upload from "./upload";
import * as api from "../api/api"
export default {
  name: "model_manage",
  components: {upload},
  created() {
    let orgCode = localStorage.getItem("orgCode")
    this.uploadUrl = "http://192.168.3.29:8000/add_Model/?id=" + orgCode
    api.getModelList({pageSize: this.pageSize, pageNum: this.currentPage, byOrg: '1'}).then(res => {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
      }
      this.tableData = res.data.list
      this.total = res.data.total
    })
  },
  methods: {
    shareModel() {
      if (this.selectedNum <= 0) {
        this.$notify({
          title: '失败',
          message: '请选择共享模型',
          type: 'error',
          duration: 1000 * 3
        });
        return;
      }
      for (let i = 0; i < this.selectedTableData.length; i++) {
        if (this.selectedTableData[i].status === 1) {
          this.$notify({
            title: '失败',
            message: '模型\"' + this.selectedTableData[i].modelName + '\"已经为共享状态',
            type: 'error',
            duration: 1000 * 3
          });
          return;
        }
      }
      this.loading = true
      for (let i = 0; i < this.selectedTableData.length; i++) {
        let data = {
          modelName: this.selectedTableData[i].modelName
        }
        api.getShareModel(data).then(res => {
          if (res.status === 200) {
            this.$notify({
              title: '成功',
              message: '模型\"' + this.selectedTableData[i].modelName + '\"共享成功',
              type: 'success',
              duration: 1000 * 3
            });
            this.loading = false
            api.getModelList({pageSize: this.pageSize, pageNum: this.currentPage, byOrg: '1'}).then(res => {
              if (res.status === 200) {
                for (let i = 0; i < res.data.list.length; i++) {
                  res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
                }
                this.tableData = res.data.list
                this.total = res.data.total
              }
            })
          } else {
            this.loading = false
            this.$notify({
              title: '失败',
              message: '模型\"' + this.selectedTableData[i].modelName + '\"共享失败',
              type: 'error',
              duration: 1000 * 3
            });
          }
        })
      }
    },
    uploadFinish(param) {
      this.centerDialogVisible = param
    },
    uploadFinishFile(param) {
      if (param.response.status === 200) {
        this.uploadedFile.push(param)
        if (this.uploadedFile.length === 2) {
          let modelName = ''
          let dataName = ''
          for(let i = 0; i < this.uploadedFile.length; i++) {
            if (this.uploadedFile[i].name.indexOf(".txt") !== -1) {
              dataName = this.uploadedFile[i].name.split(".")[0]
            } else {
              modelName = this.uploadedFile[i].name.split(".")[0]
            }
          }
          let data = {
            modelName: modelName,
            dataName: dataName,
            orgCode: localStorage.getItem("orgCode"),
            status: 0
          }
          api.addModel(data).then(res => {
            if (res.status === 200) {
              this.$notify({
                title: '成功',
                message: '模型上传成功',
                type: 'success',
                duration: 1000 * 3
              });
              this.centerDialogVisible = false
              api.getModelList({pageSize: this.pageSize, pageNum: this.currentPage, byOrg: '1'}).then(res => {
                if (res.status === 200) {
                  for (let i = 0; i < res.data.list.length; i++) {
                    res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
                  }
                  this.tableData = res.data.list
                  this.total = res.data.total
                }
              })
            } else {
              this.$notify({
                title: '失败',
                message: '模型上传失败',
                type: 'error',
                duration: 1000 * 3
              });
            }
          })
        }
      }
    },
    handleSelectionChange(param) {
      this.selectedTableData = param
      this.selectedNum = param.length
    },
    handleSizeChange(param) {
      this.pageSize = param
    },
    handleCurrentChange(param) {
      this.currentPage = param
    },
  },
  data() {
    return {
      selectedNum: 0,
      tableData: [],
      selectedTableData: [],
      centerDialogVisible: false,
      currentPage: 1,
      total: 0,
      loading: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50],
      uploadUrl: '',
      uploadedFile: [],
      searchModelName: ''
    }
  },
}
</script>

<style scoped>
.parent-container {
  margin: 10px;
}

.btn-list {
  display: flex;
  align-items: center;
}

.el-button {
  height: 40px;
  margin-right: 10px;
  width: 90px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>

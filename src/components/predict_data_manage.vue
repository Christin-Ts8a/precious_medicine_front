<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-button class="btn-upload" type="primary" @click="centerDialogVisible = true">
        <i class="el-icon-plus"></i>
        上传数据集
      </el-button>
      <el-dialog
          title="上传"
          :visible.sync="centerDialogVisible"
          width="30%"
          close-on-click-modal
          center>
        <upload upload-url="http://127.0.0.1:8088/predict/add/" @uploadFinish="uploadFinish"></upload>
      </el-dialog>
      <el-dialog
          title="选择模型"
          :visible.sync="dialogVisible"
          width="30%">
        <div style="margin-bottom: 1rem"><span>模型名称：</span>
          <el-select v-model="model" placeholder="请选择模型">
            <el-option
                v-for="item in searchModelTypeList"
                :key="item.id"
                :label="item.modelName"
                :value="item.id"></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 1rem"><span>模型类型：</span>
          <el-input disabled style="width: 20rem" value="CNN"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; loading = false">取 消</el-button>
        <el-button type="primary" @click="confirmSearch">确 定</el-button>
      </span>
      </el-dialog>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          prop="id"
          label="ID"
          width="80">
      </el-table-column>
      <el-table-column
          prop="createUsername"
          label="创建人"
          width="180">
      </el-table-column>
      <el-table-column
          prop="predictDataName"
          label="数据集名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="上传时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="option"
          label="操作"
          width="280">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deletePredictData(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="startSearch">
            <i class="el-icon-search"></i>
            预测
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page=this.currentPage
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
  name: "predict_data_manage",
  components: {upload},
  created() {
    
    this.userId = localStorage.getItem("userId")
    let params = {
      pageSize: this.pageSize,
      pageNum: this.currentPage,
      byUser: this.userId
    }
    api.getTrainHistory(params).then(res => {
      this.modelList = res.data.list
      this.searchModelTypeList = res.data.list
      console.log(this.searchModelTypeList);
    })
    api.predictDataList({pageSize: this.pageSize, pageNum: this.currentPage}).then(res => {
      this.tableData = res.data.list
      this.total = res.data.total
    })
  },
  methods: {
    deletePredictData(param) {
      let data = {
        id: param.id,
        createUser: param.createUser
      }
      api.predictDataDel(data).then(res => {
        if (res.status === 200) {
          api.predictDataList({pageSize: this.pageSize, pageNum: this.currentPage}).then(res => {
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
              res.data.list[i].predictDataName = res.data.list[i].predictDataName.split(".")[0]
            }
            this.tableData = res.data.list
            this.total = res.data.total
            api.predictDataDelFile({dataName: param.name}).then(res => {
              if (res.status === 200) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 1000 * 3
                });
              }
            })
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 1000 * 3
          });
        }
      })
    },
    confirmSearch(){
      let data = {
        userName: localStorage.getItem("userName")
      }
      this.dialogVisible = false
      api.predict_model(data).then(res => {
        this.loading = false
      }).catch(res => {
        this.loading = false
        this.$notify({
              title: '成功',
              message: '预测结束',
              type: 'success',
              duration: 1000 * 3
            });
      })
    },
    startSearch(param) {
      // if (param.createUsername !== localStorage.getItem("nickname")) {
      //   this.$notify({
      //     title: '失败',
      //     message: '无法使用他人数据预测',
      //     type: 'error',
      //     duration: 1000 * 3
      //   });
      // } else if (this.selectedModelList === '') {
      //   this.$notify({
      //     title: '失败',
      //     message: '未选择模型',
      //     type: 'error',
      //     duration: 1000 * 3
      //   });
      // } else {
      this.loading = true
      this.dialogVisible = true
      // let data = {
      //   modelName: this.selectedModelList,
      //   dataName: param.predictDataName,
      //   status: 0
      // }
      // api.predict(data).then(res => {
      //   if (res.status === 200) {
      //     this.$notify({
      //       title: '成功',
      //       message: '预测成功',
      //       type: 'success',
      //       duration: 1000 * 3
      //     });
      //     this.loading = false
      //   } else {
      //     this.loading = false
      //     this.$notify({
      //       title: '失败',
      //       message: '预测失败',
      //       type: 'error',
      //       duration: 1000 * 3
      //     });
      //   }
      // })
      // }
    },
    uploadFinish(param) {
      if (param) {
        api.predictDataList({pageSize: this.pageSize, pageNum: this.currentPage}).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
      } else {
        this.$notify({
          title: '失败',
          message: '上传失败',
          type: 'error',
          duration: 1000 * 3
        });
      }
    },
    handleSelectionChange(param) {
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
      dialogVisible: false,
      modelList: [],
      selectedModelList: '',
      selectedNum: 0,
      tableData: [],
      selectedTableData: [],
      centerDialogVisible: false,
      currentPage: 1,
      total: 0,
      loading: false,
      pageSizes: [5, 10, 20, 50],
      pageSize: 10,
      model: '',
      searchModelTypeList: [],
      userId: 0
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

.btn-upload {
  height: 40px;
  width: 150px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>

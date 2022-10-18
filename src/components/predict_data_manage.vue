<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-button type="primary" @click="centerDialogVisible = true">
        <i class="el-icon-plus"></i>
        添加
      </el-button>
      <el-dialog
          title="上传"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
        <upload upload-url="http://192.168.3.29:8000/add_Predict_data/" @uploadFinishFile="uploadFinish"></upload>
      </el-dialog>
      <el-dialog
          title="选择模型"
          :visible.sync="dialogVisible"
          width="30%">
        <div style="margin-bottom: 1rem"><span>模型名称：</span>
          <el-select v-model="model" placeholder="请选择模型">
            <el-option
                v-for="item in searchModelTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 1rem"><span>模型类型：</span>
          <el-input disabled style="width: 20rem" value="CNN"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; loading = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
          prop="orgName"
          label="机构名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="dataName"
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
          <el-button size="mini" type="primary" @click="startSearch(scope.row)">
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
    api.getModelList({pageSize: 100, pageNum: 1, byOrg: '1'}).then(res => {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
      }
      this.modelList = res.data.list
    })
    api.predictDataList({pageSize: this.pageSize, pageNum: this.currentPage}).then(res => {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
        res.data.list[i].predictDataName = res.data.list[i].predictDataName.split(".")[0]
      }
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
      if (param.response.status === 200) {
        let data = {
          predictDataName: param.name
        }
        api.predictDataAdd(data).then(res => {
          if (res.status === 200) {
            this.centerDialogVisible = false
            api.predictDataList({pageSize: this.pageSize, pageNum: this.currentPage}).then(res => {
              for (let i = 0; i < res.data.list.length; i++) {
                res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
                res.data.list[i].predictDataName = res.data.list[i].predictDataName.split(".")[0]
              }
              this.tableData = res.data.list
              this.total = res.data.total
              this.$notify({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 1000 * 3
              });
            })
          }
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
      tableData: [
        {
          id: '1',
          orgName: '测试账号',
          dataName: '乳腺癌数据集1',
          createTime: '2022-8-15 14:30:15',
          description: '18888888885@qq.com',
          status: '山东医院'
        },
        {
          id: '2',
          orgName: '测试账号',
          dataName: '糖尿病数据集1',
          createTime: '2022-8-16 14:15:15',
          description: '18888888886@qq.com',
          status: '天坛医院'
        },
        {
          id: '3',
          orgName: '测试账号',
          dataName: '糖尿病数据集3',
          createTime: '2022-8-16 18:30:15',
          description: '18888888887@qq.com',
          status: '空军医院'
        },
        {
          id: '4',
          orgName: '测试账号',
          dataName: '糖尿病数据集3',
          createTime: '2022-8-16 19:45:14',
          description: '18888888888@qq.com',
          status: '山东医院'
        },
      ],
      selectedTableData: [],
      centerDialogVisible: false,
      currentPage: 1,
      total: 4,
      loading: false,
      pageSizes: [5, 10, 20, 50],
      pageSize: 10,
      model: '',
      searchModelTypeList: [
        {value: '模型1', label: '模型1', type: 'CNN'},
        {value: '模型2', label: '模型2', type: 'CNN'},
        {value: '模型3', label: '模型3', type: 'CNN'},
        {value: '模型4', label: '模型4', type: 'CNN'},
        {value: '模型5', label: '模型5', type: 'CNN'},
        {value: '模型6', label: '模型6', type: 'CNN'},
        {value: '模型7', label: '模型7', type: 'CNN'},
        {value: '模型8', label: '模型8', type: 'CNN'},
        {value: '模型9', label: '模型9', type: 'CNN'},
        {value: '模型10', label: '模型10', type: 'CNN'},
      ],
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

.select-model,
.exec-predict {
  height: 40px;
  width: 110px;
  margin-right: 10px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>

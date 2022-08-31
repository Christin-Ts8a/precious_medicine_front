<template>
  <div class="parent_container">
    <el-button type="primary" @click="open">
      下载
    </el-button>
    <el-button type="danger" @click="deleteData">
      删除
    </el-button>
<!--    <div class="btn-list">-->
<!--      <el-input-->
<!--          v-model="searchModelName"-->
<!--          class="search_by_name"-->
<!--          placeholder="请输入模型名称"-->
<!--          style="width: 180px"></el-input>-->
<!--      <el-select-->
<!--          class="search_by_org"-->
<!--          v-model="orgSelectedList"-->
<!--          multiple-->
<!--          placeholder="请选择机构">-->
<!--        <el-option-->
<!--            v-for="item in orgList"-->
<!--            :key="item.id"-->
<!--            :label="item.orgName"-->
<!--            :value="item.id">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-button class="search_model" type="primary" @click="searchModel">搜索模型</el-button>-->
<!--      <el-button class="start_train" type="primary" @click="startTrain">发起训练</el-button>-->
<!--&lt;!&ndash;      <el-button class="model_upload" type="primary" @click="centerDialogVisible = true">上传模型</el-button>&ndash;&gt;-->
<!--      <el-dialog-->
<!--          title="上传"-->
<!--          :visible.sync="centerDialogVisible"-->
<!--          width="30%"-->
<!--          center>-->
<!--        <upload @uploadFinish="uploadFinish"></upload>-->
<!--      </el-dialog>-->
<!--    </div>-->
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
<!--      <el-table-column-->
<!--          prop="id"-->
<!--          label="ID"-->
<!--          width="60">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="orgName"-->
<!--          label="机构名称"-->
<!--          width="180">-->
<!--      </el-table-column>-->
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
          prop="createUser"
          label="请求人"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelParam"
          label="模型参数"
          width="180">
      </el-table-column>
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

    <el-dialog
        title="发起训练"
        :visible.sync="dialogVisible"
        width="30%">
      <div><span>训练名称：</span><el-input v-model="trainName" placeholder="请输入训练名称"></el-input></div>
      <div><span>训练轮数：</span><el-input v-model="trainRounds" placeholder="请输入训练轮数"></el-input></div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click=train>确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "../api/api"
import upload from "./upload";

export default {
  name: "model_train",
  components: {upload},
  created() {
    api.getOrgList().then(res => {
      this.orgList = res.data
      console.log(this.orgList);
    })
    api.getModelList({pageNum: this.currentPage, pageSize: this.pageSize}).then(res => {
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
      }
      this.tableData = res.data.list
      this.total = res.data.total
    })
  },
  data() {
    return {
      tableData: [
        {
          modelName: '逻辑回归',
          dataName: 'iT1tJeGy5lHwNTFCAjCN8g==',
          createTime: '2022/3/23 16:23:10',
          createUser: '张三',
          modelParam: 'model0.bin'
        },
        {
          modelName: '逻辑回归',
          dataName: 'wBsuas5EkpECHdJD9Fa6bw==',
          createTime: '2022/3/23 18:32:45',
          createUser: '李四',
          modelParam: 'model1.bin'
        },
        {
          modelName: '线性回归',
          dataName: 'KGqiZv5aavyMwwmmJjPh+A==',
          createTime: '2022/3/23 21:54:34',
          createUser: '王五',
          modelParam: 'model2.bin'
        },
        {
          modelName: '线性回归',
          dataName: 'rhWekSSPnXLIWFD9jBm1Kg==',
          createTime: '2022/3/23 16:23:10',
          createUser: '张三',
          modelParam: 'model3.bin'
        },
        {
          modelName: '逻辑回归',
          dataName: 'foRPFraM4B9fYgO051aErg==',
          createTime: '2022/3/24 19:23:10',
          createUser: '赵六',
          modelParam: 'model4.bin'
        }
      ],
      selectedTableData: [],
      currentPage: 1,
      total: 5,
      loading: false,
      searchModelName: '',
      orgList: [],
      orgSelectedList: [],
      centerDialogVisible: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50],
      dialogVisible: false,
      trainName: '',
      trainRounds: 0,
    }
  },
  methods: {
    open() {
      this.$alert('下载成功', '下载', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    },
    deleteData() {
      this.$alert('删除成功', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'error',
            message: `action: ${action}`
          });
        }
      });
    },
    searchModel() {
      let data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        modelName: this.searchModelName,
        orgCode: this.orgSelectedList
      }
      api.getModelList(data).then(res => {
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = res.data.list[i].createTime.replace("T", " ").split(".")[0]
        }
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    startTrain() {
      if (this.selectedTableData.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择模型',
          type: 'warning'
        });
        return;
      } else {
        this.dialogVisible = true;
      }
    },
    train() {
      this.dialogVisible = false;
      this.loading = true
      let userList = []
      for (let i = 0; i < this.selectedTableData.length; i++) {
        userList.push({taskUserName:this.selectedTableData[i].orgCode})
      }
      userList.push({taskUserName:localStorage.getItem("orgCode")})
      let data = {
        taskKappa: 1024,
        taskCertainty: 40,
        taskName: this.trainName,
        computeRounds: this.trainRounds,
        currentRound:0,
        taskUserList:userList,
        modelName: this.selectedTableData[0].modelName
      }
      api.create(data).then(res => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '模型训练任务创建成功, 开始训练',
            type: 'success'
          });
          let startData = {
            taskId:res.data.retValue.taskId
          }
          api.startTask(startData).then(res => {
            if (res.retCode === 200) {
              this.$notify({
                title: '成功',
                message: '训练完成，结果请到训练历史界面查看',
                type: 'success'
              });
              this.loading = false
            } else {
              this.loading = false
              this.$notify({
                title: '失败',
                message: '模型训练失败,请检查通信',
                type: 'error'
              });
            }
          })
        } else {
          this.loading = false
          this.$notify({
            title: '失败',
            message: '模型训练任务创建失败',
            type: 'error'
          });
        }
      })
    },
    uploadFinish(param) {
      this.centerDialogVisible = param
    },
    handleSelectionChange(param) {
      this.selectedTableData = param;
      console.log(this.selectedTableData);
    },
    handleSizeChange(param) {
      this.pageSize = param
    },
    handleCurrentChange(param) {
      this.currentPage = param
    },
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

.search_by_name {
  margin-right: 10px;
}

.search_model,
.start_train {
  margin-left: 10px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
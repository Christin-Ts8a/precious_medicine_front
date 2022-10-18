<template>
  <div class="parent_container">
    <div class="btn-list">
      <el-input
          v-model="searchModelName"
          class="search_by_name"
          placeholder="请输入任务名称"
          style="width: 180px"></el-input>
      <el-select
          class="search_by_org"
          v-model="orgSelectedList"
          multiple
          placeholder="请选择机构">
        <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button class="search_model" type="primary" @click="searchModel">搜索任务</el-button>
      <el-button class="start_train" type="primary" @click="startTrain">开始训练</el-button>
      <el-button class="model_upload" type="primary" @click="dialogVisible = true">发起任务</el-button>
      <el-dialog
          title="上传"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
        <upload @uploadFinish="uploadFinish"></upload>
      </el-dialog>
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
          prop="orgName"
          label="机构名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="taskName"
          label="任务名称"
          width="140">
      </el-table-column>
      <el-table-column
          prop="modelType"
          label="模型类型"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="预计开始时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="coopOrg"
          label="当前合作方"
          width="180">
      </el-table-column>
      <el-table-column
          prop="taskStatus"
          label="任务状态"
          width="180">
        <template slot-scope="scope">
          <el-tag v-if="tableData[scope.$index].taskStatus === 1" size="mini" type="danger">招募结束</el-tag>
          <el-tag v-if="tableData[scope.$index].taskStatus === 0" size="mini" type="primary">正在招募</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="option"
          label="操作"
          width="280">
        <template slot-scope="scope">
          <el-button v-if="tableData[scope.$index].owner === 1" size="mini" type="danger">删除任务</el-button>
          <el-button v-if="tableData[scope.$index].owner === 1 && tableData[scope.$index].taskStatus === 1" size="mini"
                     type="primary">开始招募
          </el-button>
          <el-button v-if="tableData[scope.$index].owner === 1 && tableData[scope.$index].taskStatus === 0" size="mini"
                     type="warning">结束招募
          </el-button>
          <el-button
              v-if="tableData[scope.$index].owner === 0 && tableData[scope.$index].coopOrg.indexOf('测试账号') === -1"
              size="mini" type="primary">申请加入
          </el-button>
          <el-button
              v-if="tableData[scope.$index].owner === 0 && tableData[scope.$index].coopOrg.indexOf('测试账号') !== -1"
              size="mini" type="warning">退出任务
          </el-button>
        </template>
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
        title="发起训练任务"
        :visible.sync="dialogVisible"
        width="30%">
      <div style="margin-bottom: 1rem"><span>训练名称：</span>
        <el-input v-model="trainName" placeholder="请输入训练名称" style="width: 20rem"></el-input>
      </div>
      <div style="margin-bottom: 1rem"><span>模型类型：</span>
        <el-select v-model="modelType" placeholder="请选择模型类型">
          <el-option
              v-for="item in searchModelTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
      </div>
      <div><span>预计开始时间：</span>
        <el-date-picker
            class="btn-list-item"
            v-model="trainRounds"
            type="datetime"
            placeholder="选择模型训练完成时间"
            align="right"></el-date-picker>
      </div>
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
      searchModelTypeList: [
        {value: 'CNN', label: 'CNN'},
        {value: 'DNN', label: 'DNN'},
        {value: 'LeNet', label: 'LeNet'},
        {value: 'ResNet', label: 'ResNet'}
      ],
      tableData: [
        {
          id: 1,
          taskName: '糖尿病模型训练',
          modelType: 'CNN',
          createTime: '2022-7-10 15:30:29',
          orgName: "测试账号",
          coopOrg: '张三，李四，王五',
          taskStatus: 1,
          owner: 1
        },
        {
          id: 2,
          taskName: '糖尿病模型训练',
          modelType: 'ResNet',
          createTime: '2022-8-5 09:30:40',
          orgName: '测试账号',
          coopOrg: '张三，李四，王五',
          taskStatus: 0,
          owner: 1
        },
        {
          id: 3,
          taskName: '乳腺癌模型训练',
          modelType: 'CNN',
          createTime: '2022-8-10 10:13:14',
          orgName: '张三',
          coopOrg: '李四，王五',
          taskStatus: 0,
          owner: 0
        },
        {
          id: 4,
          taskName: '糖尿病模型训练',
          modelType: 'ResNet',
          createTime: '2022-8-12 17:52:34',
          orgName: '李四',
          coopOrg: '张三，李四，测试账号',
          taskStatus: 0,
          owner: 0
        },
        {
          id: 5,
          taskName: '乳腺癌模型训练',
          modelType: 'LeNet',
          createTime: '2022-9-8 15:30:29',
          orgName: '测试账号',
          coopOrg: '张三，王五',
          taskStatus: 0,
          owner: 1
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
      modelType: '',
      trainRounds: '',
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
          title: 'Warning',
          message: '请选择模型',
          type: 'warning'
        });
        return;
      } else {
        this.$notify({
          title: 'Success',
          message: '开启成功',
          type: 'success'
        });
      }
    },
    train() {
      this.dialogVisible = false;
      this.loading = true
      let userList = []
      for (let i = 0; i < this.selectedTableData.length; i++) {
        userList.push({taskUserName: this.selectedTableData[i].orgCode})
      }
      userList.push({taskUserName: localStorage.getItem("orgCode")})
      let data = {
        taskKappa: 1024,
        taskCertainty: 40,
        taskName: this.trainName,
        computeRounds: this.trainRounds,
        currentRound: 0,
        taskUserList: userList,
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
            taskId: res.data.retValue.taskId
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
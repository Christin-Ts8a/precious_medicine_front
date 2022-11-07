<template>
  <div class="parent_container">
    <div class="btn-list">
      <el-input
          v-model="searchTaskByName"
          class="search_by_name"
          placeholder="请输入任务名称"
          style="width: 180px"></el-input>
      <el-select
          class="search_by_org"
          v-model="orgSelectedList"
          @change="selectChange"
          multiple
          placeholder="请选择机构">
        <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button class="search_model" type="primary" @click="searchTask">搜索任务</el-button>
      <el-button class="model_upload" type="primary" @click="dialogVisible = true">发起任务</el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%">
      <el-table-column
          type="selection"
          width="60">
      </el-table-column>
      <el-table-column
          prop="taskName"
          label="任务名称"
          width="140">
      </el-table-column>
      <el-table-column
          prop="modelName"
          label="模型名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="orgNameList"
          label="当前合作方"
          width="180">
      </el-table-column>
      <el-table-column
          prop="taskState"
          label="任务状态"
          width="180">
        <template slot-scope="scope">
          <el-tag v-if="tableData[scope.$index].taskState === 1" size="mini" type="warning">训练中</el-tag>
          <el-tag v-if="tableData[scope.$index].taskState === 0" size="mini" type="primary">未开始</el-tag>
          <el-tag v-if="tableData[scope.$index].taskState === -1" size="mini" type="danger">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="option"
          label="操作"
          width="280">
        <template slot-scope="scope">
          <el-button
              v-if="tableData[scope.$index].owner === 1 && tableData[scope.$index].taskState === 0"
              size="mini"
              type="danger">
            删除任务
          </el-button>
          <el-button
              @click="startTrain(tableData[scope.$index])"
              v-if="tableData[scope.$index].owner === 1 && tableData[scope.$index].taskState === 0"
              size="mini"
              type="primary">
            开始任务
          </el-button>
          <el-button
              v-if="tableData[scope.$index].owner === 0 && tableData[scope.$index].taskState === 0"
              size="mini"
              type="warning">
            申请加入
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
        <el-select
            allow-create
            filterable
            default-first-option
            clearable
            v-model="modelType"
            placeholder="请选择模型类型">
          <el-option
              v-for="item in searchModelTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 1rem"><span>训练轮数：</span>
        <el-input
            v-model="trainRounds"
            placeholder="训练轮数"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=createTrainTask>确 定</el-button>
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
    this.userId = localStorage.getItem("userId")
    api.getOrgList().then(res => {
      this.orgList = res.data
    })
    api.getTaskList({}).then(res => {
      this.tableData = res.list
      this.total = res.total
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].owner = this.tableData[i].createUser == this.userId ? 1 : 0
      }
      this.currentPage = 1
    })
  },
  data() {
    return {
      userId: 0,
      searchModelTypeList: [],
      searchModelOrgList: '',
      tableData: [],
      selectedTableData: [],
      currentPage: 1,
      total: 5,
      loading: false,
      searchTaskByName: '',
      orgList: [],
      orgSelectedList: [],
      pageSize: 10,
      pageSizes: [5, 10, 20, 50],
      dialogVisible: false,
      trainName: '',
      modelType: '',
      trainRounds: '',
    }
  },
  methods: {
    searchTask() {
      api.getTaskList({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskName: this.searchTaskByName,
        orgList: this.searchModelOrgList
      }).then(res => {
        this.tableData = res.list
        this.total = res.total
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].owner = this.tableData[i].createUser == this.userId ? 1 : 0
        }
      })
    },
    startTrain(task) {
      api.startTask(task).then(res => {
        if (res.retCode === 200) {
          this.$notify({
            title: '训练结束',
            message: '模型训练任务已结束',
            type: 'success'
          });
          task.taskState = -1
        }
      })
      this.$notify({
        title: '训练开始',
        message: '模型训练任务已开始',
        type: 'success'
      });
      task.taskState = 1
    },
    createTrainTask() {
      this.dialogVisible = false;
      this.loading = true
      let userList = []
      userList.push({taskUserId: localStorage.getItem("userId"), taskUserName: localStorage.getItem("username")})
      let data = {
        taskKappa: 256,
        taskCertainty: 100,
        taskName: this.trainName,
        computeRounds: this.trainRounds,
        currentRound: 0,
        taskUserList: userList,
        modelName: this.modelType
      }
      api.create(data).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.$notify({
            title: '成功',
            message: '模型训练任务创建成功',
            type: 'success'
          });
          api.getTaskList({}).then(res => {
            this.tableData = res
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].owner = this.tableData[i].createUser == this.userId ? 1 : 0
            }
            this.total = this.tableData.length
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
    selectChange() {
      let temp = ''
      for (let i = 0; i < this.orgSelectedList.length; i++) {
        temp += this.orgSelectedList[i] + ","
      }
      this.searchModelOrgList = temp
      console.log(this.searchModelOrgList);
    },
    handleSizeChange(param) {
      this.pageSize = param
      api.getTaskList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: this.searchTaskByName,
        orgList: this.searchModelOrgList
      }).then(res => {
        this.tableData = res.list
        this.total = res.total
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].owner = this.tableData[i].createUser == this.userId ? 1 : 0
        }
      })
    },
    handleCurrentChange(param) {
      this.pageNum = param
      api.getTaskList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: this.searchTaskByName,
        orgList: this.searchModelOrgList
      }).then(res => {
        this.tableData = res.list
        this.total = res.total
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].owner = this.tableData[i].createUser == this.userId ? 1 : 0
        }
      })
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
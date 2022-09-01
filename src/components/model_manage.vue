<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-input
          class="btn-list-item"
          v-model="searchModelName"
          placeholder="请输入模型名称"
          style="width: 12rem"></el-input>
      <el-select
          class="btn-list-item"
          v-model="searchModelType"
          placeholder="请选择模型类型"
          style="width: 12rem">
        <el-option
            v-for="item in searchModelTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select
          class="btn-list-item"
          multiple
          v-model="searchCoopOrg"
          placeholder="请选择合作方"
          style="width: 12rem">
        <el-option
            v-for="item in searchCoopOrgList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select
          class="btn-list-item"
          v-model="searchModelStatus"
          placeholder="模型状态"
          style="width: 12rem">
        <el-option
            v-for="item in searchModelStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
          class="btn-list-item"
          v-model="timeRange"
          type="datetime"
          placeholder="选择模型训练完成时间"
          align="right"
          :picker-options="pickerOptions">
      </el-date-picker>
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
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelType"
          label="模型类型"
          width="180">
      </el-table-column>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="训练时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="finishTime"
          label="完成时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="orgName"
          label="发起人"
          width="180">
      </el-table-column>
      <el-table-column
          prop="coopOrg"
          label="合作方"
          width="180">
      </el-table-column>
      <el-table-column
          prop="status"
          label="模型状态"
          width="180">
        <template slot-scope="scope">
          <el-tag v-if="tableData[scope.$index].status === 1" size="medium">共享</el-tag>
          <el-tag v-if="tableData[scope.$index].status === 0" size="medium">本地</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="operation"
          label="操作"
          width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" style="margin-right: 0.5rem">删除</el-button>
          <el-button v-if="tableData[scope.$index].status === 1" size="mini" type="primary">结束共享</el-button>
          <el-button v-if="tableData[scope.$index].status === 0" size="mini" type="warning">共享模型</el-button>
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
  </div>
</template>

<script>
import upload from "./upload";
import * as api from "../api/api"
export default {
  name: "model_manage",
  components: {upload},
  created() {
    this.$notify({
      title: 'Success',
      message: '模型共享成功',
      type: 'success',
    });
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
      tableData: [
        {
          id: 1,
          modelName: '模型1',
          modelType: 'CNN',
          createTime: '2022-3-10 15:30:29',
          finishTime: '2022-3-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三，李四，王五',
          status: 1
        },
        {
          id: 2,
          modelName: '模型2',
          modelType: 'CNN',
          createTime: '2022-4-5 09:30:40',
          finishTime: '2022-4-5 09:36:10',
          orgName: '测试账号',
          coopOrg: '张三，李四，王五',
          status: 1
        },
        {
          id: 3,
          modelName: '模型3',
          modelType: 'CNN',
          createTime: '2022-4-10 10:13:14',
          finishTime: '2022-4-10 13:26:50',
          orgName: '测试账号',
          coopOrg: '李四，王五',
          status: 0
        },
        {
          id: 4,
          modelName: '模型4',
          modelType: 'CNN',
          createTime: '2022-4-12 17:52:34',
          finishTime: '2022-4-12 19:57:25',
          orgName: '测试账号',
          coopOrg: '张三，李四',
          status: 0
        },
        {
          id: 5,
          modelName: '模型5',
          modelType: 'CNN',
          createTime: '2022-5-8 15:30:29',
          finishTime: '2022-5-8 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三，王五',
          status: 0
        },
        {
          id: 6,
          modelName: '模型6',
          modelType: 'CNN',
          createTime: '2022-10-10 15:30:29',
          finishTime: '2022-10-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三',
          status: 0
        },
        {
          id: 7,
          modelName: '模型7',
          modelType: 'CNN',
          createTime: '2022-10-10 15:30:29',
          finishTime: '2022-10-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '王五',
          status: 0
        },
        {
          id: 8,
          modelName: '模型8',
          modelType: 'CNN',
          createTime: '2022-10-10 15:30:29',
          finishTime: '2022-10-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三，王五',
          status: 0
        },
        {
          id: 9,
          modelName: '模型9',
          modelType: 'CNN',
          createTime: '2022-10-10 15:30:29',
          finishTime: '2022-10-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三，李四，王五',
          status: 0
        },
        {
          id: 10,
          modelName: '模型10',
          modelType: 'CNN',
          createTime: '2022-10-10 15:30:29',
          finishTime: '2022-10-10 16:26:15',
          orgName: '测试账号',
          coopOrg: '张三',
          status: 0
        }
      ],
      selectedTableData: [],
      centerDialogVisible: false,
      currentPage: 1,
      total: 14,
      loading: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50],
      uploadUrl: '',
      uploadedFile: [],
      searchModelName: '',
      searchModelType: '',
      searchModelTypeList: [
        {value: 'CNN', label: 'CNN'},
        {value: 'DNN', label: 'DNN'},
        {value: 'LeNet', label: 'LeNet'},
        {value: 'ResNet', label: 'ResNet'}
      ],
      searchCoopOrg: '',
      searchCoopOrgList: [
        {label: '测试账号', value: '测试账号'},
        {label: '张三', value: '张三'},
        {label: '李四', value: '李四'},
        {label: '王五', value: '王五'}
      ],
      searchModelStatus: '',
      searchModelStatusList: [
        {label: '共享', value: '1'},
        {label: '本地', value: '0'},
      ],
      timeRange: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
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
  flex-direction: row;
  flex-wrap: wrap;
}

.btn-list-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>

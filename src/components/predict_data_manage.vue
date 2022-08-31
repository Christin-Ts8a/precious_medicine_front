<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-button type="primary" @click="centerDialogVisible = true">
        <i class="el-icon-plus"></i>
        添加
      </el-button>
      <el-button type="danger" @click="centerDialogVisible = true">
        <i class="el-icon-delete"></i>
        删除
      </el-button>
      <el-button type="warning" @click="centerDialogVisible = true">
        权限控制
      </el-button>
      <el-dialog
          title="上传"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
        <upload upload-url="http://192.168.3.29:8000/add_Predict_data/" @uploadFinishFile="uploadFinish"></upload>
      </el-dialog>
      <!--      <el-select-->
      <!--          class="search_by_model"-->
      <!--          v-model="selectedModelList"-->
      <!--          placeholder="请选择模型">-->
      <!--        <el-option-->
      <!--            v-for="item in modelList"-->
      <!--            :key="item.id"-->
      <!--            :label="item.modelName"-->
      <!--            :value="item.modelName">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--      <el-button type="primary" @click="startSearch">-->
      <!--        <i class="el-icon-search"></i>-->
      <!--        预测-->
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
      <!--      <el-table-column-->
      <!--          type="selection"-->
      <!--          width="60">-->
      <!--      </el-table-column>-->
      <el-table-column
          prop="id"
          label="ID"
          width="80">
      </el-table-column>
      <el-table-column
          prop="predictDataName"
          label="姓名"
          width="140">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="账号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createUsername"
          label="手机号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="description"
          label="邮箱"
          width="180">
      </el-table-column>
      <el-table-column
          prop="status"
          label="工作单位"
          width="180">
      </el-table-column>
      <!--      <el-table-column-->
      <!--          prop="option"-->
      <!--          label="工作单位"-->
      <!--          width="280">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="danger" @click="deletePredictData(scope.row)">删除</el-button>-->
      <!--          <el-button type="primary" @click="startSearch(scope.row)">-->
      <!--            <i class="el-icon-search"></i>-->
      <!--            预测-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
      if (param.createUsername !== localStorage.getItem("nickname")) {
        this.$notify({
          title: '失败',
          message: '无法使用他人数据预测',
          type: 'error',
          duration: 1000 * 3
        });
      } else if (this.selectedModelList === '') {
        this.$notify({
          title: '失败',
          message: '未选择模型',
          type: 'error',
          duration: 1000 * 3
        });
      } else {
        this.loading = true
        let data = {
          modelName: this.selectedModelList,
          dataName: param.predictDataName,
          status: 0
        }
        api.predict(data).then(res => {
          if (res.status === 200) {
            this.$notify({
              title: '成功',
              message: '预测成功',
              type: 'success',
              duration: 1000 * 3
            });
            this.loading = false
          } else {
            this.loading = false
            this.$notify({
              title: '失败',
              message: '预测失败',
              type: 'error',
              duration: 1000 * 3
            });
          }
        })
      }
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
      modelList: [],
      selectedModelList: '',
      selectedNum: 0,
      tableData: [
        // {
        //   id: '0',
        //   predictDataName: 'iT1tJeGy5lHwNTFCAjCN8g==',
        //   createTime: '2022/4/20 14:32:45',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '1',
        //   predictDataName: '6fjFatLC7Usfa01IjkfvrA==',
        //   createTime: '2022/4/20 17:23:34',
        //   createUsername: '济大医院',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '2',
        //   predictDataName: 'wBsuas5EkpECHdJD9Fa6bw==',
        //   createTime: '2022/4/20 19:43:23',
        //   createUsername: '李四',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '3',
        //   predictDataName: 'KGqiZv5aavyMwwmmJjPh+A==',
        //   createTime: '2022/4/20 21:32:43',
        //   createUsername: '王五',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '4',
        //   predictDataName: 'rhWekSSPnXLIWFD9jBm1Kg==',
        //   createTime: '2022/4/21 08:13:53',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '5',
        //   predictDataName: 'foRPFraM4B9fYgO051aErg==',
        //   createTime: '2022/4/21 09:23:43',
        //   createUsername: '赵六',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '6',
        //   predictDataName: 'X/XI4pk3zZ8KTNBOEZgIjA==',
        //   createTime: '2022/4/21 09:32:13',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '7',
        //   predictDataName: 'aGBAgYquv3Q+JqaejVKvjQ==',
        //   createTime: '2022/4/21 11:11:32',
        //   createUsername: '济大医院',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '8',
        //   predictDataName: '0iU+Ui5fCi/m4cBrf+dl1A==',
        //   createTime: '2022/4/21 14:32:45',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '9',
        //   predictDataName: 'fyzF3Apw/k5MVxdEjqPEpQ==',
        //   createTime: '2022/4/21 14:45:32',
        //   createUsername: '济大医院',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '10',
        //   predictDataName: 'hWOTBbdKDWuylYUy1gH4WA==',
        //   createTime: '2022/4/21 14:56:14',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '11',
        //   predictDataName: '6A+pCQFxavc6/9d9CnrdGw==',
        //   createTime: '2022/4/20 17:23:34',
        //   createUsername: '济大医院',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '12',
        //   predictDataName: 'nY18NfO8ruVPQTtf0jVnFw==',
        //   createTime: '2022/4/20 14:32:45',
        //   createUsername: '张三',
        //   description: '无',
        //   status: '数据已删除'
        // },
        // {
        //   id: '13',
        //   predictDataName: 'PrVkPg8gdyVH9RpZ529VmA==',
        //   createTime: '2022/4/20 17:23:34',
        //   createUsername: '济大医院',
        //   description: '无',
        //   status: '数据已删除'
        // }
        {
          id: '0',
          predictDataName: '张三',
          createTime: '123123',
          createUsername: '18888888885',
          description: '18888888885@qq.com',
          status: '山东医院'
        },
        {
          id: '1',
          predictDataName: '李四',
          createTime: '123456',
          createUsername: '18888888886',
          description: '18888888886@qq.com',
          status: '天坛医院'
        },
        {
          id: '2',
          predictDataName: '王五',
          createTime: '234234',
          createUsername: '18888888887',
          description: '18888888887@qq.com',
          status: '空军医院'
        },
        {
          id: '3',
          predictDataName: '赵六',
          createTime: '3456734',
          createUsername: '18888888888',
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

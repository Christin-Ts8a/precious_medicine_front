<template>
  <div class="parent_container">
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
<!--      <el-table-column-->
<!--          type="selection"-->
<!--          width="100">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="id"
          label="ID"
          width="100">
      </el-table-column>
      <el-table-column
          prop="trainName"
          label="训练任务名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelName"
          label="模型名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="finishTime"
          label="训练结束时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="orgList"
          label="参与机构名称"
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
  </div>
</template>

<script>
import * as api from "../api/api"
export default {
  name: "train_history",
  created() {
    let data = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    api.getTrainHistory(data).then(res => {
      console.log(res.data);
      this.tableData = res.data.list
      this.total = res.data.total
    })
  },
  methods: {
    handleSelectionChange(param) {
      console.log(param)
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
      tableData: [
      ],
      selectedTableData: [],
      currentPage: 1,
      total: 0,
      loading: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50],
    }
  }
}
</script>

<style scoped>
.parent-container {
  margin: 10px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
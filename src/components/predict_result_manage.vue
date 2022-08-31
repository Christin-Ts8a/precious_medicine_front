<template>
  <div class="parent-container">
    <div class="search_filter">
      <el-select
          class="search_by_model"
          v-model="selectedModelList"
          multiple
          placeholder="请选择模型">
        <el-option
            v-for="item in modelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input
          class="search_by_user"
          placeholder="请输入创建人名称"
          v-model="searchByUser"
          clearable
          prefix-icon="el-icon-search">
      </el-input>
      <el-date-picker
          v-model="dateValue"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
      </el-date-picker>
      <el-button type="primary">查询</el-button>
    </div>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="100">
      </el-table-column>
      <el-table-column
          prop="id"
          label="ID"
          width="100">
      </el-table-column>
      <el-table-column
          prop="dataName"
          label="所用数据集"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelName"
          label="所用模型"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createUserName"
          label="创建人"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="finishTime"
          label="完成时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="predictResult"
          label="预测结果"
          width="180">
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
    </el-pagination>
  </div>
</template>

<script>
import * as api from "../api/api"
export default {
  name: "predict_result_manage",
  created() {
    api.predictResultList({pageSize:this.pageSize, pageNum: this.currentPage}).then(res => {
      this.tableData = res.data.list
      this.total = res.data.total
      console.log(res.data);
    })
  },
  methods: {
    handleSelectionChange(param) {
      console.log(param)
    },
    handleSizeChange(param) {
      console.log(`每页 ${param} 条`);
    },
    handleCurrentChange(param) {
      console.log(`当前页: ${param}`);
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
      modelList: [],
      selectedModelList: [],
      searchByUser: '',
      dateValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
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

.search_filter {
  display: flex;
  flex-direction: row;
}

.search_by_model {
  margin-right: 10px;
}

.search_by_user {
  width: 180px;
  margin-right: 10px;
}

.el-button {
  margin-left: 10px;
}

.el-pagination {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
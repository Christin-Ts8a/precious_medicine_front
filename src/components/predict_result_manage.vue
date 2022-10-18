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
          width="200">
      </el-table-column>
      <el-table-column
          prop="predictResult"
          label="操作"
          width="180">
        <template>
          <el-button type="primary" size="mini">下载</el-button>
        </template>
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
        {
          id: 1,
          dataName: '乳腺癌数据集1',
          modelName: '模型1',
          createUserName: '测试账号',
          createTime: '2022-8-20 10:25:15',
          finishTime: '2022-8-20 13:15:05',
          predictResult: '乳腺癌数据集1_result.pdf'
        },
        {
          id: 2,
          dataName: '乳腺癌数据集1',
          modelName: '模型5',
          createUserName: '测试账号',
          createTime: '2022-8-22 11:15:52',
          finishTime: '2022-8-22 13:34:18',
          predictResult: '乳腺癌数据集1_result.pdf'
        },
        {
          id: 3,
          dataName: '糖尿病数据集1',
          modelName: '模型1',
          createUserName: '测试账号',
          createTime: '2022-8-22 15:18:32',
          finishTime: '2022-8-22 18:12:45',
          predictResult: '糖尿病数据集1_result.pdf'
        },
        {
          id: 4,
          dataName: '糖尿病数据集2',
          modelName: '模型1',
          createUserName: '测试账号',
          createTime: '2022-8-23 09:13:45',
          finishTime: '2022-8-23 11:45:26',
          predictResult: '糖尿病数据集2_result.pdf'
        },
        {
          id: 5,
          dataName: '糖尿病数据集1',
          modelName: '模型2',
          createUserName: '测试账号',
          createTime: '2022-9-1 10:26:48',
          finishTime: '2022-9-1 13:35:41',
          predictResult: '糖尿病数据集1_result.pdf'
        }
      ],
      selectedTableData: [],
      currentPage: 1,
      total: 5,
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
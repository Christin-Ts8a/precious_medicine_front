<template>
  <div class="parent-container">
    <div class="search_filter">
<!--      <el-select-->
<!--          class="search_by_model"-->
<!--          v-model="userType"-->
<!--          multiple-->
<!--          placeholder="请选择用户类型">-->
<!--        <el-option-->
<!--            v-for="item in userTypeList"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
      <el-input
          class="search_by_user"
          placeholder="请输入机构名称"
          v-model="nickName"
          clearable
          prefix-icon="el-icon-search">
      </el-input>
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
          prop="orgName"
          label="机构名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="registerTime"
          label="注册时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="respUser"
          label="负责人"
          width="180">
      </el-table-column>
      <el-table-column
          prop="email"
          label="负责人邮箱"
          width="200">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="负责人电话"
          width="200">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="predictResult"-->
<!--          label="操作"-->
<!--          width="270">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" size="mini">修改权限</el-button>-->
<!--          <el-button v-if="tableData[scope.$index].role === '普通用户' || tableData[scope.$index].role === '普通管理员'" type="danger" size="mini">删除用户</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
export default {
  name: "org_manage",
  data() {
    return {
      total: 3,
      currentPage: 1,
      tableData: [
        {
          id: 1,
          nickName: '测试账号',
          registerTime: '2021-10-10 15:00:36',
          orgName: '协和医院影像科',
          phone: '18888888888',
          email: '188888888888@163.com',
          respUser: '测试账号'
        },
        {
          id: 2,
          nickName: '测试账号',
          registerTime: '2021-10-10 15:00:36',
          orgName: '协和医院心内科',
          phone: '18888888888',
          email: '188888888888@163.com',
          respUser: '张三'
        },
        {
          id: 3,
          nickName: '测试账号',
          registerTime: '2021-10-10 15:00:36',
          orgName: '协和医院神经外科',
          phone: '18888888888',
          email: '188888888888@163.com',
          respUser: '李四'
        }
      ],
      userType: '',
      userTypeList: [],
      nickName: ''
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleSelectionChange() {},
  }
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
</style>
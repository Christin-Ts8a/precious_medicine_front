<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-button type="primary">
        <i class="el-icon-plus"></i>
        添加
      </el-button>
      <el-button type="danger">
        <i class="el-icon-delete"></i>
        删除
      </el-button>
      <span class="selected-txt">
      已选中{{ selectedNum }}个
      </span>
    </div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="180">
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
          prop="updateTime"
          label="更新时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelAttribution"
          label="模型归属"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelStatus"
          label="模型状态"
          width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ModelManage",
  props: ['tableData'],
  data() {
    return {
      selectedNum: 0,
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
.selected-txt {
  margin-left: 10px;
}
</style>
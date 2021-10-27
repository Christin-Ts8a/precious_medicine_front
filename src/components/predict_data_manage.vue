<template>
  <div class="parent-container">
    <div class="btn-list">
      <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
        <el-button size="small" type="primary">添加</el-button>
      </el-upload>
      <el-button type="danger">
        <i class="el-icon-delete"></i>
        删除
      </el-button>
      <el-button class="select-model" type="primary">
        <i class="el-icon-delete"></i>
        选择模型
      </el-button>
      <el-button class="exec-predict" type="primary">
        <i class="el-icon-delete"></i>
        执行预测
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
          label="预测数据名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="modelStatus"
          label="数据状态"
          width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "predict_data_manage",
  props: ['tableData'],
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
  data() {
    return {
      selectedNum: 0,
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
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
</style>

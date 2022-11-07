<template>
  <!--      accept=".txt,.h5"-->
  <el-upload
      class="upload-demo"
      ref="upload"
      :action=uploadUrl
      :on-success="uploadSuccess"
      :on-change="handleChange"
      :multiple=true
      :limit="10"
      :file-list="fileList"
      :auto-upload="false">
    <el-button slot="trigger" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
  </el-upload>
</template>

<script>
import axios from "axios";
import * as api from "../api/api";

export default {
  name: "upload",
  props: ['uploadUrl'],
  created() {
    this.userId = localStorage.getItem("userId")
  },
  methods: {
    submitUpload() {
      let data = {
        createUser: localStorage.getItem("userName"),
        predictDataName: this.fileList[0].name
      }
      api.predictDataAdd(data).then(res => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success',
            duration: 1000 * 3
          });
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    uploadSuccess() {
      this.$emit('uploadFinish', true);
    },
  },
  data() {
    return {
      fileList: [],
      userId: 0
    }
  }
}
</script>

<style scoped>

</style>
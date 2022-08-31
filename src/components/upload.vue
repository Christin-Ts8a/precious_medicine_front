<template>
  <!--      accept=".txt,.h5"-->
  <el-upload
      class="upload-demo"
      ref="upload"
      :action=uploadUrl
      :on-success="uploadSuccess"
      :multiple=true
      :limit="10"
      :file-list="fileList"
      :auto-upload="false">
<!--        <el-button slot="trigger" type="primary">添加数据</el-button>-->
    <el-button slot="trigger" type="primary">查询陷门</el-button>
    <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
    <br>
    <el-checkbox v-model="checked" style="margin-top: 10px">三次多项式近似sigmoid</el-checkbox>
    <el-checkbox v-model="checked1" style="margin-top: 10px">七次多项式近似sigmoid</el-checkbox>
    <el-checkbox v-model="checked2" style="margin-top: 10px">逻辑回归</el-checkbox>
  </el-upload>
</template>

<script>
export default {
  name: "upload",
  props: ['uploadUrl'],
  methods: {
    submitUpload() {
      // this.$refs.upload.submit();

      this.$notify({
        title: '开始训练',
        message: '开始训练,请耐心等待',
        duration: 0
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadSuccess(response, file, fileList) {
      if (response.status === 200) {
        // this.$emit('uploadFinish', false);
        this.$emit('uploadFinishFile', file);
      }
    },
  },
  data() {
    return {
      fileList: [],
      checked: false,
      checked1: false,
      checked2: false,
    }
  }
}
</script>

<style scoped>

</style>
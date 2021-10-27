<template>
<div class="login_parent">
  <div class="login">
    <el-image :src="require('../assets/gene_icon.svg')"></el-image>
    <el-input v-model="username" placeholder="请输入用户名"></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
  </div>
</div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: '',
    }
  },
}
</script>

<style scoped>
.login_parent {
  background-image: url("../assets/login_bg.jpeg");
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 400px;
  background-color: #000000;
  border-radius: 10px;
  opacity: 0.2;
  padding: 50px;
}

.el-image {
  opacity: 1;
  width: 64px;
  height: 64px;
}

.el-input {
  margin: 20px;
  border-color: black;
}
.el-input__inner {
  opacity: 0.1;
}

</style>
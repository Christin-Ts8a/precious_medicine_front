<template>
<div class="login_parent">
  <div class="login" v-if="is_login">
    <el-image class="bg" :src="require('../assets/gene_icon.svg')"></el-image>
    <el-input v-model="username" placeholder="请输入用户名"></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
    <span class="tip">{{ errMsg }}</span>
<!--    <span class="register">注册</span>-->
    <el-button type="primary" @click="signIn">登录</el-button>
  </div>
  <div class="login" v-if="!is_login">
    <el-image class="icon" :src="require('../assets/gene_icon.svg')"></el-image>
    <el-input v-model="username" placeholder="请输入用户名"></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
    <el-input placeholder="请再次输入密码" v-model="password_confirm" show-password></el-input>
    <el-button type="primary" @click="signIn">登录</el-button>
  </div>
</div>
</template>

<script>
import * as api from '../api/api.js'
export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: '',
      password_confirm: '',
      is_login: true,
      errMsg: '',
    }
  },
  methods: {
    signIn() {
      let data = {
        username: this.username,
        password: this.password
      }
      api.login(data).then((res) => {
        if (res.status === 200) {
          this.errMsg = ''
          localStorage.setItem("nickname", res.data.nickname)
          localStorage.setItem("role", res.data.role)
          localStorage.setItem("orgCode", res.data.orgCode)
          localStorage.setItem("username", this.username)
          localStorage.setItem("userId", res.data.userId)
          this.$router.push({
            path: '/',
          })
        } else {
          this.errMsg = res.msg
        }
      })
    },
    signUp() {},
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
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 400px;
  border-radius: 10px;
  background-color: rgba(0,0,0,0.2);
  padding: 50px;
}
.icon {
  width: 64px;
  height: 64px;
  margin-bottom: 50px;
}

.el-input {
  margin: 20px;
  border-color: rgba(255,255,255,0.2);
}
.el-button {
  width: 100%;
  margin-top: 20px;
}

.register {
  color: black;
}

.tip {
  color: red;
  margin-bottom: 10px;
}

</style>
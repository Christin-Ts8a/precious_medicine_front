<template>
  <el-container class="left">
    <el-aside>
      <div class="icon">
        <el-image
            class="icon_image"
            style="width: 40px; height: 40px"
            :src="require('../assets/gene_icon.svg')"
            fit="cover"></el-image>
        <span class="icon_title">基因预测平台</span>
      </div>
      <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#2f4256"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened=true>
        <el-menu-item index="1">
          <el-image
              class="index_image"
              style="width: 25px; height: 20px"
              :src="require('../assets/index_icon.svg')"
              fit="cover"/>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" style="align-items: start">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>文档管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">文档分类管理</el-menu-item>
            <el-menu-item index="1-2">文档管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3" style="align-items: start">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>综合管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">机构管理</el-menu-item>
            <el-menu-item index="1-2">用户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4" style="align-items: flex-start">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>认证和授权</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">用户</el-menu-item>
            <el-menu-item index="1-2">组</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="5">
          <i class="el-icon-index"></i>
          <span slot="title">Our Team</span>
        </el-menu-item>
        <el-submenu index="6" style="align-items: self-start">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>相关资源</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">Baidu</el-menu-item>
            <el-menu-item index="1-2">TRANSFAC</el-menu-item>
            <el-menu-item index="1-2">阿里云基因组学公共数据集</el-menu-item>
            <el-menu-item index="1-2">GitHub</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container class="right">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
<!--          <el-breadcrumb-item-->
<!--              v-for="items in breadcrumbList">-->
<!--            {{ items }}-->
<!--          </el-breadcrumb-item>-->
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
<!--          <el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
        </el-breadcrumb>
      </el-header>
      <el-main>
<!--        <button @click="changeNameList">{{ breadcrumbList }}</button>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      breadcrumbList: ['活动管理', '活动列表', '活动详情']
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    changeNameList() {
      this.nameList = '123123'
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-aside {
  height: 100%;
}
.el-menu {
  height: 100%;
}
.el-menu,
.el-aside,
.el-menu-item,
.el-submenu,
.el-menu-item-group {
  width: 200px !important;
}
.icon {
  display: flex;
  align-items: center;
  width: 200px;
  line-height: 58px;
  background-color: #2f4256;
}

.el-image {
  margin-left: 5px;
  margin-right: 15px;
}

.icon_title {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.el-header {
  background-color: #f3f3f4;
}
.el-breadcrumb {
  margin-left: 10px;
  line-height: 60px;
}
</style>
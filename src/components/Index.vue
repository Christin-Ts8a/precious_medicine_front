<template>
  <div class="container" style="height: 100%">
    <el-aside width="250px" style="height: 100%">
      <div class="icon">
        <span class="icon_title">基因预测平台</span>
      </div>
<!--      <el-row class="tac" style="height: 100%">-->
<!--        <el-col :span="24" style="height: 100%">-->
          <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#2f4256"
              text-color="#fff"
              active-text-color="#ffd04b"
              style="height: 100%">
            <el-menu-item index="1">
              <i class="el-icon-index"></i>
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
<!--        </el-col>-->
<!--      </el-row>-->
    </el-aside>
  </div>

</template>

<script>
export default {
  name: "Index",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.icon {
  color: #fff;
  font-weight: 600;
  line-height: 58px;
  font-size: 14px;
  background-color: #2f4256;
}
</style>
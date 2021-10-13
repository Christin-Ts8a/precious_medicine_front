<template>
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
        @select="clickedIndex"
        background-color="#2f4256"
        text-color="#fff"
        active-text-color="#409eff"
        unique-opened='true'>
      <el-menu-item index="1">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" style="align-items: start">
        <template slot="title">
          <i class="el-icon-discover"></i>
          <span>预测</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">
            <i class="el-icon-s-platform"></i>
            模型管理
          </el-menu-item>
          <el-menu-item index="2-2">
            <i class="el-icon-s-data"></i>
            预测数据管理
          </el-menu-item>
          <el-menu-item index="2-3">
            <i class="el-icon-document"></i>
            预测结果管理
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" style="align-items: start">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>综合管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">机构管理</el-menu-item>
          <el-menu-item index="3-2">用户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4" style="align-items: flex-start">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>认证和授权</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1">用户</el-menu-item>
          <el-menu-item index="4-2">组</el-menu-item>
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
          <el-menu-item index="6-1">Baidu</el-menu-item>
          <el-menu-item index="6-2">TRANSFAC</el-menu-item>
          <el-menu-item index="6-2">阿里云基因组学公共数据集</el-menu-item>
          <el-menu-item index="6-2">GitHub</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickedIndex(index, indexPath) {
      this.$emit('clickedIndex', index, indexPath)
    }
  }
}
</script>

<style scoped>
.el-menu,
.el-aside,
.el-menu-item-group {
  height: 100%;
  width: 230px !important;
}

.icon {
  display: flex;
  align-items: center;
  width: 230px;
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
</style>
<template>
  <el-aside>
    <div class="icon">
      <el-image
          class="icon_image"
          style="width: 40px; height: 40px"
          :src="require('../assets/gene_icon.svg')"
          fit="cover"></el-image>
      <span class="icon_title">隐私计算云平台</span>
    </div>
    <el-menu
        class="el-menu-vertical-demo"
        @select="clickedIndex"
        background-color="#2f4256"
        text-color="#fff"
        :default-active="activeMenuIndex"
        active-text-color="#409eff">
      <el-menu-item index="1">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" style="align-items: start">
        <template slot="title">
          <i class="el-icon-discover"></i>
          <span>模型管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">
            <i class="el-icon-s-data"></i>
            模型管理
          </el-menu-item>
          <el-menu-item index="2-2">
            <i class="el-icon-document"></i>
            模型训练
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" style="align-items: start">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>结果预测</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">
            <i class="el-icon-s-platform"></i>
            预测数据管理
          </el-menu-item>
          <el-menu-item index="3-2">
            <i class="el-icon-edit"></i>
            预测结果管理
          </el-menu-item>
<!--          <el-menu-item index="3-3">-->
<!--            <i class="el-icon-finished"></i>-->
<!--            训练历史-->
<!--          </el-menu-item>-->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4" style="align-items: start">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1">个人用户管理</el-menu-item>
          <el-menu-item index="4-2">机构用户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5" style="align-items: start">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="5-1">版本更新</el-menu-item>
          <el-menu-item index="5-2">使用说明</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  props: ['activeMenuIndex'],
  name: "aside_menu",
  methods: {
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
  overflow: hidden;
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
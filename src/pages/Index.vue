<template>
  <el-container class="parent_container">
    <Aside
        class="left"
        :active-menu-index="activeMenuIndex"
        @clickedIndex="clickedIndex">
    </Aside>
    <el-container class="right">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
              :key="item"
              v-for="item in currentAsideList">{{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <el-tabs v-model="editableTabsValue"
                 @tab-click="changeTab"
                 type="border-card"
                 @tab-remove="removeTab">
          <el-tab-pane
              :closable="item.name !== '0'"
              v-for="(item) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
          >
            {{ item.content }}
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "../components/Aside";
import asideList from "../assets/json/asideList.json"

export default {
  name: "Index",
  components: {Aside},
  data() {
    return {
      asideList: asideList,
      currentAsideList: ['首页'],
      editableTabsValue: '0',
      editableTabs: [
        {
          title: "首页",
          name: "0",
          menuIndex: "1",
          content: "首页"
        }
      ],
      tabIndex: 0,
      activeMenuIndex: '1',
    }
  },
  methods: {
    addTab(targetName, menuIndex) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: targetName,
        name: newTabName,
        menuIndex: menuIndex,
        content: 'New Tab content'
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.activeMenuIndex = nextTab.menuIndex
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    clickedIndex(index) {
      let flag = true;
      let targetName = ''
      if (index.toString().indexOf('-') !== -1) {
        // 如果点击的是子菜单，则获取子菜单及其父菜单的名称
        let indexNum = index.toString().split('-')
        let groupName = this.asideList[indexNum[0] - 1].title
        targetName = this.asideList[indexNum[0] - 1].child[indexNum[1] - 1]
        // 修改面包屑
        this.currentAsideList = []
        this.currentAsideList.push(groupName)
        this.currentAsideList.push(targetName)
      } else if (index === '1') {
        // 如果点击的是首页菜单，无需添加 tab
        flag = false
        // 将首页对应的 tab 选中
        this.editableTabsValue = '0'
        // 修改面包屑
        this.currentAsideList = []
        this.currentAsideList.push('首页')
        return
      }
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].title === targetName){
          // 如果已经有对应 tab 页，则将对应 tab 页选中
          flag = false
          this.editableTabsValue = this.editableTabs[i].name.toString()
          break
        }
      }
      if (flag) {
        // 如果没有对应 tab 页，则新建 tab 页
        this.addTab(targetName, index)
      }
    },
    changeTab(tab) {
      if (tab.index === '0') {
        this.activeMenuIndex = '1'
        this.currentAsideList = []
        this.currentAsideList.push("首页")
      }
      this.editableTabs.forEach((tabItem) => {
        if (tabItem.name === tab.name) {
          this.activeMenuIndex = tabItem.menuIndex
          let indexList = tabItem.menuIndex.toString().split('-')
          let groupName = this.asideList[indexList[0]-1].title
          let targetName = this.asideList[indexList[0] - 1].child[indexList[1]-1]
          this.currentAsideList = []
          this.currentAsideList.push(groupName)
          this.currentAsideList.push(targetName)
        }
      })
    }
  }

}
</script>

<style scoped>
.el-main {
  padding: 0;
}

.parent_container,
.left {
  height: 100%;
}

.el-header {
  display: flex;
  /*background-color: #F3F3F4;*/
}

.el-breadcrumb {
  line-height: 60px;
}
</style>
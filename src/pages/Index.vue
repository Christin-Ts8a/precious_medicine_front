<template>
  <el-container class="parent_container">
    <Aside class="left" @clickedIndex="clickedIndex"></Aside>
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
        <el-tabs v-model="editableTabsValue" type="border-card" @tab-remove="removeTab">
          <el-tab-pane label="首页">
            首页
          </el-tab-pane>
          <el-tab-pane
              closable
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
      editableTabs: [],
      tabIndex: 1
    }
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: targetName,
        name: newTabName,
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
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    clickedIndex(index) {
      let indexNum = index.split('-')
      let groupName = this.asideList[indexNum[0] - 1].title
      let targetName = this.asideList[indexNum[0] - 1].child[indexNum[1] - 1]
      this.currentAsideList = []
      this.currentAsideList.push(groupName)
      this.currentAsideList.push(targetName)
      let flag = true;
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].title === targetName){
          flag = false
          break
        }
      }
      if (flag) {
        this.addTab(targetName)
      }
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
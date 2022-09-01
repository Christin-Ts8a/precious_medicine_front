<template>
  <el-container class="parent_container">
    <aside_menu
        class="left"
        :active-menu-index="activeMenuIndex"
        @clickedIndex="clickedIndex">
    </aside_menu>
    <el-container class="right">
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
              :key="item"
              v-for="item in currentAsideList">{{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="user-status">
          <div class="have-login" v-if="isLogin">
            <i class="el-icon-user-solid" style="margin-right: 5px"></i>
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="alterPassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="information">个人信息</el-dropdown-item>
                <el-dropdown-item command="signOut">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="have-not-login" v-if="!isLogin" @click="signIn">
            登录/注册
          </div>
        </div>
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
            <component :is="item.content"></component>
          </el-tab-pane>
<!--          <div class="quick-nav">-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/model_icon.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>模型管理</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/model_train_icon.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>模型训练</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/train_history.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>训练历史</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/predict_data.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>预测数据</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/predict_result.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>预测结果</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card  class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/user_single.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>个人用户</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--            <el-card class="quick-nav-item" :body-style="{ padding: '0px' }">-->
<!--              <el-image class="quick-nav-img" :src="require('../assets/user_org.svg')"></el-image>-->
<!--              <div class="quick-nav-title">-->
<!--                <span>机构用户</span>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </div>-->
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import aside_menu from "../components/aside_menu";
import asideList from "../assets/json/asideList.json"
import model_manage from "../components/model_manage";
import predict_data_manage from "../components/predict_data_manage"
import predict_result_manage from "../components/predict_result_manage";
import model_train from "../components/model_train";
import train_history from "../components/train_history";
import * as api from '../api/api'

export default {
  name: "Index",
  components: {aside_menu, model_manage, predict_data_manage, predict_result_manage},
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
          content: ''
        }
      ],
      tabIndex: 0,
      activeMenuIndex: '1',
      username: '',
      isLogin: false,
    }
  },
  created: function () {
    let nickname = localStorage.getItem("nickname")
    if (nickname !== undefined && nickname !== '' && nickname !== null) {
      this.username = nickname
      this.isLogin = true
    } else {
      this.username = ''
      this.isLogin = false
      api.isLogin().then(res => {
        if (res.status !== 200) {
          this.username = ''
          localStorage.clear()
          this.isLogin = false
          this.$router.push('/login')
        }
      })
    }
  },
  methods: {
    signIn() {
      this.$router.push('/login')
    },
    addTab(targetName, menuIndex) {
      let newTabName = ++this.tabIndex + '';
      let controller
      if (menuIndex !== '1') {
        switch(menuIndex) {
          case '2-1': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: model_manage
            }
            break
          }
          case '2-2': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: model_train
            }
            break
          }
          case '2-3': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: train_history
            }
            break
          }
          case '3-1': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: predict_data_manage
            }
            break
          }
          case '3-2': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: predict_result_manage
            }
            break
          }
          case '4-1': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: predict_data_manage
            }
            break
          }
          case '4-2': {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex,
              content: predict_data_manage
            }
            break
          }
          default: {
            controller = {
              title: targetName,
              name: newTabName,
              menuIndex: menuIndex
            }
          }
        }
      } else {
        controller = {
          title: targetName,
          name: newTabName,
          menuIndex: menuIndex
        }
      }
      this.editableTabs.push(controller);
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
      let role = localStorage.getItem("role")
      if (index.indexOf('3-') !== -1 && role > '1') {
        this.$notify({
          title: '权限不足',
          message: '没有权限使用此功能',
          type: 'error',
          duration: 1000 * 3
        });
        return;
      }
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
        if (this.editableTabs[i].title === targetName) {
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
          let groupName = this.asideList[indexList[0] - 1].title
          let targetName = this.asideList[indexList[0] - 1].child[indexList[1] - 1]
          this.currentAsideList = []
          this.currentAsideList.push(groupName)
          this.currentAsideList.push(targetName)
        }
      })
    },
    handleCommand(command) {
      if (command === 'signOut') {
        api.logout().then(res => {
          if (res.status === 200) {
            localStorage.clear()
            this.username = ''
            this.isLogin = false
            this.$router.push('/login')
          }
        })
      }
    },
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
  align-items: center;
  justify-content: space-between;
}

.el-breadcrumb {
  line-height: 60px;
}

.user-status {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-main {
  background-color: #F1F1F1;
}

.have-not-login:hover {
  cursor: pointer;
  color: dodgerblue;
  text-decoration: underline;
}

.quick-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

.quick-nav-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 10rem;
  width: 10rem;
  margin: 1rem;
}

.quick-nav-item:hover {
  cursor: pointer;
}

.quick-nav-img {
  height: 5rem;
  width: 5rem;
}

.quick-nav-title {
  /*padding: 1rem;*/
  text-align: center;
  width: 5rem;
}
</style>
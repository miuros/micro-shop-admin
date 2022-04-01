<template>

  <!---->
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img alt="" src="../assets/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside v-bind:width="isCollapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapsed">
          |||
        </div>
        <!--侧边栏菜单区域-->
        <el-menu
          :collapse="isCollapsed"
          :collapse-transition="false"
          :default-active="activePath"
          :router="true"
          :unique-opened="true"
          active-text-color="#409EFF"
          background-color="#333744"
          text-color="#fff">
          <!-- 一级菜单-->
          <el-submenu index="1">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont icon-user"></i>
              <!-- 文本 -->
              <span>users</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/users')" index="/users">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>用户管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont icon-tijikongjian"></i>
              <!-- 文本 -->
              <span>banners</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/banners')" index="/banners">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>轮播图管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont icon-shangpin"></i>
              <!-- 文本 -->
              <span>products</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/products')" index="/products">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>商品管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont icon-danju"></i>
              <!-- 文本 -->
              <span>orders</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/orders')" index="/orders">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>订单管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i></i>
              <!-- 文本 -->
              <span>shop</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/shops')" index="/shops">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>商铺管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <!-- 一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i class="iconfont icon-baobiao"></i>
              <!-- 文本 -->
              <span>roles</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/roles')" index="/roles">
              <!-- 二级菜单的模板区域-->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>权限管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      conObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否动态折叠
      isCollapsed: false,
      // 被激活的链接
      activePath: ''
    }
  },
  name: 'Home',
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空sessionStorage中的token
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    },
    /**
     * 获取所有的菜单
     */
    async getMenuList () {
      const { data: res } = await this.$http('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
      }
    },
    /**
     * 折叠侧边栏
     */
    toggleCollapsed () {
      this.isCollapsed = !this.isCollapsed
    },
    /**
     * 保存链接的激活状态
     */
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //
      this.activePath = activePath
    }

  }

}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  // cursor CSS 属性设置鼠标光标的类型（如果有），以在鼠标指针悬停在元素上时显示
  cursor: pointer;
}
</style>

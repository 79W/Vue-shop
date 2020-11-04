<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span @click="togcollapse()">电商管理系统</span>
      </div>
    <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse?'65px':'200px'">
            <el-menu
              :collapse="iscollapse"
              :router="true"
              :collapse-transition = "true"
              :default-active="activePath"
              unique-opened
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eff">
              <el-submenu v-for="(item,index) in menusList" :index="item.id + '' " :key="item.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.authName}}</span>
                </template>

                <el-menu-item v-for="(sub,i) in item.children" :index="'/'+sub.path" :key="sub.id"
                @click="toggleCollec('/'+sub.path)"
                >
                {{sub.authName}}
                </el-menu-item>

              </el-submenu>

              </el-menu-item>
            </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data(){
      return {
          menusList:[],
          iscollapse:false,
          activePath:''
      }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    logout() {
      // 清除
      window.sessionStorage.clear();
      // 跳转
      this.$router.push("/login");
    },
   async getMenuList(){
      const {data} =   await this.$http.get('menus')
      if(data.meta.status == 200){
          this.menusList = data.data
      }else{
        this.$message.error(data.meta.msg)
      }
    },
    togcollapse(){
        this.iscollapse = !this.iscollapse
    },
    toggleCollec(activePath){
         console.log(activePath)
         this.activePath =  activePath
         window.sessionStorage.setItem('activePath',activePath )
    }
  },
};
</script>
<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 1.5em;
    >div{
      cursor: pointer;
    }
  }
  .el-aside{
    background: #333744;
  }
  .el-main{
    background: #eaedf1;
  }

.el-menu{
  border-right:0px ;
}
</style>

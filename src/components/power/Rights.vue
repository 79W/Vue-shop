<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

      <el-card class="box-card">
            <el-table
                :data="rightsList"
                border
                >
                <el-table-column
                    type="index"
                    width="50"
                 >
                </el-table-column>
                <el-table-column
                  prop="authName"
                  label="权限名称">
                </el-table-column>
                <el-table-column
                  prop="path"
                  label="路径">
                </el-table-column>
                <el-table-column
                  prop="level"
                  label="权限等级">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.level == 0" type="success">一级</el-tag>
                      <el-tag v-if="scope.row.level == 1" type="warning">二级</el-tag>
                      <el-tag v-if="scope.row.level == 2" type="danger">三级</el-tag>
                  </template>
                </el-table-column>

              </el-table>
      </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        rightsList:[]
      }
    },
    created(){
    this.getRights()
    },
    methods:{
       async getRights(){
         const res =  await this.$http.get('rights/list')
         this.rightsList = res.data.data
         if(res.data.meta.status == 200) return this.$message.success(res.data.meta.msg)
         this.$message.error()(res.data.meta.msg)
        }
    }
  }
</script>

<style lang="less" scoped>
  .box-card{
    margin-top: 20px;
  }
</style>

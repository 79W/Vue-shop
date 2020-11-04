<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

      <el-card class="box-card">

            <el-button @click="showAdd" type="primary">添加角色</el-button>

            <el-table
                :data="rolesList"
                border
                >
            <!--    <el-table-column
                    type="expand"
                    width="50"
                 >
                </el-table-column> -->
                <el-table-column
                    type="index"
                    width="50"
                 >
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名称">
                </el-table-column>
                <el-table-column
                  prop="roleDesc"
                  label="角色描述">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                      <!-- {{scope.row}} -->
                       <el-button type="success" @click="openDist(scope.row)" size="mini">编辑</el-button>
                       <el-button type="warning" @click="openRolesList(scope.row)" size="mini">权限</el-button>
                         <el-button type="danger" size="mini" @click="delUserRoles(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
      </el-card>


      <el-dialog
        title="编辑信息"
        :visible.sync="userDist"
        width="30%"
        >

       <el-form  ref="addFormRef" :model="distUserForm">
            <el-form-item prop="username">
              <el-input v-model="distUserForm.id" :disabled="true"> </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="distUserForm.roleName" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="distUserForm.roleDesc" placeholder="简介"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateUserInfo">修 改</el-button>
        </span>

       </el-dialog>




       <el-dialog
         title="权限"
         :visible.sync="RloseShow"
         width="30%"
         @close="getDefdel"

         >

         <el-tree
           :data="Allchildren"
           ref="treeRef"
           show-checkbox
           node-key="id"
           :default-expanded-keys="expandedKeys"
           :default-checked-keys="checkedKeys"
           :props="defaultProps"
           >
         </el-tree>

         <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="updateUserElose">修 改</el-button>
         </span>

        </el-dialog>



        <!-- 添加 -->

        <el-dialog
          title="添加角色"
          :visible.sync="showaddjiao"
          width="30%"
          >

         <el-form  ref="addFormRef" :model="addJiao">
              <el-form-item>
                <el-input v-model="addJiao.roleName" placeholder="角色名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="addJiao.roleDesc" placeholder="角色简介"></el-input>
              </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="AddOkjiao">添 加</el-button>
          </span>

         </el-dialog>

  </div>
</template>

<script>
  export default {
    data(){
      return {
        addJiao:{
          roleName:'',
          roleDesc:''
        },

          showaddjiao:false,
          checkedKeys:[],
          expandedKeys:[],
          userDist:false,
          RloseShow:false,
          rolesList:[],
          children:[],
          Allchildren:[],

          defaultProps: {
            children: 'children',
            label: 'authName'
          },
          distUserForm:{
            id:'',
            roleName:'',
            roleDesc:''

          },
          rolesId:''
      }
    },
    created(){
       this.getRolesList()
       this.getRights()
    },
    methods:{
      async getRights(){
        const res =  await this.$http.get('rights/tree')
        this.Allchildren = res.data.data

       },
      async getRolesList(){
        const res =  await this.$http.get('roles')
        console.log(res.data)
        this.rolesList = res.data.data
        if(res.data.meta.status == 200) return this.$message.success(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
      },
      openDist(val){
         this.distUserForm = val
         this.userDist = true
      },
      async updateUserInfo(){
         const res =    await this.$http.put(`roles/${this.distUserForm.id}`,this.distUserForm )
         if(res.data.meta.status == 200){
            this.$message.success(res.data.meta.msg)
            this.userDist = false
         }else{
            this.$message.error(res.data.meta.msg)
         }

      },
      // 删除
     async delUserRoles(id){
        const res  =  await this.$http.delete(`roles/${id}`)
        console.log(res.data)
        if(res.data.meta.status == 200) return this.$message.success(res.data.meta.msg)
        this.$message.error(res.data.meta.msg)
      },
      openRolesList(val){
        console.log(val)
        this.children = val.children
        this.rolesId  = val.id
        this.getLeafkenys(val,this.checkedKeys)

        this.RloseShow = true
      },
      getLeafkenys(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item=>{
          this.getLeafkenys(item,arr)
        })
      },
      getDefdel(){
         this.checkedKeys = []
      },
      async updateUserElose(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
         const res =  await this.$http.post(`roles/${this.rolesId}/rights`,{rids:idStr})
         if(res.data.meta.status == 200){

           this.RloseShow = false

           this.$message.success(res.data.meta.msg)

         }else{
            this.$message.error(res.data.meta.msg)
         }
      },
      showAdd(){
         this.showaddjiao = true
      },
      // 添加角色
      async AddOkjiao(){
         const res =  await this.$http.post('roles',this.addJiao)
         console.log(res.data)
         if(res.data.meta.status == 201){
           this.showaddjiao = false
           this.getRolesList()
           this.$message.success(res.data.meta.msg)
         }else{
           this.$message.error(res.data.meta.msg)
         }
      }
    }
  }
</script>

<style lang="less" scoped>
  .box-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top: 20px;
  }
</style>

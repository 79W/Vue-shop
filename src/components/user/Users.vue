<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button @click="selectUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button @click="openAdduser" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
          :data="userList"
          border
          >
          <el-table-column
              type="index"
              width="50"
           >
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="mg_state"
            label="状态">
            <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChange(scope.row)"
                  >
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-tooltip  effect="dark"  content="编辑" placement="top" :enterable="false">
                <el-button type="primary" @click="distUserInfo(scope.row)" icon="el-icon-edit" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip  effect="dark" content="删除" placement="top" :enterable="false">
                 <el-button type="danger" @click="delUser(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip  effect="dark" content="设置" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="prev, pager, next"
          :current-page = "queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          :total="total"
          @current-change="changepage"
          >
        </el-pagination>
    </el-card>


    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      >

      <el-form  ref="addFormRef" :model="addUserForm" :rules="addRules">
          <el-form-item prop="username">
            <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="addUserForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addUserForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="false">取 消</el-button> -->
        <el-button type="primary" @click="adduser">提 交</el-button>
      </span>
    </el-dialog>


    <!-- 编辑 -->

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
            <el-input v-model="distUserForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="distUserForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUser" >修 改</el-button>
      </span>


     </el-dialog>


  </div>
</template>

<script>
  export default{
      data(){
        return {
          dialogVisible:false,
          userDist:false,
          queryInfo:{
             query:'',
             pagenum:1,
             pagesize:2
          },
          userList:[],
          total:0,
          addUserForm: {
            username: "",
            password: "",
            email:'',
            mobile:'',
          },
          distUserForm:{
            id:'',
            email:'',
            mobile:'',
          },
          addRules:{
            username: [
              { required: true, message: "请输入用户名", trigger: "blur" },
              {
                min: 3,
                max: 10,
                message: "长度在 3 到 10 个字符",
                trigger: "blur",
              },
            ],
            password: [
              { required: true, message: "请输入密码", trigger: "blur" },
              {
                min: 3,
                max: 10,
                message: "长度在 3 到 10 个字符",
                trigger: "blur",
              },
            ],
          },
        }
      },

      created() {
          this.getUserList()
      },
      methods:{
       async getUserList(){
           const res = await this.$http.get("users",{
              params:this.queryInfo
            })
            if(res.data.meta.status == 200){
                this.userList = res.data.data.users
                this.total = res.data.data.total
            }else{
              this.$message.error("获取用户失败")
            }
        },
        changepage(val){
           this.queryInfo.pagenum = val
           this.getUserList()
        },
        async userStateChange(userinfo){
            console.log(userinfo)
          const res =  await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)

          if(res.data.meta.status == 200){
            this.$message.success("修改成功")
          }else{
            this.$message.error("修改失败")
            userinfo.mg_state = !userinfo.mg_state
          }
        },
        // 查询
        selectUser(){
            this.getUserList()
            this.queryInfo.query = ''
        },
        // 打开添加用户
        openAdduser(){
          this.dialogVisible = true
        },
        // 添加用户
        adduser(){
          this.$refs.addFormRef.validate(async (res)=>{
            if(res){
              const res =  await this.$http.post('users',this.addUserForm)
              console.log(res.data)
              if(res.data.meta.status == 201){
                  this.getUserList()
                  this.dialogVisible = false
                  this.$message.success(res.data.meta.msg)
              }else{
                this.$message.error(res.data.meta.msg)
              }
            }else{
              this.$message.error("请输入全了")
            }
          })
        },
        // 删除用户
       async delUser(id){
         const res =  await this.$http.delete(`users/${id}`,)
          if(res.data.meta.status == 200){
            this.$message.success(res.data.meta.msg)
            this.queryInfo.pagenum = 1
            this.getUserList()
          }else{
            this.$message.error(res.data.meta.msg)
          }
        },
        distUserInfo(val){
            this.distUserForm.id =val.id
            this.distUserForm.email = val.email
            this.distUserForm.mobile = val.mobile
            this.userDist = true
        },
        // 提交
        async updateUser(){
         const res =   await this.$http.put(`users/${this.distUserForm.id}`,this.distUserForm)
         if(res.data.meta.status == 200){
           this.$message.success(res.data.meta.msg)
           this.userDist = false
           this.getUserList()
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
  .el-pagination{
    margin-top: 20px;
    text-align: center;
  }
</style>

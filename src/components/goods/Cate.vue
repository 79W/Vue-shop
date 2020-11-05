<template>
  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>


     <el-card>
        <el-button type="primary" @click="addCateList">添加分类</el-button>
        <el-table
            :data="cateList"
            border
            style="width: 100%">
            <el-table-column
                type="index"
                width="50"
             >
            </el-table-column>
            <el-table-column
              prop="cat_name"
              label="分类名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cat_level"
              label="等级">
            </el-table-column>
            <el-table-column
              label="功能">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showopenjiegou(scope.row.children)">查看</el-button>
                  <el-button type="warning" size="mini" @click="editcatename(scope.row.cat_id,scope.row.cat_name)">编辑</el-button>
                  <el-button type="danger" @click="delCate(scope.row.cat_id)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>


          <el-pagination
            background
            :current-page="queryInfo.pagenum"
            :page-size="queryInfo.pagesize"
            @current-change="changepage"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
     </el-card>


     <el-dialog
       title="编辑用户"
       :visible.sync="editshow"
       width="30%"
       >
       <el-form>
           <el-form-item>
             <el-input v-model="cateName" placeholder="请输入用户名"></el-input>
           </el-form-item>
       </el-form>

       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="editCate">提 交</el-button>
       </span>
     </el-dialog>

      <el-dialog
       title="查看结构"
       :visible.sync="showjiegou"
       width="30%"
       >

        <el-tree :data="zishowtree" :props="defaultProps"></el-tree>

       <span slot="footer" class="dialog-footer">
         <!-- <el-button type="primary" >提 交</el-button> -->
       </span>
     </el-dialog>

      <el-dialog
       title="添加分类"
       :visible.sync="addshow"
       width="30%"
       >

          <el-input v-model="newCatename" placeholder="请输入名称"></el-input>


       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="addCateNew">提 交</el-button>
       </span>
     </el-dialog>



  </div>
</template>

<script>
  export default {
    data(){
      return{
        newCatename:"",
        addshow:false,
        defaultProps: {
          children: 'children',
          label: 'cat_name'
        },
        showjiegou:false,
        editshow:false,
        cateName:'',
        cateId:'',
          queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
          },
          zishowtree:[],
          cateList:[],
          total:0,
      }
    },
    created() {
        this.getCateList()
    },
    methods:{
       async getCateList(){
        const res =  await this.$http.get('categories',{
            params:this.queryInfo
         })
         console.log(res.data.data.result)
         if(res.data.meta.status == 200){
            this.total = res.data.data.total
            this.cateList = res.data.data.result
            this.$message.success(res.data.meta.msg)
         }else{
           this.$message.error(res.data.meta.msg)
         }
       },
       async editcatename(id,val){
         console.log(id,val)
         this.editshow = true
         this.cateId = id
         this.cateName = val
       },
       async delCate(val){
         console.log(val)
          const res =  await this.$http.delete(`categories/${id}`)
          if(res.data.meta.status == 200){
             this.getCateList()
              this.queryInfo.pagenum = 1
             this.$message.success(res.data.meta.msg)
          }else{
            this.$message.error(res.data.meta.msg)
          }
       },
        async editCate(){
         const res =  await this.$http.put(`categories/${this.cateId}`,{cat_name:this.cateName})
         if(res.data.meta.status == 200){
           this.editshow = false
             this.getCateList()
            this.$message.success(res.data.meta.msg)
         }else{
           this.$message.error(res.data.meta.msg)
         }
       },
       showopenjiegou(val){
         this.zishowtree = val
         this.showjiegou = true
       },
       addCateList(){
          this.addshow = true
       },
       async addCateNew(){
         // categories
         const res =  await this.$http.post(`categories`,{cat_pid:0,cat_level:0,cat_name:this.newCatename})
         if(res.data.meta.status == 201){
           this.addshow = false
             this.getCateList()
            this.$message.success(res.data.meta.msg)
         }else{
           this.$message.error(res.data.meta.msg)
         }
       },
       changepage(val){
          console.log(val)
           this.queryInfo.pagenum = val
           this.getCateList()
       }
    }
  }
</script>

<style lang="less">
  .el-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top:20px ;
  }
  .el-pagination{
    text-align: center;
    margin-top: 20px;

  }
</style>

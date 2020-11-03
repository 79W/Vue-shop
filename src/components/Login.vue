<template>
  <div class="login-content">
    <div class="box">
      <el-card class="box-card">
        <h3>后台登陆</h3>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              placeholder="请输入账号"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-setting"
              placeholder="请输入密码"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" round>登陆</el-button>
            <el-button type="info" @click="reset()" round>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
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
    };
  },
  methods: {
    // 重置
    reset() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const { data } = await this.$http.post("login", this.loginForm);
          if (data.meta.status == 200) {
            this.$message({
              message: "登陆成功",
              type: "success",
            });
            // token存起来
            window.sessionStorage.setItem("token", data.data.token);
            // 切换路由
            this.$router.push("/home");
          } else {
            this.$message({
              message: "登陆失败",
              type: "error",
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-content {
  width: 100vm;
  height: 100vm;
}
.login-content .box {
  width: 500px;
  margin: auto;
  margin-top: 200px;
}
.box-card h3 {
  font-size: 1.5em;
  text-align: center;
}
</style>

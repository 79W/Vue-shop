<template>
  <div>
    <el-button @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      // 清除
      window.sessionStorage.clear();
      // 跳转
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
</style>
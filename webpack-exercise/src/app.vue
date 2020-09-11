<template lang="html">
  <div class="container">
    <h1>{{ initData }}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      initData: 'Vue开发环境运行成功'
    }
  }
}
</script>

<style lang="css" scoped>
.container {
  color: red;
  display: flex;
}
</style>

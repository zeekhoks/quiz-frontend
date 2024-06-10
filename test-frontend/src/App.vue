
<template>
<div>
  <h1 class="app-body">Quiz App</h1>
  <router-view></router-view>
</div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-body {
  margin-bottom: 10px;
}
</style>

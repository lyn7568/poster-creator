<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style>
html {
  font-size: 100px; /* 1rem = 100px */
}

.app {
  font-family: Arial, sans-serif;
}

/* Reset some basic elements */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f0f2f5;
  font-size: 0.14rem; /* 默认字体大小 14px */
}
</style>

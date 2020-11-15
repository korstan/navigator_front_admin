<template>
  <div id="app">
    <div class="tile app-child is-ancestor">
      <div class="tile side is-vertical is-2">
        <SideMenu />
      </div>
      <div class="tile app-child main is-vertical">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu';

export default {
  name: 'App',
  components: {SideMenu},
};
</script>

<style>
@import "https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css";

html, body {
   height: 100%;
   width: 100%;
   margin: 0;
   padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.tile.is-ancestor {
  height: 100%;
}

.app-child {
  padding: 24px;
}

.side {
  background-color: lightgray;
  
}
</style>

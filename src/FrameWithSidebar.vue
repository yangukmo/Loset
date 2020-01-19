<template>
  <div id="app">
    <sidebar id="sidebar"/>
    <section id="content">
      <router-view class="wrapper"/>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Sidebar from './components/Sidebar.vue'

  @Component({
    components: {
      Sidebar,
    },
  })
  export default class FrameWithSidebar extends Vue {
  }
</script>

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    display: grid;
    grid-template-areas: "nav content";
    grid-template-columns: 68px 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;

    #sidebar {
      grid-area: nav;
    }

    #content {
      grid-area: content;
      overflow-y: auto;
      height: 100vh;
    }
  }
</style>

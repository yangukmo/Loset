<template>
  <div id="app">
    <sidebar id="sidebar"/>
    <section id="content">
      <router-view class="wrapper"/>
    </section>
  </div>
</template>

<script lang="ts">
  import Sidebar from '@/components/Sidebar.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Sidebar,
    },
  })
  export default class App extends Vue {

  }
</script>

<style lang="scss">
  body {
    background-color: #0e0037;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3CradialGradient id='a' cx='0' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23080c29'/%3E%3Cstop offset='1' stop-color='%23080c29' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='1200' cy='800' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23071738'/%3E%3Cstop offset='1' stop-color='%23071738' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='600' cy='0' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2301232a'/%3E%3Cstop offset='1' stop-color='%2301232a' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='600' cy='800' r='600' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%230e0037'/%3E%3Cstop offset='1' stop-color='%230e0037' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='0' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2301181b'/%3E%3Cstop offset='1' stop-color='%2301181b' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='1200' cy='0' r='800' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23002d38'/%3E%3Cstop offset='1' stop-color='%23002d38' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Crect fill='url(%23b)' width='1200' height='800'/%3E%3Crect fill='url(%23c)' width='1200' height='800'/%3E%3Crect fill='url(%23d)' width='1200' height='800'/%3E%3Crect fill='url(%23e)' width='1200' height='800'/%3E%3Crect fill='url(%23f)' width='1200' height='800'/%3E%3C/svg%3E");
    background-attachment: fixed;
    background-size: cover;
    background-position: center center;
    background-repeat: repeat;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    display: grid;
    grid-template-areas: "nav content";

    grid-template-columns: 150px 1fr;
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

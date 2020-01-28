<template>
  <nav>
    <section class="area-menu">
      <ul id="menu">
        <sidebar-item icon="desktop" name="Dashboard" to="/dashboard"/>
        <sidebar-item icon="cog" name="Settings" to="/settings"/>
      </ul>
    </section>
  </nav>
</template>

<script lang="ts">
  import SidebarItem from '@/components/SidebarItem.vue'
  import { Component, Vue } from 'vue-property-decorator'
  import { shell } from 'electron'

  @Component({
    components: {
      SidebarItem,
    },
  })
  export default class Sidebar extends Vue {
    openLink(): void {
      shell.openExternal('https://github.com/yangukmo/loset')
    }
  }
</script>

<style lang="scss" scoped>
  nav {
    color: #FFF;
    height: 100vh;
    background-color: rgba(0, 0, 0, .5);
    display: grid;
    grid-template-rows: 1fr 50px;

    .area-menu {
      display: flex;
      align-items: center;
      justify-content: center;

      #menu {
        width: 100%;
        list-style: none;
        padding: 0;
      }
    }
  }
</style>

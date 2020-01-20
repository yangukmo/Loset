<template>
  <nav>
    <section class="area-menu">
      <ul id="menu">
        <sidebar-item icon="desktop" name="Dashboard" to="/dashboard"/>
        <sidebar-item icon="cog" name="Settings" to="/settings"/>
      </ul>
    </section>
    <section class="area-logo">
      <img src="../images/logo/logo-white.svg" id="img-logo" alt="logo" class="no-select" @click="openLink"/>
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
    background-color: rgba(0, 0, 0, .2);
    display: grid;
    grid-template-rows: 1fr 50px;

    .area-logo {
      display: flex;
      align-items: center;
      justify-content: center;

      #img-logo {
        width: 45px;
        -webkit-user-drag: none;
        user-select: none;
        cursor: pointer;
      }
    }

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

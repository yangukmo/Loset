<template>
  <nav>
    <section class="area-logo">
      <img src="../images/logo/logo-white.svg" id="img-logo" alt="logo" class="no-select"/>
    </section>
    <section class="area-menu">
      <ul id="menu">
        <sidebar-item icon="dashboard" name="Dashboard" to="/dashboard"/>
        <sidebar-item icon="settings" name="Settings" to="/settings"/>
      </ul>
    </section>
  </nav>
</template>

<script lang="ts">
  import SidebarItem from '@/components/SidebarItem.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      SidebarItem,
    }
  })
  export default class Sidebar extends Vue {
  }
</script>

<style lang="scss" scoped>
  nav {
    color: #FFF;
    height: 100vh;

    .area-logo {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      #img-logo {
        width: 100px;
        margin-top: 20px;
        -webkit-user-drag: none;
        user-select: none;
      }
    }
    .area-menu {
      #menu {
        list-style: none;
        padding: 0;
      }
    }
  }
</style>

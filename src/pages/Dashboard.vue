<template>
  <article id="dashboard-wrapper">
    <section id="groups">
      <groups/>
    </section>
    <section id="apps">
      <apps/>
    </section>
  </article>
</template>

<script lang="ts">
  import Apps from '@/components/Apps.vue'
  import Groups from '@/components/Groups.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Groups,
      Apps,
    },
  })
  export default class Dashboard extends Vue {

  }
</script>

<style lang="scss" scoped>
  #dashboard-wrapper {
    display: grid;
    grid-template-areas: "groups apps";
    grid-template-columns: 200px 1fr;

    #groups {
      grid-area: groups;
      padding: 1.5rem .75rem;
      height: 100vh;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, .5);
      box-sizing: border-box;
      position: relative;
    }

    #apps {
      grid-area: apps;
      height: 100vh;
      overflow-y: auto;
      padding: 1.5rem 2rem;
      box-sizing: border-box;
      position: relative;
    }
  }
</style>

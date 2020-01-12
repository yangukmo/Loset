<template>
  <section>
    <div>

    </div>

    <card title="Apps">
      <template slot="header-right">
        <router-link tag="button" to="/dashboard/new-app">Add app</router-link>
        <button @click="deleteApps">Delete apps</button>
      </template>
      <template slot="content">
        <app-item v-for="app of apps" :app="app" :key="app.id"/>
      </template>
    </card>
  </section>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import Card from '@/components/Card.vue'
  import AppItem from '@/components/AppItem.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      AppItem,
      Card,
    },
  })
  export default class Dashboard extends Vue {
    apps: IAppInClient[] = []

    created() {
      ipcRenderer.on(IPC_EVENT.APPS, (event, data) => {
        this.apps = data
      })
      ipcRenderer.send(IPC_EVENT.APPS)
    }

    deleteApps() {
      ipcRenderer.send(IPC_EVENT.DELETE_APPS)
    }

    destroyed () {
      ipcRenderer.removeAllListeners(IPC_EVENT.APPS)
    }
  }
</script>

<style lang="scss" scoped>

</style>

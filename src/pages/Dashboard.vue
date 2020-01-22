<template>
  <div id="dashboard-wrapper">
    <section>
      <card id="control">
        <icon-button icon="plus" to="/dashboard/new-app"/>
        <icon-button icon="play" @click.native="startApps"/>
        <icon-button icon="stop" @click.native="stopApps"/>
        <icon-button icon="trash" @click.native="deleteApps"/>
      </card>

      <card id="search">
        <search-app/>
      </card>

      <div id="content">
        <div class="title">
          <div>Name</div>
          <div>PID</div>
          <div>Status</div>
          <div>Health Check</div>
          <div>Auto Start</div>
          <div>Control</div>
        </div>
        <app-item v-for="app of apps" :app="app" :key="app.id"/>
        <not-found-apps v-if="!apps.length"/>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import AppItem from '@/components/AppItem.vue'
  import Card from '@/components/Card.vue'
  import IconButton from '@/components/IconButton.vue'
  import NotFoundApps from '@/components/NotFoundApps.vue'
  import SearchApp from '@/components/SearchApp.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      NotFoundApps,
      AppItem,
      Card,
      SearchApp,
      IconButton,
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

    startApps() {
      ipcRenderer.send(IPC_EVENT.START_APPS)
    }

    stopApps() {
      ipcRenderer.send(IPC_EVENT.STOP_APPS)
    }

    deleteApps() {
      ipcRenderer.send(IPC_EVENT.DELETE_APPS)
    }

    destroyed() {
      ipcRenderer.removeAllListeners(IPC_EVENT.APPS)
    }
  }
</script>

<style lang="scss" scoped>
  #dashboard-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section {
      display: grid;
      grid-gap: 1rem;
      grid-template-areas: "search control" "content content";
      grid-template-columns: 1fr 170px;
      width: 100%;
      max-width: 1000px;

      #search {
        grid-area: search;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #control {
        grid-area: control;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #content {
        grid-area: content;

        .title {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 150px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          user-select: none;
          padding: 0 1rem;

          div {
            text-align: center;
            color: #AAA;
          }
        }
      }
    }
  }
</style>

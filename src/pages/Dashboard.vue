<template>
  <div id="dashboard-wrapper">
    <section>
      <card id="logo">
        <img src="../images/logo/logo.svg" alt="logo"/>
      </card>

      <card id="control">
        <icon-button icon="plus" to="/dashboard/new-app"/>
        <icon-button icon="play" @click.native="startApps" :disabled="isEmptyApps"/>
        <icon-button icon="stop" @click.native="stopApps" :disabled="isEmptyApps"/>
        <icon-button icon="trash" @click.native="deleteApps" :disabled="isEmptyApps"/>
      </card>

      <card id="search">
        <search-app :disabled="isEmptyApps"/>
      </card>

      <div id="content">
        <div class="title">
          <div/>
          <div>Name</div>
          <div>PID</div>
          <div>Status</div>
          <div>Health Check</div>
          <div>Auto Start</div>
          <div>Control</div>
        </div>

        <draggable :list="apps" handle=".handle" @end="onEndDrag">
          <app-item v-for="app of apps" :app="app" :key="app.id"/>
        </draggable>
        <not-found-apps v-if="isEmptyApps"/>
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
  import Draggable from 'vuedraggable'

  @Component({
    components: {
      NotFoundApps,
      AppItem,
      Card,
      SearchApp,
      IconButton,
      Draggable,
    },
  })
  export default class Dashboard extends Vue {
    private apps!: IAppInClient[]
    private isLoading!: boolean

    constructor() {
      super()
      this.apps = []
      this.isLoading = false
    }

    created(): void {
      this.isLoading = true
      ipcRenderer.on(IPC_EVENT.GET_APPS, (event, data) => {
        this.apps = data
        this.isLoading = false
      })
      ipcRenderer.send(IPC_EVENT.GET_APPS)
    }

    get hasActiveApps(): boolean {
      return this.apps.some((app) => app.active)
    }

    get isEmptyApps(): boolean {
      return !this.apps.length && !this.isLoading
    }

    startApps(): void {
      ipcRenderer.send(IPC_EVENT.START_APPS)
    }

    stopApps(): void {
      if (!this.hasActiveApps) {
        return
      }

      ipcRenderer.send(IPC_EVENT.STOP_APPS)
    }

    deleteApps(): void {
      if (this.isEmptyApps) {
        return
      }

      ipcRenderer.send(IPC_EVENT.DELETE_APPS)
    }

    destroyed(): void {
      ipcRenderer.removeAllListeners(IPC_EVENT.GET_APPS)
    }

    onEndDrag(): void {
      const sortedAppIdList = this.apps.map((app) => app.id)
      ipcRenderer.send(IPC_EVENT.UPDATE_APPS_ORDER, sortedAppIdList)
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
      grid-template-areas: "logo search control" "content content content";
      grid-template-columns: 120px 1fr 150px;
      width: 100%;
      max-width: 1000px;

      #logo {
        grid-area: logo;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 70px;
          -webkit-user-drag: none;
          user-select: none;
        }
      }

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
          grid-template-columns: 30px 2fr 1fr 1fr 1fr 1fr 105px;
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

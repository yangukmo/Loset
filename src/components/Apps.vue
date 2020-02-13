<template>
  <div id="apps-wrapper">
    <section>
      <card id="title" :bg="false" :margin="false" :padding="false">
        <h1>{{ groupName || 'All' }}</h1>
      </card>

      <card id="search" :bg="false" :margin="false" :padding="false">
        <search-app :disabled="isEmptyApps"/>
      </card>

      <card id="control" :bg="false" :margin="false" :padding="false">
        <icon-button icon="plus" to="/apps/new" :disabled="!groupId"/>
        <icon-button icon="play" @click.native="startApps" :disabled="isEmptyApps"/>
        <icon-button icon="stop" @click.native="stopApps" :disabled="isEmptyApps"/>
        <icon-button icon="trash" @click.native="deleteApps" :disabled="isEmptyApps"/>
      </card>

      <div id="content">
        <div class="title">
          <div/>
          <div>Name</div>
          <div>PID</div>
          <div>Status</div>
          <div class="hidden">Health Check</div>
          <div>Auto Start</div>
          <div>Control</div>
        </div>

        <draggable v-model="appsForSort" handle=".handle" @end="onEndDrag" :disabled="!groupId">
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
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import Draggable from 'vuedraggable'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    components: {
      NotFoundApps,
      AppItem,
      Card,
      SearchApp,
      IconButton,
      Draggable,
    },
    methods: mapActions('app', ['getApps', 'setApps']),
    computed: {
      ...mapGetters('app', ['apps', 'hasActive', 'isEmpty']),
      ...mapGetters('group', ['groupId', 'groupName']),
    },
  })
  export default class Apps extends Vue {
    private apps!: IAppInClient[]
    private isLoading!: boolean
    private getApps!: any
    private setApps!: any
    private hasActive!: boolean
    private isEmpty!: boolean
    private groupId!: string

    constructor() {
      super()
      this.isLoading = false
    }

    get isEmptyApps(): boolean {
      return this.isEmpty && !this.isLoading
    }

    startApps(): void {
      ipcRenderer.send(IPC_EVENT.START_APPS, this.groupId)
    }

    stopApps(): void {
      if (!this.hasActive) {
        return
      }

      ipcRenderer.send(IPC_EVENT.STOP_APPS, this.groupId)
    }

    deleteApps(): void {
      if (this.isEmptyApps) {
        return
      }

      ipcRenderer.send(IPC_EVENT.DELETE_APPS, this.groupId)
    }

    get appsForSort(): IAppInClient[] {
      return this.apps
    }

    set appsForSort(apps: IAppInClient[]) {
      this.setApps(apps)
    }

    onEndDrag(): void {
      const sortedAppIdList = this.apps.map((app) => app.id)
      ipcRenderer.send(IPC_EVENT.UPDATE_APPS_ORDER, sortedAppIdList)
    }

    @Watch('groupId', { immediate: true })
    onChangedGroupId(): void {
      this.getApps()
    }
  }
</script>

<style lang="scss" scoped>
  #apps-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section {
      grid-area: apps;
      display: grid;
      grid-gap: 1rem;
      grid-template-areas: "title title" "search control" "content content";
      grid-template-columns: 1fr 113px;
      width: 100%;
      max-width: 800px;

      #title {
        grid-area: title;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        h1 {
          color: #FFF;
          font-weight: 300;
          margin: 0;
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
        margin-bottom: 3rem;

        .title {
          display: grid;
          grid-template-columns: 30px 2fr 1fr 1fr 1fr 80px;
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

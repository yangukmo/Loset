<template>
  <div v-show="isShowApp" id="app-item-wrapper">
    <div class="color-bar" :style="barStyle"/>

    <section id="info">
      <article>
        <font-awesome-icon icon="grip-lines" class="handle"/>
      </article>
      <article>
        <span class="name" v-text="app.name"/>
      </article>
      <article>
        <span class="pid" v-text="app.pid" v-if="app.pid > 0"/>
      </article>
      <article>
        <status :active="app.active"/>
      </article>
      <article>
        <status :active="app.hc.active"/>
      </article>
      <article>
        <status :active="app.auto_start"/>
      </article>
      <article class="control">
        <icon-button class="start" icon="play" @click.native="startApp" :disabled="app.active"/>
        <icon-button class="stop" icon="stop" @click.native="stopApp"/>
        <dropdown-menu @open-directory="openDirectory" @open-terminal="openOutputWindow" @delete-app="deleteApp"/>
        <icon-button class="detail" icon="chevron-right" :to="'/dashboard/apps/' + app.id"/>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import DropdownMenu from '@/components/DropdownMenu.vue'
  import IconButton from '@/components/IconButton.vue'
  import Status from '@/components/Status.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { mapGetters } from 'vuex'

  @Component({
    components: {
      Status,
      IconButton,
      DropdownMenu,
    },
    computed: mapGetters('searchApp', ['getKeyword']),
  })
  export default class AppItem extends Vue {
    @Prop({ default: {}, required: true, type: Object }) app!: IAppInClient
    private getKeyword!: string

    get isShowApp(): boolean {
      return this.getKeyword ? this.app.name.toUpperCase().includes(this.getKeyword.toUpperCase()) : true
    }

    get barStyle(): { backgroundColor: string } {
      return { backgroundColor: this.app.theme.color }
    }

    startApp(): void {
      ipcRenderer.send(IPC_EVENT.START_APP, this.app.id)
    }

    stopApp(): void {
      ipcRenderer.send(IPC_EVENT.STOP_APP, this.app.id)
    }

    openDirectory(): void {
      ipcRenderer.send(IPC_EVENT.OPEN_DIRECTORY, this.app.id)
    }

    deleteApp(): void {
      ipcRenderer.send(IPC_EVENT.DELETE_APP, this.app.id)
    }

    openOutputWindow(): void {
      ipcRenderer.send(IPC_EVENT.OPEN_OUTPUT_WINDOW, this.app.id)
    }
  }
</script>

<style lang="scss" scoped>
  #app-item-wrapper {
    color: #FFF;
    background-color: rgba(14, 84, 105, 0.2);
    border-radius: .25rem;
    padding: .65rem 1rem;
    margin-bottom: .25rem;
    user-select: none;
    position: relative;

    .color-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      border-top-left-radius: .25rem;
      border-bottom-left-radius: .25rem;
    }

    #info {
      display: grid;
      grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 105px;

      article {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .name {
        font-weight: 600;
      }

      .handle {
        color: #AAA;
        cursor: grab;

        &:active {
          color: #FFF;
          cursor: grabbing;
        }
      }
    }
  }
</style>

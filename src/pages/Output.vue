<template>
  <section id="output" v-if="app">
    <header>
      <section class="title">
        <span :style="nameStyle">{{ app.name }}</span>
      </section>
      <section class="control">
        <icon-button icon="trash" @click.native="deleteOutput()"/>
      </section>
    </header>
    <article id="area-terminal">
      <output-terminal id="terminal" :id="id"/>
    </article>
  </section>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import IconButton from '@/components/IconButton.vue'
  import OutputTerminal from '@/components/OutputTerminal.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { EventBus } from '@/shared/EventBus'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: { IconButton, OutputTerminal },
  })
  export default class Output extends Vue {
    private id!: string
    private name!: string
    private eventBusOutputName!: string
    private eventBusDeleteOutputName!: string
    private app!: IAppInClient

    constructor() {
      super()
      this.app = {} as IAppInClient
    }

    get nameStyle(): { borderBottom: string } {
      const color = this.app.theme?.color

      return {
        borderBottom: `2px solid ${color}`,
      }
    }

    created(): void {
      this.id = this.$route.params.id
      this.name = this.id
      this.eventBusOutputName = `output:${this.id}`
      this.eventBusDeleteOutputName = `delete-output:${this.id}`
      this.listenEvents()
    }

    listenEvents(): void {
      ipcRenderer
        .once(IPC_EVENT.APP, (event, data) => {
          this.app = data
        })
        .on(IPC_EVENT.GET_ALL_OUTPUT, (event, data: Buffer[]) => {
          data.forEach((d: Buffer) => EventBus.$emit(this.eventBusOutputName, d))
        })
        .on(IPC_EVENT.OUTPUT, (event, data) => {
          EventBus.$emit(this.eventBusOutputName, data)
        })

      ipcRenderer.send(IPC_EVENT.GET_ALL_OUTPUT, this.id)
      ipcRenderer.send(IPC_EVENT.APP, this.id)
    }

    deleteOutput(): void {
      ipcRenderer.send(IPC_EVENT.DELETE_APP_OUTPUT, this.id)
      EventBus.$emit(this.eventBusDeleteOutputName)
    }

    destroyed(): void {
      ipcRenderer.removeAllListeners(IPC_EVENT.APP)
      ipcRenderer.removeAllListeners(IPC_EVENT.OUTPUT)
      ipcRenderer.removeAllListeners(IPC_EVENT.GET_ALL_OUTPUT)
      EventBus.$off(this.eventBusOutputName)
      EventBus.$off(this.eventBusDeleteOutputName)
    }
  }
</script>

<style lang="scss" scoped>
  #output {
    height: 100vh;
    display: grid;
    grid-template-areas: "title" "terminal";
    grid-template-rows: 50px 1fr;
    background-color: #000;

    header {
      grid-area: title;
      color: #FFF;
      display: grid;
      padding-left: .5rem;
      padding-right: .5rem;
      grid-template-areas: "empty title control";
      grid-template-columns: 1fr 1fr 1fr;
      -webkit-app-region: drag;

      .title {
        grid-area: title;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 16px;
          user-select: none;
        }
      }

      .control {
        grid-area: control;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    #area-terminal {
      padding: 0 .5rem;
      grid-area: terminal;
    }
  }
</style>

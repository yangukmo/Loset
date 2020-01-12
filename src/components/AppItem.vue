<template>
  <article>
    <section id="info">
      <span class="name">{{ app.name }}</span>
      <status :active="app.active"/>
      <div>
        <button @click="startApp">Start</button>
        <button @click="stopApp">Stop</button>
        <button>Output</button>
        <button @click="deleteApp">Delete</button>
      </div>
    </section>
    <section id="detail">
      <p style="color: #FFF; font-size: 14px">{{ app }}</p>
    </section>

  </article>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import Status from '@/components/Status.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Status,
    },
  })
  export default class AppItem extends Vue {
    @Prop({ default: {}, required: true, type: Object }) app!: IAppInClient

    startApp(): void {
      ipcRenderer.send(IPC_EVENT.START_APP, this.app.id)
    }

    stopApp(): void {
      ipcRenderer.send(IPC_EVENT.STOP_APP, this.app.id)
    }

    deleteApp(): void {
      ipcRenderer.send(IPC_EVENT.DELETE_APP, this.app.id)
    }
  }
</script>

<style lang="scss" scoped>
  article {
    padding: .5rem;
    color: #FFF;

    #info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>

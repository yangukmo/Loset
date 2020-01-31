<template>
  <div id="app-detail-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/dashboard"/>
    </section>

    <section class="app-detail-content">
      <h1 class="title no-select">Edit the {{ appName }} app</h1>

      <validation-observer v-slot="{ invalid }">
        <form v-if="app.id">
          <card>
            <input-label label="Directory">
              <span class="dir" v-text="app.dir"/>
            </input-label>
          </card>

          <card>
            <validation-provider rules="required|maxLength:20" v-slot="{ errors }" tag="div" name="name">
              <input-label label="Name" :error-message="errors[0]">
                <input type="text" v-model="app.name" maxlength="20"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <validation-provider rules="required|maxLength:50|" v-slot="{ errors }" tag="div" name="start command">
              <input-label label="Start Command" :error-message="errors[0]">
                <input type="text" v-model="app.start_cmd" maxlength="50"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <input-label label="Color">
              <compact-color-picker :value="app.theme.color" @input="updateColor"/>
            </input-label>
          </card>

          <card>
            <input-label label="Auto Start">
              <checkbox v-model="app.auto_start" class="checkbox"/>
            </input-label>
          </card>

          <card class="hidden">
            <input-label label="Health Check API">
              <checkbox v-model="app.hc.active" class="checkbox" :disabled="true"/>
            </input-label>
          </card>

          <card v-if="app.hc.active">
            <validation-provider rules="port" v-slot="{ errors }" tag="div" name="port">
              <input-label label="Port" :error-message="errors[0]">
                <input type="number" placeholder="1~65535" v-model="app.hc.port" :disabled="!app.hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <card v-if="app.hc.active">
            <validation-provider rules="path|maxLength:50" v-slot="{ errors }" tag="div" name="path">
              <input-label label="Path" :error-message="errors[0]">
                <input type="text" v-model="app.hc.path" placeholder="/hc" maxlength="50" :disabled="!app.hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <card v-if="app.hc.active">
            <validation-provider rules="interval" v-slot="{ errors }" tag="div" name="interval">
              <input-label label="Interval" :error-message="errors[0]">
                <input type="number" v-model="app.hc.interval" placeholder="5000~60000" :disabled="!app.hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <button type="button" class="primary block" @click="update" :disabled="invalid">Update</button>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import Card from '@/components/Card.vue'
  import Checkbox from '@/components/Checkbox.vue'
  import DirectorySelector from '@/components/DirectorySelector.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      InputLabel,
      DirectorySelector,
      Card,
      Checkbox,
      IconButton,
    },
  })
  export default class AppDetail extends Vue {
    private app!: IAppInClient
    private id!: string
    private appName!: string

    constructor() {
      super()
      this.app = {} as IAppInClient
      this.appName = ''
    }

    created(): void {
      this.id = this.$route.params.id
      this.listenEvents()
    }

    listenEvents(): void {
      ipcRenderer.once(IPC_EVENT.GET_APP, (event, data) => {
        this.app = data
        this.appName = this.app.name
      })
      ipcRenderer.send(IPC_EVENT.GET_APP, this.id)
    }

    removeEvents(): void {
      ipcRenderer.removeAllListeners(IPC_EVENT.GET_APP)
    }

    update(): void {
      ipcRenderer.send(IPC_EVENT.UPDATE_APP, {
        id: this.app.id,
        name: this.app.name,
        start_cmd: this.app.start_cmd,
        auto_start: this.app.auto_start,
        hc: this.app.hc,
        theme: this.app.theme,
      })
      this.$router.push('/dashboard')
    }

    destroyed(): void {
      this.removeEvents()
    }

    updateColor(colors: { hex: string }): void {
      this.app.theme.color = colors.hex
    }
  }
</script>

<style lang="scss" scoped>
  #app-detail-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    section.close-wrapper {
      position: fixed;
      top: 1rem;
      right: 1rem;

      #btn-close {
        font-size: 20px;
      }
    }

    section.app-detail-content {
      width: 100%;
      max-width: 500px;
      margin-bottom: 50px;

      .title {
        color: #FFF;
        font-weight: 300;
      }

      .dir {
        color: #FFF;
        margin-top: .75rem;
      }

      .checkbox {
        margin-top: .75rem;
      }
    }
  }
</style>

<template>
  <div id="app-detail-wrapper">
    <section class="app-detail-content">
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
            <input-label label="Auto Start">
              <checkbox v-model="app.auto_start" class="checkbox"/>
            </input-label>
          </card>

          <card>
            <input-label label="Health Check API">
              <checkbox v-model="app.hc.active" class="checkbox"/>
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

          <button-group>
            <button @click="update" :disabled="invalid">Update</button>
            <button @click="back">Back</button>
          </button-group>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import ButtonGroup from '@/components/ButtonGroup.vue'
  import Card from '@/components/Card.vue'
  import Checkbox from '@/components/Checkbox.vue'
  import DirectorySelector from '@/components/DirectorySelector.vue'
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
      ButtonGroup,
    },
  })
  export default class AppDetail extends Vue {
    private app!: IAppInClient
    private id!: string

    constructor() {
      super()
      this.app = {} as IAppInClient
    }

    created(): void {
      this.id = this.$route.params.id
      this.listenEvents()
    }

    listenEvents(): void {
      ipcRenderer.once(IPC_EVENT.APP, (event, data) => {
        this.app = data
      })
      ipcRenderer.send(IPC_EVENT.APP, this.id)
    }

    removeEvents(): void {
      ipcRenderer.removeAllListeners(IPC_EVENT.APP)
    }

    update(): void {
      ipcRenderer.send(IPC_EVENT.UPDATE_APP, {
        id: this.app.id,
        name: this.app.name,
        start_cmd: this.app.start_cmd,
        auto_start: this.app.auto_start,
        hc: this.app.hc,
      })
      this.$router.push('/dashboard')
    }

    back(): void {
      this.$router.push('/dashboard')
    }

    destroyed(): void {
      this.removeEvents()
    }
  }
</script>

<style lang="scss" scoped>
  #app-detail-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section.app-detail-content {
      width: 100%;
      max-width: 500px;

      .dir {
        color: #FFF;
        padding-top: .75rem;
      }

      .checkbox {
        margin-top: .75rem;
      }
    }
  }
</style>

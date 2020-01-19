<template>
  <div id="new-app-wrapper">
    <section>
      <validation-observer v-slot="{ invalid }">
        <form>
          <card>
            <input-label label="Directory">
              <div class="wrapper-dir" v-if="dir">
                <span class="dir" v-text="dir"/>
                <icon-button icon="times" class="dir-clear" @click.native="clearDir"/>
              </div>
              <directory-selector class="directory-selector" @selected-dir="selectedDir" v-else/>
            </input-label>
          </card>

          <card>
            <validation-provider v-slot="{ errors }" rules="required|maxLength:20" tag="div" name="name">
              <input-label label="Name" :error-message="errors[0]">
                <input type="text" v-model="name" maxlength="20"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <validation-provider v-slot="{ errors }" rules="required|maxLength:50" tag="div" name="start command">
              <input-label label="Start Command" :error-message="errors[0]">
                <input type="text" v-model="start_cmd" maxlength="50"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <input-label label="Auto Start">
              <input type="checkbox" v-model="auto_start"/>
            </input-label>
          </card>

          <card>
            <input-label label="Health Check API">
              <input type="checkbox" v-model="hc.active"/>
            </input-label>
          </card>

          <card v-if="hc.active">
            <validation-provider rules="port" v-slot="{ errors }" tag="div" name="port">
              <input-label label="Port" :error-message="errors[0]">
                <input type="number" placeholder="1~65535" v-model="hc.port" :disabled="!hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <card v-if="hc.active">
            <validation-provider rules="path|maxLength:50" v-slot="{ errors }" tag="div" name="path">
              <input-label label="Path" :error-message="errors[0]">
                <input type="text" v-model="hc.path" placeholder="/hc" maxlength="50" :disabled="!hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <card v-if="hc.active">
            <validation-provider rules="interval" v-slot="{ errors }" tag="div" name="interval">
              <input-label label="Interval" :error-message="errors[0]">
                <input type="number" v-model="hc.interval" placeholder="5000~60000 (ms)" :disabled="!hc.active"/>
              </input-label>
            </validation-provider>
          </card>

          <div>
            <button @click="create" :disabled="invalid">Create</button>
            <button @click="cancel">Cancel</button>
          </div>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import { IHealthCheck } from '@/api/interface/health-check.interface'
  import { ISelectDirectory } from '@/api/interface/ipc-service.interface'
  import Card from '@/components/Card.vue'
  import DirectorySelector from '@/components/DirectorySelector.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/input/InputLabel.vue'
  import '@/plugins/vee-validate'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    name: 'NewApp.vue',
    components: {
      InputLabel,
      DirectorySelector,
      Card,
      IconButton,
    },
  })
  export default class NewApp extends Vue {
    dir: string
    name: string
    start_cmd: string
    auto_start: boolean
    hc: IHealthCheck

    constructor() {
      super()

      this.dir = ''
      this.name = ''
      this.start_cmd = ''
      this.auto_start = false
      this.hc = {
        active: false,
        port: 0,
        path: '',
        interval: 5000,
      }
    }

    selectedDir(config: ISelectDirectory): void {
      this.dir = config.dir
      this.name = config.config.name
      this.start_cmd = config.config.start_cmd
      this.auto_start = config.config.auto_start
      this.hc.active = config.config.hc.active
      this.hc.port = config.config.hc.port
      this.hc.path = config.config.hc.path
      this.hc.interval = config.config.hc.interval
    }

    clearDir(): void {
      this.dir = ''
    }

    create(): void {
      // TODO Input Validation
      ipcRenderer.sendSync(IPC_EVENT.CREATE_APP, {
        dir: this.dir,
        name: this.name,
        start_cmd: this.start_cmd,
        auto_start: this.auto_start,
        hc: {
          active: this.hc.active,
          port: this.hc.active ? this.hc.port : undefined,
          path: this.hc.active ? this.hc.path : undefined,
          interval: this.hc.active ? this.hc.interval : undefined,
        },
      })
      this.$router.push('/dashboard')
    }

    cancel(): void {
      this.$router.go(-1)
    }
  }
</script>

<style lang="scss" scoped>
  #new-app-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section {
      width: 100%;
      max-width: 500px;
    }

    .wrapper-dir {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .75rem;

      .dir {
        flex-grow: 9;
        color: #FFF;
      }
    }

    .directory-selector {
      margin-top: .75rem
    }
  }
</style>

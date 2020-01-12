<template>
  <article>
    <section>
      <div>
        <input-label label="Directory">
          <div class="dir" v-if="dir">
            <span>{{ dir }}</span>
            <button @click="clearDir">Clear</button>
          </div>
          <directory-selector @selected-dir="selectedDir" v-else/>
        </input-label>
      </div>

      <div>
        <input-label label="Name">
          <input type="text" v-model="name" maxlength="20"/>
        </input-label>
      </div>

      <div>
        <input-label label="Start Command">
          <input type="text" v-model="start_cmd" maxlength="50"/>
        </input-label>
      </div>

      <div>
        <input-label label="Auto Start">
          <input type="checkbox" v-model="auto_start"/>
        </input-label>
      </div>

      <div>
        <input-label label="Health Check API">
          <input type="checkbox" v-model="hc.active"/>
        </input-label>
      </div>

      <div>
        <input-label label="Port">
          <input type="number" placeholder="0~65535" v-model="hc.port" :disabled="!hc.active"/>
        </input-label>
      </div>

      <div>
        <input-label label="Path">
          <input type="text" v-model="hc.path" placeholder="/hc" maxlength="50" :disabled="!hc.active"/>
        </input-label>
      </div>

      <div>
        <input-label label="Interval">
          <input type="number" v-model="hc.interval" placeholder="5000~60000" :disabled="!hc.active"/>
        </input-label>
      </div>
    </section>

    <section>
      <button @click="create">Create</button>
      <button @click="cancel">Cancel</button>
    </section>
  </article>
</template>

<script lang="ts">
  import { IHealthCheck } from '@/api/interface/health-check.interface'
  import { ISelectDirectory } from '@/api/interface/ipc-service.interface'
  import DirectorySelector from '@/components/DirectorySelector.vue'
  import InputLabel from '@/components/input/InputLabel.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    name: 'NewApp.vue',
    components: {
      InputLabel,
      DirectorySelector,
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
      console.log('# config', config)
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
  .dir {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      flex-grow: 9;
      color: #FFF;
    }
  }
</style>

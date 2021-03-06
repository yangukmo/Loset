<template>
  <div id="new-app-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/dashboard"/>
    </section>

    <section id="title">
      <card :bg="false">
        <h1>Create a new app</h1>
      </card>
    </section>

    <section id="app-detail">
      <validation-observer v-slot="{ invalid }">
        <form @submit="create">
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
            <input-label label="Color">
              <compact-color-picker :value="color" @input="updateColor" class="color-picker"/>
            </input-label>
          </card>

          <card>
            <input-label label="Auto Start">
              <checkbox v-model="auto_start" class="checkbox"/>
            </input-label>
          </card>

          <card class="hidden">
            <input-label label="Health Check API">
              <checkbox v-model="hc.active" class="checkbox" :disabled="true"/>
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

          <button type="submit" class="primary block" @click="create" :disabled="invalid || !dir">Create</button>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import { IHealthCheck } from '@/api/interface/health-check.interface'
  import { ISelectDirectory } from '@/api/interface/ipc-service.interface'
  import Card from '@/components/Card.vue'
  import Checkbox from '@/components/Checkbox.vue'
  import DirectorySelector from '@/components/DirectorySelector.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import '@/plugins/vee-validate'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'
  import { mapGetters } from 'vuex'

  @Component({
    components: {
      InputLabel,
      DirectorySelector,
      Card,
      IconButton,
      Checkbox,
    },
    computed: mapGetters('group', ['groupId', 'groupColor']),
  })
  export default class NewApp extends Vue {
    private dir: string
    private name: string
    private start_cmd: string
    private color!: string
    private auto_start: boolean
    private hc: IHealthCheck
    private groupId!: string
    private groupColor!: string

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

    created(): void {
      this.color = this.groupColor
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
        theme: {
          color: this.color,
        },
        group_id: this.groupId,
      })
      this.$router.push('/dashboard')
    }

    updateColor(color: { hex: string }): void {
      this.color = color.hex
    }
  }
</script>

<style lang="scss" scoped>
  #new-app-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section.close-wrapper {
      position: fixed;
      top: 1rem;
      right: 1rem;

      #btn-close {
        font-size: 20px;
      }
    }

    section:not(.close-wrapper) {
      width: 100%;
      max-width: 500px;
    }

    #title {
      h1 {
        color: #FFF;
        font-weight: 300;
        margin: 0;
        user-select: none;
      }
    }

    #app-detail {
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

      .color-picker, .checkbox, .directory-selector {
        margin-top: .75rem;
      }
    }
  }
</style>

<template>
  <div id="settings-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/apps"/>
    </section>

    <section class="settings-content">
      <h1 class="title no-select">Settings</h1>

      <form>
        <card>
          <input-label label="Auto Start">
            <checkbox v-model="config.auto_start" class="checkbox" :disabled="true"/>
          </input-label>
        </card>

        <card>
          <input-label label="Contact">
            <button type="button" class="block" @click="openGithub">
              <font-awesome-icon :icon="['fab', 'github']" class="icon"/> Go to Github
            </button>
          </input-label>
        </card>

        <card>
          <input-label label="Reset to factory defaults">
            <button type="button" class="block" @click="reset">
              <font-awesome-icon icon="undo" class="icon"/> Reset to factory defaults
            </button>
          </input-label>
        </card>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
  import Card from '@/components/Card.vue'
  import Checkbox from '@/components/Checkbox.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { shell, ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      IconButton,
      Card,
      InputLabel,
      Checkbox,
    },
  })
  export default class Settings extends Vue {
    private config!: any

    constructor() {
      super()
      this.config = {}
    }

    reset(): void {
      ipcRenderer.sendSync(IPC_EVENT.RESET)
    }

    openGithub(): void {
      shell.openExternal('https://github.com/yangukmo/Loset/issues')
    }
  }
</script>

<style lang="scss" scoped>
  #settings-wrapper {
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

    section.settings-content {
      width: 100%;
      max-width: 500px;

      .title {
        color: #FFF;
        font-weight: 300;
      }

      .checkbox, button {
        margin-top: .75rem;
      }

      .icon {
        margin-right: .25rem;
      }
    }
  }
</style>

<template>
  <div id="settings-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/dashboard"/>
    </section>

    <section class="settings-content">
      <form>
        <card>
          <input-label label="Auto Start">
            <checkbox v-model="config.auto_start" class="checkbox" :disabled="true"/>
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

      .checkbox {
        margin-top: .75rem;
      }
    }
  }
</style>

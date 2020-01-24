<template>
  <div id="settings-wrapper">
    <section class="settings-content">
      <form>
        <card>
          <input-label label="Auto Start">
            <input type="checkbox"/>
          </input-label>
        </card>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
  import Card from '@/components/Card.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Card,
      InputLabel,
    },
  })
  export default class Settings extends Vue {
    private config!: any
  }
</script>

<style lang="scss" scoped>
  #settings-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    section.settings-content {
      width: 100%;
      max-width: 500px;
    }
  }
</style>

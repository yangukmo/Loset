<template>
  <div id="new-group-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/dashboard"/>
    </section>

    <section id="title">
      <card :bg="false">
        <h1>Create a new group</h1>
      </card>
    </section>

    <section id="group-detail">
      <validation-observer v-slot="{ invalid }">
        <form @submit="create">
          <card>
            <validation-provider v-slot="{ errors }" rules="required|maxLength:20" tag="div" name="name">
              <input-label label="Name" :error-message="errors[0]">
                <input type="text" v-model="name" maxlength="20"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <input-label label="Color">
              <compact-color-picker :value="color" @input="updateColor" class="color-picker"/>
            </input-label>
          </card>

          <button type="submit" class="primary block" @click="create" :disabled="invalid">Create</button>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import Card from '@/components/Card.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      InputLabel,
      Card,
      IconButton,
    },
  })
  export default class NewGroup extends Vue {
    color: string
    name: string

    constructor() {
      super()
      this.color = '#009CE0'
      this.name = ''
    }

    create(): void {
      ipcRenderer.sendSync(IPC_EVENT.CREATE_GROUP, {
        name: this.name,
        theme: {
          color: this.color,
        },
      })
      this.$router.push('/dashboard')
    }

    updateColor(color: { hex: string }): void {
      this.color = color.hex
    }
  }
</script>

<style lang="scss" scoped>
  #new-group-wrapper {
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

    #group-detail {
      .color-picker {
        margin-top: .75rem;
      }
    }
  }
</style>

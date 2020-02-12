<template>
  <div id="group-detail-wrapper">
    <section class="close-wrapper">
      <icon-button icon="times" id="btn-close" to="/dashboard"/>
    </section>

    <section class="group-detail-content">
      <h1 class="title no-select">Edit the {{ groupName }} group</h1>

      <validation-observer v-slot="{ invalid }">
        <form v-if="group.id" @submit="update">
          <card>
            <validation-provider v-slot="{ errors }" rules="required|maxLength:20" tag="div" name="name">
              <input-label label="Name" :error-message="errors[0]">
                <input type="text" v-model="group.name" maxlength="20"/>
              </input-label>
            </validation-provider>
          </card>

          <card>
            <input-label label="Color">
              <compact-color-picker :value="group.theme.color" @input="updateColor"/>
            </input-label>
          </card>

          <button type="submit" class="primary block" @click="update" :disabled="invalid">Update</button>
        </form>
      </validation-observer>
    </section>
  </div>
</template>

<script lang="ts">
  import { IGroup } from '@/api/interface/group.interface'
  import Card from '@/components/Card.vue'
  import IconButton from '@/components/IconButton.vue'
  import InputLabel from '@/components/InputLabel.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Card,
      InputLabel,
      IconButton,
    },
  })
  export default class GroupDetail extends Vue {
    private group!: IGroup
    private id!: string
    private groupName!: string

    constructor() {
      super()
      this.group = {} as IGroup
      this.groupName = ''
    }

    created(): void {
      this.id = this.$route.params.id
      this.listenEvents()
    }

    listenEvents(): void {
      ipcRenderer.once(IPC_EVENT.GET_GROUP, (event, data) => {
        this.group = data
        this.groupName = this.group.name
      })
      ipcRenderer.send(IPC_EVENT.GET_GROUP, this.id)
    }

    update(): void {
      ipcRenderer.send(IPC_EVENT.UPDATE_GROUP, {
        id: this.group.id,
        name: this.group.name,
        theme: this.group.theme,
      })
      this.$router.push('/dashboard')
    }

    updateColor(color: { hex: string }): void {
      this.group.theme.color = color.hex
    }
  }
</script>

<style lang="scss" scoped>
  #group-detail-wrapper {
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

    section.group-detail-content {
      width: 100%;
      max-width: 500px;
      margin-bottom: 50px;

      .title {
        color: #FFF;
        font-weight: 300;
      }
    }
  }
</style>

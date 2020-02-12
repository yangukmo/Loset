<template>
  <article v-show="isShowGroup" id="group-item-wrapper" :class="{ 'active': isActivated }">
    <section class="name" @click="onClickGroup">
      <span class="title">{{ group.name }}</span>
      <span class="status">{{ appCount }} apps</span>
    </section>
    <section class="control">
      <icon-button icon="edit" :to="'/groups/' + group.id"/>
      <icon-button icon="trash" @click.native="deleteGroup"/>
    </section>
  </article>
</template>

<script lang="ts">
  import { IGroup } from '@/api/interface/group.interface'
  import GroupDropdownMenu from '@/components/GroupDropdownMenu.vue'
  import IconButton from '@/components/IconButton.vue'
  import { IPC_EVENT } from '@/shared/enum'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { mapActions, mapGetters } from 'vuex'
  import { ipcRenderer } from 'electron'

  @Component({
    components: {
      GroupDropdownMenu,
      IconButton,
    },
    methods: mapActions('group', ['setGroupId']),
    computed: {
      ...mapGetters('group', ['groupId']),
      ...mapGetters('searchGroup', ['getKeyword']),
    },
  })
  export default class GroupItem extends Vue {
    @Prop({ default: {}, required: true, type: Object }) group!: IGroup
    private setGroupId!: any
    private getKeyword!: string
    private groupId!: string

    get isShowGroup(): boolean {
      return this.getKeyword ? this.group.name.toUpperCase().includes(this.getKeyword.toUpperCase()) : true
    }

    get isActivated(): boolean {
      return this.groupId === this.group.id
    }

    get appCount(): number {
      return this.group.apps?.length || 0
    }

    onClickGroup(): void {
      this.setGroupId(this.group.id)
    }

    deleteGroup(): void {
      ipcRenderer.send(IPC_EVENT.DELETE_GROUP, this.group.id)
    }
  }
</script>

<style lang="scss" scoped>
  #group-item-wrapper {
    color: #AAA;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem .75rem;
    border-radius: .25rem;

    &:hover .control {
      visibility: visible;
    }

    &.active {
      background-color: rgba(14, 84, 105, 0.2)
    }

    .control {
      visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      button {
        font-size: 12px;
      }
    }

    .name {
      user-select: none;
      display: flex;
      flex-direction: column;

      .title {
        width: 135px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #FFF;
        font-size: 14px;
        margin-bottom: .25rem;
      }

      .status {
        color: #AAA;
        font-size: 12px;
      }
    }
  }
</style>

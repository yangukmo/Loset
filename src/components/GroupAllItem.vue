<template>
  <article id="group-all-item-wrapper" :class="{ 'active': isActive }" @click="onClickGroup">
    <section class="name">
      <span class="title">All</span>
    </section>
  </article>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    methods: {
      ...mapActions('app', ['getApps']),
      ...mapActions('group', ['setGroupId']),
    },
    computed: mapGetters('group', ['groupId']),
  })
  export default class GroupAllItem extends Vue {
    private setGroupId!: any
    private groupId!: string

    get isActive(): boolean {
      return !this.groupId
    }

    onClickGroup(): void {
      this.setGroupId('')
    }
  }
</script>

<style lang="scss" scoped>
  #group-all-item-wrapper {
    display: flex;
    align-items: center;
    color: #AAA;
    padding: .5rem .75rem;
    border-radius: .25rem;
    height: 30px;

    .name {
      user-select: none;

      .title {
        color: #FFF;
        font-size: 16px;
      }
    }


    &.active {
      background-color: rgba(14, 84, 105, 0.2)
    }
  }
</style>

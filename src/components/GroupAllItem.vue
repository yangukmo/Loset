<template>
  <article id="group-all-item-wrapper" :class="{ 'active': isActive }" @click="onClickGroup">
    <section class="name">
      <span>All</span>
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
    color: #AAA;

    .name {
      user-select: none;
      height: 30px;
      display: flex;
      align-items: center;
    }

    &.active .name {
      color: #FFF;
    }
  }
</style>

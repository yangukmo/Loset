<template>
  <div class="box" :class="computedClass">
    <span>{{ computedMsg }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Status extends Vue {
    @Prop({ default: false, required: true, type: Boolean }) active!: boolean

    get computedMsg(): string {
      return this.active ? 'ENABLE' : 'DISABLE'
    }

    get computedClass(): string {
      return this.active ? 'enable' : 'disable'
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    border-radius: .25rem;
    font-size: 12px;
    font-weight: 600;
    padding: .25rem .5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    &.enable {
      color: $green;
    }

    &.disable {
      color: $red;
    }
  }
</style>

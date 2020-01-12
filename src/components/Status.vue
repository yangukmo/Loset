<template>
  <div class="box" :class="computedClass">
    <icon :icon="computedActive" class="icon"/>
    <span>{{ computedMsg }}</span>
  </div>
</template>

<script lang="ts">
  import Icon from '@/components/Icon.vue'
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component({
    components: {
      Icon,
    },
  })
  export default class Status extends Vue {
    @Prop({
      default: false,
      required: true,
      type: Boolean,
    }) active!: boolean

    get computedActive(): string {
      return this.active ? 'check_circle' : 'error'
    }

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

    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
</style>

<template>
  <div class="group-wrapper">
    <slot/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class ButtonGroup extends Vue {

  }
</script>

<style lang="scss" scoped>
  .group-wrapper {
    button {
      border-radius: 0;

      &:first-child {
        border-top-left-radius: .25rem;
        border-bottom-left-radius: .25rem;
      }

      &:last-child {
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
      }
    }
  }
</style>

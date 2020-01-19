<template>
  <header>
    <span>{{ title }}</span>
  </header>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TopTitlebar extends Vue {
    @Prop({ type: String, required: true, default: '' }) title!: string
  }
</script>

<style lang="scss" scoped>
  header {
    background-color: rgba(0, 0, 0, .2);
    padding: 1rem;
    color: #FFF;
  }
</style>

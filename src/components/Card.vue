<template>
  <article class="card" :class="{ 'bg': bg, 'no-margin': !margin, 'no-padding': !padding }">
    <slot/>
  </article>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Card extends Vue {
    @Prop({ type: Boolean, required: false, default: true }) bg!: boolean
    @Prop({ type: Boolean, required: false, default: true }) margin!: boolean
    @Prop({ type: Boolean, required: false, default: true }) padding!: boolean
  }
</script>

<style lang="scss" scoped>
  .card {
    border-radius: .25rem;
    padding: .65rem 1rem;
    margin-bottom: .75rem;

    &.bg {
      background-color: rgba(14, 84, 105, 0.2);
    }

    &.no-margin {
      margin-bottom: 0;
    }

    &.no-padding {
      padding: 0;
    }
  }
</style>

<template>
  <article class="card" :class="{ 'bg': bg }">
    <slot/>
  </article>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Card extends Vue {
    @Prop({ type: Boolean, required: false, default: true }) bg!: boolean
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
  }
</style>

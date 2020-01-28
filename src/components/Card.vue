<template>
  <article class="card">
    <slot/>
  </article>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class Card extends Vue {
  }
</script>

<style lang="scss" scoped>
  .card {
    background-color: rgba(14, 84, 105, 0.2);
    border-radius: .25rem;
    padding: .65rem;
    margin-bottom: .75rem;
  }
</style>

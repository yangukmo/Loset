<template>
  <article class="card">
    <header v-if="hasHeader">
      <h3 class="title" v-if="title">{{ title }}</h3>
      <div class="right">
        <slot name="header-right"/>
      </div>
    </header>
    <section>
      <slot name="content"/>
    </section>
  </article>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Card extends Vue {
    @Prop() title!: string

    get hasHeader(): boolean {
      return !!(this.title || this.$slots['header-right'])
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: .25rem;
    padding: 1rem;

    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .title {
        margin: 0;
        font-weight: 300;
        padding-bottom: 15px;
        color: #DDD;
      }
    }
  }
</style>

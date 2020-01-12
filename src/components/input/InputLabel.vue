<template>
  <section>
    <label v-if="label">{{ label }}</label>
    <slot/>
  </section>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class InputLabel extends Vue {
    @Prop({ type: String, required: false, default: '' }) label!: string
  }
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    label {
      color: #FFF;
      font-size: .75rem;
      margin-bottom: 5px;
      font-weight: 600;
      user-select: none;
    }
  }
</style>

<template>
  <section :class="{ 'has-error': errorMessage }">
    <label v-if="label">{{ label }}</label>
    <slot/>
    <span class="error-message" v-if="errorMessage" v-text="errorMessage"/>
  </section>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class InputLabel extends Vue {
    @Prop({ type: String, required: false, default: '' }) label!: string
    @Prop({ type: String, required: false, default: '' }) errorMessage!: string
  }
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: column;
    /*margin-bottom: 15px;*/

    label {
      color: #FFF;
      font-size: .75rem;
      margin-bottom: 5px;
      font-weight: 600;
      user-select: none;
    }

    .error-message {
      margin-top: .25rem;
      color: $red;
      font-size: 14px;
    }

    &.has-error {
      input {
        border-color: $red;
      }
    }
  }
</style>

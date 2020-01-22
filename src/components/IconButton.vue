<template>
  <router-link tag="button" :to="to" class="icon-button" :class="{ 'no-bg': !bg }" :disabled="disabled">
    <font-awesome-icon :icon="icon" class="icon"/>
  </router-link>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class IconButton extends Vue {
    @Prop({ type: String, required: true, default: '' }) icon!: string
    @Prop({ type: String, required: false, default: '' }) to!: string
    @Prop({ type: Boolean, required: false, default: false }) bg!: boolean
    @Prop({ type: Boolean, required: false, default: false }) disabled!: boolean
  }
</script>

<style lang="scss" scoped>
  .icon-button {
    padding: .5rem;
    width: 30px;
    height: 30px;
    /*cursor: pointer;*/

    &.no-bg {
      background-color: transparent;
      color: #AAA;

      &:hover > * {
        color: #FFF;
      }

      &:disabled {
        color: #777;

        &:hover {
          color: #777;
        }
      }
    }
  }
</style>

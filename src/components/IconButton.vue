<template>
  <router-link tag="button" :to="to" class="icon-button" :class="{ 'no-bg': !bg }" :disabled="disabled">
    <font-awesome-icon :icon="icon" class="icon"/>
    <span class="content" v-if="content">{{ content }}</span>
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
    @Prop({ type: String, required: false, default: '' }) content!: string
  }
</script>

<style lang="scss" scoped>
  $disabledColor: #666;

  .icon-button {
    padding: .5rem;
    width: auto;
    height: 30px;
    display: flex;
    flex-direction: row;

    &.no-bg {
      background-color: transparent;
      color: #AAA;

      &:enabled:hover > * {
        color: #FFF;
      }

      &:disabled {
        color: $disabledColor;

        &:hover {
          color: $disabledColor;
        }
      }
    }

    .content {
      margin-left: 10px;
    }
  }
</style>

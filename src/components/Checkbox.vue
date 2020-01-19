<template>
  <div id="checkbox-wrapper">
    <button class="enable">{{ enableName }}</button>
    <button class="disable">{{ disableName }}</button>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Checkbox extends Vue {
    @Prop({ type: String, required: true, default: 'ENABLE' }) enableName!: string
    @Prop({ type: String, required: true, default: 'DISABLE' }) disableName!: string
  }
</script>

<style lang="scss" scoped>
  #checkbox-wrapper {

  }
</style>

<template>
  <div id="checkbox-wrapper">
    <button-group>
      <button type="button" class="enable" :class="{ 'active': value }" @click="toggle">{{ truthy }}</button>
      <button type="button" class="disable" :class="{ 'active': !value }" @click="toggle">{{ falsy }}</button>
    </button-group>
  </div>
</template>

<script lang="ts">
  import ButtonGroup from '@/components/ButtonGroup.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      ButtonGroup,
    }
  })
  export default class Checkbox extends Vue {
    @Prop({ type: String, required: false, default: 'ENABLE' }) truthy!: string
    @Prop({ type: String, required: false, default: 'DISABLE' }) falsy!: string
    @Prop({ type: Boolean, required: true, default: false }) value!: boolean

    constructor() {
      super()
    }

    private toggle(): void {
      this.$emit('input', !this.value)
    }
  }
</script>

<style lang="scss" scoped>
  #checkbox-wrapper {
    .hidden {
      display: none;
    }
  }
</style>

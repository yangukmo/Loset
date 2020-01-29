<template>
  <div id="checkbox-wrapper">
    <button-group>
      <button type="button" class="enable" :class="{ 'active': value }" @click="toggle" :disabled="disabled">{{ truthy }}</button>
      <button type="button" class="disable" :class="{ 'active': !value }" @click="toggle" :disabled="disabled">{{ falsy }}</button>
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
    @Prop({ type: Boolean, required: false, default: false }) disabled!: boolean

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
    button {
      font-size: 12px;

      &:enabled.disable {
        &.active, &:hover {
          background-color: rgba(140, 140, 140, .7);
          color: #FFF;
        }
      }
    }
  }
</style>

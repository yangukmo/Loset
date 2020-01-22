<template>
  <font-awesome-icon :icon="icon" class="icon"/>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Icon extends Vue {
    @Prop() icon!: string
  }
</script>

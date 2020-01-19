<template>
  <i class="material-icons">{{ icon }}</i>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Icon extends Vue {
    @Prop() icon!: string
  }
</script>

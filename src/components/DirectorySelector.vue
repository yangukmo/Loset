<template>
  <button type="button" @click="openDirectory">Choose a directory</button>
</template>

<script lang="ts">
  import { IPC_EVENT } from '@/shared/enum'
  import { ipcRenderer } from 'electron'
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'

  @Component
  export default class DirectorySelector extends Vue {
    openDirectory(): void {
      this.$emit('selected-dir', ipcRenderer.sendSync(IPC_EVENT.SELECT_DIRECTORY))
    }
  }
</script>

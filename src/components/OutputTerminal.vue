<template>
  <article>
    <section>
      <div id="terminal"></div>
    </section>
  </article>
</template>

<script lang="ts">
  import { EventBus } from '@/shared/EventBus'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import { SearchAddon } from 'xterm-addon-search'

  @Component
  export default class OutputTerminal extends Vue {
    @Prop({ required: true, type: String }) id!: string
    private terminal!: Terminal
    private eventBusOutputName!: string
    private eventBusDeleteOutputName!: string

    created(): void {
      this.eventBusOutputName = `output:${this.id}`
      this.eventBusDeleteOutputName = `delete-output:${this.id}`
    }

    mounted(): void {
      this.terminal = new Terminal({ cursorBlink: true })
      const fitAddon: FitAddon = new FitAddon()
      const searchAddon: SearchAddon = new SearchAddon()
      this.terminal.loadAddon(searchAddon)
      this.terminal.loadAddon(fitAddon)
      this.terminal.setOption('fontSize', 12)
      this.terminal.open(document.getElementById('terminal') as HTMLElement)
      fitAddon.fit()

      EventBus.$on(this.eventBusOutputName, (data: Buffer) => {
        this.terminal.writeln(data)
      })

      EventBus.$on(this.eventBusDeleteOutputName, () => {
        this.terminal.clear()
      })

      window.addEventListener('resize', () => fitAddon.fit())
    }

    destroyed(): void {
      EventBus.$off(this.eventBusOutputName)
      EventBus.$off(this.eventBusDeleteOutputName)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~xterm/css/xterm.css';

  article, section {
    height: 100%;

    #terminal {
      height: 100% !important;

      .xterm,
      .xterm-viewport,
      .xterm-link-layer,
      .xterm-cursor-layer {
        height: 100% !important;
      }
    }
  }
</style>

<template>
  <div>
    <input id="keyword" type="text" :placeholder="placeholder" :value="getKeyword" @input="inputKeyword"
           :disabled="disabled"/>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    methods: mapActions('searchApp', ['setKeyword']),
    computed: mapGetters('searchApp', ['getKeyword']),
  })
  export default class SearchApp extends Vue {
    @Prop({ type: Boolean, required: false, default: false }) disabled!: boolean
    private setKeyword!: (keyword: string) => void
    private placeholder!: string

    constructor() {
      super()
      this.placeholder = ''
    }

    @Watch('disabled', { immediate: true })
    onChangeDisabled(): void {
      this.changePlaceholder()
    }

    inputKeyword(e: any): void {
      this.setKeyword(e.target.value)
    }

    private changePlaceholder(): void {
      if (this.disabled) {
        this.placeholder = 'Please register a new App.'
      } else {
        this.placeholder = 'Search App...'
      }
    }
  }
</script>

<style lang="scss" scoped>
  div, #keyword {
    width: 100%;
  }
</style>

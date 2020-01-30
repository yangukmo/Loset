<template>
  <article>
    <section class="input-wrapper">
      <input id="keyword" type="text" :placeholder="placeholder" :value="getKeyword" @input="inputKeyword"
             :disabled="disabled"/>
    </section>

    <section class="clear-wrapper" v-show="getKeyword">
      <icon-button icon="times" id="btn-clear" @click.native="clear"/>
    </section>
  </article>
</template>

<script lang="ts">
  import IconButton from '@/components/IconButton.vue'
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    components: { IconButton },
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

    clear(): void {
      this.setKeyword('')
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
  article {
    width: 100%;
    position: relative;

    .clear-wrapper {
      position: absolute;
      right: 0;
      top: 5px;

      #btn-clear {
        font-size: 16px;
      }
    }
  }
</style>

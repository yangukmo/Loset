<template>
  <div>
    <input id="keyword" type="text" placeholder="Search App..." :value="getKeyword" @input="inputKeyword"/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    methods: mapActions('searchApp', ['setKeyword']),
    computed: mapGetters('searchApp', ['getKeyword']),
  })
  export default class SearchApp extends Vue {
    private setKeyword!: any

    inputKeyword(e: any): void {
      this.setKeyword(e.target.value)
    }
  }
</script>

<style lang="scss" scoped>
  div, #keyword {
    width: 100%;
  }
</style>

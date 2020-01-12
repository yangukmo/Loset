<template>
  <article>
    <section id="info">
      <span class="name">{{ app.name }}</span>
      <status :active="app.active"/>
      <div>
        <button>Start</button>
        <button>Output</button>
        <dropdown title="ETC" :items="dropdownItems"/>
      </div>
    </section>
    <section id="detail">
      <p style="color: #FFF; font-size: 14px">{{ app }}</p>
    </section>

  </article>
</template>

<script lang="ts">
  import { IAppInClient } from '@/api/interface/app.interface'
  import Dropdown from '@/components/Dropdown.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import Status from './Status.vue';

  @Component({
    components: {
      Dropdown,
      Status,
    }
  })
  export default class AppItem extends Vue {
    @Prop({ default: {}, required: true, type: Object }) app!: IAppInClient
    private readonly dropdownItems: { name: string }[]

    constructor() {
      super()
      this.dropdownItems = [
        { name: 'Delete' },
        { name: 'Settings' },
      ]
    }
  }
</script>

<style lang="scss" scoped>
  article {
    padding: .5rem;
    color: #FFF;

    #info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>

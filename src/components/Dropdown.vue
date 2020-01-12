<template>
  <div class="area-dropdown" :class="computedClass">
    <button @click="toggle">{{ title }}</button>
    <ul v-show="isShow">
      <li v-for="item of items" :key="item.name">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Dropdown extends Vue {
    @Prop({ required: true, type: String, default: '' }) title!: string
    @Prop({ required: true, type: Array, default: [] }) items!: { name: string }[]
    private isShow: boolean

    constructor() {
      super()
      this.isShow = false
    }

    created(): void {
      let a = 0
      const self = this
      window.addEventListener('click', (e: any) => {
        if (!self.$el.contains(e.target)) {
          self.isShow = false
        }
      })
    }

    get computedClass(): string {
      return this.isShow ? 'active' : ''
    }

    toggle(): void {
      this.isShow = !this.isShow
    }

    destroyed(): void {
      window.removeEventListener('click', () => {
      })
    }
  }
</script>

<style lang="scss" scoped>
  .area-dropdown {
    position: relative;
    display: inline-block;
    cursor: pointer;

    &.active {
      button {
        background-color: #FFF;
      }
    }

    ul {
      position: absolute;
      top: 2.2rem;
      right: 0;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        padding: .5rem 1rem;
        background-color: #DDD;
        color: #000;
        transition: background-color 300ms;

        &:hover {
          background-color: #FFF;
        }
      }
    }
  }
</style>

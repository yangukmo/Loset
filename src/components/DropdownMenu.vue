<template>
  <section class="dropdown-menu-wrapper">
    <div style="position: relative;">
      <icon-button icon="ellipsis-v" @click.native="toggle"/>

      <transition name="fade" mode="out-in">
        <ul class="dropdown-menu" v-if="isOpen">
          <li class="item">
            <icon-button icon="folder-open" content="Directory" @click.native="onClickButton('open-directory')"/>
          </li>
          <li class="item">
            <icon-button icon="terminal" content="Terminal" @click.native="onClickButton('open-terminal')"/>
          </li>
          <li class="item">
            <icon-button icon="trash" content="Delete" @click.native="onClickButton('delete-app')"/>
          </li>
        </ul>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">
  import IconButton from '@/components/IconButton.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: { IconButton },
  })
  export default class DropdownMenu extends Vue {
    private isOpen!: boolean

    constructor() {
      super()

      this.isOpen = false
    }

    toggle(): void {
      this.isOpen = !this.isOpen
    }

    onClickButton(event: string): void {
      this.$emit(event)
    }
  }
</script>

<style lang="scss" scoped>
  .dropdown-menu-wrapper {
    .dropdown-menu {
      position: absolute;
      z-index: 100;
      background-color: rgba(9, 61, 76, 0.7);
      list-style: none;
      padding: 0;
      margin: 0;
      right: 0;
      top: 40px;
      min-width: 100px;
      border-radius: .25rem;

      .item {
        padding: .25rem 1rem;
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>

<template>
  <section class="dropdown-menu-wrapper">
    <div class="dropdown-menu-area" ref="dropdown">
      <icon-button icon="ellipsis-v" @click.native="toggle"/>

      <transition name="fade" mode="out-in">
        <ul class="dropdown-menu" v-if="isOpen" ref="menu">
          <li class="item" ref="item">
            <icon-button icon="folder-open" content="Directory" @click.native="onClickButton('open-directory')"/>
          </li>
          <li class="item" ref="item">
            <icon-button icon="terminal" content="Logs" @click.native="onClickButton('open-terminal')"/>
          </li>
          <li class="item" ref="item">
            <icon-button icon="edit" content="Edit" :to="'/dashboard/apps/' + id"/>
          </li>
          <li class="item" ref="item">
            <icon-button icon="trash" content="Delete" @click.native="onClickButton('delete-app')"/>
          </li>
        </ul>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">
  import IconButton from '@/components/IconButton.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: { IconButton },
  })
  export default class DropdownMenu extends Vue {
    @Prop({ type: String, required: true }) id!: string
    private isOpen!: boolean

    constructor() {
      super()

      this.isOpen = false
    }

    toggle(): void {
      this.isOpen = !this.isOpen

      if (this.isOpen) {
        document.addEventListener('click', this.onClickOutside)
      } else {
        document.removeEventListener('click', this.onClickOutside)
      }
    }

    onClickButton(event: string): void {
      this.$emit(event)
      this.toggle()
    }

    private onClickOutside(event: Event): void {
      const dropdown: any = this.$refs.dropdown
      if (!dropdown || dropdown.contains(event.target)) return
      this.toggle()
    }
  }
</script>

<style lang="scss" scoped>
  .dropdown-menu-wrapper {
    .dropdown-menu-area {
      position: relative;

      .dropdown-menu {
        background-color: #113650;
        position: absolute;
        z-index: 100;
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
  }
</style>

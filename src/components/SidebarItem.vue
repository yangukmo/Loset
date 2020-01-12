<template>
  <router-link tag="li" :to="to">
    <icon :icon="icon"/>
    <span class="name">{{ name }}</span>
  </router-link>
</template>

<script lang="ts">
  import Icon from '@/components/Icon.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Icon,
    }
  })
  export default class SidebarItem extends Vue {
    @Prop() icon!: string
    @Prop() name!: string
    @Prop() to!: string
  }
</script>

<style lang="scss" scoped>
  li {
    padding: .5rem 1rem;
    color: #999;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 15px;
    user-select: none;

    i {
      margin-right: 5px;
      cursor: pointer;
      font-size: 16px;
    }

    .name {
      cursor: pointer;
    }

    &.active {
      color: #FFF;
    }
  }
</style>

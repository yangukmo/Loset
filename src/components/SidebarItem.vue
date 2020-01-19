<template>
  <router-link tag="li" :to="to">
    <font-awesome-icon :icon="icon" class="icon"/>
    <!--    <span class="name">{{ name }}</span>-->
  </router-link>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class SidebarItem extends Vue {
    @Prop({ type: String, required: true, default: '' }) icon!: string
    @Prop({ type: String, required: true, default: '' }) name!: string
    @Prop({ type: String, required: false, default: '' }) to!: string
  }
</script>

<style lang="scss" scoped>
  li {
    padding: .5rem 1rem;
    color: #999;
    display: flex;
    align-items: center;
    line-height: 15px;
    user-select: none;

    .icon {
      cursor: pointer;
    }

    .name {
      cursor: pointer;
    }

    &.active {
      color: #FFF;

      .name {
        font-weight: 600;
      }
    }
  }
</style>

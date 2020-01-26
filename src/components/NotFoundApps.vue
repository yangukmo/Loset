<template>
  <card id="not-found-apps-wrapper">
    <font-awesome-icon icon="exclamation" class="icon"/>
    <span>Cannot find the Apps</span>
  </card>
</template>

<script lang="ts">
  import Card from '@/components/Card.vue'
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {
      Card
    },
  })
  export default class NotFoundApps extends Vue {
  }
</script>

<style lang="scss" scoped>
  #not-found-apps-wrapper {
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 1rem;

    .icon {
      font-size: 30px;
      margin-bottom: .75rem;
    }
  }
</style>

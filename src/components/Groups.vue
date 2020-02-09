<template>
  <div id="groups-wrapper">
    <section id="control">
      <icon-button icon="plus" to="/groups/new"/>
      <icon-button icon="cog" to="/settings"/>
    </section>

    <section id="search-group">
      <group-search-box :disabled="isEmptyGroups"/>
    </section>

    <section id="content">
      <ul>
        <li>
          <group-all-item/>
        </li>
        <li v-for="group of groups" :key="group.id">
          <group-item :group="group"/>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
  import { IGroup } from '@/api/interface/group.interface'
  import Card from '@/components/Card.vue'
  import GroupAllItem from '@/components/GroupAllItem.vue'
  import GroupItem from '@/components/GroupItem.vue'
  import GroupSearchBox from '@/components/GroupSearchBox.vue'
  import IconButton from '@/components/IconButton.vue'
  import { Component, Vue } from 'vue-property-decorator'
  import Draggable from 'vuedraggable'
  import { mapActions, mapGetters } from 'vuex'

  @Component({
    components: {
      GroupAllItem,
      GroupSearchBox,
      GroupItem,
      Card,
      IconButton,
      Draggable,
    },
    methods: mapActions('group', ['getGroups']),
    computed: mapGetters('group', ['groups']),
  })
  export default class Groups extends Vue {
    private getGroups!: any
    private groups!: IGroup[]
    private isLoading!: boolean

    constructor() {
      super()
      this.isLoading = false
    }

    get isEmptyGroups(): boolean {
      return !this.groups.length && !this.isLoading
    }

    created(): void {
      this.isLoading = true
      this.getGroups()
    }
  }
</script>

<style lang="scss" scoped>
  #groups-wrapper {
    display: grid;
    grid-template-areas: "new-group" "search-group" "content";
    grid-template-rows: 30px 50px 1fr;
    height: 100%;
    position: relative;

    #search-group {
      grid-area: search-group;
    }

    #content {
      grid-area: content;
      margin-bottom: 3rem;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        color: #FFF;

        li {
          padding: .25rem .5rem;

          &.active {
            background-color: rgba(14, 84, 105, 0.2);
          }
        }
      }
    }

    #control {
      grid-area: new-group;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>

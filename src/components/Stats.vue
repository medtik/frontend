<template>
  <v-container fluid fill-height>
    <v-layout align-content-space-between align-center column>
      <v-layout row style="flex-grow: 0">
        <v-list dense subheader v-for="(group, index) in stats.groups" dark class="list" :key="group.label+index">
          <v-subheader class="text" dark>{{group.label}}</v-subheader>
          <v-list-tile
            :key="item.label+index"
            v-for="item in group.items"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{item.label}}: {{item.count}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-layout>

      <v-spacer></v-spacer>

      <div>
        <v-progress-circular
          color="white"
          :rotate="-90"
          :size="100"
          :width="15"
          :value="stats.db"
        >
          db
        </v-progress-circular>

        <v-progress-circular
          color="white"
          :rotate="-90"
          :size="100"
          :width="15"
          :value="stats.cache"
        >
          cache
        </v-progress-circular>
      </div>
      <v-list dense dark class="list">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              Frontend: {{version}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              Backend: {{stats.version}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { Action, Getter } from 'vuex-class';
  import {StatsModel} from "../store/models/stats.model";

  @Component
  export default class Stats extends Vue {
    @Getter('version') public version: string;
    @Getter('stats') public stats: StatsModel;
    @Action('getStats') private getStats: any;

    public mounted(): void {
      this.getStats();
    }
  }
</script>

<style lang="scss" scoped>
  .v-progress-circular {
    margin: 10px;
  }

  .list {
    background: #424242;
  }
</style>
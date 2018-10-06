<template>
  <v-container fluid fill-height>
    <v-layout align-content-space-between align-center column>
      <v-layout row style="flex-grow: 0">
        <v-list dense subheader v-for="(group, index) in status.groups" dark class="black" :key="group.label+index">
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

      <div class="version">
        <div>
          <div class="caption white--text text-xs-center">Database</div>
          <v-progress-circular
            color="white"
            :rotate="-90"
            :size="100"
            :width="15"
            :value="status.database.usage"
          >
            {{numeric(status.database.current)}} <br>/<br> {{numeric(status.database.max)}}
          </v-progress-circular>
        </div>

        <div>
          <div class="caption white--text text-xs-center">Cache</div>
          <v-progress-circular
            color="white"
            :rotate="-90"
            :size="100"
            :width="15"
            :value="status.cache.usage"
          >
            {{numeric(status.cache.current)}} <br>/<br> {{numeric(status.cache.max)}}
          </v-progress-circular>
        </div>
      </div>
      <div class="version">
        <div class="caption white--text">
          Frontend: {{version}}
        </div>
        <div class="caption white--text">
          Backend: {{status.version}}
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { Action, Getter } from 'vuex-class';
  import {StatusModel} from "../store/models/status.model";

  @Component({
    name: 'Status',
    filters: {
      numeric(value: any) {
        return 'Hello filter'
      }
    }
  })
  export default class Status extends Vue {
    @Getter('version') public version: string;
    @Getter('status') public status: StatusModel;
    @Action('getStatus') private getStatus: any;

    public numeric(value: number = 0): string {
      if (value < 1000) {
        return value+'';
      } else if (value < 1000000) {
        return Math.round(value / 1000) + 'k';
      } else {
        return Math.round(value / 1000000) + 'm';
      }
    }

    public mounted(): void {
      this.getStatus();
    }
  }
</script>

<style scoped>
  .v-progress-circular {
    margin: 10px;
  }

  .black {
    background: #424242;
  }

  .version {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%;
  }

  .version >>> .v-progress-circular__info {
    font-size: 12px;
    text-align: center;
  }
</style>